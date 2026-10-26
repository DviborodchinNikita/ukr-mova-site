import Link from "next/link";

export default function HomePage() {
  return (
    <section
      className="min-h-screen flex items-center justify-center px-6 py-16 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/ucyeuv9w/image/upload/v1793026403/IMG_9205.jpg')",
      }}
    >
      {/* Затемнение поверх фото для читаемости текста */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Контент поверх фона */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 drop-shadow-lg">
          Вітаємо на сайті "Твоя Школа"!
        </h1>
        <p className="text-lg text-white leading-relaxed mb-10 drop-shadow-md">
          Тут ви знайдете навчальні матеріали, презентації, відеоуроки та корисні ресурси для вивчення української мови.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/videos"
            className="px-6 py-3 bg-lightBrown text-white rounded-lg hover:bg-caramel transition shadow-lg"
          >
            Відеоуроки
          </Link>
          <Link
            href="/presentations"
            className="px-6 py-3 bg-brown text-white rounded-lg hover:bg-darkBrown transition shadow-lg"
          >
            Презентації
          </Link>
          <Link
            href="/materials"
            className="px-6 py-3 bg-white text-brown rounded-lg hover:bg-cream transition shadow-lg font-medium"
          >
            Матеріали
          </Link>
        </div>
      </div>
    </section>
  );
}