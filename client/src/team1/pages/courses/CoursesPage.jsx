import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard";
import useTeam1Role from "../../hooks/useTeam1Role";
import useTeam1School from "../../hooks/useTeam1School";
import { deleteCourse, getCoursesBySchool } from "../../services/courseService";
import { getLessonsByCourse } from "../../services/lessonService";
import { createRequest } from "../../services/requestService";
import { getCourseUsers } from "../../services/courseUserService";
import {
  getAverageProgress,
  getSubmissionLessonCount,
  getUserProgress,
} from "../../utils/courseMetrics";
import {
  canCreateCourse,
  getCompletedLessonIds,
  getCurrentUserProfile,
  getErrorMessage,
  isSchoolAdmin,
  isStudent,
  setCurrentCourse,
} from "../../utils/school";

const COLORS = ["#ec4899", "#6366f1", "#22c55e", "#06b6d4", "#8b5cf6", "#f97316"];
const GRADIENTS = [
  "linear-gradient(135deg, #ec4899, #f43f5e)",
  "linear-gradient(135deg, #3b82f6, #06b6d4)",
  "linear-gradient(135deg, #22c55e, #84cc16)",
  "linear-gradient(135deg, #f97316, #ef4444)",
];

function normalizeCourses(items = []) {
  return items.map((course, index) => ({
    ...course,
    id: course.id || course.course_id || index + 1,
    name: course.name || course.course_name || "Хичээл",
    teacher: course.teacher?.name || course.teacher_name || "Багш",
    progress: Number(course.progress || 0),
    color: course.color || COLORS[index % COLORS.length],
    code: course.code || course.course_code || "—",
    studentCount:
      course.studentCount || course.students || course.user_count || course.users || 0,
  }));
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const selectedSchool = useTeam1School();
  const role = useTeam1Role();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [menuCourseId, setMenuCourseId] = useState(null);
  const [error, setError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [completionVersion, setCompletionVersion] = useState(0);

  useEffect(() => {
    const handleCompletionChange = () => setCompletionVersion((value) => value + 1);
    window.addEventListener("team1-lesson-completion-change", handleCompletionChange);
    return () =>
      window.removeEventListener("team1-lesson-completion-change", handleCompletionChange);
  }, []);

  useEffect(() => {
    if (!selectedSchool?.id) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadCourses = async () => {
      try {
        const items = await getCoursesBySchool(selectedSchool.id);
        const normalizedCourses = normalizeCourses(items);
        const currentUser = getCurrentUserProfile();

        const metrics = await Promise.all(
          normalizedCourses.map(async (course) => {
            try {
              const [users, lessons] = await Promise.all([
                getCourseUsers(course.id),
                getLessonsByCourse(course.id),
              ]);

              const progressBaseCount =
                getSubmissionLessonCount(lessons) || lessons.length;
              const localCompletedCount = getCompletedLessonIds(course.id).length;
              const currentUserId = String(
                currentUser?.id || currentUser?.email || currentUser?.username || ""
              );
              const localOverrides = currentUserId
                ? { [currentUserId]: localCompletedCount }
                : {};
              const currentUserItem = (users || []).find((user) => {
                const userKey = String(
                  user?.user_id || user?.id || user?.email || user?.username || ""
                );
                return currentUserId && userKey === currentUserId;
              });
              const studentProgress = currentUserItem
                ? getUserProgress(currentUserItem, progressBaseCount, localCompletedCount)
                : progressBaseCount > 0
                  ? Math.round((localCompletedCount / progressBaseCount) * 100)
                  : 0;

              return {
                id: course.id,
                progress: isStudent(role)
                  ? studentProgress
                  : getAverageProgress(
                      users,
                      progressBaseCount,
                      course.progress,
                      localOverrides
                    ),
                studentCount: users.length,
              };
            } catch {
              return {
                id: course.id,
                progress: course.progress || 0,
                studentCount: course.studentCount || 0,
              };
            }
          })
        );

        if (!isMounted) return;

        setCourses(
          normalizedCourses.map((course) => {
            const metric = metrics.find((item) => Number(item.id) === Number(course.id));
            return metric
              ? {
                  ...course,
                  progress: metric.progress,
                  studentCount: metric.studentCount,
                }
              : course;
          })
        );
      } catch (loadError) {
        if (isMounted) {
          setError(getErrorMessage(loadError, "Хичээлүүдийг ачаалж чадсангүй."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, [selectedSchool?.id, role, completionVersion]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) =>
      String(course.name || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [courses, search]);

  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(selectedSchool.id, courseId);
      setCourses((prev) =>
        prev.filter((course) => Number(course.id) !== Number(courseId))
      );
      setMenuCourseId(null);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Хичээл устгаж чадсангүй."));
    }
  };

  const handleEdit = (courseId) => {
    navigate(`/team1/courses/edit/${courseId}`);
  };

  const handleBookmarkToggle = (courseId) => {
    setCourses((prev) =>
      prev.map((course) =>
        Number(course.id) === Number(courseId)
          ? { ...course, bookmarked: !course.bookmarked }
          : course
      )
    );
    setMenuCourseId(null);
  };

  const handleMenuToggle = (courseId) => {
    setMenuCourseId((prev) => (prev === courseId ? null : courseId));
  };

  const handleTeacherRequest = async (courseId) => {
    try {
      setRequestMessage("");
      await createRequest({
        type: "teacher",
        course_id: Number(courseId),
      });
      setRequestMessage("Багшийн хүсэлт илгээгдлээ.");
    } catch (requestError) {
      setRequestMessage(getErrorMessage(requestError, "Хүсэлт илгээж чадсангүй."));
    }
  };

  const handleCourseAction = async () => {
    if (canCreateCourse(role)) {
      navigate("/team1/courses/create", {
        state: { school: selectedSchool },
      });
      return;
    }

    try {
      setError("");
      setRequestMessage("");
      await createRequest({
        type: "teacher",
        school_id: Number(selectedSchool.id),
      });
      setRequestMessage("Багш болох хүсэлтийг системийн админ руу илгээлээ.");
    } catch (requestError) {
      setRequestMessage(getErrorMessage(requestError, "Хүсэлт илгээж чадсангүй."));
    }
  };

  const getGradientBackground = (course, index) => {
    if (course.color && String(course.color).startsWith("#")) {
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
    return <div className="rounded-2xl bg-white p-6 shadow-sm">Ачаалж байна...</div>;
  }

  return (
    <div className="space-y-6 px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            {selectedSchool.name}-ийн хичээлүүд
          </h1>
          <p className="mt-2 text-slate-500">
            Сонгогдсон сургуулийн бүх хичээл энд харагдана.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCourseAction}
          className="rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white"
        >
          {canCreateCourse(role) ? "+ Хичээл нэмэх" : "Багш эрх хүсэх"}
        </button>
      </div>

      {requestMessage ? (
        <div className="rounded-xl bg-sky-50 px-4 py-3 text-sky-600">{requestMessage}</div>
      ) : null}
      {error ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</div>
      ) : null}

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
              aria-label="Карт харагдац"
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
              aria-label="Жагсаалт харагдац"
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
        <p className="text-slate-500">Илэрц олдсонгүй.</p>
      ) : view === "list" ? (
        <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-[140px_minmax(0,1.8fr)_120px_140px_110px_52px] gap-4 border-b border-slate-100 px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            <span>Сургалт</span>
            <span>Хичээлийн нэр</span>
            <span>Код</span>
            <span>Багш</span>
            <span>Сурагч</span>
            <span />
          </div>

          {filteredCourses.map((course, index) => (
            <div
              key={course.id}
              className="grid grid-cols-[140px_minmax(0,1.8fr)_120px_140px_110px_52px] items-center gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0"
            >
              <div
                className="relative h-[86px] w-[126px] rounded-xl"
                style={{ background: getGradientBackground(course, index) }}
              >
                {course.bookmarked ? (
                  <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 shadow">
                    ★
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentCourse(course);
                  navigate(`/team1/courses/${course.id}`);
                }}
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

              <div className="text-sm text-slate-500">{course.code || "—"}</div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-base">
                  👤
                </span>
                <span className="truncate">{course.teacher || "Багш"}</span>
              </div>

              <div className="text-sm font-semibold text-slate-600">
                {course.studentCount || 0} сурагч
              </div>

              <div className="relative flex justify-end">
                <button
                  type="button"
                  onClick={() => handleMenuToggle(course.id)}
                  className="px-1 text-xl text-gray-400 hover:text-gray-600"
                >
                  ⋮
                </button>

                {menuCourseId === course.id ? (
                  <div className="absolute right-0 top-9 z-50 min-w-[170px] overflow-hidden rounded-xl bg-white shadow-[0_10px_25px_rgba(15,23,42,0.15)]">
                    <button
                      type="button"
                      onClick={() => handleBookmarkToggle(course.id)}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {course.bookmarked ? "Тэмдэглэхгүй" : "Тэмдэглэх"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/team1/courses/${course.id}/report`)}
                      className="w-full px-4 py-3 text-left text-sm text-sky-600 hover:bg-sky-50"
                    >
                      Тайлан харах
                    </button>
                    {isSchoolAdmin(role) ? (
                      <button
                        type="button"
                        onClick={() => handleTeacherRequest(course.id)}
                        className="w-full px-4 py-3 text-left text-sm text-indigo-500 hover:bg-indigo-50"
                      >
                        Багш хүсэх
                      </button>
                    ) : null}
                    {canCreateCourse(role) ? (
                      <button
                        type="button"
                        onClick={() => handleDelete(course.id)}
                        className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50"
                      >
                        Хасах
                      </button>
                    ) : null}
                  </div>
                ) : null}
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
              onHide={handleDelete}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onBookmarkToggle={handleBookmarkToggle}
              onMenuToggle={handleMenuToggle}
              menuOpen={menuCourseId === course.id}
              isTeacherOrAdmin={canCreateCourse(role)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
