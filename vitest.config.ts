import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  // Next's tsconfig preserves JSX; tests that import a component need it compiled
  oxc: { jsx: { runtime: "automatic" } },
  test: { environment: "node", include: ["tests/**/*.test.ts"] },
});
