import type { SVGProps } from "react";
import { SunEmblem } from "./Logo";

/** Ornamental rule with a small diamond finial — used inline around eyebrow text. */
export function Diamond({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path
        d="M8 1 11 8 8 15 5 8 8 1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M8 5 9.4 8 8 11 6.6 8 8 5Z" fill="currentColor" />
    </svg>
  );
}

/** Top ornamental divider with the sun emblem in the centre (above "Our Services"). */
export function CrestDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 text-gold-500 ${className}`}>
      <Line className="w-24 sm:w-40" />
      <Diamond className="h-2.5 w-2.5" />
      <SunEmblem className="h-9 w-9" />
      <Diamond className="h-2.5 w-2.5" />
      <Line className="w-24 sm:w-40" reverse />
    </div>
  );
}

/** Eyebrow flanked by diamond ticks. */
export function EyebrowDivider({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 text-gold-500 ${className}`}>
      <Diamond className="h-2.5 w-2.5" />
      <Line className="w-8" />
    </span>
  );
}

/** Stylised lotus bloom divider (below section titles). */
export function LotusDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold-500 ${className}`}>
      <Line className="w-16 sm:w-24" />
      <Lotus className="h-5 w-7" />
      <Line className="w-16 sm:w-24" reverse />
    </div>
  );
}

export function Lotus(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16 2c1.6 2.3 2.4 4.6 2.4 7 0 2-.8 3.7-2.4 5-1.6-1.3-2.4-3-2.4-5 0-2.4.8-4.7 2.4-7Z" />
      <path d="M16 14c-1.9-1-3.9-1.3-6-1 .5 2.3 2.5 4 5 4 .35 0 .68-.03 1-.1V14Z" opacity=".85" />
      <path d="M16 14c1.9-1 3.9-1.3 6-1-.5 2.3-2.5 4-5 4-.35 0-.68-.03-1-.1V14Z" opacity=".85" />
      <path d="M16 13c-2.3-1.6-4.7-2.1-7.4-1.6.2 1 .7 1.9 1.4 2.6 1.9-.4 3.9-.1 6 1V13Z" opacity=".6" />
      <path d="M16 13c2.3-1.6 4.7-2.1 7.4-1.6-.2 1-.7 1.9-1.4 2.6-1.9-.4-3.9-.1-6 1V13Z" opacity=".6" />
    </svg>
  );
}

function Line({ className = "", reverse = false }: { className?: string; reverse?: boolean }) {
  return (
    <span
      className={`h-px bg-current ${className}`}
      style={{
        background: reverse
          ? "linear-gradient(90deg, currentColor, transparent)"
          : "linear-gradient(90deg, transparent, currentColor)",
      }}
    />
  );
}
