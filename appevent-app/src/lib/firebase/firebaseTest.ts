import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "./firebaseConfig"; // Riktig sti

const db = getFirestore(app);

export const testFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "testCollection"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} =>`, doc.data());
    });
    console.log("Firestore fungerer! 🚀");
  } catch (error) {
    console.error("Firestore-feil:", error);
  }
};
