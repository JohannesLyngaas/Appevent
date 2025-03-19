import { Timestamp } from "firebase/firestore";

/**
 * Når man henter inn tid variabler fra firebase databsen vil se være på en viss format
 * og se ganske wack ut, en du kan bruke funksjonen under for å bestemme formattet på variabelen
 * som du ønsker å presentere på siden din. For eks hvis du ønsker å bare hvis tiden og ikke
 * måned, år osv.
 * kan du hente funksjonen til din side og skrive for eks: "formatTimestamp(event.startTime, "time")
 * da vises bare tiden og ikke datoen. 
 */
type FormatOption = "time" | "fullDate" | "day" | "month" | "year" | "dayMonth" | "monthYear";

export function formatTimestamp(
  timestamp: Timestamp | string | Date,
  format?: FormatOption
): string {
  if (!timestamp) return "N/A";

  const date = timestamp instanceof Timestamp
    ? timestamp.toDate()
    : timestamp instanceof Date
      ? timestamp
      : new Date(timestamp);

  if (isNaN(date.getTime())) return "Invalid Date";

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Oslo",
  };

  switch (format) {
    case "time":
      options.hour = "2-digit";
      options.minute = "2-digit";
      break;
    case "fullDate":
      options.day = "numeric";
      options.month = "long";
      options.year = "numeric";
      break;
    case "day":
      options.day = "numeric";
      break;
    case "month":
      options.month = "long";
      break;
    case "year":
      options.year = "numeric";
      break;
    case "dayMonth":
      options.day = "numeric";
      options.month = "long";
      break;
    case "monthYear":
      options.month = "long";
      options.year = "numeric";
      break;
    default:
      options.day = "numeric";
      options.month = "long";
      options.year = "numeric";
      options.hour = "2-digit";
      options.minute = "2-digit";
      options.hour12 = false;
  }

  let formatted = date.toLocaleString("no-NO", options);

  return formatted;
}
