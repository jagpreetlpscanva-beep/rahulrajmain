import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { CoursesHero } from "../components/sections/CoursesHero";
import { ScrollToTop } from "../components/ui/ScrollToTop";

export const metadata: Metadata = {
  title: "Courses & Recorded Sessions — Dr. Rahul Raj, Vedic Astrologer",
  description:
    "Self-paced video courses and recorded masterclasses in Vedic astrology, numerology, vastu, palmistry and spiritual practice.",
};

export default function CoursesPage() {
  return (
    <>
      <Navbar />
      <main>
        <CoursesHero />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
