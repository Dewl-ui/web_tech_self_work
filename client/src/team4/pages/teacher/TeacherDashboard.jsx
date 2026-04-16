import { useEffect, useState } from "react";
import { FiCalendar, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { EmptyState, Skeleton } from "../../components/ui";
import { useAuth } from "../../utils/AuthContext";
import { apiGet, parseField } from "../../utils/api";
import useTeacherCoursesSummary from "./useTeacherCoursesSummary";

const DAY_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_MN  = ["1-р сар","2-р сар","3-р сар","4-р сар","5-р сар","6-р сар",
                   "7-р сар","8-р сар","9-р сар","10-р сар","11-р сар","12-р сар"];

const SEMESTER_START = new Date("2026-01-26");
const MAX_WEEKS = 18;
const BREAK_AFTER_WEEK = 3;
const BREAK_WEEKS = 1;
const CALENDAR_MIN_WIDTH = 680;

function getCurrentSemesterWeek() {
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const rawWeek = Math.floor((now - SEMESTER_START) / msPerWeek) + 1;
  const adjustedWeek = rawWeek > BREAK_AFTER_WEEK ? rawWeek - BREAK_WEEKS : rawWeek;
  return Math.max(1, Math.min(MAX_WEEKS, adjustedWeek));
}

function getWeekDates(semWeek) {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const firstSunday = new Date(SEMESTER_START);
  firstSunday.setDate(SEMESTER_START.getDate() - 1);
  const actualWeek = semWeek > BREAK_AFTER_WEEK ? semWeek + BREAK_WEEKS : semWeek;
  const sunday = new Date(firstSunday.getTime() + (actualWeek - 1) * msPerWeek);
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

function getEventColorByType(typeName) {
  const name = String(typeName ?? "").trim().toLowerCase();

  if (name.includes("лек")) return EVENT_COLORS[0];
  if (name.includes("лаб")) return EVENT_COLORS[1];
  if (name.includes("сем")) return EVENT_COLORS[2];

  return EVENT_COLORS[3];
}

function getCompactEventTypeLabel(typeName) {
  const name = String(typeName ?? "").trim().toLowerCase();

  if (name.includes("лаб")) return "Лаб";
  if (name.includes("лек")) return "Лекц";
  if (name.includes("сем")) return "Сем";

  return typeName ?? "";
}

const COURSE_IMAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80",
  "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80",
];

function CourseCard({ course, index, loading }) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white">
        <Skeleton className="h-32 w-full rounded-none" />
        <div className="space-y-2 p-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    );
  }

  const img = COURSE_IMAGES[index % COURSE_IMAGES.length];

  return (
    <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-32 overflow-hidden bg-zinc-100">
        <img
          src={img}
          alt={course.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.style.display = "none"; }}
        />
      </div>
      <div className="flex min-h-[118px] flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900">
            {course.name}
          </h3>
          <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
            {course.userCount ?? 0} оюутан
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <FiUser className="h-3.5 w-3.5" />
            <span>Хичээлийн хэрэглэгчид</span>
          </div>
          <Link
            to={`/team4/courses/${course.courseId}/users`}
            className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Дэлгэрэнгүй
          </Link>
        </div>
      </div>
    </div>
  );
}


function apiWeekdayToJsDay(weekday) {
  if (weekday == null) return null;
  return Number(weekday) === 7 ? 0 : Number(weekday);
}

function getEventTime(tt) {
  const period = parseField(tt, "period") ?? tt.period ?? null;
  const periodNo = Number(period?.no ?? tt.period_no ?? tt.no ?? 0);
  const startTime = period?.start_time ?? tt.start_time ?? null;
  const [hourPart = "0", minutePart = "0"] = String(startTime ?? "0:0").split(":");

  return {
    slot: periodNo || Number(tt.period_id ?? 0),
    hour24: Number(hourPart),
    minute: Number(minutePart),
    timeLabel: startTime ? String(startTime).slice(0, 5) : null,
  };
}

