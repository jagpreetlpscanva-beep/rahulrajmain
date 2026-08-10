import type { Metadata } from "next";
import { PrescriptionModule } from "../components/prescription/PrescriptionModule";

export const metadata: Metadata = {
  title: "Prescription Pad — Dr. Rahul Raj",
  robots: { index: false, follow: false },
};

export default function PrescriptionPadPage() {
  return <PrescriptionModule />;
}
