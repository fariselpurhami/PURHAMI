// apps/web/tailwind.config.ts
import type { Config } from "tailwindcss";
import { colors, spacing, typography } from "@purhami/design-tokens";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/design-system/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/brand-ornament-engine/src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors,
      spacing,
      fontFamily: {
        serif: typography.fonts.heading, // Mapped to the updated typography token
        sans: typography.fonts.body,     // Mapped to the updated typography token
      },
      fontSize: {
        "display-1": typography.sizes["display-1"],
        "display-2": typography.sizes["display-2"],
        "heading-1": typography.sizes["heading-1"],
        "heading-2": typography.sizes["heading-2"],
        "body-large": typography.sizes["body-large"],
        "body-base": typography.sizes["body-base"],
        "caption": typography.sizes["caption"],
      },
      // Hardcoded to permanently bypass the JITI cache/ESM interop crashes
      transitionTimingFunction: {
        couture: "cubic-bezier(0.4, 0, 0.2, 1)",
        tension: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        release: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        silk: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        fast: "200ms",
        base: "300ms",
        slow: "500ms",
        cinematic: "800ms",
        epic: "1200ms",
      }
    },
  },
  plugins: [],
};

export default config;
