"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase/config";
import { createEvent } from "@/lib/firebase/DatabaseFunksjoner";
import { useUserSession } from "@/hooks/useUserSession";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types";
import { CloseButton } from "@/components/create_event/CloseButton";

const eventSchema = z.object({
  title: z.string().min(3, "Tittel må være minst 3 tegn").max(100),
  description: z.string().min(5, "Beskrivelse må være minst 5 tegn"),
  location: z.string().min(3, "Sted må være minst 3 tegn"),
  eventDate: z.string().min(1, "Dato er påkrevd"),
  startTime: z.string().min(1, "Starttid er påkrevd"),
  endTime: z.string().optional(),
  endDate: z.string().optional(),
  visibility: z.enum(["public", "private"]),
  imageUrl: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function CreateEventForm() {
  const userSession = useUserSession(null);
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userSuggestions, setUserSuggestions] = useState<User[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      eventDate: "",
      startTime: "",
      endTime: "",
      endDate: "",
      visibility: "public",
      imageUrl: "",
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      if (userSearch.length < 2) {
        setUserSuggestions([]);
        return;
      }

      try {
        const usersCollection = collection(firebaseDb, "users");
        const userQuery = query(usersCollection, where("email", ">=", userSearch), where("email", "<=", userSearch + "\uf8ff"));
        const snapshot = await getDocs(userQuery);
        setUserSuggestions(snapshot.docs.filter(u => u.id !== userSession?.id).map((doc) => ({ id: doc.id, ...doc.data() } as User)));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [userSearch]);

  const handleUserSelect = (user: User) => {
    if (!invitedEmails.includes(user.email)) {
      setInvitedEmails([...invitedEmails, user.email]);
    }
    setUserSearch("");
    setUserSuggestions([]);
  };

  const handleRemoveInvite = (email: string) => {
    setInvitedEmails(invitedEmails.filter((e) => e !== email));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  async function onSubmit(data: EventFormValues) {
    try {
      let imageUrl = "";
      if (imageFile) {
        // må legge til logikk for å lase opp bild her
        imageUrl = URL.createObjectURL(imageFile);
      }

      const newEventId = await createEvent(
        {
          ...data,
          imageUrl,
          endTime: data.endTime || "",
          endDate: data.endDate || "",
          createdAt: new Date().toISOString(),
        },
        invitedEmails,
        userSession?.id || ""
      );

      toast.success("Arrangement opprettet!", { description: `Event: ${data.title}` });
      router.push(`/event_page?id=${newEventId}&fromCreate=true`);
    } catch (error) {
      toast.error("Feil ved opprettelse av arrangement.");
      console.error("Feil ved opprettelse av arrangement:", error);
    }
  }

  return (
    <div className="flex flex-col gap-2 max-w-2xl w-full">
      <CloseButton />
      <Form { ...form }>
        <form onSubmit={ form.handleSubmit(onSubmit) } className="flex flex-col justify-center items-center space-y-4 bg-card border rounded-lg p-3">
          <FormItem className="w-full">
            <FormLabel className="text-base">Last opp bilde</FormLabel>
            <FormControl>
              <Input type="file" accept="image/*" onChange={ handleImageUpload } />
            </FormControl>
          </FormItem>
          { imagePreview && <img src={ imagePreview } alt="Preview" className="w-72 h-60 mt-2 rounded-lg" /> }

          <div className="flex flex-col w-full gap-y-5">
            <FormField control={ form.control } name="title" render={ ({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Tittel</FormLabel>
                <FormControl><Input placeholder="Skriv inn tittel" { ...field } /></FormControl>
                <FormMessage />
              </FormItem>
            ) } />

            <FormField control={ form.control } name="description" render={ ({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Beskrivelse</FormLabel>
                <FormControl><Textarea placeholder="Skriv en beskrivelse" { ...field } /></FormControl>
                <FormMessage />
              </FormItem>
            ) } />

            <FormField control={ form.control } name="location" render={ ({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Sted</FormLabel>
                <FormControl><Input placeholder="Skriv inn sted" { ...field } /></FormControl>
                <FormMessage />
              </FormItem>
            ) } />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={ form.control } name="eventDate" render={ ({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Startdato</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      min={ today }
                      value={ field.value }
                      onChange={ (e) => {
                        field.onChange(e.target.value);
                        form.setValue("endDate", "");
                      } }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) } />

              <FormField control={ form.control } name="startTime" render={ ({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Starttid</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      min={ form.watch("eventDate") === today ? new Date().toISOString().slice(11, 16) : undefined }
                      value={ field.value }
                      onChange={ (e) => {
                        field.onChange(e.target.value);
                        form.setValue("endTime", "");
                      } }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) } />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={ form.control } name="endDate" render={ ({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Sluttdato</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      min={ form.watch("eventDate") || today }
                      value={ field.value }
                      onChange={ (e) => field.onChange(e.target.value) }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) } />

              <FormField control={ form.control } name="endTime" render={ ({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Sluttid</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      min={ form.watch("endDate") === form.watch("eventDate") ? form.watch("startTime") : undefined } // End time must be after start time if same day
                      value={ field.value }
                      onChange={ (e) => field.onChange(e.target.value) }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ) } />
            </div>

            <FormItem>
              <FormLabel className="text-base">Inviter brukere</FormLabel>
              <FormControl>
                <Input placeholder="Søk etter e-post..." value={ userSearch } onChange={ (e) => setUserSearch(e.target.value) } />
              </FormControl>
            </FormItem>
            <div className="flex flex-col gap-2">
              <ul className="flex flex-col gap-1 max-h-44 overflow-auto ">
                { userSuggestions.map((user) => (
                  <Button key={ user.id } variant={ "ghost" } type="button" className="max-w-fit hover:scale-100" onClick={ () => handleUserSelect(user) }>{ `${user.firstName}: ${user.email}` }</Button>
                )) }
              </ul>

              <p className="text-base font-medium">Inviterte brukere: </p>
              <div className="flex flex-row">
                { invitedEmails.map((email) => (
                  <Badge key={ email } className="mr-2 max-w-fit p-1 px-2 hover:bg-slate-950">
                    { email } <span className="cursor-pointer ml-1" onClick={ () => handleRemoveInvite(email) }>✕</span>
                  </Badge>
                )) }
              </div>
            </div>
          </div>
          <Button variant={ "default" } type="submit" className="w-full hover:scale-100 text-lg font-semibold">Opprett arrangement</Button>
        </form>
      </Form>
    </div>
  );
}