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
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Pagination } from "../../components/ui/Pagination";
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
function getRoleName(user, currentSchoolId) {
  const matchedSchool = (user?.schools || []).find(
    (s) => String(s.id) === String(currentSchoolId),
  );
  return matchedSchool?.roles?.[0]?.name || matchedSchool?.role?.name || "-";
}
function normalizeRole(roleName) {
  const n = (roleName || "").toLowerCase();
  if (n === "админ" || n === "admin") return "admin";
  if (n === "сургагч" || n === "teacher") return "teacher";
  if (n === "суралцагч" || n === "student") return "student";
  return n;
}
function getRoleBadgeVariant(roleName) {
  const r = normalizeRole(roleName);
  if (r === "admin") return "default";
  if (r === "teacher") return "info";
  if (r === "student") return "success";
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
  const [confirmUser, setConfirmUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;
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
        const schoolUsersRes = await apiGet(`/schools/${schoolId}/users?limit=10000`);
        const schoolUsers = schoolUsersRes?.items ?? [];
        const enrichedUsers = schoolUsers.map((user) => ({
          ...user,
          roleName: getRoleName(user, schoolId),
        }));
        setUsers(enrichedUsers);
      } catch (err) {
        console.error(err);
        const msg =
          err.message || "Хэрэглэгчдийн мэдээлэл авахад алдаа гарлаа.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, [school]);
  function askDeleteUser(user) {
    setConfirmUser(user);
  }
  async function confirmDeleteUser() {
    const schoolId = getSchoolId(school);
    if (schoolId == null || !confirmUser) {
      toast.error("Сургуулийн мэдээлэл олдсонгүй.");
      return;
    }
    try {
      setDeletingId(confirmUser.id);
      await apiDelete(`/schools/${schoolId}/users/${confirmUser.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== confirmUser.id));
      toast.success("Хэрэглэгч амжилттай устгагдлаа.");
      setConfirmUser(null);
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
      const q = search.trim().toLowerCase();
      result = result.filter((u) => {
        const firstLast = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
        const lastFirst = `${u.last_name || ""} ${u.first_name || ""}`.toLowerCase();
        return (
          firstLast.includes(q) ||
          lastFirst.includes(q) ||
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
    const roleOrder = { admin: 0, teacher: 1, student: 2 };
    result.sort((a, b) => {
      const ra = roleOrder[normalizeRole(a.roleName)] ?? 99;
      const rb = roleOrder[normalizeRole(b.roleName)] ?? 99;
      return ra - rb;
    });

    setCurrentPage(1);
    return result;
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const pagedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (!isAdmin && !isTeacher) {
    return (
      <div className="mx-auto max-w-4xl space-y-2">
        {" "}
        <h1 className="text-2xl font-bold text-zinc-900">Хэрэглэгчид</h1>{" "}
        <p className="text-sm text-zinc-500">
          {" "}
          Энэ хэсгийг зөвхөн админ болон багш хэрэглэгч үзнэ.{" "}
        </p>{" "}
      </div>
    );
  }
  return (
    <>
      {" "}
      <div className="mx-auto max-w-7xl space-y-6">
        {" "}
        <Card>
          {" "}
          <CardContent className="px-4 pb-4 pt-5">
            {" "}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              {" "}
              <div className="relative w-full">
                {" "}
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />{" "}
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Нэр, имэйл, username..."
                  className="w-full pl-9"
                />{" "}
              </div>{" "}
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full"
              >
                {" "}
                <option value="all">Бүх эрх</option>{" "}
                <option value="Админ">Админ</option>{" "}
                <option value="Сургагч">Сургагч</option>{" "}
                <option value="Суралцагч">Суралцагч</option>{" "}
              </Select>{" "}
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full"
              >
                {" "}
                <option value="all">Бүх төлөв</option>{" "}
                <option value="active">Идэвхтэй</option>{" "}
                <option value="inactive">Идэвхгүй</option>{" "}
              </Select>{" "}
              <Link to="/team4/users/create" className="w-full">
                {" "}
                <Button className="w-full">
                  {" "}
                  <FiPlus className="h-4 w-4" /> Хэрэглэгч нэмэх{" "}
                </Button>{" "}
              </Link>{" "}
            </div>{" "}
          </CardContent>{" "}
        </Card>{" "}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {" "}
            {error}{" "}
          </div>
        )}{" "}
        <Card>
          {" "}
          <CardHeader>
            {" "}
            <CardTitle>Жагсаалт</CardTitle>{" "}
            <CardDescription>
              {" "}
              Нийт {filteredUsers.length} хэрэглэгч{" "}
            </CardDescription>{" "}
          </CardHeader>{" "}
          <CardContent>
            {" "}
            {loading ? (
              <div className="space-y-3">
                {" "}
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded-lg bg-zinc-100"
                  />
                ))}{" "}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-200 py-10 text-center text-sm text-zinc-500">
                {" "}
                Хэрэглэгч олдсонгүй.{" "}
              </div>
            ) : (
              <Table>
                {" "}
                <TableHeader>
                  {" "}
                  <TableRow>
                    {" "}
                    <TableHead>№</TableHead> <TableHead>Нэр</TableHead>{" "}
                    <TableHead>Имэйл</TableHead> <TableHead>Username</TableHead>{" "}
                    <TableHead>Утас</TableHead> <TableHead>Эрх</TableHead>{" "}
                    <TableHead>Төлөв</TableHead>{" "}
                    <TableHead className="text-right">Үйлдэл</TableHead>{" "}
                  </TableRow>{" "}
                </TableHeader>{" "}
                <TableBody>
                  {" "}
                  {pagedUsers.map((user, index) => (
                    <TableRow key={user.id}>
                      {" "}
                      <TableCell>{(currentPage - 1) * PAGE_SIZE + index + 1}</TableCell>{" "}
                      <TableCell className="font-medium text-zinc-900">
                        <div className="flex items-center gap-2.5">
                          {user.picture && user.picture !== "no-image.jpg" && (
                            <img
                              src={/^(https?:)?\/\//i.test(user.picture) ? user.picture : `https://todu.mn/bs/lms/v1/${user.picture}`}
                              alt=""
                              className="h-7 w-7 shrink-0 rounded-full object-cover peer"
                              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                            />
                          )}
                          <div className={`h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-500 ${user.picture && user.picture !== "no-image.jpg" ? "hidden" : "flex"}`}>
                            {[user.first_name, user.last_name].filter(Boolean).map((s) => s[0]?.toUpperCase()).join("").slice(0, 2) || "?"}
                          </div>
                          <span>{[user.last_name, user.first_name].filter(Boolean).join(" ") || "-"}</span>
                        </div>
                      </TableCell>{" "}
                      <TableCell>{user.email || "-"}</TableCell>{" "}
                      <TableCell>{user.username || "-"}</TableCell>{" "}
                      <TableCell>{user.phone || "-"}</TableCell>{" "}
                      <TableCell>
                        {" "}
                        <Badge variant={getRoleBadgeVariant(user.roleName)}>
                          {" "}
                          {user.roleName}{" "}
                        </Badge>{" "}
                      </TableCell>{" "}
                      <TableCell>
                        {" "}
                        <Badge variant={getStatusBadgeVariant(user.is_active)}>
                          {" "}
                          {Number(user.is_active) === 1
                            ? "Идэвхтэй"
                            : "Идэвхгүй"}{" "}
                        </Badge>{" "}
                      </TableCell>{" "}
                      <TableCell>
                        {" "}
                        <div className="flex justify-end gap-2">
                          {" "}
                          <Link to={`/team4/users/${user.id}`}>
                            {" "}
                            <Button variant="outline" size="sm">
                              {" "}
                              <FiEye className="h-4 w-4" /> Харах{" "}
                            </Button>{" "}
                          </Link>{" "}
                          <Link to={`/team4/users/${user.id}/edit`}>
                            {" "}
                            <Button variant="ghost" size="sm">
                              {" "}
                              <FiEdit2 className="h-4 w-4" /> Засах{" "}
                            </Button>{" "}
                          </Link>{" "}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => askDeleteUser(user)}
                            disabled={deletingId === user.id}
                            className="text-red-600 hover:text-red-700"
                          >
                            {" "}
                            <FiTrash2 className="h-4 w-4" /> Устгах{" "}
                          </Button>{" "}
                        </div>{" "}
                      </TableCell>{" "}
                    </TableRow>
                  ))}{" "}
                </TableBody>{" "}
              </Table>
            )}{" "}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </CardContent>{" "}
        </Card>{" "}
      </div>{" "}
      <ConfirmDialog
        open={!!confirmUser}
        title="Та устгахдаа итгэлтэй байна уу?"
        description="Энэ хэрэглэгчийн мэдээлэл бүр мөсөн устах болно."
        confirmText="Үргэлжлүүлэх"
        cancelText="Цуцлах"
        loading={deletingId === confirmUser?.id}
        onCancel={() => setConfirmUser(null)}
        onConfirm={confirmDeleteUser}
      />{" "}
    </>
  );
}
