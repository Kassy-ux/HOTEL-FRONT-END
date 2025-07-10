import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from "../features/auth/authSlice"
import { userApi } from '../features/api/userApi';
import { hotelApi } from '../features/api/hotelApi';
import { Hotel } from 'lucide-react';
import { roomApi } from '../features/api/roomApi';




// Create a persist config for the auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated','userType'], // Specify which parts of the state to persist
};

// Create a persisted reducer for the auth slice
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);


export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer, 
    [hotelApi.reducerPath]:hotelApi.reducer,
    [roomApi.reducerPath]:roomApi.reducer,
    // Use the persisted reducer here
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // To avoid serialization errors with redux-persist
    }).concat(userApi.middleware,hotelApi.middleware,roomApi.middleware), // Include the userApi middleware
});

// Export the persisted store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;