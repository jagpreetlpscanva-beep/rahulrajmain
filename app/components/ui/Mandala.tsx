import type { SVGProps } from "react";

/** Faint decorative mandala used behind the service-card icons. */
export function Mandala({ className, ...props }: SVGProps<SVGSVGElement>) {
  const petals = Array.from({ length: 12 });
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="60" cy="60" r="54" />
        <circle cx="60" cy="60" r="44" />
        <circle cx="60" cy="60" r="30" />
        {petals.map((_, i) => {
          const a = (i * 360) / petals.length;
          return (
            <path
              key={i}
              d="M60 16 C 70 34, 70 46, 60 58 C 50 46, 50 34, 60 16 Z"
              transform={`rotate(${a} 60 60)`}
            />
          );
        })}
      </g>
    </svg>
  );
}
