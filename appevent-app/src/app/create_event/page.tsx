import { CloseButton } from "@/components/create_event/CloseButton";
import { CreateEventCard } from "@/components/create_event/CreateEventCard";
import { Layout } from "@/components/layout/Layout";

export default function CreateEventPage() {
  return (
    <Layout>
      <div className="min-h-screen min-w-screen grid grid-cols-1">
        <CloseButton />
        <CreateEventCard />
      </div>
    </Layout>
  );
}
