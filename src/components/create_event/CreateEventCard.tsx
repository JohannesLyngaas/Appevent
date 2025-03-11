"use client";

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { createEvent } from "@/lib/firebase/DatabaseFunksjoner";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "./ImageUploader";
import { CloseButton } from "./CloseButton";

function CreateEventCard() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [pastDateWarning, setPastDateWarning] = useState(false);
  const [noEndTime, setNoEndTime] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>("");
  const [publicId, setPublicId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    imageUrl: "",
    visibility: "public" as "public" | "private",
    createdBy: "", // TODO: Legg til createdBy fra bruker som er logget inn
    invitedUsers: [],
  });

  const handleDeleteImage = async () => {
    if (publicId) {
      try {
        const response = await fetch('/api/delete-cloudinary-image', {
          method: 'POST',
          body: JSON.stringify({ publicId }),
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.success) {
          setUploadedImageUrl(null);
          setPublicId(null);
          setFormData((prev) => ({ ...prev, imageUrl: "" }));
        } else {
          alert("Error deleting image from Cloudinary.");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Error deleting image.");
      }
    }
  };

  // Finner dagens dato i format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check for past dates
    if (name === "eventDate") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of day for comparison

      setPastDateWarning(selectedDate < today);
    }

    // Check validation when changing date or time fields
    if (
      name === "eventDate" ||
      name === "endDate" ||
      name === "startTime" ||
      name === "endTime"
    ) {
      validateDateTime(
        name === "eventDate" ? value : formData.eventDate,
        name === "endDate" ? value : formData.endDate,
        name === "startTime" ? value : formData.startTime,
        name === "endTime" ? value : formData.endTime
      );
    }


  };

  const handleInputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Kun oppdater endDate når eventDate-feltet mister fokus
    if (name === "eventDate" && value) {
      // Sjekk om det er en gyldig dato
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        // Sett endDate til samme verdi som eventDate hvis endDate er tom
        setFormData((prev) => ({
          ...prev,
          endDate: prev.endDate ? prev.endDate : value,
        }));
      }
    }
  };

  const handleNoEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setNoEndTime(checked);

    if (checked) {
      // If "No end time" is selected, clear end date and time
      setFormData((prev) => ({
        ...prev,
        endDate: "",
        endTime: "",
      }));
      // Clear any validation errors
      setDateError(false);
    } else if (formData.eventDate) {
      // If unchecked and we have a start date, set end date to match start date
      setFormData((prev) => ({
        ...prev,
        endDate: prev.eventDate,
      }));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // If setting end time but no end date is set, use the start date
    if (name === "endTime" && !formData.endDate && formData.eventDate) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        endDate: prev.eventDate,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Run validation
    validateDateTime(
      formData.eventDate,
      name === "endDate" ? value : formData.endDate,
      name === "startTime" ? value : formData.startTime,
      name === "endTime" ? value : formData.endTime
    );
  };

  const validateDateTime = (
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string
  ) => {
    // Skip validation if "No end time" is selected
    if (noEndTime) {
      setDateError(false);
      return;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check if dates are different
      if (end < start) {
        setDateError(true);
        return;
      }

      // If same date, check times
      if (startDate === endDate && startTime && endTime) {
        if (endTime < startTime) {
          setDateError(true);
          return;
        }
      }

      // No errors
      setDateError(false);
    }
  };

  const handleVisibilityChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      visibility: checked ? "private" : "public",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedImageUrl) {
      alert("Vennligst last opp et bilde før du oppretter arrangementet.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Pass the formData with current endDate/endTime values
      // They will be empty if noEndTime is true
      const newEventId = await createEvent({
        ...formData,
        createdAt: new Date().toISOString(),
      });

      router.push(`/event_page?id=${newEventId}&fromCreate=true`);
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
    <CloseButton onClick={handleDeleteImage}/>
    <form className="flex flex-col items-center" onSubmit={handleSubmit}>
      <Input
        type="text"
        name="title"
        placeholder="Tittel"
        value={formData.title}
        onChange={handleInputChange}
        className="h-20 w-1/3 text-center border-border
                     text-4xl text-text"
        required
      />

      {/* Visibility toggle switch */}
      <div className="flex items-center justify-center gap-4 mt-4 w-full">
        <Switch
          id="event-visibility"
          checked={formData.visibility === "private"}
          onCheckedChange={handleVisibilityChange}
          className="data-[state=checked]:bg-red-500 scale-125"
        />
        <Label htmlFor="event-visibility" className="text-text text-lg">
          {formData.visibility === "public" ? "Offentlig" : "Privat"}{" "}
          arrangement
        </Label>
      </div>

      <div className="flex flex-row gap-x-20 mt-8">
        <label className="flex flex-col text-xl text-text">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-1">
              <span className="font-medium">Fra:</span>
              <div className="flex gap-x-2">
                <Input
                  type="date"
                  name="eventDate"
                  placeholder="Start dato"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={`h-10 text-center text-xl rounded-md ${
                    pastDateWarning ? "border-red-500 border-2" : ""
                  }`}
                  required
                />
                <Input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="h-10 text-center text-xl rounded-md"
                  required
                />
              </div>
              {pastDateWarning && (
                <span className="text-red-500 text-sm mt-1">
                  OBS: Du har valgt en dato som allerede har vært.
                </span>
              )}
            </div>

            {/* No end time checkbox */}
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="noEndTime"
                checked={noEndTime}
                onChange={handleNoEndTimeChange}
                className="h-4 w-4"
              />
              <label htmlFor="noEndTime" className="text-sm font-medium">
                Ingen sluttid
              </label>
            </div>

            {!noEndTime && (
              <div className="flex flex-col gap-y-1">
                <span className="font-medium">Til:</span>
                <div className="flex gap-x-2">
                  <Input
                    type="date"
                    name="endDate"
                    placeholder="Slutt dato"
                    min={formData.eventDate || today}
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`h-10 text-center text-xl rounded-md ${
                      dateError ? "border-red-500 border-2" : ""
                    }`}
                    required={!noEndTime}
                  />
                  <Input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleTimeChange}
                    className={`h-10 text-center text-xl rounded-md ${
                      dateError && formData.eventDate === formData.endDate
                        ? "border-red-500 border-2"
                        : ""
                    }`}
                    required={!noEndTime}
                  />
                </div>
                {dateError && (
                  <span className="text-red-500 text-sm mt-1">
                    {formData.eventDate === formData.endDate
                      ? "Slutt klokkeslett kan ikke være før start klokkeslett"
                      : "Slutt dato kan ikke være før start dato"}
                  </span>
                )}
              </div>
            )}
          </div>
        </label>
        <label className="flex flex-col text-xl text-text">
          Hvor?
          <Input
            type="text"
            name="location"
            placeholder="Sted"
            value={formData.location}
            onChange={handleInputChange}
            className="h-10 text-center text-xl rounded-md"
            required
          />
        </label>
      </div>
      <textarea
        name="description"
        placeholder="Besrivelse"
        value={formData.description}
        onChange={handleInputChange}
        className="h-80 w-1/2 mt-10 placeholder-placeholder text-xl pl-4 pt-4 border border-border rounded-md"
        required
      />
      <div className="mt-8 flex flex-col items-center">
        <label className="text-xl text-text mb-2">{uploadedImageUrl ? "Opplastet bilde:" : "Last opp bilde"}</label>
        <ImageUploader 
          onUploadSuccess={(url, publicId) => {
            setUploadedImageUrl(url);
            setPublicId(publicId);
            setFormData((prev) => ({ ...prev, imageUrl: url }));
          }}
          onDeleteSuccess={() => {
            setUploadedImageUrl(null); 
            setPublicId(null);
            setFormData((prev) => ({ ...prev, imageUrl: "" })); 
          }}/>
      </div>
      <div className="flex gap-4 my-10">
        <Button
          type="submit"
          variant={"outline"}
          className="py-6 rounded-lg text-white"
          disabled={isSubmitting || dateError || pastDateWarning}
        >
          {isSubmitting ? "Oppretter..." : "Opprett arrangement"}
        </Button>
      </div>
    </form>
    </div>
  );
}

export { CreateEventCard };
