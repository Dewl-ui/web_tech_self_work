import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { lessonAPI } from "../../api";

const LESSON_TYPES = ["Лекц", "Семинар", "Лаборатори", "Бие даалт"];

export default function LessonEditPage() {
  const { course_id, lesson_id, lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const currentCourseId = course_id || location.state?.courseId || "";
  const currentLessonId = lesson_id || lessonId || "";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    type: "Лекц",
    content: "",
    video_url: "",
    point: "",
    is_attendable: false,
  });

  useEffect(() => {
    if (!currentCourseId || !currentLessonId) {
      setForm({
        name: "Жишээ сэдэв",
        type: "Лекц",
        content: "Агуулга",
        video_url: "",
        point: 10,
        is_attendable: true,
      });
      setLoading(false);
      return;
    }

    lessonAPI
      .getOne(currentCourseId, currentLessonId)
      .then((data) => {
        setForm({
          name: data.name || "",
          type: data.type?.name || "Лекц",
          content: data.content || "",
          video_url: data.video_url || "",
          point: data.point || "",
          is_attendable: data.is_attendable || false,
        });
      })
      .catch(() => {
        setForm({
          name: "Жишээ сэдэв",
          type: "Лекц",
          content: "Агуулга",
          video_url: "",
          point: 10,
          is_attendable: true,
        });
      })
      .finally(() => setLoading(false));
  }, [currentCourseId, currentLessonId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    if (!currentCourseId || !currentLessonId) {
      navigate(-1);
      return;
    }

    try {
      await lessonAPI.update(currentCourseId, currentLessonId, {
        name: form.name,
        content: form.content,
        video_url: form.video_url,
        point: Number(form.point) || 0,
        is_attendable: form.is_attendable,
        type_id: LESSON_TYPES.indexOf(form.type) + 1,
      });
      navigate(`/team1/courses/${currentCourseId}/lessons/${currentLessonId}`);
    } catch (err) {
      setError(err.message || "Алдаа гарлаа.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Энэ сэдвийг устгах уу?")) return;

    if (!currentCourseId || !currentLessonId) {
      navigate(-1);
      return;
    }

    try {
      await lessonAPI.delete(currentCourseId, currentLessonId);
      navigate(`/team1/courses/${currentCourseId}/lessons`);
    } catch {
      setError("Устгах үед алдаа гарлаа.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-indigo-500 font-semibold animate-pulse">
        Уншиж байна...
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() =>
            currentCourseId
              ? navigate(`/team1/courses/${currentCourseId}/lessons/${currentLessonId}`)
              : navigate(-1)
          }
          className="text-indigo-500 hover:underline text-sm"
        >
          ← Буцах
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Сэдэв засах</h1>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Сэдвийн нэр <span className="text-red-400">*</span></label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Хэсгийн төрөл</label>
          <select name="type" value={form.type} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-400 bg-white">
            {LESSON_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Агуулга</label>
          <textarea name="content" value={form.content} onChange={handleChange} rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-400 resize-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">YouTube видео URL</label>
          <input type="url" name="video_url" value={form.video_url} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-400" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Оноо</label>
          <input type="number" name="point" value={form.point} onChange={handleChange} min={0} className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:border-indigo-400" />
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" name="is_attendable" id="is_attendable" checked={form.is_attendable} onChange={handleChange} className="w-4 h-4 accent-indigo-500" />
          <label htmlFor="is_attendable" className="text-sm font-semibold text-gray-700">Ирц бүртгэх</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="flex-1 py-2 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition disabled:opacity-60">
            {saving ? "Хадгалж байна..." : "Хадгалах"}
          </button>
          <button type="button" onClick={() => (currentCourseId ? navigate(`/team1/courses/${currentCourseId}/lessons/${currentLessonId}`) : navigate(-1))} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition">
            Цуцлах
          </button>
          <button type="button" onClick={handleDelete} className="px-5 py-2 bg-red-50 text-red-500 rounded-xl font-semibold hover:bg-red-100 transition">
            Устгах
          </button>
        </div>
      </form>
    </div>
  );
}
