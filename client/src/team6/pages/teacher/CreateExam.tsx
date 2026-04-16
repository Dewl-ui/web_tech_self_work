import { type ChangeEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

type FormState = {
  name: string;
  description: string;
  total_point: string;
  grade_point: string;
  duration: string;
  max_attempt: string;
  open_on: string;
  close_on: string;
  end_on: string;
};

export function CreateExam() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    total_point: "",
    grade_point: "",
    duration: "",
    max_attempt: "",
    open_on: "",
    close_on: "",
    end_on: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField =
    (key: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Шалгалтын нэрээ оруулна уу.");
      return;
    }

    setIsSubmitting(true);
    // Frontend-only flow: simply navigate to the exams list to keep pages linked
    setTimeout(() => {
      navigate(`/team6/teacher/courses/${courseId ?? ""}/exams`);
      setIsSubmitting(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-white">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            to={`/team6/teacher/courses/${courseId ?? ""}`}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Курсууд руу буцах
          </Link>
          {courseId && (
            <span className="text-xs px-3 py-1 rounded-full bg-white/80 border text-slate-500 shadow-sm">
              Курс ID: {courseId}
            </span>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr] items-start">
          <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-xl shadow-indigo-100/40">
            <div className="border-b border-slate-100 px-8 py-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 mb-2">
                Шалгалт
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Шинэ шалгалт үүсгэх
                  </h1>
                  <p className="text-sm text-slate-500">
                    Нэр, оноо, хугацаа, хуваарийг бөглөөд хадгална уу.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-indigo-50 px-3 py-2 rounded-xl">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Урьдчилсан горим (API дуудлагагүй)
                </div>
              </div>
            </div>

            {error && (
              <div className="px-8 pt-6">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Алдаа</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            <form onSubmit={handleSubmit} className="px-8 pb-8 pt-6">
              <div className="space-y-10">
                <section className="space-y-4">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-800">Үндсэн мэдээлэл</h2>
                    <p className="text-xs text-slate-500">Нэр, тайлбар болон онооны мэдээлэл.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Нэр *</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={updateField("name")}
                        placeholder="Ж: Финалын шалгалт"
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Тайлбар</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        value={form.description}
                        onChange={updateField("description")}
                        placeholder="Шалгалтын товч тайлбар, хамрах агуулга"
                        className="min-h-28"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="total_point">Нийт оноо</Label>
                        <Input
                          id="total_point"
                          type="number"
                          min="0"
                          value={form.total_point}
                          onChange={updateField("total_point")}
                          placeholder="100"
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="grade_point">Дүнгийн оноо</Label>
                        <Input
                          id="grade_point"
                          type="number"
                          min="0"
                          value={form.grade_point}
                          onChange={updateField("grade_point")}
                          placeholder="60"
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration">Үргэлжлэх хугацаа (мин)</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="1"
                          value={form.duration}
                          onChange={updateField("duration")}
                          placeholder="90"
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="max_attempt">Зөвшөөрөх оролдлого</Label>
                        <Input
                          id="max_attempt"
                          type="number"
                          min="1"
                          value={form.max_attempt}
                          onChange={updateField("max_attempt")}
                          placeholder="1"
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-800">Хуваарь</h2>
                    <p className="text-xs text-slate-500">Нээх, хаах, дуусгах огноо/цаг.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="open_on">Нээх огноо</Label>
                      <Input
                        id="open_on"
                        type="datetime-local"
                        value={form.open_on}
                        onChange={updateField("open_on")}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="close_on">Хаах огноо</Label>
                      <Input
                        id="close_on"
                        type="datetime-local"
                        value={form.close_on}
                        onChange={updateField("close_on")}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                      <Label htmlFor="end_on">Дуусах огноо</Label>
                      <Input
                        id="end_on"
                        type="datetime-local"
                        value={form.end_on}
                        onChange={updateField("end_on")}
                        className="h-11"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto"
                >
                  Болих
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Шалгалт үүсгэх
                </Button>
              </div>
            </form>
          </div>

          <aside className="bg-white/80 backdrop-blur rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-100/50 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold">
                i
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Товч заавар</p>
                <p className="text-xs text-slate-500">Шалгалтын мэдээллээ шалгаж оруулна уу.</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                Нэр талбарыг заавал бөглөнө.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                Оноо, хугацааг минут/оноогоор оруулна (0-ээс дээш).
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                Огноо/цагуудыг хүсвэл сонгоно, хоосон байж болно.
              </li>
            </ul>
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-sm text-indigo-800">
              Энэ урсгал одоогоор фронтэнд дээр урьдчилан харах зориулалттай. “Шалгалт
              үүсгэх” дарахад жагсаалт руу шилжинэ.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
