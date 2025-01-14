/** @format */

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import modalSlice from "./modalSlice";
import loginDataSlice from "./loginDataSlice";
import shopReducer from './shopSlice';
import productReducer from './productSlice';

// Persist konfiguratsiyasi
const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['loginData', 'shop'] // Faqat bu reducer'lar saqlanadi
};

// Har bir reducer uchun persist wrapper
const persistedLoginReducer = persistReducer(persistConfig, loginDataSlice);
const persistedShopReducer = persistReducer(persistConfig, shopReducer);

export const store = configureStore({
	reducer: {
		modal: modalSlice,
		loginData: persistedLoginReducer,
		shop: persistedShopReducer,
		product: productReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
