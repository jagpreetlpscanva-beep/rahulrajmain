import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { PoojaGrid } from "../components/sections/PoojaGrid";
import { ScrollToTop } from "../components/ui/ScrollToTop";

export const metadata: Metadata = {
  title: "Online Puja Services — Rahul Raj, Vedic Astrologer",
  description:
    "Book authentic online pujas performed on your behalf by certified pandits — Grah Shanti, Dosh Nivaran, Vrat, festival and personalized pujas with sankalp in your name.",
};

export default function OnlinePoojaPage() {
  return (
    <>
      <Navbar />
      <main className="relative bg-[#FCF8F2] pt-20 lg:pt-24">
        {/* categorized puja cards */}
        <PoojaGrid />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
