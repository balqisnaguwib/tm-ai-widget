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
  extractImageUrl,
  extractGoogleDriveId
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

// Updated floor plan URL
const FLOOR_PLAN_URL = 'https://ai.tm.com.my/AI-Day/AI-DAY-floor-plan.jpeg';

// Standalone Registration Form Component
const RegistrationFormStandalone = ({ onSubmit, onCancel }) => {
  const [lob, setLob] = useState('');
  const [objective, setObjective] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    // Validate form
    const newErrors = {};
    if (!lob.trim()) newErrors.lob = 'Line of Business is required';
    if (!objective.trim()) newErrors.objective = 'Objective is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Call the onSubmit function with form data
    onSubmit({
      lob: lob.trim(),
      objective: objective.trim()
    });
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      margin: '0.5rem 0',
      width: '100%',
      maxHeight: '400px', /* Limit height to ensure it doesn't push other content out of view */
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '0.75rem 1rem',
        background: 'linear-gradient(90deg, #003D7C 0%, #0080C8 100%)',
        color: '#FFFFFF'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Registration Form</h3>
      </div>
      
      <div style={{ 
        padding: '1rem',
        overflowY: 'auto',
        flex: 1
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 500,
            color: '#003D7C',
            fontSize: '0.875rem'
          }}>
            Line of Business (LOB)
          </label>
          <input
            type="text"
            value={lob}
            onChange={(e) => setLob(e.target.value)}
            placeholder="e.g., Digital, IT, Finance, HR"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #E0E0E0',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              backgroundColor: '#F5F5F5'
            }}
          />
          {errors.lob && (
            <span style={{ color: '#d32f2f', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
              {errors.lob}
            </span>
          )}
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 500,
            color: '#003D7C',
            fontSize: '0.875rem'
          }}>
            Objective for Attending
          </label>
          <textarea
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="What do you hope to gain from attending TM AI Day?"
            rows={3}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #E0E0E0',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              backgroundColor: '#F5F5F5',
              minHeight: '80px',
              resize: 'vertical'
            }}
          />
          {errors.objective && (
            <span style={{ color: '#d32f2f', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
              {errors.objective}
            </span>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          marginTop: '1rem'
        }}>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: isSubmitting ? '#9E9E9E' : '#E0E0E0',
              color: '#555555',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              padding: '0.5rem 1rem',
              background: isSubmitting ? '#9E9E9E' : 'linear-gradient(90deg, #003D7C 0%, #0080C8 100%)',
              color: '#FFFFFF',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

// SpeakersGrid Component
const SpeakersGrid = ({ speakers }) => {
  if (!speakers || !Array.isArray(speakers) || speakers.length === 0) {
    return null;
  }

  return (
    <div style={{
      width: '100%',
      padding: '1rem',
      backgroundColor: '#E5F0F9',
      borderRadius: '0.5rem',
      margin: '1rem 0'
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        color: '#003D7C',
        margin: '0 0 1rem 0',
        textAlign: 'center'
      }}>
        TM AI Day Speakers
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        {speakers.map((speaker, index) => (
          <div key={index} style={{
            display: 'flex',
            padding: '1rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            margin: '0.5rem 0',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              minWidth: '80px',
              borderRadius: '50%',
              overflow: 'hidden',
              marginRight: '1rem',
              backgroundColor: '#E5F0F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {speaker.image_link ? (
                <img 
                  src={speaker.image_link} 
                  alt={`${speaker.name}`} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=Speaker';
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #FF6B00 0%, #FF9C59 100%)',
                  color: '#FFFFFF',
                  fontSize: '2rem',
                  fontWeight: 700
                }}>
                  {speaker.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#003D7C',
                margin: '0 0 0.25rem 0'
              }}>
                {speaker.name}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#555555',
                margin: '0 0 1rem 0'
              }}>
                {speaker.title}
              </p>
              <div style={{ marginTop: 'auto' }}>
                <h4 style={{
                  fontSize: '0.75rem',
                  color: '#9E9E9E',
                  textTransform: 'uppercase',
                  margin: '0 0 0.25rem 0'
                }}>
                  Session:
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#CC5600',
                  margin: 0,
                  fontWeight: 500
                }}>
                  {speaker.session_title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Chat = ({ tmId, onLogout, onToggleMaximize, isMaximized, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [userLevel, setUserLevel] = useState('');
  const [userScore, setUserScore] = useState('');
  const [competencyStatus, setCompetencyStatus] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationIntent, setRegistrationIntent] = useState(false);
  const [speakers, setSpeakers] = useState(null);
  const [errors, setErrors] = useState({});
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Apply specific styles to ensure scrollability
  useEffect(() => {
    // Apply specific styles to ensure scrollability
    const messagesContainer = document.querySelector(`.${styles.messagesContainer}`);
    if (messagesContainer) {
      messagesContainer.style.flex = '1';
      messagesContainer.style.overflowY = 'auto';
      messagesContainer.style.display = 'flex'; 
      messagesContainer.style.flexDirection = 'column';
      messagesContainer.style.position = 'relative';
    }
    
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
        setChatHistory([]);
        
        if (response && response.competency_status === 'in progress') {
          // We're in the survey flow
          setCompetencyStatus('in progress');
          // Add a single message
          if (response.message) {
            // Check if response.message is an object with role and content properties
            if (typeof response.message === 'object' && response.message.content) {
              addBotMessage(response.message.content);
              updateChatHistory('assistant', response.message.content);
            } else {
              addBotMessage(response.message);
              updateChatHistory('assistant', response.message);
            }
          }
        } else if (response && response.competency_status === 'complete') {
          // User has already completed the survey
          setCompetencyStatus('complete');
          if (response.level) setUserLevel(response.level);
          if (response.score) setUserScore(response.score);
          
          if (hasValidMessage(response)) {
            let messageContent;
            
            // Check if response.message is an object with role and content properties
            if (typeof response.message === 'object' && response.message.content) {
              messageContent = response.message.content;
            } else {
              messageContent = extractMessageFromResponse(response);
            }
            
            // Check if the message contains the unwanted text about query parameters
            if (messageContent.includes("Query parameter not provided")) {
              // Replace with a better message
              messageContent = `You have already completed the AI competency survey! Your level is ${response.level || 'determined'} ${response.score ? `with a score of ${response.score}` : ''}.
              
Welcome to TM AI Day! Would you like to register for the event or find out more information about it?`;
            }
            
            addBotMessage(messageContent);
            updateChatHistory('assistant', messageContent);
          }
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        const errorMessage = 'Sorry, there was an error connecting to the chat service. Please try again later.';
        addBotMessage(errorMessage);
        updateChatHistory('assistant', errorMessage);
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
      
      updateChatHistory('user', messageText);
    } catch (error) {
      console.error('Error adding user message:', error);
    }
  };
  
  const addBotMessage = (text) => {
    try {
      // Use the utility to ensure text is a string
      const messageText = formatMessage(text);
      debugLog('Adding bot message:', messageText);
      
      // Create a normalized version for easier pattern matching
      const normalizedText = messageText.toLowerCase();
      
      // Check if the message contains a trigger for the registration form
      // Enhanced detection for [display form] tag
      if (normalizedText.includes('[display form]')) {
        debugLog('Registration form trigger detected!', messageText);
        setShowRegistrationForm(true);
        
        // Remove the [display form] marker from the displayed message
        let cleanMessage = messageText.replace(/\[display form\]/gi, '').trim();
        
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          text: cleanMessage, 
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRegistrationPrompt: true
        }]);
      } else {
        // Check if the message contains JSON data for speakers
        try {
          // Look for JSON array pattern in the message
          if (messageText.includes('"name"') && messageText.includes('"image_link"')) {
            const jsonMatch = messageText.match(/\[\s*\{[\s\S]*\}\s*\]/);
            if (jsonMatch) {
              const jsonStr = jsonMatch[0];
              const parsedSpeakers = JSON.parse(jsonStr);
              
              if (Array.isArray(parsedSpeakers) && parsedSpeakers.length > 0) {
                setSpeakers(parsedSpeakers);
                
                // Replace the JSON in the message with a simple notification
                const cleanMessage = messageText.replace(jsonStr, '').trim();
                
                setMessages(prev => [...prev, { 
                  id: Date.now(), 
                  text: cleanMessage || 'Here are the speakers for TM AI Day:', 
                  sender: 'bot',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  hasSpeakers: true
                }]);
                return;
              }
            }
          }
        } catch (jsonError) {
          console.error('Error parsing JSON data from message:', jsonError);
          // Continue with normal message handling if JSON parsing fails
        }
        
        // Regular message
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          text: messageText, 
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
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
  
  const updateChatHistory = (role, content) => {
    setChatHistory(prev => [...prev, { role, content }]);
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
      
      const response = await sendChatMessage(tmId, userText, updatedAnswers, chatHistory);
      
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
          let messageContent;
          
          // Check if response.message is an object with role and content properties
          if (typeof response.message === 'object' && response.message.content) {
            messageContent = response.message.content;
          } else {
            messageContent = extractMessageFromResponse(response);
          }
          
          addBotMessage(messageContent);
          updateChatHistory('assistant', messageContent);
        }
      } else if (response && response.competency_status === 'in progress') {
        setCompetencyStatus('in progress');
        
        // Add message from the response
        if (hasValidMessage(response)) {
          let messageContent;
          
          // Check if response.message is an object with role and content properties
          if (typeof response.message === 'object' && response.message.content) {
            messageContent = response.message.content;
          } else {
            messageContent = extractMessageFromResponse(response);
          }
          
          addBotMessage(messageContent);
          updateChatHistory('assistant', messageContent);
        }
      } else {
        // Normal conversation flow, not part of competency test
        if (hasValidMessage(response)) {
          let messageContent;
          
          // Check if response.message is an object with role and content properties
          if (typeof response.message === 'object' && response.message.content) {
            messageContent = response.message.content;
          } else {
            messageContent = extractMessageFromResponse(response);
          }
          
          // Also check for the unwanted message during normal conversation
          if (response.competency_status === 'complete' && messageContent.includes("Query parameter not provided")) {
            // Replace with a better message
            messageContent = `You have already completed the AI competency survey! Your level is ${response.level || 'determined'} ${response.score ? `with a score of ${response.score}` : ''}.
            
I'd be happy to answer any questions you have about AI or the TM AI Day event!`;
          }
          
          addBotMessage(messageContent);
          updateChatHistory('assistant', messageContent);
        } else if (response) {
          debugLog('No message found in response');
          const fallbackMessage = 'Response received but no message found.';
          addBotMessage(fallbackMessage);
          updateChatHistory('assistant', fallbackMessage);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = 'Sorry, there was an error processing your message. Please try again.';
      addBotMessage(errorMessage);
      updateChatHistory('assistant', errorMessage);
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

  // Handle clicking on an image to open it in a new tab
  const handleImageClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  // Handle registration form submission
  const handleRegistrationSubmit = (formData) => {
    setShowRegistrationForm(false);
    setIsLoading(true);
    
    // Add a summary of the submitted information as a user message
    const userSummary = `Line of Business: ${formData.lob}\nObjective: ${formData.objective}`;
    addUserMessage(userSummary);
    
    try {
      // Send a message with the registration data
      const registrationMsg = `I want to register with the following information:\nLOB: ${formData.lob}\nObjective: ${formData.objective}`;
      
      sendChatMessage(tmId, registrationMsg, [], chatHistory)
        .then(response => {
          // Display the response
          if (hasValidMessage(response)) {
            let messageContent;
            
            // Check if response.message is an object with role and content properties
            if (typeof response.message === 'object' && response.message.content) {
              messageContent = response.message.content;
            } else {
              messageContent = extractMessageFromResponse(response);
            }
            
            addBotMessage(messageContent);
            updateChatHistory('assistant', messageContent);
          } else {
            const successMessage = 'Thank you for registering for TM AI Day! Your information has been saved.';
            addBotMessage(successMessage);
            updateChatHistory('assistant', successMessage);
          }
          
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error registering:', error);
          const errorMessage = 'Sorry, there was an error processing your registration. Please try again.';
          addBotMessage(errorMessage);
          updateChatHistory('assistant', errorMessage);
          setIsLoading(false);
        });
    } catch (error) {
      console.error('Error registering:', error);
      const errorMessage = 'Sorry, there was an error processing your registration. Please try again.';
      addBotMessage(errorMessage);
      updateChatHistory('assistant', errorMessage);
      setIsLoading(false);
    }
  };
  
  const handleRegistrationCancel = () => {
    setShowRegistrationForm(false);
    
    // Add a message that the user cancelled registration
    const cancelMessage = 'I decided not to register right now.';
    addUserMessage(cancelMessage);
    
    // Add a bot response
    const botResponse = 'No problem! Feel free to ask me any questions about TM AI Day or register later if you change your mind.';
    addBotMessage(botResponse);
    updateChatHistory('assistant', botResponse);
  };
  
  return (
    <motion.div 
      className={`${styles.chatContainer} ${isMaximized ? styles.chatContainerMaximized : ''}`}
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
        <div className={styles.chatHeaderRight}>
          <button 
            className={styles.maximizeButton}
            onClick={onToggleMaximize}
            title={isMaximized ? "Minimize" : "Maximize"}
          >
            <motion.div
              animate={{ rotate: isMaximized ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMaximized ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-7.83 7.83 1.41 1.41L19 6.41V10h2V3h-7z" transform="rotate(180, 12, 12)"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-7.83 7.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
                </svg>
              )}
            </motion.div>
          </button>
          <button 
            className={styles.logoutButton} 
            onClick={onLogout}
          >
            Logout
          </button>
          {isMaximized && (
            <button 
              className={styles.closeButton} 
              onClick={onClose}
              title="Close"
            >
              Close
            </button>
          )}
        </div>
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
                          
                          // Update to the new floor plan URL if it's the old URL
                          const displayUrl = imageUrl && imageUrl.includes('1VytyGMr9eE8Tmy4AM3-KV9xtvDJ3d99n') 
                            ? FLOOR_PLAN_URL 
                            : imageUrl;
                          
                          // If no valid image URL found, render normal text
                          if (!displayUrl) {
                            return text.split('\n').map((line, i) => {
                              if (message.sender === 'bot' && line.match(/^[A-D]\.\s/)) {
                                return null;
                              }
                              return <p key={i}>{line}</p>;
                            }).filter(Boolean);
                          }
                          
                          // Create a display text without the image URL for cleaner presentation
                          const displayText = text.replace(imageUrl || '', '').trim();
                          
                          // Extract Google Drive file ID if it's a Google Drive URL
                          const fileId = extractGoogleDriveId(displayUrl);
                          const isGoogleDriveUrl = !!fileId;
                          
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
                              <div 
                                className={styles.imageContainer}
                                onClick={() => handleImageClick(isGoogleDriveUrl 
                                  ? `https://drive.google.com/file/d/${fileId}/view` 
                                  : displayUrl)}
                              >
                                {isGoogleDriveUrl ? (
                                  // For Google Drive: Use iframe with direct preview URL
                                  <iframe
                                    src={`https://drive.google.com/file/d/${fileId}/preview`}
                                    title="Floor plan preview"
                                    className={styles.drivePreview}
                                    loading="lazy"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  ></iframe>
                                ) : (
                                  // For regular images: Use img tag
                                  <img 
                                    src={displayUrl} 
                                    alt="Response image" 
                                    className={styles.responseImage}
                                    loading="lazy"
                                    onError={(e) => {
                                      console.error('Image failed to load:', displayUrl);
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                )}
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
                
                {message.hasSpeakers && speakers && (
                  <SpeakersGrid speakers={speakers} />
                )}
                
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
        
        {/* Add a dedicated scrollable container for the registration form */}
        {showRegistrationForm && (
          <div style={{ overflowY: 'auto', maxHeight: '100%', width: '100%' }}>
            <RegistrationFormStandalone 
              onSubmit={handleRegistrationSubmit}
              onCancel={handleRegistrationCancel}
            />
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
          disabled={isLoading || showRegistrationForm}
        />
        <motion.button
          type="submit"
          className={styles.sendButton}
          disabled={!inputValue.trim() || isLoading || showRegistrationForm}
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