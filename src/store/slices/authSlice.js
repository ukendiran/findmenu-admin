import { createSlice } from '@reduxjs/toolkit';
import EncryptionService from '../../services/encryptionService';
import {decryptToken} from "../../services/validateToken"

// Retrieve initial state from localStorage with decryption
const getInitialState = () => {
  const storedAuth = localStorage.getItem('isAuthenticated');
  const storedToken = localStorage.getItem('token');  
  const storedUser = localStorage.getItem('user');  
  const storedConfig = localStorage.getItem('config');  
  const storedBusiness = localStorage.getItem('business');  
  if(storedToken){
    const token = EncryptionService.decrypt(storedToken)
    const dcreptedToken = decryptToken(token)

    return {
      isAuthenticated: storedAuth ? JSON.parse(storedAuth) : false,
      user: storedUser ? JSON.parse(storedUser) : [],
      config: storedConfig ? JSON.parse(storedConfig) : [],
      business: storedBusiness ? JSON.parse(storedBusiness) : [],
      token: dcreptedToken
    };
  }else{
    return {
      isAuthenticated:  false,
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
      localStorage.setItem('isAuthenticated', JSON.stringify(true));
      localStorage.setItem('token', EncryptionService.encrypt(action.payload.token));
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('config', JSON.stringify(action.payload.config));
      localStorage.setItem('business', JSON.stringify(action.payload.business));
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
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
