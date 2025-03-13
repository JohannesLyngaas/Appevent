"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllEvents } from "@/lib/firebase/DatabaseFunksjoner";
import Link from "next/link";
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
  const [loading, setLoading] = useState(true);

  {
    /* funksjonen 'useEffect' fra react bruker funksjonen getAllEvents() fra vår
    /src/lib/firebase/superbruker.ts filen for å hente alle arrangementer fra databasen
    og legge det til const [events, setEvents]. events kan så brukes til å filtrere eller hente
    alle eller visse felt som man ønsker fra alle brukere. For eks bruker handle funksjonen
    handleDeletEvent events i   const [events, setEvents] = useState<Event[]>([])
    for å bestemme hvilken arrangement som skal slettes fra listen.*/
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getAllEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error("Feil når arrangementer ble hentet:", error);
        toast.error("Kunne ikke hente arrangementer. Prøv igjen senere.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Link key={event.id} href={`/event_page?id=${event.id}`} passHref>
          <div className="cursor-pointer">
            <EventCard
              title={event.title}
              location={event.location}
              imageUrl={event.imageUrl}
              date={event.eventDate}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
