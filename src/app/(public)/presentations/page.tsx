import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

// Разные градиенты для разнообразия
const gradients = [
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-purple-400 to-violet-500",
  "from-cyan-400 to-blue-500",
];

export default async function PresentationsPage() {
  let presentations = [];
  
  try {
    presentations = await db.presentation.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    console.error("Помилка завантаження презентацій:", error);
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-serif text-darkBrown mb-8">Презентації</h1>
      
      {presentations.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-beige text-center">
          <p className="text-graphite italic">Презентацій поки немає. Загляньте пізніше!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presentations.map((presentation: any, index: number) => {
            const gradient = gradients[index % gradients.length];
            return (
              <Link 
                key={presentation.id} 
                href={`/presentations/${presentation.id}`}
                className="bg-white rounded-lg shadow-sm border border-beige overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block group"
              >
                {/* Красивая обложка */}
                <div className={`aspect-video bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-6 relative overflow-hidden`}>
                  {/* Декоративные круги */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  {/* Иконка */}
                  <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    📊
                  </div>
                  
                  {/* Название на обложке */}
                  <h3 className="text-white text-lg font-semibold text-center line-clamp-2 drop-shadow-md">
                    {presentation.title}
                  </h3>
                </div>

                {/* Информация */}
                <div className="p-5">
                  <div className="flex gap-2 mb-2">
                    {presentation.classLevel && (
                      <span className="text-xs bg-beige text-darkBrown px-2 py-1 rounded">
                        {presentation.classLevel}
                      </span>
                    )}
                    {presentation.topic && (
                      <span className="text-xs bg-cream text-graphite px-2 py-1 rounded">
                        {presentation.topic}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-graphite line-clamp-2 mb-3">
                    {presentation.description || "Натисніть, щоб переглянути презентацію"}
                  </p>
                  <div className="text-caramel font-medium text-sm group-hover:text-lightBrown transition">
                    Переглянути →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}