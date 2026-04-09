import { useState, useRef } from "react";

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ segments, total }) {
  const r = 38, stroke = 16, cx = 55, cy = 55;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const validTotal = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const slices = segments.map((seg) => {
    const dash = (seg.value / validTotal) * circumference;
    const slice = { ...seg, dash, gap: circumference - dash, offset };
    offset += dash;
    return slice;
  });
  return (
    <svg width={110} height={110} viewBox="0 0 110 110">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F2F7" strokeWidth={stroke} />
      {slices.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color}
          strokeWidth={stroke}
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeDashoffset={-s.offset + circumference * 0.25}
          style={{ transition: "stroke-dasharray 0.4s" }}
        />
      ))}
      <text x={cx} y={cy + 5} textAnchor="middle"
        fontFamily="'JetBrains Mono',monospace" fontWeight={700} fontSize={14} fill="#1A1D2E">
        {total}
      </text>
    </svg>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ bars, onBarClick, activeBar }) {
  const max = Math.max(...bars.map((b) => b.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: 130, padding: "0 15px 32px", flex: 1 }}>
      {bars.map((b, i) => (
        <div key={i} onClick={() => onBarClick(b.label)}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", cursor: "pointer" }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, color: "#4A4F6A", marginBottom: 4 }}>
            {b.value}
          </span>
          <div style={{
            width: "60%", background: b.color, borderRadius: "4px 4px 0 0",
            height: `${(b.value / max) * 72}px`, minHeight: 6, transition: "height 0.4s, opacity 0.2s",
            opacity: activeBar && activeBar !== b.label ? 0.4 : 1,
            outline: activeBar === b.label ? `2px solid ${b.color}` : "none",
          }} />
          <span style={{ marginTop: 8, fontSize: 9, color: activeBar === b.label ? "#1A1D2E" : "#8A90AB", textAlign: "center", fontFamily: "'Noto Sans',sans-serif", fontWeight: activeBar === b.label ? 700 : 400 }}>
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ pct, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 60, height: 5, background: "#EEF0F8", borderRadius: 3, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color }}>{pct}%</span>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, valueColor, icon }) {
  return (
    <div style={{ flex: 1, background: "#fff", border: "1px solid #E2E5EF", borderRadius: 10, padding: "14px 16px", position: "relative", overflow: "hidden", minWidth: 0 }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, color: "#8A90AB", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 800, color: valueColor || "#1A1D2E", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: "#8A90AB", marginTop: 6 }}>{sub}</div>
      <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 28, opacity: 0.07 }}>{icon}</div>
    </div>
  );
}

