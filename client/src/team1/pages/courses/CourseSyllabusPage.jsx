import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourse } from "../../services/courseService";
import { getLessonsByCourse } from "../../services/lessonService";
import { getCourseUsers } from "../../services/courseUserService";
import { getErrorMessage } from "../../utils/school";

function getLessonTypeLabel(lesson) {
  const raw = lesson?.type?.name || lesson?.type || lesson?.lesson_type?.name || "";
  const text = String(raw || "").trim();

  if (text) {
    return text;
  }

  if (lesson?.has_submission || lesson?.open_on || lesson?.close_on || lesson?.end_on) {
    return "Даалгавар";
  }

  if (
    typeof lesson?.content === "string" &&
    (lesson.content.includes("youtube.com") || lesson.content.includes("youtu.be"))
  ) {
    return "Видео";
  }

  return "Текст";
}

function buildWeeks(lessons = []) {
  const weeks = Array.from({ length: 16 }, (_, index) => ({
    id: index + 1,
    title: `${index + 1} долоо хоног`,
    lessons: [],
  }));

  lessons.forEach((lesson, index) => {
    const weekIndex = Math.min(
      16,
      Math.max(
        1,
        Number(
          lesson?.week ||
            lesson?.week_number ||
            lesson?.order_week ||
            lesson?.priority ||
            1
        )
      )
    );

    weeks[weekIndex - 1].lessons.push({
      ...lesson,
      name: lesson?.name || `Хичээл ${index + 1}`,
      typeLabel: getLessonTypeLabel(lesson),
    });
  });

  return weeks;
}

function countAssignmentLessons(weeks) {
  return weeks.reduce(
    (sum, week) =>
      sum +
      week.lessons.filter((lesson) => lesson.has_submission || lesson.typeLabel === "Даалгавар")
        .length,
    0
  );
}

function countVideoLessons(weeks) {
  return weeks.reduce(
    (sum, week) =>
      sum + week.lessons.filter((lesson) => lesson.typeLabel === "Видео").length,
    0
  );
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
    Promise.all([
      getCourse(course_id),
      getLessonsByCourse(course_id),
      getCourseUsers(course_id).catch(() => []),
    ])
      .then(([courseItem, lessonItems, courseUsers]) => {
        setCourse({
          id: courseItem?.id || course_id,
          name: courseItem?.name || "Хичээл",
          teacher: courseItem?.teacher?.name || courseItem?.teacher_name || "Багш",
          code: courseItem?.code || courseItem?.course_code || "—",
          description:
            courseItem?.description ||
            courseItem?.short_description ||
            "Хичээлийн товч мэдээлэл",
          credits: courseItem?.credits || 3,
          durationWeeks: 16,
        });
        setWeeks(buildWeeks(lessonItems || []));
        setStudents(courseUsers || []);
      })
      .catch((loadError) => {
        setError(getErrorMessage(loadError, "Төлөвлөгөө ачаалж чадсангүй."));
      })
      .finally(() => setLoading(false));
  }, [course_id]);

  const totalLessons = useMemo(
    () => weeks.reduce((sum, week) => sum + week.lessons.length, 0),
    [weeks]
  );
  const assignmentCount = useMemo(() => countAssignmentLessons(weeks), [weeks]);
  const videoCount = useMemo(() => countVideoLessons(weeks), [weeks]);
  const materialCount = useMemo(
    () => Math.max(totalLessons - assignmentCount, 0),
    [totalLessons, assignmentCount]
  );

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm">Ачаалж байна...</div>;
  }

  if (error) {
    return <div className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</div>;
  }

  if (!course) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm">Хичээл олдсонгүй.</div>;
  }

  return (
    <div className="space-y-6 px-8 py-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={() => navigate(`/team1/courses/${course_id}`)}
          className="mb-3 text-sm text-indigo-500 hover:underline"
        >
          ← Буцах
        </button>

        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
          Сургалтын төлөвлөгөө
        </div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{course.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">{course.description}</p>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl bg-indigo-50 p-4">
            <div className="text-xs text-slate-500">Багш</div>
            <div className="mt-1 font-semibold text-slate-900">{course.teacher}</div>
          </div>
          <div className="rounded-2xl bg-violet-50 p-4">
            <div className="text-xs text-slate-500">Үргэлжлэх хугацаа</div>
            <div className="mt-1 font-semibold text-slate-900">
              {course.durationWeeks} долоо хоног
            </div>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4">
            <div className="text-xs text-slate-500">Кредит</div>
            <div className="mt-1 font-semibold text-slate-900">{course.credits}</div>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4">
            <div className="text-xs text-slate-500">Бүртгүүлсэн оюутан</div>
            <div className="mt-1 font-semibold text-slate-900">{students.length} оюутан</div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Сургалтын мэдээлэл</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between gap-3">
              <span>Нийт долоо хоног</span>
              <span className="font-semibold text-slate-900">{course.durationWeeks}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Нийт хичээл</span>
              <span className="font-semibold text-slate-900">{totalLessons}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Код</span>
              <span className="font-semibold text-slate-900">{course.code}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Агуулгын задаргаа</h2>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span>Даалгавар</span>
                <span>{assignmentCount}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-indigo-500"
                  style={{ width: `${totalLessons ? (assignmentCount / totalLessons) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span>Видео</span>
                <span>{videoCount}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-amber-500"
                  style={{ width: `${totalLessons ? (videoCount / totalLessons) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span>Бусад материал</span>
                <span>{materialCount}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: `${totalLessons ? (materialCount / totalLessons) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Долоо хоногийн бүтэц</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {weeks.slice(0, 6).map((week) => (
              <div key={week.id} className="flex items-center justify-between gap-3">
                <span>{week.title}</span>
                <span className="font-semibold text-slate-900">
                  {week.lessons.length} хичээл
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
