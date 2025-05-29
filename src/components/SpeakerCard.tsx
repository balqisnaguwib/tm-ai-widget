'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface Speaker {
  name: string;
  title: string;
  session_title: string;
  image_link: string;
}

interface SpeakerCardProps {
  speaker: Speaker;
  delay?: number;
}

export default function SpeakerCard({ speaker, delay = 0 }: SpeakerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl ios-transition"
    >
      <div className="flex items-start space-x-4">
        {/* Speaker Image */}
        <div className="flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-16 h-16 rounded-full overflow-hidden border-2 border-tm-blue/20"
          >
            <img
              src={speaker.image_link}
              alt={speaker.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initials if image fails to load
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full tm-gradient flex items-center justify-center text-white font-bold text-lg">
                      ${speaker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  `;
                }
              }}
            />
          </motion.div>
        </div>

        {/* Speaker Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.1 }}
                className="font-semibold text-gray-800 dark:text-white text-sm mb-1"
              >
                {speaker.name}
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.2 }}
                className="text-xs text-tm-blue font-medium mb-2"
              >
                {speaker.title}
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.3 }}
                className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                {speaker.session_title}
              </motion.p>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-tm-orange hover:bg-tm-orange/10 rounded-full ios-transition"
              title="Learn more"
            >
              <ExternalLink size={14} />
            </motion.button>
          </div>

          {/* Session Tag */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.4 }}
            className="mt-3"
          >
            <span className="inline-block px-2 py-1 bg-tm-orange/10 text-tm-orange text-xs rounded-full">
              Speaker
            </span>
          </motion.div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-tm-blue/0 pointer-events-none"
        whileHover={{ borderColor: 'rgba(0, 102, 204, 0.3)' }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}