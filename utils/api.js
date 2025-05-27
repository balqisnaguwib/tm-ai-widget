// utils/api.js
import axios from 'axios';
import { formatMessage } from './messageUtils';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const API_TOKEN = 'SDDFDSFn1232evje34fnc4SDASDSF5vuiqSDFabcj678ksbcjbnsjka89SDFDS898sdf';

// Enable or disable debug logs
const DEBUG = process.env.NODE_ENV === 'development';

/**
 * Log function that only logs in development mode
 */
const debugLog = (...args) => {
  if (DEBUG) {
    console.log(...args);
  }
};

// Create an axios instance with enhanced config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`
  },
  timeout: 30000, // 30 second timeout
  // Ensure withCredentials is false for cross-origin requests
  withCredentials: false
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(config => {
  debugLog(`API Request to: ${config.url}`, config);
  return config;
}, error => {
  console.error('API Request Error:', error);
  return Promise.reject(error);
});

// Add response interceptor for debugging
apiClient.interceptors.response.use(response => {
  debugLog('API Response:', response.data);
  return response;
}, error => {
  console.error('API Response Error:', error);
  // Network errors won't have a response
  if (!error.response && error.code === 'ECONNABORTED') {
    console.error('Request timeout. Server might be overloaded or unreachable.');
  } else if (!error.response) {
    console.error('Network error. Check if the API server is running and accessible.');
  }
  return Promise.reject(error);
});

/**
 * Retry a failed request with exponential backoff
 * @param {Function} apiFn - The API function to retry
 * @param {Array} args - Arguments to pass to the API function
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise} - Promise that resolves with the API response
 */
const retryRequest = async (apiFn, args, maxRetries = 3, delay = 1000) => {
  try {
    return await apiFn(...args);
  } catch (error) {
    // Only retry network errors, not HTTP errors (4xx, 5xx)
    if (maxRetries > 0 && (!error.response || error.code === 'ECONNABORTED')) {
      debugLog(`Retrying request... (${maxRetries} attempts left)`);
      
      // Wait with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry with increased delay
      return retryRequest(apiFn, args, maxRetries - 1, delay * 2);
    }
    
    throw error;
  }
};

// Function to check API health/status
export const checkApiStatus = async () => {
  try {
    // Most APIs have a health check endpoint like /health or /status
    // Adjust this to match your API's health endpoint
    const response = await apiClient.get('/health', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
};

// Function to send a chat message with retry logic
export const sendChatMessage = async (tmId, message, answers = [], chatHistory = []) => {
  debugLog('Sending chat message:', { tmId, message, answers });
  
  // First check if we can reach the server (optional)
  // const isApiAvailable = await checkApiStatus();
  // if (!isApiAvailable) {
  //   throw new Error('API server is unavailable. Please try again later.');
  // }
  
  try {
    // Make the API request with retry logic
    const makeRequest = async () => {
      return await apiClient.post('/chat', {
        tm_id: tmId,
        message,
        answers,
        chat_history: chatHistory
      });
    };
    
    // Use retry logic for the request
    const response = await retryRequest(makeRequest, [], 2);
    
    // Debug log the response
    debugLog('API Response processed:', response.data);
    
    // Ensure message is consistently formatted
    if (response.data && response.data.message) {
      // Check if message is already an object (from updated backend)
      if (typeof response.data.message === 'object' && response.data.message.content) {
        // It's already an object with role and content, use as is
        return response.data;
      }
      
      // Format the message property but preserve the original object structure
      const originalMessage = response.data.message;
      response.data.message = formatMessage(originalMessage);
      
      // If the message was transformed, log it
      if (DEBUG && originalMessage !== response.data.message) {
        console.warn('Message format normalized:', { 
          original: originalMessage, 
          formatted: response.data.message 
        });
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    
    // Provide a more helpful error message
    if (error.code === 'ECONNABORTED') {
      throw new Error('The request timed out. The server might be overloaded.');
    } else if (!error.response) {
      throw new Error('Could not connect to the API server. Please check your network connection or the server status.');
    } else if (error.response) {
      // Return error from server if available
      throw new Error(`Server error: ${error.response.status} ${error.response.statusText}`);
    }
    
    throw error;
  }
};

// Function to register a user for TM AI Day
export const registerUser = async (tmId, lob, objective) => {
  try {
    // We'll use the same chat endpoint but with specific registration parameters
    const response = await apiClient.post('/chat', {
      tm_id: tmId,
      message: "register",
      lob,
      objective,
      // Include empty answers to maintain backward compatibility
      answers: []
    });
    
    debugLog('Registration Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Function to validate if a tm_id is valid (this would connect to your backend)
// For demo purposes, we'll just check if it's not empty
export const validateTmId = (tmId) => {
  return tmId && tmId.trim() !== '';
};

// Mock function to check if browser supports localStorage
export const checkBrowserSupport = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    return false;
  }
};

// Store user session
export const storeUserSession = (tmId) => {
  if (checkBrowserSupport()) {
    localStorage.setItem('tm_user_id', tmId);
  }
};

// Get stored user session
export const getUserSession = () => {
  if (checkBrowserSupport()) {
    return localStorage.getItem('tm_user_id');
  }
  return null;
};

// Clear user session
export const clearUserSession = () => {
  if (checkBrowserSupport()) {
    localStorage.removeItem('tm_user_id');
  }
};