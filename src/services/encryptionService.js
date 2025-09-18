import CryptoJS from 'crypto-js';

// Option 1: Load from environment variables (recommended)
// const secretKey = process.env.VITE_JWT_SECRET_KEY || 'fallback-secret-key'; // For Vite
// OR
const secretKey = import.meta.env.VITE_JWT_SECRET_KEY || 'findmenu'; // Vite alternative

// Option 2: Hardcode (only for testing - never commit this!)
// const secretKey = 'your-strong-secret-key-here';

const EncryptionService = {
  /**
   * Encrypt a string using AES encryption.
   */
  encrypt: (text) => {
    try {
      if (!text || typeof text !== 'string') {
        console.error('Invalid input: text must be a non-empty string');
        return null;
      }
      return CryptoJS.AES.encrypt(text, secretKey).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return null;
    }
  },

  /**
   * Decrypt an AES-encrypted string.
   */
  decrypt: (encryptedText) => {
    try {
      if (!encryptedText || typeof encryptedText !== 'string') {
        console.error('Invalid input: encryptedText must be a non-empty string');
        return null;
      }

      const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedText) {
        console.error('Decryption failed: invalid key or corrupted data');
        return null;
      }
      
      return decryptedText;
    } catch (error) {
      console.error('Decryption failed:', error.message);
      return null;
    }
  },

  /**
   * Validate encrypted text format.
   */
  isValidEncryptedText: (encryptedText) => {
    if (!encryptedText || typeof encryptedText !== 'string') return false;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
      return bytes.sigBytes > 0;
    } catch {
      return false;
    }
  }
};

export default EncryptionService;