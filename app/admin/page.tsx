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
  DEFAULT_ARC_TILES,
  type ArcTile,
  DEFAULT_PODCASTS,
  type Podcast,
  DEFAULT_DECOR,
  type DecorItem,
  DEFAULT_COUPONS,
  type Coupon,
  DEFAULT_BLOG,
  type BlogPost,
} from "@/lib/adminStore";
import { CollectionManager, type FieldDef } from "../components/admin/CollectionManager";
import { SlotsManager } from "../components/admin/SlotsManager";
import { BookingsView } from "../components/admin/BookingsView";
import { MessagesView } from "../components/admin/MessagesView";
import { ReviewsManager } from "../components/admin/ReviewsManager";
import type { Booking } from "@/lib/bookings";
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
  { name: "title", label: "Title / Caption", type: "text", placeholder: "Jyotish Vibhushan — Amar Ujala" },
  { name: "image", label: "Photo", type: "image", optional: true, hint: "Upload the award/recognition photo." },
  { name: "accent", label: "Placeholder colours", type: "colorPair" },
];

const blankGallery = (): GalleryItem => ({
  id: newId("photo"),
  title: "",
  image: "",
  accent: ["#B5651D", "#6E3A10"],
});

const arcFields: FieldDef[] = [
  { name: "title", label: "Label", type: "text", placeholder: "Banner 1" },
  { name: "image", label: "Banner image", type: "image", optional: true, hint: "Upload your custom image for this tile." },
  { name: "href", label: "Link (optional)", type: "text", optional: true, placeholder: "#poojas or /book/pooja/..." },
  { name: "accent", label: "Placeholder colours", type: "colorPair" },
];

const blankArcTile = (): ArcTile => ({
  id: newId("arc"),
  title: "",
  image: "",
  accent: ["#8E2D22", "#4E140F"],
  href: "#poojas",
});

const podcastFields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", placeholder: "Astro Rahul Raj — Podcast" },
  { name: "videoUrl", label: "YouTube link", type: "video", hint: "Paste a YouTube link (youtu.be/… or youtube.com/watch?v=…)." },
  { name: "description", label: "Description", type: "textarea", optional: true },
];

const blankPodcast = (): Podcast => ({ id: newId("pod"), title: "", videoUrl: "", description: "" });

