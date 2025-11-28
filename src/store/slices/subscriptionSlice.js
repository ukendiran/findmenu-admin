// subscriptionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const subscriptionSlice = createSlice({
    name: 'isSubscribed',
    initialState: { isSubscribed: false },
    reducers: {
        activateSubscription: (state) => {
            state.isSubscribed = true;
        },
        deactivateSubscription: (state) => {
            state.isSubscribed = false;
        }
    }
});

export const { activateSubscription, deactivateSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;