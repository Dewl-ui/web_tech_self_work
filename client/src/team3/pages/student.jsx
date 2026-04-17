import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  attendanceWeekCards,
  detailScores,
  gradeCards,
  semesters,
  studentProfile,
} from "../data";
import {
  EmptySettings,
  Legend,
  PageTitle,
  Panel,
  PrimaryButton,
  Shell,
  SmallButton,
  StatusDot,
} from "../components/common";
import dayjs from "dayjs";
import React, { useState } from "react";

const gpaData = [
  { name: "2024-2025 Намар", value: 3.63 },
  { name: "2024-2025 Хавар", value: 3.7 },
  { name: "2025-2026 Намар", value: 3.75 },
];

export function StudentHome() {
  return (
    <Shell role="student">
      <PageTitle title={`Сайн уу, ${studentProfile.name} 👋`} />
      <Panel className="mb-5">
        <p className="mb-4 text-sm text-gray-600">
          Таны голч дүнгийн жагсаалт таны суралцах бүх хүрээнд
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["ШУТИС-ийн хэмжээнд", "104"],
            ["МХТС-ийн хэмжээнд", "14"],
            ["МЭДЭЭЛЛИЙН ТЕХНОЛОГИ-ийн хэмжээнд", "4"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-100 bg-[linear-gradient(135deg,#ffffff,#eff6ff)] px-6 py-8 text-center shadow-sm"
            >
              <p className="text-sm">{label}</p>
              <p className="mt-3 bg-[linear-gradient(135deg,#2563eb,#7c3aed)] bg-clip-text text-4xl font-extrabold text-transparent">
                {value}
              </p>
            </div>
          ))}
        </div>
      </Panel>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <Panel>
          <h3 className="mb-3 text-center text-xl font-bold">
            Үнэлгээний голч дүн
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gpaData}>
                <CartesianGrid stroke="#d9d9e6" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 4]} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#30cc39"
                  fill="#d8f6db"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <h3 className="mb-5 text-center text-xl font-bold">
            Оюутны товч мэдээлэл
          </h3>
          <div className="space-y-3 text-lg leading-9">
            <p>Оюутны код: {studentProfile.code}</p>
            <p>Салбар сургууль: {studentProfile.school}</p>
            <p>Тэнхим: {studentProfile.department}</p>
            <p>Мэргэжил: {studentProfile.major}</p>
            <p>Үзсэн кредитийн тоо: {studentProfile.credits} кр</p>
            <p>ҮГД: {studentProfile.gpa}</p>
          </div>
        </Panel>
      </div>
    </Shell>
  );
}

