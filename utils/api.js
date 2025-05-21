// utils/api.js
import axios from 'axios';
import { formatMessage } from './messageUtils';

// Replace with your actual API endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const API_TOKEN = 'SDDFDSFn1232evje34fnc4SDASDSF5vuiqSDFabcj678ksbcjbnsjka89SDFDS898sdf';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`
  }
});

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

// Function to send a chat message
export const sendChatMessage = async (tmId, message, answers = []) => {
  try {
    const response = await apiClient.post('/chat', {
      tm_id: tmId,
      message,
      answers
    });
    
    // Debug log the response
    debugLog('API Response:', response.data);
    
    // Ensure message is consistently formatted
    if (response.data && response.data.message) {
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
