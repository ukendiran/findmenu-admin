// src/store/actions/authActions.js
import { setAuthenticated, clearAuth } from '../slices/authSlice';
import { setUser, clearUser } from '../slices/userSlice';
import { setConfig, clearConfig } from '../slices/configSlice';
import { setBusiness, clearBusiness } from '../slices/businessSlice';
import { setSubscription, clearSubscription } from '../slices/subscriptionSlice';

// Combined login action
export const login = (payload) => (dispatch) => {
  // Set authentication state
  dispatch(setAuthenticated({
    isAuthenticated: true,
    token: payload.token
  }));
  
  // Set user data
  dispatch(setUser(payload.user));
  
  // Set config data
  dispatch(setConfig(payload.config));
  
  // Set business data
  dispatch(setBusiness(payload.business));

  // Set business data
  dispatch(setSubscription(payload.isSubscribed));

};

// Combined logout action
export const logout = () => (dispatch) => {
  // Clear all state
  dispatch(clearAuth());
  dispatch(clearUser());
  dispatch(clearConfig());
  dispatch(clearBusiness());
  dispatch(clearSubscription());
};