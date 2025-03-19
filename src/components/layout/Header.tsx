'use client';

import Link from "next/link";
import { useUserSession } from '@/hooks/useUserSession';
import { getCurrentUserID, signOutUser } from '@/lib/firebase/auth/auth';
import { removeSession } from '@/lib/firebase/auth/sessionHandling';
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";


type HeaderProps = {
  session: string | null;
}

export function Header({ session }: HeaderProps) {
  const userId = getCurrentUserID();
  const router = useRouter();
  const userSession = useUserSession(session);


  {/* Denne funksjonen henter en funksjon fra lib/auth.ts og auth-actions og sier
    til den hentede funksjonen hva som skal skje hvis bruker trykker på "logg ut"
    knappen. - Moa  */}
  const handleSignOut = async () => {
    await signOutUser();
    await removeSession();
    router.push("/");
  };

  return (
    <div className="bg-navbar p-4 flex border-b justify-between items-center">
      <Link href="/home" className="text-2xl font-semibold text-primary">
        AppEvent
      </Link>

      <div className="flex gap-x-5">
        { userSession &&
          <Link href="/create_event">
            <Button variant={ "default" }>
              Opprett arrangement
            </Button>
          </Link>
        }

        { userSession?.role === "admin" && (
          <Link href="/admin">
            <Button variant="default">Admin</Button>
          </Link>
        ) }
        { userSession &&
          <Link href="/profile" className="">
            <Button variant={ "default" } >
              Min profil
            </Button>
          </Link>
        }

        { !userSession ? (
          <Link href="/login" >
            <Button variant={ "default" }>
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
