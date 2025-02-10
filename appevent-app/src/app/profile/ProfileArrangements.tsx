import ProfileCard from "./ProfileCard";

// ProfileArrangements-komponenten viser en liste over arrangementer brukeren har opprettet.
// Den mottar en prop `arrangements` som inneholder en liste over disse arrangementene.
export function ProfileArrangements({ arrangements }: { arrangements: any[] }) {
    return (
      // ProfileCard brukes til å vise brukerens egne arrangementer.
      <ProfileCard title="My Arrangements" description="Events you've arranged">
        <ul className="space-y-4">
          {/* Mapper gjennom listen over arrangementer og viser hver enkelt */}
          {arrangements.map((arr) => (
            <li key={arr.id} className="flex items-center space-x-4">
              <div>
                {/* Viser tittelen på arrangementet */}
                <p className="font-medium">{arr.title}</p>
                {/* Viser dato for arrangementet */}
                <p className="text-sm text-muted-foreground">{arr.date}</p>
                {/* Tom plassholder for fremtidige detaljer */}
                <p className="text-sm text-muted-foreground flex items-center"></p>
              </div>
            </li>
          ))}
        </ul>
      </ProfileCard>
    );
  }
  
