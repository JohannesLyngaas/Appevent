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

interface AttendanceButtonAlertProps {
  isAttending: boolean;
  onAttend: () => void;
  onCancel: () => void;
}

export function AttendanceButtonAlert({
  isAttending,
  onAttend,
  onCancel,
}: AttendanceButtonAlertProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleCancelClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmCancel = () => {
    onCancel();
    setShowConfirmDialog(false);
  };

  return (
    <>
      {!isAttending ? (
        <Button 
          onClick={onAttend} 
          className="w-full"
        >
          Meld deg på
        </Button>
      ) : (
        <Button 
          onClick={handleCancelClick} 
          variant="destructive" 
          className="w-full"
        >
          Meld deg av
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
            <AlertDialogCancel>
              Avbryt
            </AlertDialogCancel>
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
