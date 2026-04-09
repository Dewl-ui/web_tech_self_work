import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { apiGet, apiPut, withCurrentUser } from "../../utils/api";
import { useToast } from "../../components/ui/Toast";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Button } from "../../components/ui/Button";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "../../components/ui/Card";

export default function UserEdit() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    family_name: "",
    email: "",
    phone: "",
    picture: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet(`/users/${user_id}`);
        setForm({
          first_name: data.first_name ?? "",
          last_name: data.last_name ?? "",
          family_name: data.family_name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          picture: data.picture ?? "",
        });
      } catch (err) {
        const msg = err.message || "Мэдээлэл ачааллахад алдаа гарлаа.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user_id]);

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.first_name.trim()) {
      setError("Нэр заавал бөглөнө үү.");
      return;
    }

    setSaving(true);
    try {
      await apiPut(`/users/${user_id}`, withCurrentUser({
        first_name: form.first_name,
        last_name: form.last_name,
        family_name: form.family_name,
        email: form.email,
        phone: form.phone,
        picture: form.picture,
      }));
      toast.success("Амжилттай хадгалагдлаа.");
      navigate(`/team4/users/`);
    } catch (err) {
      const msg = err.message || "Хадгалахад алдаа гарлаа.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/team4/users/`)}>
          <FiArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Хэрэглэгч засах</h1>
          <p className="text-sm text-zinc-500">ID: {user_id}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Мэдээлэл засах</CardTitle>
          <CardDescription>Шаардлагатай талбаруудыг өөрчилнө үү</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-zinc-100" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Овог</Label>
                  <Input value={form.last_name} onChange={set("last_name")} placeholder="Овог" />
                </div>
                <div className="space-y-1.5">
                  <Label>Нэр *</Label>
                  <Input value={form.first_name} onChange={set("first_name")} placeholder="Нэр" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Ургийн овог</Label>
                <Input value={form.family_name} onChange={set("family_name")} placeholder="Ургийн овог" />
              </div>

              <div className="space-y-1.5">
                <Label>Имэйл</Label>
                <Input type="email" value={form.email} onChange={set("email")} placeholder="user@example.com" />
              </div>

              <div className="space-y-1.5">
                <Label>Утас</Label>
                <Input type="tel" value={form.phone} onChange={set("phone")} placeholder="99001122" />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving}>
                  {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                  <FiSave className="h-4 w-4" /> Хадгалах
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(`/team4/users/`)}>
                  Цуцлах
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
