import { REPORTS, type Report } from "./content";

/**
 * Server-safe content model + seed data (no "use client" — usable from both the
 * API route handlers and the client hook).
 */

export const POOJA_CATEGORIES = [
  "Upcoming",
  "Grah Shanti",
  "Vrat Online",
  "Festival Special",
  "Generic Puja",
  "Personalized Lagna",
  "Dosh Nivaran",
] as const;

export type PoojaCategory = (typeof POOJA_CATEGORIES)[number];

export interface Pooja {
  id: string;
  title: string;
  category: PoojaCategory;
  description: string;
  venue: string;
  /** Human-readable date shown on the card, e.g. "21 June 2026". */
  date: string;
  /** Optional ISO date (YYYY-MM-DD) — drives the live countdown when set. */
  eventDate?: string;
  image?: string;
  accent: [string, string];
  /** Banner text across the top of the card. */
  badge: string;
}

export type StoredReport = Report & { id: string };

const UJJAIN = "Pardeshwar Mandir, Ujjain";

export const DEFAULT_POOJAS: Pooja[] = [
  // ---- Upcoming ----
  {
    id: "pooja-rinmukti",
    title: "Rin Mukti (Karz Mukti Hanuman) Puja",
    category: "Upcoming",
    description: "To remove debts and financial obstacles with Hanuman's divine blessings.",
    venue: UJJAIN,
    date: "21 June 2026",
    eventDate: "2026-06-21",
    accent: ["#B23A2E", "#6E1C16"],
    badge: "Upcoming Puja • Limited Slots",
  },
  {
    id: "pooja-pitradosh",
    title: "Pitra Dosh Nivaran Puja",
    category: "Upcoming",
    description: "Resolve ancestral doshas and invite harmony & blessings into your home.",
    venue: "Ram Ghat, Ujjain",
    date: "18 June 2026",
    eventDate: "2026-06-18",
    accent: ["#C58A2E", "#7A4E12"],
    badge: "Upcoming Puja • Limited Slots",
  },
  {
    id: "pooja-sarvakarya",
    title: "Sarva Karya Siddhi Puja",
    category: "Upcoming",
    description: "For success in life, career, and spirituality. Remove blockages, delays and setbacks.",
    venue: UJJAIN,
    date: "20 June 2026",
    eventDate: "2026-06-20",
    accent: ["#A23B5B", "#5E1B33"],
    badge: "Upcoming Puja • Limited Slots",
  },

  // ---- Grah Shanti ----
  {
    id: "pooja-navagraha",
    title: "Navagraha Shanti Puja",
    category: "Grah Shanti",
    description: "Balance all nine planets in your chart to reduce obstacles and restore harmony.",
    venue: "Mahakaleshwar, Ujjain",
    date: "24 June 2026",
    eventDate: "2026-06-24",
    accent: ["#1F7A6B", "#0C3B34"],
    badge: "Grah Shanti • Limited Slots",
  },
  {
    id: "pooja-shani",
    title: "Shani Shanti Puja",
    category: "Grah Shanti",
    description: "Pacify Saturn to ease hardships, clear delays and steady your path.",
    venue: "Shani Mandir, Ujjain",
    date: "28 June 2026",
    eventDate: "2026-06-28",
    accent: ["#3A4A66", "#1B2436"],
    badge: "Grah Shanti • Limited Slots",
  },

  // ---- Vrat Online ----
  {
    id: "pooja-ekadashi",
    title: "Ekadashi Vrat Puja",
    category: "Vrat Online",
    description: "Observe Ekadashi with a guided sankalp for health, prosperity and inner peace.",
    venue: "Online · Sankalp in your name",
    date: "26 June 2026",
    eventDate: "2026-06-26",
    accent: ["#6B3FA0", "#36205C"],
    badge: "Vrat Online • Limited Slots",
  },
  {
    id: "pooja-pradosh",
    title: "Pradosh Vrat Puja",
    category: "Vrat Online",
    description: "Invoke Lord Shiva's blessings for peace, health and removal of sins.",
    venue: "Online · Sankalp in your name",
    date: "30 June 2026",
    accent: ["#2B6CB0", "#163E66"],
    badge: "Vrat Online • Limited Slots",
  },

  // ---- Festival Special ----
  {
    id: "pooja-gurupurnima",
    title: "Guru Purnima Special Puja",
    category: "Festival Special",
    description: "Honour your guru and seek wisdom, clarity and guidance for the year ahead.",
    venue: UJJAIN,
    date: "10 July 2026",
    eventDate: "2026-07-10",
    accent: ["#C08A2E", "#7A5212"],
    badge: "Festival Special • Limited Slots",
  },
  {
    id: "pooja-nagpanchami",
    title: "Nag Panchami Puja",
    category: "Festival Special",
    description: "Worship the serpent deities for protection, prosperity and family well-being.",
    venue: "Ujjain",
    date: "8 August 2026",
    eventDate: "2026-08-08",
    accent: ["#1F5A57", "#0E3331"],
    badge: "Festival Special • Limited Slots",
  },

  // ---- Generic Puja ----
  {
    id: "pooja-satyanarayan",
    title: "Satyanarayan Puja",
    category: "Generic Puja",
    description: "Invoke Lord Vishnu for prosperity, peace and the fulfilment of your wishes.",
    venue: "At your home / Online",
    date: "Any auspicious day",
    accent: ["#C58A2E", "#7A4E12"],
    badge: "Generic Puja • Book Anytime",
  },
  {
    id: "pooja-ganesh",
    title: "Ganesh Puja",
    category: "Generic Puja",
    description: "Remove obstacles and invite auspicious new beginnings into your life.",
    venue: "At your home / Online",
    date: "Any auspicious day",
    accent: ["#B23A2E", "#6E1C16"],
    badge: "Generic Puja • Book Anytime",
  },

  // ---- Personalized Lagna ----
  {
    id: "pooja-lagnadosh",
    title: "Lagna Dosha Nivaran Puja",
    category: "Personalized Lagna",
    description: "Strengthen your ascendant for confidence, direction and steady progress.",
    venue: UJJAIN,
    date: "On your personal muhurat",
    accent: ["#6B3FA0", "#36205C"],
    badge: "Personalized • Your Muhurat",
  },
  {
    id: "pooja-kundlimilan",
    title: "Kundli Milan Puja",
    category: "Personalized Lagna",
    description: "Harmonize horoscopes and seek blessings for a happy, lasting married life.",
    venue: "Online · Sankalp in your name",
    date: "On your personal muhurat",
    accent: ["#A23B5B", "#5E1B33"],
    badge: "Personalized • Your Muhurat",
  },

  // ---- Dosh Nivaran ----
  {
    id: "pooja-mangaldosh",
    title: "Mangal Dosha Nivaran Puja",
    category: "Dosh Nivaran",
    description: "Clear Mangal (Mars) dosha and remove delays and obstacles in marriage.",
    venue: "Ujjain",
    date: "22 June 2026",
    eventDate: "2026-06-22",
    accent: ["#B23A2E", "#6E1C16"],
    badge: "Dosh Nivaran • Limited Slots",
  },
  {
    id: "pooja-kaalsarp",
    title: "Kaal Sarp Dosh Nivaran Puja",
    category: "Dosh Nivaran",
    description: "Release the grip of Kaal Sarp dosha for a smoother, unobstructed life flow.",
    venue: "Trimbakeshwar",
    date: "25 June 2026",
    eventDate: "2026-06-25",
    accent: ["#1B6E5E", "#0C3B34"],
    badge: "Dosh Nivaran • Limited Slots",
  },
  {
    id: "pooja-rahuketu",
    title: "Rahu–Ketu Shanti Puja",
    category: "Dosh Nivaran",
    description: "Pacify the shadow planets to clear karmic blocks and restore clarity.",
    venue: "Ujjain",
    date: "27 June 2026",
    eventDate: "2026-06-27",
    accent: ["#3A4A66", "#1B2436"],
    badge: "Dosh Nivaran • Limited Slots",
  },
];

