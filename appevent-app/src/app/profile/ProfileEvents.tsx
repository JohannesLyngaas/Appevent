import { Users, MapPin } from "lucide-react";
import ProfileCard from "../components/ProfileCard";

// ProfileEvents-komponenten viser en liste over arrangementer brukeren deltar på.
// Den mottar en prop `eventsAttending` som inneholder en liste over arrangementer.
export default function ProfileEvents({ eventsAttending }: { eventsAttending: any[] }) {
  return (
    // ProfileCard brukes til å vise eventene i en strukturert layout.
    <ProfileCard title="Events I'm Attending" description="Upcoming events you're participating in">
      <ul className="space-y-4">
        {/* Mapper gjennom listen over arrangementer og viser hver enkelt */}
        {eventsAttending.map((event) => (
          <li key={event.id} className="flex items-center space-x-4">
            {/* Ikon for å indikere deltakelse */}
            <Users className="text-green-500" />
            <div>
              {/* Viser tittelen på arrangementet */}
              <p className="font-medium">{event.title}</p>
              {/* Viser dato for arrangementet */}
              <p className="text-sm text-muted-foreground">{event.date}</p>
              {/* Viser lokasjon med MapPin-ikon */}
              <p className="text-sm text-muted-foreground flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> {event.location}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </ProfileCard>
  );
}