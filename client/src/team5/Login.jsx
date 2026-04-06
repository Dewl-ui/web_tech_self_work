import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE = "https://todu.mn/bs/lms/v1";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Нэвтрэхэд алдаа гарлаа");
      }

      const data = await res.json();

      // 🔥 token хадгалах
      localStorage.setItem("token", data.token);

      // 🔥 dashboard руу redirect
      navigate("/");
    } catch (err) {
      setError("Имэйл эсвэл нууц үг буруу байна");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#F5F6FA",
      }}
    >
      <div
        style={{
          width: 320,
          background: "#fff",
          padding: 24,
          borderRadius: 10,
          border: "1px solid #E2E5EF",
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Нэвтрэх</h2>

        <input
          type="email"
          placeholder="Имэйл"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Нууц үг"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

        {error && (
          <p style={{ color: "red", fontSize: 12 }}>{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            background: "#3B6FF5",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
        </button>
      </div>
    </div>
  );
}