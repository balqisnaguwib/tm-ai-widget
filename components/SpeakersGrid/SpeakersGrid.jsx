// components/SpeakersGrid/SpeakersGrid.jsx
import { motion } from 'framer-motion';
import SpeakerCard from '../SpeakerCard/SpeakerCard';
import styles from './SpeakersGrid.module.css';

const SpeakersGrid = ({ speakers }) => {
  if (!speakers || !Array.isArray(speakers) || speakers.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={styles.speakersContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className={styles.gridTitle}>TM AI Day Speakers</h3>
      <div className={styles.speakersGrid}>
        {speakers.map((speaker, index) => (
          <SpeakerCard key={index} speaker={speaker} />
        ))}
      </div>
    </motion.div>
  );
};

export default SpeakersGrid;