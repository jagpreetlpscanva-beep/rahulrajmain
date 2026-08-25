import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// MongoDB Connection helper inline
const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }
  return await mongoose.connect(MONGODB_URI);
}

// Token Schema/Model definition inline (prevents import errors)
const VerificationTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    expires: { type: Date },
  },
  { timestamps: true }
);

const VerificationToken =
  mongoose.models.VerificationToken ||
  mongoose.model("VerificationToken", VerificationTokenSchema);

// GET API Handler
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token parameter is missing" },
        { status: 400 }
      );
    }

    const verificationToken = await VerificationToken.findOne({ token });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Token verified successfully",
        data: verificationToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