const couponFields: FieldDef[] = [
  { name: "title", label: "Coupon code", type: "text", placeholder: "WELCOME20", hint: "What customers type at checkout (case-insensitive)." },
  { name: "type", label: "Discount type", type: "select", options: ["Percent", "Flat"] },
  { name: "value", label: "Discount value", type: "number", hint: "Percent: e.g. 20 = 20% off. Flat: e.g. 100 = ₹100 off." },
  { name: "minAmount", label: "Minimum order (₹)", type: "number", optional: true, hint: "Leave 0 for no minimum." },
  { name: "expires", label: "Expiry date", type: "date", optional: true, hint: "Leave empty for no expiry. Coupon stops working after this date." },
  { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
];

const blankCoupon = (): Coupon => ({ id: newId("coupon"), title: "", type: "Percent", value: 10, status: "Active" });

const blogFields: FieldDef[] = [
  { name: "title", label: "Post title", type: "text", placeholder: "Best Marriage Muhurat in Lucknow 2026" },
  { name: "slug", label: "URL slug", type: "text", optional: true, hint: "Leave empty to auto-generate from the title. Shown in the link: /blog/your-slug" },
  { name: "category", label: "Category", type: "text", optional: true, placeholder: "Muhurat, Kundli, Vastu…" },
  { name: "excerpt", label: "Short summary", type: "textarea", hint: "1–2 lines shown on the blog list and in search results." },
  { name: "content", label: "Content", type: "textarea", hint: "Write freely. Blank line = new paragraph. Start a line with '## ' for a heading, '- ' for a bullet." },
  { name: "image", label: "Cover image", type: "image", optional: true },
  { name: "author", label: "Author", type: "text" },
  { name: "date", label: "Date", type: "date" },
  { name: "status", label: "Status", type: "select", options: ["Published", "Draft"] },
];

const blankBlog = (): BlogPost => ({
  id: newId("blog"),
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "Dr. Rahul Raj",
  date: new Date().toISOString().slice(0, 10),
  category: "",
  status: "Draft",
});

const decorFields: FieldDef[] = [
  { name: "title", label: "Label", type: "text", hint: "Which slot this image fills (do not change)." },
  { name: "image", label: "Decoration image", type: "image", optional: true, hint: "Transparent PNG works best (lotus, diya, books, etc.)." },
];

const blankDecor = (): DecorItem => ({ id: newId("decor"), title: "" });

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

type TabKey = "dashboard" | "hero" | "poojas" | "poojaBanner" | "reports" | "courses" | "podcasts" | "consultations" | "addons" | "gallery" | "decor" | "coupons" | "blog" | "reviews" | "slots" | "bookings" | "messages";

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
  { key: "poojaBanner", label: "Pooja Banner", icon: OmIcon },
  { key: "consultations", label: "Consultations", icon: UsersIcon },
  { key: "courses", label: "Courses", icon: StarIcon },
  { key: "podcasts", label: "Podcast", icon: StarIcon },
  { key: "reports", label: "Reports", icon: MedalIcon },
  { key: "addons", label: "Add-ons", icon: GiftIcon },
  { key: "gallery", label: "Gallery", icon: GiftIcon },
  { key: "decor", label: "Decorations", icon: GiftIcon },
  { key: "coupons", label: "Discounts", icon: GiftIcon },
  { key: "blog", label: "Blog", icon: MedalIcon },
  { key: "reviews", label: "Reviews", icon: StarIcon },
  { key: "slots", label: "Slots", icon: GridIcon },
  { key: "bookings", label: "Bookings", icon: UsersIcon },
  { key: "messages", label: "Messages", icon: UsersIcon },
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
  const poojaBanner = useCollection<ArcTile>("poojaBanner", DEFAULT_ARC_TILES);
  const podcasts = useCollection<Podcast>("podcasts", DEFAULT_PODCASTS);
  const decor = useCollection<DecorItem>("decor", DEFAULT_DECOR);
  const coupons = useCollection<Coupon>("coupons", DEFAULT_COUPONS);
  const blog = useCollection<BlogPost>("blog", DEFAULT_BLOG);

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
          {tab === "poojaBanner" && (
            <CollectionManager<ArcTile> label="Pooja Banner" items={poojaBanner.items} fields={arcFields} blank={blankArcTile} onChange={poojaBanner.save} onReset={poojaBanner.reset} previewHref="/online-pooja" />
          )}
          {tab === "gallery" && (
            <CollectionManager<GalleryItem> label="Gallery" items={gallery.items} fields={galleryFields} blank={blankGallery} onChange={gallery.save} onReset={gallery.reset} previewHref="/" />
          )}
          {tab === "podcasts" && (
            <CollectionManager<Podcast> label="Podcast" items={podcasts.items} fields={podcastFields} blank={blankPodcast} onChange={podcasts.save} onReset={podcasts.reset} previewHref="/" />
          )}
          {tab === "decor" && (
            <CollectionManager<DecorItem> label="Decoration" items={decor.items} fields={decorFields} blank={blankDecor} onChange={decor.save} onReset={decor.reset} previewHref="/courses" />
          )}
          {tab === "coupons" && (
            <CollectionManager<Coupon> label="Discount Coupons" items={coupons.items} fields={couponFields} blank={blankCoupon} onChange={coupons.save} onReset={coupons.reset} previewHref="/book/consultation/quick" />
          )}
          {tab === "blog" && (
            <CollectionManager<BlogPost> label="Blog Posts" items={blog.items} fields={blogFields} blank={blankBlog} onChange={blog.save} onReset={blog.reset} previewHref="/blog" />
          )}
          {tab === "reviews" && <ReviewsManager />}
          {tab === "slots" && <SlotsManager />}
          {tab === "bookings" && <BookingsView />}
          {tab === "messages" && <MessagesView />}
        </div>
      </main>
    </div>
  );
}

/* ---------------- dashboard overview ---------------- */

