"use client";

import { ProfileForm } from "@/components/profil/ProfileForm";
import ProfilePictureCard from "@/components/profil/ProfilePictureCard";
import { Card } from "@/components/ui/card";
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Tables from "@/components/profil/Tables"


export default function Profil() {
  const [activeTab, setActiveTab] = useState("events")
  return (
    <Card className="flex flex-row mx-16 max-w-6xl gap-5 p-5">
      <div className="w-1/4">
        <ProfilePictureCard />
      </div>
      <div className="w-3/4 border p-2 rounded-lg">
        <Tabs defaultValue="profileform" onValueChange={ setActiveTab }>
          <TabsList className="mb-3 ring-1 ring-zinc-700">
            <TabsTrigger value="profileform" className="~text-sm/base">Rediger brukerinfo</TabsTrigger>
            <TabsTrigger value="arrangementer" className="~text-sm/base">Rediger dine arrangementer</TabsTrigger>
          </TabsList>
          <TabsContent value="profileform">
            <ProfileForm />
          </TabsContent>
          <TabsContent value="arrangementer">
            <Tables />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
