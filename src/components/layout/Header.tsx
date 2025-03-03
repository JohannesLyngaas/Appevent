'use client';

import Link from "next/link";
import { useUserSession } from '@/hooks/user-user-session';
import { signOutUser } from '@/lib/firebase/auth';
import { removeSession } from '@/lib/firebase/sessionHandling';
import { Button } from "../ui/button";


type HeaderProps = {
  session: string | null;
}

export function Header({ session }: HeaderProps) {
  const userSession = useUserSession(session);

  {/* Denne funksjonen henter en funksjon fra lib/auth.ts og auth-actions og sier
    til den hentede funksjonen hva som skal skje hvis bruker trykker på "logg ut"
    knappen. - Moa  */}
  const handleSignOut = async () => {
    await signOutUser();
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


        { userSession?.role === "admin" && (
          <Link href="/admin">
            <Button variant="outline">Admin</Button>
          </Link>
        ) }

        { !userSession ? (
          <Link href="/login" >
            <Button>
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
