import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration is read from environment variables (see .env.example).
// Fallback values keep the app working if a .env file is not present
// (Firebase web API keys are not secrets — access is enforced by Firestore rules).
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyA9Osz68yd5DIhimJYAC6PeZUSI_FYwfmM',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'resumewise-69c35.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'resumewise-69c35',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'resumewise-69c35.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '600687720793',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:600687720793:web:8ad5f1e390e6edbc8b7448',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-K9KKC40WRQ',
};

// Initialize Firebase (guard against re-initialization during hot reload)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
