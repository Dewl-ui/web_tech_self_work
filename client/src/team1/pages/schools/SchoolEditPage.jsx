import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SchoolForm from "../../components/school/SchoolForm";
import useTeam1Role from "../../hooks/useTeam1Role";
import { getSchool, updateSchool } from "../../services/schoolService";
import { canCreateSchool, getErrorMessage } from "../../utils/school";

export default function SchoolEditPage() {
  const { school_id } = useParams();
  const navigate = useNavigate();
  const role = useTeam1Role();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getSchool(school_id)
      .then((item) => {
        if (isMounted) {
          setSchool(item);
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(getErrorMessage(loadError, "Сургууль олдсонгүй."));
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [school_id]);

  async function handleSubmit(values) {
    try {
      setSaving(true);
      setError("");
      await updateSchool(school_id, values);
      navigate(`/team1/schools/${school_id}`);
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Сургуулийг шинэчилж чадсангүй."));
    } finally {
      setSaving(false);
    }
  }

  if (!canCreateSchool(role)) {
    return <div className="rounded bg-yellow-100 p-4">Хандах эрхгүй</div>;
  }

  if (loading) {
    return <div className="rounded bg-white p-6 shadow-sm">Ачаалж байна...</div>;
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
          Сургууль засах
        </h1>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-600">
          {error}
        </div>
      ) : null}

      <SchoolForm
        key={`edit-school-${school_id}`}
        initialValues={school}
        onSubmit={handleSubmit}
        submitLabel="Хадгалах"
        loading={saving}
      />
    </div>
  );
}