// ─── Type Badge ───────────────────────────────────────────────────────────────
function TypeBadge({ label, bg, color, border }) {
  return (
    <span style={{ background: bg, color, border: border ? `1px solid ${border}` : "none", borderRadius: 4, padding: "2px 7px", fontSize: 9.5, fontWeight: 700, fontFamily: "'Noto Sans',sans-serif", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 12, minWidth: 380, maxWidth: 540, padding: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.18)", position: "relative" }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#1A1D2E", fontFamily: "'Noto Sans',sans-serif" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#8A90AB", lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, onDone }) {
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, background: "#1A1D2E", color: "#fff", borderRadius: 8, padding: "10px 20px", fontSize: 12, fontFamily: "'Noto Sans',sans-serif", zIndex: 2000, boxShadow: "0 4px 20px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: 10 }}>
      <span>✅</span> {message}
      <button onClick={onDone} style={{ background: "none", border: "none", color: "#8A90AB", cursor: "pointer", fontSize: 14 }}>×</button>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const ALL_QUESTIONS = [
  { rank: 1, rankBg: "#FEF3C7", rankBorder: "#FDE68A", rankColor: "#D97706", id: "001", name: "Turing тестийн зорилго юу вэ?", type: { label: "Сонгох", bg: "#EEF2FE", border: "#C7D4FC", color: "#3B6FF5" }, level: { label: "Ойлгох", bg: "#FEF3C7", color: "#D97706" }, usage: 12, pct: 72, pctColor: "#16A34A", score: 5 },
  { rank: 2, rankBg: "#F0F2F8", rankBorder: "#D0D4E8", rankColor: "#6B7280", id: "003", name: "Машины сурахын алгоритм...", type: { label: "Нөхөх", bg: "#CCFBF1", color: "#0D9488" }, level: { label: "Санах", bg: "#FFE4E6", color: "#E11D48" }, usage: 10, pct: 85, pctColor: "#16A34A", score: 3 },
  { rank: 3, rankBg: "#FFEDD5", rankBorder: "#FED7AA", rankColor: "#EA580C", id: "004", name: "Нейрон сүлжээний давуу тал...", type: { label: "Бичих", bg: "#EDE9FE", color: "#7C3AED" }, level: { label: "Шийдвэрлэх", bg: "#EDE9FE", color: "#7C3AED" }, usage: 8, pct: 45, pctColor: "#D97706", score: 15 },
  { rank: 4, rankBg: "#F0F2F8", rankBorder: "#D0D4E8", rankColor: "#6B7280", id: "005", name: "Хиймэл оюун ухааны түүх...", type: { label: "Сонгох", bg: "#EEF2FE", border: "#C7D4FC", color: "#3B6FF5" }, level: { label: "Санах", bg: "#FFE4E6", color: "#E11D48" }, usage: 7, pct: 60, pctColor: "#16A34A", score: 5 },
  { rank: 5, rankBg: "#F0F2F8", rankBorder: "#D0D4E8", rankColor: "#6B7280", id: "007", name: "Рекурс функцийн тодорхойлолт...", type: { label: "Харгалзуулах", bg: "#FEF9C3", color: "#854D0E" }, level: { label: "Ойлгох", bg: "#FEF3C7", color: "#D97706" }, usage: 6, pct: 55, pctColor: "#D97706", score: 8 },
];

const levelSegments = [
  { label: "Санах", value: 35, color: "#FCA5A5" },
  { label: "Ойлгох", value: 28, color: "#FDE68A" },
  { label: "Хэрэглэх", value: 19, color: "#6EE7B7" },
  { label: "Шийдвэрлэх", value: 0, color: "#818CF8" },
];

const typeBarData = [
  { label: "Сонгох", value: 31, color: "#BFDBFE" },
  { label: "Нөхөх", value: 18, color: "#99F6E4" },
  { label: "Харгалзуулах", value: 15, color: "#FDE68A" },
  { label: "Бичих", value: 12, color: "#DDD6FE" },
  { label: "Багц", value: 6, color: "#FECDD3" },
];

const STUDENT_DATA = [
  { name: "Болд Б.", score: 92, answered: 78, correct: 72, pct: 92 },
  { name: "Мөнх-Эрдэнэ Г.", score: 85, answered: 80, correct: 68, pct: 85 },
  { name: "Солонго Д.", score: 74, answered: 75, correct: 56, pct: 74 },
  { name: "Анхбаяр Т.", score: 61, answered: 70, correct: 43, pct: 61 },
  { name: "Энхжаргал Н.", score: 45, answered: 60, correct: 27, pct: 45 },
];

const PAGE_SIZE = 3;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function QuestionReport() {
  const [activeTab, setActiveTab] = useState("Ерөнхий");
  const [activeBar, setActiveBar] = useState(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // "export" | "print" | "question" | "filter"
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [toast, setToast] = useState(null);
  const [courseFilter, setCourseFilter] = useState("CS101");
  const [exportFormat, setExportFormat] = useState("xlsx");
  const [filterType, setFilterType] = useState("Бүгд");
  const [filterLevel, setFilterLevel] = useState("Бүгд");
  const printRef = useRef();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleBarClick = (label) => setActiveBar(activeBar === label ? null : label);

  // Filter & paginate questions
  const filtered = ALL_QUESTIONS.filter((q) => {
    const typeMatch = filterType === "Бүгд" || q.type.label === filterType;
    const levelMatch = filterLevel === "Бүгд" || q.level.label === filterLevel;
    return typeMatch && levelMatch;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visibleQuestions = showAllQuestions ? filtered : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExport = () => {
    showToast(`${exportFormat.toUpperCase()} файл татагдаж байна...`);
    setModal(null);
  };

  const handlePrint = () => {
    setModal(null);
    setTimeout(() => window.print(), 200);
  };

  const tabs = ["Ерөнхий", "Оюутан", "Асуулт"];
  const typeOptions = ["Бүгд", "Сонгох", "Нөхөх", "Бичих", "Харгалзуулах", "Багц"];
  const levelOptions = ["Бүгд", "Санах", "Ойлгох", "Хэрэглэх", "Шийдвэрлэх"];

  return (
    <div ref={printRef} style={{ padding: "20px 22px", fontFamily: "'Noto Sans', sans-serif", minHeight: "100%" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: "#1A1D2E", margin: 0, letterSpacing: -0.2 }}>
            Тайлан ба Статистик
          </h1>
          <p style={{ fontSize: 11.5, color: "#8A90AB", margin: "4px 0 0" }}>
            CS101 Мэдээлэл зүй · 2024–2025 хичээлийн жил
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Tab switcher */}
          <div style={{ display: "flex", background: "#fff", border: "1px solid #E2E5EF", borderRadius: 6, padding: 4, gap: 2 }}>
            {tabs.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                padding: "5px 16px", borderRadius: 4, border: "none", cursor: "pointer",
                fontSize: 11, fontWeight: activeTab === t ? 700 : 400,
                background: activeTab === t ? "#3B6FF5" : "transparent",
                color: activeTab === t ? "#fff" : "#8A90AB",
                fontFamily: "'Noto Sans',sans-serif", transition: "all 0.15s",
              }}>{t}</button>
            ))}
          </div>
          {/* Course filter dropdown */}
          <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} style={{
            border: "1px solid #E2E5EF", borderRadius: 6, padding: "5px 10px",
            fontSize: 10, color: "#4A4F6A", background: "#fff", cursor: "pointer", outline: "none",
            fontFamily: "'Noto Sans',sans-serif",
          }}>
            <option>CS101</option>
            <option>CS102</option>
            <option>MATH201</option>
          </select>
          {/* Print button */}
          <button onClick={() => setModal("print")} style={{
            background: "#fff", border: "1px solid #E2E5EF", borderRadius: 6, padding: "6px 14px",
            fontSize: 10.5, fontWeight: 700, color: "#4A4F6A", cursor: "pointer", fontFamily: "'Noto Sans',sans-serif",
          }}>🖨️ Хэвлэх</button>
          {/* Export button */}
          <button onClick={() => setModal("export")} style={{
            background: "#3B6FF5", border: "none", borderRadius: 6, padding: "6px 14px",
            fontSize: 10.5, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "'Noto Sans',sans-serif",
          }}>📤 Экспорт</button>
        </div>
      </div>

      {/* ── ЕРӨНХИЙ TAB ── */}
      {activeTab === "Ерөнхий" && (
        <>
          {/* Stat cards */}
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <StatCard label="Нийт Асуулт" value="82" sub="CS101" valueColor="#1A1D2E" icon="📋" />
            <StatCard label="Нийтлэгдсэн" value="74" sub="90.2%" valueColor="#16A34A" icon="✅" />
            <StatCard label="Ноороглосон" value="8" sub="9.8%" valueColor="#D97706" icon="📝" />
            <StatCard label="Нийт ашиглалт" value="247" sub="шалгалтад хэрэглэсэн" valueColor="#1A1D2E" icon="🎯" />
            <StatCard label="Дундаж зөв %" value="68%" sub="бүх оюутнаар" valueColor="#3B6FF5" icon="📊" />
          </div>

          {/* Charts row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            {/* Bar chart */}
            <div style={{ flex: 1, background: "#fff", border: "1px solid #E2E5EF", borderRadius: 10, overflow: "hidden", height: 200 }}>
              <div style={{ height: 40, borderBottom: "1px solid #F0F2F8", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: "#1A1D2E" }}>📊 Асуулт — Төрлөөр</span>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {activeBar && (
                    <button onClick={() => setActiveBar(null)} style={{ fontSize: 9, color: "#3B6FF5", background: "#EEF2FE", border: "none", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontFamily: "'Noto Sans',sans-serif" }}>
                      Цэвэрлэх ×
                    </button>
                  )}
                  <span style={{ fontSize: 10, color: "#8A90AB" }}>Нийт 82</span>
                </div>
              </div>
              <BarChart bars={typeBarData} onBarClick={handleBarClick} activeBar={activeBar} />
            </div>

            {/* Donut chart */}
            <div style={{ flex: 1, background: "#fff", border: "1px solid #E2E5EF", borderRadius: 10, overflow: "hidden", height: 200 }}>
              <div style={{ height: 40, borderBottom: "1px solid #F0F2F8", display: "flex", alignItems: "center", padding: "0 16px" }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: "#1A1D2E" }}>🎯 Асуулт — Түвшнээр</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", padding: "10px 15px", gap: 12, height: "calc(100% - 40px)" }}>
                <DonutChart segments={levelSegments} total={82} />
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Санах", color: "#FCA5A5", count: 35 },
                    { label: "Ойлгох", color: "#FDE68A", count: 28 },
                    { label: "Хэрэглэх", color: "#6EE7B7", count: 19 },
                    { label: "Шийдвэрлэх", color: "#818CF8", count: 0 },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, background: item.color, borderRadius: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: "#4A4F6A", width: 80 }}>{item.label}</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, fontWeight: 800, color: "#1A1D2E", minWidth: 20 }}>{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Most used questions table */}
          <div style={{ background: "#fff", border: "1px solid #E2E5EF", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: 45, borderBottom: "1px solid #E2E5EF", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: "#1A1D2E" }}>🔥 Хамгийн их ашиглагдсан асуулт</span>
              <button onClick={() => setModal("filter")} style={{ background: "#F0F2F8", border: "1px solid #E2E5EF", borderRadius: 6, padding: "4px 12px", fontSize: 10, cursor: "pointer", color: "#4A4F6A", fontFamily: "'Noto Sans',sans-serif" }}>
                ⚙️ Шүүлт
              </button>
            </div>

            {/* Col headers */}
            <div style={{ display: "grid", gridTemplateColumns: "76px 62px 1fr 110px 120px 80px 130px 60px", background: "#F8F9FC", borderBottom: "1px solid #F0F2F8" }}>
              {["Rank", "#", "Асуулт", "Төрөл", "Түвшин", "Ашиглалт", "Зөв %", "Оноо"].map((h) => (
                <div key={h} style={{ padding: "8px 12px", fontSize: 9.5, fontWeight: 800, color: "#8A90AB", letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</div>
              ))}
            </div>

            {/* Rows */}
            {visibleQuestions.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "#BCC0D4", fontSize: 13 }}>Шүүлтэд тохирох асуулт олдсонгүй</div>
            ) : visibleQuestions.map((q, i) => (
              <div key={q.id}
                onClick={() => { setSelectedQuestion(q); setModal("question"); }}
                style={{ display: "grid", gridTemplateColumns: "76px 62px 1fr 110px 120px 80px 130px 60px", background: i % 2 !== 0 ? "#FAFBFD" : "#fff", borderBottom: i < visibleQuestions.length - 1 ? "1px solid #F5F6FA" : "none", alignItems: "center", height: 41, cursor: "pointer", transition: "background 0.12s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#F0F4FF"}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 !== 0 ? "#FAFBFD" : "#fff"}
              >
                <div style={{ padding: "0 12px" }}>
                  <div style={{ width: 22, height: 22, background: q.rankBg, border: `1px solid ${q.rankBorder}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: q.rankColor }}>{q.rank}</div>
                </div>
                <div style={{ padding: "0 12px", fontSize: 11, color: "#8A90AB", fontFamily: "'JetBrains Mono',monospace" }}>{q.id}</div>
                <div style={{ padding: "0 12px", fontSize: 11, fontWeight: 600, color: "#1A1D2E" }}>{q.name}</div>
                <div style={{ padding: "0 12px" }}><TypeBadge {...q.type} /></div>
                <div style={{ padding: "0 12px" }}><TypeBadge {...q.level} /></div>
                <div style={{ padding: "0 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: "#4A4F6A" }}>{q.usage}</div>
                <div style={{ padding: "0 12px" }}><ProgressBar pct={q.pct} color={q.pctColor} /></div>
                <div style={{ padding: "0 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#8A90AB" }}>{q.score}</div>
              </div>
            ))}

            {/* Footer */}
            <div style={{ borderTop: "1px solid #E2E5EF", height: 47, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px" }}>
              <span style={{ fontSize: 11, color: "#8A90AB" }}>
                {showAllQuestions ? `Нийт ${filtered.length}` : `Top ${Math.min(PAGE_SIZE, filtered.length)} харуулж байна`}
              </span>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {!showAllQuestions && totalPages > 1 && (
                  <div style={{ display: "flex", gap: 3 }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      style={{ width: 26, height: 26, border: "1px solid #E2E5EF", borderRadius: 5, background: "#fff", cursor: page === 1 ? "default" : "pointer", color: "#8A90AB", fontSize: 11 }}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)}
                        style={{ width: 26, height: 26, border: `1px solid ${page === i + 1 ? "#3B6FF5" : "#E2E5EF"}`, borderRadius: 5, background: page === i + 1 ? "#3B6FF5" : "#fff", color: page === i + 1 ? "#fff" : "#4A4F6A", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>{i + 1}</button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      style={{ width: 26, height: 26, border: "1px solid #E2E5EF", borderRadius: 5, background: "#fff", cursor: page === totalPages ? "default" : "pointer", color: "#8A90AB", fontSize: 11 }}>›</button>
                  </div>
                )}
                <button onClick={() => { setShowAllQuestions(!showAllQuestions); setPage(1); }} style={{
                  background: "#fff", border: "1px solid #E2E5EF", borderRadius: 6, padding: "5px 14px",
                  fontSize: 10.5, fontWeight: 700, color: "#4A4F6A", cursor: "pointer", fontFamily: "'Noto Sans',sans-serif",
                }}>
                  {showAllQuestions ? "← Хураах" : "Бүгдийг харах →"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── ОЮУТАН TAB ── */}
      {activeTab === "Оюутан" && (
        <div style={{ background: "#fff", border: "1px solid #E2E5EF", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ height: 45, borderBottom: "1px solid #E2E5EF", display: "flex", alignItems: "center", padding: "0 16px" }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: "#1A1D2E" }}>👨‍🎓 Оюутны үр дүн</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 130px", background: "#F8F9FC", borderBottom: "1px solid #F0F2F8" }}>
            {["Оюутан", "Оноо", "Хариулсан", "Зөв", "Зөв %"].map((h) => (
              <div key={h} style={{ padding: "8px 12px", fontSize: 9.5, fontWeight: 800, color: "#8A90AB", letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
          {STUDENT_DATA.map((s, i) => (
            <div key={s.name} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 130px", background: i % 2 !== 0 ? "#FAFBFD" : "#fff", borderBottom: i < STUDENT_DATA.length - 1 ? "1px solid #F5F6FA" : "none", alignItems: "center", height: 41 }}>
              <div style={{ padding: "0 12px", fontSize: 11, fontWeight: 600, color: "#1A1D2E" }}>{s.name}</div>
              <div style={{ padding: "0 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: s.score >= 80 ? "#16A34A" : s.score >= 60 ? "#D97706" : "#E11D48" }}>{s.score}</div>
              <div style={{ padding: "0 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#4A4F6A" }}>{s.answered}</div>
              <div style={{ padding: "0 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#4A4F6A" }}>{s.correct}</div>
              <div style={{ padding: "0 12px" }}><ProgressBar pct={s.pct} color={s.pct >= 80 ? "#16A34A" : s.pct >= 60 ? "#D97706" : "#E11D48"} /></div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #E2E5EF", height: 47, display: "flex", alignItems: "center", padding: "0 14px" }}>
            <span style={{ fontSize: 11, color: "#8A90AB" }}>Нийт {STUDENT_DATA.length} оюутан</span>
          </div>
        </div>
      )}

      {/* ── АСУУЛТ TAB ── */}
      {activeTab === "Асуулт" && (
        <div style={{ background: "#fff", border: "1px solid #E2E5EF", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ height: 45, borderBottom: "1px solid #E2E5EF", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: "#1A1D2E" }}>📋 Бүх асуулт</span>
            <div style={{ display: "flex", gap: 6 }}>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ border: "1px solid #E2E5EF", borderRadius: 6, padding: "4px 8px", fontSize: 10, color: "#4A4F6A", background: "#fff", cursor: "pointer", outline: "none", fontFamily: "'Noto Sans',sans-serif" }}>
                {typeOptions.map(o => <option key={o}>{o}</option>)}
              </select>
              <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ border: "1px solid #E2E5EF", borderRadius: 6, padding: "4px 8px", fontSize: 10, color: "#4A4F6A", background: "#fff", cursor: "pointer", outline: "none", fontFamily: "'Noto Sans',sans-serif" }}>
                {levelOptions.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "62px 1fr 110px 120px 80px 130px 60px", background: "#F8F9FC", borderBottom: "1px solid #F0F2F8" }}>
            {["#", "Асуулт", "Төрөл", "Түвшин", "Ашиглалт", "Зөв %", "Оноо"].map((h) => (
              <div key={h} style={{ padding: "8px 12px", fontSize: 9.5, fontWeight: 800, color: "#8A90AB", letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "#BCC0D4", fontSize: 13 }}>Шүүлтэд тохирох асуулт олдсонгүй</div>
          ) : filtered.map((q, i) => (
            <div key={q.id}
              onClick={() => { setSelectedQuestion(q); setModal("question"); }}
              style={{ display: "grid", gridTemplateColumns: "62px 1fr 110px 120px 80px 130px 60px", background: i % 2 !== 0 ? "#FAFBFD" : "#fff", borderBottom: i < filtered.length - 1 ? "1px solid #F5F6FA" : "none", alignItems: "center", height: 41, cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "#F0F4FF"}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 !== 0 ? "#FAFBFD" : "#fff"}
            >
              <div style={{ padding: "0 12px", fontSize: 11, color: "#8A90AB", fontFamily: "'JetBrains Mono',monospace" }}>{q.id}</div>
              <div style={{ padding: "0 12px", fontSize: 11, fontWeight: 600, color: "#1A1D2E" }}>{q.name}</div>
              <div style={{ padding: "0 12px" }}><TypeBadge {...q.type} /></div>
              <div style={{ padding: "0 12px" }}><TypeBadge {...q.level} /></div>
              <div style={{ padding: "0 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: "#4A4F6A" }}>{q.usage}</div>
              <div style={{ padding: "0 12px" }}><ProgressBar pct={q.pct} color={q.pctColor} /></div>
              <div style={{ padding: "0 12px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#8A90AB" }}>{q.score}</div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #E2E5EF", height: 47, display: "flex", alignItems: "center", padding: "0 14px" }}>
            <span style={{ fontSize: 11, color: "#8A90AB" }}>Нийт {filtered.length} асуулт</span>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}

      {/* Export modal */}
      {modal === "export" && (
        <Modal title="📤 Тайлан экспортлох" onClose={() => setModal(null)}>
          <p style={{ fontSize: 11.5, color: "#8A90AB", marginBottom: 16, fontFamily: "'Noto Sans',sans-serif" }}>Тайланг доорх форматаар татаж авна уу.</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {["xlsx", "csv", "pdf"].map((f) => (
              <button key={f} onClick={() => setExportFormat(f)} style={{
                flex: 1, padding: "8px 0", borderRadius: 6, border: `1px solid ${exportFormat === f ? "#3B6FF5" : "#E2E5EF"}`,
                background: exportFormat === f ? "#EEF2FE" : "#fff", color: exportFormat === f ? "#3B6FF5" : "#4A4F6A",
                fontWeight: exportFormat === f ? 700 : 400, fontSize: 11, cursor: "pointer", fontFamily: "'Noto Sans',sans-serif",
              }}>.{f.toUpperCase()}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setModal(null)} style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #E2E5EF", background: "#fff", color: "#4A4F6A", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans',sans-serif" }}>Болих</button>
            <button onClick={handleExport} style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "none", background: "#3B6FF5", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans',sans-serif" }}>Татах</button>
          </div>
        </Modal>
      )}

      {/* Print modal */}
      {modal === "print" && (
        <Modal title="🖨️ Хэвлэх тохиргоо" onClose={() => setModal(null)}>
          <p style={{ fontSize: 11.5, color: "#8A90AB", marginBottom: 20, fontFamily: "'Noto Sans',sans-serif" }}>Тайланг хэвлэхийн тулд системийн хэвлэлтийн цонх нээгдэнэ.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setModal(null)} style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #E2E5EF", background: "#fff", color: "#4A4F6A", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans',sans-serif" }}>Болих</button>
            <button onClick={handlePrint} style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "none", background: "#3B6FF5", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans',sans-serif" }}>Хэвлэх</button>
          </div>
        </Modal>
      )}

      {/* Filter modal */}
      {modal === "filter" && (
        <Modal title="⚙️ Шүүлт тохируулах" onClose={() => setModal(null)}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: "#8A90AB", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6, fontFamily: "'Noto Sans',sans-serif" }}>Төрөл</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {typeOptions.map(o => (
                <button key={o} onClick={() => setFilterType(o)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${filterType === o ? "#3B6FF5" : "#E2E5EF"}`, background: filterType === o ? "#EEF2FE" : "#fff", color: filterType === o ? "#3B6FF5" : "#4A4F6A", fontSize: 11, fontWeight: filterType === o ? 700 : 400, cursor: "pointer", fontFamily: "'Noto Sans',sans-serif" }}>{o}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: "#8A90AB", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6, fontFamily: "'Noto Sans',sans-serif" }}>Түвшин</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {levelOptions.map(o => (
                <button key={o} onClick={() => setFilterLevel(o)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${filterLevel === o ? "#3B6FF5" : "#E2E5EF"}`, background: filterLevel === o ? "#EEF2FE" : "#fff", color: filterLevel === o ? "#3B6FF5" : "#4A4F6A", fontSize: 11, fontWeight: filterLevel === o ? 700 : 400, cursor: "pointer", fontFamily: "'Noto Sans',sans-serif" }}>{o}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setFilterType("Бүгд"); setFilterLevel("Бүгд"); }} style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #E2E5EF", background: "#fff", color: "#4A4F6A", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans',sans-serif" }}>Цэвэрлэх</button>
            <button onClick={() => { setModal(null); showToast("Шүүлт хэрэглэгдлээ"); }} style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "none", background: "#3B6FF5", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans',sans-serif" }}>Хэрэглэх</button>
          </div>
        </Modal>
      )}

      {/* Question detail modal */}
      {modal === "question" && selectedQuestion && (
        <Modal title={`📋 Асуулт #${selectedQuestion.id}`} onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: "'Noto Sans',sans-serif" }}>
            <div style={{ background: "#F8F9FC", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#8A90AB", marginBottom: 6 }}>Асуулт</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1D2E" }}>{selectedQuestion.name}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Төрөл", value: <TypeBadge {...selectedQuestion.type} /> },
                { label: "Түвшин", value: <TypeBadge {...selectedQuestion.level} /> },
                { label: "Ашиглалт", value: <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, color: "#4A4F6A" }}>{selectedQuestion.usage}×</span> },
                { label: "Оноо", value: <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, color: "#4A4F6A" }}>{selectedQuestion.score}</span> },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "#F8F9FC", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#8A90AB", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
                  {value}
                </div>
              ))}
            </div>
            <div style={{ background: "#F8F9FC", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#8A90AB", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Зөв хариулт %</div>
              <ProgressBar pct={selectedQuestion.pct} color={selectedQuestion.pctColor} />
            </div>
            <button onClick={() => setModal(null)} style={{ padding: "9px 0", borderRadius: 6, border: "none", background: "#3B6FF5", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Хаах</button>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}