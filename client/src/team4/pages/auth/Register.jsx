import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../utils/AuthContext";
import { apiPost } from "../../utils/api";
import { useToast } from "../../components/ui/Toast";
import { AuthLayout } from "./AuthLayout";

export default function Register() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    last_name: "",
    first_name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/team4/" replace />;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.last_name.trim()) {
      toast.error("Овогоо оруулна уу.");
      return;
    }
    if (!form.first_name.trim()) {
      toast.error("Нэрээ оруулна уу.");
      return;
    }
    if (!form.email.trim()) {
      toast.error("И-мэйл хаягаа оруулна уу.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error("Зөв и-мэйл хаяг оруулна уу.");
      return;
    }
    if (!form.username.trim()) {
      toast.error("Хэрэглэгчийн нэрээ оруулна уу.");
      return;
    }
    if (!form.password) {
      toast.error("Нууц үгээ оруулна уу.");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой.");
      return;
    }
    if (!form.confirm_password) {
      toast.error("Нууц үг давтан оруулна уу.");
      return;
    }
    if (form.password !== form.confirm_password) {
      toast.error("Нууц үг таарахгүй байна.");
      return;
    }

    setLoading(true);
    try {
      // Background login to get a token (POST /users requires auth)
      const BASE_URL = "https://todu.mn/bs/lms/v1";
      const loginRes = await fetch(`${BASE_URL}/token/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@must.edu.mn", password: "123", push_token: "" }),
      });
      const loginData = await loginRes.json();
      const token = loginData.access_token;
      if (!token) throw new Error("Серверт холбогдож чадсангүй.");

      // Create user with the obtained token
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          username: form.username,
          phone: form.phone,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Бүртгүүлэлт амжилтгүй.");
      }

      toast.success("Бүртгэл амжилттай! Нэвтэрнэ үү.");
      navigate("/team4/login?registered=1");
    } catch (err) {
      toast.error(err.message || "Бүртгүүлэлт амжилтгүй.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Heading */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-zinc-900">Бүртгүүлэх</h1>
          <p className="text-sm text-zinc-500">Мэдээллээ зөв бөглөнө үү.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700">Овог</label>
              <input
                type="text"
                placeholder="Бөхбат"
                value={form.last_name}
                onChange={set("last_name")}

                className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm
                  placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700">Нэр</label>
              <input
                type="text"
                placeholder="Амартүвшин"  
                value={form.first_name}
                onChange={set("first_name")}

                className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm
                  placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">И-мэйл</label>
            <input
              type="text"
              placeholder="B23@must.edu.mn"
              value={form.email}
              onChange={set("email")}
              className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm
                placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">Хэрэглэгчийн нэр</label>
            <input
              type="text"
              placeholder="Амараа"
              value={form.username}
              onChange={set("username")}
              className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm
                placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">Нууц үг</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set("password")}
              className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm
                placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            <p className="text-xs text-zinc-400">Хамгийн багадаа 8 тэмдэгт.</p>
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">Нууц үг давтан оруулах</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.confirm_password}
              onChange={set("confirm_password")}
              className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm
                placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 text-sm
              font-medium text-white transition-colors hover:bg-zinc-700
              disabled:pointer-events-none disabled:opacity-60"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            Бүртгүүлэх
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs text-zinc-400">эсвэл</span>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        {/* Google button */}
        {/* <button
          type="button"
          onClick={() => toast.warning("Google-аар бүртгүүлэх одоогоор идэвхгүй.")}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200
            bg-white text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          <FcGoogle className="h-4 w-4" />
          Google
        </button> */}

        {/* Login link */}
        <p className="text-center text-sm text-zinc-500">
          Бүртгэлтэй юу?{" "}
          <Link
            to="/team4/login"
            className="font-medium text-zinc-900 hover:underline underline-offset-4"
          >
            Нэвтрэх
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
