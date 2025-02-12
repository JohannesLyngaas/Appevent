"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function MyArrangements() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!auth.currentUser) return;

      const q = query(collection(db, "events"), where("participants", "array-contains", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      setEvents(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Mine arrangementer</h2>
      {events.length === 0 ? <p>Ingen arrangementer funnet.</p> : 
        events.map((event) => <p key={event.id}>{event.title}</p>)
      }
    </div>
  );
}
