"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/utils";

export default function ChatPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is logged in
    const user = storage.getUser();
    
    if (user) {
      // Check if user has completed the survey
      const surveyAnswers = storage.getSurveyState();
      
      if (surveyAnswers && surveyAnswers.length === 5) {
        // User has completed survey, redirect to main chat
        router.push("/chat/main");
      } else {
        // User needs to complete survey
        router.push("/chat/survey");
      }
    } else {
      // User is not logged in, redirect to login
      router.push("/chat/login");
    }
  }, [router]);
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="glass-effect p-8 rounded-xl shadow-lg text-center">
        <div className="animate-spin h-8 w-8 border-4 border-tm-blue border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading chat interface...</p>
      </div>
    </div>
  );
}