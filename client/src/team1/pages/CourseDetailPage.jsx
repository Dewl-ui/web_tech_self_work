import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseAPI, lessonAPI } from "../api";

const CURRENT_USER = { id: 4, name: "Багш С", role_id: 2 };

const MOCK_COURSE = {
  id: 1, name: "Веб систем ба технологи",
  teacher: "Т.Зөвбөр", total_weeks: 16, total_credit: 3, students: 87,
};

// Бүлэг тус бүрийн icon болон өнгө
const GROUP_STYLES = {
  "Лекц":       { icon: "📘", cards: [{ bg: "bg-blue-100",   icon: "bg-blue-500",   text: "text-blue-700"   },
                                       { bg: "bg-green-100",  icon: "bg-green-500",  text: "text-green-700"  },
                                       { bg: "bg-purple-100", icon: "bg-purple-500", text: "text-purple-700" }] },
  "Семинар":    { icon: "📗", cards: [{ bg: "bg-blue-100",   icon: "bg-blue-500",   text: "text-blue-700"   },
                                       { bg: "bg-green-100",  icon: "bg-green-500",  text: "text-green-700"  },
                                       { bg: "bg-purple-100", icon: "bg-purple-500", text: "text-purple-700" }] },
  "Лаборатори": { icon: "🧪", cards: [{ bg: "bg-orange-100", icon: "bg-orange-500", text: "text-orange-700" },
                                       { bg: "bg-red-100",    icon: "bg-red-500",    text: "text-red-700"    },
                                       { bg: "bg-blue-100",   icon: "bg-blue-500",   text: "text-blue-700"   }] },
  "Бие даалт":  { icon: "📝", cards: [{ bg: "bg-orange-100", icon: "bg-orange-500", text: "text-orange-700" },
                                       { bg: "bg-red-100",    icon: "bg-red-500",    text: "text-red-700"    },
                                       { bg: "bg-blue-100",   icon: "bg-blue-500",   text: "text-blue-700"   }] },
};

const GROUP_ORDER = ["Лекц", "Семинар", "Лаборатори", "Бие даалт"];

function generateMockWeeks() {
  return Array.from({ length: 16 }, (_, i) => ({
    week: i + 1,
    title: `${i + 1}-р долоо хоног`,
    groups: GROUP_ORDER.map((type) => ({
      type,
      lessons: [
        { id: (i * 40) + GROUP_ORDER.indexOf(type) * 3 + 1, name: "Хичээл 1" },
        { id: (i * 40) + GROUP_ORDER.indexOf(type) * 3 + 2, name: "Хичээл 2" },
        { id: (i * 40) + GROUP_ORDER.indexOf(type) * 3 + 3, name: "Хичээл 3" },
      ],
    })),
  }));
}

