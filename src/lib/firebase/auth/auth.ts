import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
} from 'firebase/auth';
import { generateFirebaseAuthErrorMessage } from '@/utils/errorHandler';
import { firebaseDb, firebaseAuth } from "@/lib/firebase/config"
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FirebaseError } from 'firebase/app';
import { User as UserType } from "@/types/index";
import { redirect } from 'next/dist/server/api-utils';

{/*
  det her tulelt er en funksjon som bruker for å sjekke når bruker
  er logget inn eller logget ut, og sørger for at grensesnittet oppdateres
  basert på det. Kalt en callback function */}
export function onAuthStateChanged(callback: (authUser: User | null) => void) {
  return _onAuthStateChanged(firebaseAuth, callback);
};

export function getCurrentUserID() {
    const user = getAuth().currentUser;
    if (user) {
      return user.uid;
    } else {
      return null;
    }
};

{/* De to funksjonene under gjør det mulig for folk å logge inn med
  registrere og logge inn Gmail/google. De bruke sånne innebygde funksjoner
  fra firebase/google selv til å håndtere verifisering og andre
  api stuff. Disse blir for eksempel hentet inn i header komponenten
  for å brukes videre i siden  */}
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(firebaseAuth, provider);
    const user = result.user;

    if (user) {
      const userRef = doc(firebaseDb, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const firstLastName = user.displayName?.split(" ") ?? "empty";
        await setDoc(userRef, {
          id: user.uid,
          email: user.email,
          userName: user.displayName,
          imageUrl: (user.photoURL !== null) ? user.photoURL : "https://res.cloudinary.com/dxeluefou/image/upload/v1741530127/defaultProfilePic_lixzoy.jpg",
          firstName: firstLastName[0],
          lastName: firstLastName[firstLastName.length - 1],
          createdAt: new Date(),
          banned: false,
          role: "user"
        })
      }
    }
    return user.uid;
  } catch (e) {
    console.log(e)
    if (e instanceof FirebaseError) {
      throw new Error(generateFirebaseAuthErrorMessage(e));
    } else {
      throw new Error("Something went wrong when registrering when registrering/logging in with google try again later.")
    }
  }
};


{/* De to funksjonene under gjør det mulig for folk å logge inn med
  registrere og logge inn med andre mail enn bare gmail, egentlig gmail
  også men blir litt tullete å registrere med gmail hvis det er en knapp som gjør det
  automatisk for deg. Uansett, disse her bruker også sånne innebygde funksjoner
  fra firebase/google selv til å håndtere verifisering og andre
  api stuff. Disse blir for eksempel hentet inn i header komponenten
  for å brukes videre i siden  */}

export async function registerWithEmail(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;
    const userRef = doc(firebaseDb, "users", user.uid);
    await setDoc(userRef, {
      id: user.uid,
      email,
      firstName,
      lastName,
      userName: `${firstName} ${lastName}`,
      createdAt: new Date(),
      banned: false,
      imageUrl: "https://res.cloudinary.com/dxeluefou/image/upload/v1741530127/defaultProfilePic_lixzoy.jpg",
      role: "user"
    });
    return user;
  } catch (e) {
    console.log(e)
    if (e instanceof FirebaseError) {
      throw new Error(generateFirebaseAuthErrorMessage(e));
    } else {
      throw new Error("Something went wrong when registrering when registrering try again later.")
    }
  }
};

export async function signInWithUsernameOrEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return userCredential.user;
  } catch (e) {
    console.log(e)
    if (e instanceof FirebaseError) {
      throw new Error(generateFirebaseAuthErrorMessage(e));
    } else {
      throw new Error("Something went wrong when registrering when registrering try again later.")
    }
  }
};


export async function signOutUser() {
  try {
    await firebaseAuth.signOut();
  } catch (e) {
    console.log(e)
    if (e instanceof FirebaseError) {
      throw new Error(generateFirebaseAuthErrorMessage(e));
    } else {
      throw new Error("Something went wrong when registrering when registrering try again later.")
    }
  }
};