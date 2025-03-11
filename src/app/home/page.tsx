import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import AllEvents from "@/components/home/AllEvents"

export default function Home() {

  return (

    <section className="size-full text-center mb-12">
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
      <AllEvents />
    </section>
  )
}