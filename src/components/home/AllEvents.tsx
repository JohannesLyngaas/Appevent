"use client"

import { useEffect, useState } from "react";
import { firebaseDb } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import EventCard from "./EventCard";

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  createdBy: string;
  visibility: "public" | "private";
  invitedUsers?: string[];
  imageUrl?: string;
  createdAt: string;
}

export default function AllEvents() {
  
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(firebaseDb, "events"));
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];

        setEvents(eventsData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            location={event.location}
            imageUrl={event.imageUrl}
            imageAlt=""
            date={event.eventDate}
          />
        ))}
      </div>
  )
}