import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentSchool } from "../../utils/school";

export default function CourseEditPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const selectedSchool = getCurrentSchool();
  const role = localStorage.getItem("role");
  const isTeacherOrAdmin = role === "admin" || role === "teacher";
  const currentCourse = useMemo(() => {
    const stored = localStorage.getItem("courses");
    const allCourses = stored ? JSON.parse(stored) : [];
    return (
      allCourses.find((course) => Number(course.id) === Number(courseId)) || null
    );
  }, [courseId]);
  const [name, setName] = useState(currentCourse?.name || "");
  const [teacher, setTeacher] = useState(currentCourse?.teacher || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isTeacherOrAdmin) {
    return <p>Хандах эрхгүй</p>;
  }

  if (!currentCourse) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">Хичээл олдсонгүй.</div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const stored = localStorage.getItem("courses");
      const allCourses = stored ? JSON.parse(stored) : [];
      const updatedCourses = allCourses.map((course) =>
        Number(course.id) === Number(courseId)
          ? {
              ...course,
              name,
              teacher: teacher || "Багш",
              school_id: currentCourse.school_id || selectedSchool?.id,
            }
          : course
      );

      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      navigate("/team1/courses");
    } catch {
      setError("Алдаа гарлаа");
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Хичээл засах</h1>
          <p className="mt-2 text-slate-500">
            {selectedSchool?.name || "Сонгогдсон сургууль"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/team1/courses")}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Буцах
        </button>
      </div>

      {error ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Хичээлийн нэр
          </label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Багш</label>
          <input
            type="text"
            value={teacher}
            onChange={(event) => setTeacher(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            placeholder="Багш"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white"
          >
            {saving ? "Хадгалж байна..." : "Хадгалах"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/team1/courses")}
            className="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-700"
          >
            Цуцлах
          </button>
        </div>
      </form>
    </div>
  );
}
