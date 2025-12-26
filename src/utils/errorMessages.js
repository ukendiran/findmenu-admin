/**
 * Error Message Sanitization Utility
 * Prevents system errors from being displayed to users
 */

import { isCanceledError } from '../../../shared/utils/requestCancellation';

// List of technical error patterns that should not be shown to users
const TECHNICAL_ERROR_PATTERNS = [
  /ERR_/i,
  /ECONNREFUSED/i,
  /ETIMEDOUT/i,
  /Network Error/i,
  /Request failed/i,
  /status code \d+/i,
  /axios/i,
  /fetch/i,
  /XMLHttpRequest/i,
  /CORS/i,
  /undefined/i,
  /null/i,
  /Cannot read property/i,
  /is not a function/i,
  /Unexpected token/i,
  /JSON/i,
  /SyntaxError/i,
  /TypeError/i,
  /ReferenceError/i,
];

// User-friendly error messages by category
const FRIENDLY_MESSAGES = {
  network: 'Unable to connect. Please check your internet connection and try again.',
  server: 'Something went wrong. Please try again later.',
  validation: 'Please check your input and try again.',
  notFound: 'The requested information could not be found.',
  unauthorized: 'You do not have permission to perform this action.',
  timeout: 'The request took too long. Please try again.',
  default: 'An error occurred. Please try again.',
};

/**
 * Check if an error message contains technical details
 */
function isTechnicalError(message) {
  if (!message) return false;
  return TECHNICAL_ERROR_PATTERNS.some(pattern => pattern.test(message));
}

/**
 * Get user-friendly error message based on error type
 */
function getFriendlyMessage(error) {
  // Check HTTP status codes
  const status = error?.response?.status || error?.status;
  
  if (status === 404) return FRIENDLY_MESSAGES.notFound;
  if (status === 401 || status === 403) return FRIENDLY_MESSAGES.unauthorized;
  if (status === 408 || status === 504) return FRIENDLY_MESSAGES.timeout;
  if (status >= 500) return FRIENDLY_MESSAGES.server;
  if (status >= 400 && status < 500) return FRIENDLY_MESSAGES.validation;
  
  // Check error codes
  if (error?.code === 'ECONNREFUSED' || error?.code === 'ERR_NETWORK') {
    return FRIENDLY_MESSAGES.network;
  }
  
  if (error?.code === 'ETIMEDOUT' || error?.code === 'ERR_TIMEOUT') {
    return FRIENDLY_MESSAGES.timeout;
  }
  
  return FRIENDLY_MESSAGES.default;
}

/**
 * Sanitize error message for user display
 * Removes technical details and returns user-friendly message
 */
export function sanitizeErrorMessage(error, fallbackMessage) {
  // If error is a string
  if (typeof error === 'string') {
    if (isTechnicalError(error)) {
      return fallbackMessage || FRIENDLY_MESSAGES.default;
    }
    return error;
  }
  
  // Extract message from error object
  const errorMessage = 
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    '';
  
  // If message contains technical details, return friendly message
  if (isTechnicalError(errorMessage)) {
    return getFriendlyMessage(error);
  }
  
  // If message is user-friendly, return it
  if (errorMessage && errorMessage.length > 0 && errorMessage.length < 200) {
    return errorMessage;
  }
  
  // Return fallback or default friendly message
  return fallbackMessage || getFriendlyMessage(error);
}

/**
 * Get error description for notifications
 * Returns undefined if message should not have description
 */
export function getErrorDescription(error) {
  const message = error?.response?.data?.message || error?.message || '';
  
  // Don't show description for technical errors
  if (isTechnicalError(message)) {
    return undefined;
  }
  
  // Return description if it's user-friendly and different from message
  const description = error?.response?.data?.description || error?.description;
  if (description && description !== message && !isTechnicalError(description)) {
    return description;
  }
  
  return undefined;
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors) {
  const formatted = {};
  
  Object.entries(errors).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formatted[key] = value[0]; // Take first error message
    } else {
      formatted[key] = value;
    }
  });
  
  return formatted;
}

/**
 * Check if error should be logged (for debugging)
 */
export function shouldLogError(error) {
  // Use shared cancellation error detection
  return !isCanceledError(error);
}

/**
 * Re-export cancellation error detection for convenience
 */
export { isCanceledError } from '../../../shared/utils/requestCancellation';
