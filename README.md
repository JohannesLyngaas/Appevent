# Appevent

Appevent er en dynamisk og brukervennlig arrangements-app som gjør det enkelt å planlegge og delta på alle typer arrangementer. Applikasjonen skal gjøre det lettere å planlegge og spre informasjon både om offentlig og private arrangement.

Appevent gir deg muligheten til å se alle dine arrangementer og å oppdage nye arrangementer, du kan se hvem andre som deltar og kommentere arrangementer. Du har muligheten til å søke og filtrere på arrangementer, for å finne det som passer for deg. Uansett om du vil arrangere noe gøy eller være med på andres arrangementer, så har Appevent alt du trenger for å skape minner sammen med andre.

## Hvordan du kan kjøre development server
Sørg for at du har følgende installert:
- Node.js 18.18 eller nyere

Terminal kommandoer for å kjøre development server (få opp nettsiden på browser):
```bash

# 1. Kjør:
npm install

# 2. Kjør deretter:
npm run dev

# Hvis det er første gangen du kjører appen kjør følgende for å bygge prosjektet:
npm run build

```

Åpne deretter [http://localhost:3000](http://localhost:3000) på din browser for å se web-applikasjonen, og eventuelle endringer du gjør i sanntid.

## Forklaring på kommandoene:
### npm install
Henter og laster ned alt som trengs for at prosjektet og nettsiden skal fungere på din PC, basert på en liste med nødvendige ting.
Kjør dette første gang du laster ned prosjektet, eller hvis noe ikke virker.
### npm run dev
Starter en testversjon av nettsiden på din egen PC, slik at du kan se og prøve den mens du jobber, og endringer vises med én gang.
Kjør dette når du jobber med nettsiden.
### npm run build
Lager en ferdig og rask versjon av nettsiden som kan publiseres på internett.
Kjør dette når du er klar til å legge ut nettsiden.