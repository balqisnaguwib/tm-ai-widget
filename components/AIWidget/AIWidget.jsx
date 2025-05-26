// components/AIWidget/AIWidget.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../Login/Login';
import Chat from '../Chat/Chat';
import { getUserSession, clearUserSession } from '../../utils/api';
import styles from './AiWidget.module.css';

const AIWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [tmId, setTmId] = useState('');
  const [step, setStep] = useState('login'); // login or chat
  
  // Check for existing session
  useEffect(() => {
    const savedTmId = getUserSession();
    if (savedTmId) {
      setTmId(savedTmId);
      setStep('chat');
    }
  }, []);
  
  // Add preloading to prevent flickering
  useEffect(() => {
    // Pre-mount components to avoid flickering
    const preloadComponents = async () => {
      await Promise.all([
        import('../Login/Login'),
        import('../Chat/Chat')
      ]);
    };
    
    preloadComponents();
  }, []);
  
  // Add ESC key listener for exiting maximized mode and manage body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMaximized) {
        setIsMaximized(false);
      }
    };
    
    // Prevent body scrolling when widget is maximized
    if (isMaximized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMaximized]);
  
  // Add click outside handler to close widget
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if widget is not open or is maximized
      if (!isOpen || isMaximized) return;
      
      // Get the widget container element
      const widgetContainer = document.querySelector(`.${styles.widgetContainer}`);
      const chatButton = document.querySelector(`.${styles.chatButton}`);
      
      // Check if the click was outside the widget and not on the chat button
      if (
        widgetContainer && 
        !widgetContainer.contains(e.target) && 
        chatButton && 
        !chatButton.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    
    // Add the event listener if the widget is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMaximized]);
  
  const toggleWidget = () => {
    // If we're closing the widget, reset to a consistent state
    if (isOpen) {
      setIsMaximized(false);
    }
    setIsOpen(prevState => !prevState);
  };
  
  const handleLogin = (id) => {
    setTmId(id);
    setStep('chat');
  };
  
  const handleLogout = () => {
    clearUserSession();
    setTmId('');
    setStep('login');
  };
  
  const toggleMaximize = () => {
    setIsMaximized(prev => !prev);
  };
  
  return (
    <>
      {/* Chat button */}
      <motion.button
        className={styles.chatButton}
        onClick={toggleWidget}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Open AI Chat"
        style={{ display: isMaximized ? 'none' : 'flex' }}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"></path>
          </svg>
        )}
      </motion.button>
      
      {/* Widget container */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className={`${styles.widgetContainer} ${isMaximized ? styles.maximized : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.2,
              ease: "easeOut"
            }}
          >
            <div className={styles.widget}>
              {step === 'login' ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Chat 
                  tmId={tmId} 
                  onLogout={handleLogout} 
                  onToggleMaximize={toggleMaximize} 
                  isMaximized={isMaximized}
                  onClose={() => {
                    setIsMaximized(false);
                    setIsOpen(false);
                  }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIWidget;
