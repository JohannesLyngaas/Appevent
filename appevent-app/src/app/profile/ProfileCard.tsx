import { Users, MapPin } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ProfileCard-komponenten brukes til å vise innhold i en kort-layout med tittel og beskrivelse.
export function ProfileCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="p-4 border rounded-lg shadow">
      {/* Viser kortets tittel */}
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {/* Viser kortets beskrivelse dersom det finnes */}
      {description && <p className="text-sm text-muted-foreground mb-2">{description}</p>}
      {/* Innholdet i kortet */}
      {children}
    </div>
  );
}