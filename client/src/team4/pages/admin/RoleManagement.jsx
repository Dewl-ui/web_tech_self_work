import { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiShield,
  FiSave,
  FiX,
  FiCheck,
  FiClock,
  FiUser,
} from "react-icons/fi";
import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  getStoredUserId,
  withCurrentUser,
} from "../../utils/api";
import { useToast } from "../../components/ui/Toast";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
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

function getSelectedSchoolId() {
  try {
    const raw = localStorage.getItem("team4_school");
    if (!raw) return "";

    const school = JSON.parse(raw);
    return String(
      school?.id ??
        school?.school_id ??
        school?.SCHOOL_ID ??
        school?.ID ??
        "",
    );
  } catch {
    return "";
  }
}

function getRequestUser(req) {
  return (
    req?.["{}user"] ||
    req?.user_name ||
    [req?.last_name, req?.first_name].filter(Boolean).join(" ") ||
    `Хэрэглэгч #${req?.user_id ?? "?"}`
  );
}

function getRequestRole(req) {
  return req?.["{}role"] || req?.role_name || `Эрх #${req?.role_id ?? "?"}`;
}

function getRequestStatus(req) {
  return req?.["{}status"] || req?.status_name || `Төлөв #${req?.status_id ?? "?"}`;
}

export default function RoleManagement() {
  const toast = useToast();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");
  const [requestActionId, setRequestActionId] = useState(null);

  // Form state for create / edit
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", priority: "" });
  const [saving, setSaving] = useState(false);

  // Delete role
  const [confirmRole, setConfirmRole] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const selectedSchoolId = getSelectedSchoolId();

  async function loadRoles() {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet("/roles");
      setRoles(data?.items ?? (Array.isArray(data) ? data : []));
    } catch (err) {
      const msg = err.message || "Эрхийн жагсаалт авахад алдаа гарлаа.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function loadRequests() {
    if (!selectedSchoolId) {
      setRequests([]);
      setRequestsLoading(false);
      setRequestsError("");
      return;
    }

    try {
      setRequestsLoading(true);
      setRequestsError("");

      const data = await apiGet(`/schools/${selectedSchoolId}/requests`);
      setRequests(data?.items ?? (Array.isArray(data) ? data : []));
    } catch (err) {
      const msg = err.message || "Эрхийн хүсэлтийн жагсаалт авахад алдаа гарлаа.";
      setRequestsError(msg);
      toast.error(msg);
    } finally {
      setRequestsLoading(false);
    }
  }

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    loadRequests();
  }, [selectedSchoolId]);

  function openCreate() {
    setEditing(null);
    setForm({ name: "", priority: "" });
    setFormOpen(true);
  }

  function openEdit(role) {
    setEditing(role);
    setForm({
      name: role.name ?? "",
      priority: role.priority ?? "",
    });
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setForm({ name: "", priority: "" });
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.warning("Эрхийн нэр заавал бөглөнө үү.");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await apiPut(
          `/roles/${editing.id}`,
          withCurrentUser({
            name: form.name,
            priority: form.priority,
          }),
        );
        toast.success("Эрх амжилттай засагдлаа.");
      } else {
        await apiPost(
          "/roles",
          withCurrentUser({
            name: form.name,
            priority: form.priority,
          }),
        );
        toast.success("Эрх амжилттай нэмэгдлээ.");
      }

      closeForm();
      loadRoles();
    } catch (err) {
      toast.error(err.message || "Хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteRole() {
    if (!confirmRole?.id) return;

    setDeleting(true);
    try {
      await apiDelete(`/roles/${confirmRole.id}`, {
        ROLE_ID: String(confirmRole.id),
        current_user: String(getStoredUserId() ?? ""),
      });

      toast.success("Эрх амжилттай устгагдлаа.");
      setConfirmRole(null);
      loadRoles();
    } catch (err) {
      console.error("Delete role error:", err);
      toast.error(err.message || "Устгахад алдаа гарлаа.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleApproveRequest(requestId) {
    if (!selectedSchoolId || !requestId) return;

    setRequestActionId(requestId);
    try {
      await apiPost(
        `/schools/${selectedSchoolId}/requests/${requestId}`,
        withCurrentUser({}),
      );

      toast.success("Хүсэлт зөвшөөрөгдлөө.");
      loadRequests();
    } catch (err) {
      console.error("Approve request error:", err);
      toast.error(err.message || "Хүсэлтийг зөвшөөрөхөд алдаа гарлаа.");
    } finally {
      setRequestActionId(null);
    }
  }

  async function handleRejectRequest(requestId) {
    if (!selectedSchoolId || !requestId) return;

    setRequestActionId(requestId);
    try {
      await apiDelete(`/schools/${selectedSchoolId}/requests/${requestId}`, {
        current_user: String(getStoredUserId() ?? ""),
        request_id: String(requestId),
      });

      toast.success("Хүсэлт татгалзагдлаа.");
      loadRequests();
    } catch (err) {
      console.error("Reject request error:", err);
      toast.error(err.message || "Хүсэлтийг татгалзахад алдаа гарлаа.");
    } finally {
      setRequestActionId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            <FiShield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Эрхийн удирдлага</h1>
            <p className="text-sm text-zinc-500">
              Зүүн талд хүсэлтүүд, баруун талд эрхийн удирдлага
            </p>
          </div>
        </div>

        <Button onClick={openCreate}>
          <FiPlus className="h-4 w-4" /> Эрх нэмэх
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* LEFT: Request list */}
        <div className="xl:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiClock className="h-5 w-5" />
                Эрх хүсэлтийн жагсаалт
              </CardTitle>
              <CardDescription>
                {selectedSchoolId
                  ? `Сонгосон сургуулийн нийт ${requests.length} хүсэлт`
                  : "Эхлээд сургууль сонгоно уу"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!selectedSchoolId ? (
                <div className="rounded-xl border border-dashed border-zinc-200 py-10 text-center text-sm text-zinc-500">
                  Сургууль сонгоогүй байна.
                </div>
              ) : requestsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-24 animate-pulse rounded-xl bg-zinc-100"
                    />
                  ))}
                </div>
              ) : requestsError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {requestsError}
                </div>
              ) : requests.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-200 py-10 text-center text-sm text-zinc-500">
                  Хүсэлт алга байна.
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((req) => {
                    const acting = requestActionId === req.id;

                    return (
                      <div
                        key={req.id}
                        className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                      >
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                              <FiUser className="h-4 w-4 text-zinc-500" />
                              <span>{getRequestUser(req)}</span>
                            </div>
                            <p className="mt-1 text-xs text-zinc-500">
                              ID: {req.id} · user_id: {req.user_id ?? "—"}
                            </p>
                          </div>

                          <Badge variant="secondary">{getRequestStatus(req)}</Badge>
                        </div>

                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-zinc-500">Хүссэн эрх:</span>{" "}
                            <span className="font-medium text-zinc-900">
                              {getRequestRole(req)}
                            </span>
                          </p>

                          <p className="text-zinc-600">
                            {req.description?.trim() || "Тайлбар оруулаагүй"}
                          </p>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveRequest(req.id)}
                            disabled={acting}
                            className="flex-1"
                          >
                            <FiCheck className="h-4 w-4" />
                            {acting ? "Түр хүлээнэ үү..." : "Зөвшөөрөх"}
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectRequest(req.id)}
                            disabled={acting}
                            className="flex-1 text-red-600 hover:text-red-700"
                          >
                            <FiX className="h-4 w-4" />
                            Татгалзах
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Role create/edit/list */}
        <div className="space-y-6 xl:col-span-2">
          {formOpen && (
            <Card>
              <CardHeader>
                <CardTitle>{editing ? "Эрх засах" : "Шинэ эрх нэмэх"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Нэр *</Label>
                      <Input
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        placeholder="Жишээ: Админ"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Эрэмбэ (priority)</Label>
                      <Input
                        type="number"
                        value={form.priority}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, priority: e.target.value }))
                        }
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={saving}>
                      {saving && (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      )}
                      <FiSave className="h-4 w-4" /> Хадгалах
                    </Button>

                    <Button type="button" variant="outline" onClick={closeForm}>
                      <FiX className="h-4 w-4" /> Цуцлах
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Эрхийн жагсаалт</CardTitle>
              <CardDescription>Нийт {roles.length} эрх</CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-12 animate-pulse rounded-lg bg-zinc-100"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : roles.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-200 py-10 text-center text-sm text-zinc-500">
                  Эрх олдсонгүй.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Нэр</TableHead>
                      <TableHead>Эрэмбэ</TableHead>
                      <TableHead className="text-right">Үйлдэл</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>{role.id}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{role.name}</Badge>
                        </TableCell>
                        <TableCell>{role.priority ?? "—"}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEdit(role)}
                            >
                              <FiEdit2 className="h-4 w-4" /> Засах
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setConfirmRole(role)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FiTrash2 className="h-4 w-4" /> Устгах
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
      </div>

      <ConfirmDialog
        open={!!confirmRole}
        title="Эрх устгах уу?"
        description={`"${confirmRole?.name}" эрхийг устгахдаа итгэлтэй байна уу?`}
        confirmText="Устгах"
        cancelText="Цуцлах"
        loading={deleting}
        onCancel={() => setConfirmRole(null)}
        onConfirm={confirmDeleteRole}
      />
    </div>
  );
}