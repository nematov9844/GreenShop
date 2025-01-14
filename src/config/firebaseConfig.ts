import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCF6IvUe5Mw0TpKoeqoLuPrd6B_aM_Zqdw",
  authDomain: "greenshop-a830e.firebaseapp.com",
  projectId: "greenshop-a830e",
  storageBucket: "greenshop-a830e.appspot.com",
  messagingSenderId: "29673632071",
  appId: "1:29673632071:web:2c812c0d3ca012b7d45c62",
  measurementId: "G-W4H3757PNC",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Firebase provider'larni eksport qilish
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export { auth };
