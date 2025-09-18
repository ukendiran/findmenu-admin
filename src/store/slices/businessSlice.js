import { createSlice } from '@reduxjs/toolkit';
import EncryptionService from '../../services/encryptionService';

// Retrieve initial business state from localStorage
const getInitialBusinessState = () => {
  const storedBusiness = localStorage.getItem('business');
  
  return {
    data: storedBusiness ? JSON.parse(EncryptionService.decrypt(storedBusiness)) : {},
    loading: false,
    error: null,
  };
};

const businessSlice = createSlice({
  name: 'business',
  initialState: getInitialBusinessState(),
  reducers: {
    setBusiness(state, action) {
      state.data = action.payload;
      state.error = null;
      localStorage.setItem('business', EncryptionService.encrypt(JSON.stringify(action.payload)));
      state.loading = false;
    },
    updateBusiness(state, action) {
      state.data = { ...state.data, ...action.payload };
      localStorage.setItem('business', EncryptionService.encrypt(JSON.stringify(state.data)));
      state.loading = false;
    },
    setBusinessLoading(state, action) {
      state.loading = action.payload;
    },
    setBusinessError(state, action) {
      state.error = action.payload;
    },
    clearBusiness(state) {
      state.data = {};
      state.loading = false;
      state.error = null;
      localStorage.removeItem('business');
    }
  },
});

export const { setBusiness, updateBusiness, setBusinessLoading, setBusinessError, clearBusiness } = businessSlice.actions;
export default businessSlice.reducer;