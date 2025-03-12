'use client';

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getEventsWhereUserIsParticipant, leaveEvent } from "@/lib/firebase/DatabaseFunksjoner";
import { toast } from "sonner";
import type { Event } from "@/types";
import { formatTimestamp } from "@/utils/formatTimestamp";
import Link from "next/link";
import { useUserSession } from "@/hooks/useUserSession";
import { getCurrentUserID } from "@/lib/firebase/auth/auth";

export default function ParticipatingEventsTable({ searchTerm }: { searchTerm: string }) {
  const userSession = useUserSession(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getEventsWhereUserIsParticipant(userSession?.id.toString() ?? getCurrentUserID.toString());
        setEvents(eventsData);
      } catch (error) {
        console.error("Feil ved henting av arrangementer:", error);
        toast.error("Kunne ikke hente arrangementer.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userSession]);

  const handleLeaveEvent = async (eventId: string) => {
    try {
      await leaveEvent(userSession?.id.toString() ?? getCurrentUserID.toString(), eventId);
      setEvents(events.filter((event) => event.id !== eventId));
      toast.success("Du har meldt deg av arrangementet.");
    } catch (error) {
      console.error("Feil ved avmelding:", error);
      toast.error("Kunne ikke melde deg av arrangementet.");
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center p-8">Henter arrangementer...</div>;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Arrangementer du er påmeldt på</h2>

      { events.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          Ingen arrangementer funnet.
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          Fant ingen arrangementer som matcher din søk.
        </div>
      ) :
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Sted</TableHead>
                <TableHead>Dato</TableHead>
                <TableHead className="text-right">Handling</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { filteredEvents.map((event) => (
                <TableRow key={ event.id }>
                  <TableCell className="font-medium">
                    <Link href={ `/event_page?id=${event.id}` } className="hover:underline">
                      { event.title }
                    </Link>
                  </TableCell>
                  <TableCell>{ event.location }</TableCell>
                  <TableCell>{ formatTimestamp(event.eventDate, "fullDate") }</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" onClick={ () => handleLeaveEvent(event.id) }>Meld av</Button>
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </div>
      }
    </div>
  );
}