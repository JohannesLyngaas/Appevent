"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventsTable from "@/components/superbruker/eventsTable"
import UsersTable from "@/components/superbruker/usersTable"
import { Toaster } from "@/components/ui/sonner"

export default function Superbruker() {
  const [activeTab, setActiveTab] = useState("events")

  return (
    <div>
      <Tabs defaultValue="events" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="events">Arrangementer</TabsTrigger>
          <TabsTrigger value="users">Brukere</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <EventsTable />
        </TabsContent>
        <TabsContent value="users">
          <UsersTable />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}
