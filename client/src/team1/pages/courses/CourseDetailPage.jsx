import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockCourses } from "../../data/mockCourses";
import { mockLessons } from "../../data/mockLessons";

const getWeeksStorageKey = (courseId) => `team1-course-weeks-${courseId}`;

export default function CourseDetailPage() {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isTeacherOrAdmin = role === "admin" || role === "teacher";
  const courseId = Number(course_id);
  const [openWeeks, setOpenWeeks] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [completedLessons, setCompletedLessons] = useState({});

  const course = useMemo(() => {
    return mockCourses.find((item) => Number(item.id) === courseId) || null;
  }, [courseId]);

  useEffect(() => {
    const storageKey = getWeeksStorageKey(courseId);
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        setWeeks(JSON.parse(stored));
      } catch {
        localStorage.setItem(storageKey, JSON.stringify(mockLessons));
        setWeeks(mockLessons);
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify(mockLessons));
      setWeeks(mockLessons);
    }
  }, [courseId]);

  useEffect(() => {
    if (weeks.length > 0 && openWeeks.length === 0) {
      setOpenWeeks([weeks[0].id]);
    }
  }, [weeks, openWeeks.length]);

  const persistWeeks = (updatedWeeks) => {
    setWeeks(updatedWeeks);
    localStorage.setItem(
      getWeeksStorageKey(courseId),
      JSON.stringify(updatedWeeks)
    );
  };

  const toggleWeek = (id) => {
    setOpenWeeks((prev) =>
      prev.includes(id) ? prev.filter((weekId) => weekId !== id) : [...prev, id]
    );
  };

  const handleComplete = (lessonId) => {
    setCompletedLessons((current) => ({
      ...current,
      [lessonId]: !current[lessonId],
    }));
  };

  const handleDelete = (id) => {
    const updatedWeeks = weeks.map((week) => ({
      ...week,
      lessons: week.lessons.filter((lesson) => lesson.id !== id),
    }));
    persistWeeks(updatedWeeks);
  };

  const handleEdit = (id) => {
    navigate(`/team1/lessons/edit/${id}`, {
      state: { courseId: course_id },
    });
  };

  const handleAddLesson = (weekId) => {
    navigate(`/team1/lessons/create?weekId=${weekId}&courseId=${course_id}`);
  };

  if (!course) {
    return (
      <div className="flex h-64 items-center justify-center font-semibold text-indigo-500">
        Хичээл олдсонгүй...
      </div>
    );
  }

  return (
    <div className="space-y-6 px-8 py-6">
      <div className="rounded-2xl border border-gray-100 bg-white px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/team1/courses")}
              className="mb-1 block text-xs text-gray-400 hover:text-indigo-500"
            >
              ← Буцах
            </button>
            <h1 className="text-xl font-bold text-gray-800">{course.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/team1/courses/${course.id}/lessons`)}
              className="rounded-xl border border-indigo-200 bg-white px-5 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
            >
              Хичээлүүд харах
            </button>
          </div>
        </div>
        <div className="mt-2 flex gap-5 text-xs text-gray-500">
          <span>👤 {course.teacher || "Багш"}</span>
          <span>📚 {weeks.length} долоо хоног</span>
          <span>⭐ {course.code || "CS000"}</span>
          <span>📈 {course.progress || 0}%</span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-1/4 rounded-xl bg-white p-4 shadow">
          {weeks.map((week) => (
            <div key={week.id} className="mb-4">
              <button
                type="button"
                onClick={() => toggleWeek(week.id)}
                className="mb-2 block w-full text-left font-semibold text-gray-700"
              >
                {week.title}
              </button>

              {week.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => navigate(`/team1/lessons/${lesson.id}`)}
                  className="cursor-pointer rounded-lg p-2 text-sm hover:bg-blue-100"
                >
                  {lesson.name}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="w-3/4 space-y-6">
          {weeks.map((week) => (
            <div key={week.id} className="rounded-xl bg-white p-4 shadow">
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleWeek(week.id)}
                  className="text-left text-lg font-bold"
                >
                  {week.title}
                </button>

                {isTeacherOrAdmin && (
                  <button
                    type="button"
                    onClick={() => handleAddLesson(week.id)}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    + Хичээл нэмэх
                  </button>
                )}
              </div>

              {openWeeks.includes(week.id) && (
                <div>
                  {week.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between border-b py-3 last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => navigate(`/team1/lessons/${lesson.id}`)}
                        className="text-left text-blue-600"
                      >
                        🔗 {lesson.name}
                      </button>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => handleComplete(lesson.id)}
                          className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-100"
                        >
                          {completedLessons[lesson.id]
                            ? "Дууссан"
                            : "Дууссан гэж тэмдэглэх"}
                        </button>

                        {isTeacherOrAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleEdit(lesson.id)}
                              className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-100"
                            >
                              Засах
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(lesson.id)}
                              className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-100"
                            >
                              Устгах
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
