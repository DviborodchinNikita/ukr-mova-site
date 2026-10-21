import Link from "next/link";

export default function MaterialsPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-serif text-darkBrown mb-6">Навчальні матеріали</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-beige text-center">
        <p className="text-graphite italic">Матеріалів поки немає.</p>
      </div>
    </section>
  );
}