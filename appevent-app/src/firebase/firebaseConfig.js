
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import  { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3yEpHtUxFHkOqmEkm3I4LRTEpqKRuvBA",
  authDomain: "appevent-91b4c.firebaseapp.com",
  projectId: "appevent-91b4c",
  storageBucket: "appevent-91b4c.firebasestorage.app",
  messagingSenderId: "731767932772",
  appId: "1:731767932772:web:056e80d75b6670e51fdc71",
  measurementId: "G-L719NCML90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log("Firebase er initialisert:", app.name);


export {db};
export {auth};
export default app;
