import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyD3yEpHtUxFHkOqmEkm3I4LRTEpqKRuvBA",
  authDomain: "appevent-91b4c.firebaseapp.com",
  projectId: "appevent-91b4c",
  storageBucket: "appevent-91b4c.firebasestorage.app",
  messagingSenderId: "731767932772",
  appId: "1:731767932772:web:056e80d75b6670e51fdc71",
};

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);
