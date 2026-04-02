import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockCourses } from "../../data/mockCourses";
import { mockLessons } from "../../data/mockLessons";
import { mockLessonDetails } from "../../data/mockLessonsDetail";

const getStoredWeekContexts = () => {
  const keys = Object.keys(localStorage).filter((key) =>
    key.startsWith("team1-course-weeks-")
  );

  return keys.map((key) => {
    const courseId = Number(key.replace("team1-course-weeks-", ""));

    try {
      return {
        courseId,
        weeks: JSON.parse(localStorage.getItem(key) || "[]"),
      };
    } catch {
      return { courseId, weeks: [] };
    }
  });
};

const getFallbackContexts = () =>
  mockCourses.map((course) => ({
    courseId: Number(course.id),
    weeks: mockLessons,
  }));

const normalizeVideoUrl = (url = "") => {
  if (!url) {
    return "";
  }

  return url.includes("watch?v=") ? url.replace("watch?v=", "embed/") : url;
};

export default function LessonDetailPage() {
  const navigate = useNavigate();
  const { lessonId, lesson_id } = useParams();
  const currentLessonId = Number(lessonId || lesson_id);
  const [refreshKey, setRefreshKey] = useState(0);
  const [submissionFile, setSubmissionFile] = useState(null);

  const lessonContext = useMemo(() => {
    const storedContexts = getStoredWeekContexts();
    const allContexts = storedContexts.length > 0 ? storedContexts : getFallbackContexts();

    for (const context of allContexts) {
      for (const week of context.weeks) {
        const foundLesson = (week.lessons || []).find(
          (item) => Number(item.id) === currentLessonId
        );

        if (foundLesson) {
          return {
            courseId: context.courseId,
            course:
              mockCourses.find(
                (courseItem) => Number(courseItem.id) === Number(context.courseId)
              ) || null,
            weeks: context.weeks,
            activeWeek: week,
            lesson: {
              ...foundLesson,
              weekTitle: week.title,
            },
          };
        }
      }
    }

    const fallbackLesson =
      mockLessonDetails.find((item) => Number(item.id) === currentLessonId) ||
      null;

    if (!fallbackLesson) {
      return null;
    }

    return {
      courseId: null,
      course: null,
      weeks: mockLessons,
      activeWeek: null,
      lesson: fallbackLesson,
    };
  }, [currentLessonId, refreshKey]);

  const updateStoredLesson = (updater) => {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("team1-course-weeks-")
    );

    keys.forEach((key) => {
      try {
        const weeks = JSON.parse(localStorage.getItem(key) || "[]");
        const updatedWeeks = weeks.map((week) => ({
          ...week,
          lessons: week.lessons.map((item) =>
            Number(item.id) === currentLessonId ? updater(item) : item
          ),
        }));
        localStorage.setItem(key, JSON.stringify(updatedWeeks));
      } catch {
        return;
      }
    });

    setRefreshKey((prev) => prev + 1);
  };

  const handleSubmit = () => {
    updateStoredLesson((item) => ({
      ...item,
      submitted: true,
      submittedAt: new Date().toISOString(),
      submissionFileName: submissionFile?.name || item.submissionFileName || "",
    }));
    setSubmissionFile(null);
  };

  const handleEditSubmission = () => {
    updateStoredLesson((item) => ({
      ...item,
      submitted: false,
      submissionFileName: "",
      submittedAt: "",
    }));
  };

  const handleDeleteSubmission = () => {
    updateStoredLesson((item) => ({
      ...item,
      submitted: false,
      submissionFileName: "",
      submittedAt: "",
    }));
  };

  const getStatus = (lesson) => {
    if (!lesson?.submitted) {
      return {
        label: "Илгээгээгүй",
        classes: "bg-slate-100 text-slate-600",
      };
    }

    if (lesson.dueDate && new Date(lesson.dueDate) < new Date()) {
      return {
        label: "Хоцорсон",
        classes: "bg-red-100 text-red-600",
      };
    }

    return {
      label: "Илгээсэн",
      classes: "bg-emerald-100 text-emerald-600",
    };
  };

  if (!lessonContext?.lesson) {
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
          <p className="text-gray-600">Lesson not found</p>
        </div>
      </div>
    );
  }

  const { lesson, weeks, activeWeek, course } = lessonContext;
  const status = getStatus(lesson);
  const assignmentMaterials =
    lesson.materials ||
    [
      {
        id: `${lesson.id}-brief`,
        name: "Сем",
        meta: "PDF Document • 2.4 MB",
        action: "Татаж авах",
      },
      {
        id: `${lesson.id}-guide`,
        name: "Сем",
        meta: "PDF Document • 1.8 MB",
        action: "Татаж авах",
      },
    ];

  if (lesson.type === "assignment") {
    return (
      <div className="px-8 py-6">
        <div className="flex gap-0 overflow-hidden rounded-[24px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
          <div className="w-[260px] bg-slate-50 p-5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-4 text-sm text-indigo-500 hover:underline"
            >
              ← Буцах
            </button>

            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-sm font-bold text-slate-800">
                {course?.name || "Хичээл"}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {weeks.length} долоо хоног
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {weeks.map((week) => {
                const isActive = week.id === activeWeek?.id;

                return (
                  <div
                    key={week.id}
                    className={`rounded-xl px-3 py-3 ${
                      isActive ? "bg-indigo-50" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                          isActive
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {week.id}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            isActive ? "text-indigo-600" : "text-slate-600"
                          }`}
                        >
                          {week.title}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1 bg-slate-50 p-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Даалгавар</h1>
              <p className="mt-3 text-sm text-slate-500">
                Нээгдсэн: {lesson.dueDate || "2026-01-25"}, 12:00 AM
              </p>
            </div>

            <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                Тайлбар
              </p>
              <div className="min-h-[88px] text-sm leading-6 text-slate-700">
                {lesson.content}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {assignmentMaterials.map((material, index) => (
                <div
                  key={material.id || index}
                  className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-lg">
                    {index % 2 === 0 ? "📄" : "📘"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-700">{material.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{material.meta}</p>
                    <button
                      type="button"
                      className="mt-2 text-xs font-medium text-indigo-500 hover:underline"
                    >
                      {material.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {!lesson.submitted ? (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-800">
                  Даалгаврын гүйцэтгэл нэмэх
                </h3>

                <div className="mx-auto mt-5 max-w-md rounded-2xl bg-white p-6 shadow-sm">
                  <label className="flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
                    <span className="text-2xl text-indigo-400">↥</span>
                    <span className="mt-3 text-sm text-slate-500">
                      select your file or drag and drop
                    </span>
                    <span className="mt-1 text-xs text-slate-300">
                      jpg, png, pdf under 10mb
                    </span>
                    <span className="mt-4 rounded-md bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white">
                      Browse
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(event) =>
                        setSubmissionFile(event.target.files?.[0] || null)
                      }
                    />
                  </label>
                  {submissionFile ? (
                    <p className="mt-3 text-sm text-slate-500">
                      Сонгосон файл: {submissionFile.name}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSubmissionFile(null)}
                    className="rounded-xl border border-indigo-200 bg-white px-6 py-2 text-sm font-semibold text-indigo-500"
                  >
                    Цуцлах
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="rounded-xl bg-indigo-500 px-6 py-2 text-sm font-semibold text-white"
                  >
                    Байршуулах
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800">
                    Даалгаврын гүйцэтгэлийн төлөв
                  </h3>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleEditSubmission}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      Засах
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteSubmission}
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-500"
                    >
                      Устгах
                    </button>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">
                  <div className="grid grid-cols-[220px_1fr] border-b border-slate-100">
                    <div className="bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600">
                      Даалгаврын гүйцэтгэлийн төлөв
                    </div>
                    <div className="px-5 py-4 text-sm text-slate-500">
                      Даалгаврыг гүйцэтгэлийг хараахан үнэлээгүй байна
                    </div>
                  </div>
                  <div className="grid grid-cols-[220px_1fr] border-b border-slate-100">
                    <div className="bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600">
                      Дүнгийн төлөв
                    </div>
                    <div className="px-5 py-4 text-sm text-slate-500">Дүнгүй</div>
                  </div>
                  <div className="grid grid-cols-[220px_1fr] border-b border-slate-100">
                    <div className="bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600">
                      Хамгийн сүүлд өөрчлөгдсөн
                    </div>
                    <div className="px-5 py-4 text-sm text-slate-500">
                      {lesson.submittedAt
                        ? new Date(lesson.submittedAt).toLocaleString()
                        : "-"}
                    </div>
                  </div>
                  <div className="grid grid-cols-[220px_1fr]">
                    <div className="bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600">
                      Илгээх материалын тайлбар хийх
                    </div>
                    <div className="px-5 py-4 text-sm text-indigo-500">
                      {lesson.submissionFileName || "Сэтгэгдэлүүд (0)"}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${status.classes}`}
                  >
                    {status.label}
                  </span>
                </div>
              </div>
            )}
          </div>
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
          <h1 className="text-2xl font-bold text-gray-800">{lesson.name}</h1>
          {lesson.weekTitle ? (
            <p className="mt-1 text-sm text-gray-400">{lesson.weekTitle}</p>
          ) : null}
          {(lesson.description || lesson.content) && (
            <p className="mt-2 text-gray-600">
              {lesson.description || lesson.content}
            </p>
          )}
        </div>

        {lesson.type === "video" && (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <iframe
              width="100%"
              height="400"
              src={normalizeVideoUrl(lesson.videoUrl || lesson.content)}
              title="video"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        )}

        {lesson.type === "text" && (
          <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6 text-gray-700">
            {lesson.content}
          </div>
        )}

        {(lesson.type === "file" || lesson.type === "pdf") && (
          <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6">
            <a
              href={lesson.file || lesson.content}
              download
              className="font-semibold text-indigo-600 hover:underline"
            >
              📄 Файл татах
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
