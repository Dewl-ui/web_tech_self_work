import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { apiPost } from "../../utils/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Alert, AlertDescription } from "../../components/ui/Alert";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    code: "",
    new_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiPost("/otp/email/login", {
        email: form.email,
        code: form.code,
        push_token: "",
      });
      navigate("/team4/login");
    } catch (err) {
      setError(err.message || "Код буруу байна");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-50">
    <div className="min-h-[60vh] flex items-center justify-center py-8 bg-zinc-50">
      <div className="w-full max-w-sm px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Нууц үг шинэчлэх</CardTitle>
            <CardDescription>Имэйлд ирсэн кодыг оруулна уу</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Имэйл</Label>
                <Input type="email" value={form.email} onChange={set("email")} required />
              </div>
              <div className="space-y-2">
                <Label>Баталгаажуулах код</Label>
                <Input placeholder="123456" value={form.code} onChange={set("code")} required />
              </div>
              <div className="space-y-2">
                <Label>Шинэ нууц үг</Label>
                <Input type="password" placeholder="••••••••" value={form.new_password} onChange={set("new_password")} required />
              </div>
              <Button type="submit" className="w-full" loading={loading}>
                Шинэчлэх
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-sm">
            <Link to="/team4/login" className="text-zinc-500 hover:underline">← Нэвтрэх хуудас руу буцах</Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
