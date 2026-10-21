import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  let news: any[] = [];
  
  try {
    news = await db.news.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    console.error("Помилка завантаження новин:", error);
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-serif text-darkBrown mb-8">Новини та оголошення</h1>
      
      {news.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-beige text-center">
          <p className="text-graphite italic">Новин поки немає. Загляньте пізніше!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {news.map((newsItem: any) => (
            <article 
              key={newsItem.id} 
              className="bg-white rounded-lg shadow-sm border border-beige overflow-hidden hover:shadow-md transition"
            >
              {newsItem.image && (
                <div className="w-full bg-gray-100">
                  <img
                    src={newsItem.image}
                    alt={newsItem.title}
                    className="w-full h-auto"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs bg-beige text-darkBrown px-2 py-1 rounded">
                    {new Date(newsItem.publishedAt || newsItem.createdAt).toLocaleDateString("uk-UA")}
                  </span>
                </div>
                <h2 className="text-2xl font-serif text-darkBrown mb-3">{newsItem.title}</h2>
                <p className="text-graphite leading-relaxed whitespace-pre-line">{newsItem.content}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}