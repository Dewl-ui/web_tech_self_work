import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useTeam1Role from "../../hooks/useTeam1Role";
import { deleteLesson, getLessonsByCourse, updateLesson } from "../../services/lessonService";
import { getLessonTypes } from "../../services/lessonTypeService";
import {
  getFallbackLessonTypeId,
  getLessonKindFromType,
  inferLessonKindFromTypeName,
  sortLessonTypes,
} from "../../utils/lessonType";
import { canCreateLesson, getErrorMessage, toApiIsoString } from "../../utils/school";

function getLessonVideoUrl(lesson) {
  const candidates = [lesson?.video_url, lesson?.content, lesson?.description];
  return (
    candidates.find(
      (value) =>
        typeof value === "string" &&
        (value.includes("youtube.com/") || value.includes("youtu.be/"))
    ) || ""
  );
}

function inferLessonKind(lesson) {
  const rawType = lesson?.type?.name || lesson?.type || lesson?.lesson_type?.name || "";
  const hasVideoUrl = Boolean(getLessonVideoUrl(lesson));

  if (hasVideoUrl) {
    return "video";
  }

  if (lesson?.has_submission || lesson?.open_on || lesson?.close_on || lesson?.end_on) {
    return "assignment";
  }

  return inferLessonKindFromTypeName(rawType);
}

export default function LessonEditPage() {
  const { course_id, lesson_id, lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const role = useTeam1Role();
  const currentCourseId = course_id || location.state?.courseId || "";
  const currentLessonId = lesson_id || lessonId || "";

  const [lessonTypes, setLessonTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    parent_id: "",
    priority: "1",
    type_id: "",
    has_submission: false,
    point: "0",
    content: "",
    video_url: "",
    open_on: "",
    close_on: "",
    end_on: "",
  });

  const sortedLessonTypes = useMemo(() => sortLessonTypes(lessonTypes), [lessonTypes]);
  const selectedKind = useMemo(
    () => getLessonKindFromType(sortedLessonTypes, form.type_id),
    [sortedLessonTypes, form.type_id]
  );

  useEffect(() => {
    let active = true;

    getLessonTypes()
      .then((items) => {
        if (!active) return;
        setLessonTypes(items);
        setForm((prev) => ({
          ...prev,
          type_id: prev.type_id || getFallbackLessonTypeId(items),
        }));
      })
      .catch(() => {
        if (!active) return;
        setForm((prev) => ({
          ...prev,
          type_id: prev.type_id || "1",
        }));
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!currentCourseId || !currentLessonId) {
      setLoading(false);
      return;
    }

    getLessonsByCourse(currentCourseId)
      .then((lessonItems) => {
        const lesson = (lessonItems || []).find(
          (item) => Number(item?.id) === Number(currentLessonId)
        );

        if (!lesson) {
          throw new Error("Lesson not found");
        }

        const lessonKind = inferLessonKind(lesson);
        const videoUrl = getLessonVideoUrl(lesson);

        setForm({
          name: lesson?.name || "",
          parent_id: String(lesson?.parent_id || ""),
          priority: String(lesson?.priority ?? 1),
          type_id: String(lesson?.type_id || lesson?.lesson_type_id || ""),
          has_submission: Boolean(lesson?.has_submission),
          point: String(lesson?.point ?? 0),
          content:
            lessonKind === "video" && videoUrl ? lesson?.description || "" : lesson?.content || "",
          video_url: videoUrl,
          open_on: lesson?.open_on ? String(lesson.open_on).slice(0, 10) : "",
          close_on: lesson?.close_on ? String(lesson.close_on).slice(0, 10) : "",
          end_on: lesson?.end_on ? String(lesson.end_on).slice(0, 10) : "",
        });
      })
      .catch((loadError) => {
        setError(getErrorMessage(loadError, "Хичээлийн хэсэг олдсонгүй."));
      })
      .finally(() => setLoading(false));
  }, [currentCourseId, currentLessonId]);

  if (!canCreateLesson(role)) {
    return <p>Хандах эрхгүй.</p>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateLesson(currentCourseId, currentLessonId, {
        name: form.name,
        parent_id: form.parent_id || "",
        priority: form.priority || "1",
        type_id: form.type_id || getFallbackLessonTypeId(sortedLessonTypes),
        content: selectedKind === "video" && form.video_url ? form.video_url : form.content,
        has_submission: form.has_submission ? "1" : "0",
        point: form.point || "0",
        open_on: form.open_on ? toApiIsoString(form.open_on) : "",
        close_on: form.close_on ? toApiIsoString(form.close_on) : "",
        end_on: form.end_on ? toApiIsoString(form.end_on) : "",
      });
      navigate(-1);
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Алдаа гарлаа."));
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLesson(currentCourseId, currentLessonId);
      navigate(`/team1/courses/${currentCourseId}`);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Устгаж чадсангүй."));
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center font-semibold text-indigo-500">
        Уншиж байна...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-indigo-500 hover:underline"
        >
          ← Буцах
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Сэдэв засах</h1>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Хэсгийн нэр</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Курсийн дугаар</label>
            <input
              type="text"
              value={currentCourseId}
              readOnly
              className="w-full rounded-xl border border-gray-300 bg-slate-50 px-4 py-2 text-sm text-slate-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Эх хэсгийн дугаар</label>
            <input
              type="text"
              value={form.parent_id}
              onChange={(event) => setForm((prev) => ({ ...prev, parent_id: event.target.value }))}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Хичээлийн хэсгийн төрөл</label>
            <select
              value={form.type_id}
              onChange={(event) => setForm((prev) => ({ ...prev, type_id: event.target.value }))}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm outline-none"
            >
              {sortedLessonTypes.map((lessonType) => (
                <option key={lessonType.id} value={String(lessonType.id)}>
                  {lessonType.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400">
              Төрлийн дугаар: {form.type_id || getFallbackLessonTypeId(sortedLessonTypes)}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Эрэмбэ</label>
            <input
              type="text"
              value={form.priority}
              onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Оноо</label>
            <input
              type="text"
              value={form.point}
              onChange={(event) => setForm((prev) => ({ ...prev, point: event.target.value }))}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={form.has_submission}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, has_submission: event.target.checked }))
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              Гүйцэтгэл хүлээж авах
            </label>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Агуулга</label>
            <textarea
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              rows={5}
              placeholder={selectedKind === "assignment" ? "Даалгаврын тайлбар" : "Агуулга"}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none"
            />
          </div>

          {selectedKind === "video" ? (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Видео холбоос</label>
              <input
                type="url"
                value={form.video_url}
                onChange={(event) => setForm((prev) => ({ ...prev, video_url: event.target.value }))}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none"
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Нээх огноо</label>
            <input
              type="date"
              value={form.open_on}
              onChange={(event) => setForm((prev) => ({ ...prev, open_on: event.target.value }))}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Хаах огноо</label>
            <input
              type="date"
              value={form.close_on}
              onChange={(event) => setForm((prev) => ({ ...prev, close_on: event.target.value }))}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Дуусах огноо</label>
            <input
              type="date"
              value={form.end_on}
              onChange={(event) => setForm((prev) => ({ ...prev, end_on: event.target.value }))}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-indigo-500 px-5 py-2 font-semibold text-white"
        >
          {saving ? "Хадгалж байна..." : "Хадгалах"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="ml-3 rounded-xl bg-red-50 px-5 py-2 font-semibold text-red-500"
        >
          Устгах
        </button>
      </form>
    </div>
  );
}
