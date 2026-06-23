import type { SVGProps } from "react";

type Corner = "tl" | "tr" | "bl" | "br";

const rotation: Record<Corner, string> = {
  tl: "rotate-0",
  tr: "rotate-90",
  br: "rotate-180",
  bl: "-rotate-90",
};

const place: Record<Corner, string> = {
  tl: "left-0 top-0",
  tr: "right-0 top-0",
  br: "bottom-0 right-0",
  bl: "bottom-0 left-0",
};

/**
 * Vedic-inspired filigree corner flourish (thin gold linework). Designed in the
 * top-left orientation and rotated into the other three corners.
 */
export function CornerFlourish({
  corner,
  className = "",
  ...props
}: { corner: Corner; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className={`pointer-events-none absolute ${place[corner]} ${rotation[corner]} ${className}`}
      {...props}
    >
      {/* double-line bracket */}
      <path d="M20 20 H104" strokeWidth="1.1" opacity="0.7" />
      <path d="M20 20 V104" strokeWidth="1.1" opacity="0.7" />
      <path d="M20 28 H78" strokeWidth="0.8" opacity="0.4" />
      <path d="M28 20 V78" strokeWidth="0.8" opacity="0.4" />
      {/* sweeping vine flourishes */}
      <path d="M36 36 Q92 40 104 96" strokeWidth="0.85" opacity="0.55" />
      <path d="M36 36 Q40 92 96 104" strokeWidth="0.85" opacity="0.55" />
      {/* small leaves on the vine */}
      <path d="M70 38 q10 -8 16 0 q-8 10 -16 0Z" strokeWidth="0.7" opacity="0.5" />
      <path d="M38 70 q-8 10 0 16 q10 -8 0 -16Z" strokeWidth="0.7" opacity="0.5" />
      {/* corner finial */}
      <circle cx="20" cy="20" r="3.4" fill="currentColor" stroke="none" opacity="0.85" />
      <path d="M20 9 L23 20 L20 31 L17 20Z" fill="currentColor" stroke="none" opacity="0.4" />
      <path d="M9 20 L20 17 L31 20 L20 23Z" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  );
}

/** Elegant gold divider: hairline rules flanking a central diamond. */
export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 text-gold-accent ${className}`}>
      <span
        className="h-px w-24"
        style={{ background: "linear-gradient(90deg, transparent, currentColor)" }}
      />
      <svg viewBox="0 0 28 12" className="h-2.5 w-7" aria-hidden="true">
        <path d="M4 6 L14 1 L24 6 L14 11Z" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M14 3 L18 6 L14 9 L10 6Z" fill="currentColor" />
      </svg>
      <span
        className="h-px w-24"
        style={{ background: "linear-gradient(90deg, currentColor, transparent)" }}
      />
    </span>
  );
}
