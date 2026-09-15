import { notFound } from "next/navigation";
import { Drawing, type DrawMode } from "@/components/draw/Drawing";
import { DRAWINGS, drawingFor } from "@/drawings";

export default async function Lab({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ mode?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { id } = await params;
  const { mode } = await searchParams;
  if (!DRAWINGS[id]) notFound();
  const m: DrawMode = mode === "draw" || mode === "scrub" ? mode : "static";
  return (
    <div className="wrap" style={{ paddingBlock: mode === "scrub" ? "90svh" : "8svh", maxWidth: 720 }}>
      <Drawing drawing={drawingFor(id)} mode={m} />
    </div>
  );
}
