import { Link } from "react-router-dom";
import { FiBook, FiCalendar, FiClipboard, FiClock, FiCompass, FiHome } from "react-icons/fi";
import { useAuth } from "../../utils/AuthContext";
import { getStudentDashboardData } from "./api/studentDashboard";
import { StatCard } from "../../components/ui/StatCard";
import { useStudentData } from "./hooks";
import { fmt, fmtTime } from "./utils";
import PageHeader from "./components/PageHeader";

const CARD = "rounded-xl border border-zinc-200 bg-white p-5";

export default function StudentHome({ userId: userIdProp }) {
  const { user, school } = useAuth();
  const userId = userIdProp ?? user?.id;
  const schoolId = school?.id;

  const { data, loading, error } = useStudentData(
    () => getStudentDashboardData({ userId, schoolId }),
    [userId, schoolId]
  );

  const stats = data?.stats ?? { enrolledCourses: 0, openExams: 0, totalExams: 0, schoolCount: 0 };
  const courses = data?.courses ?? [];
  const exams = data?.exams ?? [];
  const catalog = data?.catalog ?? [];
  const categories = data?.categories ?? [];

  const upcomingExams = exams
    .slice()
    .sort((a, b) => new Date(a?.open_on || 0) - new Date(b?.open_on || 0))
    .slice(0, 4);

  const enrolledIds = new Set(courses.map((item) => item.course?.id ?? item.course_id));
  const exploreCourses = catalog.filter((c) => !enrolledIds.has(c.id)).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader icon={FiHome} title="Нүүр хуудас" subtitle="Таны хичээл, шалгалт, мэдээллийн товчлол" />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Миний хичээлүүд"
          value={loading ? "..." : stats.enrolledCourses}
          icon={<FiBook className="h-5 w-5" />}
          description="Бүртгэлтэй хичээл"
        />
        <StatCard
          title="Нээлттэй шалгалт"
          value={loading ? "..." : stats.openExams}
          icon={<FiClipboard className="h-5 w-5" />}
          description={loading ? "" : `Нийт: ${stats.totalExams}`}
        />
        <StatCard
          title="Миний сургуулиуд"
          value={loading ? "..." : stats.schoolCount}
          icon={<FiCalendar className="h-5 w-5" />}
          description="Элссэн сургууль"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className={`lg:col-span-2 ${CARD}`}>
          <h2 className="mb-3 font-semibold text-zinc-800">Бүртгэлтэй хичээлүүд</h2>
          {loading ? (
            <SkeletonRows count={2} />
          ) : courses.length === 0 ? (
            <p className="text-sm text-zinc-400">Та ямар нэг хичээлд бүртгэлгүй байна</p>
          ) : (
            <div className="space-y-2">
              {courses.map((item) => {
                const course = item.course ?? {};
                const courseId = course.id ?? item.course_id;
                const group = item.group ?? null;
                return (
                  <div key={courseId} className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-800">
                        {course.name ?? `Хичээл #${courseId}`}
                      </p>
                      {group?.name && (
                        <p className="text-xs text-zinc-400">Бүлэг: {group.name}</p>
                      )}
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

        <div className={CARD}>
          <div className="mb-3 flex items-center gap-2">
            <FiClock className="h-4 w-4 text-zinc-500" />
            <h2 className="font-semibold text-zinc-800">Ирэх шалгалтууд</h2>
          </div>
          {loading ? (
            <SkeletonRows count={2} />
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

      <div className={CARD}>
        <div className="mb-3 flex items-center gap-2">
          <FiCompass className="h-4 w-4 text-zinc-500" />
          <h2 className="font-semibold text-zinc-800">Сургуулийн бусад хичээлүүд</h2>
        </div>
        {loading ? (
          <SkeletonRows count={2} />
        ) : exploreCourses.length === 0 ? (
          <p className="text-sm text-zinc-400">Каталогт хичээл байхгүй.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
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
        {!loading && categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {categories.slice(0, 8).map((cat) => (
              <span key={cat.id} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonRows({ count = 2 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-zinc-100" />
      ))}
    </div>
  );
}
