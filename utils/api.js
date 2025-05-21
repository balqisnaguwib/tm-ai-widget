// utils/api.js
import axios from 'axios';

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

// Function to send a chat message
export const sendChatMessage = async (tmId, message, answers = []) => {
  try {
    const response = await apiClient.post('/chat', {
      tm_id: tmId,
      message,
      answers
    });
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
