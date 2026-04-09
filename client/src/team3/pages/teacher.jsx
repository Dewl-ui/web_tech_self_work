import { Link, useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { attendanceSummaryLab, attendanceSummaryLecture, courseStudents, journalCourses, lessonStudents, teacherAttendanceRows, teacherInfo } from '../data';
import { CourseActionTabs, EmptySettings, JournalSubTabs, PageTitle, Panel, PieLegend, PrimaryButton, Shell, SmallButton, StatusDot } from '../components/common';

function AttendanceLegendTeacher() {
  const items = [
    ['Ирсэн', '#58df70'],
    ['Тасалсан', '#f26d6d'],
    ['Өвчтэй', '#c07cf3'],
    ['Чөлөөтэй', '#e6dc4a'],
  ];
  return <div className="flex flex-wrap gap-6 text-sm">{items.map(([label,color])=> <div key={label} className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{backgroundColor:color}} />{label}</div>)}</div>;
}

const DotCell = ({ active }) => <span className={`inline-block h-3 w-3 rounded-full ${active ? '' : 'bg-[#cfcfd9]'}`} />;

export function TeacherHome() {
  return <Shell role="teacher"><PageTitle title="Багшийн нүүр" /><Panel className="min-h-[400px] flex items-center justify-center text-2xl font-semibold text-gray-500">Багшийн үндсэн нүүр</Panel></Shell>;
}

export function TeacherJournal() {
  return (
    <Shell role="teacher">
      <PageTitle title="Хариуцаж буй хичээлүүд" />
      <Panel className="max-w-6xl">
        <h3 className="mb-4 text-3xl font-bold">2025-2026 оны хаврын улирал</h3>
        <div className="space-y-1 bg-[#bdbdc4] p-3">
          {journalCourses.map(course => (
            <div key={course.id} className="grid grid-cols-[1.2fr_1fr_140px] items-center gap-4 bg-[#bdbdc4] px-2 py-3 font-semibold">
              <div>{course.code} {course.name}</div>
              <div>{course.group}</div>
              <Link to={`${course.id}/summary`} className="text-right">Дэлгэрэнгүй</Link>
            </div>
          ))}
        </div>
      </Panel>
    </Shell>
  );
}

export function TeacherCourseSummary() {
  const { courseId } = useParams();
  const base = `/team3/teacher/journal/${courseId}`;
  return (
    <Shell role="teacher">
      <PageTitle title="S.MTM121 Математик" right={<div className="flex flex-wrap items-center gap-4 bg-[#d9d9d9] px-5 py-3 font-semibold"><span>Нийт сурагчдын тоо : 100</span><Link to={`${base}/students`} className="font-semibold">Бүх сурагчдыг харах →</Link></div>} />
      <CourseActionTabs base={base} />
      <JournalSubTabs active="summary" base={base} />
      <Panel className="min-h-[360px]">Удиртгал</Panel>
    </Shell>
  );
}

export function TeacherCourseStudents() {
  const { courseId } = useParams();
  const base = `/team3/teacher/journal/${courseId}`;
  return (
    <Shell role="teacher">
      <PageTitle title="S.MTM121 Математик" right={<div className="bg-[#d9d9d9] px-8 py-5 font-semibold">Нийт сурагчдын тоо : 100</div>} />
      <CourseActionTabs base={base} />
      <Panel className="max-w-6xl">
        <div className="overflow-hidden rounded-md bg-[#3b3b3b] text-white"><table className="min-w-full text-sm"><thead><tr>{['Оюутны код','Нэр','Холбоо барих дугаар'].map(h=><th key={h} className="border border-gray-600 px-4 py-3">{h}</th>)}</tr></thead><tbody>{courseStudents.map((s,i)=><tr key={i}><td className="border border-gray-700 px-4 py-3">{s.code}</td><td className="border border-gray-700 px-4 py-3">{s.name}</td><td className="border border-gray-700 px-4 py-3">{s.phone}</td></tr>)}{Array.from({length:5}).map((_,i)=><tr key={`e${i}`}><td className="border border-gray-700 px-4 py-3">&nbsp;</td><td className="border border-gray-700 px-4 py-3"></td><td className="border border-gray-700 px-4 py-3"></td></tr>)}</tbody></table></div>
      </Panel>
    </Shell>
  );
}

