'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Pencil } from 'lucide-react';
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useUserSession } from "@/hooks/useUserSession"

export default function ProfilePictureCard() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true)
  const [profilePic, setProfilePic] = useState<string>();
  const userSession = useUserSession(null);

  useEffect(() => {
      try {
        setLoading(true)
        setProfilePic(userSession?.imageUrl);
      } catch (e) {
        console.log("Kunne ikke hente profilbilde", e);
        toast.error("Kunne ikke hente profilbilde");
      } finally {
        setLoading(false);
      }

  }, [userSession]);

  if (loading) {
    return <div className="flex justify-center p-8">Henter profilbilde...</div>
  }
  return (
    <Card className="w-full max-w-md flex flex-col items-center">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="~text-sm/base">Oppdater profilbilde</CardTitle>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShow(prev => (!prev))}>
            <Pencil className="h-5 w-5" />
          </Button>
        </div>
        <CardDescription className="~text-xs/sm">
          Endre profilbilde ved å trykke på blyanten i høyre hjørne. <br />
          Velg deretter et bilde ved å trykke på 'Velg Fil'.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid gap-2 text-center">
            <Label htmlFor="profileBilde" className="text-base">Profilbilde</Label>
            <div className="flex items-center flex-col gap-4">
              <Avatar className="h-48 w-48 rounded-lg">
                <AvatarImage src={profilePic} alt="bilde" style={{objectFit: "fill"}}/>
                <AvatarFallback>Empty</AvatarFallback>
              </Avatar>
              { show &&
              <Input id="profilBilde" type="file" className="~text-xs/sm"/>
              }
            </div>
          </div>
        </form>
      </CardContent>
      { show &&
      <CardFooter>
        <Button variant="default" type="submit" className="~text-base/lg">Oppdater bilde</Button>
      </CardFooter>
      }
    </Card>
  )
}