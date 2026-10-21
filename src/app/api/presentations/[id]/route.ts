import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const presentation = await db.presentation.findUnique({
      where: { id: params.id },
    });

    if (!presentation) {
      return NextResponse.json(
        { error: "Презентацію не знайдено" },
        { status: 404 }
      );
    }

    return NextResponse.json(presentation);
  } catch (error) {
    console.error("Помилка отримання презентації:", error);
    return NextResponse.json(
      { error: "Помилка бази даних" },
      { status: 500 }
    );
  }
}