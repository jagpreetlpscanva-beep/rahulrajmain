"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Deterministic pseudo-random so server and client render identically (no hydration mismatch). */
function seeded(i: number, salt = 1) {
  const x = Math.sin(i * 12.9898 * salt + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Floating golden dust motes — warm, glowing specks behind the hero content. */
export function Particles({ count = 30 }: { count?: number }) {
  const reduce = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: seeded(i, 1) * 100,
        top: seeded(i, 2) * 100,
        size: 1.5 + seeded(i, 3) * 3.5,
        duration: 12 + seeded(i, 4) * 12,
        delay: seeded(i, 5) * 9,
        drift: 14 + seeded(i, 6) * 26,
        opacity: 0.25 + seeded(i, 7) * 0.45,
        // alternate warm-white dust and gold flecks
        warm: seeded(i, 8) > 0.5,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.warm ? "#FFF7E0" : "#E8B04D",
            boxShadow: p.warm
              ? "0 0 7px 1px rgba(255,243,214,0.7)"
              : "0 0 6px 1px rgba(216,155,42,0.5)",
          }}
          initial={{ opacity: p.opacity }}
          animate={
            reduce
              ? { opacity: p.opacity }
              : {
                  y: [0, -p.drift, 0],
                  opacity: [p.opacity * 0.35, p.opacity, p.opacity * 0.35],
                }
          }
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
