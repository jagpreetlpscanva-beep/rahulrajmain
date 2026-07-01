import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { readCollection } from "@/lib/contentRepo";
import { DEFAULT_BLOG, slugify, type BlogPost } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Astrology Blog — Dr. Rahul Raj, Vedic Astrologer",
  description:
    "Vedic astrology insights, muhurat guides, kundli tips and remedies from Dr. Rahul Raj, Lucknow.",
  alternates: { canonical: "/blog" },
};

function fmt(d: string) {
  try {
    return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return d;
  }
}

export default async function BlogPage() {
  let posts: BlogPost[] = DEFAULT_BLOG;
  try {
    const data = (await readCollection("blog")) as BlogPost[];
    if (Array.isArray(data) && data.length) posts = data;
  } catch {
    /* fall back to defaults */
  }
  const published = posts
    .filter((p) => p.status === "Published")
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <>
      <Navbar />
      <main className="bg-[#FCF8F2]">
        <section className="relative overflow-hidden pt-24 lg:pt-28">
          <div className="pointer-events-none absolute left-1/2 top-6 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-400/15 blur-3xl" />
          <div className="container-px relative pb-8 text-center lg:pb-10">
            <span className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold-600">
              ✦ Astrology Blog ✦
            </span>
            <h1 className="mx-auto mt-3 max-w-2xl font-serif text-3xl font-bold leading-[1.12] text-ink sm:text-4xl lg:text-5xl">
              Vedic <span className="text-gold-600">Insights &amp; Guides</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
              Muhurat guides, kundli tips, doshas and remedies — written by Dr. Rahul Raj.
            </p>
          </div>
        </section>

        <section className="container-px mb-20 lg:mb-24">
          {published.length === 0 ? (
            <p className="py-16 text-center text-ink/55">No posts yet. Check back soon.</p>
          ) : (
            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {published.map((p) => {
                const slug = p.slug || slugify(p.title);
                return (
                  <Link key={p.id} href={`/blog/${slug}`} className="group flex flex-col overflow-hidden rounded-3xl border border-gold-500/15 bg-white shadow-[0_14px_40px_-26px_rgba(120,80,20,0.45)] transition-transform hover:-translate-y-1.5">
                    <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-gold-100 to-[#FBF1D9]">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="grid h-full place-items-center text-4xl text-gold-500/60">✦</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {p.category && <span className="text-[0.65rem] font-bold uppercase tracking-wider text-gold-600">{p.category}</span>}
                      <h2 className="mt-1 font-serif text-lg font-bold leading-snug text-ink">{p.title}</h2>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/60">{p.excerpt}</p>
                      <span className="mt-3 text-xs text-ink/45">{fmt(p.date)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
