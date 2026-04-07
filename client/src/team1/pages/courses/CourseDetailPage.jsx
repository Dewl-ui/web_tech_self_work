import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTeam1Role from "../../hooks/useTeam1Role";
import { getCourse } from "../../services/courseService";
import { createRequest } from "../../services/requestService";
import { deleteLesson, getLessonsByCourse } from "../../services/lessonService";
import {
  addCourseUser,
  findUserByEmail,
  getCourseUsers,
  removeCourseUser,
} from "../../services/courseUserService";
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

  if (text) return text;
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

  return weeks;
}

function formatStudentName(student) {
  const fullName = `${student?.last_name || ""} ${student?.first_name || ""}`.trim();
  return fullName || student?.email || student?.username || "Сурагч";
}

export default function CourseDetailPage() {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const role = useTeam1Role();
  const [course, setCourse] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentEmail, setStudentEmail] = useState("");
  const [openWeeks, setOpenWeeks] = useState([1]);
  const [loading, setLoading] = useState(true);
  const [savingStudent, setSavingStudent] = useState(false);
  const [error, setError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [completionVersion, setCompletionVersion] = useState(0);

  useEffect(() => {
    const handleCompletionChange = () => setCompletionVersion((value) => value + 1);
    window.addEventListener("team1-lesson-completion-change", handleCompletionChange);
    return () =>
      window.removeEventListener("team1-lesson-completion-change", handleCompletionChange);
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

  const toggleWeek = (id) => {
    setOpenWeeks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleTeacherRequest = async () => {
    try {
      setRequestMessage("");
      await createRequest({
        type: "teacher",
        course_id: Number(course_id),
      });
      setRequestMessage("Багшийн хүсэлт илгээгдлээ.");
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

  const handleAddStudent = async () => {
    const email = String(studentEmail || "").trim();
    const emailPattern = /^[A-Za-z][0-9]{8,10}@must\.edu\.mn$/i;

    if (!emailPattern.test(email)) {
      setError("Оюутны имэйл must.edu.mn хэлбэртэй байх ёстой.");
      return;
    }

    try {
      setSavingStudent(true);
      setError("");
      const user = await findUserByEmail(email);

      if (!user?.id) {
        setError("Тухайн имэйлтэй хэрэглэгч олдсонгүй.");
        return;
      }

      await addCourseUser(course_id, user.id);
      setStudentEmail("");
      await loadData();
    } catch (studentError) {
      setError(getErrorMessage(studentError, "Сурагч нэмж чадсангүй."));
    } finally {
      setSavingStudent(false);
    }
  };

  const handleRemoveStudent = async (userId) => {
    try {
      setError("");
      await removeCourseUser(course_id, userId);
      setStudents((prev) =>
        prev.filter((student) => Number(student.user_id || student.id) !== Number(userId))
      );
    } catch (studentError) {
      setError(getErrorMessage(studentError, "Сурагч хасаж чадсангүй."));
    }
  };

  const totalLessons = useMemo(
    () => weeks.reduce((sum, week) => sum + week.lessons.length, 0),
    [weeks]
  );

  const openLessonDetail = (lesson) => {
    setCurrentLesson(lesson);
    navigate(`/team1/lessons/${lesson.id}`, {
      state: { courseId: course_id, lesson },
    });
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
                onClick={handleTeacherRequest}
                className="rounded-xl border border-indigo-200 bg-white px-5 py-2 text-sm font-semibold text-indigo-600"
              >
                Багш хүсэх
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
              <h2 className="text-xl font-bold text-slate-800">Сурагч бүртгэх</h2>
              <p className="mt-1 text-sm text-slate-500">
                Оюутны имэйл жишээ: B232270040@must.edu.mn
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <input
              type="email"
              value={studentEmail}
              onChange={(event) => setStudentEmail(event.target.value)}
              placeholder="Оюутны имэйл"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
            <button
              type="button"
              onClick={handleAddStudent}
              disabled={savingStudent}
              className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
            >
              {savingStudent ? "Нэмж байна..." : "Сурагч нэмэх"}
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {students.length === 0 ? (
              <div className="rounded-xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
                Бүртгэлтэй сурагч алга.
              </div>
            ) : (
              students.map((student, index) => (
                <div
                  key={`${student.user_id || student.id}-${index}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {formatStudentName(student)}
                    </p>
                    <p className="text-sm text-slate-400">
                      {student.email || student.username || "И-мэйлгүй"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStudent(student.user_id || student.id)}
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-500"
                  >
                    Хасах
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          {weeks.map((week) => (
            <div key={week.id} className="mb-4">
              <button
                type="button"
                onClick={() => toggleWeek(week.id)}
                className="mb-2 block w-full text-left font-semibold text-gray-700"
              >
                {week.title}
              </button>
              <div className="space-y-2">
                {week.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => openLessonDetail(lesson)}
                    className="block w-full rounded-lg p-2 text-left text-sm hover:bg-blue-100"
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
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {weeks.map((week) => (
            <div key={week.id} className="rounded-xl bg-white p-4 shadow">
              <div className="mb-3 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => toggleWeek(week.id)}
                  className="text-left text-lg font-bold"
                >
                  {week.title}
                </button>

                {canCreateLesson(role) ? (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/team1/courses/${course.id}/lessons/create`, {
                        state: { courseId: course.id, weekNumber: week.id },
                      })
                    }
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    + Хичээл нэмэх
                  </button>
                ) : null}
              </div>

              {openWeeks.includes(week.id) ? (
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