export function TeacherCourseBreakdown() {
  const { courseId } = useParams();
  const base = `/team3/teacher/journal/${courseId}`;
  return (
    <Shell role="teacher">
      <PageTitle title="S.MTM121 Математик" right={<div className="flex flex-wrap items-center gap-4 bg-[#d9d9d9] px-5 py-3 font-semibold"><span>Нийт сурагчдын тоо : 100</span><Link to={`${base}/students`}>Бүх сурагчдыг харах →</Link></div>} />
      <CourseActionTabs base={base} />
      <JournalSubTabs active="detail" base={base} />
      <Panel className="min-h-[360px]"><h3 className="text-xl font-bold">Онооны задаргаа</h3></Panel>
    </Shell>
  );
}

export function TeacherCourseTeacherInfo() {
  const { courseId } = useParams();
  const base = `/team3/teacher/journal/${courseId}`;
  return (
    <Shell role="teacher">
      <PageTitle title="S.MTM121 Математик" right={<div className="flex flex-wrap items-center gap-4 bg-[#d9d9d9] px-5 py-3 font-semibold"><span>Нийт сурагчдын тоо : 100</span><Link to={`${base}/students`}>Бүх сурагчдыг харах →</Link></div>} />
      <CourseActionTabs base={base} />
      <JournalSubTabs active="teacher" base={base} />
      <Panel className="grid gap-8 md:grid-cols-[180px_1fr] md:p-12"><div className="h-40 bg-[#555356]" /><div className="space-y-5 font-semibold"><p>{teacherInfo.name}</p><p>{teacherInfo.role}</p><p>{teacherInfo.email}</p><p>{teacherInfo.phone1}</p><p>{teacherInfo.phone2}</p></div></Panel>
    </Shell>
  );
}

export function TeacherAttendanceIndex() {
  return (
    <Shell role="teacher">
      <PageTitle title="Ирц бүртгэл" />
      <Panel className="mb-4"><h2 className="mb-3 text-5xl font-medium">Хорт программын шинжилгээ (F.NSA342)</h2><div className="flex gap-10 text-gray-600"><div className="flex items-center gap-2"><StatusDot color="#76dff1" />2026.03.09</div><div className="flex items-center gap-2"><StatusDot color="#76dff1" />Сэдэв: Malware analysis tools</div></div></Panel>
      <Panel className="mb-4 flex items-center justify-between"><button className="text-5xl text-[#712ff0]">←</button><h2 className="text-5xl">6-р долоо хоног</h2><button className="text-5xl text-[#712ff0]">→</button></Panel>
      <Panel className="mb-4"><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr>{['Цаг','Хичээлийн хэлбэр','Анги','Он сар','Ирц','Акт','Чөлөөний хүсэлтүүд'].map(h=><th key={h} className="border border-[#b391ec] px-3 py-2 text-left">{h}</th>)}</tr></thead><tbody>{teacherAttendanceRows.map((row, idx)=><tr key={idx}><td className="border border-[#b391ec] px-3 py-2">{row.slot}</td><td className="border border-[#b391ec] px-3 py-2">{row.type}</td><td className="border border-[#b391ec] px-3 py-2">{row.group}</td><td className="border border-[#b391ec] px-3 py-2">{row.date}</td><td className="border border-[#b391ec] px-3 py-2"><Link className="text-blue-600" to={row.slot === '1-4' ? 'lesson-1-4' : row.slot === '2-4' ? 'lab-2-4' : '#'}>{row.attendanceText}</Link></td><td className="border border-[#b391ec] px-3 py-2 text-center">☑</td><td className="border border-[#b391ec] px-3 py-2 text-center">☑</td></tr>)}</tbody></table></div><div className="mt-8 flex justify-end"><Link to="stats" className="rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,#ffffff,#e0f2fe)] px-8 py-3 text-sm font-semibold shadow-sm">6-р долоо хоногийн нийт ирцийн тоон үзүүлэлт</Link></div><div className="mt-10 rounded-[28px] bg-[linear-gradient(135deg,#bbf7d0,#4ade80)] px-8 py-10 text-center text-4xl font-bold text-slate-900 shadow-lg">Амжилттай хадгалагдлаа</div></Panel>
      <SmallButton>Буцах</SmallButton>
    </Shell>
  );
}

