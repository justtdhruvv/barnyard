import { ImageResponse } from "next/og";
import { ALL_PATHS, DROPS, MARK_VIEWBOX, SUN_CENTER, SUN_RADIUS } from "@/lib/mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** The mark on black steel, given room. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#25211e" }}>
        <svg viewBox={MARK_VIEWBOX} width={132} height={132} fill="none" stroke="#dcd8d1" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
          {ALL_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
          <circle cx={SUN_CENTER.x} cy={SUN_CENTER.y} r={SUN_RADIUS} />
          {DROPS.map((d) => (
            <circle key={d.x} cx={d.x} cy={d.y} r={5} fill="#dcd8d1" stroke="none" />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
