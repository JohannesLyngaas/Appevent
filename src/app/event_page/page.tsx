"use client";
import { CloseButton } from "@/components/event_page/CloseButton";
import { EventPageCard } from "@/components/event_page/EventPageCard";
import { EventPageLayout } from "@/components/event_page/EventPageLayout";

export default function EventPage() {
  return (
    <EventPageLayout>
      <CloseButton />
      <EventPageCard />
    </EventPageLayout>
  );
}
