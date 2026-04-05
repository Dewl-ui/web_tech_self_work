import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SchoolHeader from "../../components/school/SchoolHeader";
import SchoolStats from "../../components/school/SchoolStats";
import useTeam1Role from "../../hooks/useTeam1Role";
import { createRequest } from "../../services/requestService";
import { deleteSchool, getSchool } from "../../services/schoolService";
import {
  canCreateSchool,
  getCurrentSchool,
  getErrorMessage,
  isStudent,
  setCurrentSchool,
} from "../../utils/school";

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
  const location = useLocation();
  const navigate = useNavigate();
  const role = useTeam1Role();
  const fallbackSchool = useMemo(() => {
    const routeSchool = location.state?.school;
    if (routeSchool && Number(routeSchool.id) === Number(school_id)) {
      return normalizeSchool(routeSchool, school_id);
    }

    const storedSchool = getCurrentSchool();
    if (storedSchool && Number(storedSchool.id) === Number(school_id)) {
      return normalizeSchool(storedSchool, school_id);
    }

    return null;
  }, [location.state, school_id]);
  const [school, setSchool] = useState(fallbackSchool);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (fallbackSchool) {
      setCurrentSchool(fallbackSchool);
    }

    getSchool(school_id)
      .then((result) => {
        if (isMounted) {
          const normalized = normalizeSchool(result || {}, school_id);
          setSchool(normalized);
          setCurrentSchool(normalized);
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          if (loadError?.response?.status === 401 && fallbackSchool) {
            setSchool(fallbackSchool);
            setError("");
          } else {
            setError(getErrorMessage(loadError, "Сургуулийн мэдээлэл олдсонгүй."));
          }
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
  }, [fallbackSchool, school_id]);

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

  const handleSchoolAdminRequest = async () => {
    try {
      setRequestMessage("");
      await createRequest({
        type: "school_admin",
        school_id: Number(school_id),
      });
      setRequestMessage("Хүсэлт амжилттай илгээгдлээ.");
    } catch (requestError) {
      setRequestMessage(getErrorMessage(requestError, "Хүсэлт илгээж чадсангүй."));
    }
  };

  const handleDeleteSchool = async () => {
    try {
      setError("");
      await deleteSchool(school_id);
      setCurrentSchool(null);
      navigate("/team1/schools");
    } catch (deleteError) {
      setError(
        getErrorMessage(deleteError, "Сургуулийг устгаж чадсангүй.")
      );
    }
  };

  if (loading) {
    return <div className="rounded-[2rem] bg-white px-6 py-16 text-center text-slate-500 shadow-sm">Сургуулийн мэдээлэл ачаалж байна...</div>;
  }

  if (error) {
    return <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-6 py-5 text-sm font-medium text-rose-600 shadow-sm">{error}</div>;
  }

  if (!school) {
    return <div className="rounded-[2rem] bg-white px-6 py-16 text-center text-slate-500 shadow-sm">Сургууль олдсонгүй.</div>;
  }

  return (
    <div className="space-y-8">
      <SchoolHeader
        school={school}
        canEdit={canCreateSchool(role)}
        canDelete={canCreateSchool(role)}
        onDelete={handleDeleteSchool}
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

        {isStudent(role) ? (
          <button
            type="button"
            onClick={handleSchoolAdminRequest}
            className="rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-600"
          >
            Сургуулийн админ хүсэх
          </button>
        ) : null}

        {requestMessage ? (
          <span className="self-center text-sm text-slate-500">{requestMessage}</span>
        ) : null}
      </div>

      <SchoolStats stats={stats} />
    </div>
  );
}
