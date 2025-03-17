"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AboutCard() {
  return (
    <Card className="max-w-3xl mx-auto p-6 rounded-xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Om oss</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-lg text-muted-foreground">
        <p>
          Velkommen til <span className="font-semibold">Appevent</span> – en digital plattform for å utforske, planlegge og delta på spennende arrangementer.
        </p>
        <p>
          <span className="font-semibold">Appevent</span> lar deg samle alle dine arrangementer på ett sted og oppdage nye. Du kan se hvem som deltar,
           kommentere arrangementer og bruke søke- og filterfunksjoner for å finne det som passer best for deg. Enten du vil arrangere noe gøy eller bli med på
            andres arrangementer, har <span className="font-semibold">Appevent</span> alt du trenger for å skape minner sammen med andre.
        </p>
        <p>
          Har du spørsmål eller andre henvendelser? Ikke nøl med å ta kontakt på{" "}
          <a href="mailto:kontakt@Appevent.no" className="text-primary hover:underline">
            kontakt@Appevent.no
          </a>.
        </p>
      </CardContent>
    </Card>
  );
}
