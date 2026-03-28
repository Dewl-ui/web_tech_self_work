import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { courseAPI } from "../api";

const MOCK_COURSES = [
  { id: 1, name: "Веб систем ба технологи", teacher: "Багш нэр", progress: 75, color: "bg-pink-400", code: "WEB101" },
  { id: 2, name: "Сургалтын нэр", teacher: "Багш нэр", progress: 60, color: "bg-indigo-400", code: "CRS102" },
  { id: 3, name: "Сургалтын нэр", teacher: "Багш нэр", progress: 80, color: "bg-green-400", code: "CRS103" },
  { id: 4, name: "Сургалтын нэр", teacher: "Багш нэр", progress: 45, color: "bg-cyan-400", code: "CRS104" },
];
const COLORS = ["bg-pink-400","bg-indigo-400","bg-green-400","bg-cyan-400","bg-purple-400","bg-orange-400"];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Одоо үзэж байгаа");
  const [hiddenIds, setHiddenIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    courseAPI.getAll()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.data || data.courses || []);
        setCourses(list.map((c, i) => ({
          id: c.id,
          name: c.name,
          teacher: c.teacher?.first_name || "Багш",
          progress: c.progress || 0,
          color: COLORS[i % COLORS.length],
          code: c.code || "-",
        })));
      })
      .catch(() => { setCourses(MOCK_COURSES); setApiError(true); })
      .finally(() => setLoading(false));
  }, []);

  const handleHide = (id) => setHiddenIds((p) => [...p, id]);

  const filtered = courses
    .filter((c) => filter === "Бүх" || !hiddenIds.includes(c.id))
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-indigo-500 text-lg font-semibold animate-pulse">
      Уншиж байна...
    </div>
  );

  return (
    <div className="px-6 py-8">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Миний хичээлүүд</h1>

      {apiError && (
        <div className="mb-4 px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl text-sm">
          ⚠️ Серверт холбогдож чадсангүй. Жишээ мэдээлэл ашиглаж байна.
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 mt-4">
        <div className="flex items-center gap-4 flex-wrap">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm font-semibold text-gray-700">
            <option>Одоо үзэж байгаа</option>
            <option>Бүх</option>
          </select>
          <input type="text" placeholder="Хайх" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[360px] max-w-full px-5 py-2 rounded-full border border-gray-400 bg-white shadow-sm outline-none focus:border-indigo-400" />
        </div>
        <div className="flex items-center gap-2">
          {["grid","list"].map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`w-10 h-10 rounded-md border flex items-center justify-center transition ${view===v ? "bg-indigo-500 text-white border-indigo-500" : "bg-white text-gray-600 border-gray-300"}`}>
              {v === "grid" ? "⠿" : "☰"}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((c, i) => <CourseCard key={c.id} course={c} index={i} onHide={handleHide} />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-4 px-6 py-4 text-sm text-gray-500 font-medium border-b">
            <div>Сургалт</div><div>Хичээлийн код</div><div>Багш</div><div></div>
          </div>
          {filtered.map((c) => (
            <div key={c.id} onClick={() => navigate(`${c.id}`)}
              className="grid grid-cols-4 items-center px-6 py-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className={`w-40 h-16 rounded-2xl ${c.color}`} />
                <span className="font-medium text-gray-800">{c.name}</span>
              </div>
              <div className="text-gray-600">{c.code}</div>
              <div className="text-gray-600">{c.teacher}</div>
              <div className="text-right text-xl text-gray-400">⋮</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}