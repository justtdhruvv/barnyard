import { ImageResponse } from "next/og";
import { ARCH_PATH, DIVIDER_PATHS, MARK_VIEWBOX, SUN_CENTER, SUN_RADIUS } from "@/lib/mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * At 32 px the full mark is noise, so the favicon keeps the arch, the two
 * dividers and the sun, with the stroke thickened so the line survives.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent" }}>
        <svg viewBox={MARK_VIEWBOX} width={32} height={32} fill="none" stroke="#25211e" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round">
          <path d={ARCH_PATH} />
          <path d={DIVIDER_PATHS[0]} />
          <path d={DIVIDER_PATHS[1]} />
          <circle cx={SUN_CENTER.x} cy={SUN_CENTER.y} r={SUN_RADIUS + 2} />
        </svg>
      </div>
    ),
    size,
  );
}
