import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lessonAPI, courseAPI } from "../api";

const CURRENT_USER = { id: 4, name: "Багш С", role_id: 2 };

const MOCK_GROUPS = [
  { type: "Лекц", lessons: [{ id: 1, name: "Хичээл 1", color: "bg-blue-400" },{ id: 2, name: "Хичээл 2", color: "bg-green-400" }] },
  { type: "Семинар", lessons: [{ id: 3, name: "Хичээл 1", color: "bg-purple-400" },{ id: 4, name: "Хичээл 2", color: "bg-blue-400" }] },
  { type: "Лаборатори", lessons: [{ id: 5, name: "Хичээл 1", color: "bg-orange-400" }] },
  { type: "Бие даалт", lessons: [{ id: 6, name: "Хичээл 1", color: "bg-red-400" }] },
];
const TYPE_COLORS = ["bg-blue-400","bg-green-400","bg-purple-400","bg-orange-400","bg-red-400","bg-cyan-400"];

export default function LessonListPage() {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const isTeacher = CURRENT_USER.role_id === 1 || CURRENT_USER.role_id === 2;

  const [courseName, setCourseName] = useState("Хичээл");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    // Course нэр авах
    courseAPI.getOne(course_id)
      .then((data) => setCourseName(data.name || "Хичээл"))
      .catch(() => {});

    // Lessons авах
    lessonAPI.getAll(course_id)
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.data || data.lessons || []);
        // type_id эсвэл type-р бүлэглэнэ
        const grouped = {};
        list.forEach((l, i) => {
          const typeName = l.type?.name || l.lesson_type?.name || `Төрөл ${l.type_id || 1}`;
          if (!grouped[typeName]) grouped[typeName] = [];
          grouped[typeName].push({
            id: l.id,
            name: l.name,
            color: TYPE_COLORS[i % TYPE_COLORS.length],
          });
        });
        setGroups(Object.entries(grouped).map(([type, lessons]) => ({ type, lessons })));
      })
      .catch(() => { setGroups(MOCK_GROUPS); setApiError(true); })
      .finally(() => setLoading(false));
  }, [course_id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-indigo-500 font-semibold animate-pulse">
      Уншиж байна...
    </div>
  );

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => navigate(`/team1/courses`)}
            className="text-indigo-500 text-sm hover:underline mb-1 block">← Буцах</button>
          <h1 className="text-2xl font-bold text-gray-800">{courseName}</h1>
        </div>
        {isTeacher && (
          <button onClick={() => navigate(`/team1/courses/${course_id}/lessons/create`)}
            className="px-5 py-2 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition">
            Бүртгэх
          </button>
        )}
      </div>

      {apiError && (
        <div className="mb-4 px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl text-sm">
          ⚠️ Серверт холбогдож чадсангүй. Жишээ мэдээлэл ашиглаж байна.
        </div>
      )}

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.type}>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">{group.type}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.lessons.map((lesson) => (
                <div key={lesson.id}
                  onClick={() => navigate(`/team1/courses/${course_id}/lessons/${lesson.id}`)}
                  className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition">
                  <div className={`w-10 h-10 rounded-lg ${lesson.color} flex items-center justify-center text-white flex-shrink-0`}>
                    📄
                  </div>
                  <span className="font-medium text-gray-700 text-sm flex-1">{lesson.name}</span>
                  {isTeacher && (
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/team1/courses/${course_id}/lessons/${lesson.id}/edit`); }}
                      className="text-gray-400 hover:text-indigo-500 text-lg" title="Засах">✎</button>
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