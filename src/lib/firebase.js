import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA9Osz68yd5DIhimJYAC6PeZUSI_FYwfmM",
  authDomain: "resumewise-69c35.firebaseapp.com",
  projectId: "resumewise-69c35",
  storageBucket: "resumewise-69c35.firebasestorage.app",
  messagingSenderId: "600687720793",
  appId: "1:600687720793:web:8ad5f1e390e6edbc8b7448",
  measurementId: "G-K9KKC40WRQ"
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

