import { Button } from "@/components/ui/button"

// Komponent for å vise populære kategorier som knapper - Statiske!

export default function PopularCategories() {
  return (
    <section className="text-center mb-12">
      <h3 className="text-2xl font-semibold mb-4">Populære Kategorier</h3>

      {/* Viser en liste med kategoriknapper */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button variant="outline">Musikk</Button>
        <Button variant="outline">Sport</Button>
        <Button variant="outline">Teknologi</Button>
        <Button variant="outline">Mat og Drikke</Button>
        <Button variant="outline">Kunst</Button>
      </div>
    </section>
  )
}