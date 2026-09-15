/**
 * The Barnyard Co. mark, traced from assets/brand/logo barnyard.jpg (320 px).
 * A fine single-weight line: an arch divided into four panes. Top-left a sun in a
 * window, top-right rising steam, bottom-left a potted plant under three drops,
 * bottom-right a house with an arched door.
 *
 * All geometry is in a 320 x 320 box. Stroke is applied by the renderer so the
 * same paths serve the site (stroke 4), favicons (thicker) and OG images.
 */

export const MARK_VIEWBOX = "0 0 320 320";

/** The outer arch: flat floor, straight jambs, semicircular head. */
export const ARCH_PATH = "M 55 265 L 55 160 A 105 105 0 0 1 265 160 L 265 265 Z";

/** Interior dividers. */
export const DIVIDER_PATHS = [
  "M 160 55 L 160 265", // vertical centre
  "M 55 160 L 160 160", // left horizontal
  "M 160 172 L 265 172", // right horizontal (the house's ridge line)
];

/** Top-left: the sun inside a window. */
export const SUN_CENTER = { x: 108, y: 108 };
export const SUN_RADIUS = 20;
export const SUN_RAYS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  const r1 = SUN_RADIUS + 7;
  const r2 = SUN_RADIUS + 17;
  return `M ${(SUN_CENTER.x + Math.cos(a) * r1).toFixed(1)} ${(SUN_CENTER.y + Math.sin(a) * r1).toFixed(1)} L ${(SUN_CENTER.x + Math.cos(a) * r2).toFixed(1)} ${(SUN_CENTER.y + Math.sin(a) * r2).toFixed(1)}`;
});
export const WINDOW_PATHS = [
  "M 84 160 L 84 71", // left mullion, clipped by the arch
  "M 132 160 L 132 60",
];

/** Top-right: three lines of steam. */
export const STEAM_PATHS = [190, 212, 234].map(
  (x) => `M ${x} 158 C ${x - 8} 146 ${x + 8} 134 ${x} 122 C ${x - 8} 110 ${x + 8} 98 ${x} 86 C ${x - 6} 79 ${x + 2} 74 ${x + 2} 70`,
);

/** Bottom-left: three drops and a potted plant. */
export const DROPS = [84, 108, 132].map((x) => ({ x, y: 184, r: 3 }));
export const PLANT_PATHS = [
  "M 108 242 L 108 200", // stem
  "M 108 214 C 100 214 94 208 92 202 C 100 200 106 206 108 214 Z", // left leaf
  "M 108 214 C 116 214 122 208 124 202 C 116 200 110 206 108 214 Z", // right leaf
  "M 108 230 C 101 230 96 225 94 220 C 101 218 106 223 108 230 Z", // lower left leaf
  "M 108 230 C 115 230 120 225 122 220 C 115 218 110 223 108 230 Z", // lower right leaf
  "M 90 242 L 126 242", // rim
  "M 94 242 L 98 264 L 118 264 L 122 242", // pot
];

/** Bottom-right: the house. */
export const HOUSE_PATHS = [
  "M 166 212 L 213 172 L 260 212", // gable
  "M 166 212 L 260 212", // eave
  "M 200 265 L 200 238 A 13 13 0 0 1 226 238 L 226 265", // arched door
];

export const ALL_PATHS = [
  ARCH_PATH,
  ...DIVIDER_PATHS,
  ...SUN_RAYS,
  ...WINDOW_PATHS,
  ...STEAM_PATHS,
  ...PLANT_PATHS,
  ...HOUSE_PATHS,
];
