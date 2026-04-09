// Member A OWNS this file — Admin profile page at /team4/profile
import { useEffect, useState } from "react";
import { FiUser, FiMail, FiPhone, FiSave, FiShield } from "react-icons/fi";
import { apiGet, apiPut, withCurrentUser } from "../../utils/api";
import { useAuth } from "../../utils/AuthContext";
import { useToast } from "../../components/ui/Toast";

function Field({ label, value, onChange, type = "text", readOnly = false }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        className={`flex h-10 w-full rounded-lg border px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-zinc-900
          ${readOnly
            ? "border-zinc-100 bg-zinc-50 text-zinc-400 cursor-default"
            : "border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400"}`}
      />
    </div>
  );
}

export default function AdminProfile() {
  const toast = useToast();
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm]       = useState({ first_name: "", last_name: "", family_name: "", phone: "", picture: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    apiGet("/users/me")
      .then((data) => {
        setProfile(data);
        setForm({
          first_name:  data.first_name  ?? "",
          last_name:   data.last_name   ?? "",
          family_name: data.family_name ?? "",
          phone:       data.phone       ?? "",
          picture:     data.picture     ?? "",
        });
      })
      .catch((err) => {
        const msg = err.message || "Профайл ачааллахад алдаа гарлаа.";
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await apiPut("/users/me", withCurrentUser(form));
      setProfile((prev) => ({ ...prev, ...form }));
      await refreshUser();
      toast.success("Амжилттай хадгалагдлаа.");
    } catch (err) {
      toast.error(err.message || "Хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  }

  const initials = [profile?.first_name, profile?.last_name]
    .filter(Boolean).map((s) => s[0].toUpperCase()).join("") || "A";

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700">
          <FiShield className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Миний профайл</h1>
          <p className="text-sm text-zinc-500">Админ · {profile?.email ?? "…"}</p>
        </div>
      </div>

      {/* Avatar + name */}
      {loading ? (
        <div className="h-24 w-full animate-pulse rounded-xl bg-zinc-100" />
      ) : (
        <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5">
          {profile?.picture && profile.picture !== "no-image.jpg" ? (
            <img
              src={/^(https?:)?\/\//i.test(profile.picture) ? profile.picture : `https://todu.mn/bs/lms/v1/${profile.picture}`}
              alt="avatar"
              className="h-16 w-16 shrink-0 rounded-full object-cover"
              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
            />
          ) : null}
          <div className={`h-16 w-16 shrink-0 items-center justify-center rounded-full bg-purple-100
            text-2xl font-bold text-purple-700 ${profile?.picture && profile.picture !== "no-image.jpg" ? "hidden" : "flex"}`}>
            {initials}
          </div>
          <div>
            <p className="text-lg font-semibold text-zinc-900">
              {[profile?.last_name, profile?.first_name].filter((v) => v && v !== "-").join(" ") || "—"}
            </p>
            <p className="text-sm text-zinc-400">@{profile?.username ?? "—"}</p>
          </div>
        </div>
      )}

      {/* Edit form */}
      <form onSubmit={handleSave} className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4">
        <h2 className="font-semibold text-zinc-800">Мэдээлэл засах</h2>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Овог"    value={form.last_name}  onChange={(v) => setForm((f) => ({ ...f, last_name: v }))} />
          <Field label="Нэр"     value={form.first_name} onChange={(v) => setForm((f) => ({ ...f, first_name: v }))} />
        </div>
        <Field label="И-мэйл"   value={profile?.email}    readOnly />
        <Field label="Хэрэглэгчийн нэр" value={profile?.username} readOnly />
        <Field label="Утас"      value={form.phone}  type="tel" onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
        <Field label="Профайл зураг (URL)" value={form.picture} onChange={(v) => setForm((f) => ({ ...f, picture: v }))} />

        <button
          type="submit"
          disabled={saving || loading}
          className="flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-5 text-sm font-medium
            text-white transition-colors hover:bg-zinc-700 disabled:pointer-events-none disabled:opacity-60"
        >
          {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
          <FiSave className="h-4 w-4" />
          Хадгалах
        </button>
      </form>

      {/* Schools the admin belongs to */}
      {profile?.schools?.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3">
          <h2 className="font-semibold text-zinc-800">Бүртгэлтэй сургуулиуд</h2>
          <div className="space-y-2">
            {profile.schools.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-zinc-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <FiUser className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-800">{s.name}</span>
                </div>
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                  {s.role?.name ?? "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
