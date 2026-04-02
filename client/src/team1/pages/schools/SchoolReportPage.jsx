import { useEffect, useMemo, useState } from "react";
import SchoolStats from "../../components/school/SchoolStats";
import { getCourses } from "../../services/courseService";
import { getSchools } from "../../services/schoolService";
import { getCurrentSchool } from "../../utils/school";

function extractItems(res) {
  if (Array.isArray(res?.data?.items)) {
    return res.data.items;
  }

  if (Array.isArray(res?.data?.data)) {
    return res.data.data;
  }

  if (Array.isArray(res?.data)) {
    return res.data;
  }

  return [];
}

export default function SchoolReportPage() {
  const [schools, setSchools] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentSchool = getCurrentSchool();

  useEffect(() => {
    let isMounted = true;

    Promise.all([getSchools(), getCourses()])
      .then(([schoolsRes, coursesRes]) => {
        if (!isMounted) {
          return;
        }

        const schoolItems = extractItems(schoolsRes);
        const courseItems = extractItems(coursesRes);
        const filteredCourses = currentSchool?.id
          ? courseItems.filter((course) => Number(course.school_id) === Number(currentSchool.id))
          : courseItems;

        setSchools(schoolItems);
        setCourses(filteredCourses);
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(loadError.message || "Тайлангийн мэдээлэл ачаалж чадсангүй.");
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
  }, [currentSchool?.id]);

  const stats = useMemo(() => {
    return [
      { key: "schools", label: "Нийт сургууль", value: schools.length },
      { key: "courses", label: "Нийт хичээл", value: courses.length },
      { key: "students", label: "Нийт оюутан", value: 120 },
      { key: "rating", label: "Дундаж үнэлгээ", value: 4.5 },
    ];
  }, [schools.length, courses.length]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
          School Report
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Сургуулийн тайлан
        </h1>
      </section>

      {loading ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
          Тайлан ачаалж байна...
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-6 py-5 text-sm font-medium text-rose-600 shadow-sm">
          {error}
        </div>
      ) : (
        <>
          <SchoolStats stats={stats} />

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Товч мэдээлэл</h2>
            <div className="mt-4 space-y-2 text-slate-700">
              <h2>Нийт хичээл: {courses.length}</h2>
              <h2>Нийт оюутан: 120</h2>
              <h2>Дундаж үнэлгээ: 4.5</h2>
              {currentSchool ? <h2>Сонгосон сургууль: {currentSchool.name}</h2> : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
