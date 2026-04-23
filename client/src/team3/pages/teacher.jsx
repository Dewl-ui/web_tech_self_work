import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  attendanceSummaryLab,
  attendanceSummaryLecture,
  courseStudents,
  journalCourses,
  lessonStudents,
  teacherAttendanceRows,
  teacherInfo,
} from "../data";
import {
  CourseActionTabs,
  EmptySettings,
  JournalSubTabs,
  PageTitle,
  Panel,
  PieLegend,
  PrimaryButton,
  Shell,
  SmallButton,
  StatusDot,
} from "../components/common";

const REQUESTS_STORAGE_KEY = "team3.teacher.requests.v2";

const defaultRequests = [
  {
    id: 1,
    student: "B211870300",
    lesson: "Веб систем ба технологи",
    answer: "№",
    status: "Хүлээгдэж буй",
    rejectReason: "",
  },
  {
    id: 2,
    student: "B211870301",
    lesson: "Гүн сургалт",
    answer: "а",
    status: "Зөвшөөрсөн",
    rejectReason: "",
  },
  {
    id: 3,
    student: "B211870305",
    lesson: "Компьютерын архитектур дизайн",
    answer: "а",
    status: "Зөвшөөрсөн",
    rejectReason: "",
  },
  {
    id: 4,
    student: "B211870308",
    lesson: "Интернэт протоколын шинжилгээ",
    answer: "а",
    status: "Татгалзсан",
    rejectReason: "Өмнө нь татгалзсан",
  },
];

function getStoredRequests() {
  const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
  if (!raw) return defaultRequests;

  try {
    return JSON.parse(raw);
  } catch {
    return defaultRequests;
  }
}

function saveStoredRequests(rows) {
  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(rows));
}

function updateStoredRequest(id, updates) {
  const rows = getStoredRequests();
  const updated = rows.map((row) =>
    row.id === Number(id) ? { ...row, ...updates } : row,
  );
  saveStoredRequests(updated);
  return updated;
}

function getRequestById(id) {
  return getStoredRequests().find((row) => row.id === Number(id));
}

function AttendanceLegendTeacher() {
  const items = [
    ["Ирсэн", "#58df70"],
    ["Тасалсан", "#f26d6d"],
    ["Өвчтэй", "#c07cf3"],
    ["Чөлөөтэй", "#e6dc4a"],
  ];

  return (
    <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-700">
      {items.map(([label, color]) => (
        <div
          key={label}
          className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm"
        >
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          {label}
        </div>
      ))}
    </div>
  );
}

const softTableWrap =
  "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm";
const softTh =
  "bg-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-700";
const softTd = "border-t border-slate-200 px-4 py-3 text-sm text-slate-700";

const DotCell = ({ active, color = "#22c55e" }) => (
  <span
    className={`inline-block h-3.5 w-3.5 rounded-full shadow-sm ${
      active ? "" : "bg-[#d6d8e1]"
    }`}
    style={active ? { backgroundColor: color } : undefined}
  />
);

function InfoHeader({ date = "2026.03.10" }) {
  return (
    <Panel className="mb-4">
      <h2 className="mb-3 text-3xl font-bold text-slate-800 md:text-5xl">
        Хорт программын шинжилгээ (F.NSA342)
      </h2>
      <div className="flex flex-wrap gap-6 text-sm text-slate-600 md:gap-10 md:text-base">
        <div className="flex items-center gap-2">
          <StatusDot color="#76dff1" />
          {date}
        </div>
        <div className="flex items-center gap-2">
          <StatusDot color="#76dff1" />
          Сэдэв: Malware analysis tools
        </div>
      </div>
    </Panel>
  );
}