export function StudentGrades() {
  return (
    <Shell role="student">
      <PageTitle title="Дүнгийн мэдээлэл" />
      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <Panel className="flex items-center justify-between gap-4">
          <div>
            <p className="mb-3 font-semibold">Дүнгийн хуудас хэвлэх</p>
            <PrimaryButton>🖨️ Дүнгийн мэдээлэл татах</PrimaryButton>
          </div>
        </Panel>
        <Panel>
          <p className="mb-3 font-semibold">E-mail хаягаар илгээх</p>
          <div className="flex gap-2">
            <PrimaryButton className="bg-[#9ec9f3] text-[#08335a]">
              E-mail хаяг:
            </PrimaryButton>
            <input
              className="flex-1 rounded-md border border-[#d8d8e1] px-3"
              placeholder="Имэйл хаяг оруулна уу"
            />
            <PrimaryButton>Илгээх</PrimaryButton>
          </div>
        </Panel>
      </div>
      <Panel className="mb-5">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <select className="rounded-md border border-[#d8d8e1] bg-white px-4 py-3 md:w-72">
            <option>Бүх улирал</option>
          </select>
          <Link
            className="rounded-md bg-[#afd0ef] px-6 py-3 text-center font-semibold"
            to="detail"
          >
            Задаргаа харах
          </Link>
        </div>
        {semesters.map((semester) => (
          <div key={semester.id} className="mb-8">
            <h3 className="mb-3 text-lg text-gray-700">{semester.title}</h3>
            <div className="overflow-x-auto rounded-md border border-[#d8d8e4]">
              <table className="min-w-full text-sm">
                <thead className="bg-[#cfe6fb]">
                  <tr>
                    {[
                      "№",
                      "Хич.Код",
                      "Хичээлийн нэр",
                      "Кредит",
                      "Ирц",
                      "Шалгалт",
                      "Нийт оноо",
                      "Үс.Үнэлгээ",
                      "Чан.оноо",
                      "Багш.Код",
                      "Багшийн нэр",
                    ].map((h) => (
                      <th
                        key={h}
                        className="border border-[#d4d7e5] px-3 py-2 text-left"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {semester.items.map((item, idx) => (
                    <tr key={item.id} className="bg-white">
                      <td className="border px-3 py-2">{idx + 1}</td>
                      <td className="border px-3 py-2">{item.code}</td>
                      <td className="border px-3 py-2">{item.name}</td>
                      <td className="border px-3 py-2">{item.credit}</td>
                      <td className="border px-3 py-2">{item.irts}</td>
                      <td className="border px-3 py-2">{item.exam}</td>
                      <td className="border px-3 py-2">{item.total}</td>
                      <td className="border px-3 py-2">{item.letter}</td>
                      <td className="border px-3 py-2">{item.point}</td>
                      <td className="border px-3 py-2">{item.teacherCode}</td>
                      <td className="border px-3 py-2">{item.teacher}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#fafafb] font-semibold">
                    <td colSpan="3" className="border px-3 py-3 text-center">
                      Нийт кредит
                    </td>
                    <td className="border px-3 py-3 text-[#ff5a74]">9 кр</td>
                    <td colSpan="3" className="border px-3 py-3"></td>
                    <td colSpan="2" className="border px-3 py-3 text-center">
                      Үнэлгээний голч
                    </td>
                    <td colSpan="2" className="border px-3 py-3 text-[#ff5a74]">
                      3.70
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))}
      </Panel>
    </Shell>
  );
}

export function StudentGradeDetail() {
  return (
    <Shell role="student">
      <PageTitle title="Дүнгийн мэдээлэл - Задаргаа" />
      <Panel>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <select className="rounded-md border border-[#d8d8e1] px-4 py-3 md:w-80">
            <option>2024-2025 оны хичээлийн жил. 1-р улирал</option>
          </select>
          <Link
            to="report/select"
            className="rounded-md bg-[#afd0ef] px-6 py-3 font-semibold"
          >
            Алдаатай дүн мэдэгдэх
          </Link>
        </div>
        {[
          "F.CSM202 кодтой хичээлийн сорил, явцын оноо",
          "S.MTM122 кодтой хичээлийн сорил, явцын оноо",
        ].map((heading) => (
          <div key={heading} className="mb-6">
            <h3 className="mb-3 font-medium text-gray-700">{heading}</h3>
            <div className="overflow-x-auto rounded-md border border-[#d8d8e4]">
              <table className="min-w-full text-sm">
                <thead className="bg-[#cfe6fb]">
                  <tr>
                    {[
                      "№",
                      "Дүнгэх хэлбэр",
                      "Авсан оноо",
                      "Авах оноо",
                      "Тайлбар",
                    ].map((h) => (
                      <th key={h} className="border px-3 py-2">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detailScores.map((row) => (
                    <tr key={row.id} className="bg-white">
                      <td className="border px-3 py-2 text-center">{row.id}</td>
                      <td className="border px-3 py-2">
                        <Link
                          to="assignment"
                          className="font-semibold hover:text-blue-600"
                        >
                          {row.type}
                        </Link>
                      </td>
                      <td className="border px-3 py-2 text-center font-semibold">
                        {row.got}
                      </td>
                      <td className="border px-3 py-2 text-center font-semibold">
                        {row.max}
                      </td>
                      <td className="border px-3 py-2">{row.note}</td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="border px-3 py-2 text-center" colSpan="2">
                      Нийт дүн
                    </td>
                    <td className="border"></td>
                    <td className="border"></td>
                    <td className="border"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </Panel>
    </Shell>
  );
}

export function StudentAssignment() {
  return (
    <Shell role="student">
      <PageTitle title="Оноотой холбоотой даалгавар" />
      <Panel className="max-w-5xl">
        <p className="mb-8 text-sm font-semibold text-gray-500">
          Объект хандалтат програмчлал (F.CSM202) хичээлийн тухайн онооны
          даалгаврын мэдээлэл
        </p>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-4xl font-bold">Бие даалт</h2>
          <PrimaryButton className="bg-[#a8c9f1] text-[#10385b]">
            Даалгаврын хэсэгт харах
          </PrimaryButton>
        </div>
        <div className="mb-4 flex items-center gap-4 rounded-lg bg-white px-6 py-5">
          <div className="text-2xl">📄</div>
          <a className="text-blue-600 underline" href="#">
            Biy_daaltiin_udirdamj.pdf
          </a>
          <span className="ml-auto text-sm text-gray-500">
            2026.02.10, 6:58 AM
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-[#d8d8e4] bg-white">
          <table className="w-full text-sm">
            {[
              ["Эхлэх хугацаа", "2026.02.15"],
              ["Дуусах хугацаа", "2026.02.22"],
              ["Гүйцэтгэлийн статус", "Илгээсэн"],
              ["Үлдсэн хугацаа", "Дууссан"],
              ["Үнэлгээ", "20/20"],
              ["Гүйцэтгэлийн статус", ""],
              ["Тайлбар", ""],
              ["Хавсралт файл", "BD_tailan1.pdf"],
            ].map(([k, v]) => (
              <tr key={k + v}>
                <td className="w-1/3 border px-4 py-3 font-medium">{k}</td>
                <td className="border px-4 py-3">{v}</td>
              </tr>
            ))}
          </table>
        </div>
        <div className="mt-5 flex justify-end">
          <Link to=".." relative="path" className="text-2xl font-bold">
            Буцах
          </Link>
        </div>
      </Panel>
    </Shell>
  );
}

export function StudentReportSelect() {
  return (
    <Shell role="student">
      <PageTitle title="Алдаатай орсон дүн мэдэгдэх" />
      <Panel className="max-w-5xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <h2 className="text-3xl font-bold">
            Алхам 1. Мэдэгдэх хичээл сонгох
          </h2>
          <p className="pt-2 text-gray-500">
            (2024-2025 оны хичээлийн жил. 1-р улирал)
          </p>
        </div>
        <div className="space-y-3">
          {[
            "F.CSM202 - Объект хандалтат программчлал - Багшийн нэр1",
            "S.MTM122 - Математик - Багшийн нэр2",
          ].map((label) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex-1 rounded-md border bg-white px-4 py-3">
                {label}
              </div>
              <Link
                to="../items"
                className="rounded-md bg-[#afd0ef] px-7 py-3 font-semibold"
              >
                Сонгох
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-20 space-y-5 text-gray-500">
          <p>Алдаатай орсон дүн мэдэгдэхэд анхаарах зүйлс:</p>
          <ol className="list-decimal space-y-4 pl-10">
            <li>
              Зөвхөн багшийн мэдэгдсэн дүн болон бусад системд орсон дүнгээс
              зөрсөн тохиолдолд мэдэгдэнэ үү.
            </li>
            <li>
              Сургуулийн дүн бүртгэлийн нэгдсэн систем хаалттай үед дүнд
              өөрчлөлт орох боломжгүйг анхаарна уу.
            </li>
            <li>
              Таны мэдэгдэл тухайн хичээлийг заасан багшид илгээгдсэнээр тухайн
              багш дүнг нягтлах ба систем хөгжүүлэгчид хариуцахгүй болно.
            </li>
          </ol>
        </div>
        <div className="mt-8 flex justify-end">
          <Link to=".." relative="path" className="text-2xl font-bold">
            Буцах
          </Link>
        </div>
      </Panel>
    </Shell>
  );
}

export function StudentReportItems() {
  return (
    <Shell role="student">
      <PageTitle title="Алдаатай орсон дүн мэдэгдэх" />
      <Panel className="max-w-5xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="text-2xl font-bold">
            Алхам 2. Сонгосон хичээлийн алдаатай дүнгийн хэсгийг сонгох
          </h2>
          <p className="text-gray-500">
            (2024-2025 оны хичээлийн жил. 1-р улирал)
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-[#cfe6fb]">
                <tr>
                  {["№", "Дүнгэх хэлбэр", "Авсан оноо", "Авах оноо"].map(
                    (h) => (
                      <th key={h} className="border px-3 py-2">
                        {h}
                      </th>
                    ),
                  )}
                  <th className="border px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {detailScores.map((row) => (
                  <tr key={row.id}>
                    <td className="border px-3 py-2 text-center">{row.id}</td>
                    <td className="border px-3 py-2">{row.type}</td>
                    <td className="border px-3 py-2 text-center">{row.got}</td>
                    <td className="border px-3 py-2 text-center">{row.max}</td>
                    <td className="border px-3 py-2 text-center">
                      <Link
                        to="../confirm"
                        className="rounded-md bg-[#afd0ef] px-5 py-2 font-semibold"
                      >
                        Сонгох
                      </Link>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                    className="border px-3 py-2 text-center font-semibold"
                    colSpan="4"
                  >
                    Нийт дүн
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <Link
                      to="../confirm"
                      className="rounded-md bg-[#afd0ef] px-5 py-2 font-semibold"
                    >
                      Сонгох
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-10 space-y-5 text-gray-500">
          <p>Алдаатай орсон дүн мэдэгдэхэд анхаарах зүйлс:</p>
          <ol className="list-decimal space-y-4 pl-10">
            <li>
              Зөвхөн багшийн мэдэгдсэн дүн болон бусад системд орсон дүнгээс
              зөрсөн тохиолдолд мэдэгдэнэ үү.
            </li>
            <li>
              Сургуулийн дүн бүртгэлийн нэгдсэн систем хаалттай үед дүнд
              өөрчлөлт орох боломжгүйг анхаарна уу.
            </li>
            <li>
              Таны мэдэгдэл тухайн хичээлийг заасан багшид илгээгдсэнээр тухайн
              багш дүнг нягтлах ба систем хөгжүүлэгчид хариуцахгүй болно.
            </li>
          </ol>
        </div>
        <div className="mt-8 flex justify-end">
          <Link to=".." relative="path" className="text-2xl font-bold">
            Буцах
          </Link>
        </div>
      </Panel>
    </Shell>
  );
}

export function StudentReportConfirm() {
  return (
    <Shell role="student">
      <PageTitle title="Алдаатай орсон дүн мэдэгдэх" />
      <Panel className="max-w-5xl">
        <h2 className="mb-8 text-2xl font-bold">
          Алхам 3. Баталгаажуулаад илгээх
        </h2>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            {[
              ["Хичээлийн жил", "2024-2025 оны хичээлийн жил. 1-р улирал"],
              ["Хичээл", "F.CSM202 - Объект хандалтат програмчлал"],
              ["Заасан багш", "Багшийн нэр1"],
              ["Алдаатай гэж үзсэн дүн", "Бие даалт 20/20"],
            ].map(([k, v]) => (
              <tr key={k}>
                <td className="w-1/3 border px-4 py-4 font-semibold">{k}</td>
                <td className="border px-4 py-4">{v}</td>
              </tr>
            ))}
          </table>
        </div>
        <div className="my-8 flex gap-4">
          <SmallButton>Цуцлах</SmallButton>
          <PrimaryButton className="bg-[#f2a7a7] text-[#8f1e1e]">
            Илгээх
          </PrimaryButton>
        </div>
        <div className="space-y-5 text-gray-500">
          <p>Алдаатай орсон дүн мэдэгдэхэд анхаарах зүйлс:</p>
          <ol className="list-decimal space-y-4 pl-10">
            <li>
              Зөвхөн багшийн мэдэгдсэн дүн болон бусад системд орсон дүнгээс
              зөрсөн тохиолдолд мэдэгдэнэ үү.
            </li>
            <li>
              Сургуулийн дүн бүртгэлийн нэгдсэн систем хаалттай үед дүнд
              өөрчлөлт орох боломжгүйг анхаарна уу.
            </li>
            <li>
              Таны мэдэгдэл тухайн хичээлийг заасан багшид илгээгдсэнээр тухайн
              багш дүнг нягтлах ба систем хөгжүүлэгчид хариуцахгүй болно.
            </li>
          </ol>
        </div>
        <div className="mt-8 flex justify-end">
          <Link to=".." relative="path" className="text-2xl font-bold">
            Буцах
          </Link>
        </div>
      </Panel>
    </Shell>
  );
}

export function StudentAttendance() {
  return (
    <Shell role="student">
      <PageTitle title="Ирцийн мэдээлэл" />
      <div className="mb-5">
        <Legend />
      </div>
      <Panel>
        <div className="mb-6 flex items-center justify-between rounded-xl bg-white px-4 py-5 shadow-md">
          <button className="rounded-xl bg-[#6985ed] px-6 py-5 text-4xl">
            ‹
          </button>
          <h2 className="text-4xl font-bold text-[#4d68e8]">1-р Долоо Хоног</h2>
          <button className="rounded-xl bg-[#6985ed] px-6 py-5 text-4xl">
            ›
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {attendanceWeekCards.map((card) => (
            <div key={card.id} className="rounded-lg bg-[#d7e6f6] p-4">
              <div className="mb-3 rounded-md bg-[#6670e8] py-4 text-center text-white">
                {card.label}
              </div>
              <div className="h-24 rounded-md border-l-8 border-green-600 bg-[#edf6e7]" />
            </div>
          ))}
        </div>
      </Panel>
    </Shell>
  );
}

export function StudentCalendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState("month"); // month | week | year

  // Жишээ events
  const events = [
    { date: "2026-04-10", title: "Math Lecture" },
    { date: "2026-04-15", title: "Science Exam" },
    { date: "2026-04-20", title: "Project Deadline" },
  ];

  const goToPrevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const goToNextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const daysInMonth = Array.from(
    { length: currentDate.daysInMonth() },
    (_, i) => currentDate.date(i + 1)
  );

  // Сонгогдсон өдрийн events
  const selectedDayEvents = events.filter((e) =>
    dayjs(e.date).isSame(selectedDate, "day")
  );

  return (
    <Shell role="student">
      <PageTitle title="Хуанли" />

      <div className="grid gap-4 lg:grid-cols-[2.5fr_1fr]">
        {/* Гол календарь */}
        <Panel className="min-h-[620px] p-4">
          {/* Сар солих хэсэг */}
          <div className="flex items-center justify-center gap-4 text-2xl font-bold mb-6">
            <button
              className="rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300 transition"
              onClick={goToPrevMonth}
            >
              ‹
            </button>
            <span>{currentDate.format("MMMM YYYY")}</span>
            <button
              className="rounded-lg bg-gray-200 px-3 py-1 hover:bg-gray-300 transition"
              onClick={goToNextMonth}
            >
              ›
            </button>
          </div>

          {/* Өдөрүүд */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const isToday = day.isSame(dayjs(), "day");
              const hasEvent = events.some((e) => dayjs(e.date).isSame(day, "day"));
              return (
                <div
                  key={day.format("YYYY-MM-DD")}
                  className={`flex items-center justify-center h-12 w-12 border rounded-md text-sm font-medium cursor-pointer transition
                    ${isToday ? "bg-blue-100 font-bold" : ""}
                    ${hasEvent ? "border-blue-500" : "border-gray-300"}
                  `}
                  onClick={() => setSelectedDate(day)}
                >
                  {day.date()}
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Баруун талын контрол & events */}
        <Panel className="min-h-[620px] p-4 flex flex-col">
          {/* View mode switch */}
          <div className="ml-auto mb-4 flex w-fit gap-2 rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold">
            {["month", "week", "year"].map((mode) => (
              <span
                key={mode}
                className={`cursor-pointer px-2 py-1 rounded-full ${
                  viewMode === mode ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => setViewMode(mode)}
              >
                {mode === "month" ? "Сар" : mode === "week" ? "7 хоног" : "Жил"}
              </span>
            ))}
          </div>

          {/* Сонгогдсон өдрийн events */}
          <div className="flex-1 overflow-y-auto">
            <h4 className="font-semibold mb-2">
              {selectedDate.format("MMMM D, YYYY")} Events
            </h4>
            {selectedDayEvents.length > 0 ? (
              <ul className="space-y-1">
                {selectedDayEvents.map((event, i) => (
                  <li
                    key={i}
                    className="px-2 py-1 rounded border-l-4 border-blue-500 bg-gray-50"
                  >
                    {event.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Өнөөдөр ямар ч event байхгүй</p>
            )}
          </div>
        </Panel>
      </div>
    </Shell>
  );
}

export function StudentLeave() {
  return (
    <Shell role="student">
      <PageTitle title="Чөлөө авах хүсэлт(Хичээл)" />
      <Panel className="max-w-5xl">
        <div className="overflow-hidden rounded-lg">
          <table className="min-w-full text-xl">
            <thead className="bg-[#7f7f7f] text-white">
              <tr>
                {["Оюутнууд", "Хичээл", "Хариулт", "Статус", "Үйлдэл"].map(
                  (h) => (
                    <th key={h} className="px-5 py-4 text-left">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((item) => (
                <tr key={item.id} className="border-b bg-[#d2d2d2] text-black">
                  <td className="px-5 py-2 font-bold">{item.student}</td>
                  <td className="px-5 py-2 font-bold">{item.course}</td>
                  <td className="px-5 py-2 font-bold">{item.answer}</td>
                  <td className="px-5 py-2 font-bold">{item.status}</td>
                  <td className="px-5 py-2 font-bold">
                    <Link to={`${item.id}`} className="mr-4">
                      Харах
                    </Link>
                    ✅ ❌
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Shell>
  );
}

export function StudentAct() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Энд илгээх функцээ бичнэ
    console.log({ lastName, firstName, studentCode, date, description, file });
  };

  return (
    <Shell role="student">
      <PageTitle title="Акт илгээх" />
      <Panel className="min-h-[600px] p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-100 p-6 rounded-md">
          <label>
            Овог
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </label>
          <label>
            Нэр
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </label>
          <div className="flex gap-4">
            <label className="flex-1">
              Оюутан/Багш код
              <input
                type="text"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </label>
            <label className="flex-1">
              YYYY-MM-DD
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </label>
          </div>
          <label>
            Тайлбар
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded h-32"
            />
          </label>
          <label className="inline-flex items-center gap-2">
            File нэмэх
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="border p-2 rounded"
            />
          </label>
          <div className="flex gap-4 mt-4">
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Буцах
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Илгээх
            </button>
          </div>
        </form>
      </Panel>
    </Shell>
  );
}

export function StudentActSuccess() {
  return (
    <div className="min-h-screen bg-[#3d3d3d] p-6">
      <div className="mx-auto flex min-h-[92vh] max-w-3xl items-center justify-center rounded-sm bg-[#ececf2] p-8 shadow-2xl">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-16 text-center shadow-xl">
          <h1 className="mb-8 text-5xl font-bold">Таны акт илгээгдлээ.</h1>
          <div className="mx-auto flex h-28 max-w-md items-center justify-center rounded-2xl bg-[#59e46f] text-5xl font-bold">
            Амжилттай
          </div>
        </div>
      </div>
    </div>
  );
}

export function StudentRequestDetail() {
  return (
    <Shell role="student">
      <PageTitle title="Хүсэлтийн дэлгэрэнгүй" />
      <Panel className="max-w-5xl px-10 py-12 text-2xl font-semibold leading-[4rem]">
        <div className="grid grid-cols-[1fr_1.2fr] gap-y-6">
          <div>Оюутан/Код:</div>
          <div>B131870002</div>
          <div>Хичээл:</div>
          <div>Веб систем ба технологи</div>
          <div>Шалтгаан:</div>
          <div>Чөлөө авах шалтгаан</div>
          <div>Тайлбар:</div>
          <div>Чөлөө авах тайлбар</div>
          <div>Хавсралт</div>
          <div>pdf file</div>
        </div>
        <div className="mt-24 grid grid-cols-3 text-center text-2xl">
          <button>Зөвшөөрөх</button>
          <Link to="reject">Татгалзах</Link>
          <Link to=".." relative="path">
            Буцах
          </Link>
        </div>
      </Panel>
    </Shell>
  );
}

export function StudentReject() {
  return (
    <Shell role="student">
      <PageTitle title="Хүсэлтийг татгалзах" />
      <Panel className="max-w-5xl px-10 py-10">
        <h2 className="mb-8 text-4xl font-bold">Татгалзах шалтгаан:</h2>
        <div className="mb-32 h-40 bg-[#6e7180]" />
        <div className="grid grid-cols-2 text-center text-3xl font-bold">
          <button>Илгээх</button>
          <Link to=".." relative="path">
            Цуцлах
          </Link>
        </div>
      </Panel>
    </Shell>
  );
}

export function StudentSearchResult() {
  return (
    <Shell role="student">
      <PageTitle title="Хайлтын үр дүн:" />
      <Panel className="max-w-6xl">
        <div className="overflow-hidden rounded-lg">
          <table className="min-w-full text-2xl">
            <thead className="bg-[#7f7f7f] text-white">
              <tr>
                {["Оюутнууд", "Хичээл", "Хариулт", "Статус", "Үйлдэл"].map(
                  (h) => (
                    <th key={h} className="px-5 py-4 text-left">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-[#d2d2d2] text-black">
                <td className="px-5 py-2 font-bold">Оюутан 1</td>
                <td className="px-5 py-2 font-bold">№</td>
                <td className="px-5 py-2 font-bold">№</td>
                <td className="px-5 py-2 font-bold">Хүлээгдэж буй</td>
                <td className="px-5 py-2 font-bold">Харах ✅ ❌</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </Shell>
  );
}

export function StudentSettings() {
  return (
    <Shell role="student">
      <PageTitle title="Тохиргоо" />
      <EmptySettings />
    </Shell>
  );
}

export function StudentGradeCards() {
  return (
    <Shell role="student">
      <PageTitle title="Дүнгийн мэдээлэл" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {gradeCards.map((card) => (
          <Link
            key={card.id}
            to="detail"
            className={`${card.color} min-h-[150px] rounded-sm p-5 text-white shadow-md`}
          >
            <div className="font-bold">{card.code}</div>
            <div className="mb-8 max-w-[180px] text-2xl font-bold leading-tight">
              {card.title}
            </div>
            <div className="mt-auto flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                {card.mark}
              </div>
              <span>{card.percent}</span>
              <span>{card.grade}</span>
            </div>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
