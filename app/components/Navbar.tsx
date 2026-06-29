"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_MENU, LANGUAGES, type NavMenuItem } from "@/lib/content";
import { useScrolled } from "@/lib/hooks";
import { Logo } from "./ui/Logo";
import { SearchBox } from "./ui/SearchBox";
import { CalendarIcon, CloseIcon, MenuIcon, ChevronDownIcon, GlobeIcon } from "./icons";

const MENU = [...NAV_MENU.left, ...NAV_MENU.right];

export function Navbar({ overlay = false }: { overlay?: boolean }) {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<string>(LANGUAGES[0]);

  // dark text on a light header: always when not overlay, or once scrolled
  const dark = !overlay || scrolled;

  const linkTone = dark
    ? "text-ink/75 hover:text-gold-600"
    : "text-cream/90 hover:text-white";

  // -------- desktop menu item (with optional dropdown) --------
  const MenuItem = ({ item, align = "left" }: { item: NavMenuItem; align?: "left" | "right" }) => {
    if (!item.children) {
      return (
        <li className="shrink-0">
          <a
            href={item.href}
            className={`whitespace-nowrap text-[0.8rem] font-medium tracking-wide transition-colors duration-300 2xl:text-sm ${linkTone}`}
          >
            {item.label}
          </a>
        </li>
      );
    }
    return (
      <li className="group relative shrink-0">
        <a
          href={item.href}
          className={`inline-flex items-center gap-1 whitespace-nowrap text-[0.8rem] font-medium tracking-wide transition-colors duration-300 2xl:text-sm ${linkTone}`}
        >
          {item.label}
          <ChevronDownIcon className="h-3 w-3 opacity-70 transition-transform duration-300 group-hover:rotate-180" />
        </a>
        {/* dropdown — solid panel (pt-3 bridges the hover gap) */}
        <div className={`invisible absolute top-full z-50 w-60 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${align === "right" ? "right-0" : "left-0"}`}>
          <ul className="overflow-hidden rounded-xl bg-white p-2 shadow-[0_26px_60px_-15px_rgba(45,27,18,0.55)] ring-1 ring-ink/10">
            {item.children.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="block rounded-lg px-3.5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold-100 hover:text-gold-700"
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  };

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        dark
          ? "border-b border-gold-500/10 bg-gradient-to-b from-[#FCF8F2]/95 to-[#FBF3E6]/95 shadow-[0_8px_30px_-16px_rgba(45,27,18,0.25)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      {/* max-width container; 3-column grid on desktop (left menu | logo | right) */}
      <nav className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-5 xl:px-8 2xl:px-12">
        {/* left menu */}
        <ul className="hidden items-center justify-start gap-3 xl:flex 2xl:gap-6">
          {NAV_MENU.left.map((item) => (
            <MenuItem key={item.label} item={item} align="left" />
          ))}
        </ul>

        {/* logo + name (center) */}
        <Logo variant={dark ? "dark" : "light"} className="justify-self-start xl:justify-self-center" />

        {/* right menu + search + language */}
        <div className="hidden items-center justify-end gap-3 xl:flex 2xl:gap-5">
          <ul className="flex items-center gap-3 2xl:gap-6">
            {NAV_MENU.right.map((item) => (
              <MenuItem key={item.label} item={item} align="right" />
            ))}
          </ul>
          <SearchBox scrolled={dark} />
          <div className="group relative">
            <button
              type="button"
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium tracking-wide transition-colors ${
                dark
                  ? "border-ink/20 text-ink/80 hover:bg-ink/5"
                  : "border-cream/45 text-cream hover:bg-white/10"
              }`}
            >
              <GlobeIcon className="h-4 w-4" />
              {lang}
              <ChevronDownIcon className="h-3 w-3 opacity-70 transition-transform duration-300 group-hover:rotate-180" />
            </button>
            <div className="invisible absolute right-0 top-full z-50 w-40 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <ul className="overflow-hidden rounded-xl bg-white p-2 shadow-[0_26px_60px_-15px_rgba(45,27,18,0.55)] ring-1 ring-ink/10">
                {LANGUAGES.map((l) => (
                  <li key={l}>
                    <button
                      type="button"
                      onClick={() => setLang(l)}
                      className={`block w-full rounded-lg px-3.5 py-2 text-left text-sm transition-colors hover:bg-gold-100/70 hover:text-gold-700 ${
                        l === lang ? "text-gold-700" : "text-ink/75"
                      }`}
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg transition-colors xl:hidden ${
            dark ? "text-espresso hover:bg-espresso/5" : "text-cream hover:bg-white/10"
          }`}
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="max-h-[80vh] overflow-y-auto border-t border-gold-500/15 bg-[#FCF8F2]/98 backdrop-blur-md xl:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4 sm:px-8">
              <li className="pb-2">
                <SearchBox inline />
              </li>
              {MENU.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-wide text-ink/85 transition-colors hover:bg-ink/5"
                  >
                    {item.label}
                  </a>
                  {item.children && (
                    <ul className="mb-1 ml-3 border-l border-gold-500/20 pl-3">
                      {item.children.map((c) => (
                        <li key={c.label}>
                          <a
                            href={c.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-ink/65 transition-colors hover:bg-ink/5 hover:text-gold-700"
                          >
                            {c.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="/book/consultation/quick"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gold-gradient px-5 py-3.5 text-sm font-semibold uppercase tracking-wider text-night shadow-gold-btn"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Book Consultation
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
