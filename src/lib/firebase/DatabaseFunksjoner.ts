import { firebaseDb } from "@/lib/firebase/config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
  setDoc,
} from "firebase/firestore";
import type { User, Event, EventParticipant, Comment, Report } from "@/types";
import { getCurrentUserID } from "./auth/auth";
import { useUserSession } from "@/hooks/useUserSession";

/**
 * Under er alle funksjonene som kan brukes til mange ulike funksjonaliteter på siden. Hent disse og bruk de i din komponent
 * eller side hvis du trenger de. Husk at mange av funksjonene bare henter for eks en liste med alle arrangementer
 * og du må selv lage funksjoner i din komponent/side og beskrive hva som skal skje med disse arrangementene eller
 * hvilken arrangement som skal hentes osv. Noen av funksjonene henter bare ting fra databasen mens andre oppdaterer
 * og/eller sletter ting fra databsen. Du kan og må i mange tilfeller hente flere til din side og bruke dem samtidig.
 * For eks. hvis bruker vil lage en liste med alle arrangementer kan du bruke getAllEvents() på din side
 * men må selv definere hva du vil for eks hente fra listen og hvordan du vil presentere de.
 *
 * Jeg har bare lagt til funksjoner som jeg bruker for superbruker så langt og dere må mest sansynnlig lege til
 * flere. For eks. har vi ingen funksjon for legge til en arrangement på nettsiden ennå. -Moa
 */
export async function getAllEvents(): Promise<Event[]> {
  const eventsCollection = collection(firebaseDb, "events");
  const snapshot = await getDocs(eventsCollection);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || "",
      description: data.description || "",
      location: data.location || "",
      eventDate: data.eventDate || "",
      endDate: data.endDate || "",
      startTime: data.startTime || "",
      endTime: data.endTime || "",
      createdBy: data.createdBy || "",
      visibility: data.visibility || "public",
      invitedUsers: data.invitedUsers || [],
      imageUrl: data.imageUrl || "",
      createdAt: data.createdAt || "",
    } as Event;
  });
}

export async function getEventsWhereUserIsParticipant(
  userId: string
): Promise<Event[]> {
  const eventsCollection = collection(firebaseDb, "events");
  const eventsSnapshot = await getDocs(eventsCollection);

  const userEvents = await Promise.all(
    eventsSnapshot.docs.map(async (eventDoc) => {
      const participantDocRef = doc(
        firebaseDb,
        "events",
        eventDoc.id,
        "participants",
        userId
      );
      const participantDocSnap = await getDoc(participantDocRef);

      if (participantDocSnap.exists()) {
        return { id: eventDoc.id, ...eventDoc.data() } as Event;
      }

      return null;
    })
  );

  return userEvents.filter((event) => event !== null) as Event[];
}

export async function getEventsWhereUserIsInvited(
  userId: string
): Promise<Event[]> {
  const eventsCollection = collection(firebaseDb, "events");
  const eventsSnapshot = await getDocs(eventsCollection);

  const invitedEvents = await Promise.all(
    eventsSnapshot.docs.map(async (eventDoc) => {
      const invitedUserDocRef = doc(
        firebaseDb,
        "events",
        eventDoc.id,
        "invitedUsers",
        userId
      );
      const invitedUserDocSnap = await getDoc(invitedUserDocRef);

      if (invitedUserDocSnap.exists()) {
        return { id: eventDoc.id, ...eventDoc.data() } as Event;
      }

      return null;
    })
  );

  return invitedEvents.filter((event) => event !== null) as Event[];
}

export async function joinEvent(
  userId: string,
  eventId: string
): Promise<void> {
  const participantsDocRef = doc(
    firebaseDb,
    "events",
    eventId,
    "participants",
    userId
  );
  const invitedDocRef = doc(
    firebaseDb,
    "events",
    eventId,
    "invitedUsers",
    userId
  );

  const participantSnap = await getDoc(participantsDocRef);
  if (participantSnap.exists()) return;

  const invitedSnap = await getDoc(invitedDocRef);
  if (invitedSnap.exists()) await deleteDoc(invitedDocRef);

  await setDoc(participantsDocRef, {});
}

