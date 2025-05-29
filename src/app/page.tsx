'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ChatWidget from '@/components/ChatWidget';
import CountdownTimer from '@/components/CountdownTimer';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import ErrorBoundary from '@/components/ErrorBoundary';
import { registerSW, initPWAPrompt, installPWA } from '@/utils/pwa';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Register service worker and PWA functionality
    registerSW();
    initPWAPrompt();
    
    // Add PWA install button click handler
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.addEventListener('click', installPWA);
    }

    return () => {
      if (installButton) {
        installButton.removeEventListener('click', installPWA);
      }
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <BackgroundAnimation />
        
        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* TM Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto tm-gradient rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-white text-3xl font-bold">TM</span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-tm-blue to-tm-orange bg-clip-text text-transparent"
            >
              AI DAY 2025
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12"
            >
              Powered by Telekom Malaysia
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <CountdownTimer targetDate="2025-07-02T09:00:00" />
            </motion.div>

            {/* Event Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="mt-12 p-8 glass-morphism rounded-3xl max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-semibold text-tm-blue mb-4">
                Join the Future of AI
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Experience the latest in artificial intelligence technology. 
                Connect with our AI assistant to learn more about the event, 
                register, and get personalized recommendations.
              </p>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-8"
            >
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-tm-orange rounded-full animate-pulse"></div>
                  <span>Click the chat widget to get started</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Chat Widget */}
        <ChatWidget />
      </div>
    </ErrorBoundary>
  );
}