function WeekSwitcher({ title, subtitle }) {
  return (
    <Panel className="mb-4 flex items-center justify-between">
      <button className="text-4xl font-bold text-[#712ff0] transition hover:scale-110 md:text-5xl">
        ←
      </button>
      <h2 className="text-center text-3xl font-bold leading-tight text-slate-800 md:text-[44px]">
        {title}
        {subtitle ? (
          <>
            <br />
            {subtitle}
          </>
        ) : null}
      </h2>
      <button className="text-4xl font-bold text-[#712ff0] transition hover:scale-110 md:text-5xl">
        →
      </button>
    </Panel>
  );
}

function StatusBadge({ value }) {
  const tone =
    value === "Хүлээгдэж буй"
      ? "bg-amber-100 text-amber-700"
      : value === "Зөвшөөрсөн"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-rose-100 text-rose-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
      {value}
    </span>
  );
}

export function TeacherHome() {
  return (
    <Shell role="teacher">
      <PageTitle title="Багшийн нүүр" subtitle="Багшийн үндсэн самбар" />
      <Panel className="flex min-h-[400px] items-center justify-center text-2xl font-semibold text-slate-500">
        Багшийн үндсэн нүүр
      </Panel>
    </Shell>
  );
}

export function TeacherJournal() {
<<<<<<< HEAD
  const journalCourses = [
    { id: 1, code: "S.MTM121", name: "Математик", group: "МТ-1а хэсэг" },
    { id: 2, code: "F.ITM301", name: "Веб систем ба технологи", group: "ПХ-3б хэсэг" },
  ];

=======
>>>>>>> 62f0732e643627258b21ca6bc5d827ff4beda4ee
  return (
    <Shell role="teacher">
      <PageTitle
        title="Хариуцаж буй хичээлүүд"
        subtitle="2025-2026 оны хаврын улирал дахь таны хичээлүүд"
      />
<<<<<<< HEAD
      
=======
>>>>>>> 62f0732e643627258b21ca6bc5d827ff4beda4ee
      <Panel className="max-w-6xl">
        <div className="space-y-3">
          {journalCourses.map((course) => (
            <div
              key={course.id}
              className="grid grid-cols-[1.2fr_1fr_140px] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50/60"
            >
              <div className="font-semibold text-slate-800">
                {course.code} {course.name}
              </div>
              <div className="text-slate-500">{course.group}</div>
              <Link
<<<<<<< HEAD
                to={`${course.id}/detail`}
                className="text-right font-bold text-indigo-600 hover:underline"
              >
                Журнал руу орох
=======
                to={`${course.id}/summary`}
                className="text-right font-semibold text-indigo-600"
              >
                Дэлгэрэнгүй
>>>>>>> 62f0732e643627258b21ca6bc5d827ff4beda4ee
              </Link>
            </div>
          ))}
        </div>
      </Panel>
    </Shell>
  );
}
<<<<<<< HEAD
=======

>>>>>>> 62f0732e643627258b21ca6bc5d827ff4beda4ee
export function TeacherCourseSummary() {
  const { courseId } = useParams();
  const base = `/team3/teacher/journal/${courseId}`;

  return (
    <Shell role="teacher">
      <PageTitle
        title="S.MTM121 Математик"
        right={
          <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm">
            <span>Нийт сурагчдын тоо : 100</span>
            <Link
              to={`${base}/students`}
              className="font-semibold text-indigo-600"
            >
<<<<<<< HEAD
              Бүх сурагчдыг харах
=======
              Бүх сурагчдыг харах →
>>>>>>> 62f0732e643627258b21ca6bc5d827ff4beda4ee
            </Link>
          </div>
        }
      />
      <CourseActionTabs base={base} />
      <JournalSubTabs active="summary" base={base} />
<<<<<<< HEAD
=======
      <Panel className="min-h-[360px] bg-[linear-gradient(135deg,#ffffff,#eef6ff)] text-lg text-slate-600">
        Удиртгал
      </Panel>
>>>>>>> 62f0732e643627258b21ca6bc5d827ff4beda4ee
    </Shell>
  );
}

