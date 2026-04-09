import { useState } from "react";
import { toApiIsoString } from "../../utils/school";

const INITIAL_VALUES = {
  name: "",
  picture: "",
  priority: "1",
  approved_by: "",
  approved_at: "",
};

function normalizeInitialValues(initialValues) {
  return {
    name: initialValues?.name || "",
    picture: initialValues?.picture || initialValues?.image || "",
    priority: String(initialValues?.priority ?? 1),
    approved_by: String(initialValues?.approved_by ?? ""),
    approved_at: initialValues?.approved_at
      ? String(initialValues.approved_at).slice(0, 10)
      : "",
  };
}

export default function SchoolForm({
  initialValues = INITIAL_VALUES,
  onSubmit,
  submitLabel = "Хадгалах",
  loading = false,
}) {
  const [formData, setFormData] = useState(() =>
    normalizeInitialValues(initialValues)
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit?.({
      ...formData,
      priority: Number(formData.priority || 1),
      approved_by: formData.approved_by ? Number(formData.approved_by) : null,
      approved_at: formData.approved_at ? toApiIsoString(formData.approved_at) : null,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-2">
        <label htmlFor="school-name" className="text-sm font-semibold text-slate-700">
          Сургуулийн нэр
        </label>
        <input
          id="school-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Сургуулийн нэр оруулна уу"
          required
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="school-picture" className="text-sm font-semibold text-slate-700">
          Зургийн холбоос
        </label>
        <input
          id="school-picture"
          name="picture"
          type="url"
          value={formData.picture}
          onChange={handleChange}
          placeholder="https://example.com/school.jpg"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="school-priority" className="text-sm font-semibold text-slate-700">
          Эрэмбэ
        </label>
        <input
          id="school-priority"
          name="priority"
          type="number"
          min="1"
          value={formData.priority}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="school-approved-by" className="text-sm font-semibold text-slate-700">
            Баталгаажуулсан хэрэглэгчийн дугаар
          </label>
          <input
            id="school-approved-by"
            name="approved_by"
            type="number"
            min="1"
            value={formData.approved_by}
            onChange={handleChange}
            placeholder="Жишээ: 1"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="school-approved-at" className="text-sm font-semibold text-slate-700">
            Баталгаажуулсан огноо
          </label>
          <input
            id="school-approved-at"
            name="approved_at"
            type="date"
            value={formData.approved_at}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Түр хүлээнэ үү..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