export const DEFAULT_REPORTS: StoredReport[] = REPORTS.map((r, i) => ({
  id: `report-${i + 1}`,
  ...r,
}));

/* ---------------- Courses ---------------- */

export const COURSE_CATEGORIES = [
  "Astrology",
  "Numerology",
  "Vastu",
  "Palmistry",
  "Spiritual",
] as const;
export type CourseCategory = (typeof COURSE_CATEGORIES)[number];

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  description: string;
  level: string;
  lessons: string;
  price: string;
  thumbnail?: string;
  /** Recorded-session link (YouTube/Vimeo/Drive/MP4). */
  videoUrl?: string;
  accent: [string, string];
  badge?: string;
  /** Optional extras used by the redesigned courses grid — all optional so older records keep working. */
  rating?: number;
  reviewCount?: number;
  originalPrice?: string;
  certificate?: boolean;
  lifetimeAccess?: boolean;
  downloadableResources?: boolean;
  mobileFriendly?: boolean;
}

export const DEFAULT_COURSES: Course[] = [
  {
    id: "course-vedic-foundation",
    title: "Vedic Astrology Foundation",
    category: "Astrology",
    description: "Learn the fundamentals of Vedic astrology — houses, planets, signs and how to read a chart.",
    level: "Beginner",
    lessons: "14 lessons · 8h",
    price: "₹2,999",
    accent: ["#3B4FA0", "#1E2A66"],
    badge: "Bestseller",
    rating: 4.8,
    reviewCount: 128,
    certificate: true,
    lifetimeAccess: true,
    mobileFriendly: true,
  },
  {
    id: "course-predictive",
    title: "Predictive Astrology Mastery",
    category: "Astrology",
    description: "Master dashas, transits and yogas to make accurate, confident predictions.",
    level: "Advanced",
    lessons: "20 lessons · 12h",
    price: "₹5,499",
    accent: ["#6B3FA0", "#36205C"],
    rating: 4.9,
    reviewCount: 86,
    certificate: true,
    lifetimeAccess: true,
  },
  {
    id: "course-numerology-basics",
    title: "Numerology Basics",
    category: "Numerology",
    description: "Understand numbers and their powerful impact on your life and destiny.",
    level: "Beginner",
    lessons: "10 lessons · 5h",
    price: "₹1,999",
    accent: ["#1F7A6B", "#0C3B34"],
    rating: 4.6,
    reviewCount: 74,
    lifetimeAccess: true,
    mobileFriendly: true,
  },
  {
    id: "course-name-numerology",
    title: "Advanced Name Numerology",
    category: "Numerology",
    description: "Correct and design names for harmony, success and prosperity.",
    level: "Intermediate",
    lessons: "12 lessons · 6h",
    price: "₹3,499",
    accent: ["#2B6CB0", "#163E66"],
    rating: 4.7,
    reviewCount: 41,
    certificate: true,
  },
  {
    id: "course-vastu-home",
    title: "Vastu Shastra Masterclass",
    category: "Vastu",
    description: "Create positive energy in your space and attract health, wealth & peace.",
    level: "Intermediate",
    lessons: "16 lessons · 9h",
    price: "₹2,199",
    accent: ["#C08A2E", "#7A5212"],
    rating: 4.6,
    reviewCount: 52,
    lifetimeAccess: true,
    mobileFriendly: true,
  },
  {
    id: "course-vastu-business",
    title: "Vastu for Business",
    category: "Vastu",
    description: "Optimize your workplace layout for growth, focus and financial success.",
    level: "Intermediate",
    lessons: "11 lessons · 6h",
    price: "₹3,999",
    accent: ["#A23B5B", "#5E1B33"],
    rating: 4.5,
    reviewCount: 33,
  },
  {
    id: "course-palmistry-essentials",
    title: "Palmistry – The Complete Guide",
    category: "Palmistry",
    description: "Learn the art of palm reading and decode the secrets of hand lines.",
    level: "Intermediate",
    lessons: "18 lessons · 10h",
    price: "₹2,499",
    accent: ["#B23A2E", "#6E1C16"],
    rating: 4.7,
    reviewCount: 64,
    certificate: true,
    downloadableResources: true,
  },
  {
    id: "course-palmistry-advanced",
    title: "Advanced Palm Reading",
    category: "Palmistry",
    description: "Go deeper into signs, timing and combinations for precise readings.",
    level: "Advanced",
    lessons: "14 lessons · 7h",
    price: "₹3,299",
    accent: ["#3A4A66", "#1B2436"],
    rating: 4.6,
    reviewCount: 28,
  },
  {
    id: "course-mantra-meditation",
    title: "Spiritual Growth & Meditation",
    category: "Spiritual",
    description: "Elevate your consciousness and connect with your higher self.",
    level: "All levels",
    lessons: "16 lessons · 6h",
    price: "₹1,499",
    accent: ["#1F5A57", "#0E3331"],
    badge: "New",
    rating: 4.8,
    reviewCount: 47,
    lifetimeAccess: true,
    mobileFriendly: true,
  },
  {
    id: "course-chakra-healing",
    title: "Chakra Healing & Balancing",
    category: "Spiritual",
    description: "Understand the seven chakras and techniques to cleanse and balance your energy.",
    level: "Intermediate",
    lessons: "12 lessons · 6h",
    price: "₹2,799",
    accent: ["#8E2D22", "#4E140F"],
    rating: 4.5,
    reviewCount: 22,
  },
  {
    id: "course-kp-astrology",
    title: "KP Astrology Advanced",
    category: "Astrology",
    description: "Learn Krishnamurti Paddhati (KP) for precise predictions.",
    level: "Advanced",
    lessons: "18 lessons · 11h",
    price: "₹4,799",
    accent: ["#1F7A4A", "#0C3B22"],
    rating: 4.8,
    reviewCount: 39,
    certificate: true,
  },
  {
    id: "course-remedies-healing",
    title: "Remedies & Planetary Healing",
    category: "Astrology",
    description: "Simple and effective remedies to reduce doshas and attract blessings.",
    level: "Beginner",
    lessons: "10 lessons · 5h",
    price: "₹1,999",
    accent: ["#C0512E", "#7A2E12"],
    rating: 4.7,
    reviewCount: 35,
    mobileFriendly: true,
  },
];

