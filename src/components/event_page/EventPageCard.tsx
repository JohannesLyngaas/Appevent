"use client";
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, Globe, Lock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getAllEvents } from "@/lib/firebase/DatabaseFunksjoner";
import { AttendanceButtonAlert } from "@/components/event_page/AttendanceButtonAlert";
import { CloseButton } from "@/components/event_page/CloseButton";
import type { Event } from "@/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EventPageCard() {
  const [isAttending, setIsAttending] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");

  useEffect(() => {
    async function fetchEventWithDates() {
      try {
        if (eventId) {
          const events = await getAllEvents();
          const foundEvent = events.find((e) => e.id === eventId);
          if (foundEvent) {
            console.log("Raw event from Firestore:", foundEvent);
            setEvent(foundEvent);

            // Logge for debugging
            console.log("Event with dates:", {
              eventDate: foundEvent.eventDate,
              endDate: foundEvent.endDate || "(bruker eventDate som fallback)",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEventWithDates();
  }, [eventId]);

  const handleAttend = () => {
    setIsAttending(true);
  };

  const handleCancel = () => {
    setIsAttending(false);
  };

  // Format the date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("no-NO", options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Laster arrangement...
      </div>
    );
  }

  // If no event is found, use default data
  const defaultEvent = {
    id: "default",
    title: "Tittel på arrangement",
    description: "Velkommen til mitt første arrangement! Ta med godt humør.",
    eventDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    startTime: "18:00",
    endTime: "20:00",
    location: "Trondheim",
    createdBy: "Arrangør",
    visibility: "public",
    imageUrl: "",
    createdAt: new Date().toISOString(),
    invitedUsers: [],
  };

  // Use a derived variable instead of reassigning event
  const eventToRender = event || defaultEvent;

  // Split description into paragraphs
  const descriptionParagraphs = eventToRender.description.split("\n\n");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl md:h-96">
            <img
              src={
                eventToRender.imageUrl ||
                "/placeholder.svg?height=400&width=800"
              }
              alt={`Bilde av ${eventToRender.title}`}
              className="h-full w-full object-cover"
            />
            <Badge className="absolute left-4 top-4 bg-primary text-primary-foreground">
              {eventToRender.visibility === "public" ? "Offentlig" : "Privat"}
            </Badge>
          </div>

          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">
              {eventToRender.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {formatDate(eventToRender.eventDate)}
                  {eventToRender.endDate &&
                    eventToRender.endDate !== eventToRender.eventDate &&
                    ` - ${formatDate(eventToRender.endDate)}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>
                  {eventToRender.startTime} - {eventToRender.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{eventToRender.location}</span>
              </div>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Om arrangementet</CardTitle>
            </CardHeader>
            <CardContent>
              {descriptionParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    index < descriptionParagraphs.length - 1 ? "mb-4" : ""
                  }
                >
                  {paragraph}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meld deg på</CardTitle>
              <CardDescription>
                Registrer deg for dette arrangementet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Dette er et{" "}
                {eventToRender.visibility === "public" ? "offentlig" : "privat"}{" "}
                arrangement.
                {eventToRender.visibility === "private"
                  ? " Du har blitt invitert til å delta."
                  : " Alle kan melde seg på."}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{formatDate(eventToRender.eventDate)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">
                  {eventToRender.startTime} - {eventToRender.endTime}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <AttendanceButtonAlert
                isAttending={isAttending}
                onAttend={handleAttend}
                onCancel={handleCancel}
              />
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Arrangør</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src="/placeholder.svg?height=50&width=50"
                    alt="Arrangør logo"
                  />
                  <AvatarFallback>
                    {eventToRender.createdBy.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{eventToRender.createdBy}</p>
                  <p className="text-sm text-muted-foreground">
                    Kontakt: info@event.no
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Opprettet:{" "}
                    {new Date(eventToRender.createdAt).toLocaleDateString(
                      "no-NO"
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {eventToRender.visibility === "private" &&
            eventToRender.invitedUsers &&
            eventToRender.invitedUsers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Inviterte</span>
                    <Badge variant="outline" className="ml-2">
                      <Users className="mr-1 h-3 w-3" />
                      {eventToRender.invitedUsers.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex -space-x-2">
                    {eventToRender.invitedUsers.slice(0, 8).map((user, i) => (
                      <Avatar key={i} className="border-2 border-background">
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40&text=${user.substring(
                            0,
                            2
                          )}`}
                        />
                        <AvatarFallback>
                          {user.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {eventToRender.invitedUsers.length > 8 && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        +{eventToRender.invitedUsers.length - 8}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Deltakere</span>
                <Badge variant="outline" className="ml-2">
                  <Users className="mr-1 h-3 w-3" />
                  24
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex -space-x-2">
                {[...Array(8)].map((_, i) => (
                  <Avatar key={i} className="border-2 border-background">
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40&text=${i + 1}`}
                    />
                    <AvatarFallback>{i + 1}</AvatarFallback>
                  </Avatar>
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  +16
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Se alle deltakere
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
