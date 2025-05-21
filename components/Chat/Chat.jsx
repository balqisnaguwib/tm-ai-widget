// components/Chat/Chat.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage } from '../../utils/api';
import styles from './Chat.module.css';

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
        
        if (response.competency_status === 'in progress') {
          // We're in the survey flow
          setCompetencyStatus('in progress');
          addBotMessage(response.message);
        } else if (response.competency_status === 'complete') {
          // User has already completed the survey
          setCompetencyStatus('complete');
          setUserLevel(response.level);
          setUserScore(response.score);
          addBotMessage(response.message);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        addBotMessage('Sorry, there was an error connecting to the chat service. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeChat();
  }, [tmId]);
  
  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      text, 
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };
  
  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      text, 
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
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
      
      // Update state based on response
      if (response.competency_status === 'complete' && competencyStatus === 'in progress') {
        // User just completed the survey
        setCompetencyStatus('complete');
        setUserLevel(response.level);
        setUserScore(response.score);
      }
      
      addBotMessage(response.message);
    } catch (error) {
      console.error('Error sending message:', error);
      addBotMessage('Sorry, there was an error processing your message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle option selection for multiple choice questions
  const handleOptionSelect = (option) => {
    // Extract the option letter (A, B, C, D)
    const optionLetter = option.split('.')[0].trim().toLowerCase();
    setInputValue(optionLetter);
  };
  
  // Parse options from bot message if it's a multiple choice question
  const parseOptions = (message) => {
    const options = [];
    const lines = message.split('\n');
    
    for (const line of lines) {
      if (line.match(/^[A-D]\.\s/)) {
        options.push(line.trim());
      }
    }
    
    return options;
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
            const options = message.sender === 'bot' ? parseOptions(message.text) : [];
            const shouldShowOptions = competencyStatus === 'in progress' && options.length > 0;
            
            return (
              <motion.div
                key={message.id}
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
                    {message.text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  <div className={styles.messageTime}>{message.time}</div>
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
