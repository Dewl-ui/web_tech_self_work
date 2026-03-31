import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lessonAPI } from "../api";

const LESSON_TYPES = ["Лекц", "Семинар", "Лаборатори", "Бие даалт"];

export default function LessonCreatePage() {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "", type: "Лекц", content: "", video_url: "", point: "", is_attendable: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await lessonAPI.create(course_id, {
        name: form.name,
        content: form.content,
        video_url: form.video_url,
        point: Number(form.point) || 0,
        is_attendable: form.is_attendable,
        type_id: LESSON_TYPES.indexOf(form.type) + 1,
      });
      navigate(`/team1/courses/${course_id}/lessons`);
    } catch (err) {
      setError(err.message || "Алдаа гарлаа. Дахин оролдоно уу.");
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(`/team1/courses/${course_id}/lessons`)}
          className="text-indigo-500 hover:underline text-sm">← Буцах</button>
        <h1 className="text-2xl font-bold text-gray-800">Шинэ сэдэв бүртгэх</h1>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Сэдвийн нэр <span className="text-red-400">*</span></label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required
            placeholder="Сэдвийн нэрийг оруулна уу"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Хэсгийн төрөл <span className="text-red-400">*</span></label>
          <select name="type" value={form.type} onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-400 bg-white">
            {LESSON_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Агуулга</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={5}
            placeholder="Хичээлийн агуулгыг оруулна уу"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-400 resize-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">YouTube видео URL</label>
          <input type="url" name="video_url" value={form.video_url} onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Оноо</label>
          <input type="number" name="point" value={form.point} onChange={handleChange} min={0}
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-400" />
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" name="is_attendable" id="is_attendable"
            checked={form.is_attendable} onChange={handleChange}
            className="w-4 h-4 accent-indigo-500" />
          <label htmlFor="is_attendable" className="text-sm font-semibold text-gray-700">Ирц бүртгэх</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex-1 py-2 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition disabled:opacity-60">
            {loading ? "Хадгалж байна..." : "Хадгалах"}
          </button>
          <button type="button" onClick={() => navigate(`/team1/courses/${course_id}/lessons`)}
            className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition">
            Цуцлах
          </button>
        </div>
      </form>
    </div>
  );
}