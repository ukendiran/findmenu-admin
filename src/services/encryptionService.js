import CryptoJS from 'crypto-js';

const secretKey = 'findmenu'; // Replace with a strong, secure key

const EncryptionService = {
  /**
   * Encrypt a string using AES encryption.
   * @param {string} text - The text to encrypt.
   * @returns {string|null} The encrypted string, or null if encryption fails.
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
   * @param {string} encryptedText - The encrypted string to decrypt.
   * @returns {string|null} The decrypted string, or null if decryption fails.
   */
  decrypt: (encryptedText) => {
    try {
      // Validate input
      if (!encryptedText || typeof encryptedText !== 'string') {
        console.error('Invalid input: encryptedText must be a non-empty string');
        return null;
      }

      // Check if the encrypted text looks like a valid CryptoJS encrypted string
      // Valid encrypted strings should be base64-encoded and contain specific characters
      if (!/^[A-Za-z0-9+/]+=*$/.test(encryptedText)) {
        console.error('Invalid encrypted text format');
        return null;
      }

      const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
      
      // Check if decryption was successful
      if (!bytes || bytes.sigBytes <= 0) {
        console.error('Decryption failed: invalid encrypted text or wrong key');
        return null;
      }

      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      
      // Additional check to ensure we got valid UTF-8 text
      if (!decryptedText) {
        console.error('Decryption failed: result is not valid UTF-8');
        return null;
      }

      return decryptedText;
    } catch (error) {
      console.error('Decryption failed:', error.message);
      return null;
    }
  },

  /**
   * Validate if a string is a valid encrypted text that can be decrypted.
   * @param {string} encryptedText - The encrypted string to validate.
   * @returns {boolean} True if the string appears to be valid encrypted text.
   */
  isValidEncryptedText: (encryptedText) => {
    if (!encryptedText || typeof encryptedText !== 'string') {
      return false;
    }

    // Basic format check
    if (!/^[A-Za-z0-9+/]+=*$/.test(encryptedText)) {
      return false;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
      return bytes && bytes.sigBytes > 0;
    } catch (error) {
      console.log(error)
      return false;
    }
  }
};

export default EncryptionService;