"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, EyeOff, Users } from "lucide-react";
import {
  getEventByUser,
  removeEvent,
  updateEventVisibility,
} from "@/lib/firebase/DatabaseFunksjoner";
import ConfirmBox from "@/components/superbruker/confirmBox";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/types";
import { formatTimestamp } from "@/utils/formatTimestamp";
import Link from "next/link";
import { useUserSession } from "@/hooks/useUserSession";
import { getCurrentUserID } from "@/lib/firebase/auth/auth";


export default function MyEventsTable({ searchTerm }: { searchTerm: string }) {
  const userSession = useUserSession(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getEventByUser(userSession?.id.toString() ?? getCurrentUserID.toString());
        setEvents(eventsData);
      } catch (error) {
        console.error("Feil når arrangementer ble hentet:", error);
        toast.error("Kunne ikke hente arrangementer. Prøv igjen senere.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userSession]);

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      await removeEvent(eventToDelete.id);
      setEvents(events.filter((event) => event.id !== eventToDelete.id));
      toast.success(`"${eventToDelete.title}" has been removed successfully.`);
    } catch (error) {
      console.error(
        "Et feil skjedde når bruker prøvde å slette arrangement:",
        error
      );
      toast.error("Kunne ikke slette arrangement. Prøv igjen senere.");
    } finally {
      setEventToDelete(null);
      setIsDialogOpen(false);
    }
  };

  const handleToggleVisibility = async (event: Event) => {
    try {
      const newVisibility =
        event.visibility === "public" ? "private" : "public";
      await updateEventVisibility(event.id, newVisibility);
      setEvents(
        events.map((e) =>
          e.id === event.id ? { ...e, visibility: newVisibility } : e
        )
      );
      toast.success(`Arrangement synlighet endret til ${newVisibility}.`);
    } catch (error) {
      console.error(
        "Noe gikk feil med å endre synlighet til arrangementet:",
        error
      );
      toast.error("Kunne ikke endre synlighet. Prøv igjen senere.");
    }
  };


  const openDeleteDialog = (event: Event) => {
    setEventToDelete(event);
    setIsDialogOpen(true);
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center p-8">Henter arrangementer...</div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Dine arrangementer</h2>

      { events.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          Ingen arrangementer funnet.
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          Fant ingen arrangementer som matcher din søk.
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Sted</TableHead>
                <TableHead>Dato</TableHead>
                <TableHead>Start Tid</TableHead>
                <TableHead>Slutt Tid</TableHead>
                <TableHead>Synlighet</TableHead>
                <TableHead className="text-right">Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { filteredEvents.map((event) => (
                <TableRow key={ event.id }>
                  <TableCell className="font-medium">
                    <Link
                      href={ `/event_page?id=${event.id}` }
                      className="hover:underline"
                    >
                      { event.title }
                    </Link>
                  </TableCell>
                  <TableCell>{ event.location }</TableCell>
                  <TableCell>
                    { formatTimestamp(event.eventDate, "fullDate") }
                  </TableCell>
                  <TableCell>
                    { formatTimestamp(event.startTime, "time") }
                  </TableCell>
                  <TableCell>
                    { formatTimestamp(event.endTime, "time") }
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.visibility === "public" ? "default" : "secondary"
                      }
                    >
                      { event.visibility }
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={ () => handleToggleVisibility(event) }
                        title={ `Gjør ${event.visibility === "public" ? "privat" : "åpen"
                          }` }
                      >
                        { event.visibility === "public" ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        ) }
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={ () => {
                          /* Her må listen over påmeldte vises når vi kommer til det */
                        } }
                        title="Se påmeldte"
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={ () => openDeleteDialog(event) }
                        title="Slett arrangement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </div>
      ) }

      <ConfirmBox
        isOpen={ isDialogOpen }
        onClose={ () => setIsDialogOpen(false) }
        onConfirm={ handleDeleteEvent }
        title="Slett arrangement"
        description={ `Er du sikker på at du vil fjerne "${eventToDelete?.title}"? Denne handlingen er permanent` }
      />
    </div>
  );
}
