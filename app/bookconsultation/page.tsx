import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/sections/Footer";
import { BookConsultationGrid } from "../components/sections/BookConsultationGrid";

export const metadata: Metadata = {
  title: "Book Your Consultation — Dr. Rahul Raj, Vedic Astrologer",
  description:
    "Choose offline or online consultation with Dr. Rahul Raj. Pick a slot, pay securely, and get personalized Vedic guidance.",
};

export default function BookConsultationPage() {
  return (
    <>
      <Navbar />
      <main className="paper-bg min-h-screen px-5 pb-20 pt-32 lg:pt-40">
        <BookConsultationGrid />
      </main>
      <Footer />
    </>
  );
}
