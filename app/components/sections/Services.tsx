"use client";

import { motion } from "framer-motion";
import { SERVICES, type Service } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "../ui/Reveal";
import { CrestDivider, LotusDivider } from "../ui/Dividers";
import { Mandala } from "../ui/Mandala";
import { Button } from "../ui/Button";
import { Icon, ArrowRightIcon, CalendarIcon } from "../icons";

export function Services() {
  return (
    <section id="services" className="paper-bg relative py-20 lg:py-28">
      <div className="container-px">
        {/* header */}
        <Reveal className="flex flex-col items-center text-center">
          <CrestDivider className="mb-8" />
          <span className="eyebrow text-gold-600">Our Services</span>
          <h2 className="mt-3 font-serif text-4xl font-bold text-ink sm:text-5xl">
            Guidance For Every Path Of Life
          </h2>
          <LotusDivider className="my-6" />
          <p className="max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
            Personalized astrological solutions to help you navigate life&rsquo;s
            challenges and unlock new opportunities.
          </p>
        </Reveal>

        {/* cards */}
        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <RevealItem key={service.title}>
              <ServiceCard service={service} />
            </RevealItem>
          ))}
        </RevealGroup>

        {/* CTA */}
        <Reveal className="mt-14 flex justify-center" delay={0.1}>
          <Button href="#contact" icon={<CalendarIcon className="h-5 w-5" />}>
            Book a Consultation
            <ArrowRightIcon className="ml-1 h-5 w-5" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.article
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex h-full flex-col items-center overflow-hidden rounded-3xl border border-gold-500/20 bg-gradient-to-b from-white/70 to-cream-dark/40 p-7 text-center shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      {/* badge */}
      <span className="absolute right-4 top-4 rounded-md bg-gold-gradient px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-night shadow-sm">
        {service.badge}
      </span>

      {/* icon + mandala */}
      <div className="relative mt-6 grid h-28 w-28 place-items-center">
        <Mandala className="absolute inset-0 h-full w-full text-gold-500/25 transition-transform duration-700 group-hover:rotate-45" />
        <span className="grid h-20 w-20 place-items-center rounded-full border border-gold-500/40 bg-cream text-ink shadow-inner transition-colors duration-300 group-hover:border-gold-500">
          <Icon name={service.icon} className="h-9 w-9 text-ink transition-colors group-hover:text-gold-700" />
        </span>
      </div>

      <h3 className="mt-6 font-serif text-xl font-bold leading-snug text-ink">
        {service.title}
      </h3>

      <span className="my-4 flex items-center gap-2 text-gold-500">
        <span className="h-px w-8 bg-gold-400/60" />
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5">
          <path d="M6 1 8 6 6 11 4 6Z" fill="currentColor" />
        </svg>
        <span className="h-px w-8 bg-gold-400/60" />
      </span>

      <p className="text-sm leading-relaxed text-ink/70">{service.description}</p>

      <a
        href="#contact"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold-600 transition-colors hover:text-gold-700"
      >
        Explore Service
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
      </a>
    </motion.article>
  );
}