/* ---------------- Consultations ---------------- */

export interface Consultation {
  id: string;
  title: string;
  description: string;
  duration: string;
  mode: string;
  price: string;
  image?: string;
  accent: [string, string];
  badge?: string;
}

export const DEFAULT_CONSULTATIONS: Consultation[] = [
  {
    id: "offline-consultation",
    title: "Offline Consultation",
    description: "Meet Rahul Raj in person for a detailed, one-on-one consultation and direct guidance.",
    duration: "45 mins",
    mode: "In-Person Meeting",
    price: "₹500",
    accent: ["#A67320", "#5E4013"],
    badge: "In-Person",
  },
  {
    id: "online-consultation",
    title: "Online Consultation",
    description: "Connect with Rahul Raj from anywhere over a video call and get expert guidance.",
    duration: "30 mins",
    mode: "Virtual Meeting",
    price: "₹1,000",
    accent: ["#C8902C", "#82591A"],
    badge: "Virtual",
  },
  {
    id: "consult-life",
    title: "Complete Life Reading",
    description: "A full birth-chart consultation covering career, money, marriage, health and timing.",
    duration: "60 mins",
    mode: "Video / Call",
    price: "₹1,999",
    accent: ["#6B3FA0", "#36205C"],
    badge: "Most Popular",
  },
  {
    id: "consult-career",
    title: "Career & Business Consultation",
    description: "Find your right direction, ideal timing for jobs, switches and business moves.",
    duration: "30 mins",
    mode: "Video / Call",
    price: "₹999",
    accent: ["#3B4FA0", "#1E2A66"],
  },
  {
    id: "consult-marriage",
    title: "Marriage & Relationship Consultation",
    description: "Compatibility, timing of marriage and remedies for lasting harmony.",
    duration: "30 mins",
    mode: "Video / Call",
    price: "₹999",
    accent: ["#A23B5B", "#5E1B33"],
  },
  {
    id: "consult-health",
    title: "Health & Wellness Consultation",
    description: "Sensitive periods for health and lifestyle guidance aligned to your chart.",
    duration: "30 mins",
    mode: "Video / Call",
    price: "₹899",
    accent: ["#1F7A6B", "#0C3B34"],
  },
  {
    id: "consult-wealth",
    title: "Wealth & Finance Consultation",
    description: "Map your wealth potential, auspicious windows and money remedies.",
    duration: "30 mins",
    mode: "Video / Call",
    price: "₹999",
    accent: ["#C08A2E", "#7A5212"],
  },
  {
    id: "consult-kundli",
    title: "Kundli (Birth Chart) Analysis",
    description: "An in-depth reading of your birth chart, doshas, yogas and remedies.",
    duration: "45 mins",
    mode: "Video / Call",
    price: "₹1,299",
    accent: ["#B23A2E", "#6E1C16"],
  },
  {
    id: "consult-muhurat",
    title: "Muhurat & Auspicious Timing",
    description: "Pick the most auspicious date and time for any important event.",
    duration: "20 mins",
    mode: "Chat / Call",
    price: "₹699",
    accent: ["#2B6CB0", "#163E66"],
  },
];

