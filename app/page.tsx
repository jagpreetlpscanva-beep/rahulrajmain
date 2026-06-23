import { Navbar } from "./components/Navbar";
import { Hero } from "./components/sections/Hero";
import { FeatureTiles } from "./components/sections/FeatureTiles";
import { ConsultationBooking } from "./components/sections/ConsultationBooking";
import { Panchang } from "./components/sections/Panchang";
import { Tools } from "./components/sections/Tools";
import { ReportsGrid } from "./components/sections/ReportsGrid";
import { CoursesGrid } from "./components/sections/CoursesGrid";
import { Gallery } from "./components/sections/Gallery";
import { Testimonials } from "./components/sections/Testimonials";
import { Footer } from "./components/sections/Footer";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { ConsultationPopup } from "./components/ui/ConsultationPopup";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* quick-access tiles peeking up below the hero */}
        <FeatureTiles />
        {/* book a personal consultation (slots editable in admin) */}
        <ConsultationBooking />
        {/* panchang (left) + kundali generator (right) */}
        <Panchang />
        {/* calculators */}
        <Tools />
        {/* reports */}
        <ReportsGrid />
        {/* courses */}
        <CoursesGrid />
        {/* awards & recognition (auto-scrolling) */}
        <Gallery />
        <Testimonials />
      </main>
      <Footer />
      <ScrollToTop />
      <ConsultationPopup />
    </>
  );
}
