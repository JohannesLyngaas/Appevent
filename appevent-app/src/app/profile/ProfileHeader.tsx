import { Users, MapPin } from "lucide-react";
import ProfileCard from "../profile/ProfileCard";

// ProfileHeader-komponenten viser brukerens profilbilde og informasjon.
// Den mottar en prop `user` som inneholder brukerdata.
export function ProfileHeader({ user }: { user: any }) {
  return (
  
        {/* Viser brukerens navn */}
        <p className="text-xl font-semibold">{user.name}</p>
        {/* Viser brukernavnet */}
        <p className="text-sm text-muted-foreground">@{user.username}</p>
        {/* Viser e-postadressen */}
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}