/* ---------------- Gallery (awards & recognition) ---------------- */

export interface GalleryItem {
  id: string;
  /** Caption shown on the photo. */
  title: string;
  /** Upload a photo in the admin and its URL is stored here. */
  image?: string;
  accent: [string, string];
}

export const DEFAULT_GALLERY: GalleryItem[] = [
  { id: "g1", title: "Jyotish Bhushan — Amar Ujala Jyotish Mahakumbh 2017", accent: ["#B5651D", "#6E3A10"] },
  { id: "g2", title: "Felicitated by CM Harish Rawat — Jyotish Shree", accent: ["#8E2D22", "#4E140F"] },
  { id: "g3", title: "Honoured by Dr. Dinesh Sharma", accent: ["#6B3FA0", "#36205C"] },
  { id: "g4", title: "Jyotish Vibhushan — Amar Ujala (CM Trivendra Singh Rawat)", accent: ["#1F7A6B", "#0C3B34"] },
  { id: "g5", title: "Felicitation ceremony with dignitaries", accent: ["#C08A2E", "#7A5212"] },
];

/* ---------------- Consultation slots ---------------- */

export interface Slot {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  /** e.g. "10:30 AM" */
  time: string;
  booked?: boolean;
  /** Which consultation mode this slot is for. Defaults to "online" if unset. */
  type?: "online" | "offline";
}

