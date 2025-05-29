"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { storage } from "@/lib/utils";
import { sendChatMessage, extractSpeakerInfo, containsFloorPlan, extractFloorPlanUrl } from "@/lib/api";
import SpeakerCard from "./SpeakerCard";

interface Message {
  role: string;
  content: string;
}

export default function ChatInterface() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showSpeakers, setShowSpeakers] = useState(false);
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [floorPlanUrl, setFloorPlanUrl] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const user = storage.getUser();
    if (!user) {
      router.push("/chat/login");
      return;
    }
    
    setUserInfo(user);
    
    // Load chat history
    const savedMessages = storage.getChatHistory();
    if (savedMessages && savedMessages.length > 0) {
      setMessages(savedMessages);
    } else {
      // If no chat history, add a welcome message
      setIsLoading(true);
      
      // Simulate initial message from AI
      setTimeout(() => {
        const welcomeMessage = {
          role: "assistant",
          content: `Hi ${user.name}! Welcome to TM AI Day. How can I help you today? Feel free to ask about the event, speakers, venue, or anything else related to TM AI Day!`
        };
        setMessages([welcomeMessage]);
        storage.setChatHistory([welcomeMessage]);
        setIsLoading(false);
      }, 1000);
    }
  }, [router]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading || !userInfo) return;
    
    const userMessage: Message = { role: "user", content: input };
    
    // Update UI immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Send message to API
      const response = await sendChatMessage(
        userInfo.tm_id,
        input,
        messages
      );
      
      if (response.status === "success") {
        const aiMessage: Message = { 
          role: "assistant", 
          content: response.message 
        };
        
        // Update messages
        const updatedMessages = [...messages, userMessage, aiMessage];
        setMessages(updatedMessages);
        storage.setChatHistory(updatedMessages);
        
        // Check if response contains speaker information
        const speakerInfo = extractSpeakerInfo(response.message);
        if (speakerInfo) {
          setSpeakers(speakerInfo);
          setShowSpeakers(true);
        } else {
          setShowSpeakers(false);
        }
        
        // Check if response contains floor plan
        if (containsFloorPlan(response.message)) {
          const floorPlanUrl = extractFloorPlanUrl(response.message);
          if (floorPlanUrl) {
            setFloorPlanUrl(floorPlanUrl);
            setShowFloorPlan(true);
          }
        } else {
          setShowFloorPlan(false);
        }
      } else {
        // Handle error
        const errorMessage: Message = {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting to the server. Please try again later."
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, an error occurred. Please try again."
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    storage.clearUser();
    router.push("/chat/login");
  };
  
  return (
    <div className="flex flex-col h-full max-h-screen">
      {/* Header */}
      <header className="p-4 bg-gradient-to-r from-tm-blue to-tm-orange text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <Image
            src="/tm-logo-white.png"
            alt="TM Logo"
            width={40}
            height={40}
            className="w-8 h-8"
          />
          <h1 className="text-lg font-bold">TM AI Day Chat</h1>
        </div>
        {userInfo && (
          <div className="flex items-center gap-3">
            <div className="text-sm hidden md:block">
              <span className="font-medium">{userInfo.name}</span>
              {userInfo.department && (
                <span className="text-xs opacity-80 block">{userInfo.department}</span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm bg-white/20 hover:bg-white/30 py-1 px-3 rounded-full"
            >
              Logout
            </button>
          </div>
        )}
      </header>
      
      {/* Main chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={message.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="chat-bubble-ai flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        )}
        
        {/* Show speaker cards if available */}
        {showSpeakers && speakers.length > 0 && (
          <div className="my-4">
            <SpeakerCard speakers={speakers} />
          </div>
        )}
        
        {/* Show floor plan if available */}
        {showFloorPlan && floorPlanUrl && (
          <div className="my-4 flex justify-center">
            <div className="glass-effect rounded-lg overflow-hidden p-2 max-w-xl">
              <h3 className="text-center font-medium mb-2">TM AI Day Floor Plan</h3>
              <Image
                src={floorPlanUrl}
                alt="TM AI Day Floor Plan"
                width={600}
                height={400}
                className="rounded"
              />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="ios-input flex-1 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`ios-button bg-gradient-to-r from-tm-blue to-tm-orange text-white px-4 py-2 rounded-xl flex items-center justify-center ${
              !input.trim() || isLoading ? "opacity-50" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}