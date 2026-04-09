import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const LEVEL_COLORS = {
  'Санах':       { bg: '#FEE2E2', text: '#DC2626' },
  'Ойлгох':      { bg: '#FEF3C7', text: '#D97706' },
  'Хэрэглэх':   { bg: '#DCFCE7', text: '#16A34A' },
  'Шинжлэх':    { bg: '#DBEAFE', text: '#2563EB' },
  'Үнэлэх':     { bg: '#EDE9FE', text: '#7C3AED' },
  'Бүтээх':     { bg: '#FCE7F3', text: '#DB2777' },
  'Хялбар':     { bg: '#DCFCE7', text: '#16A34A' },
  'Дунд':       { bg: '#FEF3C7', text: '#D97706' },
  'Хэцүү':      { bg: '#FEE2E2', text: '#DC2626' },
};

const TYPE_COLORS = {
  'Сонгох':       { bg: '#EEF2FE', text: '#3B6FF5' },
  'Нөхөх':        { bg: '#CCFBF1', text: '#0D9488' },
  'Харгалзуулах': { bg: '#FFF7ED', text: '#F97316' },
  'Бичих':        { bg: '#EDE9FE', text: '#7C3AED' },
  'Багц':         { bg: '#FCE7F3', text: '#DB2777' },
};

const getColor = (map, key) => map[key] || { bg: '#F3F4F6', text: '#6B7280' };

const StatusBadge = ({ status }) => {
  const isActive = status === 'Нийтлэгдсэн' || status === true || status === 1;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEF3C7] text-[#D97706]'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#16A34A]' : 'bg-[#D97706]'}`} />
      {isActive ? 'Нийтлэгдсэн' : 'Ноороглон'}
    </span>
  );
};

