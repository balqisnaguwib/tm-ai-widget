"use client";

import { useEffect, useState } from "react";
import { generateRandomBlobs } from "@/lib/utils";

interface Blob {
  size: number;
  top: number;
  left: number;
  delay: number;
  color: string;
}

export default function AnimatedBackground() {
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBlobs(generateRandomBlobs(6));
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-[-1]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-orange-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 opacity-80"></div>
      
      {/* Animated blobs */}
      {blobs.map((blob, index) => (
        <div
          key={index}
          className="blob"
          style={{
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            top: `${blob.top}%`,
            left: `${blob.left}%`,
            backgroundColor: blob.color,
            animationDelay: `${blob.delay}s`,
          }}
        ></div>
      ))}
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
    </div>
  );
}