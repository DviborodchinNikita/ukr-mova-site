"use client";

import { useEffect, useState } from "react";

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Стан форми
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [topic, setTopic] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState("DRAFT");

  const loadVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/videos?status=ALL");
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error("Помилка завантаження відео:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = { 
      title, 
      description, 
      classLevel, 
      topic, 
      videoUrl, 
      status 
    };
    
    try {
      if (editingId) {
        // Редагування
        await fetch(`/api/videos?id=${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Додавання
        await fetch("/api/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      // Очистити форму
      setTitle(""); 
      setDescription(""); 
      setClassLevel(""); 
      setTopic(""); 
      setVideoUrl(""); 
      setStatus("DRAFT");
      setEditingId(null);
      setShowForm(false);
      loadVideos();
    } catch (error) {
      console.error("Помилка збереження:", error);
      alert("Сталася помилка при збереженні відео");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити це відео?")) return;
    
    try {
      await fetch(`/api/videos?id=${id}`, { method: "DELETE" });
      loadVideos();
    } catch (error) {
      console.error("Помилка видалення:", error);
      alert("Сталася помилка при видаленні");
    }
  };

  const handleEdit = (video: any) => {
    setTitle(video.title);
    setDescription(video.description || "");
    setClassLevel(video.classLevel || "");
    setTopic(video.topic || "");
    setVideoUrl(video.videoUrl || "");
    setStatus(video.status);
    setEditingId(video.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setClassLevel("");
    setTopic("");
    setVideoUrl("");
    setStatus("DRAFT");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-darkBrown">Відеоуроки</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-caramel text-white rounded-lg hover:bg-lightBrown transition"
        >
          {showForm ? "Скасувати" : "+ Додати відео"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-beige mb-6">
          <h3 className="text-xl font-semibold text-darkBrown mb-4">
            {editingId ? "Редагувати відео" : "Нове відео"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">
                Назва *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">
                Клас (напр. 7 клас)
              </label>
              <input
                type="text"
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">
                Тема
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite mb-1">
                Посилання на YouTube
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-graphite mb-1">
              Опис
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-beige rounded focus:outline-none focus:border-caramel"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-graphite mb-1">
              Статус
            </label>
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

      {/* Список відео */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-graphite italic bg-white p-4 rounded border border-beige">
            Завантаження...
          </p>
        ) : videos.length === 0 ? (
          <p className="text-graphite italic bg-white p-4 rounded border border-beige">
            Відеоуроків поки немає. Додайте перший!
          </p>
        ) : (
          videos.map((video) => (
            <div
              key={video.id}
              className="bg-white p-4 rounded-lg border border-beige flex justify-between items-center"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-darkBrown">{video.title}</h4>
                <p className="text-sm text-graphite">
                  {video.classLevel || "Без класу"} • {video.topic || "Без теми"}
                </p>
                <div className="flex gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      video.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {video.status === "PUBLISHED" ? "Опубліковано" : "Чернетка"}
                  </span>
                  {video.publishedAt && (
                    <span className="text-xs text-graphite">
                      {new Date(video.publishedAt).toLocaleDateString("uk-UA")}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(video)}
                  className="px-3 py-1 text-sm bg-lightBrown text-white rounded hover:bg-caramel transition"
                >
                  Редагувати
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
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