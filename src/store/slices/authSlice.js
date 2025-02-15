import { createSlice } from '@reduxjs/toolkit';
import EncryptionService from '../../services/encryptionService';
import {decryptToken} from "../../services/validateToken"

// Retrieve initial state from localStorage with decryption
const getInitialState = () => {
  const storedAuth = localStorage.getItem('isAuthenticated');
  const storedToken = localStorage.getItem('token');
  // const storedUser = localStorage.getItem('user');   
  // const storedConfig = localStorage.getItem('config');   
  if(storedToken){
    const token = EncryptionService.decrypt(storedToken)
    const dcreptedToken = decryptToken(token)

    return {
      isAuthenticated: storedAuth ? JSON.parse(storedAuth) : false,
      token: dcreptedToken
    };
  }else{
    return {
      isAuthenticated:  false,
      token: null
    };
  }
  

  
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.config = action.payload.config;
      // Save to localStorage with encryption
      localStorage.setItem('isAuthenticated', JSON.stringify(true));
      localStorage.setItem('token', EncryptionService.encrypt(action.payload.token));
      // localStorage.setItem('user', EncryptionService.encrypt(JSON.stringify(action.payload.user)));
      // localStorage.setItem('config', EncryptionService.encrypt(JSON.stringify(action.payload.config)));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      // Clear localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('token');
      // localStorage.removeItem('user');
      // localStorage.removeItem('config');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
