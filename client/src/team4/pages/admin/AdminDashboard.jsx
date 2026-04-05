import { useEffect, useMemo, useState } from "react";
import { FiUsers, FiBookOpen, FiUser } from "react-icons/fi";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { useAuth } from "../../utils/AuthContext";
import { apiGet, parseField } from "../../utils/api";
import { StatCard } from "../../components/ui/StatCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/Card";

function getSchoolId(school) {
  return school?.id ?? school?.school_id ?? school?.SCHOOL_ID ?? school?.ID ?? null;
}

function getRoleIdFromSchoolMembership(userSchools, currentSchoolId) {
  const matchedSchool = (userSchools || []).find((s) => {
    const sid = s?.id ?? s?.school_id ?? s?.SCHOOL_ID ?? s?.ID ?? null;
    return String(sid) === String(currentSchoolId);
  });

  if (!matchedSchool) return null;

  const roleObj = parseField(matchedSchool, "role");
  return roleObj?.id != null ? Number(roleObj.id) : null;
}

export default function AdminDashboard() {
  const { school, isAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [courseCount, setCourseCount] = useState(0);
  const [roleCounts, setRoleCounts] = useState({
    admins: 0,
    teachers: 0,
    students: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin) return;

    const schoolId = getSchoolId(school);

    if (schoolId === null) {
      setLoading(false);
      setError("Сургуулийн id олдсонгүй.");
      return;
    }

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const schoolUsersRes = await apiGet(`/schools/${schoolId}/users`);
        const schoolUsers = schoolUsersRes?.items ?? [];
        setUsers(schoolUsers);

        const schoolCoursesRes = await apiGet(`/schools/${schoolId}/courses`);
        setCourseCount(schoolCoursesRes?.items?.length ?? 0);

        const membershipResults = await Promise.allSettled(
          schoolUsers.map((u) => apiGet(`/users/${u.id}/schools`))
        );

        let admins = 0;
        let teachers = 0;
        let students = 0;

        membershipResults.forEach((result) => {
          if (result.status !== "fulfilled") return;

          const userSchools = result.value?.items ?? [];
          const roleId = getRoleIdFromSchoolMembership(userSchools, schoolId);

          if (roleId === 10) admins += 1;
          else if (roleId === 20) teachers += 1;
          else if (roleId === 30) students += 1;
        });

        setRoleCounts({ admins, teachers, students });
      } catch (err) {
        console.error(err);
        setError(err.message || "Сургуулийн мэдээлэл авахад алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [school, isAdmin]);

  const stats = useMemo(() => {
    return {
      totalUsers: users.length,
      totalTeachers: roleCounts.teachers,
      totalStudents: roleCounts.students,
      totalAdmins: roleCounts.admins,
    };
  }, [users, roleCounts]);

  const activeCount = useMemo(
    () => users.filter((u) => Number(u.is_active) === 1).length,
    [users]
  );

  const inactiveCount = useMemo(
    () => users.length - activeCount,
    [users, activeCount]
  );

  const pieData = useMemo(
    () => [
      { name: "Админ", value: stats.totalAdmins },
      { name: "Багш", value: stats.totalTeachers },
      { name: "Оюутан", value: stats.totalStudents },
    ],
    [stats]
  );

  const barData = useMemo(
    () => [
      { name: "Идэвхтэй", count: activeCount },
      { name: "Идэвхгүй", count: inactiveCount },
    ],
    [activeCount, inactiveCount]
  );

  const PIE_COLORS = ["#8b5cf6", "#3b82f6", "#10b981"];

  if (!isAdmin) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-900">Админ самбар</h1>
        <p className="text-sm text-zinc-500">Энэ хэсгийг зөвхөн админ хэрэглэгч үзнэ.</p>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-900">Админ самбар</h1>
        <p className="text-sm text-zinc-500">Эхлээд сургууль сонгоно уу.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Админ самбар</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {school?.name
            ? `${school.name} сургуулийн хяналтын самбар`
            : "Сонгосон сургуулийн хяналтын самбар"}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Нийт хэрэглэгч"
          value={loading ? "..." : stats.totalUsers}
          icon={<FiUsers className="h-5 w-5" />}
          description="Сонгосон сургуулийн бүх хэрэглэгч"
        />
        <StatCard
          title="Нийт багш"
          value={loading ? "..." : stats.totalTeachers}
          icon={<FiUser className="h-5 w-5" />}
          description="Багш эрхтэй хэрэглэгч"
        />
        <StatCard
          title="Нийт оюутан"
          value={loading ? "..." : stats.totalStudents}
          icon={<FiUser className="h-5 w-5" />}
          description="Оюутан эрхтэй хэрэглэгч"
        />
        <StatCard
          title="Нийт хичээл"
          value={loading ? "..." : courseCount}
          icon={<FiBookOpen className="h-5 w-5" />}
          description="Сонгосон сургуулийн бүх хичээл"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Эрхийн тархалт</CardTitle>
            <CardDescription>
              Сонгосон сургуулийн хэрэглэгчдийн эрхийн хуваарилалт
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Хэрэглэгчийн төлөв</CardTitle>
            <CardDescription>
              Идэвхтэй болон идэвхгүй хэрэглэгчдийн тоо
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Хэрэглэгчийн тоо" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}