"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  useCollection,
  DEFAULT_POOJAS,
  DEFAULT_REPORTS,
  DEFAULT_COURSES,
  DEFAULT_CONSULTATIONS,
  DEFAULT_GALLERY,
  DEFAULT_HERO_SLIDES,
  POOJA_CATEGORIES,
  COURSE_CATEGORIES,
  HERO_VISUALS,
  newId,
  type Pooja,
  type StoredReport,
  type Course,
  type Consultation,
  type GalleryItem,
  type HeroSlide,
  DEFAULT_ADDONS,
  type Addon,
} from "@/lib/adminStore";
import { CollectionManager, type FieldDef } from "../components/admin/CollectionManager";
import { SlotsManager } from "../components/admin/SlotsManager";
import { BookingsView } from "../components/admin/BookingsView";
import { Logo } from "../components/ui/Logo";
import { MoonIcon, OmIcon, StarIcon, UsersIcon, MedalIcon, GiftIcon } from "../components/icons";

/* ---------------- field definitions ---------------- */

const poojaFields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", placeholder: "Rin Mukti (Karz Mukti Hanuman) Puja" },
  { name: "category", label: "Category", type: "select", options: POOJA_CATEGORIES },
  { name: "badge", label: "Banner text", type: "text", placeholder: "Upcoming Puja • Limited Slots" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "venue", label: "Venue / Location", type: "text", placeholder: "Pardeshwar Mandir, Ujjain" },
  { name: "date", label: "Date (shown on card)", type: "text", placeholder: "21 June 2026" },
  { name: "eventDate", label: "Event date (for countdown)", type: "date", optional: true, hint: "Optional — set to show a live countdown on the card." },
  { name: "accent", label: "Cover colours", type: "colorPair" },
  { name: "image", label: "Cover image", type: "image", optional: true, hint: "Upload an image, or paste a URL. Leave blank for the coloured placeholder." },
];

const reportFields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", placeholder: "Career & Business Report" },
  { name: "tagline", label: "Tagline", type: "text", placeholder: "Find your right direction" },
  { name: "price", label: "Price", type: "text", placeholder: "₹1,499" },
  { name: "badge", label: "Badge", type: "text", optional: true, placeholder: "Most Popular" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "highlights", label: "Highlights", type: "list", placeholder: "One highlight per line" },
  { name: "accent", label: "Cover colours", type: "colorPair" },
  { name: "image", label: "Cover image", type: "image", optional: true, hint: "Upload an image, or paste a URL." },
];

const courseFields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", placeholder: "Vedic Astrology Foundation" },
  { name: "category", label: "Category", type: "select", options: COURSE_CATEGORIES },
  { name: "level", label: "Level", type: "text", placeholder: "Beginner / Intermediate / Advanced" },
  { name: "lessons", label: "Lessons / Length", type: "text", placeholder: "14 lessons · 8h" },
  { name: "price", label: "Price", type: "text", placeholder: "₹2,999" },
  { name: "badge", label: "Badge", type: "text", optional: true, placeholder: "Bestseller" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "videoUrl", label: "Recorded session", type: "video", optional: true, hint: "Upload a video file, or paste a YouTube / Vimeo / Drive / MP4 link." },
  { name: "thumbnail", label: "Thumbnail image", type: "image", optional: true, hint: "Upload an image, or paste a URL." },
  { name: "accent", label: "Cover colours", type: "colorPair" },
];

const consultationFields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", placeholder: "Career & Business Consultation" },
  { name: "price", label: "Price", type: "text", placeholder: "₹999" },
  { name: "duration", label: "Duration", type: "text", placeholder: "30 mins" },
  { name: "mode", label: "Mode", type: "text", placeholder: "Video / Call" },
  { name: "badge", label: "Badge", type: "text", optional: true, placeholder: "Most Popular" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "accent", label: "Accent colours", type: "colorPair" },
  { name: "image", label: "Image", type: "image", optional: true, hint: "Optional — upload or paste a URL." },
];

const blankPooja = (): Pooja => ({
  id: newId("pooja"),
  title: "",
  category: "Upcoming",
  description: "",
  venue: "",
  date: "",
  eventDate: "",
  accent: ["#B23A2E", "#6E1C16"],
  badge: "Upcoming Puja • Limited Slots",
  image: "",
});

const blankReport = (): StoredReport => ({
  id: newId("report"),
  title: "",
  tagline: "",
  description: "",
  highlights: [],
  price: "",
  accent: ["#3B5BA9", "#1E2F66"],
  badge: "",
  image: "",
});

const blankCourse = (): Course => ({
  id: newId("course"),
  title: "",
  category: "Astrology",
  description: "",
  level: "Beginner",
  lessons: "",
  price: "",
  thumbnail: "",
  videoUrl: "",
  accent: ["#3B4FA0", "#1E2A66"],
  badge: "",
});

