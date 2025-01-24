/** @format */

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import modalSlice from "./modalSlice";
import loginDataSlice from "./loginDataSlice";
import shopReducer from './shopSlice';
import productReducer from './productSlice';

// Shop reducer uchun persist config
const shopPersistConfig = {
	key: 'shop',		
	storage,
	whitelist: ['cart', 'wishlist'], // Faqat cart va wishlist saqlanadi
};

// Login reducer uchun persist config
const loginPersistConfig = {
	key: 'login',
	storage,
	whitelist: ['loginData']
};

// Reducer'larni persist qilish
const persistedLoginReducer = persistReducer(loginPersistConfig, loginDataSlice);
const persistedShopReducer = persistReducer(shopPersistConfig, shopReducer);

export const store = configureStore({
	reducer: {
		modal: modalSlice,
		loginData: persistedLoginReducer,
		shop: persistedShopReducer,
		product: productReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
			},
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
