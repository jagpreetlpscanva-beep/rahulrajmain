"use client";

import { motion } from "framer-motion";
import { TOOLS, type Tool } from "@/lib/content";
import { Reveal } from "../ui/Reveal";
import { LotusDivider, Diamond } from "../ui/Dividers";
import { Icon, ArrowRightIcon, GiftIcon } from "../icons";

export function Tools() {
  return (
    <section id="tools" className="paper-bg relative border-t border-gold-500/10 py-20 lg:py-28">
      <div className="container-px">
        {/* header */}
        <Reveal className="flex flex-col items-center text-center">
          <span className="mb-3 inline-flex items-center gap-3 text-gold-600">
            <Diamond className="h-2.5 w-2.5" />
            <span className="eyebrow">Powerful Tools For Your Guidance</span>
            <Diamond className="h-2.5 w-2.5" />
          </span>
          <h2 className="font-serif text-4xl font-bold text-ink sm:text-6xl">
            Free Astrology Tools
          </h2>
          <p className="mt-4 text-base text-ink/70 sm:text-lg">
            Accurate calculations. Powerful insights. 100% Free.
          </p>
          <LotusDivider className="mt-6" />
        </Reveal>

        {/* cards */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2">
          {TOOLS.map((tool, i) => (
            <Reveal key={tool.title} direction={i % 2 === 0 ? "right" : "left"} delay={(i % 2) * 0.08}>
              <ToolCard tool={tool} />
            </Reveal>
          ))}
        </div>

        {/* coming soon */}
        <Reveal className="mx-auto mt-12 max-w-2xl" delay={0.1}>
          <motion.button
            type="button"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-gold-500/50 bg-white/50 px-6 py-4 text-sm font-semibold uppercase tracking-wider text-gold-700 transition-colors hover:bg-gold-50"
          >
            <GiftIcon className="h-5 w-5" />
            More Tools Coming Soon
          </motion.button>
        </Reveal>
      </div>
    </section>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <motion.a
      href="#contact"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group flex items-center gap-5 rounded-2xl border border-gold-500/20 bg-white/70 p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover sm:p-6"
    >
      {/* glowing gold icon */}
      <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gold-gradient text-cream shadow-[0_8px_20px_-6px_rgba(166,115,32,0.5)] transition-all duration-300 group-hover:shadow-[0_0_28px_-2px_rgba(224,180,92,0.85)]">
        <Icon name={tool.icon} className="h-8 w-8" />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-xl font-bold text-ink">{tool.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink/65">{tool.description}</p>
      </div>

      {/* arrow button */}
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold-500/50 text-gold-600 transition-all duration-300 group-hover:bg-gold-gradient group-hover:text-night">
        <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </motion.a>
  );
}
