"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "solid" | "outline" | "luxe" | "ghost";

interface ButtonProps extends Omit<HTMLMotionProps<"a">, "ref"> {
  href: string;
  variant?: Variant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  solid:
    "bg-gold-gradient text-night shadow-gold-btn hover:shadow-[0_18px_40px_-8px_rgba(166,115,32,0.7)]",
  outline:
    "border border-gold-400/70 text-cream hover:border-gold-300 hover:bg-gold-400/10",
  // rich gold primary, warm shadow
  luxe:
    "bg-luxe-gold text-espresso shadow-luxe-btn hover:shadow-[0_22px_46px_-12px_rgba(216,155,42,0.7)]",
  // outline secondary on the dark orange hero
  ghost:
    "border border-cream/55 bg-white/5 text-cream backdrop-blur-sm hover:bg-white/15 hover:border-cream",
};

/** Reusable CTA button with hover-lift + tap micro-interactions. */
export function Button({
  href,
  variant = "solid",
  icon,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`group inline-flex items-center justify-center gap-3 rounded-xl px-7 py-4 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 ${variants[variant]} ${className}`}
      {...rest}
    >
      {icon && (
        <span className="grid h-5 w-5 place-items-center transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
      )}
      {children}
    </motion.a>
  );
}
