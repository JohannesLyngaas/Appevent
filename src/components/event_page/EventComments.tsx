"use client";

import { useState, useEffect } from "react";
import { useUserSession } from "@/hooks/useUserSession";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatTimestamp } from "@/utils/formatTimestamp";
import type { Comment, User } from "@/types";
import { addComment, deleteComment, getEventComments, getUserById, reportComment } from "@/lib/firebase/DatabaseFunksjoner";
import { Trash2, Flag } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventCommentsProps {
  eventId: string;
  eventOwnerId: string;
}

export function EventComments({ eventId, eventOwnerId }: EventCommentsProps) {
  const userSession = useUserSession(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentUsers, setCommentUsers] = useState<Record<string, User>>({});
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [commentToReport, setCommentToReport] = useState<Comment | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [visibleComments, setVisibleComments] = useState<Comment[]>([]);
  const [displayCount, setDisplayCount] = useState(4);
  
  // Sjekk om innlogget bruker er eier av arrangementet eller admin
  const isEventOwner = userSession?.id === eventOwnerId;
  const isAdmin = userSession?.role === "admin";

  // Beregn antall ord i kommentaren
  const wordCount = newComment.trim() ? newComment.trim().split(/\s+/).length : 0;
  const isWordLimitExceeded = wordCount > 100;

  // For rapporttelling (endre navn på denne)
  const reportWordCount = reportReason.trim() ? reportReason.trim().split(/\s+/).length : 0;
  const isReportWordLimitExceeded = reportWordCount > 100;

  // Hent kommentarer
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const commentsData = await getEventComments(eventId);
        setComments(commentsData);

        // Hent brukerinformasjon for alle kommentarer
        const userIds = [...new Set(commentsData.map(comment => comment.userId))];
        const userMap: Record<string, User> = {};
        
        await Promise.all(
          userIds.map(async (userId) => {
            try {
              const userData = await getUserById(userId);
              if (userData) {
                userMap[userId] = userData;
              }
            } catch (error) {
              console.error(`Error fetching user ${userId}:`, error);
            }
          })
        );
        
        setCommentUsers(userMap);
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error("Kunne ikke hente kommentarer");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchComments();
    }
  }, [eventId]);

  useEffect(() => {
    // Sorter kommentarer etter dato (nyeste først)
    const sortedComments = [...comments].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Begrens til displayCount
    setVisibleComments(sortedComments.slice(0, displayCount));
  }, [comments, displayCount]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || isWordLimitExceeded) return;
    if (!userSession) {
      toast.error("Du må være logget inn for å kommentere");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const commentId = await addComment(eventId, userSession.id, newComment.trim());
      
      const newCommentWithId: Comment = {
        id: commentId,
        eventId,
        userId: userSession.id,
        text: newComment.trim(),
        createdAt: new Date().toISOString(),
      };
      
      setComments([...comments, newCommentWithId]);
      
      if (!commentUsers[userSession.id]) {
        commentUsers[userSession.id] = userSession;
        setCommentUsers({ ...commentUsers });
      }
      
      setNewComment("");
      toast.success("Kommentar lagt til");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Kunne ikke legge til kommentar. Prøv igjen senere.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (comment: Comment) => {
    setCommentToDelete(comment);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    
    try {
      await deleteComment(commentToDelete.id);
      setComments(comments.filter(c => c.id !== commentToDelete.id));
      toast.success("Kommentar slettet");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Kunne ikke slette kommentar");
    } finally {
      setCommentToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleReportComment = (comment: Comment) => {
    setCommentToReport(comment);
    setReportReason("");
    setIsReportDialogOpen(true);
  };

  // Oppdater submitReport for å sjekke ordbegrensning
  const submitReport = async () => {
    if (!userSession || !commentToReport || !reportReason.trim() || isReportWordLimitExceeded) return;
    
    setIsReporting(true);
    try {
      await reportComment(userSession.id, commentToReport.id, reportReason.trim());
      toast.success("Kommentar rapportert. Takk for din tilbakemelding!");
      setIsReportDialogOpen(false);
    } catch (error) {
      console.error("Error reporting comment:", error);
      toast.error("Kunne ikke rapportere kommentaren. Prøv igjen senere.");
    } finally {
      setIsReporting(false);
      setCommentToReport(null);
      setReportReason("");
    }
  };

  // Hjelpefunksjon for å hente initialer fra et brukernavn
  const getUserInitials = (userId: string) => {
    const user = commentUsers[userId];
    if (!user) return "??";
    
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user.firstName) {
      return user.firstName.substring(0, 2).toUpperCase();
    } else if (user.userName) {
      return user.userName.substring(0, 2).toUpperCase();
    }
    
    return user.email.substring(0, 2).toUpperCase();
  };

  // Hjelpefunksjon for å avgjøre om brukeren kan slette en spesifikk kommentar
  const canUserDeleteComment = (comment: Comment) => {
    if (!userSession) return false;
    
    // Admin kan slette alle kommentarer
    if (isAdmin) return true;
    
    // Arrangementeier kan slette alle kommentarer
    if (isEventOwner) return true;
    
    // Brukere kan slette sine egne kommentarer
    return comment.userId === userSession.id;
  };

  // Hjelpefunksjon for å få korrekt tittel/tooltip på sletteknappen
  const getDeleteButtonTitle = (comment: Comment) => {
    if (isAdmin) return "Slett som administrator";
    if (isEventOwner) return "Slett som arrangementeier";
    return "Slett din kommentar";
  };

  const handleLoadMoreComments = () => {
    setDisplayCount(prevCount => prevCount + 4);
  };

  // Legg til en funksjon for å skjule kommentarer (tilbakestille til 4)
  const handleCollapseComments = () => {
    setDisplayCount(4);
  };

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold">Kommentarer</h2>
      
      {/* Kommentarinnlegg */}
      {userSession && (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <Textarea
            placeholder="Skriv en kommentar..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={`min-h-24 ${isWordLimitExceeded ? 'border-red-500' : ''}`}
          />
          <div className="flex justify-between items-center">
            <span className={isWordLimitExceeded ? "text-red-500 font-medium" : "text-muted-foreground text-sm"}>
              {wordCount} / 100 ord
            </span>
            {isWordLimitExceeded && (
              <span className="text-red-500 text-sm">Ordbegrensning overskredet!</span>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting || !newComment.trim() || isWordLimitExceeded}
            >
              {isSubmitting ? "Sender..." : "Send"}
            </Button>
          </div>
        </form>
      )}
      
      {/* Kommentarliste */}
      <div className="space-y-4">
        {isLoading ? (
          <p>Laster kommentarer...</p>
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground">Ingen kommentarer ennå. Bli den første som kommenterer!</p>
        ) : (
          <>
            {visibleComments.map((comment) => (
              <div key={comment.id} className="flex gap-4 p-4 border rounded-lg">
                <Avatar>
                  <AvatarImage
                    src={commentUsers[comment.userId]?.imageUrl}
                    alt={commentUsers[comment.userId]?.userName || "Bruker"}
                  />
                  <AvatarFallback>{getUserInitials(comment.userId)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">
                      {commentUsers[comment.userId]?.firstName || "Anonym bruker"}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(comment.createdAt)}
                      </span>
                      {/* Rapporteringsknapp */}
                      {userSession && userSession.id !== comment.userId && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          onClick={() => handleReportComment(comment)}
                          title="Rapporter kommentar"
                        >
                          <Flag className="h-4 w-4 text-amber-500" />
                        </Button>
                      )}
                      {/* Sletteknapp */}
                      {canUserDeleteComment(comment) && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          onClick={() => handleDeleteComment(comment)}
                          title={getDeleteButtonTitle(comment)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="mt-1">{comment.text}</p>
                </div>
              </div>
            ))}
            
            {/* "Se flere kommentarer"-knapp eller "Skjul kommentarer"-knapp */}
            {comments.length > 4 && (
              <div className="text-center mt-4">
                {/* Vis "Skjul kommentarer" når displayCount > 4 (altså når vi viser flere enn standard) */}
                {displayCount > 4 ? (
                  <Button 
                    variant="outline" 
                    onClick={handleCollapseComments}
                    className="w-full"
                  >
                    Skjul kommentarer
                  </Button>
                ) : (
                  /* Vis "Se flere" når vi ikke viser alle kommentarer */
                  <Button 
                    variant="outline" 
                    onClick={handleLoadMoreComments}
                    className="w-full"
                  >
                    Se flere kommentarer ({comments.length - visibleComments.length} gjenstår)
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bekreftelsesdialog for sletting */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              Denne handlingen kan ikke angres. Kommentaren vil bli permanent slettet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteComment}
              className="bg-red-500 hover:bg-red-600"
            >
              Slett
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rapporteringsdialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rapporter kommentar</DialogTitle>
            <DialogDescription>
              Fortell oss hvorfor du mener denne kommentaren bryter retningslinjene.
              Maksimalt 100 ord.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Skriv grunn for rapportering..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className={`min-h-32 ${isReportWordLimitExceeded ? 'border-red-500' : ''}`}
            />
            <div className="flex justify-between mt-2 text-sm">
              <span className={isReportWordLimitExceeded ? "text-red-500 font-medium" : "text-muted-foreground"}>
                {reportWordCount} / 100 ord
              </span>
              {isReportWordLimitExceeded && (
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
              disabled={isReporting || !reportReason.trim() || isReportWordLimitExceeded}
            >
              {isReporting ? "Sender..." : "Send rapport"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 