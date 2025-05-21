// utils/messageUtils.js
/**
 * Utility functions for message handling and formatting
 */

/**
 * Formats message data to ensure it's in a consistent string format
 * @param {any} messageData - The message data to format (could be string, object, null, etc.)
 * @returns {string} - The formatted message string
 */
export const formatMessage = (messageData) => {
  // Handle undefined/null case
  if (messageData === undefined || messageData === null) {
    return '';
  }
  
  // Handle string case
  if (typeof messageData === 'string') {
    return messageData;
  }
  
  // Handle object case
  if (typeof messageData === 'object') {
    // Try to extract text from common object structures
    if (messageData.text) {
      return messageData.text;
    } else if (messageData.content) {
      return messageData.content;
    } else if (messageData.message) {
      return messageData.message;
    } else {
      try {
        return JSON.stringify(messageData, null, 2);
      } catch (error) {
        console.error('Error stringifying message object:', error);
        return '[Complex object]';
      }
    }
  }
  
  // Handle other types (number, boolean, etc.)
  return String(messageData);
};

/**
 * Parse multiple choice options from a message text
 * @param {string} messageText - The message text to parse
 * @returns {string[]} - Array of option strings
 */
export const parseOptions = (messageText) => {
  const formattedText = formatMessage(messageText);
  const options = [];
  
  if (!formattedText) {
    return options;
  }
  
  const lines = formattedText.split('\n');
  
  // Extract options (A., B., C., D. format)
  for (const line of lines) {
    if (line.match(/^[A-D]\.\s/)) {
      options.push(line.trim());
    }
  }
  
  return options;
};

/**
 * Checks if a response contains a valid message
 * @param {object} response - The API response object
 * @returns {boolean} - Whether the response has a valid message
 */
export const hasValidMessage = (response) => {
  return response && (
    response.message !== undefined || 
    typeof response === 'string' ||
    (typeof response === 'object' && !response.competency_status)
  );
};

/**
 * Extracts the message content from a response
 * @param {object} response - The API response object
 * @returns {string} - The extracted message content
 */
export const extractMessageFromResponse = (response) => {
  if (!response) {
    return '';
  }
  
  if (response.message !== undefined) {
    return response.message;
  } else if (typeof response === 'string') {
    return response;
  } else if (typeof response === 'object' && !response.competency_status) {
    return response;
  }
  
  return '';
};

/**
 * Checks if a text contains an image URL
 * @param {string} text - Text to check for image URLs
 * @returns {boolean} - Whether the text contains an image URL
 */
export const containsImageUrl = (text) => {
  if (!text || typeof text !== 'string') return false;
  
  // Check for common image extensions
  const imageExtensionRegex = /https?:\/\/\S+\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?(\s|$)/i;
  
  // Enhanced regex for Google Drive URLs - matches various formats including preview and download
  const driveUrlRegex = /https?:\/\/(drive\.google\.com|drive\.usercontent\.google\.com)\/(file\/d\/|download\?id=|uc\?id=|thumbnail\?id=)[\w-]+/i;
  
  return imageExtensionRegex.test(text) || driveUrlRegex.test(text);
};

/**
 * Extracts image URL from text
 * @param {string} text - Text containing an image URL
 * @returns {string|null} - The extracted image URL or null if not found
 */
export const extractImageUrl = (text) => {
  if (!text || typeof text !== 'string') return null;
  
  // Try to match standard image URLs first
  const imageMatch = text.match(/https?:\/\/\S+\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?[^"'\s]*)?/i);
  if (imageMatch) return imageMatch[0];
  
  // Enhanced regex for Google Drive URLs with any combination of parameters
  const driveMatch = text.match(/https?:\/\/(drive\.google\.com|drive\.usercontent\.google\.com)\/(file\/d\/|download\?id=|uc\?id=|thumbnail\?id=)[\w-]+(&[^=\s]+=[^&\s]+)*/i);
  if (driveMatch) return driveMatch[0];
  
  return null;
};

/**
 * Extracts Google Drive file ID from a URL
 * @param {string} url - URL potentially containing a Google Drive file ID
 * @returns {string|null} - The extracted file ID or null if not found
 */
export const extractGoogleDriveId = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  // Check various Google Drive URL formats
  let match;
  
  // Format: https://drive.google.com/file/d/FILE_ID/...
  match = url.match(/\/file\/d\/([\w-]+)/i);
  if (match) return match[1];
  
  // Format: https://drive.usercontent.google.com/download?id=FILE_ID...
  match = url.match(/[\?&]id=([\w-]+)/i);
  if (match) return match[1];
  
  // Format: https://drive.google.com/uc?id=FILE_ID...
  match = url.match(/\/uc\?id=([\w-]+)/i);
  if (match) return match[1];
  
  // Format: https://drive.google.com/thumbnail?id=FILE_ID...
  match = url.match(/\/thumbnail\?id=([\w-]+)/i);
  if (match) return match[1];
  
  return null;
};
