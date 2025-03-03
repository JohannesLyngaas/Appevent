'use client'

//Prøvde å herme etter registreringssiden.
//Nå skjer det ingen ting når man trykker på Login

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { RegisterButton } from "@/components/login/RegisterButton"; // Importer RegisterButton
import { BackButton } from "@/components/login/BackButton";
import { createSession } from '@/lib/firebase/auth/sessionHandling';
import { signInWithGoogle, signInWithUsernameOrEmail } from "@/lib/firebase/auth";
import { Icons } from "../ui/icons";
import { Separator } from "@/components/ui/separator";

function LoginCard() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSingIn = async () => {
    const userUid = await signInWithGoogle();
    if (userUid) {
      await createSession(userUid);
      router.push("/");
    }
  };

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    try {
      const user = await signInWithUsernameOrEmail(email, password);
      if (user.uid) {
        await createSession(user.uid);
        router.push("/");
      }
    } catch (e) {
      if (e instanceof Error && !e.message.toLowerCase().includes("redirect")) setError(e.message);
    }
  };

  return (
    <Card className="rounded-xl ~w-72/80 ~px-1/4 ~py-1/4">
      <BackButton />
      <CardHeader className="flex flex-col">
        <CardTitle className="~text-xl/2xl text-center">Velkommen</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button variant={ "outline" } onClick={ handleGoogleSingIn } >
          <span>
            <Icons.google />
          </span>
          <a className="~text-sm/base">
            Fortsett med Google
          </a>
        </Button>
        <Separator />
        <p className="text-center ~text-xs/base mt-2">Eller</p>
        <Separator />
        <form onSubmit={ handleEmailSignIn }>
          <label htmlFor="email" className="~text-sm/base">
            E-post
          </label>
          <Input
            id="email"
            type="email"
            placeholder="navn@mail.com"
            value={ email }
            className="~text-sm/base mb-2"
            onChange={ (e) => setEmail(e.target.value) }
            required
          />
          <label htmlFor="password" className="~text-sm/base">Passord</label>
          <Input
            id="password"
            type="password"
            placeholder="Skriv inn passord"
            value={ password }
            onChange={ (e) => setPassword(e.target.value) }
            className="~text-sm/base mb-2"
            required
          />
          <Button variant={ "outline" } type="submit" className="w-full mt-2 ~text-sm/base">Logg inn</Button>
        </form>
        { (error !== null) && <p className="text-red-500 mt-2 ~text-sm/base">{ error }</p> }
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <RegisterButton />
      </CardFooter>
    </Card>
  );
}

export { LoginCard };
