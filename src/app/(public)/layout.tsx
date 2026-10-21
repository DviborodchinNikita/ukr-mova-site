import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Українська мова — освітній простір",
  description: "Навчальні матеріали для вивчення української мови",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className="h-full">
      <body className={`${inter.className} bg-cream flex flex-col min-h-screen`}>
        <Providers>
          <Header />
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="bg-darkBrown text-cream py-8 px-6 text-center">
            <p>© 2026 Українська мова — освітній простір. Всі права захищено.</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}