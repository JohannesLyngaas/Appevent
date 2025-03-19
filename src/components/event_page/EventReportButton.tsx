"use client";

import { useState } from "react";
import { useUserSession } from "@/hooks/useUserSession";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Flag } from "lucide-react";
import { reportEvent } from "@/lib/firebase/DatabaseFunksjoner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventReportButtonProps {
  eventId: string;
}

export function EventReportButton({ eventId }: EventReportButtonProps) {
  const userSession = useUserSession(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  const handleReportEvent = () => {
    if (!userSession) {
      toast.error("Du må være logget inn for å rapportere et arrangement");
      return;
    }
    
    setReportReason("");
    setIsReportDialogOpen(true);
  };

  const submitReport = async () => {
    if (!userSession || !reportReason.trim()) return;
    
    setIsReporting(true);
    try {
      await reportEvent(userSession.id, eventId, reportReason.trim());
      toast.success("Arrangement rapportert. Takk for din tilbakemelding!");
      setIsReportDialogOpen(false);
    } catch (error) {
      console.error("Error reporting event:", error);
      toast.error("Kunne ikke rapportere arrangementet. Prøv igjen senere.");
    } finally {
      setIsReporting(false);
      setReportReason("");
    }
  };

  // Beregn antall ord i rapportgrunnen
  const wordCount = reportReason.trim() ? reportReason.trim().split(/\s+/).length : 0;
  const isWordLimitExceeded = wordCount > 100;

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        className="gap-2"
        onClick={handleReportEvent}
      >
        <Flag className="h-4 w-4" /> Rapporter arrangement
      </Button>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rapporter arrangement</DialogTitle>
            <DialogDescription>
              Fortell oss hvorfor du mener dette arrangementet bryter retningslinjene.
              Maksimalt 100 ord.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Skriv grunn for rapportering..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className={`min-h-32 ${isWordLimitExceeded ? 'border-red-500' : ''}`}
            />
            <div className="flex justify-between mt-2 text-sm">
              <span className={isWordLimitExceeded ? "text-red-500 font-medium" : "text-muted-foreground"}>
                {wordCount} / 100 ord
              </span>
              {isWordLimitExceeded && (
                <span className="text-red-500">Ordbegrensning overskredet!</span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReportDialogOpen(false)}
              disabled={isReporting}
            >
              Avbryt
            </Button>
            <Button 
              onClick={submitReport} 
              disabled={isReporting || !reportReason.trim() || isWordLimitExceeded}
            >
              {isReporting ? "Sender..." : "Send rapport"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 