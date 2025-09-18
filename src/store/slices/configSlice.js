import { createSlice } from '@reduxjs/toolkit';
import EncryptionService from '../../services/encryptionService';

// Retrieve initial config state from localStorage
const getInitialConfigState = () => {
  const storedConfig = localStorage.getItem('config');
  
  return {
    data: storedConfig ? JSON.parse(EncryptionService.decrypt(storedConfig)) : {},
    loading: false,
    error: null,
  };
};

const configSlice = createSlice({
  name: 'config',
  initialState: getInitialConfigState(),
  reducers: {
    setConfig(state, action) {
      state.data = action.payload;
      state.error = null;
      localStorage.setItem('config', EncryptionService.encrypt(JSON.stringify(action.payload)));
      state.loading = false;
    },
    updateConfig(state, action) {
      state.data = { ...state.data, ...action.payload };
      localStorage.setItem('config', EncryptionService.encrypt(JSON.stringify(state.data)));
      state.loading = false;
    },
    setConfigLoading(state, action) {
      state.loading = action.payload;
    },
    setConfigError(state, action) {
      state.error = action.payload;
    },
    clearConfig(state) {
      state.data = {};
      state.loading = false;
      state.error = null;
      localStorage.removeItem('config');
    }
  },
});

export const { setConfig, updateConfig, setConfigLoading, setConfigError, clearConfig } = configSlice.actions;
export default configSlice.reducer;