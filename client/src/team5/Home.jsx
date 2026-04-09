import React, { useState } from 'react';

const initialCourses = [
  {
    id: 'CS101',
    title: 'Мэдээлэл зүй',
    dept: 'CS тэнхим',
    year: '1-р жил',
    sem: '1-р улирал',
    q: 82,
    s: 156,
    date: '2025-09-01',
    pub: 74,
    status: 'Идэвхтэй',
    color: '#3B6FF5',
    bg: '#EEF2FE'
  },
  {
    id: 'CS201',
    title: 'Алгоритм ба Өгөгдлийн бүтэц',
    dept: 'CS тэнхим',
    year: '2-р жил',
    sem: '2-р улирал',
    q: 64,
    s: 98,
    date: '2025-09-01',
    pub: 55,
    status: 'Идэвхтэй',
    color: '#0D9488',
    bg: '#CCFBF1'
  },
  {
    id: 'CS301',
    title: 'Хиймэл оюун ухаан',
    dept: 'CS тэнхим',
    year: '3-р жил',
    sem: '1-р улирал',
    q: 51,
    s: 72,
    date: '2025-09-01',
    pub: 40,
    status: 'Идэвхтэй',
    color: '#7C3AED',
    bg: '#EDE9FE'
  },
  {
    id: 'MATH201',
    title: 'Дискрет математик',
    dept: 'Математик тэнхим',
    year: '2-р жил',
    sem: '1-р улирал',
    q: 38,
    s: 120,
    date: '2025-09-01',
    pub: 28,
    status: 'Идэвхтэй',
    color: '#D97706',
    bg: '#FEF3C7'
  },
  {
    id: 'BIO101',
    title: 'Биологийн үндэс',
    dept: 'Биологийн тэнхим',
    year: '1-р жил',
    sem: '2-р улирал',
    q: 29,
    s: 88,
    date: '2025-02-01',
    pub: 14,
    status: 'Ноороглон',
    color: '#F97316',
    bg: '#FFF7ED'
  }
];

