import { createSlice } from '@reduxjs/toolkit';
import EncryptionService from '../../services/encryptionService';
import {decryptToken} from "../../services/validateToken"

// Retrieve initial state from localStorage with decryption
const getInitialState = () => {
  const storedAuth = localStorage.getItem('isAuthenticated');
  const storedToken = localStorage.getItem('token');  
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
      state.token = action.payload.token;
      // Save to localStorage with encryption
      localStorage.setItem('isAuthenticated', JSON.stringify(true));
      localStorage.setItem('token', EncryptionService.encrypt(action.payload.token));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      // Clear localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
