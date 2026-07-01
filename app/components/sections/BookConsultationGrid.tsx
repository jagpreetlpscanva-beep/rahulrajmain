"use client";

import Link from "next/link";
import { useCollection, DEFAULT_CONSULTATIONS, type Consultation } from "@/lib/adminStore";

export function BookConsultationGrid() {
  const { items: consultations } = useCollection<Consultation>("consultations", DEFAULT_CONSULTATIONS);
  const offline = consultations.find((c) => c.id === "offline-consultation");
  const online = consultations.find((c) => c.id === "online-consultation");

  return (
    <div className="mx-auto max-w-6xl">
      {/* breadcrumb */}
      <p className="text-center text-sm text-ink/55">
        <Link href="/" className="hover:text-gold-700">Home</Link>
        <span className="mx-1.5">›</span>
        <Link href="/consultation" className="hover:text-gold-700">Consultation</Link>
        <span className="mx-1.5">›</span>
        <span className="text-ink/70">Book Consultation</span>
      </p>

      {/* heading */}
      <h1 className="mt-3 text-center font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-5xl">
        Book Your <span className="text-gold-600">Consultation</span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-sm text-ink/65 sm:text-base">
        Choose the mode that suits you best. Get personalized guidance from Dr. Rahul Raj and bring
        clarity to your questions.
      </p>

      {/* decorative strip — fully clear of the cards, no overlap possible */}
      <div className="pointer-events-none relative mx-auto hidden h-0 max-w-6xl xl:block">
        <img
          src="/decor/books-lotus.png"
          alt=""
          aria-hidden
          className="absolute -left-28 -top-[7.5rem] w-40 animate-float select-none"
        />
        <img
          src="/decor/diya.png"
          alt=""
          aria-hidden
          className="absolute -right-20 -top-[11rem] w-36 animate-float select-none"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* cards */}
      <div className="relative z-10 mt-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <ConsultationCard
            badge="OFFLINE"
            badgeColor="bg-gold-gradient text-night"
            imageSrc={offline?.image || OFFLINE_IMAGE}
            icon={<PinIcon />}
            title={offline?.title || "Offline Consultation"}
            subtitle="In-Person Meeting"
            description={offline?.description || "Meet personally for a detailed consultation and get direct, in-depth guidance."}
            points={["One-on-One Meeting", "Detailed Analysis", "Personalized Remedies"]}
            href="/book/consultation/offline-consultation"
          />
          <ConsultationCard
            badge="ONLINE"
            badgeColor="bg-gold-gradient text-night"
            imageSrc={online?.image || ONLINE_IMAGE}
            icon={<VideoIcon />}
            title={online?.title || "Online Consultation"}
            subtitle="Virtual Meeting"
            description={online?.description || "Connect from anywhere in the world and get expert guidance through a virtual session."}
            points={["Video Call Session", "Comfort of Your Space", "Detailed Guidance"]}
            href="/book/consultation/online-consultation"
          />
        </div>
      </div>

      {/* trust strip */}
      <div className="mt-10 grid grid-cols-2 gap-y-7 rounded-3xl border border-gold-500/20 bg-white p-7 shadow-card sm:grid-cols-4 sm:gap-4">
        <TrustItem icon={<ShieldIcon />} title="100% Confidential" body="Your privacy and trust are our priority." />
        <TrustItem icon={<CalendarIcon />} title="Flexible Scheduling" body="Choose a time that works best for you." />
        <TrustItem icon={<SupportIcon />} title="Dedicated Support" body="We are here to assist you at every step." />
        <TrustItem icon={<StarIcon />} title="Proven Guidance" body="Years of experience and satisfied clients." />
      </div>

      {/* help banner */}
      <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-gold-500/25 bg-gold-50/70 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-700">
            <HelpIcon />
          </span>
          <div>
            <p className="font-serif text-lg font-bold text-ink">Not sure which one to choose?</p>
            <p className="mt-1 text-sm text-ink/65">
              Both offline and online consultations are designed to provide you with the same
              level of clarity and accurate guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsultationCard({
  badge,
  badgeColor,
  imageSrc,
  icon,
  title,
  subtitle,
  description,
  points,
  href,
}: {
  badge: string;
  badgeColor: string;
  imageSrc: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-3xl border border-gold-500/20 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-gold-btn sm:flex-row"
    >
      <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-[42%]">
        <span className={`absolute left-3 top-3 z-10 rounded-md px-3 py-1 text-[0.65rem] font-bold tracking-wider ${badgeColor}`}>
          {badge}
        </span>
        <img
          src={imageSrc}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="grid h-11 w-11 place-items-center rounded-full border border-gold-300 bg-gold-50 text-gold-700 transition-transform duration-300 group-hover:scale-110 group-hover:bg-gold-100">
          {icon}
        </span>
        <h3 className="mt-3 font-serif text-xl font-bold text-ink">{title}</h3>
        <p className="text-sm font-semibold text-gold-700">{subtitle}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">{description}</p>

        <ul className="mt-3 space-y-1.5">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm text-ink/75">
              <CheckIcon /> {p}
            </li>
          ))}
        </ul>

        <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-gold-gradient px-6 py-3 text-xs font-semibold uppercase tracking-wider text-night shadow-gold-btn transition-transform duration-300 group-hover:scale-[1.04] group-hover:shadow-lg">
          Book {badge === "OFFLINE" ? "Offline" : "Online"} Consultation
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

function TrustItem({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-50 text-gold-700">
        {icon}
      </span>
      <div>
        <p className="font-serif text-sm font-bold text-ink">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-ink/60">{body}</p>
      </div>
    </div>
  );
}

const OFFLINE_IMAGE =
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop";
const ONLINE_IMAGE =
  "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=1200&auto=format&fit=crop";

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-gold-600" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5ZM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5Z" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" stroke="none">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" />
      <path d="M12 17h.01" />
    </svg>
  );
}
