import { createSlice } from '@reduxjs/toolkit';
import EncryptionService from '../../services/encryptionService';
// import {decryptToken} from "../../services/validateToken"

// Retrieve initial state from localStorage with decryption
const getInitialState = () => {
  const storedAuth = localStorage.getItem('isAuthenticated');
  const storedToken = localStorage.getItem('token');  
  const storedUser = localStorage.getItem('user');  
  const storedConfig = localStorage.getItem('config');  
  const storedBusiness = localStorage.getItem('business');  
  if(storedToken){
    return {
      isAuthenticated: storedAuth ? storedAuth : EncryptionService.encrypt(false),
      user: storedUser ? JSON.parse(EncryptionService.decrypt(storedUser)) : [],
      config: storedConfig ? JSON.parse(EncryptionService.decrypt(storedConfig)) : [],
      business: storedBusiness ? JSON.parse(EncryptionService.decrypt(storedBusiness)) : [],
      token: EncryptionService.decrypt(storedToken),
    };
  }else{
    return {
      isAuthenticated:  EncryptionService.encrypt(false),
      token: null,
      storedUser: [],
      storedConfig: [],
      storedBusiness: [],
    };
  }  
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      // Save to localStorage with encryption
      localStorage.setItem('isAuthenticated', EncryptionService.encrypt(JSON.stringify(true)));
      localStorage.setItem('token', EncryptionService.encrypt(action.payload.token));
      localStorage.setItem('user', EncryptionService.encrypt(JSON.stringify(action.payload.user)));
      localStorage.setItem('config', EncryptionService.encrypt(JSON.stringify(action.payload.config)));
      localStorage.setItem('business', EncryptionService.encrypt(JSON.stringify(action.payload.business)));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.config = null;
      state.business = null;

      // Clear localStorage
      localStorage.removeItem('isAuthenticated');
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
    }
  },
});

export const { login, logout,updateUser,updateConfig,updateBusiness } = authSlice.actions;
export default authSlice.reducer;
