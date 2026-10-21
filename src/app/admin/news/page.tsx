"use client";

import { useEffect, useState } from "react";

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [status, setStatus] = useState("DRAFT");

  const loadNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news?status=ALL");
      const data = await res.json();
      setNews(data);
    } catch (error) {
      console.error("Помилка завантаження новин:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверяем, что это изображение
    if (!file.type.startsWith("image/")) {
      alert("Будь ласка, виберіть файл зображення (JPG, PNG)");
      return;
    }

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
        setImage(data.url);
        setImageFileName(file.name);
      } else {
        alert("Помилка завантаження зображення");
      }
    } catch (error) {
      console.error("Помилка завантаження:", error);
      alert("Помилка завантаження зображення");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = { title, content, image, status };
    
    try {
      if (editingId) {
        await fetch(`/api/news?id=${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setTitle(""); 
      setContent(""); 
      setImage("");
      setImageFileName("");
      setStatus("DRAFT");
      setEditingId(null);
      setShowForm(false);
      loadNews();
    } catch (error) {
      console.error("Помилка збереження:", error);
      alert("Сталася помилка при збереженні новини");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цю новину?")) return;
    
    try {
      await fetch(`/api/news?id=${id}`, { method: "DELETE" });
      loadNews();
    } catch (error) {
      console.error("Помилка видалення:", error);
      alert("Сталася помилка при видаленні");
    }
  };

  const handleEdit = (newsItem: any) => {
    setTitle(newsItem.title);
    setContent(newsItem.content || "");
    setImage(newsItem.image || "");
    setImageFileName(newsItem.image ? newsItem.image.split("/").pop() : "");
    setStatus(newsItem.status);
    setEditingId(newsItem.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setTitle("");
    setContent("");
    setImage("");
    setImageFileName("");
    setStatus("DRAFT");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-darkBrown">Новини та оголошення</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-caramel text-white rounded-lg hover:bg-lightBrown transition"
        >
          {showForm ? "Скасувати" : "+ Додати новину"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-beige mb-6">
          <h3 className="text-xl font-semibold text-darkBrown mb-4">
            {editingId ? "Редагувати новину" : "Нова новина"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">Заголовок *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel"
                placeholder="Наприклад: Оголошення про збори"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">Зображення (необов'язково)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel"
              />
              {imageFileName && (
                <div className="mt-2 flex items-center gap-3">
                  <img 
                    src={image} 
                    alt="Превью" 
                    className="w-24 h-24 object-cover rounded border border-beige"
                  />
                  <p className="text-sm text-graphite">Завантажено: {imageFileName}</p>
                </div>
              )}
              {uploading && <p className="text-sm text-caramel mt-1">Завантаження...</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">Текст новини *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                required
                className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel"
                placeholder="Напишіть текст новини..."
              />
            </div>
            <div>
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
          </div>
          <div className="flex gap-3 mt-4">
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
        ) : news.length === 0 ? (
          <p className="text-graphite italic bg-white p-4 rounded border border-beige">Новин поки немає. Додайте першу!</p>
        ) : (
          news.map((newsItem) => (
            <div
              key={newsItem.id}
              className="bg-white p-4 rounded-lg border border-beige flex justify-between items-center"
            >
              <div className="flex-1 flex items-center gap-4">
                {newsItem.image && (
                  <img 
                    src={newsItem.image} 
                    alt={newsItem.title}
                    className="w-16 h-16 object-cover rounded border border-beige"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-darkBrown">{newsItem.title}</h4>
                  <p className="text-sm text-graphite mt-1 line-clamp-2">{newsItem.content}</p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        newsItem.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {newsItem.status === "PUBLISHED" ? "Опубліковано" : "Чернетка"}
                    </span>
                    <span className="text-xs text-graphite">
                      {new Date(newsItem.createdAt).toLocaleDateString("uk-UA")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(newsItem)}
                  className="px-3 py-1 text-sm bg-lightBrown text-white rounded hover:bg-caramel transition"
                >
                  Редагувати
                </button>
                <button
                  onClick={() => handleDelete(newsItem.id)}
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