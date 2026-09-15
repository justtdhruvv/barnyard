import { FactFile, type FactRow } from "@/components/ui";

export interface SpecGroup {
  title: string;
  rows: FactRow[];
}

/** A location sheet: Measurements, Light, Access, Facilities. Groups with nothing known do not render. */
export function SpecBlock({ groups }: { groups: SpecGroup[] }) {
  const live = groups.filter((g) => g.rows.some((r) => r.value !== undefined && r.value !== null && r.value !== false && r.value !== ""));
  if (!live.length) return null;
  return (
    <div className="specblock">
      {live.map((g) => (
        <section key={g.title} aria-label={g.title}>
          <h3 className="t-meta">{g.title}</h3>
          <FactFile rows={g.rows} />
        </section>
      ))}
    </div>
  );
}
