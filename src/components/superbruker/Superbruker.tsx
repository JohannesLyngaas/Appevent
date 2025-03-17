"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsTable from "@/components/superbruker/eventsTable";
import UsersTable from "@/components/superbruker/usersTable";
import CommentTable from "@/components/superbruker/commentTable";
import { Toaster } from "@/components/ui/sonner";

export default function Superbruker() {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <div>
      <Tabs defaultValue="events" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="events">Arrangementer</TabsTrigger>
          <TabsTrigger value="users">Brukere</TabsTrigger>
          <TabsTrigger value="comments">Rapporterte kommentarer</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <EventsTable />
        </TabsContent>
        <TabsContent value="users">
          <UsersTable />
        </TabsContent>
        <TabsContent value="comments">
          <CommentTable />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}
