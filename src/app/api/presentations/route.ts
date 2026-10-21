import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  console.log("🔍 Запит на отримання презентацій, status:", status);

  const whereClause = status === "ALL" ? {} : { status: "PUBLISHED" };

  try {
    const presentations = await db.presentation.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    console.log(`✅ Знайдено презентацій: ${presentations.length}`);
    return NextResponse.json(presentations);
  } catch (error) {
    console.error("❌ Помилка в GET /api/presentations:", error);
    return NextResponse.json({ error: "Помилка бази даних" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Немає доступу" }, { status: 403 });
  }

  try {
    const body = await req.json();
    console.log("📥 Отримані дані для збереження презентації:", body);
    
    const presentation = await db.presentation.create({
      data: {
        title: body.title,
        description: body.description || "",
        classLevel: body.classLevel || "",
        topic: body.topic || "",
        fileType: body.fileType || "PDF",
        fileUrl: body.fileUrl || "",
        status: body.status || "DRAFT",
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,
      },
    });
    console.log("✅ Презентацію успішно збережено з ID:", presentation.id);
    return NextResponse.json(presentation);
  } catch (error) {
    console.error("❌ Помилка при збереженні презентації:", error);
    return NextResponse.json({ error: "Помилка збереження" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Немає доступу" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID не вказано" }, { status: 400 });

  try {
    const body = await req.json();
    const presentation = await db.presentation.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description || "",
        classLevel: body.classLevel || "",
        topic: body.topic || "",
        fileType: body.fileType || "PDF",
        fileUrl: body.fileUrl || "",
        status: body.status || "DRAFT",
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,
      },
    });
    console.log("✅ Презентацію оновлено:", presentation.id);
    return NextResponse.json(presentation);
  } catch (error) {
    console.error("❌ Помилка оновлення:", error);
    return NextResponse.json({ error: "Помилка оновлення" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Немає доступу" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID не вказано" }, { status: 400 });

  try {
    await db.presentation.delete({ where: { id } });
    console.log("✅ Презентацію видалено:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Помилка видалення:", error);
    return NextResponse.json({ error: "Помилка видалення" }, { status: 500 });
  }
}