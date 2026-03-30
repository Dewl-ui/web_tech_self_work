import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../../utils/api";
// import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Alert, AlertDescription } from "../../components/ui/Alert";
import { FiMail, FiLock } from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/team4/");
    } catch (err) {
      setError(err.message || "Нэвтрэх амжилтгүй боллоо");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-50">
    <div className="min-h-[60vh] flex items-center justify-center py-8">
      <div className="w-full max-w-sm px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Нэвтрэх</CardTitle>
            <CardDescription>Системд нэвтрэхийн тулд мэдээллээ оруулна уу</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Имэйл</Label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@must.edu.mn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Нууц үг</Label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" loading={loading}>
                Нэвтрэх
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 text-sm text-center">
            <Link to="/team4/forgot-password" className="text-zinc-500 hover:text-zinc-900 underline-offset-4 hover:underline">
              Нууц үгээ мартсан уу?
            </Link>
            <span className="text-zinc-400">
              Бүртгэл байхгүй?{" "}
              <Link to="/team4/register" className="text-zinc-900 font-medium hover:underline">
                Бүртгүүлэх
              </Link>
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
