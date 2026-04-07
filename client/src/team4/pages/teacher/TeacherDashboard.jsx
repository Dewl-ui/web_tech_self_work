import { useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import { apiGet, parseField } from "../../utils/api";

const DAY_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAY_MN    = ["Ням", "Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям"];
const MONTH_MN  = ["1-р сар","2-р сар","3-р сар","4-р сар","5-р сар","6-р сар",
                   "7-р сар","8-р сар","9-р сар","10-р сар","11-р сар","12-р сар"];
const HOURS     = Array.from({ length: 8 }, (_, i) => i + 1);

const SEMESTER_START = new Date("2026-01-26");
const MAX_WEEKS = 18;

function getCurrentSemesterWeek() {
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.max(1, Math.min(MAX_WEEKS, Math.floor((now - SEMESTER_START) / msPerWeek) + 1));
}

function getWeekDates(semWeek) {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const firstSunday = new Date(SEMESTER_START);
  firstSunday.setDate(SEMESTER_START.getDate() - 1);
  const sunday = new Date(firstSunday.getTime() + (semWeek - 1) * msPerWeek);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

function getMonthDays(year, month) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

const EVENT_COLORS = [
  { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"   },
  { bg: "bg-teal-100",   text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-500"   },
  { bg: "bg-amber-100",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
];

// ── Shared Hour Grid (day or week) ────────────────────────────────────────────
function HourGrid({ dates, timetable, today }) {
  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: dates.length === 1 ? 320 : 680 }}>
        {/* Day headers */}
        <div
          className="grid border-b border-zinc-100"
          style={{ gridTemplateColumns: `44px repeat(${dates.length}, 1fr) 44px` }}
        >
          <div />
          {dates.map((date, i) => {
            const isToday = date.toDateString() === today.toDateString();
            const isWknd  = date.getDay() === 0 || date.getDay() === 6;
            return (
              <div key={i} className={`py-3 text-center ${isWknd ? "bg-zinc-50/70" : ""}`}>
                <p className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
                  {DAY_SHORT[date.getDay()]}
                </p>
                <p className={`text-xl font-bold leading-none mt-1 ${
                  isToday ? "text-blue-600" : isWknd ? "text-zinc-400" : "text-zinc-800"
                }`}>{date.getDate()}</p>
              </div>
            );
          })}
          <div className="py-3 text-center">
            <p className="text-[8px] font-bold tracking-wider text-zinc-300 uppercase">ХИЧЭЭЛ</p>
            <p className="text-[8px] text-zinc-300">ийн цаг</p>
          </div>
        </div>

        {/* Hour rows */}
        {HOURS.map(hour => (
          <div
            key={hour}
            className="grid border-b border-zinc-50 min-h-[54px]"
            style={{ gridTemplateColumns: `44px repeat(${dates.length}, 1fr) 44px` }}
          >
            <div className="flex items-start pt-2 justify-center">
              <span className="text-[10px] text-zinc-300 font-medium">{hour}</span>
            </div>
            {dates.map((date, di) => {
              const isToday = date.toDateString() === today.toDateString();
              const isWknd  = date.getDay() === 0 || date.getDay() === 6;
              const evs = timetable.filter(e => e.day === date.getDay() && e.hour === hour);
              return (
                <div
                  key={di}
                  className={`border-l border-zinc-50 px-0.5 py-0.5 ${isWknd ? "bg-zinc-50/50" : ""} ${isToday ? "bg-blue-50/30" : ""}`}
                >
                  {evs.map((ev, ei) => {
                    const col = EVENT_COLORS[ev.colorIdx];
                    const h12 = ev.hour > 12 ? ev.hour - 12 : ev.hour;
                    const ampm = ev.hour >= 12 ? "PM" : "AM";
                    const timeStr = `${String(h12).padStart(2,"0")}:${String(ev.minute ?? 0).padStart(2,"0")} ${ampm}`;
                    return (
                      <div key={ei} className={`rounded-md border px-1.5 py-1 mb-0.5 cursor-pointer hover:brightness-95 transition-all ${col.bg} ${col.border}`}>
                        <p className={`text-[9px] font-semibold flex items-center gap-1 ${col.text}`}>
                          <span className={`inline-block h-1.5 w-1.5 rounded-full ${col.dot}`} />
                          {timeStr}
                        </p>
                        <p className={`text-[10px] font-medium truncate ${col.text}`}>
                          {ev.name} – {ev.type}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <div className="border-l border-zinc-50 flex items-center justify-center">
              <span className="text-[9px] text-zinc-200">{hour}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Month view ────────────────────────────────────────────────────────────────
function MonthGrid({ year, month, timetable, today }) {
  const days = getMonthDays(year, month);
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[500px]">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-zinc-100">
          {DAY_SHORT.map(d => (
            <div key={d} className="py-2 text-center text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
              {d}
            </div>
          ))}
        </div>
        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-zinc-50">
            {week.map((date, di) => {
              if (!date) return <div key={di} className="min-h-[72px] border-l border-zinc-50 bg-zinc-50/30" />;
              const isToday = date.toDateString() === today.toDateString();
              const isWknd  = date.getDay() === 0 || date.getDay() === 6;
              const evs = timetable.filter(e => e.day === date.getDay());
              return (
                <div
                  key={di}
                  className={`min-h-[72px] border-l border-zinc-50 p-1 ${isWknd ? "bg-zinc-50/50" : ""} ${isToday ? "bg-blue-50/40" : ""}`}
                >
                  <p className={`text-xs font-bold mb-1 ${isToday ? "text-blue-600" : isWknd ? "text-zinc-400" : "text-zinc-700"}`}>
                    {date.getDate()}
                  </p>
                  {evs.slice(0, 2).map((ev, ei) => {
                    const col = EVENT_COLORS[ev.colorIdx];
                    return (
                      <div key={ei} className={`rounded text-[9px] px-1 py-0.5 mb-0.5 truncate font-medium ${col.bg} ${col.text}`}>
                        {ev.name}
                      </div>
                    );
                  })}
                  {evs.length > 2 && (
                    <p className="text-[9px] text-zinc-400">+{evs.length - 2}</p>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TeacherDashboard() {
  const { user, school } = useAuth();
  const [semWeek, setSemWeek]   = useState(getCurrentSemesterWeek);
  const [timetable, setTimetable] = useState([]);
  const [view, setView]         = useState("өдөр");   // өдөр | 7 хоног | сар
  const [loading, setLoading]   = useState(true);

  const today    = new Date();
  const weekDates = getWeekDates(semWeek);

  // For month navigation
  const [monthOffset, setMonthOffset] = useState(0);
  const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthYear  = monthDate.getFullYear();
  const monthMonth = monthDate.getMonth();

  // canGo* depends on view
  const canGoPrev = view === "сар"
    ? true
    : semWeek > 1;
  const canGoNext = view === "сар"
    ? true
    : semWeek < MAX_WEEKS;

  function handlePrev() {
    if (view === "сар") setMonthOffset(o => o - 1);
    else if (canGoPrev) setSemWeek(w => w - 1);
  }
  function handleNext() {
    if (view === "сар") setMonthOffset(o => o + 1);
    else if (canGoNext) setSemWeek(w => w + 1);
  }

  // Label for toolbar
  const toolbarLabel = (() => {
    if (view === "сар") {
      return `${monthYear} — ${MONTH_MN[monthMonth]}`;
    }
    const opts = { month: "short", day: "numeric" };
    if (view === "өдөр") {
      return today.toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" });
    }
    const start = weekDates[0];
    const end   = weekDates[6];
    return `${semWeek}-р долоо хоног · ${start.toLocaleDateString("en", opts)} – ${end.toLocaleDateString("en", opts)}`;
  })();

  // Load timetable from API
  useEffect(() => {
    if (!user?.id) return;
    apiGet(`/users/${user.id}/courses/teaching`).then(async (data) => {
      const schoolId = school?.id;
      const items = (data?.items ?? []).filter((item) => {
        if (schoolId == null) return true;
        const course = parseField(item, "course") ?? item;
        return String(course?.school_id ?? item?.school_id ?? "") === String(schoolId);
      });
      const allEvents = [];
      for (const item of items) {
        const c   = parseField(item, "course") ?? item;
        const cId = c.id ?? item.course_id;
        const name = c.name ?? `Хичээл #${cId}`;
        try {
          const ttData = await apiGet(`/courses/${cId}/timetables`);
          (ttData?.items ?? []).forEach((tt, idx) => {
            allEvents.push({
              name,
              day:      tt.weekday ?? (idx % 7),
              hour:     tt.period_id ?? (idx % 6 + 2),
              minute:   0,
              type:     (() => {
                try { return JSON.parse(tt["{}lesson_type"])?.name ?? "Лекц"; } catch { return "Лекц"; }
              })(),
              colorIdx: idx % 4,
            });
          });
        } catch {}
      }
      setTimetable(allEvents);
    }).finally(() => setLoading(false));
  }, [user?.id, school?.id]);

  // Which dates to show in day/week view
  const displayDates = view === "өдөр"
    ? [today]
    : weekDates;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <h1 className="text-xl font-semibold text-zinc-800">Хичээлийн хуваарь</h1>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100">
          {/* Nav arrows + label */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev && view !== "сар"}
              className={`h-7 w-7 rounded-full flex items-center justify-center text-lg transition-colors
                ${(canGoPrev || view === "сар") ? "hover:bg-zinc-100 text-zinc-500" : "text-zinc-200 cursor-not-allowed"}`}
            >‹</button>
            <div className="text-center min-w-[220px]">
              <p className="text-sm font-semibold text-zinc-700">{toolbarLabel}</p>
            </div>
            <button
              onClick={handleNext}
              disabled={!canGoNext && view !== "сар"}
              className={`h-7 w-7 rounded-full flex items-center justify-center text-lg transition-colors
                ${(canGoNext || view === "сар") ? "hover:bg-zinc-100 text-zinc-500" : "text-zinc-200 cursor-not-allowed"}`}
            >›</button>
          </div>

          {/* View switcher — жил хасагдлаа */}
          <div className="flex items-center gap-0.5 bg-zinc-100 rounded-full p-1">
            {["өдөр", "7 хоног", "сар"].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  view === v ? "bg-blue-600 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >{v}</button>
            ))}
          </div>
        </div>

        {/* Content */}
        {view === "сар" ? (
          <MonthGrid
            year={monthYear}
            month={monthMonth}
            timetable={timetable}
            today={today}
          />
        ) : (
          <HourGrid
            dates={displayDates}
            timetable={timetable}
            today={today}
          />
        )}
      </div>
    </div>
  );
}
