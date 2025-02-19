import { CloseButton } from "@/components/create_event/CloseButton";
import { CreateEventCard } from "@/components/create_event/CreateEventCard";

export default function CreateEventPage() {
  return (

    <div className="min-h-screen min-w-screen grid grid-cols-1">
      <CloseButton />
      <CreateEventCard />
    </div>
  );
}
