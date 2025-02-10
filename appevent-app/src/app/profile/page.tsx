"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileArrangements from "@/components/profile/ProfileArrangements";
import ProfileEvents from "@/components/profile/ProfileEvents";

export default function ProfilePage() {
  // State for å lagre brukerdata
  const [userData, setUserData] = useState<any>(null);
  // State for å lagre brukerens egne arrangementer
  const [arrangements, setArrangements] = useState<any[]>([]);
  // State for å lagre eventer brukeren deltar på
  const [eventsAttending, setEventsAttending] = useState<any[]>([]);

  useEffect(() => {
    // Henter brukerdata fra Firestore
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    };

    // Henter arrangementer opprettet av brukeren
    const fetchArrangements = async () => {
      const arrRef = collection(db, "arrangements");
      const arrSnap = await getDocs(arrRef);
      setArrangements(arrSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    // Henter arrangementer brukeren deltar på
    const fetchEventsAttending = async () => {
      const eventsRef = collection(db, "eventsAttending");
      const eventsSnap = await getDocs(eventsRef);
      setEventsAttending(eventsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    // Kall funksjonene for å hente data
    fetchUserData();
    fetchArrangements();
    fetchEventsAttending();
  }, []);

  // Viser en loading-tekst mens data hentes
  if (!userData) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      {/* Tittel på profilsiden */}
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      {/* Viser brukerens header-informasjon */}
      <ProfileHeader user={userData} />
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Seksjon for brukerens egne arrangementer */}
        <ProfileArrangements arrangements={arrangements} />
        
        {/* Seksjon for arrangementer brukeren deltar på */}
        <ProfileEvents eventsAttending={eventsAttending} />
      </div>
    </div>
  );
}
