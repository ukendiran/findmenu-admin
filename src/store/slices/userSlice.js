import { createSlice } from '@reduxjs/toolkit';
import EncryptionService from '../../services/encryptionService';

// Retrieve initial user state from localStorage
const getInitialUserState = () => {
  const storedUser = localStorage.getItem('user');
  
  return {
    data: storedUser ? JSON.parse(EncryptionService.decrypt(storedUser)) : {},
    loading: false,
    error: null,
  };
};

const userSlice = createSlice({
  name: 'user',
  initialState: getInitialUserState(),
  reducers: {
    setUser(state, action) {
      state.data = action.payload;
      state.error = null;
      localStorage.setItem('user', EncryptionService.encrypt(JSON.stringify(action.payload)));
      state.loading = false;
    },
    updateUser(state, action) {
      state.data = { ...state.data, ...action.payload };
      localStorage.setItem('user', EncryptionService.encrypt(JSON.stringify(state.data)));
      state.loading = false;
    },
    setUserLoading(state, action) {
      state.loading = action.payload;
    },
    setUserError(state, action) {
      state.error = action.payload;
    },
    clearUser(state) {
      state.data = {};
      state.loading = false;
      state.error = null;
      localStorage.removeItem('user');
    }
  },
});

export const { setUser, updateUser, setUserLoading, setUserError, clearUser } = userSlice.actions;
export default userSlice.reducer;