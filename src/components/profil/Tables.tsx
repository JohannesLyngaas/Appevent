"use client";

import { useState } from "react";
import InvitedEventsTable from "@/components/profil//InvitedEventsTable";
import MyEventsTable from "@/components/profil/MyEventsTable";
import ParticipatingEventsTable from "@/components/profil/ParticipatingEventsTable";
import { Input } from "@/components/ui/input";

export default function Tables() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold"></h2>
        <Input
          placeholder="Søk arrangementer..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <MyEventsTable searchTerm={searchTerm} />
      <ParticipatingEventsTable searchTerm={searchTerm} />
      <InvitedEventsTable searchTerm={searchTerm} />
    </div>
  );
}