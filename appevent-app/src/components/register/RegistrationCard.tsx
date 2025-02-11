import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { BackButton } from "@/components/register/BackButton";

function RegistrationCard() {

  {/* Under er en enkel komponent med:
    - Knapp for å fortsette med google
    - Input-felt for hvis bruker ønsker å registrere bruker med mail
    - Card er et komponent hented fra shadcn, du kan importere det fra UI folderen i /components/card
    for eget bruk.
    - Samme med icons og button komponenten.
    - Knappene (buttons) har foreløpig ingen funksjonalitet, bortsett fra 'tilbake-knappen'.
     */}

  return (
    <Card className="rounded-xl ~w-72/80 ~px-1/4 ~py-1/4">
      <BackButton />
      <CardHeader className="gap-1">
        <Button variant={"outline"} className="~text-base/xl">
          <Icons.google/>
          Fortsett med Google
        </Button>
        <div>
          <p className="text-center ~text-base/xl mt-2.5">eller</p>
        </div>
        <CardTitle className="~text-xl/2xl text-center">Registrer bruker</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <div>
          <Label htmlFor="name">
            Navn
          </Label>
          <Input id="name" type="text" placeholder="navn" maxLength={10} required/>
        </div>
        <div>
          <Label htmlFor="name">
            Etternavn
          </Label>
          <Input id="surname" type="text" placeholder="navnesen" required/>
        </div>
        <div>
          <Label htmlFor="email">
            Mail
          </Label>
          <Input id="email" type="email" placeholder="m@example.com" required/>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant={"outline"} className="w-full ~text-base/xl">
          Lag bruker
        </Button>
      </CardFooter>
    </Card>
  );
}

export { RegistrationCard };