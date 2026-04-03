// Member A OWNS this file.
// This is the admin section shown on the home dashboard (/team4).
// Add quick links, stats, or widgets for admin here.
// Do NOT edit Home.jsx — edit this file instead.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiShield, FiChevronRight } from "react-icons/fi";
import { apiGet } from "../../utils/api";

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

export default function AdminHomeSummary({ userId }) {
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
        <StatCard title="Нийт хэрэглэгч" value={stats.users}   icon={<FiUsers  className="h-5 w-5" />} loading={loading} />
        <StatCard title="Эрхийн тоо"      value={stats.roles}   icon={<FiShield className="h-5 w-5" />} loading={loading} />
        <StatCard title="Сургуулийн тоо"  value={stats.schools} icon={<span className="text-lg">🏫</span>} loading={loading} />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-zinc-800">Хурдан холбоосууд</h2>
        <div className="space-y-2">
          <QuickLink to="/team4/users"           label="Хэрэглэгчийн жагсаалт" />
          <QuickLink to="/team4/users/create"    label="Хэрэглэгч бүртгэх" />
          <QuickLink to="/team4/roles"           label="Эрхийн удирдлага" />
          <QuickLink to="/team4/profile"         label="Миний профайл" />
          <QuickLink to="/team4/schools/current" label="Сургууль солих" />
          {/* Member A: add more QuickLink entries here */}
        </div>
      </div>
    </div>
  );
}