export default function CourseDetailPage() {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const isTeacher = CURRENT_USER.role_id === 1 || CURRENT_USER.role_id === 2;

  const [course, setCourse] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [activeWeek, setActiveWeek] = useState(1);
  const [loading, setLoading] = useState(true);
  const weekRefs = useRef({});

  useEffect(() => {
    courseAPI.getOne(course_id)
      .then((data) => setCourse(data))
      .catch(() => setCourse(MOCK_COURSE));

    lessonAPI.getAll(course_id)
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.data || data.lessons || []);
        if (list.length === 0) { setWeeks(generateMockWeeks()); return; }

        const weekMap = {};
        list.forEach((l) => {
          const w = l.week || l.week_no || 1;
          if (!weekMap[w]) weekMap[w] = {};
          const typeName = l.type?.name || "Лекц";
          if (!weekMap[w][typeName]) weekMap[w][typeName] = [];
          weekMap[w][typeName].push({ id: l.id, name: l.name });
        });

        const result = Object.entries(weekMap).map(([week, groups]) => ({
          week: Number(week),
          title: `${week}-р долоо хоног`,
          groups: GROUP_ORDER
            .filter((t) => groups[t])
            .map((type) => ({ type, lessons: groups[type] })),
        }));
        setWeeks(result.sort((a, b) => a.week - b.week));
      })
      .catch(() => setWeeks(generateMockWeeks()))
      .finally(() => setLoading(false));
  }, [course_id]);

  // Sidebar дарахад scroll
  const handleWeekClick = (week) => {
    setActiveWeek(week);
    const el = weekRefs.current[week];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Scroll хийхэд active week track
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + 160;
      let current = 1;
      Object.entries(weekRefs.current).forEach(([w, el]) => {
        if (el && el.offsetTop <= scrollY) current = Number(w);
      });
      setActiveWeek(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading || !course) return (
    <div className="flex items-center justify-center h-64 text-indigo-500 font-semibold animate-pulse">
      Уншиж байна...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ===== LEFT SIDEBAR ===== */}
      <aside className="w-52 flex-shrink-0 bg-white border-r border-gray-100 sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 border-b border-gray-100">
          <p className="font-semibold text-gray-800 text-sm">Хичээлийн хөтөлбөр</p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            🕐 {weeks.length} долоо хоног
          </p>
        </div>
        <nav className="py-2">
          {weeks.map((w) => (
            <button key={w.week} onClick={() => handleWeekClick(w.week)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition border-l-4 ${
                activeWeek === w.week
                  ? "bg-indigo-50 border-indigo-500 text-indigo-600 font-semibold"
                  : "border-transparent text-gray-600 hover:bg-gray-50"
              }`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                activeWeek === w.week ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500"
              }`}>{w.week}</span>
              <span>долоо хоног</span>
              <span className="ml-auto text-xs text-gray-300">
                {activeWeek === w.week ? "∧" : "∨"}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1">
        {/* Sticky header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button onClick={() => navigate("/team1/courses")}
                className="text-xs text-gray-400 hover:text-indigo-500 mb-1 block">← Буцах</button>
              <h1 className="text-xl font-bold text-gray-800">{course.name}</h1>
            </div>
            {isTeacher && (
              <button onClick={() => navigate(`/team1/courses/${course_id}/lessons/create`)}
                className="px-5 py-2 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition text-sm">
                Бүртгэх
              </button>
            )}
          </div>
          <div className="flex gap-5 mt-2 text-xs text-gray-500">
            <span>👤 {course.teacher || "Багш"}</span>
            <span>📅 {course.total_weeks || 16} Долоо хоног</span>
            <span>⭐ {course.total_credit || 3}</span>
            <span>👥 {course.students || 0} Оюутан</span>
          </div>
        </div>

        {/* Week sections */}
        <div className="px-8 py-6 space-y-10">
          {weeks.map((w) => (
            <div key={w.week} ref={(el) => (weekRefs.current[w.week] = el)}>
              {/* Week title */}
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {w.week}
                </span>
                {w.title}
              </h2>

              {/* Groups */}
              <div className="space-y-6">
                {w.groups.map((group) => {
                  const style = GROUP_STYLES[group.type] || GROUP_STYLES["Лекц"];
                  return (
                    <div key={group.type} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <h3 className="text-sm font-semibold text-gray-700 mb-4">{group.type}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {group.lessons.map((lesson, li) => {
                          const cs = style.cards[li % style.cards.length];
                          return (
                            <div key={lesson.id}
                              onClick={() => navigate(`/team1/courses/${course_id}/lessons/${lesson.id}`)}
                              className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer hover:opacity-80 transition ${cs.bg}`}>
                              <div className={`w-8 h-8 rounded-lg ${cs.icon} flex items-center justify-center text-white text-sm flex-shrink-0`}>
                                📄
                              </div>
                              <span className={`text-sm font-medium ${cs.text}`}>{lesson.name}</span>
                              {isTeacher && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); navigate(`/team1/courses/${course_id}/lessons/${lesson.id}/edit`); }}
                                  className="ml-auto text-gray-400 hover:text-indigo-500 text-xs">✎</button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {w.week < weeks.length && <hr className="mt-8 border-gray-100" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}