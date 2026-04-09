import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSave, FiLock } from "react-icons/fi";
import { apiGet, apiPut, withCurrentUser, parseField } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import { useToast } from "../../components/ui/Toast";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Button } from "../../components/ui/Button";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "../../components/ui/Card";
import { ROLES } from "../../utils/constants";

export default function UserEdit() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { school } = useAuth();

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

  // Password reset
  const [pwForm, setPwForm] = useState({ new_password: "", confirm_password: "" });
  const [savingPw, setSavingPw] = useState(false);
  const [targetIsAdmin, setTargetIsAdmin] = useState(false);

  // Check if current user is system admin (school id=0)
  const isSystemAdmin = school?.id === 0;

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

        // Check if the target user has admin role in current school
        const schools = data.schools ?? [];
        const currentSchoolId = school?.id;
        const hasAdmin = schools.some((s) => {
          const role = s.role ?? parseField(s, "role");
          return (s.id === currentSchoolId || s.id === 0) && role?.id === ROLES.ADMIN;
        });
        setTargetIsAdmin(hasAdmin);
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

  // School admin cannot change another admin's password
  const canResetPassword = isSystemAdmin || !targetIsAdmin;

  async function handlePasswordReset(e) {
    e.preventDefault();
    if (!pwForm.new_password) {
      toast.error("Шинэ нууц үг оруулна уу.");
      return;
    }
    if (pwForm.new_password.length < 3) {
      toast.error("Нууц үг хамгийн багадаа 3 тэмдэгт байх ёстой.");
      return;
    }
    if (pwForm.new_password !== pwForm.confirm_password) {
      toast.error("Нууц үг таарахгүй байна.");
      return;
    }
    setSavingPw(true);
    try {
      await apiPut(`/users/${user_id}`, withCurrentUser({
        first_name: form.first_name,
        last_name: form.last_name,
        family_name: form.family_name,
        email: form.email,
        phone: form.phone,
        picture: form.picture,
        password: pwForm.new_password,
      }));
      toast.success("Нууц үг амжилттай солигдлоо.");
      setPwForm({ new_password: "", confirm_password: "" });
    } catch (err) {
      toast.error(err.message || "Нууц үг солиход алдаа гарлаа.");
    } finally {
      setSavingPw(false);
    }
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

      {/* Password reset */}
      {!loading && !error && canResetPassword && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiLock className="h-5 w-5" /> Нууц үг шинэчлэх
            </CardTitle>
            <CardDescription>Хэрэглэгчийн нууц үгийг шинээр тохируулна</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Шинэ нууц үг *</Label>
                  <Input
                    type="password"
                    value={pwForm.new_password}
                    onChange={(e) => setPwForm((f) => ({ ...f, new_password: e.target.value }))}
                    placeholder="••••••"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Нууц үг давтах *</Label>
                  <Input
                    type="password"
                    value={pwForm.confirm_password}
                    onChange={(e) => setPwForm((f) => ({ ...f, confirm_password: e.target.value }))}
                    placeholder="••••••"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={savingPw}>
                {savingPw && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                <FiLock className="h-4 w-4" /> Нууц үг солих
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {!loading && !error && !canResetPassword && (
        <Card className="border-zinc-200">
          <CardContent className="py-4">
            <p className="text-sm text-zinc-500">
              Админ хэрэглэгчийн нууц үгийг зөвхөн системийн админ солих боломжтой.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
