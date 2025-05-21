// components/Login/Login.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { validateTmId, storeUserSession } from '../../utils/api';
import styles from './Login.module.css';

const Login = ({ onLogin }) => {
  const [tmId, setTmId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateTmId(tmId)) {
      setError('Please enter a valid TM ID');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call for validation
    setTimeout(() => {
      storeUserSession(tmId);
      setIsSubmitting(false);
      onLogin(tmId);
    }, 500);
  };

  return (
    <motion.div 
      className={styles.loginContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.loginCard}>
        <motion.div 
          className={styles.logoContainer}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
        >
          <div className={styles.logo}>
            <span className={styles.logoText}>TM</span>
          </div>
        </motion.div>
        
        <motion.h2 
          className={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Welcome to AI Day
        </motion.h2>
        
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Please enter your TM ID to continue
        </motion.p>
        
        <motion.form 
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="tmId"
              value={tmId}
              onChange={(e) => setTmId(e.target.value)}
              placeholder="Enter your TM ID"
              className={styles.input}
              disabled={isSubmitting}
            />
            <label htmlFor="tmId" className={styles.label}>TM ID</label>
          </div>
          
          {error && (
            <motion.div 
              className={styles.error}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
          
          <motion.button 
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isSubmitting ? 'Logging in...' : 'Continue'}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default Login;
