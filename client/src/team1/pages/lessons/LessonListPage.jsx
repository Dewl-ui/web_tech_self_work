import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseAPI } from "../../api";
import { getLessonsByCourse } from "../../services/lessonService";
import { getRole } from "../../utils/school";

const TYPE_COLORS = ["bg-blue-400", "bg-green-400", "bg-purple-400", "bg-orange-400", "bg-red-400", "bg-cyan-400"];

export default function LessonListPage() {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const role = getRole();
  const isTeacher = role === "admin" || role === "teacher";

  const [courseName, setCourseName] = useState("Хичээл");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    if (!course_id) {
      return;
    }

    courseAPI
      .getOne(course_id)
      .then((data) => setCourseName(data?.name || "Хичээл"))
      .catch(console.error);

    getLessonsByCourse(course_id)
      .then((res) => {
        console.log("LESSONS:", res);

        const data = res?.data?.items || res?.data?.data || res?.data || [];
        const grouped = {};

        data.forEach((lesson, index) => {
          const typeName =
            lesson.type?.name ||
            lesson.lesson_type?.name ||
            `Төрөл ${lesson.type_id || 1}`;

          if (!grouped[typeName]) {
            grouped[typeName] = [];
          }

          grouped[typeName].push({
            id: lesson.id,
            name: lesson.name,
            color: TYPE_COLORS[index % TYPE_COLORS.length],
          });
        });

        setGroups(
          Object.entries(grouped).map(([type, lessons]) => ({
            type,
            lessons,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
        setApiError(true);
        setGroups([]);
      })
      .finally(() => setLoading(false));
  }, [course_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-indigo-500 font-semibold animate-pulse">
        Уншиж байна...
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate(`/team1/courses/${course_id}`)}
            className="text-indigo-500 text-sm hover:underline mb-1 block"
          >
            ← Буцах
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{courseName}</h1>
        </div>
        {isTeacher && (
          <button
            onClick={() => navigate(`/team1/courses/${course_id}/lessons/create`)}
            className="px-5 py-2 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition"
          >
            Бүртгэх
          </button>
        )}
      </div>

      {apiError && (
        <div className="mb-4 px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl text-sm">
          Сервертэй холбогдож чадсангүй.
        </div>
      )}

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.type}>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">{group.type}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => navigate(`/team1/lessons/${lesson.id}`)}
                  className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition"
                >
                  <div className={`w-10 h-10 rounded-lg ${lesson.color} flex items-center justify-center text-white flex-shrink-0`}>
                    📄
                  </div>
                  <span className="font-medium text-gray-700 text-sm flex-1">{lesson.name}</span>
                  {isTeacher && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/team1/courses/${course_id}/lessons/${lesson.id}/edit`);
                      }}
                      className="text-gray-400 hover:text-indigo-500 text-lg"
                      title="Засах"
                    >
                      ✎
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
