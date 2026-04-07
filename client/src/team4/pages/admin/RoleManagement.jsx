import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiShield, FiSave, FiX } from "react-icons/fi";
import { apiGet, apiPost, apiPut, apiDelete, withCurrentUser } from "../../utils/api";
import { useToast } from "../../components/ui/Toast";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "../../components/ui/Card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "../../components/ui/Table";

export default function RoleManagement() {
  const toast = useToast();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state for create / edit
  const [editing, setEditing] = useState(null); // null = create mode, role obj = edit mode
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", priority: "" });
  const [saving, setSaving] = useState(false);

  // Delete
  const [confirmRole, setConfirmRole] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadRoles() {
    try {
      setLoading(true);
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

  useEffect(() => { loadRoles(); }, []);

  function openCreate() {
    setEditing(null);
    setForm({ name: "", priority: "" });
    setFormOpen(true);
  }

  function openEdit(role) {
    setEditing(role);
    setForm({ name: role.name ?? "", priority: role.priority ?? "" });
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
        await apiPut(`/roles/${editing.id}`, withCurrentUser({
          name: form.name,
          priority: form.priority,
        }));
        toast.success("Эрх амжилттай засагдлаа.");
      } else {
        await apiPost("/roles", withCurrentUser({
          name: form.name,
          priority: form.priority,
        }));
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
    if (!confirmRole) return;
    setDeleting(true);
    try {
      await apiDelete(`/roles/${confirmRole.id}`, withCurrentUser());
      toast.success("Эрх амжилттай устгагдлаа.");
      setConfirmRole(null);
      loadRoles();
    } catch (err) {
      toast.error(err.message || "Устгахад алдаа гарлаа.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            <FiShield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Эрхийн удирдлага</h1>
            <p className="text-sm text-zinc-500">Хэрэглэгчийн эрхүүдийг удирдах</p>
          </div>
        </div>
        <Button onClick={openCreate}>
          <FiPlus className="h-4 w-4" /> Эрх нэмэх
        </Button>
      </div>

      {/* Inline form */}
      {formOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Эрх засах" : "Шинэ эрх нэмэх"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Нэр *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Жишээ: Админ"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Эрэмбэ (priority)</Label>
                  <Input
                    type="number"
                    value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                    placeholder="10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
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

      {/* Roles list */}
      <Card>
        <CardHeader>
          <CardTitle>Жагсаалт</CardTitle>
          <CardDescription>Нийт {roles.length} эрх</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-zinc-100" />
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
                        <Button variant="ghost" size="sm" onClick={() => openEdit(role)}>
                          <FiEdit2 className="h-4 w-4" /> Засах
                        </Button>
                        <Button
                          variant="ghost" size="sm"
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
