import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { ConsultationHero } from "../components/sections/ConsultationHero";
import { Testimonials } from "../components/sections/Testimonials";
import { ConsultationGrid } from "../components/sections/ConsultationGrid";
import { ScrollToTop } from "../components/ui/ScrollToTop";

export const metadata: Metadata = {
  title: "Book a Consultation — Dr. Rahul Raj, Vedic Astrologer",
  description:
    "Talk to Dr. Rahul Raj and get clear, trusted answers to your biggest life questions — career, marriage, health, wealth and more. 100% private, one-on-one.",
};

export default function ConsultationPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* hero matching the reference: photo, ₹999 offer, stats, trust badges, feature row */}
        <ConsultationHero />
        {/* What people say about Dr. Rahul Raj */}
        <Testimonials />
        {/* consultation types to book */}
        <ConsultationGrid />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
