import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiSearch, FiEdit2, FiUsers } from "react-icons/fi";
import { apiGet, parseField } from "../../utils/api";
import { useToast } from "../../components/ui/Toast";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "../../components/ui/Card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "../../components/ui/Table";

export default function CourseUserList() {
  const { course_id } = useParams();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiGet(`/courses/${course_id}/users`);
        setUsers(data?.items ?? (Array.isArray(data) ? data : []));
      } catch (err) {
        const msg = err.message || "Хэрэглэгчдийг ачааллахад алдаа гарлаа.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [course_id]);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter((u) => {
      const name = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
      return (
        name.includes(q) ||
        String(u.email || "").toLowerCase().includes(q) ||
        String(u.username || "").toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <FiUsers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Хичээлийн хэрэглэгчид</h1>
            <p className="text-sm text-zinc-500">Хичээл ID: {course_id}</p>
          </div>
        </div>
        <Link to={`/team4/courses/${course_id}/users/edit`}>
          <Button>
            <FiEdit2 className="h-4 w-4" /> Хэрэглэгч удирдах
          </Button>
        </Link>
      </div>

      {/* Search */}
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

      {/* List */}
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
                  <TableHead>ID</TableHead>
                  <TableHead>Нэр</TableHead>
                  <TableHead>Имэйл</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Бүлэг</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => {
                  const group = parseField(u, "group");
                  return (
                    <TableRow key={u.id ?? u.user_id}>
                      <TableCell>{u.id ?? u.user_id}</TableCell>
                      <TableCell className="font-medium text-zinc-900">
                        {[u.last_name, u.first_name].filter(Boolean).join(" ") || "—"}
                      </TableCell>
                      <TableCell>{u.email || "—"}</TableCell>
                      <TableCell>{u.username || "—"}</TableCell>
                      <TableCell>
                        {group?.name ? (
                          <Badge variant="secondary">{group.name}</Badge>
                        ) : "—"}
                      </TableCell>
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
