import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SchoolForm from "../../components/school/SchoolForm";
import { getSchool, updateSchool } from "../../services/schoolService";

function normalizeSchool(school) {
  return {
    name: school.name || school.school_name || "",
    picture: school.picture || school.image || "",
    priority: school.priority ?? 1,
  };
}

export default function SchoolEditPage() {
  const { school_id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const role = (localStorage.getItem("role") || "").trim().toLowerCase();

  console.log("ROLE CHECK:", role);

  useEffect(() => {
    let isMounted = true;

    async function loadSchool() {
      try {
        setLoading(true);
        setError("");
        const result = await getSchool(school_id);

        if (isMounted) {
          setInitialValues(normalizeSchool(result || {}));
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Засах мэдээллийг ачаалж чадсангүй.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSchool();

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
      setError(saveError.message || "Сургуулийг шинэчилж чадсангүй.");
    } finally {
      setSaving(false);
    }
  }

  if (role !== "admin" && role !== "teacher") {
    return (
      <div className="rounded bg-yellow-100 p-4">
        Энэ хуудсанд зөвхөн багш эсвэл админ хандах боломжтой
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
        Засварлах мэдээлэл ачаалж байна...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
          Edit School
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Сургуулийн мэдээлэл засах
        </h1>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-600">
          {error}
        </div>
      ) : null}

      <SchoolForm
        key={`edit-school-${school_id}-${initialValues?.name || ""}-${initialValues?.priority ?? ""}-${initialValues?.picture || ""}`}
        initialValues={initialValues || undefined}
        onSubmit={handleSubmit}
        submitLabel="Өөрчлөлт хадгалах"
        loading={saving}
      />
    </div>
  );
}