export const DEFAULT_SLOTS: Slot[] = [
  { id: "s1", date: "2026-06-18", time: "10:30 AM" },
  { id: "s2", date: "2026-06-18", time: "11:30 AM" },
  { id: "s3", date: "2026-06-18", time: "04:00 PM" },
  { id: "s4", date: "2026-06-19", time: "10:30 AM" },
  { id: "s5", date: "2026-06-19", time: "12:30 PM" },
  { id: "s6", date: "2026-06-19", time: "05:00 PM" },
  { id: "s7", date: "2026-06-20", time: "11:00 AM" },
  { id: "s8", date: "2026-06-20", time: "03:00 PM" },
];

/* ---------------- Hero slides (carousel) ---------------- */

export const HERO_VISUALS = ["astrologer", "book"] as const;
export type HeroVisual = (typeof HERO_VISUALS)[number];

export interface HeroSlide {
  id: string;
  /** Headline (wraps across lines). */
  title: string;
  badge: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  visual: HeroVisual;
  /** Upload an image in the admin (served from /api/uploads) or use a /public path. */
  image?: string;
  /** Floating credibility cards — "value | label" per entry (astrologer slide). */
  stats?: string[];
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "hero-1",
    title: "The Right Timing Changes Everything",
    badge: "Vedic Astrology & Spiritual Guidance",
    subtitle:
      "Personalized Vedic guidance for your career, relationships, business and overall well-being.",
    primaryLabel: "Book Consultation",
    primaryHref: "/book/consultation/quick",
    secondaryLabel: "WhatsApp Now",
    secondaryHref: "#contact",
    visual: "astrologer",
    image: "/hero-astrologer.png",
    stats: ["15+ | Years Experience", "40k+ | Consultations", "4.9/5 | Rating"],
  },
  {
    id: "hero-2",
    title: "Get Your Personalized Kundali Now!",
    badge: "Premium Personalized Report",
    subtitle:
      "A detailed, accurate and fully personalized Janam Kundli, hand-prepared by Astro Rahul Raj.",
    primaryLabel: "Get My Kundli",
    primaryHref: "/book/report/quick",
    secondaryLabel: "Talk to Astrologer",
    secondaryHref: "/book/consultation/quick",
    visual: "book",
    image: "/hero-kundli.png",
  },
  {
    id: "hero-3",
    title: "Get Your Career & Business Report Now",
    badge: "Premium Report",
    subtitle:
      "Find your right direction with a focused, strategic career & business report for lasting success.",
    primaryLabel: "Get My Report",
    primaryHref: "/book/report/quick",
    secondaryLabel: "Book a Consultation",
    secondaryHref: "/book/consultation/quick",
    visual: "book",
    image: "/hero-career.png",
  },
];

