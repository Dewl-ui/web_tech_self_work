import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTeam1Role from "../../hooks/useTeam1Role";
import { getCategoriesBySchool } from "../../services/categoryService";
import { getCourse, updateCourse } from "../../services/courseService";
import {
  canCreateCourse,
  getCurrentSchool,
  getErrorMessage,
  toApiIsoString,
} from "../../utils/school";

export default function CourseEditPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const selectedSchool = getCurrentSchool();
  const role = useTeam1Role();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    school_id: "",
    category_id: "",
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedSchool?.id) {
      getCategoriesBySchool(selectedSchool.id)
        .then((items) => setCategories(items || []))
        .catch(() => {});
    }
  }, [selectedSchool?.id]);

  useEffect(() => {
    getCourse(courseId)
      .then((course) => {
        setForm({
          name: course?.name || "",
          school_id: String(course?.school_id || selectedSchool?.id || ""),
          category_id: String(course?.category_id || ""),
          cloned_course_id: String(course?.cloned_course_id || ""),
          picture: course?.picture || "",
          description: course?.description || "",
          start_on: course?.start_on ? String(course.start_on).slice(0, 10) : "",
          end_on: course?.end_on ? String(course.end_on).slice(0, 10) : "",
          priority: String(course?.priority ?? 1),
          access_type_id: String(course?.access_type_id ?? 0),
          price: course?.price == null ? "" : String(course.price),
          credits: course?.credits == null ? "" : String(course.credits),
        });
      })
      .catch((loadError) => {
        setError(getErrorMessage(loadError, "Хичээл олдсонгүй."));
      })
      .finally(() => setLoading(false));
  }, [courseId, selectedSchool?.id]);

  if (!canCreateCourse(role)) {
    return <p>Хандах эрхгүй.</p>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateCourse(Number(form.school_id), courseId, {
        name: form.name,
        school_id: Number(form.school_id),
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
      navigate(-1);
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Хичээл засахад алдаа гарлаа."));
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm">Ачаалж байна...</div>;
  }

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
        <h1 className="text-3xl font-bold text-slate-900">Хичээл засах</h1>
        <p className="mt-2 text-slate-500">{selectedSchool?.name || "Сургууль"}</p>
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
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Сургуулийн дугаар</label>
            <input
              type="number"
              value={form.school_id}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, school_id: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Ангилал сонгох</label>
            <select
              value={form.category_id}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, category_id: event.target.value }))
              }
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
              value={form.cloned_course_id}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, cloned_course_id: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Зураг</label>
            <input
              type="text"
              value={form.picture}
              onChange={(event) => setForm((prev) => ({ ...prev, picture: event.target.value }))}
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
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white"
        >
          {saving ? "Хадгалж байна..." : "Хадгалах"}
        </button>
      </form>
    </div>
  );
}
