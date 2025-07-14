import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Safely formats the distance between the provided date string and now.
 * This helper avoids runtime crashes caused by invalid date inputs coming
 * from the backend (e.g. `YYYY-MM-DD HH:mm:ss` format or null values).
 *
 * If the date cannot be parsed, an empty string is returned so that the
 * component can decide how to handle the missing value without throwing.
 *
 * @param dateString - the raw date string coming from the API
 * @param addSuffix  - whether to append the `il y a`/`dans` suffix
 */
export function safeFormatDistanceToNow(
    dateString: string | null | undefined,
    addSuffix: boolean = false
): string {
    if (!dateString) {
        return "";
    }

    // Try to parse directly first (works for standard ISO-8601 strings)
    let date = new Date(dateString);

    // Fallback: handle MySQL like `YYYY-MM-DD HH:mm:ss` format which Safari
    // (and therefore WebKit-based browsers) does not parse by default.
    if (isNaN(date.getTime())) {
        const isoLike = dateString.replace(" ", "T") + "Z";
        date = new Date(isoLike);
    }

    if (isNaN(date.getTime())) {
        // Still invalid – return empty string to avoid crashing the UI
        return "";
    }

    return formatDistanceToNow(date, { addSuffix, locale: fr });
} 