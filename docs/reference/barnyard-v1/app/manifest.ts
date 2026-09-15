import type { MetadataRoute } from "next";
import { cafe } from "@/lib/cafe";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: cafe.meta.name,
    short_name: cafe.meta.shortName,
    description: "A design-led loft house cafe in Chandkheda, North Ahmedabad. Open 11 AM to 3 AM.",
    start_url: "/",
    display: "standalone",
    background_color: "#3a2e29",
    theme_color: "#3a2e29",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
