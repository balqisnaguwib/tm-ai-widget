// components/LandingPage/LandingPage.jsx
import { motion } from 'framer-motion';
import AIWidget from '../AIWidget/AIWidget';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  const features = [
    {
      id: 1,
      title: 'AI Competency Test',
      description: 'Take our interactive assessment to determine your AI knowledge level.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Personalized Learning',
      description: 'Get responses tailored to your knowledge level from our AI assistant.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"></path>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Real-time Assistance',
      description: 'Get immediate answers to all your AI-related questions during the event.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
          <path d="M15 4v7H5.17l-.59.59-.58.58V4h11m1-2H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm5 4h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1z"></path>
        </svg>
      )
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className={styles.landingPage}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>TM</div>
          <nav className={styles.navigation}>
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
      </header>
      
      <main>
        <section className={styles.hero}>
          <div className={styles.container}>
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1>Welcome to TM AI Day</h1>
              <p>
                Explore the future of artificial intelligence with our interactive
                assistant. Take our AI competency test and get personalized guidance throughout the event.
              </p>
              <motion.div 
                className={styles.heroCta}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <button>Click the chat button to get started!</button>
                <div className={styles.arrowContainer}>
                  <motion.div 
                    className={styles.arrow}
                    animate={{ 
                      y: [0, 10, 0],
                      opacity: [1, 0.6, 1]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      ease: "easeInOut", 
                      repeat: Infinity 
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        <section id="features" className={styles.features}>
          <div className={styles.container}>
            <h2>Key Features</h2>
            <motion.div 
              className={styles.featuresGrid}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {features.map((feature) => (
                <motion.div 
                  key={feature.id} 
                  className={styles.featureCard}
                  variants={itemVariants}
                >
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        <section id="about" className={styles.about}>
          <div className={styles.container}>
            <motion.div 
              className={styles.aboutContent}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2>About TM AI Day</h2>
              <p>
                TM AI Day is a special event dedicated to exploring the latest advancements in
                artificial intelligence and how they impact our digital future. Join us for a day
                of learning, discussion, and hands-on experiences with cutting-edge AI technology.
              </p>
              <p>
                Our AI chat assistant is designed to enhance your experience during the event,
                providing personalized information based on your AI knowledge level. Start by
                taking our competency test, and then explore all that TM AI Day has to offer!
              </p>
            </motion.div>
          </div>
        </section>
        
        <section id="faq" className={styles.faq}>
          <div className={styles.container}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              <div className={styles.faqItem}>
                <h3>How does the AI competency test work?</h3>
                <p>
                  The test consists of 5 multiple-choice questions designed to assess your
                  understanding of AI concepts. Based on your answers, you'll be categorized
                  into one of three levels: AI Explorer, AI Conversant, or AI Competent.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3>Can I retake the competency test?</h3>
                <p>
                  Currently, the test can only be taken once per TM ID. If you need to
                  retake the test, please contact our support team.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3>How do I access the chat assistant after the event?</h3>
                <p>
                  The AI assistant will be available throughout the event. For post-event
                  access, details will be provided during the closing session.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>TM</div>
            <p>&copy; {new Date().getFullYear()} Telekom Malaysia. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* AI Chat Widget */}
      <AIWidget />
    </div>
  );
};

export default LandingPage;
