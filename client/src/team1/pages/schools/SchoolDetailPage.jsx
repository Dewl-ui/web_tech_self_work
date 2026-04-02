import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SchoolHeader from "../../components/school/SchoolHeader";
import SchoolStats from "../../components/school/SchoolStats";
import { getSchool } from "../../services/schoolService";
import { getRole, setCurrentSchool } from "../../utils/school";

function normalizeSchool(school, id) {
  return {
    id: school.id || school.school_id || id,
    name: school.name || school.school_name || "Сургууль",
    picture: school.picture || school.image || school.thumbnail || "",
    description: school.description || school.about || school.summary || "",
    priority: school.priority ?? 0,
    courses: school.courseCount ?? school.courses ?? school.total_courses ?? 0,
    users: school.userCount ?? school.users ?? school.total_users ?? 0,
    teachers: school.teacherCount ?? school.teachers ?? 0,
    activeStudents: school.studentCount ?? school.students ?? 0,
  };
}

export default function SchoolDetailPage() {
  const { school_id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const role = getRole();
  const canEdit = role === "admin" || role === "teacher";

  useEffect(() => {
    let isMounted = true;

    async function loadSchool() {
      try {
        setLoading(true);
        setError("");
        const result = await getSchool(school_id);
        const normalized = normalizeSchool(result || {}, school_id);

        if (isMounted) {
          setSchool(normalized);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Сургуулийн мэдээлэл ачаалж чадсангүй.");
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

  useEffect(() => {
    if (school) {
      setCurrentSchool(school);
      localStorage.setItem("selectedSchool", JSON.stringify(school));
    }
  }, [school]);

  const stats = useMemo(() => {
    if (!school) {
      return [];
    }

    return [
      { key: "courses", label: "Сургалтууд", value: school.courses },
      { key: "users", label: "Нийт хэрэглэгч", value: school.users },
      { key: "teachers", label: "Багш нар", value: school.teachers },
      { key: "students", label: "Сурагчид", value: school.activeStudents },
    ];
  }, [school]);

  if (loading) {
    return <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">Сургуулийн мэдээлэл ачаалж байна...</div>;
  }

  if (error) {
    return <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-6 py-5 text-sm font-medium text-rose-600 shadow-sm">{error}</div>;
  }

  if (!school) {
    return <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">Сургууль олдсонгүй.</div>;
  }

  return (
    <div className="space-y-8">
      <SchoolHeader
        school={school}
        canEdit={canEdit}
        onReport={() => navigate("/team1/report")}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate("/team1/courses")}
          className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Энэ сургуулийн хичээлүүд
        </button>
      </div>

      <SchoolStats stats={stats} />

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Ерөнхий мэдээлэл</h2>
        <dl className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <dt className="text-sm font-medium text-slate-500">Сургуулийн нэр</dt>
            <dd className="mt-2 text-base font-semibold text-slate-900">{school.name}</dd>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <dt className="text-sm font-medium text-slate-500">Эрэмбэ</dt>
            <dd className="mt-2 text-base font-semibold text-slate-900">{school.priority}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
