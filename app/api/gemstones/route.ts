import { NextResponse } from "next/server";

// Interface defining the Gemstone data structure
export interface GemstoneData {
  _id?: string;
  name: string;
  planet: string;
  rati: string;
  grade: string;
  mantra: string;
  day: string;
  finger: string;
  prices: number[];
}

// In-Memory Data Store (Replace with MongoDB / Database Model queries if using DB)
let gemstonesStore: GemstoneData[] = [
  {
    _id: "1",
    name: "Ruby (Manikyam)",
    planet: "Sun (Surya)",
    rati: "5.25 - 7 Rati",
    grade: "Natural / Unheated",
    mantra: "Om Suryaya Namah (108 times)",
    day: "Sunday Morning",
    finger: "Ring Finger (Right Hand)",
    prices: [3500, 7000, 11000],
  },
  {
    _id: "2",
    name: "Yellow Sapphire (Pukhraj)",
    planet: "Jupiter (Guru)",
    rati: "4.25 - 6 Rati",
    grade: "Ceylon Natural",
    mantra: "Om Gram Greem Groom Sah Gurave Namah",
    day: "Thursday Morning",
    finger: "Index Finger (Right Hand)",
    prices: [5100, 10500, 21000],
  },
];

// GET: Fetch all gemstone records
export async function GET() {
  try {
    return NextResponse.json(gemstonesStore, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch gemstones data." },
      { status: 500 }
    );
  }
}

// POST: Add a new gemstone record
export async function POST(req: Request) {
  try {
    const body: GemstoneData = await req.json();

    if (!body.name || !body.planet) {
      return NextResponse.json(
        { error: "Gemstone Name and Planet are required." },
        { status: 400 }
      );
    }

    const newGemstone: GemstoneData = {
      _id: Date.now().toString(),
      name: body.name,
      planet: body.planet,
      rati: body.rati || "",
      grade: body.grade || "",
      mantra: body.mantra || "",
      day: body.day || "",
      finger: body.finger || "",
      prices: body.prices || [],
    };

    gemstonesStore.push(newGemstone);

    return NextResponse.json(newGemstone, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create gemstone entry." },
      { status: 500 }
    );
  }
}

// PUT: Update an existing gemstone record
export async function PUT(req: Request) {
  try {
    const body: GemstoneData = await req.json();
    const { _id, ...updateFields } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "Gemstone ID is required for update." },
        { status: 400 }
      );
    }

    const index = gemstonesStore.findIndex((g) => g._id === _id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Gemstone not found." },
        { status: 404 }
      );
    }

    gemstonesStore[index] = {
      ...gemstonesStore[index],
      ...updateFields,
    };

    return NextResponse.json(gemstonesStore[index], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update gemstone entry." },
      { status: 500 }
    );
  }
}

// DELETE: Delete a gemstone by ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Gemstone ID parameter is missing." },
        { status: 400 }
      );
    }

    const initialLength = gemstonesStore.length;
    gemstonesStore = gemstonesStore.filter((g) => g._id !== id);

    if (gemstonesStore.length === initialLength) {
      return NextResponse.json(
        { error: "Gemstone not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Gemstone deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete gemstone entry." },
      { status: 500 }
    );
  }
}
