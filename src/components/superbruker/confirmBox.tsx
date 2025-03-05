"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

/**
 * interfacet under er en måte å si til andre at dersom de bruker komponent ConfirmBox
 * så må de ha med alle disse parameterne. For eks må isOpen være en boolean, den kan ikke
 * være noe annet enn det. () => void betyr at onclose skal være en funksjon eller en handling, jsx element.
 * Hvis man ikke gir disse parameterne verdier vil man få error.
 */
interface ConfirmBoxProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
}

/**
 * Under er en dialog boks som dukker opp når visse knapper trykkes i eventsTable.tsx eller userTable.tsx
 * Dette komponentente krever visse parametere som er definert i ConfirmBoxProps over.
 * { isOpen, onClose, onConfirm, title, description }: ConfirmBoxProps er en måte å si
 * at disse parameterne få fylles ut når man bruker confirmBox andre steder og at hva parameterne skal være
 * er definer i interface ConfirmBoxProps over. For eks. kan man bare gi title som en string og bare string.
 */
export default function ConfirmBox({ isOpen, onClose, onConfirm, title, description }: ConfirmBoxProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}