import { Users, MapPin } from "lucide-react";
import ProfileCard from "../components/ProfileCard";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ProfileHeader-komponenten viser brukerens profilbilde og informasjon.
// Den mottar en prop `user` som inneholder brukerdata.
export function ProfileHeader({ user }: { user: any }) {
  return (
    <div className="flex items-center space-x-4">
      {/* Avatar-komponent for å vise brukerens profilbilde */}
      <Avatar className="w-20 h-20">
        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
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