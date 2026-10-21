export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-serif text-darkBrown mb-6">Дашборд</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-beige">
          <h3 className="text-lg font-semibold text-darkBrown">Відеоуроки</h3>
          <p className="text-graphite mt-2">Керування відеоматеріалами</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-beige">
          <h3 className="text-lg font-semibold text-darkBrown">Презентації</h3>
          <p className="text-graphite mt-2">Завантаження презентацій</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-beige">
          <h3 className="text-lg font-semibold text-darkBrown">Новини</h3>
          <p className="text-graphite mt-2">Публікація оголошень</p>
        </div>
      </div>
    </div>
  );
}