function LessonPage({ title, total, saveTo, searchValue = '' }) {
  return (
    <Shell role="teacher">
      <PageTitle title="Ирц бүртгэл" />
      <Panel className="mb-4"><h2 className="mb-3 text-5xl font-medium">Хорт программын шинжилгээ (F.NSA342)</h2><div className="flex gap-10 text-gray-600"><div className="flex items-center gap-2"><StatusDot color="#76dff1" />2026.03.10</div><div className="flex items-center gap-2"><StatusDot color="#76dff1" />Сэдэв: Malware analysis tools</div></div></Panel>
      <Panel className="mb-4"><div className="mb-4 flex flex-wrap items-center justify-between gap-4"><h2 className="text-[44px] leading-tight">{title}</h2><div className="flex items-center gap-4"><span>Нийт: {total} оюутан</span><div className="flex h-10 items-center rounded-full border px-4 text-sm text-gray-400"><input defaultValue={searchValue} className="w-24 bg-transparent outline-none" /><span>⌕</span></div></div></div><AttendanceLegendTeacher /></Panel>
      <Panel className="mb-4 overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-[#f7f5fb]"><tr>{['Оюутны Нэр','Оюутны Код','Ирсэн','Тасалсан','Өвчтэй','Чөлөөтэй'].map(h=><th key={h} className="px-3 py-3 text-left">{h}</th>)}</tr></thead><tbody>{(searchValue ? [lessonStudents[0]] : lessonStudents).map((row,idx)=><tr key={idx} className="border-b border-[#e2e2e8]"><td className="px-3 py-5">{row.name}</td><td className="px-3 py-5 text-[#5e4d92]">{row.code}</td><td className="px-3 py-5"><DotCell active={row.present} /></td><td className="px-3 py-5"><DotCell active={row.absent} /></td><td className="px-3 py-5"><DotCell active={row.sick} /></td><td className="px-3 py-5"><DotCell active={row.excused} /></td></tr>)}</tbody></table></Panel>
      <div className="flex justify-between"><SmallButton>Буцах</SmallButton><Link to={saveTo} className="rounded-md bg-[#d6d6d6] px-4 py-2 font-semibold">Хадгалах</Link></div>
    </Shell>
  );
}

export function TeacherAttendanceLesson() { return <LessonPage title="6-р долоо хоног: Лекц 1-4" total={74} saveTo="confirm-lecture" />; }
export function TeacherAttendanceLessonSearch() { return <LessonPage title="6-р долоо хоног: Лекц 1-4" total={74} saveTo="confirm-lecture" searchValue="B221876552" />; }
export function TeacherAttendanceLab() { return <LessonPage title="6-р долоо хоног: Лаборатор 2-4" total={18} saveTo="confirm-lab" />; }

function ConfirmModal({ total, values, saveLabel = 'Хадгалах' }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#4f46e5_0%,#23263a_34%,#141726_100%)] p-6"><div className="mx-auto max-w-3xl overflow-hidden rounded-[28px] border border-white/20 bg-[linear-gradient(135deg,#f8fafc,#eef2ff)] shadow-2xl"><div className="border-b border-slate-200 p-6 text-center text-4xl font-semibold text-slate-800">Ирцийг баталгаажуулах</div><div className="space-y-6 px-8 py-10 text-xl"><div className="text-center text-3xl font-semibold">Нийт {total} оюутнаас:</div><div className="mx-auto w-fit space-y-4">{values.map(([label,value,color])=> <div key={label} className="flex items-center gap-4"><span className="h-3 w-3 rounded-full" style={{backgroundColor:color}} /><span>{label}: <span style={{color}}>{value}</span></span></div>)}</div></div><div className="border-y p-6 text-center text-2xl font-medium">Та энэ {total === 74 ? 'лекцийн' : 'лабораторийн'} ирцийг хадгалахдаа итгэлтэй байна уу?</div><div className="flex justify-center gap-6 p-6"><SmallButton>Буцах</SmallButton><PrimaryButton className="bg-[#5f63ff]">{saveLabel}</PrimaryButton></div></div></div>
  );
}

