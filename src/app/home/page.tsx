import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import AllEvents from "@/components/home/AllEvents"

export default function Home() {

  return (

    <section className="size-full text-center mb-12">
      <h2 className="text-4xl font-bold mb-4">Oppdag Spennende Arrangementer</h2>
      <p className="text-xl mb-6">Finn og skap uforglemmelige opplevelser i ditt område</p>

      {/* Viser en liste over arrangementer som kort (HomepageCard-komponenten) */}
      <AllEvents />
    </section>
  )
}