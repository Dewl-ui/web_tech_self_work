import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTeam1Role from "../../hooks/useTeam1Role";
import { getCourse } from "../../services/courseService";
import { getLessonsByCourse } from "../../services/lessonService";
import { canCreateLesson, getErrorMessage } from "../../utils/school";

const TYPE_COLORS = ["bg-blue-400", "bg-green-400", "bg-purple-400", "bg-orange-400", "bg-red-400", "bg-cyan-400"];

export default function LessonListPage() {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const role = useTeam1Role();
  const [courseName, setCourseName] = useState("Хичээл");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!course_id) {
      return;
    }

    Promise.all([getCourse(course_id), getLessonsByCourse(course_id)])
      .then(([course, lessons]) => {
        setCourseName(course?.name || "Хичээл");

        const grouped = {};
        (lessons || []).forEach((lesson, index) => {
          const typeName =
            lesson.type?.name ||
            lesson.lesson_type?.name ||
            lesson.type ||
            "Хичээл";

          if (!grouped[typeName]) {
            grouped[typeName] = [];
          }

          grouped[typeName].push({
            id: lesson.id,
            name: lesson.name || lesson.title,
            color: TYPE_COLORS[index % TYPE_COLORS.length],
          });
        });

        setGroups(
          Object.entries(grouped).map(([type, items]) => ({
            type,
            lessons: items,
          }))
        );
      })
      .catch((loadError) => {
        setError(getErrorMessage(loadError, "Хичээлүүдийг ачаалж чадсангүй."));
      })
      .finally(() => setLoading(false));
  }, [course_id]);

  if (loading) {
    return <div className="flex h-64 items-center justify-center font-semibold text-indigo-500">Уншиж байна...</div>;
  }

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(`/team1/courses/${course_id}`)}
            className="mb-1 block text-sm text-indigo-500 hover:underline"
          >
            ← Буцах
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{courseName}</h1>
        </div>
        {canCreateLesson(role) ? (
          <button
            onClick={() => navigate(`/team1/courses/${course_id}/lessons/create`)}
            className="rounded-xl bg-indigo-500 px-5 py-2 font-semibold text-white transition hover:bg-indigo-600"
          >
            Бүртгэх
          </button>
        ) : null}
      </div>

      {error ? <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</div> : null}

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.type}>
            <h2 className="mb-3 text-lg font-semibold text-gray-700">{group.type}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() =>
                    navigate(`/team1/lessons/${lesson.id}`, {
                      state: { courseId: course_id },
                    })
                  }
                  className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${lesson.color} text-white`}>
                    📄
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-700">{lesson.name}</span>
                  {canCreateLesson(role) ? (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/team1/courses/${course_id}/lessons/${lesson.id}/edit`);
                      }}
                      className="text-lg text-gray-400 hover:text-indigo-500"
                      title="Засах"
                    >
                      ✎
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
