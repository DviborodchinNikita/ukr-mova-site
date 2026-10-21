import Link from "next/link";

export default function HomePage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-milk to-cream px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-darkBrown mb-6">
          Вітаємо на сайті "Твоя Школа"!
        </h1>
        <p className="text-lg text-graphite leading-relaxed mb-10">
          Тут ви знайдете навчальні матеріали, презентації, відеоуроки та корисні ресурси для вивчення української мови.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/videos"
            className="px-6 py-3 bg-lightBrown text-white rounded-lg hover:bg-caramel transition"
          >
            Відеоуроки
          </Link>
          <Link
            href="/presentations"
            className="px-6 py-3 bg-brown text-white rounded-lg hover:bg-darkBrown transition"
          >
            Презентації
          </Link>
          <Link
            href="/materials"
            className="px-6 py-3 border border-brown text-brown rounded-lg hover:bg-brown hover:text-white transition"
          >
            Матеріали
          </Link>
        </div>
      </div>
    </section>
  );
}