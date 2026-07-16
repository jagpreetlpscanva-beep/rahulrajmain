import type { Metadata } from "next";
import { PrescriptionPad } from "../components/prescription/PrescriptionPad";

export const metadata: Metadata = {
  title: "Prescription Pad — Dr. Rahul Raj Astro",
  robots: { index: false, follow: false },
};

export default function PrescriptionPadPage() {
  return <PrescriptionPad />;
}
