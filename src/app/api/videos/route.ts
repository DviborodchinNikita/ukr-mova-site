import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  console.log("🔍 Запит на отримання відео, status:", status);

  const whereClause = status === "ALL" ? {} : { status: "PUBLISHED" };

  try {
    const videos = await db.video.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    console.log(`✅ Знайдено відео: ${videos.length}`);
    return NextResponse.json(videos);
  } catch (error) {
    console.error("❌ Помилка в GET /api/videos:", error);
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
    console.log("📥 Отримані дані для збереження:", body);
    
    const video = await db.video.create({
      data: {
        title: body.title,
        description: body.description || "",
        classLevel: body.classLevel || "",
        topic: body.topic || "",
        videoType: "YOUTUBE",
        videoUrl: body.videoUrl || "",
        status: body.status || "DRAFT",
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,
      },
    });
    console.log("✅ Відео успішно збережено з ID:", video.id);
    return NextResponse.json(video);
  } catch (error) {
    console.error("❌ Помилка при збереженні відео:", error);
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
    const video = await db.video.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description || "",
        classLevel: body.classLevel || "",
        topic: body.topic || "",
        videoUrl: body.videoUrl || "",
        status: body.status || "DRAFT",
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,
      },
    });
    console.log("✅ Відео оновлено:", video.id);
    return NextResponse.json(video);
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
    await db.video.delete({ where: { id } });
    console.log("✅ Відео видалено:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Помилка видалення:", error);
    return NextResponse.json({ error: "Помилка видалення" }, { status: 500 });
  }
}