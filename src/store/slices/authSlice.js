import { createSlice } from '@reduxjs/toolkit';
import EncryptionService from '../../services/encryptionService';

// Retrieve initial state from localStorage with decryption
const getInitialState = () => {
  const storedAuth = localStorage.getItem('isAuthenticated');
  const storedSubscription = localStorage.getItem('isSubscribed');
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const storedConfig = localStorage.getItem('config');
  const storedBusiness = localStorage.getItem('business');

  try {
    if (storedToken) {
      return {
        isAuthenticated: storedAuth ? JSON.parse(EncryptionService.decrypt(storedAuth)) : false,
        isSubscribed: storedSubscription ? JSON.parse(EncryptionService.decrypt(storedSubscription)) : false,
        user: storedUser ? JSON.parse(EncryptionService.decrypt(storedUser)) : null,
        config: storedConfig ? JSON.parse(EncryptionService.decrypt(storedConfig)) : null,
        business: storedBusiness ? JSON.parse(EncryptionService.decrypt(storedBusiness)) : null,
        token: EncryptionService.decrypt(storedToken),
      };
    }
  } catch (error) {
    console.error('Error decrypting stored data:', error);
    // Clear corrupted data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isSubscribed');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('config');
    localStorage.removeItem('business');
  }

  return {
    isAuthenticated: false,
    isSubscribed: false,
    token: null,
    user: null,
    config: null,
    business: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    login(state, action) {
      const { token, user, config, business, isSubscribed = false } = action.payload;

      state.isAuthenticated = true;
      state.isSubscribed = isSubscribed;
      state.token = token;
      state.user = user;
      state.config = config;
      state.business = business;

      // Save to localStorage with encryption
      localStorage.setItem('isAuthenticated', EncryptionService.encrypt(JSON.stringify(true)));
      localStorage.setItem('isSubscribed', EncryptionService.encrypt(JSON.stringify(isSubscribed)));
      localStorage.setItem('token', EncryptionService.encrypt(token));
      localStorage.setItem('user', EncryptionService.encrypt(JSON.stringify(user)));
      localStorage.setItem('config', EncryptionService.encrypt(JSON.stringify(config)));
      localStorage.setItem('business', EncryptionService.encrypt(JSON.stringify(business)));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.isSubscribed = false;
      state.user = null;
      state.token = null;
      state.config = null;
      state.business = null;

      // Clear localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isSubscribed');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('config');
      localStorage.removeItem('business');
    },
    updateUser(state, action) {
      state.user = action.payload;
      localStorage.setItem('user', EncryptionService.encrypt(JSON.stringify(action.payload)));
    },
    updateConfig(state, action) {
      state.config = action.payload;
      localStorage.setItem('config', EncryptionService.encrypt(JSON.stringify(action.payload)));
    },
    updateBusiness(state, action) {
      state.business = action.payload;
      localStorage.setItem('business', EncryptionService.encrypt(JSON.stringify(action.payload)));
    },
    updateSubscription(state, action) {
      state.isSubscribed = action.payload;
      localStorage.setItem('isSubscribed', EncryptionService.encrypt(JSON.stringify(action.payload)));
    }
  },
});

export const { login, logout, updateUser, updateConfig, updateBusiness, updateSubscription } = authSlice.actions;
export default authSlice.reducer;