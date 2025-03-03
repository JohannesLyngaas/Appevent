'use client'

import { useState } from "react";
import { useRouter } from 'next/navigation'
import { registerWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createSession } from '@/lib/firebase/auth/sessionHandling';
import { BackButton } from "@/components/register/BackButton";
import { Separator } from "@/components/ui/separator";

function RegistrationCard() {

  {/* Under er en enkel komponent med:
    - Knapp for å fortsette med google
    - Input-felt for hvis bruker ønsker å registrere bruker med mail
    - Card er et komponent hented fra shadcn, du kan importere det fra UI folderen i /components/card
    for eget bruk.
    - Samme med icons og button komponenten.
    - Knappene (buttons) har foreløpig ingen funksjonalitet, bortsett fra 'tilbake-knappen'.
     */}

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [bekreftPassword, setBekreftPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setError("Alle felter må fylles ut.");
      return;
    }
    if (!(password.trim() === bekreftPassword.trim())) {
      setError("Passordene er ikke lik");
      return;
    }

    try {
      const user = await registerWithEmail(firstName, lastName, email, password);
      if (user?.uid) {
        await createSession(user.uid);
        router.push("/");
      }
    } catch (e) {
      if (e instanceof Error && !e.message.toLowerCase().includes("redirect")) setError(e.message);
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      const userUid = await signInWithGoogle();
      if (userUid) {
        await createSession(userUid);
        router.push("/");
      }
    } catch (e) {
      if (e instanceof Error) setError(`Registrering mislyktes:  ${e.message}`);
    }

  };

  return (
    <Card className="rounded-xl ~w-72/80 ~px-1/4 ~py-1/4">
      <BackButton />
      <CardHeader className="flex flex-col">
        <Button variant={ "outline" } onClick={ handleGoogleSignUp }>
          <span>
            <Icons.google />
          </span>
          <a className="~text-sm/base">Fortsett med Google</a>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-center ~text-base/xl mt-2.5">eller</p>
        <CardTitle className="~text-sm/2xl text-center">registrer med mail</CardTitle>
        <Separator/>
        <form onSubmit={ handleEmailSignup } className="flex gap-2 flex-col">
          <div>
            <Label htmlFor="firstName" className="~text-sm/base">Fornavn</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Fornavn"
              className="~text-xs/sm"
              value={ firstName }
              onChange={ (e) => setFirstName(e.target.value) }
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="~text-sm/base">Etternavn</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Etternavn"
              className="~text-xs/sm"
              value={ lastName }
              onChange={ (e) => setLastName(e.target.value) }
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="~text-sm/base">E-post</Label>
            <Input
              id="email"
              type="email"
              placeholder="mail@example.com"
              className="~text-xs/sm"
              value={ email }
              onChange={ (e) => setEmail(e.target.value) }
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="~text-sm/base">Passord</Label>
            <Input
              id="password"
              type="password"
              placeholder="Velg et passord"
              className="~text-xs/sm"
              value={ password }
              onChange={ (e) => setPassword(e.target.value) }
              required
            />
          </div>
          <div>
            <Input
              id="bekreftPassword"
              type="password"
              placeholder="Bekreft passord"
              className="~text-xs/sm"
              value={ bekreftPassword }
              onChange={ (e) => setBekreftPassword(e.target.value) }
              required
            />
          </div>
          <Button variant={ "outline" } type="submit" className="w-full mt-3 ~text-xs/base">
            Lag bruker
          </Button>
          { (error !== null) && <p className="text-red-500 mt-2">{ error }</p> }
        </form>
      </CardContent>
    </Card>
  );
}

export { RegistrationCard };