// ── View Modal ──────────────────────────────────────────────────────────────
const ViewModal = ({ course, onClose }) => {
  if (!course) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[420px] max-w-[95vw] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-1.5 w-full" style={{ backgroundColor: course.color }} />
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <span
              className="px-2.5 py-0.5 rounded text-[11px] font-bold border"
              style={{ backgroundColor: course.bg, color: course.color, borderColor: `${course.color}4D` }}
            >
              {course.id}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg leading-none">✕</button>
          </div>
          <h2 className="text-[16px] font-extrabold text-[#1A1D2E] mb-1">{course.title}</h2>
          <p className="text-[11px] text-[#8A90AB] mb-5">{course.dept} · {course.year} · {course.sem}</p>

          <div className="grid grid-cols-2 gap-3 text-[11.5px]">
            {[
              ['📋 Асуулт', `${course.q} ширхэг`],
              ['👤 Оюутан', `${course.s} хүн`],
              ['⏱ Эхлэх огноо', course.date],
              ['📢 Нийтлэгдсэн', `${course.pub} / ${course.q}`],
            ].map(([label, value]) => (
              <div key={label} className="bg-[#F5F6FA] rounded-lg px-3 py-2.5">
                <div className="text-[#8A90AB] text-[10px] mb-0.5">{label}</div>
                <div className="font-bold text-[#1A1D2E]">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-[#8A90AB] mb-1">
              <span>Нийтлэлтийн явц</span>
              <span>{Math.round((course.pub / course.q) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-[#EEF0F8] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${(course.pub / course.q) * 100}%`, backgroundColor: course.color }}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1.5 ${
                course.status === 'Идэвхтэй' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEF3C7] text-[#D97706]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${course.status === 'Идэвхтэй' ? 'bg-[#16A34A]' : 'bg-[#D97706]'}`} />
              {course.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Edit Modal ──────────────────────────────────────────────────────────────
const EditModal = ({ course, onClose, onSave }) => {
  const [form, setForm] = useState({ ...course });
  if (!course) return null;

  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const inputCls = "w-full h-8 px-3 border border-[#E2E5EF] rounded-md text-[11.5px] focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white";
  const labelCls = "block text-[10px] text-[#8A90AB] font-semibold mb-1 uppercase tracking-wide";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[460px] max-w-[95vw] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-1.5 w-full" style={{ backgroundColor: course.color }} />
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[15px] font-extrabold text-[#1A1D2E]">Хичээл засах</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg leading-none">✕</button>
          </div>

          <div className="space-y-3">
            <div>
              <label className={labelCls}>Хичээлийн нэр</label>
              <input name="title" value={form.title} onChange={handle} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Тэнхим</label>
                <input name="dept" value={form.dept} onChange={handle} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Жил</label>
                <input name="year" value={form.year} onChange={handle} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Улирал</label>
                <input name="sem" value={form.sem} onChange={handle} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Статус</label>
                <select name="status" value={form.status} onChange={handle} className={inputCls}>
                  <option>Идэвхтэй</option>
                  <option>Ноороглон</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Нийт асуулт</label>
                <input name="q" type="number" value={form.q} onChange={handle} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Нийтлэгдсэн</label>
                <input name="pub" type="number" value={form.pub} onChange={handle} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Эхлэх огноо</label>
              <input name="date" type="date" value={form.date} onChange={handle} className={inputCls} />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 h-9 rounded-lg border border-[#E2E5EF] text-[12px] font-semibold text-[#4A4F6A] hover:bg-gray-50 transition-colors"
            >
              Цуцлах
            </button>
            <button
              onClick={() => { onSave(form); onClose(); }}
              className="flex-1 h-9 rounded-lg bg-blue-600 text-white text-[12px] font-bold hover:bg-blue-700 transition-colors"
            >
              Хадгалах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Delete Confirm Modal ────────────────────────────────────────────────────
const DeleteModal = ({ course, onClose, onConfirm }) => {
  if (!course) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[360px] max-w-[95vw] p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🗑️</div>
        <h2 className="text-[15px] font-extrabold text-[#1A1D2E] text-center mb-2">Хичээл устгах уу?</h2>
        <p className="text-[11.5px] text-[#8A90AB] text-center mb-6">
          <span className="font-bold text-[#1A1D2E]">{course.title}</span> хичээлийг устгахад бэлэн үү?
          Энэ үйлдлийг буцааж болохгүй.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-lg border border-[#E2E5EF] text-[12px] font-semibold text-[#4A4F6A] hover:bg-gray-50 transition-colors"
          >
            Цуцлах
          </button>
          <button
            onClick={() => { onConfirm(course.id); onClose(); }}
            className="flex-1 h-9 rounded-lg bg-red-500 text-white text-[12px] font-bold hover:bg-red-600 transition-colors"
          >
            Устгах
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Toast notification ──────────────────────────────────────────────────────
const Toast = ({ message, onDone }) => {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-[#1A1D2E] text-white text-[12px] font-semibold px-5 py-3 rounded-xl shadow-lg animate-bounce">
      {message}
    </div>
  );
};

// ── Create Modal ────────────────────────────────────────────────────────────
const COLORS = [
  { color: '#3B6FF5', bg: '#EEF2FE' },
  { color: '#0D9488', bg: '#CCFBF1' },
  { color: '#7C3AED', bg: '#EDE9FE' },
  { color: '#D97706', bg: '#FEF3C7' },
  { color: '#F97316', bg: '#FFF7ED' },
  { color: '#E11D48', bg: '#FFE4E6' },
];

const emptyForm = { id: '', title: '', dept: '', year: '1-р жил', sem: '1-р улирал', q: 0, s: 0, date: '', pub: 0, status: 'Идэвхтэй', color: '#3B6FF5', bg: '#EEF2FE' };

const CreateModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState(emptyForm);
  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const selectColor = (c) => setForm(prev => ({ ...prev, color: c.color, bg: c.bg }));

  const inputCls = "w-full h-8 px-3 border border-[#E2E5EF] rounded-md text-[11.5px] focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white";
  const labelCls = "block text-[10px] text-[#8A90AB] font-semibold mb-1 uppercase tracking-wide";
  const isValid = form.id.trim() && form.title.trim() && form.dept.trim() && form.date;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] max-w-[95vw] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="h-1.5 w-full" style={{ backgroundColor: form.color }} />
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[15px] font-extrabold text-[#1A1D2E]">Шинэ хичээл нэмэх</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg leading-none">✕</button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Хичээлийн код *</label>
                <input name="id" value={form.id} onChange={handle} placeholder="CS101" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Эхлэх огноо *</label>
                <input name="date" type="date" value={form.date} onChange={handle} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Хичээлийн нэр *</label>
              <input name="title" value={form.title} onChange={handle} placeholder="Хичээлийн нэр оруулах" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Тэнхим *</label>
              <input name="dept" value={form.dept} onChange={handle} placeholder="CS тэнхим" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Жил</label>
                <select name="year" value={form.year} onChange={handle} className={inputCls}>
                  {['1-р жил','2-р жил','3-р жил','4-р жил'].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Улирал</label>
                <select name="sem" value={form.sem} onChange={handle} className={inputCls}>
                  {['1-р улирал','2-р улирал'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Нийт асуулт</label>
                <input name="q" type="number" min="0" value={form.q} onChange={handle} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Оюутны тоо</label>
                <input name="s" type="number" min="0" value={form.s} onChange={handle} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Өнгө сонгох</label>
              <div className="flex gap-2 mt-1">
                {COLORS.map(c => (
                  <button
                    key={c.color}
                    onClick={() => selectColor(c)}
                    className="w-6 h-6 rounded-full border-2 transition-all"
                    style={{
                      backgroundColor: c.color,
                      borderColor: form.color === c.color ? '#1A1D2E' : 'transparent',
                      transform: form.color === c.color ? 'scale(1.25)' : 'scale(1)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 h-9 rounded-lg border border-[#E2E5EF] text-[12px] font-semibold text-[#4A4F6A] hover:bg-gray-50 transition-colors">
              Цуцлах
            </button>
            <button
              disabled={!isValid}
              onClick={() => { onAdd({ ...form, q: Number(form.q), s: Number(form.s), pub: 0 }); onClose(); }}
              className={`flex-1 h-9 rounded-lg text-white text-[12px] font-bold transition-colors ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
            >
              Нэмэх
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Home component ─────────────────────────────────────────────────────
const Home = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [viewCourse, setViewCourse] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [deleteCourse, setDeleteCourse] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState('');

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (newCourse) => {
    setCourses(prev => [...prev, newCourse]);
    setToast('Хичээл амжилттай нэмэгдлээ ✓');
  };

  const handleSave = (updated) => {
    setCourses(prev => prev.map(c => c.id === updated.id ? { ...c, ...updated, q: Number(updated.q), pub: Number(updated.pub) } : c));
    setToast('Амжилттай хадгалагдлаа ✓');
  };

  const handleDelete = (id) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    setToast('Хичээл устгагдлаа');
  };

  return (
    <div className="bg-[#F5F6FA] min-h-screen p-6 font-['Noto_Sans']">
      {/* Modals */}
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onAdd={handleAdd} />}
      {viewCourse && <ViewModal course={viewCourse} onClose={() => setViewCourse(null)} />}
      {editCourse && (
        <EditModal
          course={editCourse}
          onClose={() => setEditCourse(null)}
          onSave={handleSave}
        />
      )}
      {deleteCourse && (
        <DeleteModal
          course={deleteCourse}
          onClose={() => setDeleteCourse(null)}
          onConfirm={handleDelete}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast('')} />}

      {/* Header */}
      <div className="mb-6 ml-1">
        <h1 className="text-[18px] font-extrabold text-[#1A1D2E] tracking-tight">Хичээлүүд</h1>
        <p className="text-[11.5px] text-[#8A90AB] mt-1">Нийт {courses.length} хичээл бүртгэлтэй байна</p>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-8 gap-4 px-1">
        <div className="relative w-full max-w-[344px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BCC0D4] text-[11.5px]">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Хичээлийн нэр, код хайх..."
            className="w-full h-[31px] pl-10 pr-4 bg-white border border-[#E2E5EF] rounded-md text-[11.5px] focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-[#BCC0D4]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#BCC0D4] hover:text-gray-500 text-xs"
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={() => setViewMode(v => v === 'grid' ? 'table' : 'grid')}
          className={`h-[26px] px-4 border rounded-md text-[10.5px] font-bold flex items-center gap-2 transition-colors ${
            viewMode === 'table'
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-[#E2E5EF] text-[#4A4F6A] hover:bg-gray-50'
          }`}
        >
          <span className="text-[12px]">⠿</span> Хүснэгт харагдал
        </button>
      </div>

      {/* ── TABLE VIEW ── */}
      {viewMode === 'table' && (
        <div className="bg-white border border-[#E2E5EF] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-[11.5px]">
            <thead>
              <tr className="bg-[#F5F6FA] border-b border-[#E2E5EF]">
                {['Код', 'Хичээлийн нэр', 'Тэнхим', 'Жил / Улирал', 'Асуулт', 'Оюутан', 'Нийтлэлт', 'Статус', 'Үйлдэл'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-[#8A90AB] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((course, i) => (
                <tr key={course.id} className={`border-b border-[#E2E5EF] hover:bg-[#FAFBFF] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FAFBFF]/40'}`}>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold border"
                      style={{ backgroundColor: course.bg, color: course.color, borderColor: `${course.color}4D` }}
                    >
                      {course.id}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#1A1D2E] max-w-[180px] truncate">{course.title}</td>
                  <td className="px-4 py-3 text-[#8A90AB]">{course.dept}</td>
                  <td className="px-4 py-3 text-[#8A90AB] whitespace-nowrap">{course.year} · {course.sem}</td>
                  <td className="px-4 py-3 text-center">{course.q}</td>
                  <td className="px-4 py-3 text-center">{course.s}</td>
                  <td className="px-4 py-3 min-w-[100px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#EEF0F8] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(course.pub / course.q) * 100}%`, backgroundColor: course.color }} />
                      </div>
                      <span className="text-[10px] text-[#8A90AB] whitespace-nowrap">{course.pub}/{course.q}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold flex items-center gap-1 w-fit ${
                      course.status === 'Идэвхтэй' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${course.status === 'Идэвхтэй' ? 'bg-[#16A34A]' : 'bg-[#D97706]'}`} />
                      {course.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setViewCourse(course)} className="w-7 h-7 bg-[#F1F2F7] border border-[#E2E5EF] rounded-md flex items-center justify-center text-[11px] hover:bg-gray-200 transition-all" title="Харах">👁️</button>
                      <button onClick={() => setEditCourse(course)} className="w-7 h-7 bg-[#EEF2FE] border border-[#C7D4FC] rounded-md flex items-center justify-center text-[11px] hover:bg-blue-100 transition-all" title="Засах">✏️</button>
                      <button onClick={() => setDeleteCourse(course)} className="w-7 h-7 bg-[#FFE4E6] border border-[#FECDD3] rounded-md flex items-center justify-center text-[11px] hover:bg-red-100 transition-all" title="Устгах">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#8A90AB] text-[12px]">Хайлтад тохирох хичээл олдсонгүй</div>
          )}
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-[#E2E5EF] rounded-[10px] overflow-hidden flex flex-col h-[205px] shadow-sm relative group"
            >
              <div className="h-[4px] w-full" style={{ backgroundColor: course.color }} />
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div
                    className="px-2 py-0.5 rounded text-[10px] font-bold border"
                    style={{ backgroundColor: course.bg, color: course.color, borderColor: `${course.color}4D` }}
                  >
                    {course.id}
                  </div>
                </div>
                <h3 className="text-[13px] font-extrabold text-[#1A1D2E] mb-1 line-clamp-1 leading-tight">{course.title}</h3>
                <p className="text-[10.5px] text-[#8A90AB] mb-4">
                  {course.dept} · {course.year} · {course.sem}
                </p>
                <div className="flex items-center gap-4 text-[10.5px] text-[#8A90AB] mb-4">
                  <span className="flex items-center gap-1.5">📋 {course.q} асуулт</span>
                  <span className="flex items-center gap-1.5">👤 {course.s} оюутан</span>
                  <span className="flex items-center gap-1.5">⏱ {course.date}</span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] text-[#8A90AB] mb-1">
                    <span>Нийтлэгдсэн</span>
                    <span>{course.pub}/{course.q}</span>
                  </div>
                  <div className="h-[5px] w-full bg-[#EEF0F8] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(course.pub / course.q) * 100}%`, backgroundColor: course.color }}
                    />
                  </div>
                </div>
              </div>

              <div className="h-[47px] bg-[#FAFBFF] border-t border-[#E2E5EF] px-4 flex items-center justify-between">
                <div
                  className={`px-2 py-0.5 rounded text-[9.5px] font-bold flex items-center gap-1.5 ${
                    course.status === 'Идэвхтэй' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEF3C7] text-[#D97706]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${course.status === 'Идэвхтэй' ? 'bg-[#16A34A]' : 'bg-[#D97706]'}`} />
                  {course.status}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewCourse(course)}
                    className="w-7 h-7 bg-[#F1F2F7] border border-[#E2E5EF] rounded-md flex items-center justify-center text-[11px] hover:bg-gray-200 transition-all"
                    title="Харах"
                  >👁️</button>
                  <button
                    onClick={() => setEditCourse(course)}
                    className="w-7 h-7 bg-[#EEF2FE] border border-[#C7D4FC] rounded-md flex items-center justify-center text-[11px] hover:bg-blue-100 transition-all"
                    title="Засах"
                  >✏️</button>
                  <button
                    onClick={() => setDeleteCourse(course)}
                    className="w-7 h-7 bg-[#FFE4E6] border border-[#FECDD3] rounded-md flex items-center justify-center text-[11px] hover:bg-red-100 transition-all"
                    title="Устгах"
                  >🗑️</button>
                </div>
              </div>
            </div>
          ))}

          {/* Add new course card */}
          <button
            onClick={() => setShowCreate(true)}
            className="bg-[#F8FAFF] border-2 border-dashed border-[#E2E5EF] rounded-[10px] h-[205px] flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 group transition-all w-full"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl mb-3 group-hover:scale-110 transition-transform">
              +
            </div>
            <span className="text-[13px] font-bold text-blue-600">Шинэ хичээл нэмэх</span>
            <span className="text-[10px] text-[#8A90AB] mt-1">Хичээл бүртгэх</span>
          </button>
        </div>
      )}

      {/* No results */}
      {filtered.length === 0 && viewMode === 'grid' && (
        <div className="text-center py-16 text-[#8A90AB] text-[12px]">
          <div className="text-3xl mb-3">🔍</div>
          Хайлтад тохирох хичээл олдсонгүй
        </div>
      )}
    </div>
  );
};

export default Home;