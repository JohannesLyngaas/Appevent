import Image from "next/image"
import { MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface EventCardProps {
  title: string
  location: string
  imageUrl?: string
  imageAlt: string
  date?: string
}

// Komponent for å vise et arrangement som et kort
// Tar inn et event-objekt og viser tittel, dato, tid, sted og antall deltakere
export default function EventCard({ title, location, imageUrl, imageAlt, date }: EventCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-auto w-full sm:h-64">
        <Image src={imageUrl || "/placeholder.svg"} alt={imageAlt} fill className="object-cover" priority />
      </div>
      <CardContent className="p-4">
        {date && <p className="mb-2 text-sm font-medium text-muted-foreground">{date}</p>}
        <h3 className="mb-2 text-xl font-bold tracking-tight">{title}</h3>
        <div className="flex items-center text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          <span className="text-sm">{location}</span>
        </div>
      </CardContent>
    </Card>
  )
}