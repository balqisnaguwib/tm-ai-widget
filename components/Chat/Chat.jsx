// components/Chat/Chat.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage } from '../../utils/api';
import { 
  formatMessage, 
  parseOptions, 
  extractMessageFromResponse, 
  hasValidMessage,
  containsImageUrl,
  extractImageUrl
} from '../../utils/messageUtils';
import styles from './Chat.module.css';

// Enable or disable debug logs
const DEBUG = process.env.NODE_ENV === 'development';

/**
 * Log function that only logs in development mode
 */
const debugLog = (...args) => {
  if (DEBUG) {
    console.log(...args);
  }
};

const Chat = ({ tmId, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [userLevel, setUserLevel] = useState('');
  const [userScore, setUserScore] = useState('');
  const [competencyStatus, setCompetencyStatus] = useState('');
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Initial message when chat opens
  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true);
      try {
        // Initial empty message to get the first question or welcome message
        const response = await sendChatMessage(tmId, '', answers);
        
        // Clear any existing messages first to avoid duplicates
        setMessages([]);
        
        if (response && response.competency_status === 'in progress') {
          // We're in the survey flow
          setCompetencyStatus('in progress');
          // Add a single message
          if (response.message) {
            addBotMessage(response.message);
          }
        } else if (response && response.competency_status === 'complete') {
          // User has already completed the survey
          setCompetencyStatus('complete');
          if (response.level) setUserLevel(response.level);
          if (response.score) setUserScore(response.score);
          if (hasValidMessage(response)) {
            addBotMessage(extractMessageFromResponse(response));
          }
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        addBotMessage('Sorry, there was an error connecting to the chat service. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only initialize on mount or when tmId changes, not when answers change
    if (answers.length === 0) {
      initializeChat();
    }
  }, [tmId]); // Remove answers dependency
  
  const addUserMessage = (text) => {
    try {
      // Use the utility to ensure text is a string
      const messageText = formatMessage(text);
      
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: messageText, 
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      console.error('Error adding user message:', error);
    }
  };
  
  const addBotMessage = (text) => {
    try {
      // Use the utility to ensure text is a string
      const messageText = formatMessage(text);
      debugLog('Adding bot message:', messageText);
      
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: messageText, 
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      console.error('Error adding bot message:', error);
      // Add a fallback message to not break the UI
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: 'Error displaying message', 
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userText = inputValue.trim();
    setInputValue('');
    addUserMessage(userText);
    setIsLoading(true);
    
    try {
      // If in competency test, check if this is an answer to a question
      let updatedAnswers = [...answers];
      
      if (competencyStatus === 'in progress') {
        // We're in the survey flow, treat input as an answer
        updatedAnswers.push(userText);
        setAnswers(updatedAnswers);
      }
      
      const response = await sendChatMessage(tmId, userText, updatedAnswers);
      
      debugLog('API response processed:', response);
      
      // Update state based on response
      if (response && response.competency_status === 'complete' && competencyStatus === 'in progress') {
        // User just completed the survey
        setCompetencyStatus('complete');
        if (response.level) setUserLevel(response.level);
        if (response.score) setUserScore(response.score);
        
        // When completing the competency test, only display the congratulations message
        // which already contains the competency level and score
        if (hasValidMessage(response)) {
          const messageContent = extractMessageFromResponse(response);
          addBotMessage(messageContent);
        }
      } else if (response && response.competency_status === 'in progress') {
        setCompetencyStatus('in progress');
        
        // Add message from the response
        if (hasValidMessage(response)) {
          const messageContent = extractMessageFromResponse(response);
          addBotMessage(messageContent);
        }
      } else {
        // Normal conversation flow, not part of competency test
        if (hasValidMessage(response)) {
          const messageContent = extractMessageFromResponse(response);
          addBotMessage(messageContent);
        } else if (response) {
          debugLog('No message found in response');
          addBotMessage('Response received but no message found.');
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addBotMessage('Sorry, there was an error processing your message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle option selection for multiple choice questions
  const handleOptionSelect = (option) => {
    try {
      // Check if option is valid
      if (!option || typeof option !== 'string') {
        console.error('Invalid option:', option);
        return;
      }
      
      // Extract the option letter (A, B, C, D)
      const optionLetter = option.split('.')[0].trim().toLowerCase();
      setInputValue(optionLetter);
      
      // Auto-submit the form when an option is selected
      setTimeout(() => {
        const sendButton = document.querySelector(`.${styles.sendButton}`);
        if (sendButton) {
          sendButton.click();
        }
      }, 100);
    } catch (error) {
      console.error('Error selecting option:', error);
    }
  };
  
  return (
    <motion.div 
      className={styles.chatContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderLeft}>
          <div className={styles.logo}>TM</div>
          <div className={styles.headerInfo}>
            <h3>TM AI Day Assistant</h3>
            {userLevel && (
              <span className={styles.userLevel}>
                Level: {userLevel} {userScore && `(Score: ${userScore})`}
              </span>
            )}
          </div>
        </div>
        <button 
          className={styles.logoutButton} 
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
      
      <div className={styles.messagesContainer}>
        <AnimatePresence>
          {messages.map((message) => {
            // Skip rendering invalid messages
            if (!message || typeof message !== 'object') {
              return null;
            }
            
            let options = [];
            try {
              options = message.sender === 'bot' ? parseOptions(message.text) : [];
            } catch (error) {
              console.error('Error parsing options:', error);
            }
            
            const shouldShowOptions = competencyStatus === 'in progress' && options.length > 0;
            
            return (
              <motion.div
                key={message.id || Date.now() + Math.random()}
                className={`${styles.messageWrapper} ${
                  message.sender === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className={`${styles.message} ${
                    message.sender === 'user' ? styles.userMessage : styles.botMessage
                  }`}
                >
                  <div className={styles.messageText}>
                    {(() => {
                      // Ensure text is a string and handle display accordingly
                      const text = message.text || '';
                      
                      if (typeof text === 'string') {
                        // Check if message contains an image URL
                        if (message.sender === 'bot' && containsImageUrl(text)) {
                          const imageUrl = extractImageUrl(text);
                          
                          // If no valid image URL found, render normal text
                          if (!imageUrl) {
                            return text.split('\n').map((line, i) => {
                              if (message.sender === 'bot' && line.match(/^[A-D]\.\s/)) {
                                return null;
                              }
                              return <p key={i}>{line}</p>;
                            }).filter(Boolean);
                          }
                          
                          // Create a display text without the image URL for cleaner presentation
                          const displayText = text.replace(imageUrl, '').trim();
                          
                          return (
                            <>
                              {/* Display text content */}
                              {displayText && displayText.split('\n').map((line, i) => {
                                if (message.sender === 'bot' && line.match(/^[A-D]\.\s/)) {
                                  return null;
                                }
                                return <p key={i}>{line}</p>;
                              }).filter(Boolean)}
                              
                              {/* Display the image */}
                              <div className={styles.imageContainer}>
                                <img 
                                  src={imageUrl} 
                                  alt="Response image" 
                                  className={styles.responseImage}
                                  loading="lazy"
                                  onError={(e) => {
                                    console.error('Image failed to load, trying alternative format:', imageUrl);
                                    
                                    // Extract ID from Google Drive URL and use direct format
                                    if (imageUrl.includes('drive.usercontent.google.com')) {
                                      const idMatch = imageUrl.match(/id=([\w-]+)/);
                                      if (idMatch && idMatch[1]) {
                                        const fileId = idMatch[1];
                                        e.target.src = `https://drive.google.com/uc?export=view&id=${fileId}`;
                                      } else {
                                        e.target.style.display = 'none';
                                      }
                                    } else {
                                      e.target.style.display = 'none';
                                    }
                                  }}
                                />
                              </div>
                            </>
                          );
                        }
                        
                        // Regular text message (no image)
                        return text.split('\n').map((line, i) => {
                          // Skip rendering lines that start with A., B., C., or D. in the textbox
                          if (message.sender === 'bot' && line.match(/^[A-D]\.\s/)) {
                            return null;
                          }
                          return <p key={i}>{line}</p>;
                        }).filter(Boolean);
                      } else {
                        // For non-string content (should be rare with our improved handling)
                        return (
                          <p className={styles.fallbackMessage}>
                            {formatMessage(text)}
                          </p>
                        );
                      }
                    })()}
                  </div>
                  <div className={styles.messageTime}>{message.time || ''}</div>
                </div>
                
                {shouldShowOptions && (
                  <div className={styles.optionsContainer}>
                    {options.map((option, index) => (
                      <motion.button
                        key={index}
                        className={styles.optionButton}
                        onClick={() => handleOptionSelect(option)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isLoading && (
          <div className={styles.typingIndicator}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className={styles.inputContainer} onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className={styles.input}
          disabled={isLoading}
        />
        <motion.button
          type="submit"
          className={styles.sendButton}
          disabled={!inputValue.trim() || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Chat;
