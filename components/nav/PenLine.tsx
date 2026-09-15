"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** A single pen line draws across the top of the page each time the route changes. */
export function PenLine() {
  const pathname = usePathname();
  const first = useRef(true);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setRun((n) => n + 1);
  }, [pathname]);
  if (!run) return null;
  return <span key={run} className="pen-line" aria-hidden="true" />;
}
