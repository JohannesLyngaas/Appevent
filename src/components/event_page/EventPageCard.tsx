"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Users, Lock, Globe } from "lucide-react";
import { AttendanceButtonAlert } from "@/components/event_page/AttendanceButtonAlert";
import { getAllEvents } from "@/lib/firebase/DatabaseFunksjoner";
import { useSearchParams } from "next/navigation";
import type { Event } from "@/types";

export function EventPageCard() {
  const [isAttending, setIsAttending] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");

  useEffect(() => {
    async function fetchEvent() {
      try {
        if (eventId) {
          const events = await getAllEvents();
          const foundEvent = events.find((e) => e.id === eventId);
          if (foundEvent) {
            setEvent(foundEvent);
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  const handleAttend = () => {
    setIsAttending(true);
  };

  const handleCancel = () => {
    setIsAttending(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Laster arrangement...
      </div>
    );
  }

  if (!event) {
    // Vis standard dummydata hvis ingen eventId er spesifisert
    const defaultEvent = {
      title: "Tittel på arrangement",
      eventDate: new Date().toISOString().split("T")[0],
      startTime: "18:00",
      location: "Trondheim",
      description: "Velkommen til mitt første arrangement! Ta med godt humør.",
      imageUrl: "",
      visibility: "public",
    };

    return (
      <div className="flex flex-col items-center">
        <h1 className="h-20 mt-5 text-center text-4xl bg-[#FEFFF4] border-2 border-[#96A074] rounded-md w-fit px-8 py-4">
          {defaultEvent.title}
        </h1>

        <div className="flex items-center gap-2 mt-2">
          {defaultEvent.visibility === "private" ? (
            <>
              <Lock className="w-5 h-5 text-red-500" />
              <span className="text-red-500 font-medium">
                Privat arrangement
              </span>
            </>
          ) : (
            <>
              <Globe className="w-5 h-5 text-[#96A074]" />
              <span className="text-[#96A074] font-medium">
                Offentlig arrangement
              </span>
            </>
          )}
        </div>

        <div className="flex flex-row gap-x-20 mt-8">
          <div className="flex flex-col text-xl text-[#96A074]">
            <span>Klokkeslett</span>
            <div className="flex gap-x-2">
              <div className="h-10 text-center text-xl bg-[#FEFFF4] border-2 border-[#96A074] rounded-md px-4 py-1">
                {new Date(defaultEvent.eventDate).toLocaleDateString("no-NO")}
              </div>
              <div className="h-10 text-center text-xl bg-[#FEFFF4] border-2 border-[#96A074] rounded-md px-4 py-1">
                {defaultEvent.startTime}
              </div>
            </div>
          </div>

          <div className="flex flex-col text-xl text-[#96A074]">
            <span>Sted</span>
            <div className="h-10 text-center text-xl bg-[#FEFFF4] border-2 border-[#96A074] rounded-md px-4 py-1">
              {defaultEvent.location}
            </div>
          </div>
        </div>

        <div className="w-1/2 mt-10 text-xl pl-4 pt-4 bg-[#FEFFF4] border-2 border-[#96A074] rounded-md min-h-[200px]">
          {defaultEvent.description}
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

  return (
    <div className="flex flex-col items-center">
      {event.imageUrl && (
        <div className="relative w-full h-48 mb-4">
          <div className="relative h-full flex items-center justify-center">
            <h1 className="text-4xl text-black font-semibold px-8 py-4">
              {event.title}
            </h1>
          </div>
        </div>
      )}

      {!event.imageUrl && (
        <h1 className="h-20 mt-5 text-center text-4xl bg-[#FEFFF4] border-2 border-[#96A074] rounded-md w-fit px-8 py-4">
          {event.title}
        </h1>
      )}

      <div className="flex items-center gap-2 mt-2">
        {event.visibility === "private" ? (
          <>
            <Lock className="w-5 h-5 text-red-500" />
            <span className="text-red-500 font-medium">Privat arrangement</span>
          </>
        ) : (
          <>
            <Globe className="w-5 h-5 text-[#96A074]" />
            <span className="text-[#96A074] font-medium">
              Offentlig arrangement
            </span>
          </>
        )}
      </div>

      <div className="flex flex-row gap-x-20 mt-8">
        <div className="flex flex-col text-xl text-[#96A074]">
          <span>Klokkeslett</span>
          <div className="flex gap-x-2">
            <div className="h-10 text-center text-xl bg-[#FEFFF4] border-2 border-[#96A074] rounded-md px-4 py-1">
              {new Date(event.eventDate).toLocaleDateString("no-NO")}
            </div>
            <div className="h-10 text-center text-xl bg-[#FEFFF4] border-2 border-[#96A074] rounded-md px-4 py-1">
              {event.startTime}
            </div>
          </div>
        </div>

        <div className="flex flex-col text-xl text-[#96A074]">
          <span>Sted</span>
          <div className="h-10 text-center text-xl bg-[#FEFFF4] border-2 border-[#96A074] rounded-md px-4 py-1">
            {event.location}
          </div>
        </div>
      </div>

      <div className="w-1/2 mt-10 text-xl pl-4 pt-4 bg-[#FEFFF4] border-2 border-[#96A074] rounded-md min-h-[200px]">
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
