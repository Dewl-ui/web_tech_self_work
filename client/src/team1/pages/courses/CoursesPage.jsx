import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard";
import { mockCourses } from "../../data/mockCourses";
import { getCurrentSchool } from "../../utils/school";

const COLORS = [
  "#ec4899",
  "#6366f1",
  "#22c55e",
  "#06b6d4",
  "#8b5cf6",
  "#f97316",
];

const GRADIENTS = [
  "linear-gradient(135deg, #ec4899, #f43f5e)",
  "linear-gradient(135deg, #3b82f6, #06b6d4)",
  "linear-gradient(135deg, #22c55e, #84cc16)",
  "linear-gradient(135deg, #f97316, #ef4444)",
];

const normalizeCourses = (items = []) =>
  items.map((course, index) => ({
    ...course,
    id: course.id || Date.now() + Math.random() + index,
    teacher: course.teacher || "Багш",
    progress: course.progress || 0,
    color: course.color || COLORS[index % COLORS.length],
    code: course.code || "-",
  }));

export default function CoursesPage() {
  const navigate = useNavigate();
  const selectedSchool = useMemo(() => getCurrentSchool(), []);
  const role = localStorage.getItem("role");
  const isTeacherOrAdmin = role === "admin" || role === "teacher";
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [menuCourseId, setMenuCourseId] = useState(null);

  useEffect(() => {
    const existing = localStorage.getItem("courses");

    if (!existing) {
      localStorage.setItem("courses", JSON.stringify(mockCourses));
      return;
    }

    try {
      const parsed = JSON.parse(existing);
      const migrated = parsed.map((course, index) => ({
        ...course,
        id: course.id || Date.now() + Math.random() + index,
        school_id: Number(course.school_id) === 183 ? 184 : course.school_id,
      }));

      localStorage.setItem("courses", JSON.stringify(migrated));
    } catch {
      localStorage.setItem("courses", JSON.stringify(mockCourses));
    }
  }, []);

  useEffect(() => {
    if (!selectedSchool?.id) {
      setCourses([]);
      setLoading(false);
      return;
    }

    const stored = localStorage.getItem("courses");
    const allCourses = stored ? JSON.parse(stored) : [];
    const filtered = allCourses.filter(
      (course) => Number(course.school_id) === Number(selectedSchool.id)
    );

    setCourses(normalizeCourses(filtered));
    setLoading(false);
  }, [selectedSchool?.id]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) =>
      course.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [courses, search]);

  const handleDelete = (id) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));

    const stored = localStorage.getItem("courses");
    const allCourses = stored ? JSON.parse(stored) : [];
    const updatedCourses = allCourses.filter((course) => course.id !== id);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setMenuCourseId(null);
  };

  const handleEdit = (id) => {
    navigate(`/team1/courses/edit/${id}`);
  };

  const handleBookmarkToggle = (id) => {
    const updateBookmark = (items) =>
      items.map((course) =>
        Number(course.id) === Number(id)
          ? { ...course, bookmarked: !course.bookmarked }
          : course
      );

    setCourses((prev) => updateBookmark(prev));

    const stored = localStorage.getItem("courses");
    const allCourses = stored ? JSON.parse(stored) : [];
    localStorage.setItem("courses", JSON.stringify(updateBookmark(allCourses)));
    setMenuCourseId(null);
  };

  const handleMenuToggle = (id) => {
    setMenuCourseId((prev) => (prev === id ? null : id));
  };

  const getHeaderBackground = (course, index) => {
    if (course.color && course.color.startsWith("#")) {
      return course.color;
    }

    return COLORS[index % COLORS.length];
  };

  const getGradientBackground = (course, index) => {
    if (course.color && course.color.startsWith("#")) {
      return `linear-gradient(135deg, ${course.color}, ${COLORS[(index + 1) % COLORS.length]})`;
    }

    return GRADIENTS[index % GRADIENTS.length];
  };

  if (!selectedSchool?.id) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        Эхлээд сургууль сонгоно уу.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">Ачаалалж байна...</div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            {selectedSchool.name} -ийн хичээлүүд
          </h1>
          <p className="mt-2 text-slate-500">
            Сонгогдсон сургуулийн хичээлүүд харагдана.
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            type="button"
            onClick={() => navigate("/team1/courses/create")}
            className="rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white"
          >
            + Хичээл нэмэх
          </button>
        )}
      </div>

      <div className="rounded-[2rem] bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <input
            type="text"
            placeholder="Хайх"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="Grid view"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition ${
                view === "grid"
                  ? "border-indigo-500 bg-indigo-500 text-white shadow-[0_8px_20px_rgba(99,102,241,0.35)]"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span className="grid grid-cols-2 gap-[2px]">
                <span className="h-[4px] w-[4px] rounded-[1px] bg-current" />
                <span className="h-[4px] w-[4px] rounded-[1px] bg-current" />
                <span className="h-[4px] w-[4px] rounded-[1px] bg-current" />
                <span className="h-[4px] w-[4px] rounded-[1px] bg-current" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="List view"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition ${
                view === "list"
                  ? "border-indigo-500 bg-indigo-500 text-white shadow-[0_8px_20px_rgba(99,102,241,0.35)]"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span className="flex flex-col gap-[3px]">
                <span className="h-[2px] w-3 rounded-full bg-current" />
                <span className="h-[2px] w-3 rounded-full bg-current" />
                <span className="h-[2px] w-3 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <p>Илэрц олдсонгүй</p>
      ) : view === "list" ? (
        <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-[140px_minmax(0,1.8fr)_120px_140px_52px] gap-4 border-b border-slate-100 px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            <span>Сургалт</span>
            <span>Хичээлийн нэр</span>
            <span>Код</span>
            <span>Багш</span>
            <span />
          </div>

          {filteredCourses.map((course, index) => (
            <div
              key={course.id}
              className="grid grid-cols-[140px_minmax(0,1.8fr)_120px_140px_52px] items-center gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0"
            >
              <div
                className="relative h-[86px] w-[126px] rounded-xl"
                style={{ background: getGradientBackground(course, index) }}
              >
                {course.bookmarked && (
                  <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 shadow">
                    ★
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => navigate(`/team1/courses/${course.id}`)}
                className="min-w-0 text-left"
              >
                <h3 className="truncate font-bold text-slate-800">{course.name}</h3>
                <div className="mt-3 h-1.5 rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${course.progress || 0}%` }}
                  />
                </div>
                <small className="mt-2 block text-xs font-semibold text-indigo-500">
                  {course.progress || 0}%
                </small>
              </button>

              <div className="text-sm text-slate-500">{course.code || "Код"}</div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-base">
                  👤
                </span>
                <span className="truncate">{course.teacher || "Багшийн нэр"}</span>
              </div>

              <div className="relative flex justify-end">
                <button
                  type="button"
                  onClick={() => handleMenuToggle(course.id)}
                  className="px-1 text-xl text-gray-400 hover:text-gray-600"
                >
                  ⋮
                </button>

                {menuCourseId === course.id && (
                  <div className="absolute right-0 top-9 z-50 min-w-[150px] overflow-hidden rounded-xl bg-white shadow-[0_10px_25px_rgba(15,23,42,0.15)]">
                    <button
                      type="button"
                      onClick={() => handleBookmarkToggle(course.id)}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {course.bookmarked ? "Тэмдэглэхгүй" : "Тэмдэглэх"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(course.id)}
                      className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50"
                    >
                      Хасах
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              index={index}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onBookmarkToggle={handleBookmarkToggle}
              onMenuToggle={handleMenuToggle}
              menuOpen={menuCourseId === course.id}
              isTeacherOrAdmin={isTeacherOrAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
