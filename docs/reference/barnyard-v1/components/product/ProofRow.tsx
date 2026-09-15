import { Figure } from "@/components/Figure";

interface ProofRowProps {
  name: string;
  date?: string;
  line: string;
  /** who it was with, from cafe.json */
  partners?: string[];
  slot?: string;
  caption?: string;
}

/** One thing that has actually happened here: the name, the date, one line, and the frame if there is one. */
export function ProofRow({ name, date, line, partners, slot, caption }: ProofRowProps) {
  return (
    <li className="proof">
      <div className="proof-copy stack" style={{ "--stack": "0.5rem" } as React.CSSProperties}>
        <h3 className="t-title">{name}</h3>
        {date ? <p className="t-meta">{date}</p> : null}
        <p className="t-body">{line}</p>
        {partners?.length ? <p className="t-caption">With {partners.join(", ")}.</p> : null}
      </div>
      {slot ? <Figure id={slot} caption={caption} bare sizes="(min-width: 64rem) 34vw, 100vw" /> : null}
    </li>
  );
}
