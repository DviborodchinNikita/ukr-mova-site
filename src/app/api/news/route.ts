import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  console.log("🔍 Запит на отримання новин, status:", status);

  const whereClause = status === "ALL" ? {} : { status: "PUBLISHED" };

  try {
    const news = await db.news.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    console.log(`✅ Знайдено новин: ${news.length}`);
    return NextResponse.json(news);
  } catch (error) {
    console.error("❌ Помилка в GET /api/news:", error);
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
    console.log("📥 Отримані дані для збереження новини:", body);
    
    const news = await db.news.create({
      data: {
        title: body.title,
        content: body.content || "",
        image: body.image || "",
        status: body.status || "DRAFT",
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,
      },
    });
    console.log("✅ Новину успішно збережено з ID:", news.id);
    return NextResponse.json(news);
  } catch (error) {
    console.error("❌ Помилка при збереженні новини:", error);
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
    const news = await db.news.update({
      where: { id },
      data: {
        title: body.title,
        content: body.content || "",
        image: body.image || "",
        status: body.status || "DRAFT",
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,
      },
    });
    console.log("✅ Новину оновлено:", news.id);
    return NextResponse.json(news);
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
    await db.news.delete({ where: { id } });
    console.log("✅ Новину видалено:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Помилка видалення:", error);
    return NextResponse.json({ error: "Помилка видалення" }, { status: 500 });
  }
}