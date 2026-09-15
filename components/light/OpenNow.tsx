"use client";

import { formatClock } from "@/lib/daylight";
import { useLight } from "./LightProvider";

/** Open now by the house's own clock in Chandkheda (Asia/Kolkata), whatever the visitor's time zone. */
export function OpenNow({ open, close }: { open: string; close: string }) {
  const { houseOpen } = useLight();
  const text = houseOpen === null ? `Open ${formatClock(open)} to ${formatClock(close)}` : houseOpen ? `Open now, until ${formatClock(close)}` : `Closed now, opens at ${formatClock(open)}`;
  return (
    <span className="open-now" data-open={houseOpen === null ? undefined : houseOpen ? "1" : "0"} suppressHydrationWarning>
      {text}
    </span>
  );
}
