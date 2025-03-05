import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from '@/lib/firebase/config';

const dataBase = getFirestore(firebaseApp);

export const testFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(dataBase, "testCollection"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} =>`, doc.data());
    });
    console.log("Firestore fungerer! 🚀");
  } catch (error) {
    console.error("Firestore-feil:", error);
  }
};
