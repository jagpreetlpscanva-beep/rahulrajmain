import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Temporary In-Memory Storage (Replace this with your MongoDB / Database Model)
// Example: import GemstoneModel from "@/models/Gemstone";
let gemstonesStore: any[] = [];

// GET: Fetch all gemstones
export async function GET() {
  try {
    // Optional Admin Check:
    // const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return NextResponse.json(gemstonesStore, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch gemstones" },
      { status: 500 }
    );
  }
}

// POST: Create a new gemstone
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const newGemstone = {
      _id: Date.now().toString(),
      ...body,
    };

    gemstonesStore.push(newGemstone);

    return NextResponse.json(newGemstone, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create gemstone" },
      { status: 500 }
    );
  }
}

// PUT: Update existing gemstone
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { _id, ...updateData } = body;

    const index = gemstonesStore.findIndex((g) => g._id === _id);
    if (index !== -1) {
      gemstonesStore[index] = { _id, ...updateData };
      return NextResponse.json(gemstonesStore[index], { status: 200 });
    }

    return NextResponse.json(
      { error: "Gemstone not found" },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update gemstone" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a gemstone
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID parameter missing" }, { status: 400 });
    }

    gemstonesStore = gemstonesStore.filter((g) => g._id !== id);

    return NextResponse.json(
      { message: "Gemstone deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete gemstone" },
      { status: 500 }
    );
  }
}
