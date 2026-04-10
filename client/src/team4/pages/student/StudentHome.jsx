import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBook, FiCalendar, FiFileText, FiClipboard } from "react-icons/fi";
import { parseField } from "./api/studentCourseApi";
import { getStudentDashboardData } from "./api/studentDashboard";
import { StatCard } from "../../components/ui/StatCard";
import { useToast } from "../../components/ui/Toast";

function QuickLink({ to, label }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white
        px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
    >
      {label}
    </Link>
  );
}

export default function StudentHome({ userId }) {
  const toast = useToast();
  const [dashboard, setDashboard] = useState({
    courses: [],
    exams: [],
    lessonsByCourse: {},
    stats: {
      enrolledCourses: 0,
      activeCourses: 0,
      totalLessons: 0,
      openExams: 0,
      totalExams: 0,
      submissionLessons: 0,
    },
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getStudentDashboardData({ userId })
      .then((data) => {
        setDashboard(data);
        setCourses(data.courses ?? []);
      })
      .catch((err) => {
        const message = err?.message || "Оюутны dashboard мэдээлэл ачааллахад алдаа гарлаа.";
        setError(message);
        toast.error(message);
        setDashboard((prev) => ({ ...prev, courses: [], exams: [] }));
        setCourses([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
          description={loading ? "" : `Лаб/даалгавар: ${dashboard.stats.submissionLessons}`}
        />
        <StatCard
          title="Нээлттэй шалгалт"
          value={loading ? "..." : dashboard.stats.openExams}
          icon={<FiClipboard className="h-5 w-5" />}
          description={loading ? "" : `Нийт шалгалт: ${dashboard.stats.totalExams}`}
        />
        <StatCard
          title="Хуанлийн хуудас"
          value={loading ? "..." : dashboard.stats.submissionLessons}
          icon={<FiCalendar className="h-5 w-5" />}
          description="Илгээхтэй контент"
        />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-zinc-800">Бүртгэлтэй хичээлүүд</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-zinc-100" />)}
          </div>
        ) : courses.length === 0 ? (
          <p className="text-sm text-zinc-400">Та ямар нэг хичээлд бүртгэлгүй байна</p>
        ) : (
          <div className="space-y-2">
            {courses.map((item, i) => {
              const course = parseField(item, "course") ?? {};
              const courseId = course.id ?? item.id ?? item.course_id;
              const courseName = course.name ?? course.title ?? `Хичээл #${courseId}`;
              const group = parseField(item, "group");
              const lessonCount = (dashboard.lessonsByCourse?.[courseId] ?? []).length;
              const submissionCount = (dashboard.lessonsByCourse?.[courseId] ?? []).filter(
                (lesson) => Number(lesson?.has_submission) === 1
              ).length;

              return (
                <div key={courseId ?? i} className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{courseName}</p>
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

      {/* <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-zinc-800">Хурдан холбоосууд</h2>
        <div className="space-y-2">
          <QuickLink to="/team4/student"                  label="Миний хичээлүүд" />
          <QuickLink to="/team4/student/groups"           label="Миний баг" />
          <QuickLink to="/team4/student/calendar"         label="Миний хуанли" />
          <QuickLink to="/team4/profile"                  label="Миний профайл" />
          <QuickLink to="/team4/profile/change-password"  label="Нууц үг солих" />
          <QuickLink to="/team4/schools/current"          label="Сургууль солих" />
        </div>
      </div> */}
    </div>
  );
}
