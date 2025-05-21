// components/AIWidget/AIWidget.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../Login/Login';
import Chat from '../Chat/Chat';
import { getUserSession, clearUserSession } from '../../utils/api';
import styles from './AIWidget.module.css';

const AIWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
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
  
  const toggleWidget = () => {
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
  
  return (
    <>
      {/* Chat button */}
      <motion.button
        className={styles.chatButton}
        onClick={toggleWidget}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Open AI Chat"
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.widgetContainer}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ 
              duration: 0.3,
              type: 'spring',
              stiffness: 300,
              damping: 25
            }}
          >
            <div className={styles.widget}>
              {step === 'login' ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Chat tmId={tmId} onLogout={handleLogout} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIWidget;
