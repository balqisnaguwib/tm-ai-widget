// Utility functions for the application

// Format countdown time
export function formatCountdownTime(targetDate: Date): {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    isComplete: boolean;
  } {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    
    // If the countdown is complete
    if (difference <= 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
        isComplete: true,
      };
    }
    
    // Calculate time units
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    // Format with leading zeros
    return {
      days: days.toString().padStart(2, "0"),
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
      isComplete: false,
    };
  }
  
  // Local storage utility functions
  export const storage = {
    // Set user session
    setUser: (userData: any) => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("tmAiDayUser", JSON.stringify(userData));
      }
    },
    
    // Get user session
    getUser: () => {
      if (typeof window !== "undefined") {
        const userData = sessionStorage.getItem("tmAiDayUser");
        return userData ? JSON.parse(userData) : null;
      }
      return null;
    },
    
    // Clear user session
    clearUser: () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("tmAiDayUser");
      }
    },
    
    // Set survey state
    setSurveyState: (answers: string[]) => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("tmAiDaySurvey", JSON.stringify(answers));
      }
    },
    
    // Get survey state
    getSurveyState: () => {
      if (typeof window !== "undefined") {
        const surveyData = sessionStorage.getItem("tmAiDaySurvey");
        return surveyData ? JSON.parse(surveyData) : [];
      }
      return [];
    },
    
    // Set chat history
    setChatHistory: (history: Array<{role: string, content: string}>) => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("tmAiDayChat", JSON.stringify(history));
      }
    },
    
    // Get chat history
    getChatHistory: () => {
      if (typeof window !== "undefined") {
        const chatData = sessionStorage.getItem("tmAiDayChat");
        return chatData ? JSON.parse(chatData) : [];
      }
      return [];
    }
  };
  
  // Generate animated blob positions
  export function generateRandomBlobs(count: number) {
    const blobs = [];
    
    for (let i = 0; i < count; i++) {
      const size = Math.floor(Math.random() * 300) + 100; // Random size between 100px and 400px
      const top = Math.floor(Math.random() * 100); // Random top position
      const left = Math.floor(Math.random() * 100); // Random left position
      const delay = Math.floor(Math.random() * 5); // Random animation delay
      
      // Alternate between TM colors
      const color = i % 2 === 0 
        ? 'rgba(0, 119, 181, 0.4)' // TM blue with opacity
        : 'rgba(255, 107, 0, 0.4)'; // TM orange with opacity
      
      blobs.push({
        size,
        top,
        left,
        delay,
        color
      });
    }
    
    return blobs;
  }