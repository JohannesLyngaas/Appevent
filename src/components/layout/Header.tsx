'use client';

import Link from "next/link";
import { useUserSession } from '@/hooks/user-user-session';
import { signInWithGoogle, signOutWithGoogle } from '@/lib/firebase/auth';
import { createSession, removeSession } from '@/lib/firebase/auth-actions';
import { Button } from "../ui/button";

type HeaderProps = {
  session: string | null;
}

export function Header({ session }: HeaderProps) {
  const userSessionId = useUserSession(session);

  const handleSignIn = async () => {
    const userUid = await signInWithGoogle();
    if (userUid) {
      await createSession(userUid);
    }
  };

  const handleSignOut = async () => {
    await signOutWithGoogle();
    await removeSession();
  };

  return (
    <div className="bg-navbar p-4 flex border-b justify-between items-center">
      <Link href="/home" className="text-2xl font-semibold text-primary">
        AppEvent
      </Link>

      <div className="flex gap-x-5">
        <Link href="/create_event">
          <Button>
            Opprett arrangement
          </Button>
        </Link>


        { !userSessionId ? (
          <Link href="/login" >
            <Button onClick={ handleSignIn }>
              Logg inn
            </Button>
          </Link>
        ) : (
          <Link href="/login" className="">
            <Button variant={ 'default' } onClick={ handleSignOut } >
              Logg ut
            </Button>
          </Link>
        ) }
      </div>
    </div>
  )
}
