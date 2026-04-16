import { useMemo } from "react";
import { FiCalendar, FiClock, FiClipboard } from "react-icons/fi";
import { useAuth } from "../../utils/AuthContext";
import { getStudentCourses, getMyExams } from "./api/studentCourseApi";
import { getCourseTimetables } from "./api/studentCalendarApi";
import { useStudentData } from "./hooks";
import { fmtDateTime } from "./utils";
import PageHeader from "./components/PageHeader";

const WEEKDAYS = [
  { id: 1, label: "Да" },
  { id: 2, label: "Мя" },
  { id: 3, label: "Лх" },
  { id: 4, label: "Пү" },
  { id: 5, label: "Ба" },
  { id: 6, label: "Бя" },
  { id: 7, label: "Ня" },
];

const TYPE_COLORS = [
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-cyan-100 text-cyan-700 border-cyan-200",
];

async function loadCalendarData(userId) {
  if (!userId) return { rows: [], exams: [] };

  const [enrolled, examsRes] = await Promise.all([
    getStudentCourses(userId),
    getMyExams().catch(() => ({ items: [] })),
  ]);

  const courses = enrolled?.items ?? [];

  const timetableResults = await Promise.allSettled(
    courses.map(async (enrollment) => {
      const course = enrollment.course ?? {};
      const courseId = course.id ?? enrollment.course_id;
      if (!courseId) return [];
      const res = await getCourseTimetables(courseId);
      return (res?.items ?? []).map((slot) => ({
        ...slot,
        courseId,
        courseName: course.name ?? `Хичээл #${courseId}`,
      }));
    })
  );

  const rows = [];
  for (const r of timetableResults) {
    if (r.status === "fulfilled") rows.push(...r.value);
  }

  return { rows, exams: examsRes?.items ?? [] };
}

export default function StudentCalendar() {
  const { user } = useAuth();
  const { data, loading, error } = useStudentData(
    () => loadCalendarData(user?.id),
    [user?.id]
  );

  const rows = data?.rows ?? [];
  const exams = data?.exams ?? [];

  const typeColorByName = useMemo(() => {
    const map = {};
    const names = new Set();
    for (const r of rows) {
      if (r.lesson_type?.name) names.add(r.lesson_type.name);
    }
    Array.from(names).forEach((name, i) => {
      map[name] = TYPE_COLORS[i % TYPE_COLORS.length];
    });
    return map;
  }, [rows]);

  const rowsByWeekday = useMemo(() => {
    const out = {};
    for (const day of WEEKDAYS) out[day.id] = [];
    for (const r of rows) {
      if (out[r.weekday]) out[r.weekday].push(r);
    }
    for (const k of Object.keys(out)) {
      out[k].sort((a, b) => (a.period?.start_time || "").localeCompare(b.period?.start_time || ""));
    }
    return out;
  }, [rows]);

  const upcomingExams = useMemo(() => {
    const cutoff = Date.now() - 24 * 3600 * 1000;
    return exams
      .filter((e) => !e.open_on || new Date(e.open_on).getTime() >= cutoff)
      .sort((a, b) => new Date(a.open_on || 0) - new Date(b.open_on || 0));
  }, [exams]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* <PageHeader
        icon={FiCalendar}
        title="Хуанли"
        subtitle="Долоо хоногийн хуваарь ба шалгалтын мэдээлэл"
      /> */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && Object.keys(typeColorByName).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(typeColorByName).map(([name, cls]) => (
            <span key={name} className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
              {name}
            </span>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-zinc-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          {WEEKDAYS.map((day) => (
            <div key={day.id} className="rounded-xl border border-zinc-200 bg-white p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {day.label}
              </p>
              {rowsByWeekday[day.id].length === 0 ? (
                <p className="text-xs text-zinc-400">—</p>
              ) : (
                <div className="space-y-1.5">
                  {rowsByWeekday[day.id].map((slot) => {
                    const cls = typeColorByName[slot.lesson_type?.name] || TYPE_COLORS[0];
                    return (
                      <div key={slot.id} className={`rounded-md border px-2 py-1.5 text-xs ${cls}`}>
                        <p className="font-semibold">
                          {slot.period?.start_time?.slice(0, 5) || "—"}
                          {slot.period?.end_time ? ` – ${slot.period.end_time.slice(0, 5)}` : ""}
                        </p>
                        <p className="truncate">{slot.courseName}</p>
                        <p className="truncate opacity-75">
                          {slot.lesson_type?.name}
                          {slot.teacher?.last_name ? ` • ${slot.teacher.last_name}` : ""}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <FiClipboard className="h-4 w-4 text-zinc-500" />
          <h2 className="font-semibold text-zinc-800">Шалгалтын хуваарь</h2>
        </div>
        {loading ? (
          <div className="h-20 animate-pulse rounded-lg bg-zinc-100" />
        ) : upcomingExams.length === 0 ? (
          <p className="text-sm text-zinc-400">Шалгалт байхгүй</p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {upcomingExams.map((exam) => (
              <li key={exam.id} className="flex items-start justify-between gap-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-800">{exam.name}</p>
                  <p className="truncate text-xs text-zinc-500">
                    {exam.course?.name ?? `Хичээл #${exam.course_id}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <FiClock className="h-3 w-3" />
                  {fmtDateTime(exam.open_on)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
