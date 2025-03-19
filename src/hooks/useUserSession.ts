"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "@/lib/firebase/auth/auth";
import { doc, getDoc } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase/config";
import type { User } from "@/types";
import { formatTimestamp } from "@/utils/formatTimestamp";

export function useUserSession(initialSession: string | null): User | null {
  const [userSession, setUserSession] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const cachedSession = sessionStorage.getItem("userSession");
    if (cachedSession) {
      setUserSession(JSON.parse(cachedSession));
    }

    const unsubscribe = onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userDocRef = doc(firebaseDb, "users", authUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data() as Omit<User, "id">;

        if (userData) {
          const sessionData = {
            id: authUser.uid,
            ...userData,
            dataCreatedAt: formatTimestamp(userData.createdAt),
          };

          setUserSession(sessionData);
          sessionStorage.setItem("userSession", JSON.stringify(sessionData));
        } else {
          setUserSession(null);
          sessionStorage.removeItem("userSession"); //
        }
      } else {
        setUserSession(null);
        sessionStorage.removeItem("userSession");
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isClient) return null;
  return userSession;
}