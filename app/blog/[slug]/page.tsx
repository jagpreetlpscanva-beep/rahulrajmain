import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/sections/Footer";
import { ScrollToTop } from "../../components/ui/ScrollToTop";
import { readCollection } from "@/lib/contentRepo";
import { DEFAULT_BLOG, slugify, type BlogPost } from "@/lib/cms";

export const dynamic = "force-dynamic";

const SITE = "https://astrorahulraj.in";

async function getPosts(): Promise<BlogPost[]> {
  try {
    const data = (await readCollection("blog")) as BlogPost[];
    if (Array.isArray(data) && data.length) return data;
  } catch {
    /* fall back */
  }
  return DEFAULT_BLOG;
}

function findPost(posts: BlogPost[], slug: string) {
  return posts.find((p) => (p.slug || slugify(p.title)) === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(await getPosts(), slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} — Dr. Rahul Raj`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE}/blog/${slug}`,
      type: "article",
      images: post.image ? [post.image] : undefined,
    },
  };
}

function fmt(d: string) {
  try {
    return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return d;
  }
}

/** Render plain-text content: blank line = paragraph, "## " = heading, "- " = bullet. */
function renderContent(content: string) {
  const blocks = content.split(/\n\s*\n/);
  return blocks.map((block, i) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.every((l) => l.startsWith("- "))) {
      return (
        <ul key={i} className="my-3 list-disc space-y-1.5 pl-5 text-ink/75">
          {lines.map((l, j) => <li key={j}>{l.replace(/^-\s+/, "")}</li>)}
        </ul>
      );
    }
    if (lines.length === 1 && lines[0].startsWith("## ")) {
      return <h2 key={i} className="mt-8 font-serif text-2xl font-bold text-ink">{lines[0].replace(/^##\s+/, "")}</h2>;
    }
    return <p key={i} className="my-3 leading-relaxed text-ink/75">{block.trim()}</p>;
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = findPost(posts, slug);
  if (!post || post.status !== "Published") notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image ? (post.image.startsWith("http") ? post.image : `${SITE}${post.image}`) : undefined,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author || "Dr. Rahul Raj" },
    publisher: { "@type": "Organization", name: "Dr. Rahul Raj — Vedic Astrologer", "@id": `${SITE}/#business` },
    mainEntityOfPage: `${SITE}/blog/${slug}`,
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <Navbar />
      <main className="bg-[#FCF8F2]">
        <article className="container-px pt-24 lg:pt-28">
          <div className="mx-auto max-w-3xl">
            <Link href="/blog" className="text-sm text-ink/55 hover:text-gold-700">← All posts</Link>
            {post.category && <p className="mt-5 text-[0.7rem] font-bold uppercase tracking-wider text-gold-600">{post.category}</p>}
            <h1 className="mt-1 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl">{post.title}</h1>
            <p className="mt-3 text-sm text-ink/50">{post.author} · {fmt(post.date)}</p>

            {post.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.image} alt={post.title} className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover" />
            )}

            <div className="mt-6 text-[15px] sm:text-base">{renderContent(post.content)}</div>

            <div className="my-10 rounded-2xl border border-gold-500/20 bg-gradient-to-r from-gold-50 to-[#FBF1D9] p-6 text-center">
              <p className="font-serif text-xl font-bold text-ink">Need personal guidance?</p>
              <p className="mt-1 text-sm text-ink/65">Book a consultation with Dr. Rahul Raj — in person in Lucknow or online.</p>
              <a href="/book/consultation/quick" className="mt-4 inline-block rounded-xl bg-gold-gradient px-6 py-3 text-sm font-bold text-night shadow-gold-btn">
                Book Consultation →
              </a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
