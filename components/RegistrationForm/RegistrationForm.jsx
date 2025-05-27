import { useState } from 'react';
import { motion } from 'framer-motion';

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

  // Styles moved inline to ensure they're applied
  const styles = {
    formContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      margin: '1rem 0',
      width: '100%'
    },
    formHeader: {
      padding: '1rem 1.5rem',
      background: 'linear-gradient(90deg, #003D7C 0%, #0080C8 100%)',
      color: '#FFFFFF'
    },
    headerText: {
      margin: 0,
      fontSize: '1.25rem',
      fontWeight: 600
    },
    form: {
      padding: '1.5rem'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 500,
      color: '#003D7C',
      fontSize: '0.875rem'
    },
    input: {
      width: '100%',
      padding: '1rem',
      border: '1px solid #E0E0E0',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      transition: '0.3s ease',
      backgroundColor: '#F5F5F5'
    },
    textarea: {
      resize: 'vertical',
      minHeight: '100px'
    },
    errorText: {
      color: '#d32f2f',
      fontSize: '0.875rem',
      display: 'block',
      marginTop: '0.25rem'
    },
    formActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      marginTop: '1.5rem'
    },
    cancelButton: {
      padding: '0.5rem 1.5rem',
      backgroundColor: '#E0E0E0',
      color: '#555555',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: 600,
      transition: '0.3s ease',
      border: 'none',
      cursor: 'pointer'
    },
    submitButton: {
      padding: '0.5rem 1.5rem',
      background: 'linear-gradient(90deg, #003D7C 0%, #0080C8 100%)',
      color: '#FFFFFF',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: 600,
      transition: '0.3s ease',
      border: 'none',
      cursor: 'pointer'
    },
    disabledButton: {
      backgroundColor: '#9E9E9E',
      cursor: 'not-allowed'
    }
  };

  return (
    <motion.div 
      style={styles.formContainer}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={styles.formHeader}>
        <h3 style={styles.headerText}>Registration Form</h3>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="lob" style={styles.label}>Line of Business (LOB)</label>
          <input
            type="text"
            id="lob"
            value={lob}
            onChange={(e) => setLob(e.target.value)}
            style={styles.input}
            placeholder="e.g., Digital, IT, Finance, HR"
            disabled={isSubmitting}
          />
          {errors.lob && <span style={styles.errorText}>{errors.lob}</span>}
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="objective" style={styles.label}>Objective for Attending</label>
          <textarea
            id="objective"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            style={{...styles.input, ...styles.textarea}}
            placeholder="What do you hope to gain from attending TM AI Day?"
            rows="4"
            disabled={isSubmitting}
          />
          {errors.objective && <span style={styles.errorText}>{errors.objective}</span>}
        </div>
        
        <div style={styles.formActions}>
          <button 
            type="button"
            style={isSubmitting ? {...styles.cancelButton, ...styles.disabledButton} : styles.cancelButton}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit"
            style={isSubmitting ? {...styles.submitButton, ...styles.disabledButton} : styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Register'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default RegistrationForm;