function fmtBookingDate(b: Booking) {
  const d = b.slotDate || b.createdAt?.slice(0, 10) || "";
  try {
    return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  } catch {
    return d;
  }
}

const BOOKING_STATUS_STYLE: Record<Booking["status"], string> = {
  new: "bg-amber-50 text-amber-700",
  completed: "bg-blue-50 text-blue-700",
  cancelled: "bg-rose-50 text-rose-700",
};

function Dashboard({ onOpen }: { counts: Record<string, number>; onOpen: (k: TabKey) => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<{ id: string; name: string; subject?: string; message: string; status: string; createdAt: string }[]>([]);
  useEffect(() => {
    fetch("/api/bookings", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setBookings(Array.isArray(d) ? d : []))
      .catch(() => {});
    fetch("/api/messages", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setMessages(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const revenue = bookings.reduce((s, b) => s + (Number(String(b.amount).replace(/[^\d.]/g, "")) || 0), 0);
  const pending = bookings.filter((b) => b.status === "new").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const newMessages = messages.filter((m) => m.status === "new").length;
  const recentMessages = messages.slice(0, 5);
  const upcoming = [...bookings]
    .sort((a, b) => (b.slotDate || b.createdAt || "").localeCompare(a.slotDate || a.createdAt || ""))
    .slice(0, 6);

  const stats = [
    { label: "Total Orders", value: String(bookings.length), icon: BagIcon },
    { label: "Total Revenue", value: `₹${revenue.toLocaleString("en-IN")}`, icon: ChartIcon },
    { label: "Pending Orders", value: String(pending), icon: ClockIcon },
    { label: "New Messages", value: String(newMessages), icon: UsersIcon },
    { label: "Completed Orders", value: String(completed), icon: CheckIcon },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-ink">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-ink/55">Welcome back. Here&rsquo;s what&rsquo;s happening today.</p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium text-ink/55">{label}</span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-orange-100 text-[#f97316]">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <span className="mt-3 block font-serif text-4xl font-bold text-ink">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-7 rounded-2xl border border-ink/10 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="font-serif text-lg font-bold text-ink">📅 Upcoming Service Bookings</h2>
          <button onClick={() => onOpen("bookings")} className="text-sm font-semibold text-[#7c3aed] hover:underline">
            Manage Bookings →
          </button>
        </div>
        {upcoming.length === 0 ? (
          <p className="px-6 py-10 text-center text-ink/50">No bookings yet.</p>
        ) : (
          <ul>
            {upcoming.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-4 border-b border-ink/5 px-6 py-4 last:border-0">
                <div className="min-w-0">
                  <p className="truncate font-bold text-ink">{b.name}</p>
                  <p className="text-sm text-ink/45">{b.phone}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-[#7c3aed]">{fmtBookingDate(b)}</p>
                  {b.slotTime && <p className="text-sm font-semibold text-[#f97316]">{b.slotTime}</p>}
                </div>
                <span className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${BOOKING_STATUS_STYLE[b.status]}`}>
                  {b.status === "new" ? "pending" : b.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-7 rounded-2xl border border-ink/10 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-ink">
            📨 New Messages
            {newMessages > 0 && (
              <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">{newMessages}</span>
            )}
          </h2>
          <button onClick={() => onOpen("messages")} className="text-sm font-semibold text-[#7c3aed] hover:underline">
            View Messages →
          </button>
        </div>
        {recentMessages.length === 0 ? (
          <p className="px-6 py-10 text-center text-ink/50">No messages yet.</p>
        ) : (
          <ul>
            {recentMessages.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-4 border-b border-ink/5 px-6 py-4 last:border-0">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 truncate font-bold text-ink">
                    {m.name}
                    {m.status === "new" && (
                      <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase text-white">new</span>
                    )}
                  </p>
                  <p className="truncate text-sm text-ink/45">{m.subject ? `${m.subject} — ` : ""}{m.message}</p>
                </div>
                <span className="shrink-0 text-xs text-ink/45">
                  {(() => { try { return new Date(m.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }); } catch { return ""; } })()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const BagIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
);
const ChartIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
);
const ClockIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
);