export function TeacherConfirmLecture() { return <ConfirmModal total={74} values={[['Ирсэн',57,'#58df70'],['Тасалсан',10,'#f26d6d'],['Өвчтэй',4,'#c07cf3'],['Чөлөөтэй',3,'#e6dc4a']]} />; }
export function TeacherConfirmLab() { return <ConfirmModal total={18} values={[['Ирсэн',12,'#58df70'],['Тасалсан',1,'#f26d6d'],['Өвчтэй',2,'#c07cf3'],['Чөлөөтэй',3,'#e6dc4a']]} />; }

export function TeacherAttendanceStats() {
  return (
    <Shell role="teacher">
      <PageTitle title="Ирц бүртгэл" />
      <Panel className="mb-4"><h2 className="mb-3 text-5xl font-medium">Хорт программын шинжилгээ (F.NSA342)</h2><div className="flex gap-10 text-gray-600"><div className="flex items-center gap-2"><StatusDot color="#76dff1" />2026.03.10</div><div className="flex items-center gap-2"><StatusDot color="#76dff1" />Сэдэв: Malware analysis tools</div></div></Panel>
      <Panel className="mb-4 flex items-center justify-between"><button className="text-5xl text-[#712ff0]">←</button><h2 className="text-center text-[44px] leading-tight">6-р долоо хоног<br/>Нийт ирцийн тоон үзүүлэлт</h2><button className="text-5xl text-[#712ff0]">→</button></Panel>
      <Panel className="mb-4 grid gap-6 xl:grid-cols-2">{[[attendanceSummaryLecture,'Лекцийн ирц нийт 74 оюутан'],[attendanceSummaryLab,'Лабораторийн ирц нийт 18 оюутан']].map(([data,title])=><div key={title} className="rounded-md bg-[#f5f2fa] p-4"><div className="mb-4 text-center text-xl font-medium">{title}</div><div className="grid gap-4 md:grid-cols-[1fr_220px]"><div className="h-[320px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={0} outerRadius={105}>{data.map(item=><Cell key={item.name} fill={item.fill} />)}</Pie></PieChart></ResponsiveContainer></div><PieLegend data={data} /></div></div>)}</Panel>
      <SmallButton>Буцах</SmallButton>
    </Shell>
  );
}

export function TeacherAttendanceStatsEmpty() {
  return (
    <Shell role="teacher">
      <PageTitle title="Ирц бүртгэл" />
      <Panel className="mb-4"><h2 className="mb-3 text-5xl font-medium">Хорт программын шинжилгээ (F.NSA342)</h2><div className="flex gap-10 text-gray-600"><div className="flex items-center gap-2"><StatusDot color="#76dff1" />2026.03.10</div><div className="flex items-center gap-2"><StatusDot color="#76dff1" />Сэдэв: Malware analysis tools</div></div></Panel>
      <Panel className="mb-4 flex items-center justify-between"><button className="text-5xl text-[#712ff0]">←</button><h2 className="text-center text-[44px] leading-tight">6-р долоо хоног<br/>Нийт ирцийн тоон үзүүлэлт</h2><button className="text-5xl text-[#712ff0]">→</button></Panel>
      <Panel className="min-h-[500px] flex items-start justify-center"><div className="mt-10 rounded-[28px] bg-[linear-gradient(135deg,#fecaca,#fda4af)] px-12 py-10 text-center text-3xl font-semibold text-rose-900 shadow-lg">Уучлаарай, 6-р долоо хоногийн нэг ч ирц бүртгэгдээгүй байгаа тул тоон үзүүлэлт байхгүй байна.</div></Panel>
      <SmallButton>Буцах</SmallButton>
    </Shell>
  );
}

export function TeacherRequests() {
  return (
    <Shell role="teacher">
      <PageTitle title="Чөлөө авах хүсэлт(Хичээл)" />
      <Panel className="max-w-5xl bg-[linear-gradient(135deg,#ffffff,#f8fafc)]">
        <div className="overflow-hidden rounded-2xl border border-slate-100"><table className="min-w-full text-2xl"><thead className="bg-[linear-gradient(90deg,#334155,#475569)] text-white"><tr>{['Оюутнууд','Хичээл','Хариулт','Статус','Үйлдэл'].map(h=><th key={h} className="px-5 py-4 text-left">{h}</th>)}</tr></thead><tbody>{[['Оюутан 1','№','№','Хүлээгдэж буй'],['Оюутан 2','№','а','Зөвшөөрсөн'],['Оюутан 3','№','а','Зөвшөөрсөн'],['Оюутан 4','№','а','Татгалзсан']].map((row,i)=><tr key={i} className="border-b border-slate-200 bg-white/90 text-slate-800 hover:bg-sky-50"><td className="px-5 py-2 font-bold">{row[0]}</td><td className="px-5 py-2 font-bold">{row[1]}</td><td className="px-5 py-2 font-bold">{row[2]}</td><td className="px-5 py-2 font-bold">{row[3]}</td><td className="px-5 py-2 font-bold"><Link to={`${i+1}`}>Харах</Link> ✅ ❌</td></tr>)}</tbody></table></div>
      </Panel>
    </Shell>
  );
}

export function TeacherRequestDetail() {
  return (
    <Shell role="teacher">
      <PageTitle title="Хүсэлтийн дэлгэрэнгүй" />
      <Panel className="max-w-5xl px-10 py-12 text-2xl font-semibold leading-[4rem]"><div className="grid grid-cols-[1fr_1.2fr] gap-y-6"><div>Оюутан/Код:</div><div>B131870002</div><div>Хичээл:</div><div>Веб систем ба технологи</div><div>Шалтгаан:</div><div>Чөлөө авах шалтгаан</div><div>Тайлбар:</div><div>Чөлөө авах тайлбар</div><div>Хавсралт</div><div>pdf file</div></div><div className="mt-24 grid grid-cols-3 text-center text-2xl"><Link to="approve">Зөвшөөрөх</Link><Link to="reject">Татгалзах</Link><Link to=".." relative="path">Буцах</Link></div></Panel>
    </Shell>
  );
}

export function TeacherRejectRequest() {
  return (
    <Shell role="teacher">
      <PageTitle title="Хүсэлтийг татгалзах" />
      <Panel className="max-w-5xl px-10 py-10"><h2 className="mb-8 text-4xl font-bold">Татгалзах шалтгаан:</h2><div className="mb-32 h-40 rounded-2xl bg-[linear-gradient(135deg,#cbd5e1,#94a3b8)] shadow-inner" /><div className="grid grid-cols-2 text-center text-3xl font-bold"><button>Илгээх</button><Link to=".." relative="path">Цуцлах</Link></div></Panel>
    </Shell>
  );
}

export function TeacherApproveRequest() {
  return (
    <Shell role="teacher">
      <PageTitle title="Зөвшөөрлийг баталгаажуулах" />
      <Panel className="min-h-[650px] flex flex-col justify-between bg-[linear-gradient(135deg,#ffffff,#eff6ff)] px-10 py-16"><div className="text-center text-4xl font-bold">Та энэ хүсэлтийг батлахдаа итгэлтэй байна уу?</div><div className="grid grid-cols-2 text-center text-3xl font-bold"><button>Баталгаажуулах</button><Link to=".." relative="path">Цуцлах</Link></div></Panel>
    </Shell>
  );
}

export function TeacherSettings() {
  return <Shell role="teacher"><PageTitle title="Тохиргоо" /><EmptySettings /></Shell>;
}
