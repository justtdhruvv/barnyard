import data from "@/content/cafe.json";

export const cafe = data;
export type Cafe = typeof data;

/**
 * A field is only a fact if it is not flagged. Anything marked UNKNOWN or
 * CONFIRM in cafe.json returns undefined so components skip it entirely.
 */
export function fact<T>(value: T): T | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string") {
    const v = value.trim();
    if (v === "" || v.startsWith("UNKNOWN") || v.startsWith("CONFIRM")) return undefined;
  }
  return value;
}

/** "Rohan Bhargade": the honorific belongs in fact files, not running prose. */
export const architectName = cafe.design.architect.replace(/^Ar\.\s*/, "");

export const phoneHref = `tel:${cafe.meta.phone}`;
export const whatsappHref = `https://wa.me/${cafe.meta.phone.replace(/\D/g, "")}`;

export function whatsappWith(text: string) {
  return `${whatsappHref}?text=${encodeURIComponent(text)}`;
}

export const addressLines = [
  cafe.meta.address.line1,
  cafe.meta.address.line2,
  cafe.meta.address.landmark,
  `${cafe.meta.address.area}, ${cafe.meta.city} ${cafe.meta.address.postalCode}`,
];

export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${cafe.meta.name}, ${cafe.meta.address.line2}, ${cafe.meta.address.landmark}, ${cafe.meta.address.area}, ${cafe.meta.city} ${cafe.meta.address.postalCode}`,
)}`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "12 Sep 2024": one three-letter month style everywhere, whatever the runtime's locale data says. */
export function pressDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function eventDate(value: string): string {
  // "2025-09-06" | "2025-04 to 2025-05"
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return pressDate(value);
  const month = (ym: string) => {
    const [y, m] = ym.split("-").map(Number);
    return `${MONTHS[m - 1]} ${y}`;
  };
  const m = value.match(/^(\d{4}-\d{2}) to (\d{4}-\d{2})$/);
  if (m) return `${month(m[1])} to ${month(m[2])}`;
  if (/^\d{4}-\d{2}$/.test(value)) return month(value);
  return value;
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const enquiryEmail = process.env.NEXT_PUBLIC_ENQUIRY_EMAIL;

/** The rooms of the house: every space except the facade, which is the way in rather than a room. */
export const rooms = cafe.spaces.filter((s) => s.slug !== "facade");

const NUMBER_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/** "six", counted once from the rooms above so every page describes the same house. */
export const roomWord = NUMBER_WORDS[rooms.length] ?? String(rooms.length);

export function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
