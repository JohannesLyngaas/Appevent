"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged } from "@/lib/firebase/auth/auth"
import { doc, getDoc } from "firebase/firestore"
import { firebaseDb } from "@/lib/firebase/config"
import type { User } from "@/types"
import { formatTimestamp } from "@/utils/formatTimestamp"

export function useUserSession(initialSession: string | null): User | null {
  const [userSession, setUserSession] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userDocRef = doc(firebaseDb, "users", authUser.uid)
        const userDoc = await getDoc(userDocRef)
        const userData = userDoc.data() as Omit<User, "id">

        if (userData) {
          setUserSession({
            id: authUser.uid,
            ...userData,
            createdAt: formatTimestamp(userData.createdAt),
          })
        } else {
          setUserSession(null)
        }
      } else {
        setUserSession(null)
      }
    })

    return () => unsubscribe()
  }, [])

  return userSession
}