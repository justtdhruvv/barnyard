"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { houseNowHour, isOpenAt, nowHour, parseAt, stateFor, type LightState } from "@/lib/daylight";

/** The hour an always-night band holds the page at: 1 AM, as a house hour. */
const NIGHT_HOUR = 25;

interface LightContextValue {
  /**
   * The hour the page is showing. In order: the sun the visitor dragged, a
   * night band's 1 AM, an hour pinned with ?at=, the visitor's clock.
   */
  hour: number | null;
  state: LightState | null;
  /** the house without any night band: a drag, a pinned hour or the clock */
  baseState: LightState | null;
  /** whether the house in Chandkheda is open right now (its own clock); null before mount */
  houseOpen: boolean | null;
  /** true when the hour is not the visitor's clock: pinned with ?at= or dragged on the arch */
  overridden: boolean;
  /** true once the visitor has dragged the sun; a drag beats a night band */
  scrubbed: boolean;
  /** true while a night band holds the page at 1 AM */
  pushed: boolean;
  /** the arch: a dragged hour, or null to let go */
  setOverride: (hour: number | null) => void;
  /** push the whole page to night while an always-night band is in view */
  pushNight: (on: boolean) => void;
}

const LightContext = createContext<LightContextValue | null>(null);

let lastRegime: string | null = null;

/**
 * Writes the state to <html>. A change of regime crossfades on the compositor
 * via a view transition where the browser has one; every other change (the
 * minute drift, a drag within the same regime) is a plain write.
 */
function apply(state: LightState) {
  const e = document.documentElement;
  const write = () => {
    e.style.setProperty("--daylight", state.daylight.toFixed(3));
    e.style.setProperty("--clock-t", state.clockT.toFixed(4));
    e.setAttribute("data-regime", state.regime);
    e.setAttribute("data-open", state.open ? "1" : "0");
  };
  const flip = lastRegime !== null && state.regime !== lastRegime;
  lastRegime = state.regime;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
  if (flip && doc.startViewTransition && !e.hasAttribute("data-vt") && !e.hasAttribute("data-arrival")) {
    e.setAttribute("data-vt", "light");
    const vt = doc.startViewTransition(write);
    vt.finished.finally(() => e.removeAttribute("data-vt"));
  } else {
    write();
  }
}

export function LightProvider({ children }: { children: ReactNode }) {
  const [clock, setClock] = useState<number | null>(null);
  const [houseClock, setHouseClock] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [scrub, setScrub] = useState<number | null>(null);
  const nightPushes = useRef(0);
  const [nightPushed, setNightPushed] = useState(false);

  // Clocks: read after mount (never during render) and drift once a minute.
  useEffect(() => {
    const tick = () => {
      setClock(nowHour());
      setHouseClock(houseNowHour());
    };
    tick();
    const at = parseAt(window.location.search);
    if (at !== null) setPinned(at);
    const id = window.setInterval(tick, 60_000);
    // The arrival takes its time; every light change after it is quick.
    const fast = window.setTimeout(() => document.documentElement.setAttribute("data-light-fast", ""), 2200);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(fast);
    };
  }, []);

  const baseHour = scrub ?? pinned ?? clock;
  const pushed = nightPushed && scrub === null && clock !== null;
  const hour = scrub ?? (pushed ? NIGHT_HOUR : baseHour);
  const state = useMemo(() => (hour === null ? null : stateFor(hour)), [hour]);
  const baseState = useMemo(() => (baseHour === null ? null : stateFor(baseHour)), [baseHour]);
  const houseOpen = houseClock === null ? null : isOpenAt(houseClock);

  useEffect(() => {
    if (state) apply(state);
  }, [state]);

  const setOverride = useCallback((h: number | null) => setScrub(h), []);
  const pushNight = useCallback((on: boolean) => {
    nightPushes.current = Math.max(0, nightPushes.current + (on ? 1 : -1));
    setNightPushed(nightPushes.current > 0);
  }, []);

  const value = useMemo<LightContextValue>(
    () => ({
      hour,
      state,
      baseState,
      houseOpen,
      overridden: scrub !== null || pinned !== null,
      scrubbed: scrub !== null,
      pushed,
      setOverride,
      pushNight,
    }),
    [hour, state, baseState, houseOpen, scrub, pinned, pushed, setOverride, pushNight],
  );

  return <LightContext.Provider value={value}>{children}</LightContext.Provider>;
}

export function useLight(): LightContextValue {
  const ctx = useContext(LightContext);
  if (!ctx) throw new Error("useLight must be used inside <LightProvider>");
  return ctx;
}
