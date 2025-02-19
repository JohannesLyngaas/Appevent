"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getDaysInMonth,
  startOfMonth,
  format,
  addMonths,
  subMonths,
  isSameDay,
  parseISO,
} from "date-fns";

// Mock data for events
const events = [
  {
    id: 1,
    title: "Valentines Middag",
    date: "2025-02-14",
    time: "19:00",
    location: "Olivia Restaurant",
    attendees: 2,
    type: "planned",
  },
  {
    id: 2,
    title: "Team Building",
    date: "2025-02-20",
    time: "14:00",
    location: "Escape Room Oslo",
    attendees: 12,
    type: "invited",
  },
  {
    id: 3,
    title: "Filmkveld",
    date: "2025-02-28",
    time: "20:00",
    location: "Colosseum Kino",
    attendees: 8,
    type: "planned",
  },
];

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = startOfMonth(currentDate);
  const startingDayIndex = firstDayOfMonth.getDay();

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const getEventsForDay = (day: number) => {
    const dateString = format(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
      "yyyy-MM-dd"
    );
    return events.filter((event) => event.date === dateString);
  };

  const isToday = (day: number) => {
    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return isSameDay(checkDate, new Date());
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={handlePrevMonth}
          variant="outline"
          size="icon"
          className="text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button
          onClick={handleNextMonth}
          variant="outline"
          size="icon"
          className="text-gray-600 hover:text-gray-800"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-4 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-medium text-sm text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: startingDayIndex }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayEvents = getEventsForDay(day);
          return (
            <div
              key={day}
              className={`p-2 border rounded-lg min-h-[120px] transition-all duration-200 ease-in-out
                ${dayEvents.length > 0 ? "bg-primary/5" : "hover:bg-gray-50"}
                ${isToday(day) ? "border-red-500 border-2" : "border-gray-200"}
              `}
            >
              <div
                className={`font-medium text-sm mb-1 ${
                  isToday(day) ? "text-red-500" : "text-gray-700"
                }`}
              >
                {day}
              </div>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className={`mt-1 p-2 rounded-md shadow-sm ${
                    event.type === "planned" ? "bg-green-50" : "bg-blue-50"
                  }`}
                >
                  <div className="font-medium text-sm mb-1 text-gray-800">
                    {event.title}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-600 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{event.attendees} deltakere</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
