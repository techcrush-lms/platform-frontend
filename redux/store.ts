import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import courseReducer from './slices/courseSlice';
import ticketReducer from './slices/ticketSlice';
import orgReducer from './slices/orgSlice';
import paymentReducer from './slices/paymentSlice';
import withdrawalReducer from './slices/withdrawalSlice';
import couponReducer from './slices/couponSlice';
import subscriptionPlanReducer from './slices/subscriptionPlanSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import notificationReducer from './slices/notificationSlice';
import productImportReducer from './slices/productImportSlice';
import analyticsReducer from './slices/analyticsSlice';
import productReducer from './slices/productSlice';
import digitalProductReducer from './slices/digitalProductSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import firebaseReducer from './slices/firebaseSlice';
import currencyReducer from './slices/currencySlice';
import physicalProductReducer from './slices/physicalProductSlice';
import shippingReducer from './slices/shippingSlice';
import invoiceReducer from './slices/invoiceSlice';
import storage from 'redux-persist/lib/storage'; // Uses localStorage
import { persistReducer } from 'redux-persist';

// Persist configuration for auth slice only
const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['auth', 'org', 'cart'], // Only persist the auth slice
};

// Combine reducers
const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  chat: chatReducer,
  course: courseReducer,
  ticket: ticketReducer,
  org: persistReducer(persistConfig, orgReducer),
  payment: paymentReducer,
  withdrawal: withdrawalReducer,
  coupon: couponReducer, // Not persisted
  subscriptionPlan: subscriptionPlanReducer, // Not persisted
  subscription: subscriptionReducer, // Not persisted
  notification: notificationReducer, // Not persisted
  productImport: productImportReducer,
  analytics: analyticsReducer,
  products: productReducer,
  digitalProduct: digitalProductReducer,
  cart: persistReducer(persistConfig, cartReducer),
  order: orderReducer, // Not persisted
  firebase: firebaseReducer,
  currency: currencyReducer,
  physicalProduct: physicalProductReducer,
  shipping: shippingReducer,
  invoice: invoiceReducer,
});

const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
  console.log('Dispatching:', action);
  let result = next(action);
  // console.log('Next state:', store.getState());
  // console.log('📊 New state:', store.getState().chat); // 👈 only chat slice
  return result;
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
