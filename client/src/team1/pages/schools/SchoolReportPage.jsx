import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SchoolStats from "../../components/school/SchoolStats";
import { getCategoriesBySchool } from "../../services/categoryService";
import { getCoursesBySchool } from "../../services/courseService";
import { getCourseUsers } from "../../services/courseUserService";
import { getAverageProgress } from "../../utils/courseMetrics";
import { getCurrentSchool, getErrorMessage } from "../../utils/school";

function GraphCard({ title, items, color = "bg-indigo-500" }) {
  const maxValue = Math.max(1, ...items.map((item) => Number(item.value || 0)));

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
            Мэдээлэл алга.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.key} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{item.label}</span>
                <span className="font-semibold text-slate-500">{item.value}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className={`h-3 rounded-full ${color}`}
                  style={{ width: `${(Number(item.value || 0) / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function SchoolReportPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseUsers, setCourseUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentSchool = getCurrentSchool();

  useEffect(() => {
    if (!currentSchool?.id) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadData = async () => {
      try {
        const [categoryItems, courseItems] = await Promise.all([
          getCategoriesBySchool(currentSchool.id),
          getCoursesBySchool(currentSchool.id),
        ]);

        const userEntries = await Promise.all(
          (courseItems || []).map(async (course) => {
            try {
              const users = await getCourseUsers(course.id);
              return [course.id, users];
            } catch {
              return [course.id, []];
            }
          })
        );

        if (!isMounted) return;

        setCategories(categoryItems || []);
        setCourses(courseItems || []);
        setCourseUsers(Object.fromEntries(userEntries));
      } catch (loadError) {
        if (isMounted) {
          setError(getErrorMessage(loadError, "Тайлангийн мэдээлэл ачаалж чадсангүй."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [currentSchool?.id]);

  const stats = useMemo(() => {
    const totalStudents = Object.values(courseUsers).reduce(
      (sum, users) => sum + users.length,
      0
    );

    const averageProgress =
      courses.length > 0
        ? Math.round(
            courses.reduce((sum, course) => {
              const users = courseUsers[course.id] || [];
              return sum + getAverageProgress(users, 0, course.progress || 0);
            }, 0) / courses.length
          )
        : 0;

    return [
      { key: "categories", label: "Нийт ангилал", value: categories.length },
      { key: "courses", label: "Нийт хичээл", value: courses.length },
      { key: "students", label: "Нийт сурагч", value: totalStudents },
      { key: "progress", label: "Дундаж явц", value: `${averageProgress}%` },
    ];
  }, [categories.length, courses, courseUsers]);

  const categoryGraph = useMemo(
    () =>
      categories.map((category) => ({
        key: `category-${category.id}`,
        label: category.name || "Ангилал",
        value: courses.filter(
          (course) => Number(course?.category_id) === Number(category.id)
        ).length,
      })),
    [categories, courses]
  );

  const courseGraph = useMemo(
    () =>
      courses.map((course) => ({
        key: `course-${course.id}`,
        label: course.name || "Хичээл",
        value: (courseUsers[course.id] || []).length,
      })),
    [courses, courseUsers]
  );

  const progressGraph = useMemo(
    () =>
      courses.map((course) => ({
        key: `progress-${course.id}`,
        label: course.name || "Хичээл",
        value: getAverageProgress(courseUsers[course.id] || [], 0, course.progress || 0),
      })),
    [courses, courseUsers]
  );

  return (
    <div className="space-y-8 px-6 py-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-3 text-sm text-indigo-500 hover:underline"
        >
          ← Буцах
        </button>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
          Тайлан
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Сургуулийн тайлан
        </h1>
        <p className="mt-2 text-slate-500">{currentSchool?.name || "Сургууль"}</p>
      </section>

      {loading ? (
        <div className="rounded-[2rem] bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
          Тайлан ачаалж байна...
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-6 py-5 text-sm font-medium text-rose-600 shadow-sm">
          {error}
        </div>
      ) : (
        <>
          <SchoolStats stats={stats} />
          <div className="grid gap-6 lg:grid-cols-2">
            <GraphCard title="Ангилал тус бүрийн хичээл" items={categoryGraph} />
            <GraphCard
              title="Хичээл тус бүрийн сурагч"
              items={courseGraph}
              color="bg-emerald-500"
            />
            <div className="lg:col-span-2">
              <GraphCard
                title="Хичээл тус бүрийн дундаж явц"
                items={progressGraph}
                color="bg-fuchsia-500"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
