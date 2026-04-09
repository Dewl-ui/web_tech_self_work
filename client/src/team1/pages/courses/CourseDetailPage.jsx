import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTeam1Role from "../../hooks/useTeam1Role";
import { getCourse } from "../../services/courseService";
import { createRequest } from "../../services/requestService";
import { deleteLesson, getLessonsByCourse } from "../../services/lessonService";
import { getCourseUsers } from "../../services/courseUserService";
import {
  canCreateLesson,
  canDeleteLesson,
  canManageCourseStudents,
  getCompletedLessonIds,
  getErrorMessage,
  isSchoolAdmin,
  setCurrentCourse,
  setCurrentLesson,
} from "../../utils/school";

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

function buildWeeks(lessons = [], completedLessonIds = []) {
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
      completed: completedLessonIds.some((item) => Number(item) === Number(lesson?.id)),
    });
  });

  weeks.forEach((week) => {
    week.lessons.sort(
      (left, right) => Number(left?.priority || 0) - Number(right?.priority || 0)
    );
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

export default function CourseDetailPage() {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const role = useTeam1Role();
  const [course, setCourse] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [students, setStudents] = useState([]);
  const [openWeeks, setOpenWeeks] = useState([1]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [completionVersion, setCompletionVersion] = useState(0);

  useEffect(() => {
    const handleCompletionChange = () => setCompletionVersion((value) => value + 1);
    window.addEventListener("team1-lesson-completion-change", handleCompletionChange);

    return () => {
      window.removeEventListener("team1-lesson-completion-change", handleCompletionChange);
    };
  }, []);

  const loadData = async () => {
    const [courseItem, lessonItems, courseUsers] = await Promise.all([
      getCourse(course_id),
      getLessonsByCourse(course_id),
      getCourseUsers(course_id).catch(() => []),
    ]);

    const normalizedCourse = {
      id: courseItem?.id || course_id,
      name: courseItem?.name || "Хичээл",
      teacher: courseItem?.teacher?.name || courseItem?.teacher_name || "Багш",
      code: courseItem?.code || courseItem?.course_code || "—",
      progress: courseItem?.progress || 0,
      description:
        courseItem?.description ||
        courseItem?.short_description ||
        "Хичээлийн товч мэдээлэл",
      credits: courseItem?.credits || 3,
      durationWeeks: 16,
    };

    setCurrentCourse(normalizedCourse);
    setCourse(normalizedCourse);
    setWeeks(buildWeeks(lessonItems, getCompletedLessonIds(course_id)));
    setStudents(courseUsers || []);
  };

  useEffect(() => {
    loadData()
      .catch((loadError) => {
        setError(getErrorMessage(loadError, "Хичээлийн мэдээлэл ачаалж чадсангүй."));
      })
      .finally(() => setLoading(false));
  }, [course_id, completionVersion]);

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

  const isWeekOpen = (weekId) => openWeeks.includes(weekId);

  const toggleWeek = (id) => {
    setOpenWeeks((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const handleTeacherRequest = async () => {
    try {
      setRequestMessage("");
      await createRequest({
        type: "teacher",
        course_id: Number(course_id),
      });
      setRequestMessage("Багш болох хүсэлтийг системийн админ руу илгээлээ.");
    } catch (requestError) {
      setRequestMessage(getErrorMessage(requestError, "Хүсэлт илгээж чадсангүй."));
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await deleteLesson(course_id, lessonId);
      await loadData();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Хичээлийн хэсгийг устгаж чадсангүй."));
    }
  };

  const openLessonDetail = (lesson) => {
    setCurrentLesson(lesson);
    navigate(`/team1/lessons/${lesson.id}`, {
      state: { courseId: course_id, lesson },
    });
  };

  const handleLessonAction = async (weekId) => {
    if (canCreateLesson(role)) {
      navigate(`/team1/courses/${course.id}/lessons/create`, {
        state: { courseId: course.id, weekNumber: weekId },
      });
      return;
    }

    try {
      setError("");
      setRequestMessage("");
      await createRequest({
        type: "teacher",
        course_id: Number(course_id),
      });
      setRequestMessage("Багш болох хүсэлтийг системийн админ руу илгээлээ.");
    } catch (requestError) {
      setRequestMessage(getErrorMessage(requestError, "Хүсэлт илгээж чадсангүй."));
    }
  };

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm">Ачаалж байна...</div>;
  }

  if (error && !course) {
    return <div className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</div>;
  }

  if (!course) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm">Хичээл олдсонгүй.</div>;
  }

  return (
    <div className="space-y-6 px-8 py-6">
      <div className="rounded-2xl border border-gray-100 bg-white px-8 py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate("/team1/courses")}
              className="mb-1 block text-sm text-indigo-500 hover:underline"
            >
              ← Буцах
            </button>
            <h1 className="text-xl font-bold text-gray-800">{course.name}</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(`/team1/courses/${course.id}/report`)}
              className="rounded-xl border border-sky-200 bg-sky-50 px-5 py-2 text-sm font-semibold text-sky-600"
            >
              Тайлан
            </button>
            {isSchoolAdmin(role) ? (
              <button
                type="button"
                onClick={handleTeacherRequest}
                className="rounded-xl border border-indigo-200 bg-white px-5 py-2 text-sm font-semibold text-indigo-600"
              >
                Багш эрх хүсэх
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-5 text-xs text-gray-500">
          <span>Багш: {course.teacher}</span>
          <span>Код: {course.code}</span>
          <span>Нийт хичээл: {totalLessons}</span>
          <span>Сурагч: {students.length}</span>
        </div>
      </div>

      {requestMessage ? (
        <div className="rounded-xl bg-sky-50 px-4 py-3 text-sky-600">{requestMessage}</div>
      ) : null}

      {error ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</div>
      ) : null}

      {canManageCourseStudents(role) ? (
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Сурагчид ба багууд</h2>
              <p className="mt-1 text-sm text-slate-500">
                Энэ хичээлийн баг үүсгэх, сурагч нэмэх, хасах үйлдлийг тусдаа
                хуудсаар удирдана.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/team1/courses/${course_id}/users`)}
              className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white"
            >
              Сурагч удирдах
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-5">
          <button
            type="button"
            onClick={() => navigate(`/team1/courses/${course_id}/syllabus`)}
            className="flex w-full items-center justify-between rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4 text-left shadow-sm transition hover:bg-indigo-100"
          >
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Төлөвлөгөө
              </div>
              <div className="mt-2 text-lg font-bold text-slate-900">
                Төлөвлөгөө харах
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Хичээлийн хөтөлбөр, бүтэц, задаргааг тусдаа хуудсаар үзнэ.
              </div>
            </div>
            <div className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-indigo-600">
              Нээх
            </div>
          </button>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            {weeks.map((week) => (
              <div key={week.id} className="mb-4">
                <button
                  type="button"
                  onClick={() => toggleWeek(week.id)}
                  className="mb-2 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-semibold text-gray-700 transition hover:bg-slate-50"
                >
                  <span>{week.title}</span>
                  <span className="text-base text-slate-500">
                    {isWeekOpen(week.id) ? "⌄" : "›"}
                  </span>
                </button>

                {isWeekOpen(week.id) ? (
                  <div className="space-y-2">
                    {week.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="rounded-lg p-2 text-left text-sm hover:bg-blue-100"
                      >
                        <button
                          type="button"
                          onClick={() => openLessonDetail(lesson)}
                          className="block w-full text-left"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-medium text-slate-700">{lesson.name}</div>
                            {lesson.completed ? (
                              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                                Хийсэн
                              </span>
                            ) : null}
                          </div>
                          <div className="text-xs text-slate-400">{lesson.typeLabel}</div>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {weeks.map((week) => (
            <div key={week.id} className="rounded-xl bg-white p-4 shadow">
              <div className="mb-3 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => toggleWeek(week.id)}
                  className="flex items-center gap-3 text-left text-lg font-bold"
                >
                  <span className="text-base text-slate-500">
                    {isWeekOpen(week.id) ? "⌄" : "›"}
                  </span>
                  <span>{week.title}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLessonAction(week.id)}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  {canCreateLesson(role) ? "+ Хичээл нэмэх" : "Багш эрх хүсэх"}
                </button>
              </div>

              {isWeekOpen(week.id) ? (
                week.lessons.length > 0 ? (
                  <div className="space-y-3">
                    {week.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
                      >
                        <button
                          type="button"
                          onClick={() => openLessonDetail(lesson)}
                          className="text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-blue-600">{lesson.name}</span>
                            {lesson.completed ? (
                              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                                Хийсэн
                              </span>
                            ) : null}
                          </div>
                          <div className="text-xs text-slate-400">{lesson.typeLabel}</div>
                        </button>

                        {canCreateLesson(role) ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/team1/courses/${course_id}/lessons/${lesson.id}/edit`, {
                                  state: { courseId: course_id },
                                })
                              }
                              className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-100"
                            >
                              Засах
                            </button>
                            {canDeleteLesson(role) ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteLesson(lesson.id)}
                                className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-500 hover:bg-red-50"
                              >
                                Устгах
                              </button>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-slate-50 px-4 py-6 text-sm text-slate-400">
                    Энэ долоо хоногт хичээл алга.
                  </div>
                )
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