export function TeacherCourseStudents() {
  const { courseId } = useParams();
  const base = `/team3/teacher/journal/${courseId}`;

  return (
    <Shell role="teacher">
      <PageTitle
        title="S.MTM121 Математик"
        right={
          <div className="rounded-2xl bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm">
            Нийт сурагчдын тоо : 100
          </div>
        }
      />
      <CourseActionTabs base={base} />
      <Panel className="max-w-6xl">
        <div className={softTableWrap}>
          <table className="min-w-full">
            <thead>
              <tr>
                {["Оюутны код", "Нэр", "Холбоо барих дугаар"].map((h) => (
                  <th key={h} className={softTh}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courseStudents.map((s, i) => (
                <tr key={i} className="transition hover:bg-sky-50/60">
                  <td className={softTd}>{s.code}</td>
                  <td className={softTd}>{s.name}</td>
                  <td className={softTd}>{s.phone}</td>
                </tr>
              ))}
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={`e${i}`} className="transition hover:bg-sky-50/60">
                  <td className={softTd}>&nbsp;</td>
                  <td className={softTd}></td>
                  <td className={softTd}></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Shell>
  );
}

<<<<<<< HEAD
=======
export function TeacherCourseBreakdown() {
  const { courseId } = useParams();
  const base = `/team3/teacher/journal/${courseId}`;

  return (
    <Shell role="teacher">
      <PageTitle
        title="S.MTM121 Математик"
        right={
          <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm">
            <span>Нийт сурагчдын тоо : 100</span>
            <Link to={`${base}/students`} className="text-indigo-600">
              Бүх сурагчдыг харах →
            </Link>
          </div>
        }
      />
      <CourseActionTabs base={base} />
      <JournalSubTabs active="detail" base={base} />
      <Panel className="min-h-[360px] bg-[linear-gradient(135deg,#ffffff,#f8fbff)]">
        <h3 className="text-xl font-bold text-slate-800">Онооны задаргаа</h3>
      </Panel>
    </Shell>
  );
}

>>>>>>> 62f0732e643627258b21ca6bc5d827ff4beda4ee
export function TeacherCourseTeacherInfo() {
  const { courseId } = useParams();
  const base = `/team3/teacher/journal/${courseId}`;

  return (
    <Shell role="teacher">
      <PageTitle
        title="S.MTM121 Математик"
        right={
          <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm">
            <span>Нийт сурагчдын тоо : 100</span>
            <Link to={`${base}/students`} className="text-indigo-600">
              Бүх сурагчдыг харах →
            </Link>
          </div>
        }
      />
      <CourseActionTabs base={base} />
      <JournalSubTabs active="teacher" base={base} />
      <Panel className="grid gap-8 bg-[linear-gradient(135deg,#ffffff,#f8fbff)] md:grid-cols-[180px_1fr] md:p-12">
        <div className="h-40 rounded-2xl bg-[linear-gradient(135deg,#64748b,#334155)] shadow-inner" />
        <div className="space-y-5 font-semibold text-slate-700">
          <p>{teacherInfo.name}</p>
          <p>{teacherInfo.role}</p>
          <p>{teacherInfo.email}</p>
          <p>{teacherInfo.phone1}</p>
          <p>{teacherInfo.phone2}</p>
        </div>
      </Panel>
    </Shell>
  );
}

export function TeacherAttendanceIndex() {
  return (
    <Shell role="teacher">
      <PageTitle title="Ирц бүртгэл" />
      <InfoHeader date="2026.03.09" />
      <WeekSwitcher title="6-р долоо хоног" />
      <Panel className="mb-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                {[
                  "Цаг",
                  "Хичээлийн хэлбэр",
                  "Анги",
                  "Он сар",
                  "Ирц",
                  "Акт",
                  "Чөлөөний хүсэлтүүд",
                ].map((h) => (
                  <th
                    key={h}
                    className="border border-[#d8c4ff] bg-[#f7f5fb] px-3 py-3 text-left font-semibold text-slate-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teacherAttendanceRows.map((row, idx) => (
                <tr key={idx} className="transition hover:bg-sky-50/50">
                  <td className="border border-[#eadffb] px-3 py-3">
                    {row.slot}
                  </td>
                  <td className="border border-[#eadffb] px-3 py-3">
                    {row.type}
                  </td>
                  <td className="border border-[#eadffb] px-3 py-3">
                    {row.group}
                  </td>
                  <td className="border border-[#eadffb] px-3 py-3">
                    {row.date}
                  </td>
                  <td className="border border-[#eadffb] px-3 py-3">
                    <Link
                      className="font-semibold text-blue-600"
                      to={
                        row.slot === "1-4"
                          ? "lesson-1-4"
                          : row.slot === "2-4"
                            ? "lab-2-4"
                            : "#"
                      }
                    >
                      {row.attendanceText}
                    </Link>
                  </td>
                  <td className="border border-[#eadffb] px-3 py-3 text-center">
                    ☑
                  </td>
                  <td className="border border-[#eadffb] px-3 py-3 text-center">
                    ☑
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-end">
          <PrimaryButton as={Link} to="stats">
            6-р долоо хоногийн нийт ирцийн тоон үзүүлэлт
          </PrimaryButton>
        </div>

        <div className="mt-10 rounded-[28px] bg-[linear-gradient(135deg,#bbf7d0,#4ade80)] px-8 py-8 text-center text-2xl font-bold text-slate-900 shadow-lg md:text-4xl">
          Амжилттай хадгалагдлаа
        </div>
      </Panel>
      <SmallButton>Буцах</SmallButton>
    </Shell>
  );
}

function LessonPage({ title, total, saveTo, searchValue = "" }) {
  return (
    <Shell role="teacher">
      <PageTitle title="Ирц бүртгэл" />
      <InfoHeader />
      <Panel className="mb-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-bold leading-tight text-slate-800 md:text-[44px]">
            {title}
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold text-slate-700">
              Нийт: {total} оюутан
            </span>
            <div className="flex h-11 items-center rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-400 shadow-sm">
              <input
                defaultValue={searchValue}
                className="w-24 bg-transparent text-slate-600 outline-none"
                placeholder="Хайх"
              />
              <span>⌕</span>
            </div>
          </div>
        </div>
        <AttendanceLegendTeacher />
      </Panel>

      <Panel className="mb-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#f7f5fb]">
            <tr>
              {[
                "Оюутны Нэр",
                "Оюутны Код",
                "Ирсэн",
                "Тасалсан",
                "Өвчтэй",
                "Чөлөөтэй",
              ].map((h) => (
                <th
                  key={h}
                  className="px-3 py-3 text-left font-semibold text-slate-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(searchValue ? [lessonStudents[0]] : lessonStudents).map(
              (row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#e2e2e8] transition hover:bg-sky-50/50"
                >
                  <td className="px-3 py-5 text-slate-700">{row.name}</td>
                  <td className="px-3 py-5 font-medium text-[#5e4d92]">
                    {row.code}
                  </td>
                  <td className="px-3 py-5">
                    <DotCell active={row.present} color="#58df70" />
                  </td>
                  <td className="px-3 py-5">
                    <DotCell active={row.absent} color="#f26d6d" />
                  </td>
                  <td className="px-3 py-5">
                    <DotCell active={row.sick} color="#c07cf3" />
                  </td>
                  <td className="px-3 py-5">
                    <DotCell active={row.excused} color="#e6dc4a" />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </Panel>

      <div className="flex justify-between">
        <SmallButton>Буцах</SmallButton>
        <PrimaryButton as={Link} to={saveTo}>
          Хадгалах
        </PrimaryButton>
      </div>
    </Shell>
  );
}

export function TeacherAttendanceLesson() {
  return (
    <LessonPage
      title="6-р долоо хоног: Лекц 1-4"
      total={74}
      saveTo="confirm-lecture"
    />
  );
}

export function TeacherAttendanceLessonSearch() {
  return (
    <LessonPage
      title="6-р долоо хоног: Лекц 1-4"
      total={74}
      saveTo="confirm-lecture"
      searchValue="B221876552"
    />
  );
}

export function TeacherAttendanceLab() {
  return (
    <LessonPage
      title="6-р долоо хоног: Лаборатор 2-4"
      total={18}
      saveTo="confirm-lab"
    />
  );
}

function ConfirmModal({ total, values, saveLabel = "Хадгалах" }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#4f46e5_0%,#23263a_34%,#141726_100%)] p-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,#f8fafc,#eef2ff)] shadow-2xl">
        <div className="border-b border-slate-200 p-6 text-center text-3xl font-semibold text-slate-800 md:text-4xl">
          Ирцийг баталгаажуулах
        </div>

        <div className="space-y-6 px-8 py-10 text-lg md:text-xl">
          <div className="text-center text-2xl font-semibold md:text-3xl">
            Нийт {total} оюутнаас:
          </div>
          <div className="mx-auto w-fit space-y-4">
            {values.map(([label, value, color]) => (
              <div key={label} className="flex items-center gap-4">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span>
                  {label}: <span style={{ color }}>{value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-y border-slate-200 p-6 text-center text-xl font-medium text-slate-700 md:text-2xl">
          Та энэ {total === 74 ? "лекцийн" : "лабораторийн"} ирцийг хадгалахдаа
          итгэлтэй байна уу?
        </div>

        <div className="flex justify-center gap-4 p-6">
          <SmallButton>Буцах</SmallButton>
          <PrimaryButton>{saveLabel}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

export function TeacherConfirmLecture() {
  return (
    <ConfirmModal
      total={74}
      values={[
        ["Ирсэн", 57, "#58df70"],
        ["Тасалсан", 10, "#f26d6d"],
        ["Өвчтэй", 4, "#c07cf3"],
        ["Чөлөөтэй", 3, "#e6dc4a"],
      ]}
    />
  );
}

export function TeacherConfirmLab() {
  return (
    <ConfirmModal
      total={18}
      values={[
        ["Ирсэн", 12, "#58df70"],
        ["Тасалсан", 1, "#f26d6d"],
        ["Өвчтэй", 2, "#c07cf3"],
        ["Чөлөөтэй", 3, "#e6dc4a"],
      ]}
    />
  );
}

export function TeacherAttendanceStats() {
  return (
    <Shell role="teacher">
      <PageTitle title="Ирц бүртгэл" />
      <InfoHeader />
      <WeekSwitcher
        title="6-р долоо хоног"
        subtitle="Нийт ирцийн тоон үзүүлэлт"
      />

      <Panel className="mb-4 grid gap-6 xl:grid-cols-2">
        {[
          [attendanceSummaryLecture, "Лекцийн ирц нийт 74 оюутан"],
          [attendanceSummaryLab, "Лабораторийн ирц нийт 18 оюутан"],
        ].map(([data, title]) => (
          <div
            key={title}
            className="rounded-2xl bg-[linear-gradient(135deg,#ffffff,#f5f3ff)] p-5 shadow-sm"
          >
            <div className="mb-4 text-center text-lg font-semibold text-slate-800 md:text-xl">
              {title}
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={0}
                      outerRadius={105}
                    >
                      {data.map((item) => (
                        <Cell key={item.name} fill={item.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <PieLegend data={data} />
            </div>
          </div>
        ))}
      </Panel>

      <SmallButton>Буцах</SmallButton>
    </Shell>
  );
}

export function TeacherAttendanceStatsEmpty() {
  return (
    <Shell role="teacher">
      <PageTitle title="Ирц бүртгэл" />
      <InfoHeader />
      <WeekSwitcher
        title="6-р долоо хоног"
        subtitle="Нийт ирцийн тоон үзүүлэлт"
      />

      <Panel className="flex min-h-[500px] items-start justify-center">
        <div className="mt-10 rounded-[28px] bg-[linear-gradient(135deg,#fecaca,#fda4af)] px-12 py-10 text-center text-2xl font-semibold text-rose-900 shadow-lg md:text-3xl">
          Уучлаарай, 6-р долоо хоногийн нэг ч ирц бүртгэгдээгүй байгаа тул тоон
          үзүүлэлт байхгүй байна.
        </div>
      </Panel>

      <SmallButton>Буцах</SmallButton>
    </Shell>
  );
}

export function TeacherRequests() {
  const [rows, setRows] = useState(getStoredRequests());
  const [search, setSearch] = useState("");

  useEffect(() => {
    saveStoredRequests(rows);
  }, [rows]);

  const approveRequest = (id) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, status: "Зөвшөөрсөн", rejectReason: "" }
          : row,
      ),
    );
  };

  const rejectRequest = (id) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, status: "Татгалзсан" } : row,
      ),
    );
  };

  const filteredRows = rows.filter((row) =>
    row.student.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <Shell
      role="teacher"
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Оюутны кодоор хайх..."
    >
      <PageTitle title="Чөлөө авах хүсэлт (Хичээл)" />
      <Panel className="max-w-5xl">
        <div className={softTableWrap}>
          <table className="min-w-full">
            <thead>
              <tr>
                {["Оюутнууд", "Хичээл", "Хариулт", "Статус", "Үйлдэл"].map(
                  (h) => (
                    <th key={h} className={softTh}>
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => (
                  <tr key={row.id} className="transition hover:bg-sky-50/60">
                    <td className={softTd}>{row.student}</td>
                    <td className={softTd}>{row.lesson}</td>
                    <td className={softTd}>{row.answer}</td>
                    <td className={softTd}>
                      <StatusBadge value={row.status} />
                    </td>
                    <td className={softTd}>
                      <div className="flex items-center gap-3">
                        <Link
                          to={`${row.id}`}
                          className="font-semibold text-indigo-600 transition hover:text-indigo-800"
                        >
                          Харах
                        </Link>

                        <button
                          type="button"
                          onClick={() => approveRequest(row.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-600 shadow-sm transition hover:scale-105 hover:bg-emerald-200"
                          title="Зөвшөөрөх"
                        >
                          ✓
                        </button>

                        <button
                          type="button"
                          onClick={() => rejectRequest(row.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-lg font-bold text-rose-600 shadow-sm transition hover:scale-105 hover:bg-rose-200"
                          title="Татгалзах"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={softTd}>
                    <div className="py-6 text-center text-slate-500">
                      Хайлтад тохирох оюутан олдсонгүй
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </Shell>
  );
}

export function TeacherRequestDetail() {
  const { id } = useParams();
  const request = getRequestById(id);

  return (
    <Shell role="teacher">
      <PageTitle title="Хүсэлтийн дэлгэрэнгүй" />
      <Panel className="max-w-5xl px-10 py-12">
        <div className="grid grid-cols-1 gap-y-6 text-lg font-semibold leading-10 text-slate-800 md:grid-cols-[1fr_1.2fr]">
          <div>Оюутан/Код:</div>
          <div>
            {request ? `${request.student} / B131870002` : "Мэдээлэл олдсонгүй"}
          </div>

          <div>Хичээл:</div>
          <div>Веб систем ба технологи</div>

          <div>Шалтгаан:</div>
          <div>Чөлөө авах шалтгаан</div>

          <div>Тайлбар:</div>
          <div>{request?.rejectReason || "Чөлөө авах тайлбар"}</div>

          <div>Хавсралт:</div>
          <div className="text-indigo-600">pdf file</div>
        </div>

        <div className="mt-12 flex flex-wrap justify-end gap-4">
          <PrimaryButton as={Link} to="approve">
            Зөвшөөрөх
          </PrimaryButton>

          <PrimaryButton
            as={Link}
            to="reject"
            className="bg-[linear-gradient(135deg,#ef4444,#f97316)]"
          >
            Татгалзах
          </PrimaryButton>

          <SmallButton as={Link} to=".." relative="path">
            Буцах
          </SmallButton>
        </div>
      </Panel>
    </Shell>
  );
}

export function TeacherRejectRequest() {
  const navigate = useNavigate();
  const { id } = useParams();
  const request = getRequestById(id);
  const [reason, setReason] = useState(request?.rejectReason || "");

  const handleReject = () => {
    if (!reason.trim()) {
      alert("Татгалзах шалтгаанаа оруулна уу.");
      return;
    }

    updateStoredRequest(id, {
      status: "Татгалзсан",
      rejectReason: reason,
    });

    alert("Хүсэлтийг татгалзлаа.");
    navigate("/team3/teacher/requests");
  };

  return (
    <Shell role="teacher">
      <PageTitle
        title="Хүсэлтийг татгалзах"
        subtitle="Татгалзах болсон шалтгаанаа тодорхой бичнэ үү."
      />
      <Panel className="max-w-5xl px-10 py-10">
        <h2 className="mb-6 text-3xl font-bold text-slate-800">
          Татгалзах шалтгаан
        </h2>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Жишээ: Хавсралт дутуу, эсвэл хүсэлт батлах нөхцөл хангаагүй байна."
          className="min-h-[220px] w-full rounded-3xl border border-slate-300 bg-slate-50 px-5 py-4 text-lg text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        />

        <div className="mt-10 flex flex-wrap justify-end gap-4">
          <PrimaryButton
            type="button"
            onClick={handleReject}
            className="bg-[linear-gradient(135deg,#ef4444,#f97316)]"
          >
            Илгээх
          </PrimaryButton>

          <SmallButton as="button" type="button" onClick={() => navigate(-1)}>
            Цуцлах
          </SmallButton>
        </div>
      </Panel>
    </Shell>
  );
}

export function TeacherApproveRequest() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleApprove = () => {
    updateStoredRequest(id, {
      status: "Зөвшөөрсөн",
      rejectReason: "",
    });

    alert("Хүсэлтийг зөвшөөрлөө.");
    navigate("/team3/teacher/requests");
  };

  return (
    <Shell role="teacher">
      <PageTitle title="Зөвшөөрлийг баталгаажуулах" />
      <Panel className="min-h-[500px] max-w-5xl bg-[linear-gradient(135deg,#ffffff,#eff6ff)] px-10 py-16">
        <div className="flex h-full flex-col justify-between gap-16">
          <div className="text-center text-3xl font-bold text-slate-800 md:text-4xl">
            Та энэ хүсэлтийг батлахдаа итгэлтэй байна уу?
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <PrimaryButton type="button" onClick={handleApprove}>
              Баталгаажуулах
            </PrimaryButton>

            <SmallButton as="button" type="button" onClick={() => navigate(-1)}>
              Цуцлах
            </SmallButton>
          </div>
        </div>
      </Panel>
    </Shell>
  );
}

export function TeacherSettings() {
  return (
    <Shell role="teacher">
      <PageTitle title="Тохиргоо" />
      <EmptySettings />
    </Shell>
  );
}
<<<<<<< HEAD

export { default as TeacherCourseBreakdown } from './teacher/CourseBreakdown';
export { default as TeacherStudentGradeDetail } from './teacher/StudentGradeDetail';
export { default as TeacherAssignmentGrade } from './teacher/AssignmentGradeDetail';
export { default as TeacherStudentAttendanceDetail } from './teacher/StudentAttendanceDetail';
=======
>>>>>>> 62f0732e643627258b21ca6bc5d827ff4beda4ee
