import { useMemo, useState } from "react";
import CourseCard from "../components/CourseCard";
import { mockCourses } from "../data/mockCourses";

export default function CoursesPage() {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Одоо үзэж байгаа");

  const filteredCourses = useMemo(() => {
    return mockCourses.filter((course) =>
      course.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="px-6 py-8">
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Миний хичээлүүд</h1>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4 flex-wrap">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm font-semibold text-gray-700"
          >
            <option>Одоо үзэж байгаа</option>
            <option>Бүх</option>
          </select>

          <input
            type="text"
            placeholder="Хайх"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[360px] max-w-full px-5 py-2 rounded-full border border-gray-400 bg-white shadow-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("grid")}
            className={`w-10 h-10 rounded-md border flex items-center justify-center ${
              view === "grid"
                ? "bg-indigo-500 text-white border-indigo-500"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            ⠿
          </button>

          <button
            onClick={() => setView("list")}
            className={`w-10 h-10 rounded-md border flex items-center justify-center ${
              view === "list"
                ? "bg-indigo-500 text-white border-indigo-500"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            ☰
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-4 px-6 py-4 text-sm text-gray-500 font-medium border-b">
            <div>Сургалт</div>
            <div>Хичээлийн код</div>
            <div>Багш</div>
            <div></div>
          </div>

          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="grid grid-cols-4 items-center px-6 py-4 border-b last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <div className={`w-40 h-16 rounded-2xl ${course.color}`}></div>
                <span className="font-medium text-gray-800">{course.name}</span>
              </div>
              <div className="text-gray-600">{course.code}</div>
              <div className="text-gray-600">{course.teacher}</div>
              <div className="text-right text-xl">⋮</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}