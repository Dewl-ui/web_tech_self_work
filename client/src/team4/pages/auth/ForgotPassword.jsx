import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { apiPost } from "../../utils/api";
import { AuthLayout } from "./AuthLayout";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Navigate to="/team4/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiPost("/otp/email", { email });
      navigate("/team4/reset-password", { state: { email } });
    } catch (err) {
      setError(err.message || "Код илгээхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Heading */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-zinc-900">Нууц үг сэргээх</h1>
          <p className="text-sm text-zinc-500">
            Имэйл хаягаа оруулна уу. Баталгаажуулах код илгээгдэх болно.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">И-Мэйл</label>
            <input
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Код илгээх
          </button>
        </form>

        {/* Back to login */}
        <p className="text-center text-sm">
          <Link
            to="/team4/login"
            className="text-zinc-500 hover:text-zinc-900 underline-offset-4 hover:underline"
          >
            ← Нэвтрэх хуудас руу буцах
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
