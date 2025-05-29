// Safe localStorage utilities that work with SSR
export const storage = {
    get: (key: string): string | null => {
      if (typeof window === 'undefined') return null;
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('localStorage not available:', error);
        return null;
      }
    },
  
    set: (key: string, value: string): boolean => {
      if (typeof window === 'undefined') return false;
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (error) {
        console.warn('localStorage not available:', error);
        return false;
      }
    },
  
    remove: (key: string): boolean => {
      if (typeof window === 'undefined') return false;
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.warn('localStorage not available:', error);
        return false;
      }
    },
  
    clear: (): boolean => {
      if (typeof window === 'undefined') return false;
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.warn('localStorage not available:', error);
        return false;
      }
    },
  };
  
  // Specific keys used in the app
  export const STORAGE_KEYS = {
    USER_DATA: 'tm-ai-user-data',
    CHAT_HISTORY: 'tm-ai-chat-history',
    USER_LEVEL: 'tm-ai-user-level',
    USER_SCORE: 'tm-ai-user-score',
  } as const;
  
  // Type-safe storage functions for specific data
  export const userStorage = {
    getUserData: () => {
      const data = storage.get(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    },
  
    setUserData: (userData: any) => {
      return storage.set(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    },
  
    getChatHistory: () => {
      const data = storage.get(STORAGE_KEYS.CHAT_HISTORY);
      return data ? JSON.parse(data) : [];
    },
  
    setChatHistory: (chatHistory: any[]) => {
      return storage.set(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(chatHistory));
    },
  
    getUserLevel: () => {
      return storage.get(STORAGE_KEYS.USER_LEVEL) || '';
    },
  
    setUserLevel: (level: string) => {
      return storage.set(STORAGE_KEYS.USER_LEVEL, level);
    },
  
    getUserScore: () => {
      const score = storage.get(STORAGE_KEYS.USER_SCORE);
      return score ? parseInt(score) : 0;
    },
  
    setUserScore: (score: number) => {
      return storage.set(STORAGE_KEYS.USER_SCORE, score.toString());
    },
  
    clearAll: () => {
      storage.remove(STORAGE_KEYS.USER_DATA);
      storage.remove(STORAGE_KEYS.CHAT_HISTORY);
      storage.remove(STORAGE_KEYS.USER_LEVEL);
      storage.remove(STORAGE_KEYS.USER_SCORE);
    },
  };