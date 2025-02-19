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

interface AttendanceButtonAlertProps {
  isAttending: boolean;
  onAttend: () => void;
  onCancel: () => void;
}

export function AttendanceButtonAlert({ isAttending, onAttend, onCancel }: AttendanceButtonAlertProps) {
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
        <button
          onClick={onAttend}
          className="p-3 rounded-lg bg-[#959D5A] text-white"
        >
          Delta på arrangement
        </button>
      ) : (
        <button
          onClick={handleCancelClick}
          className="p-3 rounded-lg bg-[#E34E4E] text-white border-[#c03737] border-2"
        >
          Meld deg av
        </button>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-[#FEFFF4] border-2 border-[#96A074]">
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på at du vil melde deg av dette arrangementet?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#FEFFF4] border-2 border-[#96A074] text-[#96A074]">
              Avbryt
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-[#E34E4E] text-white border-[#c03737] border-2"
            >
              Meld deg av
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 