/* ---------------- Add-ons (upsells shown at checkout) ---------------- */

export interface Addon {
  id: string;
  title: string;
  description: string;
  /** Numeric amount in ₹ (added to the order total). */
  price: number;
}

export const DEFAULT_ADDONS: Addon[] = [
  { id: "addon-gem", title: "Gemstone Recommendation", description: "Personalized lucky gemstone with wearing method.", price: 299 },
  { id: "addon-remedies", title: "Detailed Remedies PDF", description: "Mantras, donations and rituals tailored to your chart.", price: 199 },
  { id: "addon-express", title: "Express Delivery (24 hrs)", description: "Get your report within 24 hours.", price: 149 },
  { id: "addon-call", title: "15-min Explanation Call", description: "A short call to walk you through your report.", price: 499 },
];

/** Custom image tiles for the Online Puja page hero (the fanned-out arc). */
export interface ArcTile {
  id: string;
  title: string;
  image?: string;
  accent: [string, string];
  /** Optional link when the tile is clicked. */
  href?: string;
}

export const DEFAULT_ARC_TILES: ArcTile[] = [
  { id: "arc-1", title: "Banner 1", accent: ["#8E2D22", "#4E140F"], href: "#poojas" },
  { id: "arc-2", title: "Banner 2", accent: ["#B5651D", "#6E3A10"], href: "#poojas" },
  { id: "arc-3", title: "Banner 3", accent: ["#9A3324", "#5A1B12"], href: "#poojas" },
  { id: "arc-4", title: "Banner 4", accent: ["#B5651D", "#6E3A10"], href: "#poojas" },
  { id: "arc-5", title: "Banner 5", accent: ["#8E2D22", "#4E140F"], href: "#poojas" },
];

