import Link from "next/link";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function PresentationViewPage({
  params,
}: {
  params: { id: string };
}) {
  const presentation = await db.presentation.findUnique({
    where: { id: params.id },
  });

  if (!presentation) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Верхня панель з кнопками */}
      <div className="bg-white border-b border-beige px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/presentations"
            className="inline-flex items-center text-caramel hover:text-lightBrown transition"
          >
            ← Назад до презентацій
          </Link>
          <div className="flex gap-3">
            <a
              href={presentation.fileUrl}
              download
              className="px-4 py-2 bg-caramel text-white rounded hover:bg-lightBrown transition text-sm font-medium"
            >
              📥 Завантажити PDF
            </a>
            <a
              href={presentation.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-brown text-brown rounded hover:bg-brown hover:text-white transition text-sm font-medium"
            >
              🔗 Відкрити в новій вкладці
            </a>
          </div>
        </div>
      </div>

      {/* Основний контент */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Інформація про презентацію */}
        <div className="mb-6">
          <h1 className="text-3xl font-serif text-darkBrown mb-3">
            {presentation.title}
          </h1>
          <div className="flex flex-wrap gap-3 mb-3">
            {presentation.classLevel && (
              <span className="text-sm bg-beige text-darkBrown px-3 py-1 rounded">
                {presentation.classLevel}
              </span>
            )}
            {presentation.topic && (
              <span className="text-sm bg-cream text-graphite px-3 py-1 rounded">
                {presentation.topic}
              </span>
            )}
          </div>
          {presentation.description && (
            <p className="text-graphite leading-relaxed">
              {presentation.description}
            </p>
          )}
        </div>

        {/* Перегляд PDF на всю ширину */}
        <div className="bg-white rounded-lg shadow-sm border border-beige overflow-hidden">
          <iframe
            src={presentation.fileUrl}
            className="w-full h-[900px]"
            title={presentation.title}
            style={{ border: 'none' }}
          ></iframe>
        </div>
      </div>
    </div>
  );
}