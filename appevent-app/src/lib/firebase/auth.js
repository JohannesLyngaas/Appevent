import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Registrer bruker
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Logg inn bruker
export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logg ut bruker
export const logout = () => {
  return signOut(auth);
};
