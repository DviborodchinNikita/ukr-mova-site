import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "API працює" });
}

export async function POST() {
  return NextResponse.json({ message: "API працює" });
}