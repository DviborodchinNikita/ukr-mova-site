import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123456";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Адміністратор вже існує");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "ADMIN",
      name: "Вчитель",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      siteName: "Українська мова — освітній простір",
      teacherName: "Ваше ім'я",
      welcomeTitle: "Вітаю на освітньому сайті!",
      welcomeText:
        "Тут ви знайдете навчальні матеріали, презентації, відеоуроки та корисні ресурси для вивчення української мови.",
    },
  });

  console.log("✅ Адміністратор створений:", email);
  console.log("⚠️  ОБОВ'ЯЗКОВО змініть пароль після першого входу!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());