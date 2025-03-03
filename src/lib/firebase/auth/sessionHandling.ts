"use server"

import { cookies } from "next/headers"
import { SESSION_COOKIE_NAME } from "@/lib/constants"

export async function createSession(uid: string) {
  (await cookies()).set(SESSION_COOKIE_NAME, uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
  })

  return { success: true }
}

export async function removeSession() {
  (await cookies()).delete(SESSION_COOKIE_NAME)

  return { success: true }
}
