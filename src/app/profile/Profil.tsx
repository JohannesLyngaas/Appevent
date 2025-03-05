"use client";

import ConfirmBox from "@/components/superbruker/confirmBox";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllEvents, removeEvent, updateEventVisibility } from "@/lib/firebase/DatabaseFunksjoner";
import { formatTimestamp } from "@/utils/formatTimestamp";
import { Badge, Eye, EyeOff, Link, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { FiEdit, FiMail, FiPlusCircle, FiUser } from "react-icons/fi";
import type { Event } from "@/types";
import { Input } from "postcss";
import { toast } from "sonner";


export default function Profil() {
  const bruker = {
    navn: "Ola Nordmann",
    brukernavn: "Ola 123",
    epost: "ola@nordmann.no",
  };

  const [mineArrangementer, setMineArrangementer] = useState([
    "Arrangement 1",
    "Arrangement 2",
    "Arrangement 3",
  ]);
  const [opprettedeArrangementer, setOpprettedeArrangementer] = useState([
    "Arrangement 4",
  ]);

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  {
    /* funksjonen under håndterer hvordan man sletter en arrangement på admin siden.
    await removeEvent(eventToDelete.id) bruker en removeEvent() funksjon med id'en på arrangementet
    for å fjerne arrangementet fra databasen. Det er removeEvent() fra lib/firebase/superbruker.ts
    som samhandler med firebase databasen, funksjonen under er bare en mellomledd som oppdater siden
    og sier til removeEvent() hvilken arrangement som skal fjernes fra databsen.*/
  }
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

  {
    /* funksjonen under håndterer hvordan synligheten endres på arrangementer i arrangement listen
    på admin siden. */
  }
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

  {
    /* funksjonen under håndterer hvilke dialog boks som dukker opp når admin trykker på knapper */
  }
  const openDeleteDialog = (event: Event) => {
    setEventToDelete(event);
    setIsDialogOpen(true);
  };

  {
    /* funksjonen under bruker const [events, setEvents] og filtrerer gjennom listen
    med arrangementer for å bare hente bare arrangementer som har en tittel, beskrivelse og sted*/
  }
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  {
    /* En div som skal illustrere loading hvis nettsiden bruker tid på å hente arrangementer */
  }
  if (loading) {
    return (
      <div className="flex justify-center p-8">Henter arrangementer...</div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-8 gap-12">
      {/* 📌 SIDEBAR */}
      <div className="w-1/3 p-6 flex flex-col space-y-6 shadow-lg rounded-lg border border-gray-200">
        {/* 🎭 Profilkort */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition">
          {/* Profilbilde */}
          <div className="w-32 h-40 rounded-md mb-4 mx-auto shadow-md border border-gray-400" />

          {/* Brukerinformasjon */}
          <div className="text-black font-semibold text-xl text-center">
            {bruker.navn}
          </div>
          <div className="text-gray-700 text-center flex items-center justify-center gap-2 mt-2">
            <FiUser className="text-gray-500" /> {bruker.brukernavn}
          </div>
          <div className="text-gray-600 text-center flex items-center justify-center gap-2 mt-1">
            <FiMail className="text-gray-500" /> {bruker.epost}
          </div>

          {/* Rediger profil-knapp */}
          <button className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 hover:scale-105 transition-transform">
            <FiEdit /> Rediger profil
          </button>
        </div>
      </div>

      {/* 📅 HOVEDINNHOLD */}
      <div className="w-2/3 shadow-lg rounded-lg p-8">
        {/* 🚀 Overskrift */}
        <h2 className="text-3xl font-bold text-center mb-6">
          Mine Arrangementer
        </h2>

        {/* <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Arrangement håndtering</h2>
            <Input
              placeholder="Søk arrangementer..."
              className="max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div> */}

          {events.length === 0 ? (
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
                  {/* under er en måte å loope gjennom en liste med arrangementer
              og for hver arrangement hente relevant info og lage en rad i tabellen for
              det arrangementet */}
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/event_page?id=${event.id}`}
                          className="hover:underline"
                        >
                          {event.title}
                        </Link>
                      </TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        {formatTimestamp(event.eventDate, "fullDate")}
                      </TableCell>
                      <TableCell>
                        {formatTimestamp(event.startTime, "time")}
                      </TableCell>
                      <TableCell>
                        {formatTimestamp(event.endTime, "time")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            event.visibility === "public" ? "default" : "secondary"
                          }
                        >
                          {event.visibility}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleToggleVisibility(event)}
                            title={`Gjør ${event.visibility === "public" ? "privat" : "åpen"
                              }`}
                          >
                            {event.visibility === "public" ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              /* Her må listen over påmeldte vises når vi kommer til det */
                            }}
                            title="Se påmeldte"
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => openDeleteDialog(event)}
                            title="Slett arrangement"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <ConfirmBox
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onConfirm={handleDeleteEvent}
            title="Slett arrangement"
            description={`Er du sikker på at du vil fjerne "${eventToDelete?.title}"? Denne handlingen er permanent`}
          />
        </div>

        {/*  Opprettede arrangementer */}
        <Card className="p-6 rounded-lg shadow-md border">
          <CardTitle className="text-2xl font-bold mb-4 flex items-center gap-2">
            Opprettede arrangementer
          </CardTitle>

          {opprettedeArrangementer.map((arrangement, index) => (
            <Card
              key={index}
              className="flex items-center border rounded-md p-4 mb-3 shadow-sm hover:shadow-md hover:brightness-110 hover:scale-105 transition">
              <span className="mr-2 text-gray-600">📍</span>
              {arrangement}
            </Card>
          ))}
        </Card>

        {/* 🎉 Knapp sentrert */}
        <div className="flex justify-center mt-8">
          <button className="flex items-center gap-2 bg-[#959D5A] text-white px-6 py-4 rounded-lg text-lg font-bold hover:bg-[#5d6238] hover:scale-105 transition-transform shadow-md">
            <FiPlusCircle /> Opprett nytt arrangement
          </button>
        </div>
      </div>
  );
}
