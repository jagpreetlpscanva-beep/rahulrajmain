import type { SVGProps } from "react";

/** Sun / starburst emblem with an "R" monogram — the brand mark. */
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
  className = "",
}: {
  /** "light" = for dark backgrounds (cream text), "dark" = for light backgrounds (ink text) */
  variant?: "light" | "dark";
  className?: string;
}) {
  const nameColor = variant === "light" ? "text-cream" : "text-ink";
  return (
    <a
      href="/"
      aria-label="Rahul Raj — Vedic Astrologer, home"
      className={`group flex flex-col items-center leading-none ${className}`}
    >
      <SunEmblem className="mb-1 h-9 w-9 transition-transform duration-500 group-hover:rotate-90 sm:h-11 sm:w-11" />
      <span
        className={`font-serif text-xl font-bold tracking-[0.18em] sm:text-2xl ${nameColor}`}
      >
        RAHUL RAJ
      </span>
      <span className="mt-0.5 flex items-center gap-2 text-[0.55rem] font-medium tracking-[0.35em] text-gold-400 sm:text-[0.6rem]">
        <span className="h-px w-4 bg-gold-400/60" />
        VEDIC ASTROLOGER
        <span className="h-px w-4 bg-gold-400/60" />
      </span>
    </a>
  );
}
