"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { object, z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useUserSession } from "@/hooks/useUserSession"
import { useEffect } from "react"
import { updateUserInfo } from "@/lib/firebase/DatabaseFunksjoner"

const profileFormSchema = z.object({
  firstName: z.string().min(1).max(20).optional(),
  lastName: z.string().min(1).max(20).optional(),
  userName: z
    .string()
    .min(2, {
      message: "Brukernavn kan ikke være mindre enn 2 tegn.",
    })
    .max(30, {
      message: "Brukernavn kan ikke være lengre enn 30 tegn.",
    })
    .optional(),
  email: z
    .string({
      message: "Vennligst tast inn et mail.",
    })
    .email()
    .optional(),
  bio: z.string().max(160).min(0).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const userSession = useUserSession(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      bio: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    if (userSession) {
      const values = {
        firstName: userSession.firstName ?? "",
        lastName: userSession.lastName ?? "",
        userName: userSession.userName ?? "",
        email: userSession.email ?? "",
        bio: userSession.bio ?? "",
      }
      form.reset(values)
    }
  }, [userSession, form])

  function toUpperCase(string: string) {
    const change = string.toLowerCase();
    return change[0].toUpperCase;
  }

  async function onSubmit(data: ProfileFormValues) {
    const currentValues = {
      firstName: userSession?.firstName ?? "",
      lastName: userSession?.lastName ?? "",
      userName: userSession?.userName ?? "",
      email: userSession?.email ?? "",
      bio: userSession?.bio ?? "",
    }

    const updatedFields: Partial<ProfileFormValues> = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== currentValues[key as keyof ProfileFormValues]),
    )

    if (Object.keys(updatedFields).length === 0) {
      toast.warning("Ingen endringer oppdaget.")
      return
    }


      await updateUserInfo(userSession?.id ?? "", updatedFields);


    toast("Du har endret og lagt til følgende:", {
      description: (
        <div className="mt-2 w-full ~text-base/lg rounded-md p-4">
          { Object.entries(updatedFields).map(([key, value]) => (
            <div key={ key } className="text-sm">
              <span className="font-semibold">{key}: </span>
              { value }
            </div>
          )) }
        </div>
      ),
    })
  }

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-2">
        <FormField
          control={ form.control }
          name="firstName"
          render={ ({ field }) => (
            <FormItem>
              <FormLabel className="~text-base/lg">Fornavn</FormLabel>
              <FormControl>
                <Input placeholder="Skriv inn fornavn" { ...field } />
              </FormControl>
              <FormDescription>Endre fornavn ved å endre dette feltet.</FormDescription>
              <FormMessage />
            </FormItem>
          ) }
        />
        <FormField
          control={ form.control }
          name="lastName"
          render={ ({ field }) => (
            <FormItem>
              <FormLabel className="~text-base/lg">Etternavn</FormLabel>
              <FormControl>
                <Input placeholder="Skriv inn etternavn" { ...field } />
              </FormControl>
              <FormDescription>Endre etternavn ved å endre dette feltet.</FormDescription>
              <FormMessage />
            </FormItem>
          ) }
        />
        <FormField
          control={ form.control }
          name="userName"
          render={ ({ field }) => (
            <FormItem>
              <FormLabel className="~text-base/lg">userName</FormLabel>
              <FormControl>
                <Input placeholder="Skriv inn brukernavn" { ...field } />
              </FormControl>
              <FormDescription>Din nåværende brukernavn. Endre brukernavn ved å endre dette feltet.</FormDescription>
              <FormMessage />
            </FormItem>
          ) }
        />
        <FormField
          control={ form.control }
          name="email"
          render={ ({ field }) => (
            <FormItem>
              <FormLabel className="~text-base/lg">Email</FormLabel>
              <FormControl>
                <Input placeholder="Skriv inn email" { ...field } />
              </FormControl>
              <FormDescription>Endre dette feltet for å endre mailen din.</FormDescription>
              <FormMessage />
            </FormItem>
          ) }
        />
        <FormField
          control={ form.control }
          name="bio"
          render={ ({ field }) => (
            <FormItem>
              <FormLabel className="~text-base/lg">Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Fortell oss litt om deg selv." className="resize-none" style={{fontSize: 18}} { ...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          ) }
        />
        <Button variant={"default"} className="~text-base/lg">
          Oppdater profil
        </Button>
      </form>
    </Form>
  )
}