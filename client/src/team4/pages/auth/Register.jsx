import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPost } from "../../utils/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Alert, AlertDescription } from "../../components/ui/Alert";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", username: "", phone: "", password: "", confirm_password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm_password) {
      setError("Нууц үг таарахгүй байна");
      return;
    }
    setLoading(true);
    try {
      await apiPost("/users", {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        username: form.username,
        phone: form.phone,
        password: form.password,
      });
      navigate("/team4/login?registered=1");
    } catch (err) {
      setError(err.message || "Бүртгэл амжилтгүй боллоо");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-50 overflow-y-auto py-8">
    <div className="min-h-[60vh] flex items-center justify-center py-8 overflow-y-auto">
      <div className="w-full max-w-lg px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Бүртгүүлэх</CardTitle>
            <CardDescription>Шинэ бүртгэл үүсгэнэ үү</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Овог</Label>
                  <Input placeholder="Овог" value={form.last_name} onChange={set("last_name")} required />
                </div>
                <div className="space-y-2">
                  <Label>Нэр</Label>
                  <Input placeholder="Нэр" value={form.first_name} onChange={set("first_name")} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Имэйл</Label>
                <Input type="email" placeholder="email@example.com" value={form.email} onChange={set("email")} required />
              </div>
              <div className="space-y-2">
                <Label>Хэрэглэгчийн нэр</Label>
                <Input placeholder="username" value={form.username} onChange={set("username")} required />
              </div>
              <div className="space-y-2">
                <Label>Утасны дугаар</Label>
                <Input placeholder="99001234" value={form.phone} onChange={set("phone")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Нууц үг</Label>
                  <Input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} required />
                </div>
                <div className="space-y-2">
                  <Label>Нууц үг давтах</Label>
                  <Input type="password" placeholder="••••••••" value={form.confirm_password} onChange={set("confirm_password")} required />
                </div>
              </div>
              <Button type="submit" className="w-full" loading={loading}>
                Бүртгүүлэх
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-sm">
            <span className="text-zinc-500">
              Бүртгэлтэй юу?{" "}
              <Link to="/team4/login" className="text-zinc-900 font-medium hover:underline">Нэвтрэх</Link>
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