export async function leaveEvent(
  userId: string,
  eventId: string
): Promise<void> {
  const participantsDocRef = doc(
    firebaseDb,
    "events",
    eventId,
    "participants",
    userId
  );

  try {
    await deleteDoc(participantsDocRef);
    console.log(`User ${userId} left event ${eventId}`);
  } catch (error) {
    console.error("Error leaving event:", error);
    throw error;
  }
}

export async function getEventByUser(userId: string): Promise<Event[]> {
  const eventsCollection = collection(firebaseDb, "events");
  const myEvents = query(eventsCollection, where("createdBy", "==", userId));
  const eventSnap = await getDocs(myEvents);
  return eventSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Event));
}

export async function updateUserInfo(
  userId: string,
  updatedFields: Partial<User>
): Promise<void> {
  await updateDoc(doc(firebaseDb, "users", userId), updatedFields);
}

export async function removeEvent(eventId: string): Promise<void> {
  await deleteDoc(doc(firebaseDb, "events", eventId));
}

export async function updateEventVisibility(
  eventId: string,
  visibility: "public" | "private"
): Promise<void> {
  await updateDoc(doc(firebaseDb, "events", eventId), { visibility });
}

export async function getEventParticipants(
  eventId: string
): Promise<EventParticipant[]> {
  const participantsCollection = collection(firebaseDb, "event_participants");
  const q = query(participantsCollection, where("eventId", "==", eventId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as EventParticipant)
  );
}

export async function getEventComments(eventId: string): Promise<Comment[]> {
  const commentsCollection = collection(firebaseDb, "comments");
  const q = query(commentsCollection, where("eventId", "==", eventId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Comment));
}

export async function deleteComment(commentId: string): Promise<void> {
  await deleteDoc(doc(firebaseDb, "comments", commentId));
}

/* Funksjoner for å opprette arrangementer */
export async function createEvent(
  eventData: Omit<Event, "id" | "createdBy">,
  invitedEmails: string[],
  userId: string
): Promise<string> {
  const eventRef = await addDoc(collection(firebaseDb, "events"), {
    ...eventData,
    createdBy: userId,
    createdAt: new Date().toISOString(),
  });

  if (invitedEmails.length > 0) {
    const usersCollection = collection(firebaseDb, "users");
    const invitedUsersQuery = query(
      usersCollection,
      where("email", "in", invitedEmails)
    );
    const invitedUsersSnapshot = await getDocs(invitedUsersQuery);

    const batch = invitedUsersSnapshot.docs.map((userDoc) =>
      setDoc(
        doc(firebaseDb, "events", eventRef.id, "invitedUsers", userDoc.id),
        {}
      )
    );

    await Promise.all(batch);
  }

  return eventRef.id;
}

/**
 * Under er alle funksjonene som er relevant for superbruker. Hent disse og bruk de i din komponent
 * eller side hvis du trenger de. Husk at mange av funksjonene bare henter for eks en liste med alle brukere
 * og du må selv lage funksjoner i din komponent/side og beskrive hva som skal skje med disse brukerne eller
 * hvilken bruker som skal hentes osv. Noen av funksjonene henter bare ting fra databasen mens andre oppdaterer
 * og/eller sletter ting fra databsen. Du kan og må i mange tilfeller hente flere til din side og bruke dem samtidig.
 * For eks. må du hente listen med brukere for å finne brukeren du vil for eks utestenge fra appen, og
 * du bruker banUser funksjonen for å si til databasen at denne bruken skal utestenges.
 */

export async function getReports(): Promise<Report[]> {
  const reportsCollection = collection(firebaseDb, "reports");
  const snapshot = await getDocs(reportsCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Report));
}

export async function getAllUsers(): Promise<User[]> {
  const usersCollection = collection(firebaseDb, "users");
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
}

export async function promoteDemoteUser(
  userId: string,
  role: "user" | "admin"
): Promise<void> {
  await updateDoc(doc(firebaseDb, "users", userId), { role });
}

export async function banUser(userId: string, banned: boolean): Promise<void> {
  await updateDoc(doc(firebaseDb, "users", userId), { banned });
}

export async function updateReportStatus(
  reportId: string,
  status: "pending" | "resolved" | "rejected"
): Promise<void> {
  await updateDoc(doc(firebaseDb, "reports", reportId), { status });
}
