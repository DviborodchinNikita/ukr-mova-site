import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Адмін-панель",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          {/* Боковое меню */}
          <aside className="w-64 bg-darkBrown text-cream p-6">
            <h2 className="text-xl font-serif mb-8">Адмін-панель</h2>
            <nav className="space-y-3">
              <Link href="/admin" className="block hover:text-caramel">📊 Дашборд</Link>
              <Link href="/admin/videos" className="block hover:text-caramel">🎬 Відеоуроки</Link>
              <Link href="/admin/presentations" className="block hover:text-caramel">📊 Презентації</Link>
              <Link href="/admin/materials" className="block hover:text-caramel">📚 Матеріали</Link>
              <Link href="/admin/news" className="block hover:text-caramel">📰 Новини</Link>
              <Link href="/admin/about" className="block hover:text-caramel">👤 Про вчителя</Link>
              <Link href="/admin/contacts" className="block hover:text-caramel">📞 Контакти</Link>
              <Link href="/admin/students" className="block hover:text-caramel">👥 Учні</Link>
              <Link href="/admin/settings" className="block hover:text-caramel">⚙️ Налаштування</Link>
              <Link href="/" className="block mt-8 text-caramel">← На сайт</Link>
            </nav>
          </aside>
          <main className="flex-1 bg-cream p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}