const DeleteModal = ({ question, onClose, onConfirm }) => {
  if (!question) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[360px] max-w-[95vw] p-6" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🗑️</div>
        <h2 className="text-[15px] font-extrabold text-[#1A1D2E] text-center mb-2">Асуулт устгах уу?</h2>
        <p className="text-[11.5px] text-[#8A90AB] text-center mb-6 line-clamp-2">
          "<span className="font-bold text-[#1A1D2E]">{question.question}</span>" асуултыг устгахад бэлэн үү? Энэ үйлдлийг буцааж болохгүй.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-9 rounded-lg border border-[#E2E5EF] text-[12px] font-semibold text-[#4A4F6A] hover:bg-gray-50 transition-colors">
            Цуцлах
          </button>
          <button onClick={() => { onConfirm(question.id); onClose(); }} className="flex-1 h-9 rounded-lg bg-red-500 text-white text-[12px] font-bold hover:bg-red-600 transition-colors">
            Устгах
          </button>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, type = 'success', onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] text-white text-[12px] font-semibold px-5 py-3 rounded-xl shadow-lg ${type === 'error' ? 'bg-red-500' : 'bg-[#1A1D2E]'}`}>
      {message}
    </div>
  );
};

const ITEMS_PER_PAGE = 10;

const MOCK_QUESTIONS = [
  { id: 1, question: 'Machine Learning-д supervised learning гэж юуг хэлэх вэ?', type_name: 'Сонгох', level_name: 'Ойлгох', point: 5, status: 'Нийтлэгдсэн', created_at: '2025-01-15' },
  { id: 2, question: 'Neural network-ийн activation function-ий зорилго юу вэ?', type_name: 'Бичих', level_name: 'Ойлгох', point: 8, status: 'Нийтлэгдсэн', created_at: '2025-01-18' },
  { id: 3, question: 'Overfitting болон underfitting-ийн ялгааг тайлбарла.', type_name: 'Бичих', level_name: 'Шинжлэх', point: 10, status: 'Нийтлэгдсэн', created_at: '2025-01-20' },
  { id: 4, question: 'React-д useState hook ямар зорилгоор ашиглагддаг вэ?', type_name: 'Сонгох', level_name: 'Санах', point: 3, status: 'Нийтлэгдсэн', created_at: '2025-01-22' },
  { id: 5, question: 'useEffect hook-ийн dependency array хоосон байвал хэзээ ажиллах вэ?', type_name: 'Сонгох', level_name: 'Ойлгох', point: 5, status: 'Нийтлэгдсэн', created_at: '2025-01-24' },
  { id: 6, question: 'HTTP болон HTTPS-ийн ялгааг тайлбарла.', type_name: 'Бичих', level_name: 'Ойлгох', point: 5, status: 'Нийтлэгдсэн', created_at: '2025-01-25' },
  { id: 7, question: 'REST API-д GET, POST, PUT, DELETE методуудыг хэрхэн ашигладаг вэ?', type_name: 'Харгалзуулах', level_name: 'Хэрэглэх', point: 8, status: 'Нийтлэгдсэн', created_at: '2025-01-26' },
  { id: 8, question: 'SQL-д JOIN төрлүүдийг жишээтэй тайлбарла.', type_name: 'Бичих', level_name: 'Хэрэглэх', point: 10, status: 'Ноороглон', created_at: '2025-01-28' },
  { id: 9, question: 'CSS Flexbox болон Grid-ийн ялгааг _______ гэж нэрлэдэг.', type_name: 'Нөхөх', level_name: 'Санах', point: 3, status: 'Нийтлэгдсэн', created_at: '2025-01-29' },
  { id: 10, question: 'Git-д merge болон rebase-ийн ялгаа юу вэ?', type_name: 'Сонгох', level_name: 'Шинжлэх', point: 5, status: 'Нийтлэгдсэн', created_at: '2025-01-30' },
  { id: 11, question: 'Binary search алгоритмын цаг хугацааны нарийвчлал (time complexity) хэд вэ?', type_name: 'Сонгох', level_name: 'Санах', point: 5, status: 'Нийтлэгдсэн', created_at: '2025-02-01' },
  { id: 12, question: 'Дараах Python кодын гаралт юу болох вэ? print([x**2 for x in range(5)])', type_name: 'Бичих', level_name: 'Хэрэглэх', point: 8, status: 'Ноороглон', created_at: '2025-02-03' },
];

const MOCK_TYPES  = [{ id: 1, name: 'Сонгох' }, { id: 2, name: 'Нөхөх' }, { id: 3, name: 'Харгалзуулах' }, { id: 4, name: 'Бичих' }, { id: 5, name: 'Багц' }];
const MOCK_LEVELS = [{ id: 1, name: 'Санах' }, { id: 2, name: 'Ойлгох' }, { id: 3, name: 'Хэрэглэх' }, { id: 4, name: 'Шинжлэх' }, { id: 5, name: 'Үнэлэх' }, { id: 6, name: 'Бүтээх' }];

const QuestionList = () => {
  const { course_id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [types, setTypes] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Pagination
  const [page, setPage] = useState(1);

  // Modals
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  // Selected rows
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [qData, tData, lData] = await Promise.all([
          api.fetchQuestions(course_id),
          api.fetchQuestionTypes(),
          api.fetchQuestionLevels(),
        ]);
        const qs = Array.isArray(qData) ? qData : qData.items || [];
        const ts = Array.isArray(tData) ? tData : tData.items || [];
        const ls = Array.isArray(lData) ? lData : lData.items || [];
        setQuestions(qs.length > 0 ? qs : MOCK_QUESTIONS);
        setTypes(ts.length > 0 ? ts : MOCK_TYPES);
        setLevels(ls.length > 0 ? ls : MOCK_LEVELS);
      } catch (err) {
        console.error(err);
        setQuestions(MOCK_QUESTIONS);
        setTypes(MOCK_TYPES);
        setLevels(MOCK_LEVELS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [course_id]);

  const handleDelete = async (id) => {
    try {
      // api.deleteQuestion is not in api.js yet — use fetch directly
      const token = localStorage.getItem('token');
      const res = await fetch(`https://todu.mn/bs/lms/v1/courses/${course_id}/questions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error();
      setQuestions(prev => prev.filter(q => q.id !== id));
      setSelected(prev => prev.filter(s => s !== id));
      setToast({ message: 'Асуулт амжилттай устгагдлаа', type: 'success' });
    } catch {
      setToast({ message: 'Устгахад алдаа гарлаа', type: 'error' });
    }
  };

  // ── Filtering ──
  const filtered = questions.filter(q => {
    const matchSearch = !search || q.question?.toLowerCase().includes(search.toLowerCase());
    const matchType   = !filterType   || String(q.type_id) === String(filterType);
    const matchLevel  = !filterLevel  || String(q.level_id) === String(filterLevel);
    const matchStatus = !filterStatus || (
      filterStatus === 'published'
        ? q.status === 'Нийтлэгдсэн' || q.status === true || q.status === 1
        : q.status === 'Ноороглон'   || q.status === false || q.status === 0
    );
    return matchSearch && matchType && matchLevel && matchStatus;
  });

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetPage = () => setPage(1);

  // ── Select all on current page ──
  const allSelected = paginated.length > 0 && paginated.every(q => selected.includes(q.id));
  const toggleAll = () => {
    if (allSelected) setSelected(prev => prev.filter(id => !paginated.map(q => q.id).includes(id)));
    else setSelected(prev => [...new Set([...prev, ...paginated.map(q => q.id)])]);
  };
  const toggleOne = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="p-6 text-center">
      <div className="text-red-500 text-[13px] font-semibold mb-3">{error}</div>
      <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[12px]">Дахин оролдох</button>
    </div>
  );

  return (
    <div className="bg-[#F5F6FA] min-h-screen p-6 font-['Noto_Sans']">
      {deleteTarget && (
        <DeleteModal
          question={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}

      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-[#8A90AB] mb-1">
            <span className="font-bold text-[#3B6FF5]">{course_id}</span>
            <span>Асуулт жагсаалт</span>
            <span className="text-[#BCC0D4]">/courses/{course_id}/questions</span>
          </div>
          <h1 className="text-[18px] font-extrabold text-[#1A1D2E]">Хичээлийн асуулт жагсаалт</h1>
          <p className="text-[11.5px] text-[#8A90AB] mt-0.5">
            {course_id} · Нийт <span className="font-bold text-[#1A1D2E]">{filtered.length}</span> асуулт
          </p>
        </div>
        <Link
          to={`/team5/courses/${course_id}/questions/create`}
          className="flex items-center gap-2 h-9 px-4 bg-blue-600 text-white text-[12px] font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm no-underline"
        >
          <span className="text-lg leading-none">+</span> Асуулт нэмэх
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mt-5 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BCC0D4] text-[11px]">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); resetPage(); }}
            placeholder="Асуулт текстэр хайх..."
            className="w-full h-[32px] pl-8 pr-8 bg-white border border-[#E2E5EF] rounded-md text-[11.5px] focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-[#BCC0D4]"
          />
          {search && (
            <button onClick={() => { setSearch(''); resetPage(); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#BCC0D4] hover:text-gray-500 text-xs">✕</button>
          )}
        </div>

        {/* Type filter */}
        <select
          value={filterType}
          onChange={e => { setFilterType(e.target.value); resetPage(); }}
          className="h-[32px] px-3 bg-white border border-[#E2E5EF] rounded-md text-[11.5px] text-[#4A4F6A] focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="">Бүх төрөл</option>
          {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>

        {/* Level filter */}
        <select
          value={filterLevel}
          onChange={e => { setFilterLevel(e.target.value); resetPage(); }}
          className="h-[32px] px-3 bg-white border border-[#E2E5EF] rounded-md text-[11.5px] text-[#4A4F6A] focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="">Бүх түвшин</option>
          {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); resetPage(); }}
          className="h-[32px] px-3 bg-white border border-[#E2E5EF] rounded-md text-[11.5px] text-[#4A4F6A] focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="">Бүх статус</option>
          <option value="published">Нийтлэгдсэн</option>
          <option value="draft">Ноороглон</option>
        </select>

        {/* Clear filters */}
        {(filterType || filterLevel || filterStatus || search) && (
          <button
            onClick={() => { setSearch(''); setFilterType(''); setFilterLevel(''); setFilterStatus(''); resetPage(); }}
            className="h-[32px] px-3 bg-white border border-[#E2E5EF] rounded-md text-[11px] text-[#8A90AB] hover:bg-gray-50 transition-colors"
          >
            ✕ Арилгах
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E5EF] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-[11.5px]">
          <thead>
            <tr className="bg-[#F5F6FA] border-b border-[#E2E5EF]">
              <th className="px-4 py-3 w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-3.5 h-3.5 rounded border-gray-300 accent-blue-600 cursor-pointer"
                />
              </th>
              <th className="px-3 py-3 text-left text-[10px] font-bold text-[#8A90AB] uppercase tracking-wide w-10">#</th>
              <th className="px-3 py-3 text-left text-[10px] font-bold text-[#8A90AB] uppercase tracking-wide">Асуулт текст</th>
              <th className="px-3 py-3 text-left text-[10px] font-bold text-[#8A90AB] uppercase tracking-wide">Төрөл</th>
              <th className="px-3 py-3 text-left text-[10px] font-bold text-[#8A90AB] uppercase tracking-wide">Түвшин</th>
              <th className="px-3 py-3 text-left text-[10px] font-bold text-[#8A90AB] uppercase tracking-wide">Оноо</th>
              <th className="px-3 py-3 text-left text-[10px] font-bold text-[#8A90AB] uppercase tracking-wide">Статус</th>
              <th className="px-3 py-3 text-left text-[10px] font-bold text-[#8A90AB] uppercase tracking-wide">Огноо</th>
              <th className="px-3 py-3 text-left text-[10px] font-bold text-[#8A90AB] uppercase tracking-wide">Үйлдэл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F1F7]">
            {paginated.length > 0 ? (
              paginated.map((q, i) => {
                const typeName  = q.type_name  || types.find(t => t.id === q.type_id)?.name  || String(q.type_id  || '');
                const levelName = q.level_name || levels.find(l => l.id === q.level_id)?.name || String(q.level_id || '');
                const typeStyle  = getColor(TYPE_COLORS,  typeName);
                const levelStyle = getColor(LEVEL_COLORS, levelName);
                const rowNum = (page - 1) * ITEMS_PER_PAGE + i + 1;
                const isSelected = selected.includes(q.id);
                const dateStr = q.created_at ? new Date(q.created_at).toISOString().slice(0, 10) : '—';

                return (
                  <tr
                    key={q.id}
                    className={`hover:bg-[#FAFBFF] transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(q.id)}
                        className="w-3.5 h-3.5 rounded border-gray-300 accent-blue-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3 text-[#8A90AB] font-mono text-[10.5px]">
                      {String(rowNum).padStart(3, '0')}
                    </td>
                    <td className="px-3 py-3 max-w-[280px]">
                      <p className="font-semibold text-[#1A1D2E] line-clamp-1">{q.question}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: typeStyle.bg, color: typeStyle.text }}
                      >
                        {typeName || '—'}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: levelStyle.bg, color: levelStyle.text }}
                      >
                        {levelName || '—'}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-bold text-[#1A1D2E]">{q.point ?? '—'}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={q.status} />
                    </td>
                    <td className="px-3 py-3 text-[#8A90AB] whitespace-nowrap">{dateStr}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1.5">
                        <Link
                          to={`/team5/courses/${course_id}/questions/${q.id}`}
                          className="w-7 h-7 bg-[#F1F2F7] border border-[#E2E5EF] rounded-md flex items-center justify-center text-[11px] hover:bg-gray-200 transition-all"
                          title="Харах"
                        >👁️</Link>
                        <Link
                          to={`/team5/courses/${course_id}/questions/${q.id}/edit`}
                          className="w-7 h-7 bg-[#EEF2FE] border border-[#C7D4FC] rounded-md flex items-center justify-center text-[11px] hover:bg-blue-100 transition-all"
                          title="Засах"
                        >✏️</Link>
                        <button
                          onClick={() => setDeleteTarget(q)}
                          className="w-7 h-7 bg-[#FFE4E6] border border-[#FECDD3] rounded-md flex items-center justify-center text-[11px] hover:bg-red-100 transition-all"
                          title="Устгах"
                        >🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-16 text-center">
                  <div className="text-3xl mb-3">📋</div>
                  <div className="text-[12px] text-[#8A90AB]">
                    {search || filterType || filterLevel || filterStatus
                      ? 'Хайлтад тохирох асуулт олдсонгүй'
                      : 'Одоогоор асуулт бүртгэгдээгүй байна'}
                  </div>
                  {!search && !filterType && !filterLevel && !filterStatus && (
                    <Link
                      to={`/team5/courses/${course_id}/questions/create`}
                      className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white text-[11px] font-bold rounded-lg no-underline hover:bg-blue-700 transition-colors"
                    >
                      + Асуулт нэмэх
                    </Link>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer: count + pagination */}
        <div className="border-t border-[#E2E5EF] px-5 py-3 flex items-center justify-between bg-[#FAFBFF]">
          <span className="text-[11px] text-[#8A90AB]">
            {filtered.length} асуулт · {page}-{totalPages} хуудас харагдаж байна
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="w-7 h-7 flex items-center justify-center rounded-md text-[11px] text-[#4A4F6A] hover:bg-[#EEF0F8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >«</button>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 flex items-center justify-center rounded-md text-[11px] text-[#4A4F6A] hover:bg-[#EEF0F8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >‹</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === '...'
                    ? <span key={`e${idx}`} className="w-7 h-7 flex items-center justify-center text-[#8A90AB] text-[11px]">…</span>
                    : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-7 h-7 flex items-center justify-center rounded-md text-[11px] font-bold transition-colors ${
                          page === p ? 'bg-blue-600 text-white' : 'text-[#4A4F6A] hover:bg-[#EEF0F8]'
                        }`}
                      >{p}</button>
                    )
                )}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-md text-[11px] text-[#4A4F6A] hover:bg-[#EEF0F8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >›</button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-md text-[11px] text-[#4A4F6A] hover:bg-[#EEF0F8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >»</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

//added

export default QuestionList;