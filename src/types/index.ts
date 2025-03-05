export interface User {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  createdAt: string;
  banned?: boolean;
}

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

export interface EventParticipant {
  id: string;
  eventId: string;
  userId: string;
  status: "going" | "not going";
  timestamp: string;
}

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reportedBy: string;
  reportedItem: {
    type: "event" | "user" | "comment";
    id: string;
  };
  reason: string;
  status: "pending" | "resolved" | "rejected";
  timestamp: string;
}
