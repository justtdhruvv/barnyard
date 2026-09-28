"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { houseNowHour, isOpenAt, nowHour, parseAt, stateFor, type LightState, type Regime } from "@/lib/daylight";
import { effectiveDaylight } from "@/lib/sky";

interface LightValue { hour: number | null; state: LightState | null; houseOpen: boolean | null; pinned: boolean; toggleRegime: () => void }
const Ctx = createContext<LightValue | null>(null);

export function LightProvider({ children }: { children: ReactNode }) {
  const [clock, setClock] = useState<number | null>(null);
  const [house, setHouse] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  // the header switch: held in memory only, so a reload returns to the house's own clock
  const [override, setOverride] = useState<Regime | null>(null);
  const flipTimer = useRef(0);
  const lastRegime = useRef<Regime | null>(null);
  useEffect(() => {
    const tick = () => { setClock(nowHour()); setHouse(houseNowHour()); };
    tick();
    setPinned(parseAt(location.search));
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  const hour = pinned ?? clock;
  const state = useMemo(() => {
    if (hour === null) return null;
    const s = stateFor(hour);
    // the switch makes deep night or full day of the hour: the ground flips and the arch's sun becomes the moon
    return override ? { ...s, regime: override, daylight: effectiveDaylight(s.daylight, override) } : s;
  }, [hour, override]);
  useEffect(() => {
    if (!state) return;
    const e = document.documentElement;
    // whether the clock crossed dusk or the switch was pressed, the house flips with its lamps coming on one after another
    if (lastRegime.current && lastRegime.current !== state.regime) {
      e.classList.add("regime-flip");
      window.clearTimeout(flipTimer.current);
      flipTimer.current = window.setTimeout(() => e.classList.remove("regime-flip"), 1400);
    }
    lastRegime.current = state.regime;
    e.setAttribute("data-regime", state.regime);
    e.style.setProperty("--clock-t", state.clockT.toFixed(4));
    e.style.setProperty("--daylight", state.daylight.toFixed(3));
  }, [state]);
  const toggleRegime = useCallback(() => {
    setOverride((current) => {
      const now = current ?? (hour === null ? "day" : stateFor(hour).regime);
      return now === "day" ? "night" : "day";
    });
  }, [hour]);
  const value = useMemo(() => ({ hour, state, houseOpen: house === null ? null : isOpenAt(house), pinned: pinned !== null, toggleRegime }), [hour, state, house, pinned, toggleRegime]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLight(): LightValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLight must be used inside <LightProvider>");
  return v;
}
