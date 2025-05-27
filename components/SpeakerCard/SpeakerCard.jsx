// components/SpeakerCard/SpeakerCard.jsx
import { motion } from 'framer-motion';
import styles from './SpeakerCard.module.css';

const SpeakerCard = ({ speaker }) => {
  if (!speaker || !speaker.name) return null;

  return (
    <motion.div 
      className={styles.speakerCard}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.imageContainer}>
        {speaker.image_link ? (
          <img 
            src={speaker.image_link} 
            alt={`${speaker.name}`} 
            className={styles.speakerImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/150?text=Speaker';
            }}
          />
        ) : (
          <div className={styles.placeholderImage}>
            {speaker.name.charAt(0)}
          </div>
        )}
      </div>
      
      <div className={styles.speakerInfo}>
        <h3 className={styles.speakerName}>{speaker.name}</h3>
        <p className={styles.speakerTitle}>{speaker.title}</p>
        <div className={styles.sessionInfo}>
          <h4 className={styles.sessionLabel}>Session:</h4>
          <p className={styles.sessionTitle}>{speaker.session_title}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SpeakerCard;