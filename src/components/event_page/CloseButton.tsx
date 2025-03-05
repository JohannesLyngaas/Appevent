"use client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

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
    <div className="flex justify-end">
      <Button
        variant="destructive"
        className="w-24 mt-5 mr-5"
        onClick={handleClose}
      >
        Lukk
      </Button>
    </div>
  );
}
