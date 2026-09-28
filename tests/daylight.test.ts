import { describe, expect, it } from "vitest";
import { formatClock, isOpenAt, parseAt, stateFor } from "@/lib/daylight";

describe("daylight", () => {
  it("is day at 2 PM and night at 1 AM", () => {
    expect(stateFor(14).regime).toBe("day");
    expect(stateFor(1).regime).toBe("night");
  });
  it("is open from 11 AM to 3 AM", () => {
    expect(isOpenAt(10.99)).toBe(false);
    expect(isOpenAt(2.5)).toBe(true);
    expect(isOpenAt(3)).toBe(false);
  });
  it("reads ?at= and formats hours", () => {
    expect(parseAt("?at=01:00")).toBe(25);
    expect(formatClock("03:00")).toBe("3 AM");
  });
  it("keeps the minutes when the colon arrives percent-encoded", () => {
    expect(parseAt("?at=19%3A30")).toBe(19.5);
    expect(parseAt("?x=1&at=18%3a45")).toBe(18.75);
  });
});
