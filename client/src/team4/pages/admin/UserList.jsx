import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEdit2, FiSearch, FiPlus, FiTrash2 } from "react-icons/fi";

import { useAuth } from "../../utils/AuthContext";
import { apiGet, apiDelete } from "../../utils/api";
import { useToast } from "../../components/ui/Toast";

import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/Table";

function getSchoolId(school) {
  return (
    school?.id ?? school?.school_id ?? school?.SCHOOL_ID ?? school?.ID ?? null
  );
}

function getRoleNameFromUserDetail(userDetail, currentSchoolId) {
  const matchedSchool = (userDetail?.schools || []).find(
    (s) => String(s.id) === String(currentSchoolId),
  );

  return matchedSchool?.role?.name || "-";
}

function getRoleBadgeVariant(roleName) {
  if (roleName === "Админ") return "default";
  if (roleName === "Сургагч") return "secondary";
  if (roleName === "Суралцагч") return "success";
  return "outline";
}

function getStatusBadgeVariant(isActive) {
  return Number(isActive) === 1 ? "success" : "outline";
}

export default function UserList() {
  const { school, isAdmin, isTeacher } = useAuth();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const schoolId = getSchoolId(school);

    if (schoolId == null) {
      setLoading(false);
      setError("Сургууль сонгогдоогүй байна.");
      toast.warning("Сургууль сонгогдоогүй байна.");
      return;
    }

    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const schoolUsersRes = await apiGet(`/schools/${schoolId}/users`);
        const schoolUsers = schoolUsersRes?.items ?? [];

        const detailResults = await Promise.allSettled(
          schoolUsers.map((u) => apiGet(`/users/${u.id}`)),
        );

        const enrichedUsers = schoolUsers.map((user, index) => {
          const detailResult = detailResults[index];

          if (detailResult.status !== "fulfilled") {
            return {
              ...user,
              roleName: "-",
            };
          }

          const detail = detailResult.value;
          const roleName = getRoleNameFromUserDetail(detail, schoolId);

          return {
            ...user,
            roleName,
          };
        });

        setUsers(enrichedUsers);
      } catch (err) {
        console.error(err);
        const msg = err.message || "Хэрэглэгчдийн мэдээлэл авахад алдаа гарлаа.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [school]);

  async function handleDeleteUser(userId) {
    const schoolId = getSchoolId(school);

    if (schoolId == null) {
      toast.error("Сургуулийн мэдээлэл олдсонгүй.");
      return;
    }

    const ok = window.confirm("Энэ хэрэглэгчийг сургуулиас хасах уу?");
    if (!ok) return;

    try {
      setDeletingId(userId);
      await apiDelete(`/schools/${schoolId}/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("Хэрэглэгч амжилттай устгагдлаа.");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Хэрэглэгч устгахад алдаа гарлаа.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((u) => {
        const fullName =
          `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();

        return (
          fullName.includes(q) ||
          String(u.email || "")
            .toLowerCase()
            .includes(q) ||
          String(u.username || "")
            .toLowerCase()
            .includes(q) ||
          String(u.phone || "")
            .toLowerCase()
            .includes(q)
        );
      });
    }

    if (roleFilter !== "all") {
      result = result.filter((u) => u.roleName === roleFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((u) => {
        if (statusFilter === "active") return Number(u.is_active) === 1;
        if (statusFilter === "inactive") return Number(u.is_active) !== 1;
        return true;
      });
    }

    return result;
  }, [users, search, roleFilter, statusFilter]);

  if (!isAdmin && !isTeacher) {
    return (
      <div className="mx-auto max-w-4xl space-y-2">
        <h1 className="text-2xl font-bold text-zinc-900">Хэрэглэгчид</h1>
        <p className="text-sm text-zinc-500">
          Энэ хэсгийг зөвхөн админ болон багш хэрэглэгч үзнэ.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Card>
        <CardContent className="px-4 pb-4 pt-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="relative w-full">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Нэр, имэйл, username..."
                className="w-full pl-9"
              />
            </div>

            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full"
            >
              <option value="all">Бүх эрх</option>
              <option value="Админ">Админ</option>
              <option value="Сургагч">Сургагч</option>
              <option value="Суралцагч">Суралцагч</option>
            </Select>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full"
            >
              <option value="all">Бүх төлөв</option>
              <option value="active">Идэвхтэй</option>
              <option value="inactive">Идэвхгүй</option>
            </Select>

            <Link to="/team4/users/create" className="w-full">
              <Button className="w-full">
                <FiPlus className="h-4 w-4" />
                Хэрэглэгч нэмэх
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Жагсаалт</CardTitle>
          <CardDescription>
            Нийт {filteredUsers.length} хэрэглэгч
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-lg bg-zinc-100"
                />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
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
                  <TableHead>Утас</TableHead>
                  <TableHead>Эрх</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead className="text-right">Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>

                    <TableCell className="font-medium text-zinc-900">
                      {[user.last_name, user.first_name]
                        .filter(Boolean)
                        .join(" ") || "-"}
                    </TableCell>

                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell>{user.username || "-"}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>

                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.roleName)}>
                        {user.roleName}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(user.is_active)}>
                        {Number(user.is_active) === 1 ? "Идэвхтэй" : "Идэвхгүй"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Link to={`/team4/users/${user.id}`}>
                          <Button variant="outline" size="sm">
                            <FiEye className="h-4 w-4" />
                            Харах
                          </Button>
                        </Link>

                        <Link to={`/team4/users/${user.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <FiEdit2 className="h-4 w-4" />
                            Засах
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deletingId === user.id}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FiTrash2 className="h-4 w-4" />
                          {deletingId === user.id
                            ? "Устгаж байна..."
                            : "Устгах"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
