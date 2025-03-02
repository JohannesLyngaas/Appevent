import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { initializeApp, getApps } from 'firebase/app';

const useEmulators = false;

function getCorrectConfigt() {
  if (useEmulators) {
    const firebaseConfig = {
      apiKey: "fake-api-key",
      authDomain: "localhost",
      projectId: "demo-firebase",
      storageBucket: "demo-firebase.appspot.com",
      messagingSenderId: "fake-messaging-id",
      appId: "fake-app-id"
    }
    return firebaseConfig;
  } else {
    const firebaseConfig = {
      apiKey: "AIzaSyD3yEpHtUxFHkOqmEkm3I4LRTEpqKRuvBA",
      authDomain: "appevent-91b4c.firebaseapp.com",
      projectId: "appevent-91b4c",
      storageBucket: "appevent-91b4c.firebasestorage.app",
      messagingSenderId: "731767932772",
      appId: "1:731767932772:web:056e80d75b6670e51fdc71"
    }
    return firebaseConfig;
  }
};

export const firebaseApp =
  getApps().length === 0 ? initializeApp(getCorrectConfigt()) : getApps()[0];

export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);

if (useEmulators) {
  connectAuthEmulator(firebaseAuth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(firebaseDb, "127.0.0.1", 8080);
}