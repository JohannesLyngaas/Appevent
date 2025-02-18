"use client";
import { CloseButton } from "@/components/event_page/CloseButton";
import { EventPageCard } from "@/components/event_page/EventPageCard";

export default function EventPage() {
  return (
    <div className="min-h-screen min-w-screen bg-[#E9EDC9] grid grid-cols-1">
      <CloseButton />
      <EventPageCard />
    </div>
  );
}
