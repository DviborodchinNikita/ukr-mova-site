"use client";

import { useEffect, useState } from "react";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const loadStudents = async () => {
    const res = await fetch("/api/users");
    if (res.ok) {
      const data = await res.json();
      setStudents(data);
    }
  };

  useEffect(() => { loadStudents(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setEmail(""); setPassword(""); setName("");
      setShowForm(false);
      loadStudents();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити цього учня?")) return;
    await fetch(`/api/users?id=${id}`, { method: "DELETE" });
    loadStudents();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-darkBrown">Учні та доступ</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-caramel text-white rounded-lg hover:bg-lightBrown transition">
          {showForm ? "Скасувати" : "+ Додати учня"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-beige mb-6">
          <h3 className="text-xl font-semibold text-darkBrown mb-4">Новий обліковий запис</h3>
          {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">Ім'я та прізвище</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel" placeholder="Іван Петренко" />
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">Email (логін)</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel" placeholder="student@school.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">Пароль</label>
              <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel" placeholder="Придумайте пароль" />
            </div>
          </div>
          <button type="submit" className="px-6 py-2 bg-caramel text-white rounded hover:bg-lightBrown transition">Створити акаунт</button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-beige overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream border-b border-beige">
            <tr>
              <th className="p-4 text-darkBrown font-semibold">Ім'я</th>
              <th className="p-4 text-darkBrown font-semibold">Email</th>
              <th className="p-4 text-darkBrown font-semibold">Дата створення</th>
              <th className="p-4 text-darkBrown font-semibold text-right">Дії</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-graphite italic">Список учнів порожній</td></tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-b border-beige last:border-0 hover:bg-cream/50">
                  <td className="p-4 text-darkBrown">{student.name}</td>
                  <td className="p-4 text-graphite">{student.email}</td>
                  <td className="p-4 text-graphite text-sm">{new Date(student.createdAt).toLocaleDateString("uk-UA")}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(student.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition">Видалити</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}