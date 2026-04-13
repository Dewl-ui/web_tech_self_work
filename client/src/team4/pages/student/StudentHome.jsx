import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBook,
  FiCalendar,
  FiFileText,
  FiClipboard,
  FiClock,
  FiDollarSign,
  FiCompass,
} from "react-icons/fi";
import { useAuth } from "../../utils/AuthContext";
import { parseField } from "./api/studentCourseApi";
import { getStudentDashboardData } from "./api/studentDashboard";
import { StatCard } from "../../components/ui/StatCard";
import { useToast } from "../../components/ui/Toast";

function fmt(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function fmtTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function StudentHome({ userId: userIdProp }) {
  const { user, school } = useAuth();
  const userId = userIdProp ?? user?.id;
  const schoolId = school?.id;
  const toast = useToast();

  const [dashboard, setDashboard] = useState({
    courses: [],
    exams: [],
    schools: [],
    catalog: [],
    categories: [],
    paymentPolicy: null,
    lessonsByCourse: {},
    stats: {
      enrolledCourses: 0,
      activeCourses: 0,
      totalLessons: 0,
      openExams: 0,
      totalExams: 0,
      submissionLessons: 0,
      schoolCount: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getStudentDashboardData({ userId, schoolId })
      .then((data) => setDashboard(data))
      .catch((err) => {
        const message = err?.message || "Оюутны dashboard мэдээлэл ачааллахад алдаа гарлаа.";
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, [userId, schoolId]);

  const upcomingExams = (dashboard.exams || [])
    .slice()
    .sort((a, b) => new Date(a?.open_on || 0) - new Date(b?.open_on || 0))
    .slice(0, 4);

  const enrolledCourseIds = new Set(
    (dashboard.courses || []).map((item) => {
      const course = parseField(item, "course") ?? {};
      return course.id ?? item.course_id;
    })
  );

  const exploreCourses = (dashboard.catalog || [])
    .filter((c) => !enrolledCourseIds.has(c.id))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Миний хичээлүүд"
          value={loading ? "..." : dashboard.stats.enrolledCourses}
          icon={<FiBook className="h-5 w-5" />}
          description={loading ? "" : `${dashboard.stats.activeCourses} идэвхтэй`}
        />
        <StatCard
          title="Нийт хичээлийн контент"
          value={loading ? "..." : dashboard.stats.totalLessons}
          icon={<FiFileText className="h-5 w-5" />}
          description={loading ? "" : `Илгээхтэй: ${dashboard.stats.submissionLessons}`}
        />
        <StatCard
          title="Нээлттэй шалгалт"
          value={loading ? "..." : dashboard.stats.openExams}
          icon={<FiClipboard className="h-5 w-5" />}
          description={loading ? "" : `Нийт: ${dashboard.stats.totalExams}`}
        />
        <StatCard
          title="Миний сургуулиуд"
          value={loading ? "..." : dashboard.stats.schoolCount}
          icon={<FiCalendar className="h-5 w-5" />}
          description="Элссэн сургууль"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Enrolled courses */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-zinc-800">Бүртгэлтэй хичээлүүд</h2>
          {loading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-zinc-100" />)}
            </div>
          ) : dashboard.courses.length === 0 ? (
            <p className="text-sm text-zinc-400">Та ямар нэг хичээлд бүртгэлгүй байна</p>
          ) : (
            <div className="space-y-2">
              {dashboard.courses.map((item, i) => {
                const course = parseField(item, "course") ?? {};
                const courseId = course.id ?? item.id ?? item.course_id;
                const courseName = course.name ?? `Хичээл #${courseId}`;
                const group = parseField(item, "group");
                const lessonCount = (dashboard.lessonsByCourse?.[courseId] ?? []).length;
                const submissionCount = (dashboard.lessonsByCourse?.[courseId] ?? []).filter(
                  (lesson) => Number(lesson?.has_submission) === 1
                ).length;

                return (
                  <div key={courseId ?? i} className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-800 truncate">{courseName}</p>
                      {group?.name && (
                        <p className="text-xs text-zinc-400">Бүлэг: {group.name}</p>
                      )}
                      <p className="mt-0.5 text-xs text-zinc-400">
                        Контент: {lessonCount} • Илгээхтэй: {submissionCount}
                      </p>
                    </div>
                    <Link
                      to={`/team4/student/courses/${courseId}`}
                      className="shrink-0 rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      Дэлгэрэнгүй
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming exams */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <FiClock className="h-4 w-4 text-zinc-500" />
            <h2 className="font-semibold text-zinc-800">Ирэх шалгалтууд</h2>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-zinc-100" />)}
            </div>
          ) : upcomingExams.length === 0 ? (
            <p className="text-sm text-zinc-400">Шалгалт байхгүй байна</p>
          ) : (
            <ul className="space-y-2">
              {upcomingExams.map((exam) => (
                <li key={exam.id} className="rounded-lg border border-zinc-100 px-3 py-2">
                  <p className="truncate text-sm font-medium text-zinc-800">{exam.name}</p>
                  <p className="truncate text-xs text-zinc-400">
                    {exam.course?.name ?? `Хичээл #${exam.course_id}`}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {fmt(exam.open_on)} {fmtTime(exam.open_on)} • {exam.duration} мин
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Explore catalog */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <FiCompass className="h-4 w-4 text-zinc-500" />
            <h2 className="font-semibold text-zinc-800">Сургуулийн бусад хичээлүүд</h2>
          </div>
          {loading ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-zinc-100" />)}
            </div>
          ) : exploreCourses.length === 0 ? (
            <p className="text-sm text-zinc-400">Каталогт хичээл байхгүй.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {exploreCourses.map((course) => (
                <div key={course.id} className="rounded-lg border border-zinc-100 px-3 py-2">
                  <p className="truncate text-sm font-medium text-zinc-800">{course.name}</p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {fmt(course.start_on)} – {fmt(course.end_on)}
                  </p>
                </div>
              ))}
            </div>
          )}
          {!loading && dashboard.categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {dashboard.categories.slice(0, 8).map((cat) => (
                <span key={cat.id} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Payment policy */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <FiDollarSign className="h-4 w-4 text-zinc-500" />
            <h2 className="font-semibold text-zinc-800">Төлбөрийн бодлого</h2>
          </div>
          {loading ? (
            <div className="h-20 animate-pulse rounded-lg bg-zinc-100" />
          ) : !dashboard.paymentPolicy ? (
            <p className="text-sm text-zinc-400">Мэдээлэл байхгүй</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              <li className="flex justify-between">
                <span className="text-zinc-500">Зөвшөөрөх өр</span>
                <span className="font-medium text-zinc-800">
                  {dashboard.paymentPolicy.max_debt ?? 0}₮
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500">Хугацаа</span>
                <span className="font-medium text-zinc-800">
                  {dashboard.paymentPolicy.payment_due_days ?? 0} хоног
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500">Бодлого</span>
                <span className="font-medium text-zinc-800">
                  {dashboard.paymentPolicy.payment_policy ?? "—"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500">Хязгаарлалт</span>
                <span className="font-medium text-zinc-800">
                  {dashboard.paymentPolicy.restriction_policy ?? "—"}
                </span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