const heroFields: FieldDef[] = [
  { name: "title", label: "Headline", type: "text", placeholder: "Get Your Personalized Kundali Now!" },
  { name: "badge", label: "Badge", type: "text", placeholder: "Premium Personalized Report" },
  { name: "subtitle", label: "Subtitle", type: "textarea" },
  { name: "visual", label: "Right-side visual", type: "select", options: HERO_VISUALS },
  { name: "image", label: "Image", type: "image", optional: true, hint: "Upload the astrologer photo or book cover (PNG with transparent bg works best)." },
  { name: "primaryLabel", label: "Primary button text", type: "text", placeholder: "Book Consultation" },
  { name: "primaryHref", label: "Primary button link", type: "text", placeholder: "/book/consultation/quick" },
  { name: "secondaryLabel", label: "Secondary button text", type: "text", placeholder: "WhatsApp Now" },
  { name: "secondaryHref", label: "Secondary button link", type: "text", placeholder: "#contact" },
  { name: "stats", label: "Floating stat cards", type: "list", optional: true, hint: "For the astrologer slide. One per line as: value | label  (e.g. 15+ | Years Experience)" },
];

const blankHero = (): HeroSlide => ({
  id: newId("hero"),
  title: "",
  badge: "",
  subtitle: "",
  primaryLabel: "Book Consultation",
  primaryHref: "/book/consultation/quick",
  secondaryLabel: "WhatsApp Now",
  secondaryHref: "#contact",
  visual: "book",
  image: "",
  stats: [],
});

const addonFields: FieldDef[] = [
  { name: "title", label: "Add-on name", type: "text", placeholder: "Gemstone Recommendation" },
  { name: "price", label: "Price (₹)", type: "number", placeholder: "299" },
  { name: "description", label: "Description", type: "textarea" },
];

const blankAddon = (): Addon => ({
  id: newId("addon"),
  title: "",
  description: "",
  price: 0,
});

const galleryFields: FieldDef[] = [
  { name: "caption", label: "Caption", type: "text", placeholder: "Felicitated by CM Harish Rawat" },
  { name: "image", label: "Photo", type: "image", optional: true, hint: "Upload the award/recognition photo." },
  { name: "accent", label: "Placeholder colours", type: "colorPair" },
];

const blankGallery = (): GalleryItem => ({
  id: newId("photo"),
  title: "",
  image: "",
  accent: ["#B5651D", "#6E3A10"],
});

const blankConsultation = (): Consultation => ({
  id: newId("consult"),
  title: "",
  description: "",
  duration: "30 mins",
  mode: "Video / Call",
  price: "",
  accent: ["#6B3FA0", "#36205C"],
  badge: "",
  image: "",
});

type TabKey = "dashboard" | "hero" | "poojas" | "reports" | "courses" | "consultations" | "addons" | "gallery" | "slots" | "bookings";

const GridIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const NAV: { key: TabKey; label: string; icon: (p: { className?: string }) => ReactNode }[] = [
  { key: "dashboard", label: "Dashboard", icon: GridIcon },
  { key: "hero", label: "Hero Slides", icon: StarIcon },
  { key: "poojas", label: "Poojas", icon: OmIcon },
  { key: "consultations", label: "Consultations", icon: UsersIcon },
  { key: "courses", label: "Courses", icon: StarIcon },
  { key: "reports", label: "Reports", icon: MedalIcon },
  { key: "addons", label: "Add-ons", icon: GiftIcon },
  { key: "gallery", label: "Gallery", icon: GiftIcon },
  { key: "slots", label: "Slots", icon: GridIcon },
  { key: "bookings", label: "Bookings", icon: UsersIcon },
];

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<TabKey>("dashboard");

  const poojas = useCollection<Pooja>("poojas", DEFAULT_POOJAS);
  const reports = useCollection<StoredReport>("reports", DEFAULT_REPORTS);
  const courses = useCollection<Course>("courses", DEFAULT_COURSES);
  const consultations = useCollection<Consultation>("consultations", DEFAULT_CONSULTATIONS);
  const gallery = useCollection<GalleryItem>("gallery", DEFAULT_GALLERY);
  const addons = useCollection<Addon>("addons", DEFAULT_ADDONS);
  const hero = useCollection<HeroSlide>("hero", DEFAULT_HERO_SLIDES);

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setUnlocked(Boolean(d.authed)))
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  const signIn = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });
      if (res.ok) {
        setUnlocked(true);
        setPass("");
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Incorrect username or password");
      }
    } catch {
      setError("Could not reach the server");
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setUnlocked(false);
    setUser("");
    setPass("");
    setTab("dashboard");
  };

  /* ---------------- login screen ---------------- */
  if (!unlocked) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#1f1b44] px-5">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="h-1.5 bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500" />
            <form onSubmit={signIn} className="px-8 py-9">
              <div className="flex justify-center">
                <Logo variant="dark" />
              </div>
              <p className="mt-4 text-center text-sm text-ink/60">
                Please log in to streamline the cosmos.
              </p>

              <label className="mt-7 block text-sm font-semibold text-[#2b2a5a]">Username</label>
              <input
                autoFocus
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Enter username"
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#fafafc] px-4 py-3 text-sm text-ink outline-none focus:border-[#6b3fa0] focus:ring-2 focus:ring-[#6b3fa0]/20"
              />

              <label className="mt-5 block text-sm font-semibold text-[#2b2a5a]">Password</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-ink/15 bg-[#fafafc] px-4 py-3 text-sm text-ink outline-none focus:border-[#6b3fa0] focus:ring-2 focus:ring-[#6b3fa0]/20"
              />

              {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="mt-7 w-full rounded-xl bg-[#1f1b44] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2a2558] disabled:opacity-60"
              >
                {busy ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-white/55 transition-colors hover:text-white">
              ← Back to Website
            </a>
          </div>
          {checked && (
            <p className="mt-4 text-center text-xs text-white/30">
              Default: admin / rahul2026 — set ADMIN_USERNAME &amp; ADMIN_PASSWORD in .env.local
            </p>
          )}
        </div>
      </main>
    );
  }

  /* ---------------- panel ---------------- */
  const counts: Record<string, number> = {
    poojas: poojas.items.length,
    consultations: consultations.items.length,
    courses: courses.items.length,
    reports: reports.items.length,
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] md:flex">
      {/* sidebar */}
      <aside className="bg-[#1f1b44] text-white md:flex md:w-60 md:shrink-0 md:flex-col">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <MoonIcon className="h-6 w-6 text-amber-400" />
            <span className="font-serif text-xl font-bold">Admin</span>
          </div>
          <button onClick={logout} className="text-xs text-white/50 hover:text-white md:hidden">
            Logout
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-[#f97316] text-white shadow" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="m-3 hidden items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white md:flex"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Logout
        </button>
      </aside>

      {/* main */}
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl p-5 md:p-8">
          {tab === "dashboard" && <Dashboard counts={counts} onOpen={(k) => setTab(k)} />}
          {tab === "hero" && (
            <CollectionManager<HeroSlide> label="Hero Slides" items={hero.items} fields={heroFields} blank={blankHero} onChange={hero.save} onReset={hero.reset} previewHref="/" />
          )}
          {tab === "poojas" && (
            <CollectionManager<Pooja> label="Poojas" items={poojas.items} fields={poojaFields} blank={blankPooja} onChange={poojas.save} onReset={poojas.reset} previewHref="/online-pooja" />
          )}
          {tab === "reports" && (
            <CollectionManager<StoredReport> label="Reports" items={reports.items} fields={reportFields} blank={blankReport} onChange={reports.save} onReset={reports.reset} previewHref="/reports" />
          )}
          {tab === "courses" && (
            <CollectionManager<Course> label="Courses" items={courses.items} fields={courseFields} blank={blankCourse} onChange={courses.save} onReset={courses.reset} previewHref="/courses" />
          )}
          {tab === "consultations" && (
            <CollectionManager<Consultation> label="Consultations" items={consultations.items} fields={consultationFields} blank={blankConsultation} onChange={consultations.save} onReset={consultations.reset} previewHref="/consultation" />
          )}
          {tab === "addons" && (
            <CollectionManager<Addon> label="Add-ons" items={addons.items} fields={addonFields} blank={blankAddon} onChange={addons.save} onReset={addons.reset} previewHref="/book/report/quick" />
          )}
          {tab === "gallery" && (
            <CollectionManager<GalleryItem> label="Gallery" items={gallery.items} fields={galleryFields} blank={blankGallery} onChange={gallery.save} onReset={gallery.reset} previewHref="/" />
          )}
          {tab === "slots" && <SlotsManager />}
          {tab === "bookings" && <BookingsView />}
        </div>
      </main>
    </div>
  );
}

/* ---------------- dashboard overview ---------------- */

function Dashboard({
  counts,
  onOpen,
}: {
  counts: Record<string, number>;
  onOpen: (k: TabKey) => void;
}) {
  const cards: { key: TabKey; label: string; icon: (p: { className?: string }) => ReactNode; href: string }[] = [
    { key: "poojas", label: "Poojas", icon: OmIcon, href: "/online-pooja" },
    { key: "consultations", label: "Consultations", icon: UsersIcon, href: "/consultation" },
    { key: "courses", label: "Courses", icon: StarIcon, href: "/courses" },
    { key: "reports", label: "Reports", icon: MedalIcon, href: "/reports" },
  ];
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-ink">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-ink/55">Welcome back. Here&rsquo;s your content at a glance.</p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onOpen(key)}
            className="flex flex-col rounded-2xl border border-ink/10 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium text-ink/55">Total {label}</span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-orange-100 text-[#f97316]">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <span className="mt-3 font-serif text-4xl font-bold text-ink">{counts[key] ?? 0}</span>
            <span className="mt-2 text-xs font-semibold text-[#f97316]">Manage →</span>
          </button>
        ))}
      </div>

      <div className="mt-7 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-ink">Live pages</h2>
        <p className="mt-1 text-sm text-ink/55">Open the public pages your content powers.</p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {[
            ["Home", "/"],
            ["Online Puja", "/online-pooja"],
            ["Consultation", "/consultation"],
            ["Courses", "/courses"],
            ["Reports", "/reports"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-ink/15 px-4 py-2 text-sm font-medium text-ink/75 transition-colors hover:bg-ink/5"
            >
              {label} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
