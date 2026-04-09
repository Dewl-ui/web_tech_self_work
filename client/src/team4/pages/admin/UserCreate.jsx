import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSave, FiUserPlus, FiUserCheck } from "react-icons/fi";
import { apiGet, apiPost, withCurrentUser, getStoredUserId } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import { useToast } from "../../components/ui/Toast";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "../../components/ui/Card";

function getSchoolId(school) {
  return school?.id ?? school?.school_id ?? school?.SCHOOL_ID ?? school?.ID ?? null;
}

export default function UserCreate() {
  const navigate = useNavigate();
  const { school } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState("new"); // "new" | "existing"

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    password_confirm: "",
    role_id: "",
  });
  const [existingForm, setExistingForm] = useState({ username: "", role_id: "", user_id: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function setEx(key) {
    return (e) => setExistingForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleAddExisting(e) {
    e.preventDefault();
    setError("");
    if (!existingForm.username.trim() || !existingForm.role_id) {
      setError("Имэйл/username болон эрхийг заавал сонгоно уу.");
      return;
    }
    const schoolId = getSchoolId(school);
    if (!schoolId) {
      setError("Сургууль сонгогдоогүй байна.");
      return;
    }
    setSaving(true);
    try {
      await apiPost(`/schools/${schoolId}/users`, withCurrentUser({
        username: existingForm.username.trim(),
        role_id: Number(existingForm.role_id),
      }));
      toast.success("Хэрэглэгч сургуульд амжилттай нэмэгдлээ.");
      navigate("/team4/users");
    } catch (err) {
      const msg = err.message || "Хэрэглэгч нэмэхэд алдаа гарлаа.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.first_name.trim() || !form.email.trim() || !form.password) {
      setError("Нэр, имэйл, нууц үг заавал бөглөнө үү.");
      return;
    }
    if (form.password.length < 3) {
      setError("Нууц үг хамгийн багадаа 3 тэмдэгт байх ёстой.");
      return;
    }
    if (form.password !== form.password_confirm) {
      setError("Нууц үг таарахгүй байна.");
      return;
    }

    const schoolId = getSchoolId(school);
    setSaving(true);

    try {
      // 1. Create the user
      await apiPost("/users", {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        username: form.username || form.email,
        phone: form.phone,
        password: form.password,
      });

      // 2. Add user to current school with selected role
      if (schoolId && form.role_id) {
        try {
          await apiPost(`/schools/${schoolId}/users`, withCurrentUser({
            username: form.username || form.email,
            role_id: form.role_id,
          }));
        } catch {
          // user created but school assignment may fail if already exists
        }
      }

      toast.success("Хэрэглэгч амжилттай бүртгэгдлээ.");
      navigate("/team4/users");
    } catch (err) {
      const msg = err.message || "Хэрэглэгч бүртгэхэд алдаа гарлаа.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/team4/users")}>
          <FiArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Хэрэглэгч бүртгэх</h1>
          <p className="text-sm text-zinc-500">Шинэ хэрэглэгч нэмэх</p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <Button
          variant={mode === "new" ? "default" : "outline"}
          onClick={() => { setMode("new"); setError(""); }}
        >
          <FiUserPlus className="h-4 w-4" /> Шинэ хэрэглэгч
        </Button>
        <Button
          variant={mode === "existing" ? "default" : "outline"}
          onClick={() => { setMode("existing"); setError(""); }}
        >
          <FiUserCheck className="h-4 w-4" /> Байгаа хэрэглэгч нэмэх
        </Button>
      </div>

      {mode === "existing" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiUserCheck className="h-5 w-5" /> Байгаа хэрэглэгчийг сургуульд нэмэх
            </CardTitle>
            <CardDescription>Системд бүртгэлтэй хэрэглэгчийн имэйл эсвэл username оруулна уу</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExisting} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Username *</Label>
                <Input
                  value={existingForm.username}
                  onChange={setEx("username")}
                  placeholder="admin"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Эрх *</Label>
                <Select value={existingForm.role_id} onChange={setEx("role_id")} required>
                  <option value="">-- Сонгох --</option>
                  <option value="10">Админ</option>
                  <option value="20">Багш</option>
                  <option value="30">Оюутан</option>
                </Select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving}>
                  {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                  <FiSave className="h-4 w-4" /> Нэмэх
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/team4/users")}>
                  Цуцлах
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {mode === "new" && <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiUserPlus className="h-5 w-5" /> Шинэ хэрэглэгч
          </CardTitle>
          <CardDescription>Мэдээллийг бөглөнө үү</CardDescription>
        </CardHeader>
        <CardContent>
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
              <Label>Имэйл *</Label>
              <Input type="email" value={form.email} onChange={set("email")} placeholder="user@example.com" required />
            </div>

            <div className="space-y-1.5">
              <Label>Хэрэглэгчийн нэр</Label>
              <Input value={form.username} onChange={set("username")} placeholder="Хоосон бол имэйл ашиглана" />
            </div>

            <div className="space-y-1.5">
              <Label>Утас</Label>
              <Input type="tel" value={form.phone} onChange={set("phone")} placeholder="99001122" />
            </div>

            <div className="space-y-1.5">
              <Label>Эрх</Label>
              <Select value={form.role_id} onChange={set("role_id")}>
                <option value="">-- Сонгох --</option>
                <option value="10">Админ</option>
                <option value="20">Багш</option>
                <option value="30">Оюутан</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Нууц үг *</Label>
                <Input type="password" value={form.password} onChange={set("password")} placeholder="••••••" required />
              </div>
              <div className="space-y-1.5">
                <Label>Нууц үг давтах *</Label>
                <Input type="password" value={form.password_confirm} onChange={set("password_confirm")} placeholder="••••••" required />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                <FiSave className="h-4 w-4" /> Бүртгэх
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/team4/users")}>
                Цуцлах
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>}
    </div>
  );
}
