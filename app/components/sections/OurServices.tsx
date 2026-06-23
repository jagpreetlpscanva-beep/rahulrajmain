"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  useCollection,
  DEFAULT_CONSULTATIONS,
  DEFAULT_REPORTS,
  DEFAULT_POOJAS,
  DEFAULT_COURSES,
  type Consultation,
  type StoredReport,
  type Pooja,
  type Course,
} from "@/lib/adminStore";
import { Icon } from "../icons";
import type { IconName } from "@/lib/content";

const TABS = ["All", "Consultations", "Reports", "Online Puja", "Courses"] as const;
type Tab = (typeof TABS)[number];

interface ServiceItem {
  id: string;
  tab: Exclude<Tab, "All">;
  title: string;
  desc: string;
  badge?: string;
  accent: [string, string];
  href: string;
  cta: string;
  icon: IconName;
}

export function OurServices() {
  const consultations = useCollection<Consultation>("consultations", DEFAULT_CONSULTATIONS);
  const reports = useCollection<StoredReport>("reports", DEFAULT_REPORTS);
  const poojas = useCollection<Pooja>("poojas", DEFAULT_POOJAS);
  const courses = useCollection<Course>("courses", DEFAULT_COURSES);
  const [tab, setTab] = useState<Tab>("All");

  const groups: ServiceItem[][] = [
    consultations.items.map((c) => ({
      id: c.id, tab: "Consultations", title: c.title, desc: c.description,
      badge: c.badge || c.price, accent: c.accent, href: "/consultation", cta: "Book Now", icon: "users",
    })),
    reports.items.map((r) => ({
      id: r.id, tab: "Reports", title: r.title, desc: r.description,
      badge: r.badge || r.price, accent: r.accent, href: "/reports", cta: "Get Report", icon: "birth-chart",
    })),
    poojas.items.map((p) => ({
      id: p.id, tab: "Online Puja", title: p.title, desc: p.description,
      badge: p.badge, accent: p.accent, href: "/online-pooja", cta: "Book Now", icon: "om",
    })),
    courses.items.map((c) => ({
      id: c.id, tab: "Courses", title: c.title, desc: c.description,
      badge: c.badge || c.price, accent: c.accent, href: "/courses", cta: "Enroll", icon: "star",
    })),
  ];

  // round-robin interleave so "All" shows a varied mix
  const interleaved: ServiceItem[] = [];
  const longest = Math.max(...groups.map((g) => g.length), 0);
  for (let i = 0; i < longest; i++) for (const g of groups) if (g[i]) interleaved.push(g[i]);

  const visible = (tab === "All" ? interleaved : interleaved.filter((i) => i.tab === tab)).slice(0, 8);

  return (
    <section id="services" className="bg-[#FBF4E4] py-16 lg:py-24">
      <div className="container-px">
        <div className="text-center">
          <h2 className="font-serif text-4xl font-bold sm:text-5xl">
            <span className="text-ink">Our </span>
            <span className="text-gold-600">Services</span>
          </h2>
          <p className="mt-3 text-base text-ink/65 sm:text-lg">
            Choose the service that fits your needs and start your journey toward clarity.
          </p>
        </div>

        {/* tabs */}
        <div className="mt-9 flex justify-center gap-7 overflow-x-auto border-b border-gold-500/20 pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`relative shrink-0 whitespace-nowrap pb-3 text-sm font-semibold transition-colors sm:text-base ${
                tab === t ? "text-ink" : "text-ink/45 hover:text-ink/70"
              }`}
            >
              {t}
              {tab === t && (
                <motion.span layoutId="services-tab-underline" className="absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-gold-gradient" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((s) => (
            <motion.article
              key={s.id}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="flex h-full flex-col rounded-2xl border border-gold-500/30 bg-[#FCEFD6] p-5 text-center shadow-sm transition-shadow hover:shadow-card"
            >
              {s.badge && (
                <span className="mb-1 self-end text-[0.6rem] font-semibold uppercase tracking-wider text-gold-700">
                  {s.badge}
                </span>
              )}
              <span
                className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 text-white"
                style={{ borderColor: s.accent[0], background: `linear-gradient(150deg, ${s.accent[0]}, ${s.accent[1]})` }}
              >
                <Icon name={s.icon} className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-serif text-base font-bold leading-snug text-ink">{s.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/65">{s.desc}</p>
              <a
                href={s.href}
                className="mt-4 block rounded-lg border border-gold-500/50 px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-gradient hover:text-night"
              >
                {s.cta}
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
