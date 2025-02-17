import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, MapPin, Clock, Users } from "lucide-react"

interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  attendees: number
}

// Komponent for å vise et arrangement som et kort
// Tar inn et event-objekt og viser tittel, dato, tid, sted og antall deltakere
export default function HomepageCard({ event }: { event: Event }) {
  return (
    <Card key={event.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Viser dato */}
        <div className="flex items-center text-muted-foreground mb-1">
          <CalendarDays className="w-4 h-4 mr-2" />
          <span>{event.date}</span>
        </div>

        {/* Viser klokkeslett */}
        <div className="flex items-center text-muted-foreground mb-1">
          <Clock className="w-4 h-4 mr-2" />
          <span>{event.time}</span>
        </div>

        {/* Viser lokasjon */}
        <div className="flex items-center text-muted-foreground mb-1">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{event.location}</span>
        </div>

        {/* Viser antall deltakere */}
        <div className="flex items-center text-muted-foreground">
          <Users className="w-4 h-4 mr-2" />
          <span>{event.attendees} deltakere</span>
        </div>
      </CardContent>
    </Card>
  )
}