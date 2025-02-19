"use client";
import { CloseButton } from "@/components/event_page/CloseButton";
import { EventPageCard } from "@/components/event_page/EventPageCard";
import { EventPageLayout } from "@/components/event_page/EventPageLayout";
import { Layout } from "@/components/layout/Layout";

export default function EventPage() {
  return (
    <Layout>
      <EventPageLayout>
        <CloseButton />
        <EventPageCard />
      </EventPageLayout>
    </Layout>
  );
}
