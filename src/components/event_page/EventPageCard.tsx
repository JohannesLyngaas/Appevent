"use client";
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, Globe, Lock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  getAllEvents,
  getEventParticipantsFromSubcollection,
  isUserParticipating,
  getUserById,
} from "@/lib/firebase/DatabaseFunksjoner";
import { AttendanceButtonAlert } from "@/components/event_page/AttendanceButtonAlert";
import type { Event, EventParticipant, User } from "@/types";
import { getCurrentUserID } from "@/lib/firebase/auth/auth";
import { useUserSession } from "@/hooks/useUserSession";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventComments } from "@/components/event_page/EventComments";
import { EventReportButton } from "@/components/event_page/EventReportButton";
import ImageSlider from "./ImageSlider";
import { ImagesUploader } from "./ImagesUploader";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase/config";
import { cn } from "@/lib/utils";

export function EventPageCard() {
  const userSession = useUserSession(null);
  const [showParticipantsDialog, setShowParticipantsDialog] = useState(false);
  const [participantUsers, setParticipantUsers] = useState<User[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [organizer, setOrganizer] = useState<User | null>(null);
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [isUserAttending, setIsUserAttending] = useState(false);
  const [previewParticipantUsers, setPreviewParticipantUsers] = useState<
    User[]
  >([]);
  const [uploadConfirmed, setUploadConfirmed] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);

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
            console.log("THEME: ", foundEvent.theme)
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

  useEffect(() => {
    async function checkParticipation() {
      if (eventId) {
        try {
          // Get all participants
          const eventParticipants = await getEventParticipantsFromSubcollection(
            eventId
          );
          setParticipants(eventParticipants);

          // Check if current user is participating
          const userId = await getCurrentUserID();
          if (userId) {
            const isAttending = await isUserParticipating(userId, eventId);
            setIsAttending(isAttending);
          }
        } catch (error) {
          console.error("Error checking participation:", error);
        }
      }
    }

    checkParticipation();
  }, [eventId]);

  useEffect(() => {
    async function fetchOrganizer() {
      try {
        if (event && event.createdBy) {
          const userData = await getUserById(event.createdBy);
          setOrganizer(userData);
        }
      } catch (error) {
        console.error("Error fetching organizer data:", error);
      }
    }

    fetchOrganizer();
  }, [event]);

  useEffect(() => {
    async function fetchParticipantDetails() {
      if (!showParticipantsDialog || participants.length === 0) return;

      setLoadingParticipants(true);
      try {
        const userPromises = participants.map((participant) =>
          getUserById(participant.userId)
        );

        const users = await Promise.all(userPromises);
        // Filter out null values and sort by name
        const validUsers = users.filter((user) => user !== null) as User[];
        validUsers.sort((a, b) => {
          const nameA = getDisplayName(a);
          const nameB = getDisplayName(b);
          return nameA.localeCompare(nameB);
        });

        setParticipantUsers(validUsers);
      } catch (error) {
        console.error("Error fetching participant details:", error);
      } finally {
        setLoadingParticipants(false);
      }
    }

    fetchParticipantDetails();
  }, [showParticipantsDialog, participants]);

  useEffect(() => {
    async function fetchPreviewParticipantData() {
      if (participants.length === 0) return;

      try {
        // Only fetch data for participants we're showing in the preview
        const previewParticipants = participants.slice(0, 8);
        const userPromises = previewParticipants.map((participant) =>
          getUserById(participant.userId)
        );

        const users = await Promise.all(userPromises);
        // Filter out null values
        const validUsers = users.filter((user) => user !== null) as User[];
        setPreviewParticipantUsers(validUsers);
      } catch (error) {
        console.error("Error fetching participant preview data:", error);
      }
    }

    fetchPreviewParticipantData();
  }, [participants]);

  function getDisplayName(user: User) {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.userName) {
      return user.userName;
    }
    return user.id;
  }

  function getUserInitials(user: User) {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user.firstName) {
      return user.firstName.substring(0, 2).toUpperCase();
    } else if (user.userName) {
      return user.userName.substring(0, 2).toUpperCase();
    }
    return user.id.substring(0, 2).toUpperCase();
  }

  const handleViewAllParticipants = () => {
    setShowParticipantsDialog(true);
  };

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

  // Helper functions for the organizer display - move inside component
  function getOrganizerDisplayName() {
    if (organizer) {
      if (organizer.firstName && organizer.lastName) {
        return `${organizer.firstName} ${organizer.lastName}`;
      } else if (organizer.firstName) {
        return organizer.firstName;
      } else if (organizer.userName) {
        return organizer.userName;
      }
    }
    return eventToRender.createdBy;
  }

  function getOrganizerInitials() {
    if (organizer) {
      if (organizer.firstName && organizer.lastName) {
        return `${organizer.firstName[0]}${organizer.lastName[0]}`.toUpperCase();
      } else if (organizer.firstName) {
        return organizer.firstName.substring(0, 2).toUpperCase();
      } else if (organizer.userName) {
        return organizer.userName.substring(0, 2).toUpperCase();
      }
    }
    return eventToRender.createdBy.substring(0, 2).toUpperCase();
  }

  const handleUploadSuccess = async (url: string, publicId: string) => {
    if (!eventId) {
      console.error("No eventId provided!");
      return;
    }

    try {
      const imagesCollectionRef = collection(firebaseDb, `events/${eventId}/images`);

      const docRef = await addDoc(imagesCollectionRef, {
        url,
        publicId,
        uploadedAt: new Date(),
      });

      setImageId(docRef.id);
      console.log("Image successfully uploaded to Firestore!");
    } catch (error) {
      console.error("Error uploading image to Firestore:", error);
      alert("Could not save image to Firestore.");
    }
  };

  const handleDeleteImage = async () => {
    if (!eventId) {
      console.error("No eventId provided!");
      return;
    }

    try {
      const imageDocRef = doc(firebaseDb, `events/${eventId}/images/${imageId}`);
      await deleteDoc(imageDocRef);

      console.log("Image successfully deleted from Firestore!");
    } catch (error) {
      console.error("Error deleting image from Firestore:", error);
      alert("Could not delete image from Firestore.");
    }
  };

  const onUploadSuccess = (url: string, publicId: string) => {
    console.log("onUploadSuccess triggered:", url, publicId);
    setUploadConfirmed(true);
    handleUploadSuccess(url, publicId);
  };

  const onDeleteSuccess = () => {
    setUploadConfirmed(false);
    handleDeleteImage();
  }

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
    theme: "Konsert",
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
              alt={ `Bilde av ${eventToRender.title}` }
              className="h-full w-full object-cover"
            />
            <Badge variant={eventToRender.visibility === "public" ? "default" : "destructive"} className="absolute left-4 top-4 text-primary-foreground">
              { eventToRender.visibility === "public" ? "Offentlig" : "Privat" }
            </Badge>
          </div>

          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">
              { eventToRender.title }
            </h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  { formatDate(eventToRender.eventDate) }
                  { eventToRender.endDate &&
                    eventToRender.endDate !== eventToRender.eventDate &&
                    ` - ${formatDate(eventToRender.endDate)}` }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>
                  { eventToRender.startTime } - { eventToRender.endTime }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{ eventToRender.location }</span>
              </div>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Om arrangementet</CardTitle>
              <CardDescription className="text-base">Tema: {eventToRender.theme}</CardDescription>
            </CardHeader>
            <CardContent>
              { descriptionParagraphs.map((paragraph, index) => (
                <p
                  key={ index }
                  className={
                    index < descriptionParagraphs.length - 1 ? "mb-4" : ""
                  }
                >
                  { paragraph }
                </p>
              )) }
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
                Dette er et{ " " }
                { eventToRender.visibility === "public" ? "offentlig" : "privat" }{ " " }
                arrangement.
                { eventToRender.visibility === "private"
                  ? " Du har blitt invitert til å delta."
                  : " Alle kan melde seg på." }
              </p>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{ formatDate(eventToRender.eventDate) }</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">
                  { eventToRender.startTime } - { eventToRender.endTime }
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <AttendanceButtonAlert
                isAttending={ isAttending }
                onAttend={ handleAttend }
                onCancel={ handleCancel }
                eventId={ eventToRender.id }
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
                    src={
                      organizer?.imageUrl ||
                      "/placeholder.svg?height=50&width=50"
                    }
                    alt="Arrangør logo"
                  />
                  <AvatarFallback>{ getOrganizerInitials() }</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{ getOrganizerDisplayName() }</p>
                  <p className="text-sm text-muted-foreground">
                    { organizer?.email && `Kontakt: ${organizer.email}` }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Opprettet:{ " " }
                    { new Date(eventToRender.createdAt).toLocaleDateString(
                      "no-NO"
                    ) }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          { eventToRender.visibility === "private" &&
            eventToRender.invitedUsers &&
            eventToRender.invitedUsers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Inviterte</span>
                    <Badge variant="outline" className="ml-2">
                      <Users className="mr-1 h-3 w-3" />
                      { eventToRender.invitedUsers.length }
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex -space-x-2">
                    { eventToRender.invitedUsers.slice(0, 8).map((user, i) => (
                      <Avatar key={ i } className="border-2 border-background">
                        <AvatarImage
                          src={ `/placeholder.svg?height=40&width=40&text=${user.substring(
                            0,
                            2
                          )}` }
                        />
                        <AvatarFallback>
                          { user.substring(0, 2).toUpperCase() }
                        </AvatarFallback>
                      </Avatar>
                    )) }
                    { eventToRender.invitedUsers.length > 8 && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        +{ eventToRender.invitedUsers.length - 8 }
                      </div>
                    ) }
                  </div>
                </CardContent>
              </Card>
            ) }

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Deltakere</span>
                <Badge variant="outline" className="ml-2">
                  <Users className="mr-1 h-3 w-3" />
                  { participants.length }
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex -space-x-2">
                { previewParticipantUsers.map((user, i) => (
                  <Avatar key={ user.id } className="border-2 border-background">
                    <AvatarImage
                      src={
                        user.imageUrl ||
                        `/placeholder.svg?height=40&width=40&text=${user.id.substring(
                          0,
                          2
                        )}`
                      }
                      alt={ getDisplayName(user) }
                    />
                    <AvatarFallback>{ getUserInitials(user) }</AvatarFallback>
                  </Avatar>
                )) }
                { participants.length > 8 && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    +{ participants.length - 8 }
                  </div>
                ) }
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={ handleViewAllParticipants }
                >
                  <Users className="mr-2 h-4 w-4" />
                  Se alle deltakere
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={ showParticipantsDialog }
        onOpenChange={ setShowParticipantsDialog }
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Alle deltakere</DialogTitle>
            <DialogDescription>
              { participants.length }{ " " }
              { participants.length === 1 ? "person" : "personer" } deltar på
              dette arrangementet
            </DialogDescription>
          </DialogHeader>

          { loadingParticipants ? (
            <div className="flex justify-center py-8">Laster deltakere...</div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              { participantUsers.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Ingen deltakere ennå
                </p>
              ) : (
                <div className="space-y-4">
                  { participantUsers.map((user) => (
                    <div
                      key={ user.id }
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
                    >
                      <Avatar>
                        <AvatarImage src={ user.imageUrl } />
                        <AvatarFallback>{ getUserInitials(user) }</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{ getDisplayName(user) }</p>
                        <p className="text-sm text-muted-foreground">
                          { user.email }
                        </p>
                      </div>
                    </div>
                  )) }
                </div>
              ) }
            </div>
          ) }
        </DialogContent>
      </Dialog>

      <CardContent className="pt-6">
        <EventComments
          eventId={ eventId || "" }
          eventOwnerId={ eventToRender.createdBy }
        />
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-6 border-t">
        <div className="flex gap-2">
          {/* Eksisterende knapper for å delta/forlate arrangement */ }
        </div>
        { userSession && userSession.id !== eventToRender.createdBy && (
          <EventReportButton eventId={ eventId || "" } />
        ) }
      </CardFooter>

      { isAttending && eventToRender.endDate && new Date() > new Date(eventToRender.endDate) && (
        <ImagesUploader
          onUploadSuccess={ onUploadSuccess }
          onDeleteSuccess={ onDeleteSuccess }
          thisEventId={ eventId } />) }

      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Bilder fra arrangement</h1>
        <ImageSlider eventId={ eventId as string } uploadConfirmed={ uploadConfirmed } />
      </div>
    </div>
  );
}
