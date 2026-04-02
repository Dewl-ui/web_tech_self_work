import { useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { mockLessons } from "../../data/mockLessons";
import { getRole } from "../../utils/school";

const getWeeksStorageKey = (courseId) => `team1-course-weeks-${courseId}`;

const readFileAsDataUrl = (selectedFile) =>
  new Promise((resolve, reject) => {
    if (!selectedFile) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Файл унших үед алдаа гарлаа."));
    reader.readAsDataURL(selectedFile);
  });

export default function LessonCreatePage() {
  const { course_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const role = getRole();
  const weekId = params.get("weekId");
  const searchCourseId = params.get("courseId");
  const currentCourseId =
    course_id || searchCourseId || location.state?.courseId || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("video");
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");

  if (role !== "admin" && role !== "teacher") {
    return <p>Хандах эрхгүй</p>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!currentCourseId || !weekId) {
      setError("Долоо хоног сонгогдоогүй байна.");
      setLoading(false);
      return;
    }

    try {
      const storageKey = getWeeksStorageKey(currentCourseId);
      const stored = localStorage.getItem(storageKey);
      const currentWeeks = stored ? JSON.parse(stored) : mockLessons;
      const fileData = type === "file" ? await readFileAsDataUrl(file) : "";
      const newLesson = {
        id: Date.now(),
        name,
        type,
        videoUrl,
        content,
        file: fileData,
        dueDate,
        week_id: Number(weekId),
        submitted: false,
      };

      const updatedWeeks = currentWeeks.map((week) =>
        Number(week.id) === Number(weekId)
          ? {
              ...week,
              lessons: [...week.lessons, newLesson],
            }
          : week
      );

      localStorage.setItem(storageKey, JSON.stringify(updatedWeeks));
      navigate(`/team1/courses/${currentCourseId}`);
    } catch (saveError) {
      setError(saveError.message || "Алдаа гарлаа. Дахин оролдоно уу.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() =>
            currentCourseId
              ? navigate(`/team1/courses/${currentCourseId}`)
              : navigate(-1)
          }
          className="text-sm text-indigo-500 hover:underline"
        >
          ← Буцах
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Шинэ сэдэв бүртгэх</h1>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Сэдвийн нэр
          </label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Төрөл
          </label>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400"
          >
            <option value="video">🎥 Видео</option>
            <option value="text">📝 Текст</option>
            <option value="file">📄 Файл</option>
            <option value="assignment">📌 Даалгавар</option>
          </select>
        </div>

        {type === "video" && (
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              YouTube URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </div>
        )}

        {type === "text" && (
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Агуулга
            </label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={5}
              placeholder="Агуулга бичих..."
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </div>
        )}

        {type === "file" && (
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Файл
            </label>
            <input
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </div>
        )}

        {type === "assignment" && (
          <>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Даалгаврын тайлбар
              </label>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={5}
                placeholder="Даалгаврын тайлбар"
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Дуусгах огноо
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-400"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-indigo-500 px-5 py-2 font-semibold text-white"
        >
          {loading ? "Хадгалж байна..." : "Хадгалах"}
        </button>
      </form>
    </div>
  );
}
