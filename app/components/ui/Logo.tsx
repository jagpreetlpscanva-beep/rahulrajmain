import type { SVGProps } from "react";

/** Path to the brand mark. Drop the real "Rahul Raj Astro" logo here to replace it. */
export const BRAND_LOGO_SRC = "/brand/logo.png";

/** Sun / starburst emblem with an "R" monogram — vector fallback brand mark. */
export function SunEmblem({ className, ...props }: SVGProps<SVGSVGElement>) {
  const rays = Array.from({ length: 16 });
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="emblemGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0CE84" />
          <stop offset="55%" stopColor="#D4A03C" />
          <stop offset="100%" stopColor="#A67320" />
        </linearGradient>
      </defs>
      <g fill="url(#emblemGold)">
        {rays.map((_, i) => {
          const angle = (i * 360) / rays.length;
          const long = i % 2 === 0;
          return (
            <rect
              key={i}
              x="49"
              y={long ? "2" : "7"}
              width="2"
              height={long ? "13" : "8"}
              rx="1"
              transform={`rotate(${angle} 50 50)`}
            />
          );
        })}
        <circle cx="50" cy="50" r="30" fill="none" stroke="url(#emblemGold)" strokeWidth="2.5" />
      </g>
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-playfair), Georgia, serif"
        fontWeight="700"
        fontSize="34"
        fill="url(#emblemGold)"
      >
        R
      </text>
    </svg>
  );
}

export function Logo({
  variant = "light",
  layout = "row",
  showText = true,
  className = "",
}: {
  /** "light" = for dark backgrounds (cream text), "dark" = for light backgrounds (ink text) */
  variant?: "light" | "dark";
  /** "row" = mark beside name (navbar); "stack" = mark above name (footer/hero) */
  layout?: "row" | "stack";
  showText?: boolean;
  className?: string;
}) {
  const nameColor = variant === "light" ? "text-cream" : "text-ink";
  const stack = layout === "stack";

  return (
    <a
      href="/"
      aria-label="Rahul Raj Astro — home"
      className={`group flex items-center leading-none ${
        stack ? "flex-col gap-1.5 text-center" : "gap-2.5"
      } ${className}`}
    >
      {/* circular brand mark (uploaded logo, transition on hover) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BRAND_LOGO_SRC}
        alt="Rahul Raj Astro"
        className={`shrink-0 select-none rounded-full object-cover shadow-[0_2px_10px_rgba(0,0,0,0.15)] ring-1 ring-gold-500/30 transition-transform duration-500 group-hover:scale-105 ${
          stack ? "h-16 w-16" : "h-10 w-10 sm:h-11 sm:w-11"
        }`}
      />
      {showText && (
        <span className={`flex flex-col ${stack ? "items-center" : "items-start"}`}>
          <span className={`font-serif font-bold tracking-[0.16em] ${nameColor} ${stack ? "text-xl" : "text-base sm:text-lg"}`}>
            RAHUL RAJ
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[0.5rem] font-medium tracking-[0.3em] text-gold-500 sm:text-[0.55rem]">
            <span className="h-px w-3 bg-gold-500/50" />
            VEDIC ASTROLOGER
            <span className="h-px w-3 bg-gold-500/50" />
          </span>
        </span>
      )}
    </a>
  );
}
