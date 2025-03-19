"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Trash2, Eye, ExternalLink } from "lucide-react";
import {
  getReportedEventDetails,
  updateReportStatus,
  removeEvent,
} from "@/lib/firebase/DatabaseFunksjoner";
import ConfirmBox from "@/components/superbruker/confirmBox";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Report, Event, User } from "@/types";
import { formatTimestamp } from "@/utils/formatTimestamp";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReportedEvent extends Report {
  eventData?: Event;
  creatorData?: User;
  reporterData?: User;
}

export default function ReportedEventsTable() {
  const [reports, setReports] = useState<ReportedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [reportToAction, setReportToAction] = useState<ReportedEvent | null>(null);
  const [actionType, setActionType] = useState<"delete" | "resolve" | "reject" | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportedEvent | null>(null);
  const [isReportDetailsOpen, setIsReportDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsData = await getReportedEventDetails();
        setReports(reportsData as ReportedEvent[]);
      } catch (error) {
        console.error("Feil ved henting av rapporter:", error);
        toast.error("Kunne ikke hente rapporter. Prøv igjen senere.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDeleteEvent = async () => {
    if (!reportToAction || !reportToAction.eventData) return;

    try {
      // Slett arrangementet
      await removeEvent(reportToAction.eventData.id);
      
      // Merk rapporten som løst
      await updateReportStatus(reportToAction.id, "resolved");
      
      // Oppdater UI
      setReports(
        reports.map((report) =>
          report.id === reportToAction.id
            ? { ...report, status: "resolved" }
            : report
        )
      );
      
      toast.success("Arrangementet er slettet og rapporten er markert som løst.");
    } catch (error) {
      console.error("Feil ved sletting av arrangement:", error);
      toast.error("Kunne ikke slette arrangementet. Prøv igjen senere.");
    } finally {
      closeDialog();
    }
  };

  const handleResolveReport = async () => {
    if (!reportToAction) return;

    try {
      await updateReportStatus(reportToAction.id, "resolved");
      setReports(
        reports.map((report) =>
          report.id === reportToAction.id
            ? { ...report, status: "resolved" }
            : report
        )
      );
      toast.success("Rapporten er markert som løst.");
    } catch (error) {
      console.error("Feil ved løsing av rapport:", error);
      toast.error("Kunne ikke løse rapporten. Prøv igjen senere.");
    } finally {
      closeDialog();
    }
  };

  const handleRejectReport = async () => {
    if (!reportToAction) return;

    try {
      await updateReportStatus(reportToAction.id, "rejected");
      setReports(
        reports.map((report) =>
          report.id === reportToAction.id
            ? { ...report, status: "rejected" }
            : report
        )
      );
      toast.success("Rapporten er avvist.");
    } catch (error) {
      console.error("Feil ved avvisning av rapport:", error);
      toast.error("Kunne ikke avvise rapporten. Prøv igjen senere.");
    } finally {
      closeDialog();
    }
  };

  const openActionDialog = (report: ReportedEvent, action: "delete" | "resolve" | "reject") => {
    setReportToAction(report);
    setActionType(action);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setReportToAction(null);
    setActionType(null);
  };

  const handleConfirmAction = () => {
    if (actionType === "delete") {
      handleDeleteEvent();
    } else if (actionType === "resolve") {
      handleResolveReport();
    } else if (actionType === "reject") {
      handleRejectReport();
    }
  };

  const getDialogContent = () => {
    if (!reportToAction) return { title: "", description: "" };

    if (actionType === "delete") {
      return {
        title: "Slett arrangement",
        description: `Er du sikker på at du vil slette arrangementet "${reportToAction.eventData?.title}"? Denne handlingen kan ikke angres.`,
      };
    } else if (actionType === "resolve") {
      return {
        title: "Marker som løst",
        description: "Er du sikker på at du vil markere denne rapporten som løst?",
      };
    } else if (actionType === "reject") {
      return {
        title: "Avvis rapport",
        description: "Er du sikker på at du vil avvise denne rapporten?",
      };
    }

    return { title: "", description: "" };
  };

  const filteredReports = reports.filter((report) => {
    const eventTitle = report.eventData?.title || "";
    const reason = report.reason || "";
    const creatorName = report.creatorData?.firstName || report.creatorData?.userName || "";
    
    return (
      eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creatorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const showReportDetails = (report: ReportedEvent) => {
    setSelectedReport(report);
    setIsReportDetailsOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Henter rapporter...</div>;
  }

  const getStatusBadge = (status: "pending" | "resolved" | "rejected") => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-100">Ventende</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-100">Løst</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100">Avvist</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Rapporterte arrangementer</h2>
        <Input
          placeholder="Søk i rapporter..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {reports.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          Ingen rapporterte arrangementer funnet.
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          Ingen rapporter matcher søket ditt.
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Arrangement</TableHead>
                <TableHead>Opprettet av</TableHead>
                <TableHead>Grunn for rapportering</TableHead>
                <TableHead>Rapportert av</TableHead>
                <TableHead>Dato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id} className={
                  report.status === "resolved" 
                    ? "bg-green-50" 
                    : report.status === "rejected" 
                    ? "bg-red-50" 
                    : ""
                }>
                  <TableCell className="font-medium">
                    {report.eventData ? (
                      report.eventData.title
                    ) : (
                      <span className="text-muted-foreground italic">Arrangement ikke funnet</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {report.creatorData ? (
                      `${report.creatorData.firstName || report.creatorData.userName || report.creatorData.email}`
                    ) : (
                      <span className="text-muted-foreground italic">Ukjent bruker</span>
                    )}
                  </TableCell>
                  <TableCell 
                    className="max-w-xs truncate cursor-pointer hover:text-blue-600"
                    onClick={() => showReportDetails(report)}
                    title="Klikk for å se hele rapporten"
                  >
                    {report.reason}
                  </TableCell>
                  <TableCell>
                    {report.reporterData ? (
                      `${
                        report.reporterData.firstName || 
                        report.reporterData.userName || 
                        report.reporterData.email
                      }`
                    ) : (
                      report.reportedBy
                    )}
                  </TableCell>
                  <TableCell>{formatTimestamp(report.timestamp)}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {report.status === "pending" && (
                        <>
                          {report.eventData && (
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => openActionDialog(report, "delete")}
                              title="Slett arrangement"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-green-100"
                            onClick={() => openActionDialog(report, "resolve")}
                            title="Marker som løst"
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-red-100"
                            onClick={() => openActionDialog(report, "reject")}
                            title="Avvis rapport"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                      {report.eventData?.id && (
                        <Link href={`/event_page?id=${report.eventData.id}`} passHref>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Gå til arrangement"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmBox
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onConfirm={handleConfirmAction}
        title={getDialogContent().title}
        description={getDialogContent().description}
      />

      <Dialog open={isReportDetailsOpen} onOpenChange={setIsReportDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Rapportdetaljer</DialogTitle>
            <DialogDescription>
              {selectedReport?.eventData ? (
                <span>Rapport om arrangementet: <strong>{selectedReport.eventData.title}</strong></span>
              ) : (
                <span>Rapporterte arrangement er ikke lenger tilgjengelig</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Grunnlag for rapportering:</h3>
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
              {selectedReport?.reason || "Ingen begrunnelse oppgitt"}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Rapportert av:</h3>
              <div>
                {selectedReport?.reporterData ? (
                  `${
                    selectedReport.reporterData.firstName || 
                    selectedReport.reporterData.userName || 
                    selectedReport.reporterData.email
                  }`
                ) : (
                  selectedReport?.reportedBy || "Ukjent"
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Rapportert:</h3>
              <div>{selectedReport ? formatTimestamp(selectedReport.timestamp) : ""}</div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsReportDetailsOpen(false)}>
              Lukk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 