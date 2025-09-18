// src/store/actions/subscriptionActions.js
import { setSubscription, clearSubscription } from '../slices/subscriptionSlice';

// Combined subscription action
export const subscription = (payload) => (dispatch) => {
  // Set business data
  dispatch(setSubscription(payload.isSubscribed));

};

// Combined logout action
export const subscriptionClear = () => (dispatch) => {
  // Clear all state
  dispatch(clearSubscription());
};