/** Customer reviews (submitted by visitors, moderated in admin). */
export interface Review {
  id: string;
  name: string;
  email?: string;
  location?: string;
  initials?: string;
  rating: number;
  text: string;
  status: "pending" | "approved" | "rejected";
  featured?: boolean;
  date: string;
}

export const DEFAULT_REVIEWS: Review[] = [
  { id: "rev-1", name: "Priya S.", location: "Mumbai", initials: "PS", rating: 5, text: "Rahul sir gave me the clarity I was looking for in my career. Highly grateful!", status: "approved", featured: true, date: "2026-05-27" },
  { id: "rev-2", name: "Rajat K.", location: "Delhi", initials: "RK", rating: 5, text: "His guidance helped me improve my business and take the right decisions.", status: "approved", date: "2026-05-25" },
  { id: "rev-3", name: "Neha & Amit", location: "Bengaluru", initials: "NA", rating: 5, text: "We got the solutions to our marriage problems. Thank you Rahul sir!", status: "approved", date: "2026-05-20" },
  { id: "rev-4", name: "Anjali M.", location: "Pune", initials: "AM", rating: 5, text: "Very accurate predictions and practical remedies. Truly life-changing!", status: "approved", date: "2026-05-14" },
];

/** Podcast / YouTube videos shown on the site. */
export interface Podcast {
  id: string;
  title: string;
  videoUrl: string;
  description?: string;
}

export const DEFAULT_PODCASTS: Podcast[] = [
  {
    id: "pod-1",
    title: "Astro Rahul Raj — Podcast",
    videoUrl: "https://youtu.be/kcQQeZlu208",
    description: "Watch our latest conversation on Vedic astrology, life and clarity.",
  },
];

/** Hero side decorations (lotus, diya, books, etc.) uploaded in admin. */
export interface DecorItem {
  id: string;
  title: string;
  image?: string;
}

export const DEFAULT_DECOR: DecorItem[] = [
  { id: "courses-left", title: "Courses hero — Left image" },
  { id: "courses-right", title: "Courses hero — Right image" },
  { id: "pooja-left", title: "Pooja hero — Left image" },
  { id: "pooja-right", title: "Pooja hero — Right image" },
];

/** Discount coupon usable at checkout. `title` is the coupon code. */
export interface Coupon {
  id: string;
  title: string; // the coupon CODE (case-insensitive)
  type: "Percent" | "Flat";
  value: number; // % when Percent, ₹ amount when Flat
  minAmount?: number; // minimum order total to qualify
  expires?: string; // ISO date (YYYY-MM-DD); empty = never expires
  status: "Active" | "Disabled";
}

export const DEFAULT_COUPONS: Coupon[] = [
  { id: "coupon-welcome", title: "WELCOME20", type: "Percent", value: 20, status: "Active" },
];

/** Collections exposed by the CMS API, with their seed data. */
export const COLLECTIONS = {
  poojas: DEFAULT_POOJAS,
  reports: DEFAULT_REPORTS,
  courses: DEFAULT_COURSES,
  consultations: DEFAULT_CONSULTATIONS,
  gallery: DEFAULT_GALLERY,
  slots: DEFAULT_SLOTS,
  hero: DEFAULT_HERO_SLIDES,
  addons: DEFAULT_ADDONS,
  poojaBanner: DEFAULT_ARC_TILES,
  reviews: DEFAULT_REVIEWS,
  podcasts: DEFAULT_PODCASTS,
  decor: DEFAULT_DECOR,
  coupons: DEFAULT_COUPONS,
} as const;

export type CollectionKey = keyof typeof COLLECTIONS;

export function isCollectionKey(key: string): key is CollectionKey {
  return key in COLLECTIONS;
}

export function newId(prefix = "item") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}`;
}
