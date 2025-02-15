import CryptoJS from 'crypto-js';

const secretKey = 'your-secret-key'; // Replace with a strong, secure key

const EncryptionService = {
  /**
   * Encrypt a string using AES encryption.
   * @param {string} text - The text to encrypt.
   * @returns {string} The encrypted string.
   */
  encrypt: (text) => {
    try {
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
      const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  },
};

export default EncryptionService;