//Prøvde å herme etter registreringssiden. 
//Nå skjer det ingen ting når man trykker på Login

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegisterButton } from "@/components/login/RegisterButton"; // Importer RegisterButton
import { BackButton } from "@/components/login/BackButton";

function LoginCard() {
  return (
    <Card className="rounded-xl ~w-72/80 ~px-1/4 ~py-1/4">
        <BackButton /> {/* Tilbake-knapp til hjemmesiden */}
      <CardHeader className="gap-1">
        <CardTitle className="~text-xl/2xl text-center">Velkommen</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <div>
          <label htmlFor="username">Brukernavn</label>
          <Input id="username" type="text" placeholder="Skriv ditt brukernavn" required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button variant={"outline"} className="w-full ~text-base/xl">
          Logg inn
        </Button>
        <RegisterButton /> 
      </CardFooter>
    </Card>
  );
}

export { LoginCard };
