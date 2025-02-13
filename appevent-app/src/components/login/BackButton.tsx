import Link from "next/link";
import { MoveLeftIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";


function BackButton() {
  {/* Under er en enkel tilbake-knapp. Den er hentet fra https://lucide.dev/icons/move-left.
  // Tooltip er tekst som dukker opp når man har musen over for eks knapp. Denne er hentet fra https://ui.shadcn.com/docs/components/tooltip
  // Disse sidene tilbyr eksempel kode og andre komponenter, og forklarer hvordan man henter komponentene
  // Komponenter brukt her fra shadcn er lagt til i UI mappen, disse trengs ikke å hentes på nytt. */}
  return (
    <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Link href={ {
          pathname: "/home/",
        } }>
          <MoveLeftIcon />
        </Link>
        <TooltipContent className=" border-1 border-gray-200 p-1 text-sm rounded-md text-white bg-black bg-opacity-40">
          Tilbake til home
        </TooltipContent>
      </TooltipTrigger>
    </Tooltip>
  </TooltipProvider>
  );
}

export { BackButton }