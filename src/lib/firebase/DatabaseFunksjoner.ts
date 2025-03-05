import { firebaseDb } from "@/lib/firebase/config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import type { User, Event, EventParticipant, Comment, Report } from "@/types";

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

/*export async function getEventByUser(userId: string) : Promise<string | null> {
  const usersCollection = getal
  const q = query(usersCollection, where("createdBy:", "==", userId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}*/

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

/* Funksjoner for å opprette arrangementer */
export async function createEvent(
  eventData: Omit<Event, "id">
): Promise<string> {
  const eventsCollection = collection(firebaseDb, "events");
  const docRef = await addDoc(eventsCollection, {
    ...eventData,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}
