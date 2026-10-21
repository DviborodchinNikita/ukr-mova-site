"use client";

import { useEffect, useState } from "react";

export default function AdminPresentationsPage() {
  const [presentations, setPresentations] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [topic, setTopic] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("DRAFT");

  const loadPresentations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/presentations?status=ALL");
      const data = await res.json();
      setPresentations(data);
    } catch (error) {
      console.error("Помилка завантаження презентацій:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresentations();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-cloudinary", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setFileUrl(data.url);
        setFileName(file.name);
      } else {
        alert("Помилка завантаження файлу");
      }
    } catch (error) {
      console.error("Помилка завантаження:", error);
      alert("Помилка завантаження файлу");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = { 
      title, 
      description, 
      classLevel, 
      topic, 
      fileUrl,
      fileType: "PDF",
      status 
    };
    
    try {
      if (editingId) {
        await fetch(`/api/presentations?id=${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/presentations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setTitle(""); 
      setDescription(""); 
      setClassLevel(""); 
      setTopic(""); 
      setFileUrl("");
      setFileName("");
      setStatus("DRAFT");
      setEditingId(null);
      setShowForm(false);
      loadPresentations();
    } catch (error) {
      console.error("Помилка збереження:", error);
      alert("Сталася помилка при збереженні презентації");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цю презентацію?")) return;
    
    try {
      await fetch(`/api/presentations?id=${id}`, { method: "DELETE" });
      loadPresentations();
    } catch (error) {
      console.error("Помилка видалення:", error);
      alert("Сталася помилка при видаленні");
    }
  };

  const handleEdit = (presentation: any) => {
    setTitle(presentation.title);
    setDescription(presentation.description || "");
    setClassLevel(presentation.classLevel || "");
    setTopic(presentation.topic || "");
    setFileUrl(presentation.fileUrl || "");
    setFileName(presentation.fileUrl ? presentation.fileUrl.split("/").pop() : "");
    setStatus(presentation.status);
    setEditingId(presentation.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setClassLevel("");
    setTopic("");
    setFileUrl("");
    setFileName("");
    setStatus("DRAFT");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-darkBrown">Презентації</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-caramel text-white rounded-lg hover:bg-lightBrown transition"
        >
          {showForm ? "Скасувати" : "+ Додати презентацію"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-beige mb-6">
          <h3 className="text-xl font-semibold text-darkBrown mb-4">
            {editingId ? "Редагувати презентацію" : "Нова презентація"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">Назва *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">Клас (напр. 7 клас)</label>
              <input
                type="text"
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">Тема</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">Файл PDF *</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel"
              />
              {fileName && <p className="text-sm text-graphite mt-1">Завантажено: {fileName}</p>}
              {uploading && <p className="text-sm text-caramel mt-1">Завантаження в хмару...</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-graphite mb-1">Опис</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-graphite mb-1">Статус</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel"
            >
              <option value="DRAFT">Чернетка (нікому не видно)</option>
              <option value="PUBLISHED">Опубліковано</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-caramel text-white rounded hover:bg-lightBrown transition"
            >
              {editingId ? "Оновити" : "Зберегти"}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="px-6 py-2 border border-brown text-brown rounded hover:bg-brown hover:text-white transition"
            >
              Скасувати
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {loading ? (
          <p className="text-graphite italic bg-white p-4 rounded border border-beige">Завантаження...</p>
        ) : presentations.length === 0 ? (
          <p className="text-graphite italic bg-white p-4 rounded border border-beige">Презентацій поки немає. Додайте першу!</p>
        ) : (
          presentations.map((presentation) => (
            <div
              key={presentation.id}
              className="bg-white p-4 rounded-lg border border-beige flex justify-between items-center"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-darkBrown">{presentation.title}</h4>
                <p className="text-sm text-graphite">
                  {presentation.classLevel || "Без класу"} • {presentation.topic || "Без теми"}
                </p>
                <div className="flex gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      presentation.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {presentation.status === "PUBLISHED" ? "Опубліковано" : "Чернетка"}
                  </span>
                  {presentation.fileUrl && (
                    <a
                      href={presentation.fileUrl}
                      target="_blank"
                      className="text-xs text-caramel hover:underline"
                    >
                      📄 Переглянути PDF
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(presentation)}
                  className="px-3 py-1 text-sm bg-lightBrown text-white rounded hover:bg-caramel transition"
                >
                  Редагувати
                </button>
                <button
                  onClick={() => handleDelete(presentation.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Видалити
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}