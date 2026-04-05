import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../utils/AuthContext";
import { AuthLayout } from "./AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Already logged in → go home
  if (user) return <Navigate to="/team4/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // School is always cleared on login — user must re-select their school
      navigate("/team4/schools/current", { replace: true });
    } catch (err) {
      setError(err.message || "Нэвтрэлт амжилтгүй.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Heading */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-zinc-900">Нэвтрэх</h1>
          <p className="text-sm text-zinc-500">И-мэйл болон нууц үгээ оруулна уу.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">И-мэйл</label>
            <input
              type="email"
              placeholder="a@must.edu.mn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm
                placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700">Нууц үг</label>
              <Link
                to="/team4/forgot-password"
                className="text-xs text-zinc-500 hover:text-zinc-900 underline-offset-4 hover:underline"
              >
                Нууц үг сэргээх
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
            Нэвтрэх
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs text-zinc-400">эсвэл</span>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        {/* Google button */}
        <button
          type="button"
          onClick={() => alert("Google-аар нэвтрэх одоогоор идэвхгүй.")}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200
            bg-white text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          <FcGoogle className="h-4 w-4" />
          Google
        </button>

        {/* Register link */}
        <p className="text-center text-sm text-zinc-500">
          Бүртгэл байхгүй юу?{" "}
          <Link
            to="/team4/register"
            className="font-medium text-zinc-900 hover:underline underline-offset-4"
          >
            Бүртгүүлэх
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
