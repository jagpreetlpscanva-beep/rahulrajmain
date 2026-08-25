import { NextResponse } from "next/server";

export async function GET() {
  const GEMSTONE_PRICES: Record<string, number[]> = {
    Moonga: [8000, 12000, 14000, 20000, 25000, 28000],
    Moti: [2500, 4500, 6500, 11500, 18000, 22000],
    Manik: [4500, 8500, 12000, 16500, 22500, 27000, 35000, 41000],
    Gomed: [5500, 8500, 12000, 15000, 20000],
    Neelam: [60000, 100000, 110000, 120000],
    "Neelam Upratna": [4000, 6000, 8000, 11000],
    Pukhraj: [60000, 80000, 100000, 130000, 150000],
    "Pukhraj Upratna": [3500, 4500, 5500, 6000],
    Opal: [15000, 25000, 30000, 35000, 40000],
    "Opal Upratna": [5500, 6500, 7000],
    Lahsuniya: [3000, 4500, 5500, 7500, 11000],
  };

  try {
    return NextResponse.json({
      success: true,
      data: GEMSTONE_PRICES,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch gemstones data" },
      { status: 500 }
    );
  }
}
