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
              opacity: 1,
              height: sizeMode === 'minimized' ? '60px' : 'auto'
            }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`
              fixed z-50 
              glass-morphism shadow-2xl overflow-hidden chat-widget
              ${sizeMode === 'maximized' 
                ? 'inset-0 rounded-none' 
                : 'bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] rounded-3xl'
              }
              ${sizeMode === 'minimized' ? 'top-auto h-[60px]' : sizeMode === 'normal' ? 'top-6' : ''}
            `}
          >
            {/* Header - Always visible */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 tm-gradient rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">TM</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    TM AI Assistant
                  </h3>
                  {userData && (
                    <p className="text-xs text-gray-500">
                      Welcome, {userData.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMinimize}
                  className="p-2 rounded-full hover:bg-white/10 ios-transition"
                  title={sizeMode === 'minimized' ? "Restore" : "Minimize"}
                >
                  {sizeMode === 'minimized' ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button
                  onClick={toggleMaximize}
                  className="p-2 rounded-full hover:bg-white/10 ios-transition"
                  title={sizeMode === 'maximized' ? "Restore" : "Maximize"}
                >
                  {sizeMode === 'maximized' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={toggleWidget}
                  className="p-2 rounded-full hover:bg-white/10 ios-transition"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
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
                  className={`h-full ${sizeMode === 'maximized' ? 'max-h-[calc(100vh-4rem)]' : ''}`}
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