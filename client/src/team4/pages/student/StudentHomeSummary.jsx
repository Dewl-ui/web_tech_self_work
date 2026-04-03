// Member C OWNS this file.
// This is the student section shown on the home dashboard (/team4).
// Add quick links, stats, or widgets for student here.
// Do NOT edit Home.jsx — edit this file instead.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBook } from "react-icons/fi";
import { apiGet, parseField } from "../../utils/api";

function StatCard({ title, value, icon, loading }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          {loading ? (
            <div className="mt-2 h-8 w-16 animate-pulse rounded-md bg-zinc-100" />
          ) : (
            <p className="mt-1 text-3xl font-bold text-zinc-900">{value ?? "—"}</p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
          {icon}
        </div>
      </div>
    </div>
  );
}

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

export default function StudentHomeSummary({ userId }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    apiGet(`/users/${userId}/courses`)
      .then((data) => setCourses(data?.items ?? []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Миний хичээлүүд" value={courses.length} icon={<FiBook className="h-5 w-5" />} loading={loading} />
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
              return (
                <div key={courseId ?? i} className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-800">{courseName}</p>
                    {group?.name && (
                      <p className="text-xs text-zinc-400">Бүлэг: {group.name}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-zinc-800">Хурдан холбоосууд</h2>
        <div className="space-y-2">
          <QuickLink to="/team4/profile"                  label="Миний профайл" />
          <QuickLink to="/team4/profile/change-password"  label="Нууц үг солих" />
          <QuickLink to="/team4/schools/current"          label="Сургууль солих" />
          {/* Member C: add more QuickLink entries here */}
        </div>
      </div>
    </div>
  );
}
