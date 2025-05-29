"use client";

import { useState } from "react";
import Image from "next/image";
import { SpeakerInfo } from "@/lib/api";

interface SpeakerCardProps {
  speakers: SpeakerInfo[];
}

export default function SpeakerCard({ speakers }: SpeakerCardProps) {
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0);
  
  const currentSpeaker = speakers[currentSpeakerIndex];
  
  const handleNext = () => {
    setCurrentSpeakerIndex((prev) => (prev + 1) % speakers.length);
  };
  
  const handlePrev = () => {
    setCurrentSpeakerIndex((prev) => (prev - 1 + speakers.length) % speakers.length);
  };
  
  return (
    <div className="w-full max-w-lg mx-auto my-6">
      <div className="glass-effect rounded-2xl overflow-hidden shadow-lg">
        <div className="relative h-60 bg-gradient-to-r from-tm-blue to-tm-orange">
          {/* Speaker image */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3 w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={currentSpeaker.image_link}
              alt={currentSpeaker.name}
              fill
              style={{ objectFit: "cover" }}
              onError={(e) => {
                // Fallback image if speaker image fails to load
                const target = e.target as HTMLImageElement;
                target.src = "/speaker-placeholder.png";
              }}
            />
          </div>
          
          {/* Navigation arrows */}
          {speakers.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                aria-label="Previous speaker"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                aria-label="Next speaker"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Speaker counter */}
          {speakers.length > 1 && (
            <div className="absolute bottom-4 right-4 text-white/80 text-sm">
              {currentSpeakerIndex + 1}/{speakers.length}
            </div>
          )}
        </div>
        
        <div className="p-6 pt-20 text-center">
          <h3 className="text-xl font-bold mb-1">{currentSpeaker.name}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{currentSpeaker.title}</p>
          
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Session</h4>
            <p className="text-sm">{currentSpeaker.session_title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}