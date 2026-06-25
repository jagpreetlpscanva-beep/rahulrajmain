"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useCollection, DEFAULT_HERO_SLIDES, type HeroSlide } from "@/lib/adminStore";
import { Particles } from "../ui/Particles";
import { ZodiacWheel } from "../ui/ZodiacWheel";
import { Button } from "../ui/Button";
import { Mandala } from "../ui/Mandala";
import { CalendarIcon, WhatsAppIcon } from "../icons";
import { optimizeImage } from "@/lib/content";

const AUTOPLAY_MS = 4000;

export function Hero() {
  const { items: slides } = useCollection<HeroSlide>("hero", DEFAULT_HERO_SLIDES);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const count = Math.max(slides.length, 1);
  const slide = slides[index] ?? slides[0] ?? DEFAULT_HERO_SLIDES[0];

  // auto-advance (paused on hover/focus or when reduced motion is requested)
  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, reduce, count]);

  return (
    <section
      id="home"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative flex min-h-[94vh] flex-col overflow-hidden bg-sunset-orange pt-28 text-cream lg:pt-28"
    >
      {/* ---------- atmosphere ---------- */}
      {/* edge vignette for depth */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_240px_60px_rgba(80,40,12,0.4)]" />
      {/* warm light behind the wheel */}
      <div className="pointer-events-none absolute right-[2%] top-1/2 hidden h-[52rem] w-[52rem] -translate-y-1/2 animate-glow-breathe bg-amber-radial opacity-70 blur-2xl lg:block" />
      {/* faint mandala watermarks in the corners */}
      <Mandala className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 text-cream/[0.08] sm:h-80 sm:w-80" />
      <Mandala className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 text-cream/[0.07] sm:h-96 sm:w-96" />
      <Particles />

      {/* ---------- content ---------- */}
      <div className="container-wide relative flex flex-1 items-center">
        <div className="grid w-full items-center gap-8 pb-8 lg:grid-cols-2 lg:gap-8 lg:pb-10 xl:gap-12">
          {/* left: animated slide copy */}
          <div className="relative z-10 lg:min-h-[20rem]">
            {/* keyed remount: content always reflects the active slide */}
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
                <span className="inline-flex items-center gap-2 rounded-full border border-cream/35 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-cream backdrop-blur-sm">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-gold-200" aria-hidden="true">
                    <path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4 Z" fill="currentColor" />
                  </svg>
                  {slide.badge}
                </span>

                <h1 className="mt-6 max-w-xl font-serif font-bold leading-[1.07] tracking-[-0.01em] text-white text-[2.3rem] sm:text-[2.9rem] lg:text-[3.2rem] xl:text-[3.65rem]">
                  {slide.title}
                </h1>

                <p className="mt-5 max-w-lg text-base leading-relaxed text-cream/85 sm:text-lg">
                  {slide.subtitle}
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button
                    href={slide.primaryHref}
                    variant="luxe"
                    icon={<CalendarIcon className="h-5 w-5" />}
                  >
                    {slide.primaryLabel}
                  </Button>
                  <Button
                    href={slide.secondaryHref}
                    variant="ghost"
                    icon={
                      slide.secondaryLabel.includes("WhatsApp") ? (
                        <WhatsAppIcon className="h-5 w-5" />
                      ) : undefined
                    }
                  >
                    {slide.secondaryLabel}
                  </Button>
                </div>
            </motion.div>
          </div>

          {/* right: zodiac-wheel watermark + per-slide visual (astrologer / book) */}
          <div className="relative mx-auto aspect-square w-full max-w-[26rem] sm:max-w-[28rem] lg:mx-0 lg:ml-auto lg:w-full lg:max-w-[34rem] xl:max-w-[40rem]">
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-ray-glow opacity-80" />
            <ZodiacWheel className="absolute inset-0 h-full w-full animate-spin-slower text-[#F7EAD0]" />

            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {slide.visual === "astrologer" ? (
                <div className="relative h-full w-full">
                  {slide.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={slide.image}
                      src={optimizeImage(slide.image)}
                      alt="Astro Rahul Raj"
                      loading="eager"
                      fetchPriority="high"
                      className="absolute bottom-0 left-1/2 h-[94%] -translate-x-1/2 object-contain drop-shadow-[0_30px_40px_rgba(40,20,5,0.45)]"
                    />
                  )}
                  {(slide.stats ?? []).slice(0, 3).map((s, i) => {
                    const [value, label] = s.split("|").map((x) => x.trim());
                    const pos = ["left-[-2%] top-[10%]", "right-[-3%] top-[42%]", "bottom-[14%] left-[-4%]"][i];
                    const delay = ["0s", "1.2s", "0.6s"][i];
                    return <StatCard key={i} value={value} label={label || ""} className={pos} delay={delay} />;
                  })}
                </div>
              ) : (
                slide.image && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={slide.image}
                      src={optimizeImage(slide.image)}
                      alt={slide.title}
                      className="max-h-[66%] max-w-[72%] animate-float object-contain drop-shadow-[0_34px_44px_rgba(40,20,5,0.5)]"
                    />
                  </div>
                )
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ---------- carousel dots ---------- */}
      <div className="relative z-10 flex justify-center gap-2.5 pb-16 lg:pb-20">
        {slides.map((s, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-cream" : "w-2.5 bg-cream/40 hover:bg-cream/70"
            }`}
          />
        ))}
      </div>

      {/* straight bottom edge (flat line into the next section) */}
    </section>
  );
}

function StatCard({
  value,
  label,
  className = "",
  delay = "0s",
}: {
  value: string;
  label: string;
  className?: string;
  delay?: string;
}) {
  return (
    <div
      style={{ animationDelay: delay }}
      className={`absolute z-10 flex animate-float items-center gap-2.5 rounded-xl border border-gold-500/20 bg-white/95 px-3.5 py-2.5 shadow-[0_14px_30px_-12px_rgba(40,20,5,0.5)] backdrop-blur-sm ${className}`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-gradient text-night">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M12 2l2.6 6.3L21 9l-5 4.2L17.5 21 12 17.3 6.5 21 8 13.2 3 9l6.4-.7L12 2Z" />
        </svg>
      </span>
      <div>
        <p className="font-serif text-base font-bold leading-none text-ink">{value}</p>
        <p className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-ink/55">{label}</p>
      </div>
    </div>
  );
}
