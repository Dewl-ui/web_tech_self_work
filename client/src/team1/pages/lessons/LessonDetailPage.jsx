import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCourse } from "../../services/courseService";
import { getLessonsByCourse } from "../../services/lessonService";
import { inferLessonKindFromTypeName } from "../../utils/lessonType";
import {
  getCompletedLessonIds,
  getCurrentCourse,
  getCurrentLesson,
  getErrorMessage,
  isLessonCompleted,
  setCurrentLesson,
  setLessonCompleted,
} from "../../utils/school";

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

function normalizeVideoUrl(url = "") {
  if (!url) return "";
  if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  return url;
}

function getLessonKind(lesson) {
  const rawType =
    lesson?.type?.name || lesson?.type || lesson?.lesson_type?.name || "";
  const hasVideoUrl = Boolean(getLessonVideoUrl(lesson));
  const kindFromType = inferLessonKindFromTypeName(rawType);

  if (hasVideoUrl) return "video";
  if (kindFromType === "assignment") return "assignment";
  if (lesson?.has_submission || lesson?.open_on || lesson?.close_on || lesson?.end_on) {
    return "assignment";
  }

  return kindFromType;
}

function getAssignmentStatus(lesson) {
  if (lesson?.has_submission) {
    return { label: "Илгээсэн", color: "text-green-600 bg-green-50" };
  }

  if (lesson?.close_on && new Date(lesson.close_on) < new Date()) {
    return { label: "Хоцорсон", color: "text-red-600 bg-red-50" };
  }

  return { label: "Илгээгээгүй", color: "text-slate-600 bg-slate-100" };
}

export default function LessonDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lessonId, lesson_id } = useParams();
  const currentLessonId = lessonId || lesson_id;
  const fallbackCourse = getCurrentCourse();
  const currentCourseId = location.state?.courseId || fallbackCourse?.id || "";
  const fallbackLesson = useMemo(() => {
    const routeLesson = location.state?.lesson;
    if (routeLesson && Number(routeLesson.id) === Number(currentLessonId)) {
      return routeLesson;
    }

    const storedLesson = getCurrentLesson();
    if (storedLesson && Number(storedLesson.id) === Number(currentLessonId)) {
      return storedLesson;
    }

    return null;
  }, [currentLessonId, location.state]);

  const [courseName, setCourseName] = useState(fallbackCourse?.name || "Хичээл");
  const [lesson, setLesson] = useState(fallbackLesson);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(
    currentCourseId && currentLessonId
      ? isLessonCompleted(currentCourseId, currentLessonId)
      : false
  );

  useEffect(() => {
    if (!currentCourseId || !currentLessonId) {
      setError("Хичээлийн мэдээлэл дутуу байна.");
      setLoading(false);
      return;
    }

    Promise.all([getCourse(currentCourseId), getLessonsByCourse(currentCourseId)])
      .then(([course, lessonItems]) => {
        const lessonItem = (lessonItems || []).find(
          (item) => Number(item?.id) === Number(currentLessonId)
        );

        if (!lessonItem) {
          throw new Error("Хичээлийн хэсэг олдсонгүй.");
        }

        setCourseName(course?.name || "Хичээл");
        setLesson(lessonItem);
        setCurrentLesson(lessonItem);
      })
      .catch((loadError) => {
        if (fallbackLesson) {
          setLesson(fallbackLesson);
        } else {
          setError(getErrorMessage(loadError, "Хичээлийн хэсэг олдсонгүй."));
        }
      })
      .finally(() => setLoading(false));
  }, [currentCourseId, currentLessonId, fallbackLesson]);

  useEffect(() => {
    if (!currentCourseId || !currentLessonId) return;
    setCompleted(isLessonCompleted(currentCourseId, currentLessonId));
  }, [currentCourseId, currentLessonId, lesson]);

  const lessonKind = useMemo(() => getLessonKind(lesson), [lesson]);
  const videoUrl = useMemo(() => normalizeVideoUrl(getLessonVideoUrl(lesson)), [lesson]);
  const assignmentStatus = useMemo(() => getAssignmentStatus(lesson), [lesson]);
  const completedCount = useMemo(
    () => (currentCourseId ? getCompletedLessonIds(currentCourseId).length : 0),
    [currentCourseId, completed]
  );

  const handleToggleCompleted = () => {
    const nextValue = !completed;
    setLessonCompleted(currentCourseId, currentLessonId, nextValue);
    setCompleted(nextValue);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-8 py-6 text-slate-500">Ачаалж байна...</div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="mx-auto max-w-5xl px-8 py-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 text-sm text-indigo-500 hover:underline"
          >
            ← Буцах
          </button>
          <p className="text-gray-600">{error || "Хичээлийн хэсэг олдсонгүй."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-8 py-6">
      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 text-sm text-indigo-500 hover:underline"
          >
            ← Буцах
          </button>
          <p className="text-sm text-slate-400">{courseName}</p>
          <h1 className="text-2xl font-bold text-gray-800">
            {lesson.name || lesson.title}
          </h1>
          <p className="mt-2 text-gray-600">
            {lesson.description || lesson.content || "Тайлбар алга."}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleToggleCompleted}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                completed
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-indigo-600 text-white"
              }`}
            >
              {completed ? "Хийснийг цуцлах" : "Хийсэн гэж тэмдэглэх"}
            </button>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                completed ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
              }`}
            >
              {completed ? "Хийсэн" : "Хийж амжаагүй"}
            </span>
            <span className="text-xs text-slate-400">
              Хийсэн хичээлийн тоо: {completedCount}
            </span>
          </div>
        </div>

        {lessonKind === "video" && videoUrl ? (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <iframe
              width="100%"
              height="420"
              src={videoUrl}
              title="Видео"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        ) : null}

        {lessonKind === "file" ? (
          <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6">
            <a
              href={lesson.file_url || lesson.content}
              className="font-semibold text-indigo-600 hover:underline"
              download
            >
              Файл татах
            </a>
          </div>
        ) : null}

        {lessonKind === "text" ? (
          <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6 text-gray-700">
            {lesson.content || "Контент алга."}
          </div>
        ) : null}

        {lessonKind === "assignment" ? (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Нээгдсэн огноо</p>
                <p className="mt-2 font-semibold text-slate-700">
                  {lesson.open_on || "—"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Хаагдах огноо</p>
                <p className="mt-2 font-semibold text-slate-700">
                  {lesson.close_on || "—"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Төлөв</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${assignmentStatus.color}`}
                >
                  {assignmentStatus.label}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6 text-gray-700">
              {lesson.content || "Даалгаврын тайлбар алга."}
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="font-semibold text-slate-700">Файл оруулах</p>
              <p className="mt-2 text-sm text-slate-400">
                Энд файл чирж оруулах эсвэл товч ашиглан сонгоно.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  type="button"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Даалгавар илгээх
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                >
                  Засах
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-500"
                >
                  Устгах
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
