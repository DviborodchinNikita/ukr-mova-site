import Link from "next/link";

export default function ContactsPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-serif text-darkBrown mb-6">Контакти</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-beige">
        <p className="text-graphite mb-2">📧 Email: teacher@example.com</p>
        <p className="text-graphite">📞 Телефон: +380 XX XXX XX XX</p>
      </div>
    </section>
  );
}