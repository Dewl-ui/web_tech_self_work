import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SchoolForm from "../../components/school/SchoolForm";
import useTeam1Role from "../../hooks/useTeam1Role";
import { createSchool } from "../../services/schoolService";
import { canCreateSchool, getErrorMessage } from "../../utils/school";

export default function SchoolCreatePage() {
  const navigate = useNavigate();
  const role = useTeam1Role();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(values) {
    try {
      setSaving(true);
      setError("");
      await createSchool(values);
      navigate("/team1/schools");
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Сургууль үүсгэж чадсангүй."));
    } finally {
      setSaving(false);
    }
  }

  if (!canCreateSchool(role)) {
    return <div className="rounded bg-yellow-100 p-4">Хандах эрхгүй</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-indigo-500 hover:underline"
        >
          ← Буцах
        </button>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
          Сургууль
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Шинэ сургууль нэмэх
        </h1>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-600">
          {error}
        </div>
      ) : null}

      <SchoolForm
        key="create-school"
        onSubmit={handleSubmit}
        submitLabel="Сургууль үүсгэх"
        loading={saving}
      />
    </div>
  );
}
