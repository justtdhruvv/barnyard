import { markDrawing } from "@/drawings/mark";

export function Mark({ size = 28, title }: { size?: number; title?: string }) {
  const d = markDrawing();
  return (
    <svg viewBox="0 0 320 320" width={size} height={size} className="drawing mark" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} style={{ width: size }}>
      {title ? <title>{title}</title> : null}
      {d.strokes.map((s, i) => <path key={i} d={s.d} />)}
    </svg>
  );
}
