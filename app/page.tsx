import { readCollection } from "@/lib/contentRepo";
import type { HeroSlide } from "@/lib/cms";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/sections/Hero";
import { FeatureTiles } from "./components/sections/FeatureTiles";
import { ConsultationBooking } from "./components/sections/ConsultationBooking";
import { Panchang } from "./components/sections/Panchang";
import { ExploreSection } from "./components/sections/ExploreSection";
import { OnlinePoojaSection } from "./components/sections/OnlinePoojaSection";
import { Gallery } from "./components/sections/Gallery";
import { Testimonials } from "./components/sections/Testimonials";
import { Footer } from "./components/sections/Footer";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { ConsultationPopup } from "./components/ui/ConsultationPopup";

export default async function Home() {
  let heroSlides: HeroSlide[] | undefined;
  try {
    heroSlides = (await readCollection("hero")) as HeroSlide[];
  } catch {
    /* fall back to defaults on the client */
  }
  return (
    <>
      <Navbar />
      <main>
        <Hero initialSlides={heroSlides} />
        {/* quick-access tiles peeking up below the hero */}
        <FeatureTiles />
        {/* online pooja (collapsed; slides open on click) */}
        <OnlinePoojaSection />
        {/* book a personal consultation (slots editable in admin) */}
        <ConsultationBooking />
        {/* panchang (left) + kundali generator (right) */}
        <Panchang />
        {/* reports + astrology tools + courses, with trust badges */}
        <ExploreSection />
        {/* awards & recognition (auto-scrolling) */}
        <Gallery />
        <Testimonials />
      </main>
      <Footer />
      <ScrollToTop />
      <ConsultationPopup initialSlides={heroSlides} />
    </>
  );
}
