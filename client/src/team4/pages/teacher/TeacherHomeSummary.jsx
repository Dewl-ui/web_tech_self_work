// Member B OWNS this file.
// This is the teacher section shown on the home dashboard (/team4).
// Add quick links, stats, or widgets for teacher here.
// Do NOT edit Home.jsx — edit this file instead.
import { useEffect, useState } from "react";
import { FaSchool } from "react-icons/fa";
import { FiBook, FiChevronRight, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { EmptyState } from "../../components/ui";
import { apiGet } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import useTeacherCoursesSummary from "./useTeacherCoursesSummary";

const PIE_COLORS = ["#2563eb", "#0f766e", "#7c3aed", "#d97706", "#dc2626", "#0891b2", "#65a30d", "#9333ea"];

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
      <FiChevronRight className="h-4 w-4 text-zinc-400" />
    </Link>
  );
}

export default function TeacherHomeSummary({ userId }) {
  const { school } = useAuth();
  const [schoolCount, setSchoolCount] = useState(0);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const { courses, loading: coursesLoading } = useTeacherCoursesSummary({
    userId,
    schoolId: school?.id,
  });

  useEffect(() => {
    if (!userId) {
      setSchoolCount(0);
      setSchoolsLoading(false);
      return;
    }

    setSchoolsLoading(true);

    apiGet(`/users/${userId}/schools`)
      .then((data) => setSchoolCount(data?.count ?? data?.items?.length ?? 0))
      .catch(() => setSchoolCount(0))
      .finally(() => setSchoolsLoading(false));
  }, [userId]);

  const loading = coursesLoading || schoolsLoading;

  const totalStudents = courses.reduce((sum, course) => sum + (course.userCount ?? 0), 0);
  const pieData = courses.map((course, index) => ({
    ...course,
    value: course.userCount ?? 0,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  })).filter((course) => course.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Миний хичээлүүд" value={courses.length} icon={<FiBook className="h-5 w-5" />} loading={loading} />
        <StatCard title="Нийт оюутан" value={totalStudents} icon={<FiUser className="h-5 w-5" />} loading={loading} />
        <StatCard title="Миний сургуулиуд" value={schoolCount} icon={<FaSchool className="h-5 w-5" />} loading={loading} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(260px,0.85fr)]">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-zinc-800">Хичээлүүдийн оюутны тоо</h2>
            <p className="mt-1 text-sm text-zinc-500">Тухайн сургууль дээрх таны хичээлүүдийн ачаалал.</p>
          </div>

          {loading ? (
            <div className="h-72 animate-pulse rounded-xl bg-zinc-100" />
          ) : pieData.length === 0 ? (
            <div className="py-10">
              <EmptyState title="Графикт үзүүлэх өгөгдөл алга" description="Одоогоор оюутантай хичээл байхгүй байна." />
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    labelLine
                    label={({ value }) => value}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.courseId} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} оюутан`, name]} />
                  <Legend verticalAlign="bottom" height={42} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-1 font-semibold text-zinc-800">Хурдан холбоосууд</h2>
          <p className="mb-4 text-sm text-zinc-500">Их ашиглагддаг үйлдлүүд.</p>
          <div className="space-y-2">
            <QuickLink to="/team4/users/create"    label="Оюутан бүртгэх" />
            <QuickLink to="/team4/profile"         label="Миний профайл" />
            <QuickLink to="/team4/schools/current" label="Сургууль солих" />
          </div>
        </div>
      </div>
    </div>
  );
}