// ── Shared Hour Grid (day or week) ────────────────────────────────────────────
function HourGrid({ dates, timetable, today, periods }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const slots = (periods?.length
    ? periods.map((period) => ({
        slot: Number(period.no ?? period.priority ?? period.id),
        label: period.name ?? `${period.no}-р пар`,
        timeLabel: [period.start_time, period.end_time].filter(Boolean).join(" - "),
      }))
    : Array.from(
        new Map(
          timetable
            .filter((event) => event.slot != null)
            .sort((a, b) => a.slot - b.slot)
            .map((event) => [event.slot, event])
        ).values()
      )
    );

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: CALENDAR_MIN_WIDTH }}>
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
        {slots.map((slot) => (
          <div
            key={slot.slot}
            className="grid border-b border-zinc-50 min-h-[54px]"
            style={{ gridTemplateColumns: `44px repeat(${dates.length}, 1fr) 44px` }}
          >
            <div className="flex flex-col items-center justify-center gap-0.5 px-1 text-center">
              <span className="text-[10px] font-medium text-zinc-400">{slot.slot}</span>
              {slot.timeLabel && (
                <span className="text-[8px] text-zinc-300">{slot.timeLabel}</span>
              )}
            </div>
            {dates.map((date, di) => {
              const isToday = date.toDateString() === today.toDateString();
              const isWknd  = date.getDay() === 0 || date.getDay() === 6;
              const evs = timetable.filter((event) => event.day === date.getDay() && event.slot === slot.slot);
              return (
                <div
                  key={di}
                  className={`min-w-0 overflow-hidden border-l border-zinc-50 px-0.5 py-0.5 ${isWknd ? "bg-zinc-50/50" : ""} ${isToday ? "bg-blue-50/30" : ""}`}
                >
                  {evs.map((ev, ei) => {
                    const col = getEventColorByType(ev.type);
                    const typeLabel = getCompactEventTypeLabel(ev.type);
                    const timeStr = ev.timeLabel ?? `${String(ev.hour24 ?? 0).padStart(2,"0")}:${String(ev.minute ?? 0).padStart(2,"0")}`;
                    return (
                      <button
                        type="button"
                        key={ei}
                        onClick={() => setSelectedEvent({ ...ev, timeStr })}
                        className={`mb-0.5 block h-[44px] w-full min-w-0 overflow-hidden rounded-md border px-1.5 py-1 text-left transition-all hover:brightness-95 ${col.bg} ${col.border}`}
                      >
                        <div className={`flex min-w-0 items-center gap-2 text-[9px] font-semibold ${col.text}`}>
                          <p className="flex shrink-0 items-center gap-1 whitespace-nowrap">
                            <span className={`inline-block h-1.5 w-1.5 rounded-full ${col.dot}`} />
                            {timeStr}
                          </p>
                          <span className="ml-auto shrink-0 whitespace-nowrap text-right">
                            {typeLabel}
                          </span>
                        </div>
                        <p className={`truncate whitespace-nowrap text-[10px] font-medium ${col.text}`}>
                          {ev.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              );
            })}
            <div className="border-l border-zinc-50 flex flex-col items-center justify-center gap-0.5 px-1 text-center">
              <span className="text-[9px] text-zinc-200">{slot.slot}</span>
              {slot.label && (
                <span className="text-[8px] text-zinc-200">{slot.label}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-zinc-400">{selectedEvent.timeStr}</p>
                <h3 className="text-sm font-semibold text-zinc-900">{selectedEvent.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="text-sm text-zinc-400 transition-colors hover:text-zinc-700"
              >
                Хаах
              </button>
            </div>
            <div className="space-y-2 text-sm text-zinc-600">
              <p><span className="font-medium text-zinc-800">Төрөл:</span> {selectedEvent.type}</p>
              <p><span className="font-medium text-zinc-800">Пар:</span> {selectedEvent.slot}</p>
              {selectedEvent.timeLabel && (
                <p><span className="font-medium text-zinc-800">Цаг:</span> {selectedEvent.timeLabel}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Month view ────────────────────────────────────────────────────────────────
function MonthGrid({ year, month, timetable, today }) {
  const [expandedDateKey, setExpandedDateKey] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const days = getMonthDays(year, month);
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: CALENDAR_MIN_WIDTH }}>
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
              const evs = timetable.filter((event) => event.day === date.getDay());
              const dateKey = date.toISOString().slice(0, 10);
              const isExpanded = expandedDateKey === dateKey;
              const visibleEvents = isExpanded ? evs : evs.slice(0, 2);
              return (
                <button
                  type="button"
                  key={di}
                  onClick={() => setExpandedDateKey(isExpanded ? null : dateKey)}
                  className={`min-h-[72px] border-l border-zinc-50 p-1 text-left transition-colors ${isWknd ? "bg-zinc-50/50" : ""} ${isToday ? "bg-blue-50/40" : ""} hover:bg-zinc-50`}
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className={`text-xs font-bold ${isToday ? "text-blue-600" : isWknd ? "text-zinc-400" : "text-zinc-700"}`}>
                      {date.getDate()}
                    </p>
                    {evs.length > 2 && (
                      <span className="text-[9px] text-zinc-400">{isExpanded ? "Хураах" : `+${evs.length - 2}`}</span>
                    )}
                  </div>
                  <div className={isExpanded ? "max-h-28 overflow-y-auto pr-1" : ""}>
                    {visibleEvents.map((ev, ei) => {
                      const col = getEventColorByType(ev.type);
                      return (
                        <button
                          type="button"
                          key={ei}
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedEvent(ev);
                          }}
                          className={`mb-0.5 block w-full truncate rounded px-1 py-0.5 text-left text-[9px] font-medium ${col.bg} ${col.text}`}
                        >
                          {ev.timeLabel ? `${ev.timeLabel} ` : ""}{ev.name}
                        </button>
                      );
                    })}
                  </div>
                  {evs.length === 0 && (
                    <p className="text-[9px] text-zinc-300">Хичээлгүй</p>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-zinc-400">{selectedEvent.timeLabel ?? "Цаггүй"}</p>
                <h3 className="text-sm font-semibold text-zinc-900">{selectedEvent.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="text-sm text-zinc-400 transition-colors hover:text-zinc-700"
              >
                Хаах
              </button>
            </div>
            <div className="space-y-2 text-sm text-zinc-600">
              <p><span className="font-medium text-zinc-800">Төрөл:</span> {selectedEvent.type}</p>
              <p><span className="font-medium text-zinc-800">Пар:</span> {selectedEvent.slot}</p>
              {selectedEvent.timeLabel && (
                <p><span className="font-medium text-zinc-800">Цаг:</span> {selectedEvent.timeLabel}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TeacherDashboard() {
  const { user, school } = useAuth();
  const [semWeek, setSemWeek]   = useState(getCurrentSemesterWeek);
  const [timetable, setTimetable] = useState([]);
  const [periods, setPeriods]   = useState([]);
  const [view, setView]         = useState("өдөр");   // өдөр | 7 хоног | сар
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [dayOffset, setDayOffset] = useState(0);
  const { courses, loading: coursesLoading } = useTeacherCoursesSummary({
    userId: user?.id,
    schoolId: school?.id,
  });

  const today    = new Date();
  const dayDate  = new Date(today);
  dayDate.setDate(today.getDate() + dayOffset);
  const weekDates = getWeekDates(semWeek);

  // For month navigation
  const [monthOffset, setMonthOffset] = useState(0);
  const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthYear  = monthDate.getFullYear();
  const monthMonth = monthDate.getMonth();

  // canGo* depends on view
  const canGoPrev = view === "өдөр"
    ? true
    : view === "сар"
      ? true
      : semWeek > 1;
  const canGoNext = view === "өдөр"
    ? true
    : view === "сар"
      ? true
      : semWeek < MAX_WEEKS;

  function handlePrev() {
    if (view === "өдөр") setDayOffset((offset) => offset - 1);
    else if (view === "сар") setMonthOffset(o => o - 1);
    else if (canGoPrev) setSemWeek(w => w - 1);
  }
  function handleNext() {
    if (view === "өдөр") setDayOffset((offset) => offset + 1);
    else if (view === "сар") setMonthOffset(o => o + 1);
    else if (canGoNext) setSemWeek(w => w + 1);
  }
  function handleToday() {
    setDayOffset(0);
    setMonthOffset(0);
    setSemWeek(getCurrentSemesterWeek());
  }

  // Label for toolbar
  const toolbarLabel = (() => {
    if (view === "сар") {
      return `${monthYear} — ${MONTH_MN[monthMonth]}`;
    }
    const opts = { month: "short", day: "numeric" };
    if (view === "өдөр") {
      return dayDate.toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" });
    }
    const start = weekDates[0];
    const end   = weekDates[6];
    return `${semWeek}-р долоо хоног · ${start.toLocaleDateString("en", opts)} – ${end.toLocaleDateString("en", opts)}`;
  })();

  // Load timetable from API
  useEffect(() => {
    if (!user?.id || !school?.id || coursesLoading) return;

    setTimetableLoading(true);

    Promise.all([
      apiGet(`/schools/${school.id}/periods`).catch(() => ({ items: [] })),
    ]).then(async ([periodsData]) => {
      const schoolPeriods = (periodsData?.items ?? [])
        .slice()
        .sort((a, b) => Number(a.no ?? a.priority ?? a.id) - Number(b.no ?? b.priority ?? b.id));
      setPeriods(schoolPeriods);

      const allEvents = [];
      for (const course of courses) {
        const cId = course.courseId;
        const name = course.name ?? `Хичээл #${cId}`;
        try {
          const ttData = await apiGet(`/courses/${cId}/timetables`);
          (ttData?.items ?? []).forEach((tt, idx) => {
            const lessonType = parseField(tt, "lesson_type") ?? tt.lesson_type ?? null;
            const eventTime = getEventTime(tt);
            allEvents.push({
              name,
              day: apiWeekdayToJsDay(tt.weekday ?? idx % 7),
              slot: eventTime.slot,
              hour24: eventTime.hour24,
              minute: eventTime.minute,
              timeLabel: eventTime.timeLabel,
              type: lessonType?.name ?? "Лекц",
            });
          });
        } catch {}
      }
      setTimetable(allEvents);
    }).catch(() => {
      setTimetable([]);
      setPeriods([]);
    }).finally(() => setTimetableLoading(false));
  }, [user?.id, school?.id, courses, coursesLoading]);

  // Which dates to show in day/week view
  const displayDates = view === "өдөр"
    ? [dayDate]
    : weekDates;
  const loading = coursesLoading || timetableLoading;
  const ghostCount = loading ? 0 : (3 - (courses.length % 3)) % 3;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Багшийн самбар</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {school?.name
            ? `${school.name} сургуулийн багшийн самбар`
            : "Сонгосон сургуулийн багшийн самбар"}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="font-semibold text-zinc-800">Миний хичээлүүд</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CourseCard key={i} loading course={{}} index={i} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="py-8">
            <EmptyState title="Хичээл байхгүй" description="Танд одоогоор энэ сургуульд оноогдсон хичээл алга." />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course, i) => (
              <CourseCard key={course.courseId} course={course} index={i} loading={false} />
            ))}
            {Array.from({ length: ghostCount }).map((_, i) => (
              <div
                key={`ghost-${i}`}
                className="h-[208px] rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50"
              />
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 px-5 py-3 border-b border-zinc-100 lg:flex-row lg:items-center lg:justify-between">
          {/* Nav arrows + label */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev && view !== "сар"}
              className={`h-7 w-7 rounded-full flex items-center justify-center text-lg transition-colors
                ${(canGoPrev || view === "сар") ? "hover:bg-zinc-100 text-zinc-500" : "text-zinc-200 cursor-not-allowed"}`}
            >‹</button>
            <div className="min-w-[180px] text-center sm:min-w-[220px]">
              <p className="text-sm font-semibold text-zinc-700">{toolbarLabel}</p>
            </div>
            <button
              onClick={handleNext}
              disabled={!canGoNext && view !== "сар"}
              className={`h-7 w-7 rounded-full flex items-center justify-center text-lg transition-colors
                ${(canGoNext || view === "сар") ? "hover:bg-zinc-100 text-zinc-500" : "text-zinc-200 cursor-not-allowed"}`}
            >›</button>
            <button
              type="button"
              onClick={handleToday}
              className="ml-1 inline-flex h-8 items-center gap-1 rounded-full border border-zinc-200 px-3 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
            >
              <FiCalendar className="h-3.5 w-3.5" />
              Өнөөдөр
            </button>
          </div>

          {/* View switcher — жил хасагдлаа */}
          <div className="flex items-center gap-0.5 self-start rounded-full bg-zinc-100 p-1 lg:self-auto">
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
            periods={periods}
          />
        )}
      </div>
    </div>
  );
}
