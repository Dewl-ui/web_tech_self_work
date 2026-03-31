import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiShield, FiBook, FiChevronRight } from "react-icons/fi";
import { useAuth } from "../../utils/AuthContext";
import { apiGet, parseField } from "../../utils/api";

// ── Stat card (inline, no extra import needed) ────────────────────────────────
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

// ── Admin dashboard ───────────────────────────────────────────────────────────
function AdminDashboard({ userId }) {
  const [stats, setStats] = useState({ users: null, roles: null, schools: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      apiGet("/users"),
      apiGet("/roles"),
      userId ? apiGet(`/users/${userId}/schools`) : Promise.resolve({ items: [] }),
    ]).then(([u, r, s]) => {
      setStats({
        users:   u.status === "fulfilled" ? (u.value?.items?.length ?? "–") : "–",
        roles:   r.status === "fulfilled" ? (r.value?.items?.length ?? "–") : "–",
        schools: s.status === "fulfilled" ? (s.value?.items?.length ?? "–") : "–",
      });
      setLoading(false);
    });
  }, [userId]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Нийт хэрэглэгч"  value={stats.users}   icon={<FiUsers  className="h-5 w-5" />} loading={loading} />
        <StatCard title="Эрхийн тоо"       value={stats.roles}   icon={<FiShield className="h-5 w-5" />} loading={loading} />
        <StatCard title="Сургуулийн тоо"   value={stats.schools} icon={<span className="text-lg">🏫</span>}  loading={loading} />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-zinc-800">Хурдан холбоосууд</h2>
        <div className="space-y-2">
          <QuickLink to="/team4/users"          label="Хэрэглэгчийн жагсаалт" />
          <QuickLink to="/team4/users/create"   label="Хэрэглэгч бүртгэх" />
          <QuickLink to="/team4/roles"          label="Эрхийн удирдлага" />
          <QuickLink to="/team4/profile"        label="Миний профайл" />
          <QuickLink to="/team4/schools/current" label="Сургууль солих" />
        </div>
      </div>
    </div>
  );
}

// ── Teacher dashboard ─────────────────────────────────────────────────────────
function TeacherDashboard({ userId }) {
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

      {/* Course list */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-zinc-800">Хичээлүүд</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-zinc-100" />)}
          </div>
        ) : courses.length === 0 ? (
          <p className="text-sm text-zinc-400">Хичээл байхгүй байна</p>
        ) : (
          <div className="space-y-2">
            {courses.map((item, i) => {
              const course = parseField(item, "course") ?? {};
              const courseId = course.id ?? item.id ?? item.course_id;
              const courseName = course.name ?? course.title ?? `Хичээл #${courseId}`;
              return (
                <Link
                  key={courseId ?? i}
                  to={courseId ? `/team4/courses/${courseId}/users` : "#"}
                  className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3
                    text-sm text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                >
                  <span className="font-medium">{courseName}</span>
                  <FiChevronRight className="h-4 w-4 text-zinc-400" />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-zinc-800">Хурдан холбоосууд</h2>
        <div className="space-y-2">
          <QuickLink to="/team4/users/create"   label="Оюутан бүртгэх" />
          <QuickLink to="/team4/profile"        label="Миний профайл" />
          <QuickLink to="/team4/schools/current" label="Сургууль солих" />
        </div>
      </div>
    </div>
  );
}

// ── Student dashboard ─────────────────────────────────────────────────────────
function StudentDashboard({ userId }) {
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

      {/* Course list */}
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
          <QuickLink to="/team4/profile"              label="Миний профайл" />
          <QuickLink to="/team4/profile/change-password" label="Нууц үг солих" />
          <QuickLink to="/team4/schools/current"       label="Сургууль солих" />
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const ROLE_TITLES = {
  admin:   "Системийн дашбоард",
  teacher: "Багшийн дашбоард",
  student: "Оюутны дашбоард",
};

export default function Home() {
  const { user, role, school, isAdmin, isTeacher, isStudent } = useAuth();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          {ROLE_TITLES[role] ?? "Дашбоард"}
        </h1>
        {school?.name && (
          <p className="mt-0.5 text-sm text-zinc-500">{school.name}</p>
        )}
      </div>

      {isAdmin   && <AdminDashboard   userId={user?.id} />}
      {isTeacher && <TeacherDashboard userId={user?.id} />}
      {isStudent && <StudentDashboard userId={user?.id} />}

      {!isAdmin && !isTeacher && !isStudent && (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
          Таны эрх тодорхойлогдоогүй байна.{" "}
          <Link to="/team4/schools/current" className="text-zinc-900 underline">
            Сургуулиа дахин сонгоно уу
          </Link>
        </div>
      )}
    </div>
  );
}
