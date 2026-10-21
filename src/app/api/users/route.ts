import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// Отримати список учнів (тільки для адміна)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Немає доступу" }, { status: 403 });
  }

  const students = await db.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(students);
}

// Створити нового учня (тільки для адміна)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Немає доступу" }, { status: 403 });
  }

  const body = await req.json();
  
  // Перевіряємо, чи існує такий email
  const existing = await db.user.findUnique({ where: { email: body.email } });
  if (existing) {
    return NextResponse.json({ error: "Користувач з такою поштою вже існує" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(body.password, 10);

  const student = await db.user.create({
    data: {
      email: body.email,
      passwordHash,
      name: body.name || "Учень",
      role: "STUDENT",
    },
  });

  return NextResponse.json({ success: true, student });
}

// Видалити учня (тільки для адміна)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Немає доступу" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID не вказано" }, { status: 400 });

  await db.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}