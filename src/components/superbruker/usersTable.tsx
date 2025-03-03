"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Shield, ShieldAlert, Ban, UserCheck } from "lucide-react"
import { getAllUsers, promoteDemoteUser, banUser } from "@/lib/firebase/DatabaseFunksjoner"
import ConfirmBox from "@/components/superbruker/confirmBox"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/types"
import { formatTimestamp } from "@/utils/formatTimestamp"

/**
 * Komponenten under henter alle brukere fra firebase/firestore databasen
 * og legger dem i en liste som blir presentert for brukere med admin-rettigheter
 * og bare de, admin kan utestenge brukere, gi dem admin rolle osv.
 *  */
export default function UsersTable() {
  {/** konstantene under kombinert med useState funksjonen fra react brukes til å
    sjekke om det skjer endringer på siden. For eks hvis admin velger å utestenge en bruker
    vil funksjonen handleBanUser() lengre ned bruke const [actionType, setActionType]
    for om personen skal utestenges eller om admin vil fjerne utestengelse for en bruker. */}
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionType, setActionType] = useState<"promote" | "ban" | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers()
        setUsers(usersData)
      } catch (error) {
        console.error("Kunne ikke hente brukere:", error)
        toast.error("Kunne ikke hente brukere, prøv igjen senere.")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handlePromoteUser = async () => {
    if (!selectedUser) return

    try {
      const newRole = selectedUser.role === "admin" ? "user" : "admin"
      await promoteDemoteUser(selectedUser.id, newRole)

      setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, role: newRole } : user)))

      toast.success(`${selectedUser.userName || selectedUser.email} er nå ${newRole}.`)
    } catch (error) {
      console.error("Rolle oppdatering mislyktes:", error)
      toast.error("Kunne ikke oppdatere rollen til bruker. Prøv igjen senere.")
    } finally {
      setSelectedUser(null)
      setActionType(null)
      setIsDialogOpen(false)
    }
  }

  const handleBanUser = async () => {
    if (!selectedUser) return

    try {
      const newBanStatus = !selectedUser.banned
      await banUser(selectedUser.id, newBanStatus)

      setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, banned: newBanStatus } : user)))

      toast.success(`${selectedUser.userName || selectedUser.email} has been ${newBanStatus ? "banned" : "unbanned"}.`)
    } catch (error) {
      console.error("Noe gikk galt med å endre ban status:", error)
      toast.error("Kunne ikke endre ban status. Prøv igjen senere.")
    } finally {
      setSelectedUser(null)
      setActionType(null)
      setIsDialogOpen(false)
    }
  }

  const openActionDialog = (user: User, action: "promote" | "ban") => {
    setSelectedUser(user)
    setActionType(action)
    setIsDialogOpen(true)
  }

  const handleConfirmAction = () => {
    if (actionType === "promote") {
      handlePromoteUser()
    } else if (actionType === "ban") {
      handleBanUser()
    }
  }

  const getDialogContent = () => {
    if (!selectedUser) return { title: "", description: "" }

    const name = selectedUser.userName || selectedUser.email

    if (actionType === "promote") {
      const isSuperUser = selectedUser.role === "admin"
      return {
        title: isSuperUser ? "Fjern admin" : "Sett admin",
        description: isSuperUser
          ? `Er du sikker på at du vil fjerne admin rettighether fra ${name}?`
          : `Er du sikker på at du vil sette ${name} til admin?`,
      }
    } else if (actionType === "ban") {
      const isBanned = selectedUser.banned
      return {
        title: isBanned ? "Fjern utestengelse" : "Utesteng bruker",
        description: isBanned
          ? `Er du sikker på at du vil fjerne utestengelsen til ${name}?`
          : `Er du sikker på at du vil utestenge ${name}? De vil ikke kunne lage eller delta på arrangementer, og ikke kommentere lenger.`,
      }
    }

    return { title: "", description: "" }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="flex justify-center p-8">Henter brukere...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Bruker håndtering</h2>
        <Input
          placeholder="Søk brukere..."
          className="max-w-xs"
          value={ searchTerm }
          onChange={ (e) => setSearchTerm(e.target.value) }
        />
      </div>

      { users.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">Ingen brukere funnet.</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">Ingen brukere funnet som matcher dette søket.</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brukernavn</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Fult Navn</TableHead>
                <TableHead>Rolle</TableHead>
                <TableHead>Laget på dato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { filteredUsers.map((user) => (
                <TableRow key={ user.id } className={ user.banned ? "bg-muted/50" : "" }>
                  <TableCell className="font-medium">{ user.userName || "N/A" }</TableCell>
                  <TableCell>{ user.email }</TableCell>
                  <TableCell>{ `${user.firstName} ${user.lastName}` }</TableCell>
                  <TableCell>
                    { user.role === "admin" ? (
                      <Badge variant="destructive" className="">
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="default">Bruker</Badge>
                    ) }
                  </TableCell>
                  <TableCell>{ formatTimestamp(user.createdAt) }</TableCell>
                  <TableCell>
                    { user.banned ? (
                      <Badge variant="destructive">Utestengt</Badge>
                    ) : (
                      <Badge variant="default" className="border-green-200">
                        Aktiv
                      </Badge>
                    ) }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant={ user.role === "admin" ? "outline" : "default" }
                        size="icon"
                        onClick={ () => openActionDialog(user, "promote") }
                        title={ user.role === "admin" ? "Sett som bruker" : "Sett som admin" }
                      >
                        { user.role === "admin" ? (
                          <ShieldAlert className="h-4 w-4" />
                        ) : (
                          <Shield className="h-4 w-4" />
                        ) }
                      </Button>
                      <Button
                        variant={ user.banned ? "outline" : "destructive" }
                        size="icon"
                        onClick={ () => openActionDialog(user, "ban") }
                        title={ user.banned ? "Fjern utestengelse" : "Utesteng" }
                      >
                        { user.banned ? <UserCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" /> }
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </div>
      ) }

      <ConfirmBox
        isOpen={ isDialogOpen }
        onClose={ () => {
          setIsDialogOpen(false)
          setSelectedUser(null)
          setActionType(null)
        } }
        onConfirm={ handleConfirmAction }
        title={ getDialogContent().title }
        description={ getDialogContent().description }
      />
    </div>
  )
}
