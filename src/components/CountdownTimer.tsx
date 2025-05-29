"use client";

import { useEffect, useState } from "react";
import { formatCountdownTime } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: Date;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [time, setTime] = useState(formatCountdownTime(targetDate));
  
  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = formatCountdownTime(targetDate);
      setTime(timeLeft);
      
      if (timeLeft.isComplete) {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [targetDate]);
  
  // Motion variants for digit flip animation
  const digits = [
    { value: time.days, label: "DAYS" },
    { value: time.hours, label: "HOURS" },
    { value: time.minutes, label: "MINUTES" },
    { value: time.seconds, label: "SECONDS" },
  ];
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-tm-blue">
        Countdown to <span className="text-tm-orange">TM AI Day</span>
      </h2>
      
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {digits.map((digit, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
          >
            <div className="glass-effect w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-xl relative overflow-hidden shadow-lg">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-tm-blue to-tm-orange bg-clip-text text-transparent">
                {digit.value}
              </div>
              {/* Reflection effect */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white opacity-10 rounded-t-xl"></div>
            </div>
            <span className="text-xs md:text-sm mt-2 font-medium text-gray-600 dark:text-gray-300">
              {digit.label}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-lg md:text-xl animate-pulse-slow">
          {time.isComplete ? 
            "TM AI Day is here!" : 
            "Join us on July 2, 2025"}
        </p>
      </div>
    </div>
  );
}