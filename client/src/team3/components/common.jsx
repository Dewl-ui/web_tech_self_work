import { Link, useLocation } from 'react-router-dom';
import Header from './header/Header';
import SideMenu from './sidebar/SideMenu';

export function Shell({ children, role = 'student' }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#4f46e5_0%,#23263a_34%,#141726_100%)] p-3 md:p-6">
      <div className="mx-auto flex min-h-[94vh] max-w-[1520px] overflow-hidden rounded-[28px] border border-white/10 bg-[#eef2ff]/95 shadow-[0_25px_80px_rgba(15,23,42,0.45)] backdrop-blur-sm">
        <SideMenu role={role} currentPath={location.pathname} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(238,242,255,0.82)_0%,rgba(248,250,252,0.92)_100%)] px-4 py-6 md:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export function PageTitle({ title, subtitle, right }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="bg-[linear-gradient(135deg,#0f172a,#4338ca_55%,#06b6d4)] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-[30px]">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function Panel({ children, className = '' }) {
  return <section className={`rounded-[24px] border border-white/70 bg-white/78 p-5 shadow-[0_18px_50px_rgba(148,163,184,0.18)] backdrop-blur ${className}`}>{children}</section>;
}

export function SmallButton({ as: Comp = 'button', className = '', children, ...props }) {
  return <Comp className={`inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${className}`} {...props}>{children}</Comp>;
}

export function PrimaryButton({ as: Comp = 'button', className = '', children, ...props }) {
  return <Comp className={`inline-flex items-center justify-center rounded-xl bg-[linear-gradient(135deg,#4f46e5,#0ea5e9)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:opacity-95 ${className}`} {...props}>{children}</Comp>;
}

export function StatusDot({ color = '#59dd6d' }) {
  return <span className="inline-block h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: color }} />;
}

export function Legend() {
  const items = [
    ['Ирсэн', '#22c55e'],
    ['Чөлөөтэй', '#4f46e5'],
    ['Өвчтэй', '#a855f7'],
    ['Тасалсан', '#ef4444'],
  ];
  return (
    <div className="flex flex-wrap gap-5 text-sm font-semibold text-slate-700">
      {items.map(([label, color]) => (
        <div key={label} className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
          {label}
        </div>
      ))}
    </div>
  );
}

export function RoleHome() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Link to="/team3/student" className="rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,#ffffff,#e0f2fe)] p-8 shadow-xl shadow-sky-100 transition hover:-translate-y-1">
        <div className="mb-4 text-4xl">🎓</div>
        <h2 className="text-2xl font-bold text-slate-800">Оюутны UI</h2>
        <p className="mt-3 text-slate-600">Нүүр, дүнгийн мэдээлэл, ирц, хуанли, чөлөө болон актын дэлгэцүүд.</p>
      </Link>
      <Link to="/team3/teacher" className="rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,#ffffff,#ede9fe)] p-8 shadow-xl shadow-violet-100 transition hover:-translate-y-1">
        <div className="mb-4 text-4xl">🧑‍🏫</div>
        <h2 className="text-2xl font-bold text-slate-800">Багшийн UI</h2>
        <p className="mt-3 text-slate-600">Журнал, ирц бүртгэл, оюутны жагсаалт, хүсэлтийн удирдлагын дэлгэцүүд.</p>
      </Link>
    </div>
  );
}

export function EmptySettings() {
  return <Panel className="flex min-h-[320px] items-center justify-center bg-[linear-gradient(135deg,#ffffff,#eff6ff)] text-xl font-semibold text-slate-500">Тохиргооны хэсэг</Panel>;
}

export function CourseActionTabs({ base }) {
  const items = [
    { to: `${base}/students`, label: 'Ирцийн мэдээлэл →', tone: 'from-sky-100 to-cyan-100 text-sky-900' },
    { to: `${base}/breakdown`, label: 'Дүнгийн мэдээлэл →', tone: 'from-violet-100 to-fuchsia-100 text-violet-900' },
    { to: `/team3/teacher/attendance/stats`, label: 'Хичээлийн явц →', tone: 'from-amber-100 to-orange-100 text-orange-900' },
  ];
  return (
    <div className="mb-5 flex flex-wrap gap-3">
      {items.map((item) => (
        <Link key={item.to} to={item.to} className={`rounded-2xl bg-gradient-to-r ${item.tone} px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5`}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export function JournalSubTabs({ active, base }) {
  const tabs = [
    ['summary', 'Удиртгал'],
    ['detail', 'Хичээлийн дэлгэрэнгүй'],
    ['teacher', 'Багшийн мэдээлэл'],
  ];
  return (
    <div className="mb-7 flex flex-wrap gap-3">
      {tabs.map(([key, label]) => (
        <Link
          key={key}
          to={`${base}/${key}`}
          className={`rounded-2xl px-6 py-3 text-sm font-semibold transition ${active === key ? 'bg-[linear-gradient(135deg,#4338ca,#06b6d4)] text-white shadow-lg' : 'bg-white text-slate-700 shadow-sm hover:bg-slate-50'}`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

export function PieLegend({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="space-y-3 pt-4 text-sm text-slate-700">
      {data.map((item) => (
        <div key={item.name} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
          <span>{item.name}-{((item.value / total) * 100).toFixed(1)}% ({item.value})</span>
        </div>
      ))}
    </div>
  );
}
