import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function VideosPage() {
  let videos: any[] = [];
  
  try {
    videos = await db.video.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    console.error("Помилка завантаження відео:", error);
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-serif text-darkBrown mb-8">Відеоуроки</h1>
      
      {videos.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-beige text-center">
          <p className="text-graphite italic">Відеоуроків поки немає. Загляньте пізніше!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video: any) => (
            <div key={video.id} className="bg-white rounded-lg shadow-sm border border-beige overflow-hidden hover:shadow-md transition">
              <div className="aspect-video bg-gray-200">
                {video.videoUrl ? (
                  <iframe
                    src={video.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-4xl">🎬</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex gap-2 mb-2">
                  {video.classLevel && (
                    <span className="text-xs bg-beige text-darkBrown px-2 py-1 rounded">
                      {video.classLevel}
                    </span>
                  )}
                  {video.topic && (
                    <span className="text-xs bg-cream text-graphite px-2 py-1 rounded">
                      {video.topic}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-darkBrown mb-2">{video.title}</h3>
                <p className="text-sm text-graphite line-clamp-2">{video.description}</p>
                {video.videoUrl && (
                  <a 
                    href={video.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-caramel font-medium hover:underline"
                  >
                    Дивитися на YouTube →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}