import { firebaseDb } from "./config"
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore"
import type { User, Event, EventParticipant, Comment, Report } from "@/types"

export async function getAllUsers(): Promise<User[]> {
  const usersCollection = collection(firebaseDb, "users")
  const snapshot = await getDocs(usersCollection)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as User)
}

export async function getAllEvents(): Promise<Event[]> {
  const eventsCollection = collection(firebaseDb, "events")
  const snapshot = await getDocs(eventsCollection)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
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
    } as Event
  })
}

export async function removeEvent(eventId: string): Promise<void> {
  await deleteDoc(doc(firebaseDb, "events", eventId))
}

export async function updateEventVisibility(eventId: string, visibility: "public" | "private"): Promise<void> {
  await updateDoc(doc(firebaseDb, "events", eventId), { visibility })
}

export async function promoteDemoteUser(userId: string, role: "user" | "admin"): Promise<void> {
  await updateDoc(doc(firebaseDb, "users", userId), { role })
}

export async function banUser(userId: string, banned: boolean): Promise<void> {
  await updateDoc(doc(firebaseDb, "users", userId), { banned })
}

export async function getEventParticipants(eventId: string): Promise<EventParticipant[]> {
  const participantsCollection = collection(firebaseDb, "event_participants")
  const q = query(participantsCollection, where("eventId", "==", eventId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as EventParticipant)
}

export async function getEventComments(eventId: string): Promise<Comment[]> {
  const commentsCollection = collection(firebaseDb, "comments")
  const q = query(commentsCollection, where("eventId", "==", eventId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Comment)
}

export async function deleteComment(commentId: string): Promise<void> {
  await deleteDoc(doc(firebaseDb, "comments", commentId))
}

export async function getReports(): Promise<Report[]> {
  const reportsCollection = collection(firebaseDb, "reports")
  const snapshot = await getDocs(reportsCollection)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Report)
}

export async function updateReportStatus(reportId: string, status: "pending" | "resolved" | "rejected"): Promise<void> {
  await updateDoc(doc(firebaseDb, "reports", reportId), { status })
}

