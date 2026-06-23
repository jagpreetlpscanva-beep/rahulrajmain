import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C8902C",
          50: "#FBF4E5",
          100: "#F5E6C6",
          200: "#EBCD8C",
          300: "#E0B45C",
          400: "#D4A03C",
          500: "#C8902C",
          600: "#A67320",
          700: "#82591A",
          800: "#5E4013",
          900: "#3A280C",
          // refined champagne-gold accent for the light luxury hero
          accent: "#C8A75D",
        },
        // light luxury palette
        ivory: "#FAF7F2",
        champagne: "#F5F0E8",
        espresso: {
          DEFAULT: "#2D1B12",
          light: "#5A463A",
          soft: "#8A7766",
        },
        cream: {
          DEFAULT: "#FAF4E8",
          dark: "#F3E9D5",
          deep: "#EFE2C9",
        },
        ink: {
          DEFAULT: "#3D2817",
          light: "#5A4530",
          dark: "#2A1B0E",
        },
        night: {
          DEFAULT: "#1a0f06",
          800: "#241608",
          700: "#2e1c0b",
          600: "#3a2410",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 40px -12px rgba(61, 40, 23, 0.18)",
        "card-hover": "0 24px 60px -16px rgba(166, 115, 32, 0.35)",
        glow: "0 0 60px -10px rgba(224, 180, 92, 0.55)",
        "gold-btn": "0 12px 30px -8px rgba(166, 115, 32, 0.55)",
        // calm, premium shadows for the light luxury hero
        luxe: "0 24px 60px -28px rgba(45, 27, 18, 0.28)",
        "luxe-btn": "0 16px 34px -14px rgba(174, 140, 68, 0.55)",
        book: "0 45px 70px -30px rgba(45, 27, 18, 0.55), 0 18px 30px -20px rgba(45, 27, 18, 0.35)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E0B45C 0%, #C8902C 50%, #A67320 100%)",
        // rich gold primary button (per brief)
        "luxe-gold": "linear-gradient(135deg, #E8B04D 0%, #D89B2A 100%)",
        "soft-radial":
          "radial-gradient(55% 55% at 72% 32%, rgba(200,167,93,0.14) 0%, rgba(200,167,93,0) 70%)",
        // warm golden-orange hero base: #FFF3D6 -> #F7D89A -> #EAB85D
        "warm-gold":
          "linear-gradient(160deg, #FFF3D6 0%, #F7D89A 50%, #EAB85D 100%)",
        // rich terracotta-orange carousel hero (white text on top)
        "sunset-orange":
          "radial-gradient(125% 130% at 60% 30%, #CB8A45 0%, #B66E32 44%, #9C5420 100%)",
        // soft golden glow placed behind the zodiac wheel
        "amber-radial":
          "radial-gradient(circle, rgba(255,247,225,0.95) 0%, rgba(244,210,135,0.6) 28%, rgba(216,155,42,0.22) 56%, rgba(216,155,42,0) 75%)",
        // warm amber light spilling in from the right edge
        "right-amber":
          "radial-gradient(circle at 100% 42%, rgba(234,184,93,0.65) 0%, rgba(234,184,93,0.16) 42%, rgba(234,184,93,0) 66%)",
        // luxury orange highlight, lower right
        "orange-glow":
          "radial-gradient(circle at 82% 80%, rgba(216,155,42,0.4) 0%, rgba(216,155,42,0) 55%)",
        // soft light-rays burst rising from the base of the wheel
        "ray-glow":
          "radial-gradient(ellipse 42% 58% at 50% 100%, rgba(255,243,214,0.85) 0%, rgba(255,235,190,0.25) 38%, rgba(255,235,190,0) 72%)",
        "night-gradient":
          "radial-gradient(ellipse at 70% 40%, #3a2410 0%, #241608 45%, #14090300 100%), linear-gradient(160deg, #1a0f06 0%, #110a04 100%)",
      },
      keyframes: {
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-13px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.85" },
        },
        // breathing warm-amber glow behind the wheel
        "glow-breathe": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.05)" },
        },
        // continuous horizontal scroll for the awards gallery
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 60s linear infinite",
        // calmer, more luxurious cadence
        "spin-slower": "spin-slow 120s linear infinite",
        float: "float 7s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "glow-breathe": "glow-breathe 8s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
