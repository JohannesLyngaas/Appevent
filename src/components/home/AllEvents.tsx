"use client"

import { useState, useEffect } from "react"
import { useUserSession } from "@/hooks/useUserSession"
import { getAllEvents, getEventsWhereUserIsInvited, getEventByUser } from "@/lib/firebase/DatabaseFunksjoner"
import { getCurrentUserID } from "@/lib/firebase/auth/auth"
import Link from "next/link"
import { toast } from "sonner"
import EventCard from "./EventCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CalendarIcon, Search, MapPin, X, LogIn } from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const eventThemes = [
  "Konsert",
  "Sportsarrangement",
  "Matfestival",
  "Dugnad",
  "Filmvisning",
  "Workshop",
  "Kunstutstilling",
  "Temafest",
  "Lanseringsevent",
  "Nettverksmøte",
]

export interface Event {
  id: string
  title: string
  description: string
  location: string
  eventDate: string
  endDate?: string
  startTime: string
  endTime: string
  createdBy: string
  visibility: "public" | "private"
  invitedUsers?: string[]
  imageUrl?: string
  createdAt: string
  theme: string
}

export default function AllEvents() {
  const userSession = useUserSession(null)
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>(undefined)
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined)
  const [activeFilters, setActiveFilters] = useState<{
    theme?: string
    location?: string
    date?: Date
  }>({})

  const uniqueLocations = [...new Set(events.map((event) => event.location))].sort()

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)

      try {
        if (userSession) {
          const eventsData = await getAllEvents()
          const publicEvents = eventsData.filter((event: Event) => event.visibility === "public")

          const userId = userSession.id.toString() ?? getCurrentUserID.toString()
          const userCreatedEvents = await getEventByUser(userId)
          const invitedEvents = await getEventsWhereUserIsInvited(userId)

          const allEvents = [...publicEvents, ...invitedEvents, ...userCreatedEvents].filter(
            (event, index, self) => index === self.findIndex((e) => e.id === event.id),
          )

          setEvents(allEvents)
          setFilteredEvents(allEvents)
        }
      } catch (error) {
        console.error("Feil når arrangementer ble hentet:", error)
        toast.error("Kunne ikke hente arrangementer. Prøv igjen senere.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [userSession])

  useEffect(() => {
    let result = [...events]

    if (searchTerm) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (activeFilters.date) {
      const filterDate = format(activeFilters.date, "yyyy-MM-dd")
      result = result.filter((event) => {
        return event.eventDate === filterDate
      })
    }

    if (activeFilters.theme) {
      result = result.filter((event) => event.theme === activeFilters.theme)
    }

    if (activeFilters.location) {
      result = result.filter((event) => event.location === activeFilters.location)
    }

    setFilteredEvents(result)
  }, [events, searchTerm, activeFilters])

  const addFilter = (type: "theme" | "location" | "date", value: string | Date) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const removeFilter = (type: "theme" | "location" | "date") => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[type]
      return newFilters
    })

    if (type === "theme") setSelectedTheme(undefined)
    if (type === "location") setSelectedLocation(undefined)
    if (type === "date") setSelectedDate(undefined)
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    setSearchTerm("")
    setSelectedDate(undefined)
    setSelectedTheme(undefined)
    setSelectedLocation(undefined)
  }

  if (!userSession) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Logg inn for å se arrangementer</CardTitle>
            <CardDescription className="text-center">
              Du må være logget inn for å se og delta på arrangementer
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link href="/login">
              <Button className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Logg inn
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full justify-center px-4 py-8">
      <div className="mb-8 space-y-4 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Søk etter arrangementer..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {activeFilters.date ? format(activeFilters.date, "dd.MM.yyyy") : "Velg dato"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date)
                  if (date) {
                    addFilter("date", date)
                  } else {
                    removeFilter("date")
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select
            value={selectedTheme}
            onValueChange={(value) => {
              setSelectedTheme(value)
              if (value && value !== "alle") {
                addFilter("theme", value)
              } else {
                removeFilter("theme")
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Velg tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle temaer</SelectItem>
              {eventThemes.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedLocation}
            onValueChange={(value) => {
              setSelectedLocation(value)
              if (value && value !== "alle") {
                addFilter("location", value)
              } else {
                removeFilter("location")
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Velg sted" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle steder</SelectItem>
              {uniqueLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(Object.keys(activeFilters).length > 0 || searchTerm) && (
            <Button variant="ghost" onClick={clearAllFilters} className="flex items-center gap-1">
              <X className="h-4 w-4" />
              Nullstill filtre
            </Button>
          )}
        </div>

        {Object.keys(activeFilters).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {activeFilters.theme && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {activeFilters.theme}
                <button onClick={() => removeFilter("theme")} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {activeFilters.location && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {activeFilters.location}
                <button onClick={() => removeFilter("location")} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {activeFilters.date && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {format(activeFilters.date, "dd.MM.yyyy")}
                <button onClick={() => removeFilter("date")} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-muted-foreground">
          {loading ? "Laster arrangementer..." : `Viser ${filteredEvents.length} av ${events.length} arrangementer`}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-7xl w-full lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Link key={event.id} href={`/event_page?id=${event.id}`} passHref>
              <div className="cursor-pointer">
                <EventCard
                  title={event.title}
                  location={event.location}
                  imageUrl={event.imageUrl}
                  date={event.eventDate}
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Ingen arrangementer funnet</h3>
          <p className="text-muted-foreground mb-4">Prøv å endre søkekriteriene dine</p>
          <Button onClick={clearAllFilters}>Vis alle arrangementer</Button>
        </div>
      )}
    </div>
  )
}
