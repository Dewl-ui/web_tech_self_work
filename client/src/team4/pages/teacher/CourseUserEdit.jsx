import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiUserPlus, FiUserMinus, FiSearch, FiArrowLeft,
  FiCheckCircle, FiLoader, FiUsers
} from "react-icons/fi";
import { apiGet, apiPost, apiDelete, withCurrentUser } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import { useToast } from "../../components/ui/Toast";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "../../components/ui/Card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "../../components/ui/Table";

function getSchoolId(school) {
  return school?.id ?? school?.school_id ?? school?.SCHOOL_ID ?? school?.ID ?? null;
}

export default function CourseUserEdit() {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const { school } = useAuth();
  const toast = useToast();

  // Course users (already enrolled)
  const [courseUsers, setCourseUsers] = useState([]);
  // School users (available to add)
  const [schoolUsers, setSchoolUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState(null); // user being added/removed

  useEffect(() => {
    async function load() {
      const schoolId = getSchoolId(school);
      try {
        setLoading(true);
        const [courseRes, schoolRes] = await Promise.all([
          apiGet(`/courses/${course_id}/users`).catch(() => ({ items: [] })),
          schoolId ? apiGet(`/schools/${schoolId}/users`).catch(() => ({ items: [] })) : { items: [] },
        ]);
        setCourseUsers(courseRes?.items ?? (Array.isArray(courseRes) ? courseRes : []));
        setSchoolUsers(schoolRes?.items ?? (Array.isArray(schoolRes) ? schoolRes : []));
      } catch (err) {
        toast.error(err.message || "Мэдээлэл ачааллахад алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [course_id, school]);

  const enrolledIds = useMemo(
    () => new Set(courseUsers.map((u) => String(u.id ?? u.user_id))),
    [courseUsers]
  );

  // School users not yet enrolled
  const available = useMemo(() => {
    let list = schoolUsers.filter((u) => !enrolledIds.has(String(u.id)));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) => {
        const name = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
        return name.includes(q) || String(u.email || "").toLowerCase().includes(q);
      });
    }
    return list;
  }, [schoolUsers, enrolledIds, search]);

  async function addUser(userId) {
    setActionId(userId);
    try {
      await apiPost(`/courses/${course_id}/users`, withCurrentUser({ user_id: String(userId) }));
      // Move from available to enrolled
      const added = schoolUsers.find((u) => String(u.id) === String(userId));
      if (added) setCourseUsers((prev) => [...prev, added]);
      toast.success("Хэрэглэгч нэмэгдлээ.");
    } catch (err) {
      toast.error(err.message || "Нэмэхэд алдаа гарлаа.");
    } finally {
      setActionId(null);
    }
  }

  async function removeUser(userId) {
    setActionId(userId);
    try {
      await apiDelete(`/courses/${course_id}/users/${userId}`, withCurrentUser());
      setCourseUsers((prev) => prev.filter((u) => String(u.id ?? u.user_id) !== String(userId)));
      toast.success("Хэрэглэгч хасагдлаа.");
    } catch (err) {
      toast.error(err.message || "Хасахад алдаа гарлаа.");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/team4/courses/${course_id}/users`)}>
          <FiArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Хэрэглэгч нэмэх / хасах</h1>
          <p className="text-sm text-zinc-500">Хичээл ID: {course_id}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-48 animate-pulse rounded-xl bg-zinc-100" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Enrolled users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiCheckCircle className="h-4 w-4 text-green-600" />
                Бүртгэлтэй ({courseUsers.length})
              </CardTitle>
              <CardDescription>Хичээлд бүртгэлтэй хэрэглэгчид</CardDescription>
            </CardHeader>
            <CardContent>
              {courseUsers.length === 0 ? (
                <p className="py-6 text-center text-sm text-zinc-400">Хэрэглэгч байхгүй.</p>
              ) : (
                <div className="max-h-96 space-y-2 overflow-y-auto">
                  {courseUsers.map((u) => {
                    const uid = u.id ?? u.user_id;
                    return (
                      <div key={uid} className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-zinc-900">
                            {[u.last_name, u.first_name].filter(Boolean).join(" ") || "—"}
                          </p>
                          <p className="text-xs text-zinc-400">{u.email || u.username || ""}</p>
                        </div>
                        <Button
                          variant="ghost" size="sm"
                          onClick={() => removeUser(uid)}
                          disabled={actionId === uid}
                          className="text-red-600 hover:text-red-700"
                        >
                          {actionId === uid ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiUserMinus className="h-4 w-4" />}
                          Хасах
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiUsers className="h-4 w-4 text-blue-600" />
                Нэмэх боломжтой ({available.length})
              </CardTitle>
              <CardDescription>Сургуулийн хэрэглэгчид</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Нэр, имэйл хайх..."
                  className="pl-9"
                />
              </div>
              {available.length === 0 ? (
                <p className="py-6 text-center text-sm text-zinc-400">Нэмэх хэрэглэгч олдсонгүй.</p>
              ) : (
                <div className="max-h-80 space-y-2 overflow-y-auto">
                  {available.map((u) => (
                    <div key={u.id} className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-zinc-900">
                          {[u.last_name, u.first_name].filter(Boolean).join(" ") || "—"}
                        </p>
                        <p className="text-xs text-zinc-400">{u.email || u.username || ""}</p>
                      </div>
                      <Button
                        variant="outline" size="sm"
                        onClick={() => addUser(u.id)}
                        disabled={actionId === u.id}
                      >
                        {actionId === u.id ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiUserPlus className="h-4 w-4" />}
                        Нэмэх
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
