import { ALL_PATHS, DROPS, MARK_VIEWBOX, SUN_CENTER, SUN_RADIUS } from "@/lib/mark";

export const OG_SIZE = { width: 1200, height: 630 };

/* Fixed dusk state: lamps just on. */
const GROUND = "#3a2e29";
const INK = "#dcd8d1";
const INK_2 = "#a8a39b";
const LINE = "#dda45e";

interface TemplateProps {
  title: string;
  fact: string;
  route?: string;
}

/**
 * One template, eight routes. Satori: flexbox only, inline SVG allowed.
 * The arch carries the sun at about 6:40 PM.
 */
export function OgTemplate({ title, fact, route }: TemplateProps) {
  // sun position on the arc at t ~ 0.48 (6:40 PM)
  const t = 0.48;
  const cx = 160 - Math.cos(Math.PI * t) * 150;
  const cy = 160 - Math.sin(Math.PI * t) * 150;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px 48px",
        background: `linear-gradient(180deg, #43352f 0%, ${GROUND} 55%, #2c2521 100%)`,
        color: INK,
        fontFamily: "Bricolage Grotesque",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg
            viewBox={MARK_VIEWBOX}
            width={72}
            height={72}
            fill="none"
            stroke={INK}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ALL_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
            <circle cx={SUN_CENTER.x} cy={SUN_CENTER.y} r={SUN_RADIUS} />
            {DROPS.map((d) => (
              <circle key={d.x} cx={d.x} cy={d.y} r={4} fill={INK} stroke="none" />
            ))}
          </svg>
          <div style={{ display: "flex", fontSize: 28, letterSpacing: -0.5 }}>The Barnyard Co.</div>
        </div>
        {route ? <div style={{ display: "flex", fontSize: 22, color: INK_2 }}>{route}</div> : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 900 }}>
        <div style={{ display: "flex", fontSize: 72, lineHeight: 1.0, letterSpacing: -2.4, fontWeight: 300 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 28, lineHeight: 1.35, color: INK_2, fontFamily: "Rasa" }}>{fact}</div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", fontSize: 20, color: INK_2 }}>Chandkheda, North Ahmedabad. Open 11 AM to 3 AM.</div>
        <svg viewBox="0 0 320 178" width={220} height={122} fill="none">
          <line x1="0" y1="160" x2="320" y2="160" stroke={INK_2} strokeWidth={1.5} />
          <path d="M 10 160 A 150 150 0 0 1 310 160" stroke={INK} strokeWidth={1.5} />
          <circle cx={cx} cy={cy} r={22} fill={LINE} opacity={0.22} />
          <circle cx={cx} cy={cy} r={8} fill={LINE} />
        </svg>
      </div>
    </div>
  );
}
