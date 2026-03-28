import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPost } from "../../utils/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { Alert, AlertDescription } from "../../components/ui/Alert";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
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
  };

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-50">
    <div className="min-h-[60vh] flex items-center justify-center py-8 bg-zinc-50">
      <div className="w-full max-w-sm px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Нууц үг сэргээх</CardTitle>
            <CardDescription>Имэйл хаягаа оруулна уу. Баталгаажуулах код илгээгдэх болно.</CardDescription>
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
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" loading={loading}>
                Код илгээх
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
