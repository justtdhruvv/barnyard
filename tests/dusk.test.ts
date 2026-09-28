import { describe, expect, it } from "vitest";
import { daylightFor, stateFor } from "@/lib/daylight";
import { skyFor } from "@/lib/sky";
import { script } from "@/components/light/LightScript";

/** Runs the inline pre-paint script at ?at=HH:MM against a stand-in <html> and returns what it set. */
function prePaint(at: string) {
  const props: Record<string, string> = {};
  const attrs: Record<string, string> = {};
  const documentElement = { style: { setProperty: (k: string, v: string) => { props[k] = v; } }, setAttribute: (k: string, v: string) => { attrs[k] = v; } };
  new Function("document", "location", "matchMedia", script)({ documentElement }, { search: `?at=${at}` }, () => ({ matches: false }));
  return { daylight: Number(props["--daylight"]), regime: attrs["data-regime"] };
}

const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

describe("dusk: the house goes dark at 7 PM", () => {
  it("is day at 6:59 PM and night from 7 PM on", () => {
    expect(stateFor(18 + 59 / 60).regime).toBe("day");
    expect(stateFor(19).regime).toBe("night");
    expect(stateFor(19 + 1 / 60).regime).toBe("night");
  });

  it("has the sun's rays gone at 7 PM and the moon whole by 7:15 PM", () => {
    expect(skyFor(daylightFor(19)).rays).toBe(0);
    expect(skyFor(daylightFor(19.25)).moon).toBe(1);
  });

  it("the pre-paint script agrees with lib/daylight.ts at every minute of the day", () => {
    for (let m = 0; m < 24 * 60; m++) {
      const at = hhmm(m);
      const s = stateFor(m / 60);
      const p = prePaint(at);
      expect(p.regime, at).toBe(s.regime);
      expect(p.daylight, at).toBeCloseTo(s.daylight, 2);
    }
  });
});
