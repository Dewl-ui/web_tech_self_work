import { useAuth } from "../../utils/AuthContext";
import { getStudentCourses } from "./api/studentCourseApi";
import { getCourseTimetables } from "./api/studentCalendarApi";
import { useStudentData } from "./hooks";

const WEEKDAYS = [
  { id: 1, label: "Да" },
  { id: 2, label: "Мя" },
  { id: 3, label: "Лх" },
  { id: 4, label: "Пү" },
  { id: 5, label: "Ба" },
  { id: 6, label: "Бя" },
  { id: 7, label: "Ня" },
];

const todayWeekday = (() => {
  const d = new Date().getDay();
  return d === 0 ? 7 : d;
})();

const COURSE_COLORS = [
  "bg-blue-50 border-blue-200 text-blue-800",
  "bg-emerald-50 border-emerald-200 text-emerald-800",
  "bg-violet-50 border-violet-200 text-violet-800",
  "bg-amber-50 border-amber-200 text-amber-800",
  "bg-rose-50 border-rose-200 text-rose-800",
  "bg-cyan-50 border-cyan-200 text-cyan-800",
  "bg-orange-50 border-orange-200 text-orange-800",
  "bg-pink-50 border-pink-200 text-pink-800",
];

async function loadCalendarData(userId) {
  if (!userId) return [];

  const enrolled = await getStudentCourses(userId);
  const courses = enrolled?.items ?? [];

  const results = await Promise.allSettled(
    courses.map(async (enrollment) => {
      const course = enrollment.course ?? {};
      const courseId = course.id ?? enrollment.course_id;
      if (!courseId) return [];
      const res = await getCourseTimetables(courseId);
      return (res?.items ?? []).map((slot) => ({
        ...slot,
        courseName: course.name ?? `Хичээл #${courseId}`,
      }));
    })
  );

  const rows = [];
  for (const r of results) {
    if (r.status === "fulfilled") rows.push(...r.value);
  }
  return rows;
}

export default function StudentCalendar() {
  const { user } = useAuth();
  const { data, loading, error } = useStudentData(
    () => loadCalendarData(user?.id),
    [user?.id]
  );

  const rows = Array.isArray(data) ? data : [];

  const courseColorMap = (() => {
    const map = {};
    let idx = 0;
    for (const r of rows) {
      if (r.courseName && !(r.courseName in map)) {
        map[r.courseName] = COURSE_COLORS[idx % COURSE_COLORS.length];
        idx++;
      }
    }
    return map;
  })();

  const rowsByWeekday = (() => {
    const out = {};
    for (const day of WEEKDAYS) out[day.id] = [];
    for (const r of rows) {
      if (out[r.weekday]) out[r.weekday].push(r);
    }
    for (const k of Object.keys(out)) {
      out[k].sort((a, b) => (a.period?.start_time || "").localeCompare(b.period?.start_time || ""));
    }
    return out;
  })();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          {WEEKDAYS.map((d) => (
            <div key={d.id} className="h-40 animate-pulse rounded-xl bg-zinc-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          {WEEKDAYS.map((day) => {
            const isToday = day.id === todayWeekday;
            return (
              <div
                key={day.id}
                className={`rounded-xl border p-3 ${
                  isToday
                    ? "border-zinc-300 bg-zinc-100"
                    : "border-zinc-200 bg-white"
                }`}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {day.label}
                </p>
                {rowsByWeekday[day.id].length === 0 ? (
                  <p className="text-xs text-zinc-400">—</p>
                ) : (
                  <div className="space-y-1.5">
                    {rowsByWeekday[day.id].map((slot) => {
                      const colorCls = courseColorMap[slot.courseName] ?? COURSE_COLORS[0];
                      return (
                        <div key={slot.id} className={`rounded-md border px-2 py-1.5 text-xs ${colorCls}`}>
                          <p className="font-semibold">
                            {slot.period?.start_time?.slice(0, 5) || "—"}
                            {slot.period?.end_time ? ` – ${slot.period.end_time.slice(0, 5)}` : ""}
                          </p>
                          <p className="truncate">{slot.courseName}</p>
                          {slot.lesson_type?.name && (
                            <p className="truncate opacity-60">{slot.lesson_type.name}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
