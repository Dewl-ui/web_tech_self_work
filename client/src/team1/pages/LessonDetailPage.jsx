import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lessonAPI } from "../api";

const CURRENT_USER = { id: 4, name: "Багш С", role_id: 2 };

export default function LessonDetailPage() {
  const { course_id, lesson_id } = useParams();
  const navigate = useNavigate();
  const isTeacher = CURRENT_USER.role_id === 1 || CURRENT_USER.role_id === 2;

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    lessonAPI.getOne(course_id, lesson_id)
      .then((data) => setLesson(data))
      .catch(() => {
        setApiError(true);
        setLesson({
          id: lesson_id,
          name: "Хичээлийн сэдэв",
          content: "<p>Хичээлийн агуулга энд байна.</p>",
          video_url: "",
          point: 10,
          is_attendable: true,
          type: { name: "Лекц" },
        });
      })
      .finally(() => setLoading(false));
  }, [course_id, lesson_id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-indigo-500 font-semibold animate-pulse">
      Уншиж байна...
    </div>
  );

  if (!lesson) return <div className="p-8 text-gray-500">Сэдэв олдсонгүй.</div>;

  // YouTube embed URL болгоно
  const embedUrl = lesson.video_url
    ? lesson.video_url.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")
    : null;

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <button onClick={() => navigate(`/team1/courses/${course_id}/lessons`)}
            className="text-indigo-500 text-sm hover:underline mb-1 block">← Буцах</button>
          <h1 className="text-2xl font-bold text-gray-800">{lesson.name}</h1>
          {lesson.type && (
            <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">
              {lesson.type.name}
            </span>
          )}
        </div>
        {isTeacher && (
          <button onClick={() => navigate(`/team1/courses/${course_id}/lessons/${lesson_id}/edit`)}
            className="px-5 py-2 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition whitespace-nowrap">
            Засах
          </button>
        )}
      </div>

      {apiError && (
        <div className="mb-4 px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl text-sm">
          ⚠️ Серверт холбогдож чадсангүй. Жишээ мэдээлэл ашиглаж байна.
        </div>
      )}

      <div className="space-y-4">
        {/* Мэдээлэл */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-3">📋 Мэдээлэл</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Оноо</span>
              <span className="font-medium">{lesson.point || 0}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Ирц</span>
              <span className="font-medium">{lesson.is_attendable ? "Тийм" : "Үгүй"}</span>
            </div>
          </div>
        </div>

        {/* Агуулга */}
        {lesson.content && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-700 mb-3">📖 Агуулга</h3>
            <div className="text-gray-600 text-sm leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>
        )}

        {/* Видео */}
        {embedUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-700 mb-3">🎬 Видео</h3>
            <iframe src={embedUrl} className="w-full rounded-xl" height="320"
              allowFullScreen title="Lesson video" />
          </div>
        )}
      </div>
    </div>
  );
}