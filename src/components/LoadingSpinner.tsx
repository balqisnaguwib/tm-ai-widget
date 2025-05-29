'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'orange' | 'white';
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'blue', 
  text, 
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    blue: 'border-tm-blue border-t-transparent',
    orange: 'border-tm-orange border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'p-4'}`}>
      <motion.div
        className={`
          ${sizeClasses[size]}
          border-2 rounded-full
          ${colorClasses[color]}
        `}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`
            mt-3 text-gray-600 dark:text-gray-400 
            ${textSizeClasses[size]}
          `}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// Preset loading components
export const PageLoader = () => (
  <LoadingSpinner 
    size="lg" 
    text="Loading TM AI Day..." 
    fullScreen 
  />
);

export const ComponentLoader = ({ text }: { text?: string }) => (
  <LoadingSpinner 
    size="md" 
    text={text} 
  />
);

export const ButtonLoader = () => (
  <LoadingSpinner 
    size="sm" 
    color="white" 
  />
);