import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-serif text-darkBrown mb-6">Про вчителя</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-beige">
        <p className="text-graphite leading-relaxed">
          Тут буде інформація про вчителя української мови. Ви зможете редагувати цей текст через адмін-панель.
        </p>
      </div>
    </section>
  );
}