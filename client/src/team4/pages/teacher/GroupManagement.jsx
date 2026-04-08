import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiSave, FiX, FiLayers } from "react-icons/fi";
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

export default function GroupManagement() {
  const { course_id } = useParams();
  const toast = useToast();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", priority: "" });
  const [saving, setSaving] = useState(false);

  // Delete
  const [confirmGroup, setConfirmGroup] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadGroups() {
    try {
      setLoading(true);
      const data = await apiGet(`/courses/${course_id}/groups`);
      setGroups(data?.items ?? (Array.isArray(data) ? data : []));
    } catch (err) {
      const msg = err.message || "Бүлгүүдийг ачааллахад алдаа гарлаа.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadGroups(); }, [course_id]);

  function openCreate() {
    setEditing(null);
    setForm({ name: "", priority: "" });
    setFormOpen(true);
  }

  function openEdit(group) {
    setEditing(group);
    setForm({ name: group.name ?? "", priority: group.priority ?? "" });
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
      toast.warning("Бүлгийн нэр заавал бөглөнө үү.");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await apiPut(`/groups/${editing.id}`, {
          course_id,
          name: form.name,
          priority: form.priority,
        });
        toast.success("Бүлэг амжилттай засагдлаа.");
      } else {
        await apiPost(`/courses/${course_id}/groups`, {
          name: form.name,
          priority: form.priority,
        });
        toast.success("Бүлэг амжилттай нэмэгдлээ.");
      }
      closeForm();
      loadGroups();
    } catch (err) {
      toast.error(err.message || "Хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteGroup() {
    if (!confirmGroup) return;
    setDeleting(true);
    try {
      await apiDelete(`/groups/${confirmGroup.id}`, withCurrentUser());
      toast.success("Бүлэг амжилттай устгагдлаа.");
      setConfirmGroup(null);
      loadGroups();
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
            <FiLayers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Бүлэг удирдах</h1>
            <p className="text-sm text-zinc-500">Хичээл ID: {course_id}</p>
          </div>
        </div>
        <Button onClick={openCreate}>
          <FiPlus className="h-4 w-4" /> Бүлэг нэмэх
        </Button>
      </div>

      {/* Inline form */}
      {formOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Бүлэг засах" : "Шинэ бүлэг нэмэх"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Бүлгийн нэр *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Жишээ: A бүлэг"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Эрэмбэ</Label>
                  <Input
                    type="number"
                    value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                    placeholder="1"
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

      {/* Groups list */}
      <Card>
        <CardHeader>
          <CardTitle>Жагсаалт</CardTitle>
          <CardDescription>Нийт {groups.length} бүлэг</CardDescription>
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
          ) : groups.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-200 py-10 text-center text-sm text-zinc-500">
              Бүлэг олдсонгүй.
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
                {groups.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>{g.id}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{g.name}</Badge>
                    </TableCell>
                    <TableCell>{g.priority ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Link to={`/team4/courses/${course_id}/groups/${g.id}/users`}>
                          <Button variant="outline" size="sm">
                            <FiUsers className="h-4 w-4" /> Гишүүд
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(g)}>
                          <FiEdit2 className="h-4 w-4" /> Засах
                        </Button>
                        <Button
                          variant="ghost" size="sm"
                          onClick={() => setConfirmGroup(g)}
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
        open={!!confirmGroup}
        title="Бүлэг устгах уу?"
        description={`"${confirmGroup?.name}" бүлгийг устгахдаа итгэлтэй байна уу?`}
        confirmText="Устгах"
        cancelText="Цуцлах"
        loading={deleting}
        onCancel={() => setConfirmGroup(null)}
        onConfirm={confirmDeleteGroup}
      />
    </div>
  );
}
