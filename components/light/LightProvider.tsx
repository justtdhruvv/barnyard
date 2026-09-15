"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { houseNowHour, isOpenAt, nowHour, parseAt, stateFor, type LightState } from "@/lib/daylight";

interface LightValue { hour: number | null; state: LightState | null; houseOpen: boolean | null; pinned: boolean }
const Ctx = createContext<LightValue | null>(null);

export function LightProvider({ children }: { children: ReactNode }) {
  const [clock, setClock] = useState<number | null>(null);
  const [house, setHouse] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => { setClock(nowHour()); setHouse(houseNowHour()); };
    tick();
    setPinned(parseAt(location.search));
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  const hour = pinned ?? clock;
  const state = useMemo(() => (hour === null ? null : stateFor(hour)), [hour]);
  useEffect(() => {
    if (!state) return;
    const e = document.documentElement;
    e.setAttribute("data-regime", state.regime);
    e.style.setProperty("--clock-t", state.clockT.toFixed(4));
  }, [state]);
  const value = useMemo(() => ({ hour, state, houseOpen: house === null ? null : isOpenAt(house), pinned: pinned !== null }), [hour, state, house, pinned]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLight(): LightValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLight must be used inside <LightProvider>");
  return v;
}
