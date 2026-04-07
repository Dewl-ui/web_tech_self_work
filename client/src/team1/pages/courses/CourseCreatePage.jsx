import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useTeam1Role from "../../hooks/useTeam1Role";
import { getCategoriesBySchool } from "../../services/categoryService";
import { createCourse } from "../../services/courseService";
import {
  canCreateCourse,
  getCurrentSchool,
  getErrorMessage,
  toApiIsoString,
} from "../../utils/school";

export default function CourseCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSchool = useMemo(() => {
    const routeSchool = location.state?.school;
    if (routeSchool?.id) return routeSchool;
    return getCurrentSchool();
  }, [location.state]);
  const initialCategory = location.state?.category;
  const role = useTeam1Role();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category_id: initialCategory?.id ? String(initialCategory.id) : "",
    cloned_course_id: "",
    picture: "",
    description: "",
    start_on: "",
    end_on: "",
    priority: "1",
    access_type_id: "0",
    price: "",
    credits: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const schoolId = Number(selectedSchool?.id);

  useEffect(() => {
    if (!schoolId) return;
    getCategoriesBySchool(schoolId)
      .then((items) => setCategories(items || []))
      .catch(() => {});
  }, [schoolId]);

  if (!canCreateCourse(role)) {
    return <p>Хандах эрхгүй.</p>;
  }

  if (!schoolId) {
    return <p>Эхлээд сургууль сонгоно уу.</p>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createCourse(schoolId, {
        name: form.name,
        school_id: schoolId,
        category_id: form.category_id ? Number(form.category_id) : null,
        cloned_course_id: form.cloned_course_id ? Number(form.cloned_course_id) : null,
        picture: form.picture || null,
        description: form.description,
        start_on: form.start_on ? toApiIsoString(form.start_on) : null,
        end_on: form.end_on ? toApiIsoString(form.end_on) : null,
        priority: Number(form.priority || 1),
        access_type_id: Number(form.access_type_id || 0),
        price: form.price ? Number(form.price) : null,
        credits: form.credits ? Number(form.credits) : null,
      });
      navigate("/team1/courses");
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Хичээл нэмэхэд алдаа гарлаа."));
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-8">
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-3 text-sm text-indigo-500 hover:underline"
        >
          ← Буцах
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Шинэ хичээл нэмэх</h1>
        <p className="mt-2 text-slate-500">Сургууль: {selectedSchool.name}</p>
      </div>

      {error ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Хичээлийн нэр</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Хичээлийн нэр"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Ангилал сонгох</label>
            <select
              value={form.category_id}
              onChange={(event) => setForm((prev) => ({ ...prev, category_id: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none"
            >
              <option value="">Ангилал сонгоно уу</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Хуулбарласан хичээлийн дугаар</label>
            <input
              type="number"
              min="1"
              value={form.cloned_course_id}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, cloned_course_id: event.target.value }))
              }
              placeholder="Хоосон байж болно"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Зураг</label>
            <input
              type="text"
              value={form.picture}
              onChange={(event) => setForm((prev) => ({ ...prev, picture: event.target.value }))}
              placeholder="Зургийн утга"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Хичээлийн тайлбар</label>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="Тайлбар"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Эхлэх огноо</label>
            <input
              type="date"
              value={form.start_on}
              onChange={(event) => setForm((prev) => ({ ...prev, start_on: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Дуусах огноо</label>
            <input
              type="date"
              value={form.end_on}
              onChange={(event) => setForm((prev) => ({ ...prev, end_on: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Эрэмбэ</label>
            <input
              type="number"
              min="0"
              value={form.priority}
              onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Хандалтын төрөл</label>
            <input
              type="number"
              min="0"
              value={form.access_type_id}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, access_type_id: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Үнэ</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              placeholder="Үнэ"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Кредит</label>
            <input
              type="number"
              min="0"
              value={form.credits}
              onChange={(event) => setForm((prev) => ({ ...prev, credits: event.target.value }))}
              placeholder="Кредит"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white"
        >
          {loading ? "Хадгалж байна..." : "Хичээл үүсгэх"}
        </button>
      </form>
    </div>
  );
}
