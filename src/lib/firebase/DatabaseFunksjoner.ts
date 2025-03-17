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
  orderBy,
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
  try {
    const commentsCollectionRef = collection(firebaseDb, "comments");
    const q = query(commentsCollectionRef, where("eventId", "==", eventId));

    const snapshot = await getDocs(q);
    const comments = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        eventId: data.eventId,
        userId: data.userId,
        text: data.text,
        createdAt: data.createdAt,
      } as Comment;
    });

    return comments.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  } catch (error) {
    console.error("Error fetching event comments:", error);
    throw error;
  }
}

export async function addComment(
  eventId: string,
  userId: string,
  text: string
): Promise<string> {
  try {
    const commentsCollectionRef = collection(firebaseDb, "comments");
    const newComment = {
      eventId,
      userId,
      text,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(commentsCollectionRef, newComment);
    return docRef.id;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  try {
    const commentRef = doc(firebaseDb, "comments", commentId);
    await deleteDoc(commentRef);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
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
  try {
    const reportRef = doc(firebaseDb, "reports", reportId);
    await updateDoc(reportRef, { status });
  } catch (error) {
    console.error("Error updating report status:", error);
    throw error;
  }
}

export async function registerEventParticipant(
  userId: string,
  eventId: string
): Promise<void> {
  if (!userId || !eventId) {
    throw new Error("BrukerID og ArrangementID er påkrevd");
  }

  try {
    // Use a subcollection approach
    const participantsRef = collection(
      firebaseDb,
      "events",
      eventId,
      "participants"
    );

    // Check if already registered (adjust query for subcollection)
    const participantDoc = doc(participantsRef, userId);
    const docSnap = await getDoc(participantDoc);

    if (docSnap.exists()) {
      console.log("User already registered for this event");
      return;
    }

    // Register using user ID as document ID
    await setDoc(participantDoc, {
      userId: userId,
      status: "going",
      timestamp: new Date().toISOString(),
    });

    console.log(`User ${userId} registered for event ${eventId}`);
  } catch (error) {
    console.error("Error in registerEventParticipant:", error);
    throw error;
  }
}

// Get all participants for a specific event
export async function getEventParticipantsFromSubcollection(
  eventId: string
): Promise<EventParticipant[]> {
  const participantsRef = collection(
    firebaseDb,
    "events",
    eventId,
    "participants"
  );
  const snapshot = await getDocs(participantsRef);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id, // This will be the userId
      eventId: eventId,
      userId: data.userId,
      status: data.status,
      timestamp: data.timestamp,
    } as EventParticipant;
  });
}

// Check if a user is participating in an event
export async function isUserParticipating(
  userId: string,
  eventId: string
): Promise<boolean> {
  if (!userId || !eventId) return false;

  const participantDocRef = doc(
    firebaseDb,
    "events",
    eventId,
    "participants",
    userId
  );
  const docSnap = await getDoc(participantDocRef);

  return docSnap.exists();
}

// Remove a participant from an event
export async function removeEventParticipant(
  userId: string,
  eventId: string
): Promise<void> {
  if (!userId || !eventId) {
    throw new Error("BrukerID og ArrangementID er påkrevd");
  }

  const participantDocRef = doc(
    firebaseDb,
    "events",
    eventId,
    "participants",
    userId
  );
  await deleteDoc(participantDocRef);

  console.log(`User ${userId} removed from event ${eventId}`);
}

// Add this function if it doesn't exist already
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(firebaseDb, "users", userId));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: userDoc.id,
        email: userData.email || "",
        imageUrl:
          userData.imageUrl ||
          "https://res.cloudinary.com/dxeluefou/image/upload/v1741530127/defaultProfilePic_lixzoy.jpg",
        userName: userData.userName || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        role: userData.role || "user",
        createdAt: userData.createdAt || "",
        banned: userData.banned || false,
        bio: userData.bio || "",
      } as User;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Rapportere en kommentar
export async function reportComment(
  userId: string,
  commentId: string,
  reason: string
): Promise<string> {
  try {
    const reportsCollection = collection(firebaseDb, "reports");
    const reportData = {
      reportedBy: userId,
      reportedItem: {
        type: "comment",
        id: commentId,
      },
      reason: reason,
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    const docRef = await addDoc(reportsCollection, reportData);
    return docRef.id;
  } catch (error) {
    console.error("Error reporting comment:", error);
    throw error;
  }
}

// Hent rapporterte kommentarer
export async function getReportedComments(): Promise<Report[]> {
  try {
    const reportsCollection = collection(firebaseDb, "reports");
    const q = query(
      reportsCollection,
      where("reportedItem.type", "==", "comment")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Report)
    );
  } catch (error) {
    console.error("Error fetching reported comments:", error);
    throw error;
  }
}

