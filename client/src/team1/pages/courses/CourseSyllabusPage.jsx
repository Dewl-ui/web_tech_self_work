import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseUsers } from "../../services/courseUserService";
import { getCourse } from "../../services/courseService";
import { getLessonsByCourse } from "../../services/lessonService";
import { getErrorMessage, setCurrentLesson } from "../../utils/school";

const DEFAULT_WEEK_COUNT = 16;

function isAssignment(lesson) {
  return Boolean(lesson?.has_submission || lesson?.open_on || lesson?.close_on || lesson?.end_on);
}

function getLessonTypeLabel(lesson) {
  const rawType = lesson?.type?.name || lesson?.type || lesson?.lesson_type?.name || "";
  const typeLabel = String(rawType).trim();
  const content = lesson?.content || "";

  if (typeLabel) return typeLabel;
  if (isAssignment(lesson)) return "Даалгавар";
  if (content.includes("youtube") || content.includes("<iframe")) return "Материал";
  return "Лекц";
}

function getLessonWeek(lesson) {
  return Number(lesson?.week || lesson?.week_number || lesson?.order_week || lesson?.priority || 1);
}

function getTypeBadgeClass(label = "") {
  const normalized = label.toLowerCase();

  if (normalized.includes("даалгавар")) {
    return "bg-amber-50 text-amber-700 ring-amber-100";
  }

  if (normalized.includes("материал") || normalized.includes("file")) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }

  if (normalized.includes("video") || normalized.includes("видео")) {
    return "bg-rose-50 text-rose-700 ring-rose-100";
  }

  return "bg-indigo-50 text-indigo-700 ring-indigo-100";
}

export default function CourseSyllabusPage() {
  const { course_id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [courseItem, lessonItems, courseUsers] = await Promise.all([
          getCourse(course_id),
          getLessonsByCourse(course_id),
          getCourseUsers(course_id).catch(() => []),
        ]);

        const lessons = lessonItems || [];
        const highestWeek = Math.max(DEFAULT_WEEK_COUNT, ...lessons.map(getLessonWeek));

        setCourse({
          id: courseItem?.id || course_id,
          name: courseItem?.name || "Хичээл",
          teacher: courseItem?.teacher?.name || courseItem?.teacher_name || "Багш",
          code: courseItem?.code || courseItem?.course_code || "—",
          description:
            courseItem?.description ||
            courseItem?.short_description ||
            "Хичээлийн төлөвлөгөө, материал, даалгаврын дараалал.",
          credits: courseItem?.credits || 3,
          durationWeeks: highestWeek,
        });

        const weekList = Array.from({ length: highestWeek }, (_, index) => ({
          id: index + 1,
          title: `${index + 1} долоо хоног`,
          lessons: [],
        }));

        lessons.forEach((lesson, index) => {
          const safeWeek = Math.min(highestWeek, Math.max(1, getLessonWeek(lesson) || 1));

          weekList[safeWeek - 1].lessons.push({
            ...lesson,
            name: lesson?.name || lesson?.title || `Хичээл ${index + 1}`,
            typeLabel: getLessonTypeLabel(lesson),
          });
        });

        setWeeks(weekList);
        setStudents(courseUsers || []);
      } catch (err) {
        setError(getErrorMessage(err, "Төлөвлөгөө ачаалж чадсангүй."));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [course_id]);

  const stats = useMemo(() => {
    const lessons = weeks.flatMap((week) => week.lessons);
    const total = lessons.length;
    const assignments = lessons.filter(
      (lesson) => isAssignment(lesson) || lesson.typeLabel === "Даалгавар"
    ).length;
    const materials = Math.max(total - assignments, 0);

    return {
      totalLessons: total,
      assignmentCount: assignments,
      materialCount: materials,
      assignmentWidth: total ? (assignments / total) * 100 : 0,
      materialWidth: total ? (materials / total) * 100 : 0,
    };
  }, [weeks]);

  const { totalLessons, assignmentCount, materialCount, assignmentWidth, materialWidth } = stats;

  const openLesson = (lesson) => {
    if (!lesson?.id) return;
    setCurrentLesson(lesson);
    navigate(`/team1/lessons/${lesson.id}`, {
      state: { courseId: course_id, lesson },
    });
  };

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow-sm">Ачаалж байна...</div>;
  }

  if (error) {
    return <div className="rounded-lg bg-red-50 px-4 py-3 text-red-600">{error}</div>;
  }

  if (!course) {
    return <div className="rounded-lg bg-white p-6 shadow-sm">Хичээл олдсонгүй.</div>;
  }

  return (
    <div className="px-8 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
          <button
            type="button"
            onClick={() => navigate(`/team1/courses/${course_id}`)}
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            ← Буцах
          </button>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Сургалтын төлөвлөгөө
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">{course.name}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">{course.description}</p>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/team1/courses/${course_id}`)}
              className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Хичээл рүү буцах
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Багш</p>
              <p className="mt-1 font-semibold text-slate-900">{course.teacher}</p>
            </div>
            <div className="rounded-lg bg-indigo-50 p-4">
              <p className="text-xs text-slate-500">Долоо хоног</p>
              <p className="mt-1 font-semibold text-slate-900">{course.durationWeeks}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-xs text-slate-500">Нийт хичээл</p>
              <p className="mt-1 font-semibold text-slate-900">{totalLessons}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-xs text-slate-500">Оюутан</p>
              <p className="mt-1 font-semibold text-slate-900">{students.length}</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Товч мэдээлэл</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-3">
                  <span>Код</span>
                  <span className="font-semibold text-slate-900">{course.code}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Кредит</span>
                  <span className="font-semibold text-slate-900">{course.credits}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Даалгавар</span>
                  <span className="font-semibold text-slate-900">{assignmentCount}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Материал</span>
                  <span className="font-semibold text-slate-900">{materialCount}</span>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Агуулгын бүтэц</h2>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="inline-block h-full bg-amber-400 align-top"
                  style={{ width: `${assignmentWidth}%` }}
                />
                <div
                  className="inline-block h-full bg-emerald-500 align-top"
                  style={{ width: `${materialWidth}%` }}
                />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Даалгавар
                  </span>
                  <span className="font-semibold text-slate-900">{assignmentCount}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Материал
                  </span>
                  <span className="font-semibold text-slate-900">{materialCount}</span>
                </div>
              </div>
            </section>
          </aside>

          <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Долоо хоногийн төлөвлөгөө</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Хичээлүүдийг дарааллаар нь сонгож үзнэ.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {totalLessons} хичээл
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {weeks.map((week) => (
                <div key={week.id} className="grid gap-4 md:grid-cols-[120px_minmax(0,1fr)]">
                  <div className="pt-1">
                    <div className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                      {week.title}
                    </div>
                  </div>

                  <div className="border-l border-slate-200 pl-4">
                    {week.lessons.length ? (
                      <div className="space-y-2">
                        {week.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => openLesson(lesson)}
                            className="flex w-full items-center justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
                          >
                            <span>
                              <span className="block font-semibold text-slate-900">
                                {lesson.name}
                              </span>
                              <span className="mt-1 block text-xs text-slate-500">
                                {lesson.point ? `${lesson.point} оноо` : "Материал"}
                              </span>
                            </span>
                            <span
                              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getTypeBadgeClass(
                                lesson.typeLabel
                              )}`}
                            >
                              {lesson.typeLabel}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-400">
                        Хичээл нэмэгдээгүй
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
