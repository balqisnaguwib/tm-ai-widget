'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return <div className="h-32" />; // Placeholder to prevent hydration mismatch
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, color: 'tm-blue' },
    { label: 'Hours', value: timeLeft.hours, color: 'tm-orange' },
    { label: 'Minutes', value: timeLeft.minutes, color: 'tm-blue' },
    { label: 'Seconds', value: timeLeft.seconds, color: 'tm-orange' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <motion.div
            className={`
              w-20 h-20 md:w-24 md:h-24 rounded-2xl 
              ${unit.color === 'tm-blue' ? 'bg-tm-blue' : 'bg-tm-orange'}
              flex items-center justify-center shadow-lg
              ios-transition hover:scale-105
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              key={unit.value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-white"
            >
              {unit.value.toString().padStart(2, '0')}
            </motion.span>
          </motion.div>
          <span className="text-sm md:text-base font-medium text-gray-600 dark:text-gray-400 mt-2">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}