// Hent full informasjon om rapporterte kommentarer (inkl. kommentarinnhold)
export async function getReportedCommentDetails(): Promise<
  Array<
    Report & { commentData?: Comment; userData?: User; reporterData?: User }
  >
> {
  try {
    // Først hent alle rapporter for kommentarer
    const reports = await getReportedComments();

    // Deretter hent detaljer for hver kommentar, bruker og rapportør
    const reportsWithDetails = await Promise.all(
      reports.map(async (report) => {
        let commentData: Comment | undefined;
        let userData: User | undefined;
        let reporterData: User | undefined;

        try {
          // Hent kommentaren
          const commentId = report.reportedItem.id;
          const commentDoc = await getDoc(
            doc(firebaseDb, "comments", commentId)
          );

          if (commentDoc.exists()) {
            commentData = {
              id: commentDoc.id,
              ...commentDoc.data(),
            } as Comment;

            // Hent brukeren som skrev kommentaren
            if (commentData.userId) {
              const userDoc = await getUserById(commentData.userId);
              if (userDoc) {
                userData = userDoc;
              }
            }
          }

          // Hent brukeren som rapporterte
          if (report.reportedBy) {
            const reporterDoc = await getUserById(report.reportedBy);
            if (reporterDoc) {
              reporterData = reporterDoc;
            }
          }
        } catch (error) {
          console.error(
            `Error fetching details for report ${report.id}:`,
            error
          );
        }

        // Returner rapporten selv om vi ikke fant kommentaren (kan ha blitt slettet)
        return { ...report, commentData, userData, reporterData };
      })
    );

    return reportsWithDetails;
  } catch (error) {
    console.error("Error fetching reported comment details:", error);
    throw error;
  }
}

// Rapportere et arrangement
export async function reportEvent(
  userId: string,
  eventId: string,
  reason: string
): Promise<string> {
  try {
    const reportsCollection = collection(firebaseDb, "reports");
    const reportData = {
      reportedBy: userId,
      reportedItem: {
        type: "event",
        id: eventId,
      },
      reason: reason,
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    const docRef = await addDoc(reportsCollection, reportData);
    return docRef.id;
  } catch (error) {
    console.error("Error reporting event:", error);
    throw error;
  }
}

// Hent rapporterte arrangementer
export async function getReportedEvents(): Promise<Report[]> {
  try {
    const reportsCollection = collection(firebaseDb, "reports");
    const q = query(
      reportsCollection,
      where("reportedItem.type", "==", "event")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Report)
    );
  } catch (error) {
    console.error("Error fetching reported events:", error);
    throw error;
  }
}

// Hent full informasjon om rapporterte arrangementer (inkl. arrangementdetaljer)
export async function getReportedEventDetails(): Promise<
  Array<Report & { eventData?: Event; creatorData?: User; reporterData?: User }>
> {
  try {
    // Først hent alle rapporter for arrangementer
    const reports = await getReportedEvents();

    // Deretter hent detaljer for hvert arrangement, arrangementseier og rapportør
    const reportsWithDetails = await Promise.all(
      reports.map(async (report) => {
        let eventData: Event | undefined;
        let creatorData: User | undefined;
        let reporterData: User | undefined;

        try {
          // Hent arrangementet
          const eventId = report.reportedItem.id;
          const eventDoc = await getDoc(doc(firebaseDb, "events", eventId));

          if (eventDoc.exists()) {
            const data = eventDoc.data();
            eventData = {
              id: eventDoc.id,
              ...data,
            } as Event;

            // Hent brukeren som opprettet arrangementet
            if (eventData.createdBy) {
              const userDoc = await getUserById(eventData.createdBy);
              if (userDoc) {
                creatorData = userDoc;
              }
            }
          }

          // Hent brukeren som rapporterte
          if (report.reportedBy) {
            const reporterDoc = await getUserById(report.reportedBy);
            if (reporterDoc) {
              reporterData = reporterDoc;
            }
          }
        } catch (error) {
          console.error(
            `Error fetching details for event report ${report.id}:`,
            error
          );
        }

        return { ...report, eventData, creatorData, reporterData };
      })
    );

    return reportsWithDetails;
  } catch (error) {
    console.error("Error fetching reported event details:", error);
    throw error;
  }
}
