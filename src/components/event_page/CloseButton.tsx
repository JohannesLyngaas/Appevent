"use client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";

export function CloseButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromCreate = searchParams.get("fromCreate") === "true";

  const handleClose = () => {
    if (fromCreate) {
      // If coming from create_event, go to home
      router.push("/home");
    } else {
      // Otherwise go back to previous page
      router.back();
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <Button
        variant="outline"
        size="icon"
        onClick={handleClose}
        aria-label="Lukk"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
