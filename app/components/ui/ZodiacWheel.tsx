import type { CSSProperties } from "react";
import { ZODIAC_SIGNS } from "@/lib/content";

/**
 * Decorative Vedic zodiac wheel rendered as thin, low-opacity gold linework —
 * deliberately subtle so it reads as a premium watermark, not a mystical focal
 * point. Pure SVG (renders on the server); the slow rotation is applied by the
 * parent via `animate-spin-slower`.
 */
export function ZodiacWheel({ className = "" }: { className?: string }) {
  const C = 200; // centre
  const nameR = 170;
  const glyphR = 128;
  // inherits the parent's text colour so the wheel can be themed per background
  const gold = "currentColor";

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="Vedic zodiac wheel with the twelve astrological signs"
    >
      {/* concentric rings — fine gold linework, richer presence */}
      <g fill="none" stroke={gold}>
        <circle cx={C} cy={C} r="196" strokeWidth="1" opacity="0.55" />
        <circle cx={C} cy={C} r="188" strokeWidth="0.6" opacity="0.34" />
        <circle cx={C} cy={C} r="150" strokeWidth="0.9" opacity="0.48" />
        <circle cx={C} cy={C} r="104" strokeWidth="0.75" opacity="0.45" />
        <circle cx={C} cy={C} r="92" strokeWidth="0.6" opacity="0.3" />
        {/* fine dotted ring */}
        <circle
          cx={C}
          cy={C}
          r="178"
          strokeWidth="1.1"
          strokeDasharray="0.9 7"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>

      {/* 12 segments: spokes, glyphs and names */}
      {ZODIAC_SIGNS.map((sign, i) => {
        const angle = (i * 360) / 12;
        const rad = (angle - 90) * (Math.PI / 180);
        const gx = C + glyphR * Math.cos(rad);
        const gy = C + glyphR * Math.sin(rad);
        return (
          <g key={sign.name}>
            {/* spoke divider */}
            <line
              x1={C}
              y1={C}
              x2={C + 150 * Math.cos((angle - 90 - 15) * (Math.PI / 180))}
              y2={C + 150 * Math.sin((angle - 90 - 15) * (Math.PI / 180))}
              stroke={gold}
              strokeWidth="0.6"
              opacity="0.28"
            />
            {/* sign name along the rim */}
            <text
              x={C}
              y={C - nameR}
              transform={`rotate(${angle} ${C} ${C})`}
              textAnchor="middle"
              fontFamily="var(--font-poppins), sans-serif"
              fontSize="9.5"
              letterSpacing="1.6"
              fontWeight="500"
              fill={gold}
              opacity="0.72"
            >
              {sign.name.toUpperCase()}
            </text>
            {/* glyph — glyph strings include U+FE0E so browsers render the
                astrological symbols as text, not coloured emoji */}
            <text
              x={gx}
              y={gy}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="22"
              fill={gold}
              opacity="0.7"
              style={{ fontVariantEmoji: "text" } as CSSProperties}
            >
              {sign.glyph}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
