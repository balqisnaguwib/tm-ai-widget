import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import LoginForm from './LoginForm';
import SurveyForm from './SurveyForm';
import ChatInterface from './ChatInterface';

export type ChatState = 'closed' | 'login' | 'survey' | 'chat';

export interface UserData {
  tm_id: string;
  name: string;
  gender: string;
  department: string;
  division: string;
  position: string;
  mobile: string;
  email: string;
  lob: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const [chatState, setChatState] = useState<ChatState>('closed');
  // Store the last active state to restore it when reopening
  const [lastActiveState, setLastActiveState] = useState<ChatState>('login');
  // We'll use a single state to track widget size mode: 'normal', 'minimized', or 'maximized'
  const [sizeMode, setSizeMode] = useState<'normal' | 'minimized' | 'maximized'>('normal');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userLevel, setUserLevel] = useState('');
  const [userScore, setUserScore] = useState(0);

  // Check if user has already completed survey
  useEffect(() => {
    // Import storage utilities dynamically to ensure client-side only
    import('../utils/storage').then(({ userStorage }) => {
      const storedUserData = userStorage.getUserData();
      const storedChatHistory = userStorage.getChatHistory();
      const storedUserLevel = userStorage.getUserLevel();
      const storedUserScore = userStorage.getUserScore();

      if (storedUserData) {
        setUserData(storedUserData);
        setLastActiveState('chat'); // Set initial active state if user is logged in
      }
      if (storedChatHistory.length > 0) {
        setChatHistory(storedChatHistory);
      }
      if (storedUserLevel) {
        setUserLevel(storedUserLevel);
      }
      if (storedUserScore) {
        setUserScore(storedUserScore);
      }
    });
  }, []);

  const handleLogin = (user: UserData) => {
    setUserData(user);
    import('../utils/storage').then(({ userStorage }) => {
      userStorage.setUserData(user);
    });
    setChatState('survey');
    setLastActiveState('survey'); // Update last active state
  };

  const handleSurveyComplete = (level: string, score: number, welcomeMessage: string) => {
    setUserLevel(level);
    setUserScore(score);
    
    // Add welcome message to chat history
    const welcomeMsg: ChatMessage = {
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date(),
    };
    const newHistory = [welcomeMsg];
    setChatHistory(newHistory);
    
    import('../utils/storage').then(({ userStorage }) => {
      userStorage.setUserLevel(level);
      userStorage.setUserScore(score);
      userStorage.setChatHistory(newHistory);
    });
    
    setChatState('chat');
    setLastActiveState('chat'); // Update last active state
  };

  const handleNewMessage = (message: ChatMessage) => {
    const newHistory = [...chatHistory, message];
    setChatHistory(newHistory);
    import('../utils/storage').then(({ userStorage }) => {
      userStorage.setChatHistory(newHistory);
    });
  };

  const handleReset = () => {
    import('../utils/storage').then(({ userStorage }) => {
      userStorage.clearAll();
    });
    setUserData(null);
    setChatHistory([]);
    setUserLevel('');
    setUserScore(0);
    setChatState('login');
    setLastActiveState('login'); // Update last active state
  };

  const toggleWidget = () => {
    if (chatState === 'closed') {
      // Reopen to the last active state
      setChatState(lastActiveState);
    } else {
      // Save current state before closing
      setLastActiveState(chatState);
      setChatState('closed');
    }
    setSizeMode('normal');
  };

  const toggleMinimize = () => {
    // If already minimized, go back to normal
    if (sizeMode === 'minimized') {
      setSizeMode('normal');
    } 
    // If maximized, go to normal
    else if (sizeMode === 'maximized') {
      setSizeMode('normal');
    }
    // If normal, go to minimized
    else {
      setSizeMode('minimized');
    }
  };

  const toggleMaximize = () => {
    // If already maximized, go back to normal
    if (sizeMode === 'maximized') {
      setSizeMode('normal');
    }
    // If minimized or normal, go to maximized
    else {
      setSizeMode('maximized');
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      <AnimatePresence>
        {chatState === 'closed' && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={toggleWidget}
            className="
              fixed bottom-6 right-6 z-50
              w-16 h-16 rounded-full
              tm-gradient shadow-2xl
              flex items-center justify-center
              text-white text-2xl
              ios-transition hover:scale-110
              pulse-glow
            "
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Widget Panel */}
      <AnimatePresence>
        {chatState !== 'closed' && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ 
              x: 0, 
              opacity: 1
            }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`
              fixed z-50 flex flex-col
              glass-morphism shadow-2xl chat-widget
              ${sizeMode === 'maximized' 
                ? 'inset-0 rounded-none' 
                : 'bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] rounded-3xl'
              }
              ${sizeMode === 'minimized' 
                ? 'top-auto h-[60px] overflow-hidden' 
                : sizeMode === 'normal' 
                ? 'top-6 h-[80vh] max-h-[600px]' 
                : 'h-screen'
              }
            `}
          >
            {/* Header - Always visible and fixed */}
            <div className={`flex-shrink-0 relative ${sizeMode === 'maximized' ? '' : 'rounded-t-3xl'} overflow-hidden`}>
              {/* Header Background with Gradient */}
              <div className="absolute inset-0 tm-gradient opacity-90"></div>
              <div className="absolute inset-0 bg-white/20 backdrop-blur-xl"></div>
              
              {/* Header Content */}
              <div className="relative flex items-center justify-between p-4 border-b border-white/20">
                <div className="flex items-center space-x-4">
                  {/* Enhanced Logo */}
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                      <div className="w-8 h-8 bg-gradient-to-br from-white to-white/80 rounded-xl flex items-center justify-center">
                        <span className="text-tm-blue text-sm font-bold">TM</span>
                      </div>
                    </div>
                    {/* Online Status Indicator */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                  </motion.div>
                  
                  {/* Title and User Info */}
                  <div className="flex-1">
                    <motion.h3 
                      className="font-bold text-white text-lg tracking-tight"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      TM AI Assistant
                    </motion.h3>
                    {userData && sizeMode !== 'minimized' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <p className="text-white/90 text-sm font-medium">
                          {userData.name}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
                
                {/* Control Buttons */}
                <div className="flex items-center space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleMinimize}
                    className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 ios-transition shadow-lg text-white"
                    title={sizeMode === 'minimized' ? "Restore" : "Minimize"}
                  >
                    {sizeMode === 'minimized' ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleMaximize}
                    className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 ios-transition shadow-lg text-white"
                    title={sizeMode === 'maximized' ? "Restore" : "Maximize"}
                  >
                    {sizeMode === 'maximized' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      borderColor: 'rgba(239, 68, 68, 0.4)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleWidget}
                    className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-red-400/40 ios-transition shadow-lg text-white hover:text-red-300"
                    title="Close"
                  >
                    <X size={14} />
                  </motion.button>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {sizeMode !== 'minimized' && (
                <motion.div
                  key={chatState}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 overflow-hidden"
                >
                  {chatState === 'login' && (
                    <LoginForm 
                      onLogin={handleLogin} 
                      isMaximized={sizeMode === 'maximized'}
                    />
                  )}
                  
                  {chatState === 'survey' && userData && (
                    <SurveyForm 
                      userData={userData} 
                      onComplete={handleSurveyComplete}
                      isMaximized={sizeMode === 'maximized'}
                    />
                  )}
                  
                  {chatState === 'chat' && userData && (
                    <ChatInterface
                      userData={userData}
                      chatHistory={chatHistory}
                      userLevel={userLevel}
                      userScore={userScore}
                      onNewMessage={handleNewMessage}
                      onReset={handleReset}
                      isMaximized={sizeMode === 'maximized'}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}