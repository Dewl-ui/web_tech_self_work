import { useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import { apiGet, parseField } from "../../utils/api";

const DAY_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 1);

function getWeekDates(offset = 0) {
  const now = new Date();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - now.getDay() + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

const EVENT_COLORS = [
  { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"   },
  { bg: "bg-teal-100",   text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-500"   },
  { bg: "bg-amber-100",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [weekOffset, setWeekOffset] = useState(0);
  const [timetable, setTimetable] = useState([]);
  const [view, setView] = useState("өдөр");
  const [loading, setLoading] = useState(true);

  const weekDates = getWeekDates(weekOffset);
  const weekLabel = `${weekOffset + 3}-р долоо хоног`;
  const today = new Date();

  useEffect(() => {
    if (!user?.id) return;
    apiGet(`/users/${user.id}/courses`)
      .then((data) => {
        const items = data?.items ?? [];
        const events = [];
        items.forEach((item, idx) => {
          const c = parseField(item, "course") ?? item;
          const name = c.name ?? c.title ?? `Хичээл #${c.id ?? idx}`;
          events.push({
            name, day: (idx * 2 + 1) % 7, hour: 2, minute: 40,
            type: "Лекц", colorIdx: idx % 4,
          });
          events.push({
            name, day: (idx * 2 + 1) % 7, hour: 4, minute: 20,
            type: "Лаб", colorIdx: idx % 4,
          });
        });
        setTimetable(events);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <h1 className="text-xl font-semibold text-zinc-800">Хичээлийн хуваарь</h1>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset(w => w - 1)}
              className="h-7 w-7 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500 text-lg transition-colors"
            >‹</button>
            <span className="text-sm font-medium text-zinc-700 min-w-[120px] text-center">{weekLabel}</span>
            <button
              onClick={() => setWeekOffset(w => w + 1)}
              className="h-7 w-7 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500 text-lg transition-colors"
            >›</button>
          </div>
          <div className="flex items-center gap-0.5 bg-zinc-100 rounded-full p-1">
            {["өдөр", "долоо хоног", "сар", "жил"].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  view === v
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >{v}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
            {/* Day header row */}
            <div className="grid border-b border-zinc-100" style={{ gridTemplateColumns: "44px repeat(7, 1fr) 44px" }}>
              <div />
              {weekDates.map((date, i) => {
                const isToday = date.toDateString() === today.toDateString();
                const isWknd = i === 0 || i === 6;
                return (
                  <div key={i} className={`py-3 text-center ${isWknd ? "bg-zinc-50/70" : ""}`}>
                    <p className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">{DAY_SHORT[i]}</p>
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
                style={{ gridTemplateColumns: "44px repeat(7, 1fr) 44px" }}
              >
                <div className="flex items-start pt-2 justify-center">
                  <span className="text-[10px] text-zinc-300 font-medium">{hour}</span>
                </div>
                {weekDates.map((_, dayIdx) => {
                  const isToday = weekDates[dayIdx].toDateString() === today.toDateString();
                  const isWknd = dayIdx === 0 || dayIdx === 6;
                  const evs = timetable.filter(e => e.day === dayIdx && e.hour === hour);
                  return (
                    <div
                      key={dayIdx}
                      className={`border-l border-zinc-50 px-0.5 py-0.5 ${isWknd ? "bg-zinc-50/50" : ""} ${isToday ? "bg-blue-50/30" : ""}`}
                    >
                      {evs.map((ev, ei) => {
                        const col = EVENT_COLORS[ev.colorIdx];
                        const h12 = ev.hour > 12 ? ev.hour - 12 : ev.hour;
                        const ampm = ev.hour >= 12 ? "PM" : "AM";
                        const timeStr = `${String(h12).padStart(2,"0")}:${String(ev.minute).padStart(2,"0")} ${ampm}`;
                        return (
                          <div key={ei} className={`rounded-md border px-1.5 py-1 mb-0.5 cursor-pointer hover:brightness-95 transition-all ${col.bg} ${col.border}`}>
                            <p className={`text-[9px] font-semibold flex items-center gap-1 ${col.text}`}>
                              <span className={`inline-block h-1.5 w-1.5 rounded-full ${col.dot}`} />
                              {timeStr}
                            </p>
                            <p className={`text-[10px] font-medium truncate ${col.text}`}>
                              {ev.name}– {ev.type}
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
      </div>
    </div>
  );
}