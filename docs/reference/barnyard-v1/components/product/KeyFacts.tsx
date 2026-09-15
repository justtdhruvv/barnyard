import type { ReactNode } from "react";

export interface KeyFact {
  label: string;
  value?: ReactNode | null | false;
}

/** The numbers a buyer looks for first, before any prose. Items without a value do not exist. */
export function KeyFacts({ items }: { items: KeyFact[] }) {
  const live = items.filter((i) => i.value !== undefined && i.value !== null && i.value !== false && i.value !== "");
  if (!live.length) return null;
  return (
    <dl className="keyfacts">
      {live.map((i) => (
        <div key={i.label}>
          <dt className="t-meta">{i.label}</dt>
          <dd className="t-title num">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
