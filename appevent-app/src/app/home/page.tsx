import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import HomepageCard from "@/components/home/HomepageCard"

// Midlertidig liste over arrangementer for å visualisere designet
// Senere skal denne hentes dynamisk fra create_events når backend er koblet til
const upcomingEvents = [
  { id: 1, title: "Sommerfestival 2024", date: "2024-07-15", time: "14:00", location: "Høyskoleparken, Trondheim", attendees: 200 },
  { id: 2, title: "Konferanse", date: "2024-09-22", time: "09:00", location: "Spektrum", attendees: 800 },
  { id: 3, title: "Frokost med gjengen", date: "2024-08-05", time: "11:00", location: "Klostergata 50", attendees: 8 },
  { id: 4, title: "Trondheim Maraton", date: "2024-09-07", time: "10:00", location: "Trondheim Torg", attendees: 5000 },
]

export default function Home() {
  useEffect(() => {
    testFirestore();
  }, []);

  return (
    
    <section className="text-center mb-12">
      <h2 className="text-4xl font-bold mb-4">Oppdag Spennende Arrangementer</h2>
      <p className="text-xl mb-6">Finn og skap uforglemmelige opplevelser i ditt område</p>

    {/*Søkeseksjon for arrangementer*/}
    {/*Input-felt for søk + søkeknapp (selve søkelogikken må implementeres senere om vi vil beholde det)*/}
      <div className="flex justify-center gap-4 mb-6">
        <div className="relative w-full max-w-md">
          <Input type="text" placeholder="Søk etter arrangementer..." className="pl-10 pr-4 py-2" />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Button className="bg-accent text-accent-foreground">Søk</Button>
      </div>

      {/* Viser en liste over arrangementer som kort (HomepageCard-komponenten) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 px-4">
        {upcomingEvents.map((event) => (
          <HomepageCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  )
}