"use client";

import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { toast } from "sonner";
import { useUserSession } from "@/hooks/useUserSession";
import { getAllEvents } from "@/lib/firebase/DatabaseFunksjoner";
import { getEventsWhereUserIsInvited, getEventByUser } from "@/lib/firebase/DatabaseFunksjoner";
import { getCurrentUserID } from "@/lib/firebase/auth/auth";
import Link from "next/link";

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
  const userSession = useUserSession(null);
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
    console.log(userSession);

    const fetchEvents = async () => {
      setLoading(true);

      try {
        const eventsData = await getAllEvents();
        const publicEvents = eventsData.filter((event: Event) => event.visibility === "public");

        if (!userSession) {
          setEvents(publicEvents);
          return;
        }

        const userId = userSession.id.toString() ?? getCurrentUserID.toString();
        const userCreatedEvents = await getEventByUser(userId);
        const invitedEvents = await getEventsWhereUserIsInvited(userId);

        const allEvents = [
          ...publicEvents,
          ...invitedEvents,
          ...userCreatedEvents,
        ].filter(
          (event, index, self) => index === self.findIndex((e) => e.id === event.id)
        );

        setEvents(allEvents);
      } catch (error) {
        console.error("Feil når arrangementer ble hentet:", error);
        toast.error("Kunne ikke hente arrangementer. Prøv igjen senere.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userSession]);

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
