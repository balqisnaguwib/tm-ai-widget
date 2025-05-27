// components/RegistrationForm/RegistrationForm.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './RegistrationForm.module.css';

const RegistrationForm = ({ onSubmit, onCancel }) => {
  const [lob, setLob] = useState('');
  const [objective, setObjective] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!lob.trim()) newErrors.lob = 'Line of Business is required';
    if (!objective.trim()) newErrors.objective = 'Objective is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
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
    <motion.div 
      className={styles.formContainer}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.formHeader}>
        <h3>Registration Form</h3>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="lob" className={styles.label}>Line of Business (LOB)</label>
          <input
            type="text"
            id="lob"
            value={lob}
            onChange={(e) => setLob(e.target.value)}
            className={styles.input}
            placeholder="e.g., Digital, IT, Finance, HR"
            disabled={isSubmitting}
          />
          {errors.lob && <span className={styles.errorText}>{errors.lob}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="objective" className={styles.label}>Objective for Attending</label>
          <textarea
            id="objective"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className={`${styles.input} ${styles.textarea}`}
            placeholder="What do you hope to gain from attending TM AI Day?"
            rows="4"
            disabled={isSubmitting}
          />
          {errors.objective && <span className={styles.errorText}>{errors.objective}</span>}
        </div>
        
        <div className={styles.formActions}>
          <motion.button 
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
          >
            Cancel
          </motion.button>
          <motion.button 
            type="submit"
            className={styles.submitButton}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Register'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default RegistrationForm;