"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  registerEventParticipant,
  leaveEvent,
  removeEventParticipant,
} from "@/lib/firebase/DatabaseFunksjoner";
import { getCurrentUserID } from "@/lib/firebase/auth/auth";

interface AttendanceButtonAlertProps {
  isAttending: boolean;
  onAttend: () => void;
  onCancel: () => void;
  eventId: string;
}

export function AttendanceButtonAlert({
  isAttending,
  onAttend,
  onCancel,
  eventId,
}: AttendanceButtonAlertProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAttendClick = async () => {
    try {
      setIsProcessing(true);
      const userId = await getCurrentUserID();
      console.log("Current user ID:", userId);

      if (!userId) {
        alert("Du må være logget inn for å melde deg på");
        return;
      }

      console.log(`Attempting to register user ${userId} for event ${eventId}`);
      await registerEventParticipant(userId, eventId);
      onAttend();
    } catch (error) {
      console.error("Error registering for event:", error);
      // Show more specific error message
      if (error instanceof Error) {
        alert(`Feil ved påmelding: ${error.message}`);
      } else {
        alert("Det oppstod en feil. Prøv igjen senere.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmCancel = async () => {
    try {
      setIsProcessing(true);
      const userId = await getCurrentUserID();
      if (userId) {
        await removeEventParticipant(userId, eventId);
      }
      onCancel();
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Error cancelling registration:", error);
      if (error instanceof Error) {
        alert(`Feil ved avmelding: ${error.message}`);
      } else {
        alert("Det oppstod en feil ved avmelding.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {!isAttending ? (
        <Button
          onClick={handleAttendClick}
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? "Behandler..." : "Meld deg på"}
        </Button>
      ) : (
        <Button
          onClick={handleCancelClick}
          variant="destructive"
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? "Behandler..." : "Meld deg av"}
        </Button>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på at du vil melde deg av dette arrangementet?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground"
            >
              Meld deg av
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
