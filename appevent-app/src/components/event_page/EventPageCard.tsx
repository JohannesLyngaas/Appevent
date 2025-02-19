"use client";
import Link from "next/link";
import { useState } from "react";
import { Users } from "lucide-react";
import { AttendanceButtonAlert } from "@/components/event_page/AttendanceButtonAlert";

export function EventPageCard() {
  const [isAttending, setIsAttending] = useState(false);

  const event = {
    title: "Tittel på arrangement",
    date: "2024-04-15",
    time: "18:00",
    location: "Trondheim",
    description: "Velkommen til mitt første arrangement! Ta med godt humør.",
    image: "/festningen.jpg",
    attendees: 1000,
  };

  const handleAttend = () => {
    setIsAttending(true);
  };

  const handleCancel = () => {
    setIsAttending(false);
  };

  return (
    <div className="flex flex-col items-center">
      {event.image && (
        <div className="relative w-full h-48 mb-4">
          <div className="relative h-full flex items-center justify-center">
            <h1 className="text-4xl text-black font-semibold px-8 py-4">
              {event.title}
            </h1>
          </div>
        </div>
      )}

      {!event.image && (
        <h1
          className="h-20 mt-5 text-center text-4xl
          bg-[#FEFFF4] border-2 border-[#96A074] rounded-md w-fit px-8 py-4"
        >
          {event.title}
        </h1>
      )}

      <div className="flex flex-row gap-x-20 mt-8">
        <div className="flex flex-col text-xl text-[#96A074]">
          <span>Klokkeslett</span>
          <div className="flex gap-x-2">
            <div
              className="h-10 text-center text-xl
              bg-[#FEFFF4] border-2 border-[#96A074] rounded-md px-4 py-1"
            >
              {new Date(event.date).toLocaleDateString("no-NO")}
            </div>
            <div
              className="h-10 text-center text-xl
              bg-[#FEFFF4] border-2 border-[#96A074] rounded-md px-4 py-1"
            >
              {event.time}
            </div>
          </div>
        </div>

        <div className="flex flex-col text-xl text-[#96A074]">
          <span>Sted</span>
          <div
            className="h-10 text-center text-xl
            bg-[#FEFFF4] border-2 border-[#96A074] rounded-md px-4 py-1"
          >
            {event.location}
          </div>
        </div>

        <div className="flex flex-col text-xl text-[#96A074]">
          <span>Deltakere</span>
          <div
            className="h-10 text-center text-xl
            bg-[#FEFFF4] border-2 border-[#96A074] rounded-md px-4 py-1 flex items-center gap-2"
          >
            <Users className="w-5 h-5" />
            <span>{event.attendees} deltakere</span>
          </div>
        </div>
      </div>

      <div
        className="w-1/2 mt-10 text-xl pl-4 pt-4
        bg-[#FEFFF4] border-2 border-[#96A074] rounded-md min-h-[200px]"
      >
        {event.description}
      </div>

      <div className="flex gap-4 my-10">
        <AttendanceButtonAlert
          isAttending={isAttending}
          onAttend={handleAttend}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
