import { sanitizeErrorMessage } from './errorMessages';

export function extractErrorMessages(error, defaultMsg = "Something went wrong") {
  // Handle validation errors (object with multiple fields)
  if (
    error?.response?.data?.error &&
    typeof error.response.data.error === "object"
  ) {
    const messages = Object.values(error.response.data.error)
      .flat()
      .join(", ");
    
    // Sanitize the combined validation messages
    return sanitizeErrorMessage(messages, defaultMsg);
  }

  // Sanitize all other error messages
  return sanitizeErrorMessage(error, defaultMsg);
}
