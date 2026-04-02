import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentSchool, getRole } from "../../utils/school";

export default function CourseCreatePage() {
  const navigate = useNavigate();
  const selectedSchool = getCurrentSchool();
  const role = getRole();
  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (role !== "admin" && role !== "teacher") {
    return <p>Зөвхөн багш эсвэл админ хичээл нэмнэ</p>;
  }

  if (!selectedSchool?.id) {
    return <p>Эхлээд сургууль сонгоно уу</p>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const newCourse = {
        id: Date.now(),
        name: form.name,
        school_id: selectedSchool.id,
        teacher: "Багш",
        progress: 0,
        code: `CS${Date.now().toString().slice(-4)}`,
      };

      const existing = JSON.parse(localStorage.getItem("courses") || "[]");

      localStorage.setItem("courses", JSON.stringify([...existing, newCourse]));
      navigate("/team1/courses");
    } catch (saveError) {
      console.error(saveError);
      setError("Алдаа гарлаа");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Шинэ хичээл нэмэх</h1>
        <p className="mt-2 text-slate-500">Сургууль: {selectedSchool.name}</p>
      </div>

      {error ? <div className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Хичээлийн нэр</label>
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm({ name: event.target.value })}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            required
          />
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
