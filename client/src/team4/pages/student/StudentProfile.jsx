// Member C OWNS this file — Student profile page at /team4/profile
import { useEffect, useState } from "react";
import { FiUser, FiSave, FiBook } from "react-icons/fi";
import { getStudentProfile, updateStudentProfile, getStudentCourses, parseField } from "./api/studentCourseApi";

function Field({ label, value, onChange, type = "text", readOnly = false }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        className={`flex h-10 w-full rounded-lg border px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-zinc-900
          ${readOnly
            ? "border-zinc-100 bg-zinc-50 text-zinc-400 cursor-default"
            : "border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400"}`}
      />
    </div>
  );
}

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [form, setForm]       = useState({ first_name: "", last_name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    getStudentProfile()
      .then((data) => {
        setProfile(data);
        setForm({
          first_name: data.first_name ?? "",
          last_name:  data.last_name  ?? "",
          phone:      data.phone      ?? "",
        });
        if (data?.id) {
          return getStudentCourses(data.id);
        }
      })
      .then((res) => setCourses(res?.items ?? []))
      .catch((err) => setError(err.message || "Профайл ачааллахад алдаа гарлаа."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      await updateStudentProfile(form);
      setSaved(true);
    } catch (err) {
      setError(err.message || "Хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  }

  const initials = [profile?.first_name, profile?.last_name]
    .filter(Boolean).map((s) => s[0].toUpperCase()).join("") || "C";

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
          <FiUser className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Миний профайл</h1>
          <p className="text-sm text-zinc-500">Оюутан · {profile?.email ?? "…"}</p>
        </div>
      </div>

      {/* Avatar + name */}
      {loading ? (
        <div className="h-24 w-full animate-pulse rounded-xl bg-zinc-100" />
      ) : (
        <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-100
            text-2xl font-bold text-green-700">
            {initials}
          </div>
          <div>
            <p className="text-lg font-semibold text-zinc-900">
              {[profile?.last_name, profile?.first_name].filter(Boolean).join(" ") || "—"}
            </p>
            <p className="text-sm text-zinc-400">@{profile?.username ?? "—"}</p>
          </div>
        </div>
      )}

      {/* Edit form */}
      <form onSubmit={handleSave} className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4">
        <h2 className="font-semibold text-zinc-800">Мэдээлэл засах</h2>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {saved && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Амжилттай хадгалагдлаа.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Овог" value={form.last_name}  onChange={(v) => setForm((f) => ({ ...f, last_name: v }))} />
          <Field label="Нэр"  value={form.first_name} onChange={(v) => setForm((f) => ({ ...f, first_name: v }))} />
        </div>
        <Field label="И-мэйл"   value={profile?.email}    readOnly />
        <Field label="Хэрэглэгчийн нэр" value={profile?.username} readOnly />
        <Field label="Утас"      value={form.phone}  type="tel" onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />

        <button
          type="submit"
          disabled={saving || loading}
          className="flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-5 text-sm font-medium
            text-white transition-colors hover:bg-zinc-700 disabled:pointer-events-none disabled:opacity-60"
        >
          {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
          <FiSave className="h-4 w-4" />
          Хадгалах
        </button>
      </form>

      {/* Enrolled courses */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3">
        <div className="flex items-center gap-2">
          <FiBook className="h-4 w-4 text-zinc-500" />
          <h2 className="font-semibold text-zinc-800">Бүртгэлтэй хичээлүүд</h2>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-zinc-100" />)}
          </div>
        ) : courses.length === 0 ? (
          <p className="text-sm text-zinc-400">Та ямар нэг хичээлд бүртгэлгүй байна.</p>
        ) : (
          <div className="space-y-2">
            {courses.map((item, i) => {
              const course = parseField(item, "course") ?? {};
              const courseId   = course.id ?? item.id ?? item.course_id;
              const courseName = course.name ?? course.title ?? `Хичээл #${courseId}`;
              const group = parseField(item, "group");
              return (
                <div
                  key={courseId ?? i}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{courseName}</p>
                    {group?.name && (
                      <p className="text-xs text-zinc-400">Бүлэг: {group.name}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
