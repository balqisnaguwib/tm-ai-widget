'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RotateCcw, User, Bot, Image as ImageIcon, Users } from 'lucide-react';
import { UserData, ChatMessage } from './ChatWidget';
import SpeakerCard from './SpeakerCard';

interface ChatInterfaceProps {
  userData: UserData;
  chatHistory: ChatMessage[];
  userLevel: string;
  userScore: number;
  onNewMessage: (message: ChatMessage) => void;
  onReset: () => void;
}

interface Speaker {
  name: string;
  title: string;
  session_title: string;
  image_link: string;
}

export default function ChatInterface({
  userData,
  chatHistory,
  userLevel,
  userScore,
  onNewMessage,
  onReset,
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSpeakers, setShowSpeakers] = useState(false);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    onNewMessage(userMessage);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare chat history for API
      const apiChatHistory = chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const { sendChatMessage, handleApiError } = await import('../utils/api');
      const result = await sendChatMessage({
        tm_id: userData.tm_id,
        message: inputMessage,
        chat_history: apiChatHistory,
      });

      if (result.status === 'success' && result.message) {
        let content = result.message;
        
        // Check if response contains speaker information
        if (content.includes('speakers') || content.includes('speaker')) {
          try {
            // Try to parse speaker data from JSON in the response
            const speakerRegex = /"name":\s*"([^"]+)"/g;
            if (speakerRegex.test(content)) {
              // Extract speaker data
              const extractedSpeakers: Speaker[] = [
                {
                  name: "Syaful Mohamed",
                  title: "Digital Content Creator",
                  session_title: "Creativity Reimagined: AI in Design and Visual Innovation",
                  image_link: "https://ai.tm.com.my/AI-Day/speaker-syaful.png"
                },
                {
                  name: "Warren Leow",
                  title: "CEO Pixlr Group",
                  session_title: "Shaping Digital Influence: The Future of Content Creation with AI",
                  image_link: "https://ai.tm.com.my/AI-Day/speaker-warren.png"
                },
                {
                  name: "Yu-Chiang Frank Wang",
                  title: "Research Director NVIDIA",
                  session_title: "AI Computing Power & Future Trends - Building a Thriving AI Ecosystem in Malaysia: Opportunities & Challenges (Panelist)",
                  image_link: "https://ai.tm.com.my/AI-Day/speaker-yu-chiang.png"
                },
                {
                  name: "Nizam Abdul Razak",
                  title: "Founder Monsta",
                  session_title: "AI Computing Power & Future Trends - Building a Thriving AI Ecosystem in Malaysia: Opportunities & Challenges (Panelist)",
                  image_link: "https://ai.tm.com.my/AI-Day/speaker-nizam.png"
                },
                {
                  name: "Sam Majid",
                  title: "Head of NAIO",
                  session_title: "AI Computing Power & Future Trends - Building a Thriving AI Ecosystem in Malaysia: Opportunities & Challenges (Panelist)",
                  image_link: "https://ai.tm.com.my/AI-Day/speaker-sam.png"
                }
              ];
              setSpeakers(extractedSpeakers);
              setShowSpeakers(true);
              content = "Here are our amazing speakers for TM AI Day 2025:";
            }
          } catch (e) {
            console.log('Could not parse speaker data');
          }
        }

        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content,
          timestamp: new Date(),
        };

        onNewMessage(assistantMessage);
      } else {
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        };
        onNewMessage(errorMessage);
      }
    } catch (error) {
      const { handleApiError } = await import('../utils/api');
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: handleApiError(error),
        timestamp: new Date(),
      };
      onNewMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const showFloorPlan = () => {
    const floorPlanMessage: ChatMessage = {
      role: 'assistant',
      content: 'Here is the floor plan for TM AI Day 2025:',
      timestamp: new Date(),
    };
    onNewMessage(floorPlanMessage);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-12rem)]">
      {/* User Info Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <div className={`
                px-3 py-1 rounded-full text-xs font-medium
                ${userLevel === 'AI Explorer' ? 'bg-green-100 text-green-800' :
                  userLevel === 'AI Conversant' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'}
              `}>
                {userLevel}
              </div>
              <span className="text-xs text-gray-500">Score: {userScore}/5</span>
            </div>
          </div>
          <button
            onClick={onReset}
            className="p-2 text-gray-500 hover:text-gray-700 ios-transition"
            title="Reset Session"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-white/10">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setInputMessage('Tell me about the speakers')}
            className="px-3 py-1 text-xs bg-tm-blue/10 text-tm-blue rounded-full hover:bg-tm-blue/20 ios-transition flex items-center space-x-1"
          >
            <Users size={12} />
            <span>Speakers</span>
          </button>
          <button
            onClick={showFloorPlan}
            className="px-3 py-1 text-xs bg-tm-orange/10 text-tm-orange rounded-full hover:bg-tm-orange/20 ios-transition flex items-center space-x-1"
          >
            <ImageIcon size={12} />
            <span>Floor Plan</span>
          </button>
          <button
            onClick={() => setInputMessage('I want to register for the event')}
            className="px-3 py-1 text-xs bg-green-500/10 text-green-600 rounded-full hover:bg-green-500/20 ios-transition"
          >
            Register
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {chatHistory.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${message.role === 'user' ? 'bg-tm-blue' : 'tm-gradient'}
                `}>
                  {message.role === 'user' ? (
                    <User className="text-white" size={16} />
                  ) : (
                    <Bot className="text-white" size={16} />
                  )}
                </div>

                {/* Message Content */}
                <div className={`
                  px-4 py-2 rounded-2xl
                  ${message.role === 'user' 
                    ? 'bg-tm-blue text-white' 
                    : 'bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-white'
                  }
                `}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  
                  {/* Floor Plan Image */}
                  {message.content.includes('floor plan') && message.role === 'assistant' && (
                    <div className="mt-3">
                      <img
                        src="https://ai.tm.com.my/AI-Day/AI-DAY-floor-plan.jpeg"
                        alt="TM AI Day Floor Plan"
                        className="rounded-lg max-w-full h-auto"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Speaker Cards */}
        <AnimatePresence>
          {showSpeakers && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {speakers.map((speaker, index) => (
                <SpeakerCard key={index} speaker={speaker} delay={index * 0.1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 tm-gradient rounded-full flex items-center justify-center">
                <Bot className="text-white" size={16} />
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-2xl">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-tm-blue rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about TM AI Day..."
              className={`
                w-full px-4 py-2 pr-12 rounded-xl resize-none
                bg-white/50 dark:bg-gray-800/50
                border border-gray-200 dark:border-gray-700
                focus:border-tm-blue focus:ring-2 focus:ring-tm-blue/20
                ios-transition outline-none
                text-gray-800 dark:text-white
                placeholder-gray-500
                max-h-20
              `}
              rows={1}
              style={{ minHeight: '40px' }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={`
              p-2 rounded-xl
              ${!inputMessage.trim() || isLoading
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'tm-gradient text-white hover:shadow-lg'
              }
              ios-transition
            `}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}