import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiEdit2, FiSearch, FiUsers, FiBarChart2, FiLayers } from "react-icons/fi";
import { apiGet, parseField } from "../../utils/api";
import { useToast } from "../../components/ui";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui";

function getUserFullName(user) {
  return [user?.last_name, user?.first_name].filter(Boolean).join(" ").trim();
}

export default function CourseUserList() {
  const { course_id } = useParams();
  const toast = useToast();

  const [courseName, setCourseName] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!course_id) return;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const [courseRes, courseUsersRes] = await Promise.all([
          apiGet(`/courses/${course_id}`).catch(() => ({})),
          apiGet(`/courses/${course_id}/users`),
        ]);

        setCourseName(courseRes?.name ?? `Хичээл #${course_id}`);
        setUsers(courseUsersRes?.items ?? []);
      } catch (err) {
        const msg = err.message || "Хэрэглэгчдийг ачааллахад алдаа гарлаа.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [course_id, toast]);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();

    return users.filter((item) => {
      const user = parseField(item, "user") ?? item.user ?? item;
      const fullName = getUserFullName(user).toLowerCase();

      return (
        fullName.includes(q) ||
        String(user?.email ?? "").toLowerCase().includes(q) ||
        String(user?.username ?? "").toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <FiUsers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Хичээлийн хэрэглэгчид</h1>
            <p className="text-sm text-zinc-500">{courseName || `Хичээл #${course_id}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Link to={`/team4/courses/${course_id}/attendance`}>
    <Button variant="outline">
      <FiBarChart2 className="h-4 w-4" />
      Ирцийн статистик
    </Button>
  </Link>
  <Link to={`/team4/courses/${course_id}/groups`}>
            <Button variant="outline">
              <FiLayers className="h-4 w-4" />
              Бүлэг удирдах
            </Button>
          </Link>
          <Link to={`/team4/courses/${course_id}/users/edit`}>
            <Button>
              <FiEdit2 className="h-4 w-4" />
              Хэрэглэгч удирдах
            </Button>
          </Link>
          <Link to="/team4/teacher">
            <Button variant="outline">Буцах</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="px-4 pb-4 pt-5">
          <div className="relative w-full max-w-sm">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Нэр, имэйл хайх..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Жагсаалт</CardTitle>
          <CardDescription>Нийт {filtered.length} хэрэглэгч</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-zinc-100" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-200 py-10 text-center text-sm text-zinc-500">
              Хэрэглэгч олдсонгүй.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Нэр</TableHead>
                  <TableHead>Имэйл</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Бүлэг</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => {
                  const user = parseField(item, "user") ?? item.user ?? item;
                  const group = parseField(item, "group") ?? item.group ?? null;
                  const fullName = getUserFullName(user) || user?.username || `Хэрэглэгч #${item.user_id ?? item.id}`;

                  return (
                    <TableRow key={item.id ?? `${item.course_id}-${item.user_id}`}>
                      <TableCell className="font-medium text-zinc-900">{fullName}</TableCell>
                      <TableCell>{user?.email || "—"}</TableCell>
                      <TableCell>{user?.username || "—"}</TableCell>
                      <TableCell>{group?.name || "Бүлэггүй"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
