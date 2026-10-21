"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-6xl mx-auto px-6 text-graphite">Завантаження...</div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-serif text-darkBrown hover:text-caramel transition">
          Українська мова
        </Link>
        
        {session ? (
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-brown hover:text-caramel transition">Головна</Link>
              <Link href="/videos" className="text-brown hover:text-caramel transition">Відеоуроки</Link>
              <Link href="/presentations" className="text-brown hover:text-caramel transition">Презентації</Link>
              <Link href="/news" className="text-brown hover:text-caramel transition">Новини</Link>
              
              {session.user?.role === "ADMIN" && (
                <Link href="/admin" className="text-caramel font-semibold hover:text-lightBrown transition">
                  Адмін-панель
                </Link>
              )}
            </nav>
            
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
            >
              Вийти
            </button>
          </div>
        ) : (
          <Link 
            href="/login" 
            className="px-4 py-2 bg-caramel text-white rounded-lg hover:bg-lightBrown transition text-sm font-medium"
          >
            Увійти
          </Link>
        )}
      </div>
    </header>
  );
}