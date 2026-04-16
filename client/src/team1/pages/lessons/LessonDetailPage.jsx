import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LessonMaterial from "../../components/lesson/LessonMaterial";
import { getCourse } from "../../services/courseService";
import { getLessonsByCourse } from "../../services/lessonService";
import { inferLessonKindFromTypeName } from "../../utils/lessonType";
import {
  getCurrentCourse,
  getCurrentLesson,
  getErrorMessage,
  isLessonCompleted,
  setCurrentLesson,
  setLessonCompleted,
} from "../../utils/school";

function getLessonVideoUrl(lesson) {
  const candidates = [lesson?.video_url, lesson?.content, lesson?.description];

  for (const value of candidates) {
    if (typeof value !== "string") continue;
    const youtubeUrl = value
      .split(/\s+/)
      .find((word) => word.includes("youtube.com/") || word.includes("youtu.be/"));

    if (youtubeUrl) {
      return youtubeUrl.replace(/[),.;]+$/g, "");
    }
  }

  return "";
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
  const [courseLessons, setCourseLessons] = useState(fallbackLesson ? [fallbackLesson] : []);
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
        setCourseLessons(lessonItems || []);
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

  const lessonKind = getLessonKind(lesson);
  const rawVideoUrl = getLessonVideoUrl(lesson);
  const videoUrl = normalizeVideoUrl(rawVideoUrl);
  const assignmentStatus = getAssignmentStatus(lesson);
  const contentText = lesson?.content || "";
  const lessonOrder = (item) =>
    Number(item?.week || item?.week_number || item?.order_week || item?.priority || 0);
  const sortedLessons = [...courseLessons].sort(
    (left, right) =>
      lessonOrder(left) - lessonOrder(right)
  );
  const currentLessonIndex = sortedLessons.findIndex(
    (item) => Number(item?.id) === Number(currentLessonId)
  );
  const previousLesson = currentLessonIndex > 0 ? sortedLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < sortedLessons.length - 1
      ? sortedLessons[currentLessonIndex + 1]
      : null;
  const openLesson = (lessonItem) => {
    if (!lessonItem?.id) return;
    setCurrentLesson(lessonItem);
    navigate(`/team1/lessons/${lessonItem.id}`, {
      state: { courseId: currentCourseId, lesson: lessonItem },
    });
  };

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
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleToggleCompleted}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                completed ? "bg-emerald-100 text-emerald-700" : "bg-indigo-600 text-white"
              }`}
            >
              {completed ? "Хийснийг цуцлах" : "Хийсэн гэж тэмдэглэх"}
            </button>
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

        {lessonKind !== "assignment" ? (
          <div>
            <p className="mb-2 font-semibold text-slate-600">Агуулга</p>
            <LessonMaterial
              content={contentText}
              fileUrl={lessonKind === "file" ? lesson.file_url : ""}
              title={lesson.name || lesson.title || "Материал"}
            />
          </div>
        ) : null}

        {lessonKind === "assignment" ? (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Нээгдсэн огноо</p>
                <p className="mt-1 font-semibold text-slate-700">{lesson.open_on || "—"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Хаагдах огноо</p>
                <p className="mt-1 font-semibold text-slate-700">{lesson.close_on || "—"}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Төлөв</p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${assignmentStatus.color}`}
                >
                  {assignmentStatus.label}
                </span>
              </div>
            </div>

            <LessonMaterial
              content={contentText || "Даалгаврын тайлбар алга."}
              fileUrl={lesson.file_url || ""}
              title={lesson.name || lesson.title || "Даалгавар"}
            />

          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            disabled={!previousLesson}
            onClick={() => openLesson(previousLesson)}
            className="flex min-h-16 items-center rounded-lg bg-indigo-600 px-5 py-3 text-left text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            <span className="mr-3 text-xl" aria-hidden="true">
              ←
            </span>
            <span>
              <span className="block text-xs font-medium text-indigo-100">Өмнөх хичээл</span>
              <span className="block">{previousLesson?.name || previousLesson?.title || "Байхгүй"}</span>
            </span>
          </button>
          <button
            type="button"
            disabled={!nextLesson}
            onClick={() => openLesson(nextLesson)}
            className="flex min-h-16 items-center justify-between rounded-lg bg-indigo-600 px-5 py-3 text-left text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            <span>
              <span className="block text-xs font-medium text-indigo-100">Дараагийн хичээл</span>
              <span className="block">{nextLesson?.name || nextLesson?.title || "Байхгүй"}</span>
            </span>
            <span className="ml-3 text-xl" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
