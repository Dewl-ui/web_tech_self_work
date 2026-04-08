import { useState } from "react";

// ─── Mini donut chart using SVG ───────────────────────────────────────────────
function DonutChart({ segments, total }) {
  const r = 38;
  const stroke = 16;
  const cx = 55;
  const cy = 55;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const slices = segments.map((seg) => {
    const dash = (seg.value / total) * circumference;
    const gap = circumference - dash;
    const slice = { ...seg, dash, gap, offset };
    offset += dash;
    return slice;
  });

  return (
    <svg width={110} height={110} viewBox="0 0 110 110">
      {/* track */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="#F1F2F7"
        strokeWidth={stroke}
      />
      {slices.map((s, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={stroke}
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeDashoffset={-s.offset + circumference * 0.25}
          style={{ transition: "stroke-dasharray 0.4s" }}
        />
      ))}
      <text
        x={cx} y={cy + 5}
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        fontWeight={700}
        fontSize={14}
        fill="#1A1D2E"
      >
        {total}
      </text>
    </svg>
  );
}

// ─── Bar chart ────────────────────────────────────────────────────────────────
function BarChart({ bars }) {
  const max = Math.max(...bars.map((b) => b.value));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 0, height: 130, padding: "0 15px 32px", flex: 1 }}>
      {bars.map((b, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, color: "#4A4F6A", marginBottom: 4 }}>
            {b.value}
          </span>
          <div
            style={{
              width: "60%",
              background: b.color,
              borderRadius: "4px 4px 0 0",
              height: `${(b.value / max) * 72}px`,
              minHeight: 6,
              transition: "height 0.4s",
            }}
          />
          <span style={{ marginTop: 8, fontSize: 9, color: "#8A90AB", textAlign: "center", fontFamily: "'Noto Sans',sans-serif" }}>
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
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

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, valueColor, icon }) {
  return (
    <div style={{
      flex: 1, background: "#fff", border: "1px solid #E2E5EF",
      borderRadius: 10, padding: "14px 16px", position: "relative", overflow: "hidden", minWidth: 0,
    }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, color: "#8A90AB", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 24, fontWeight: 800, color: valueColor || "#1A1D2E", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: "#8A90AB", marginTop: 6 }}>{sub}</div>
      <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 28, opacity: 0.07 }}>
        {icon}
      </div>
    </div>
  );
}

// ─── Badge pill ───────────────────────────────────────────────────────────────
function TypeBadge({ label, bg, color, border }) {
  return (
    <span style={{
      background: bg, color, border: border ? `1px solid ${border}` : "none",
      borderRadius: 4, padding: "2px 7px", fontSize: 9.5, fontWeight: 700,
      fontFamily: "'Noto Sans',sans-serif", whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const levelSegments = [
  { label: "Санах",      value: 35, color: "#FCA5A5" },
  { label: "Ойлгох",     value: 28, color: "#FDE68A" },
  { label: "Хэрэглэх",   value: 19, color: "#6EE7B7" },
  { label: "Шийдвэрлэх", value:  0, color: "#818CF8" },
];

const typeBarData = [
  { label: "Сонгох",      value: 31, color: "#BFDBFE" },
  { label: "Нөхөх",       value: 18, color: "#99F6E4" },
  { label: "Харгалзуулах",value: 15, color: "#FDE68A" },
  { label: "Бичих",       value: 12, color: "#DDD6FE" },
  { label: "Багц",        value:  6, color: "#FECDD3" },
];

const topQuestions = [
  {
    rank: 1,
    rankBg: "#FEF3C7", rankBorder: "#FDE68A", rankColor: "#D97706",
    id: "001",
    name: "Turing тестийн зорилго юу вэ?",
    type: { label: "Сонгох",  bg: "#EEF2FE", border: "#C7D4FC", color: "#3B6FF5" },
    level: { label: "Ойлгох", bg: "#FEF3C7", color: "#D97706" },
    usage: 12, pct: 72, pctColor: "#16A34A", score: 5,
  },
  {
    rank: 2,
    rankBg: "#F0F2F8", rankBorder: "#D0D4E8", rankColor: "#6B7280",
    id: "003",
    name: "Машины сурахын алгоритм...",
    type: { label: "Нөхөх",  bg: "#CCFBF1", color: "#0D9488" },
    level: { label: "Санах",  bg: "#FFE4E6", color: "#E11D48" },
    usage: 10, pct: 85, pctColor: "#16A34A", score: 3,
  },
  {
    rank: 3,
    rankBg: "#FFEDD5", rankBorder: "#FED7AA", rankColor: "#EA580C",
    id: "004",
    name: "Нейрон сүлжээний давуу тал...",
    type: { label: "Бичих",      bg: "#EDE9FE", color: "#7C3AED" },
    level: { label: "Шийдвэрлэх", bg: "#EDE9FE", color: "#7C3AED" },
    usage: 8, pct: 45, pctColor: "#D97706", score: 15,
  },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function ReportStatistics() {
  const [activeTab, setActiveTab] = useState("Ерөнхий");
  const tabs = ["Ерөнхий", "Оюутан", "Асуулт"];

  return (
    <div style={{ padding: "20px 22px", fontFamily: "'Noto Sans', sans-serif", minHeight: "100%" }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: "#1A1D2E", margin: 0, letterSpacing: -0.2 }}>
            Тайлан ба Статистик
          </h1>
          <p style={{ fontSize: 11.5, color: "#8A90AB", margin: "4px 0 0" }}>
            CS101 Мэдээлэл зүй · 2024–2025 хичээлийн жил
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: "flex", background: "#fff", border: "1px solid #E2E5EF",
          borderRadius: 6, padding: 4, gap: 2,
        }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: "5px 16px", borderRadius: 4, border: "none", cursor: "pointer",
              fontSize: 11, fontWeight: activeTab === t ? 700 : 400,
              background: activeTab === t ? "#3B6FF5" : "transparent",
              color: activeTab === t ? "#fff" : "#8A90AB",
              fontFamily: "'Noto Sans',sans-serif",
              transition: "all 0.15s",
            }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards row */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <StatCard label="Нийт Асуулт"    value="82"  sub="CS101"               valueColor="#1A1D2E" icon="📋" />
        <StatCard label="Нийтлэгдсэн"    value="74"  sub="90.2%"               valueColor="#16A34A" icon="✅" />
        <StatCard label="Ноороглосон"     value="8"   sub="9.8%"                valueColor="#D97706" icon="📝" />
        <StatCard label="Нийт ашиглалт"  value="247" sub="шалгалтад хэрэглэсэн" valueColor="#1A1D2E" icon="🎯" />
        <StatCard label="Дундаж зөв %"   value="68%" sub="бүх оюутнаар"         valueColor="#3B6FF5" icon="📊" />
      </div>

      {/* Charts row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        {/* Bar chart card */}
        <div style={{
          flex: 1, background: "#fff", border: "1px solid #E2E5EF",
          borderRadius: 10, overflow: "hidden", height: 200,
        }}>
          <div style={{
            height: 40, borderBottom: "1px solid #F0F2F8",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 16px",
          }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: "#1A1D2E" }}>
              📊 Асуулт — Төрлөөр
            </span>
            <span style={{ fontSize: 10, color: "#8A90AB" }}>Нийт 82</span>
          </div>
          <BarChart bars={typeBarData} />
        </div>

        {/* Donut chart card */}
        <div style={{
          flex: 1, background: "#fff", border: "1px solid #E2E5EF",
          borderRadius: 10, overflow: "hidden", height: 200,
        }}>
          <div style={{
            height: 40, borderBottom: "1px solid #F0F2F8",
            display: "flex", alignItems: "center", padding: "0 16px",
          }}>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: "#1A1D2E" }}>
              🎯 Асуулт — Түвшнээр
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", padding: "10px 15px", gap: 12, height: "calc(100% - 40px)" }}>
            <DonutChart segments={levelSegments} total={82} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Санах",      color: "#FCA5A5", count: 35 },
                { label: "Ойлгох",     color: "#FDE68A", count: 28 },
                { label: "Хэрэглэх",   color: "#6EE7B7", count: 19 },
                { label: "Шийдвэрлэх", color: "#818CF8", count:  0 },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, background: item.color, borderRadius: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "#4A4F6A", width: 80 }}>{item.label}</span>
                  <span style={{
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5,
                    fontWeight: 800, color: "#1A1D2E", minWidth: 20,
                  }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Most used questions table */}
      <div style={{
        background: "#fff", border: "1px solid #E2E5EF",
        borderRadius: 10, overflow: "hidden",
      }}>
        {/* Table header bar */}
        <div style={{
          height: 45, borderBottom: "1px solid #E2E5EF",
          display: "flex", alignItems: "center", padding: "0 16px",
        }}>
          <span style={{ fontSize: 12.5, fontWeight: 800, color: "#1A1D2E" }}>
            🔥 Хамгийн их ашиглагдсан асуулт
          </span>
        </div>

        {/* Column headers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "76px 62px 1fr 105px 105px 80px 120px 60px",
          background: "#F8F9FC",
          borderBottom: "1px solid #F0F2F8",
        }}>
          {["Rank", "#", "Асуулт", "Төрөл", "Түвшин", "Ашиглалт", "Зөв %", "Оноо"].map((h) => (
            <div key={h} style={{
              padding: "8px 12px", fontSize: 9.5, fontWeight: 800,
              color: "#8A90AB", letterSpacing: 0.5, textTransform: "uppercase",
            }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {topQuestions.map((q, i) => (
          <div key={q.id} style={{
            display: "grid",
            gridTemplateColumns: "76px 62px 1fr 105px 105px 80px 120px 60px",
            background: i % 2 !== 0 ? "#FAFBFD" : "#fff",
            borderBottom: i < topQuestions.length - 1 ? "1px solid #F5F6FA" : "none",
            alignItems: "center",
            height: 41,
          }}>
            {/* Rank badge */}
            <div style={{ padding: "0 12px" }}>
              <div style={{
                width: 22, height: 22, background: q.rankBg,
                border: `1px solid ${q.rankBorder}`, borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 800, color: q.rankColor,
              }}>
                {q.rank}
              </div>
            </div>

            {/* ID */}
            <div style={{
              padding: "0 12px", fontSize: 11, color: "#8A90AB",
              fontFamily: "'JetBrains Mono',monospace",
            }}>
              {q.id}
            </div>

            {/* Question name */}
            <div style={{ padding: "0 12px", fontSize: 11, fontWeight: 600, color: "#1A1D2E" }}>
              {q.name}
            </div>

            {/* Type */}
            <div style={{ padding: "0 12px" }}>
              <TypeBadge {...q.type} />
            </div>

            {/* Level */}
            <div style={{ padding: "0 12px" }}>
              <TypeBadge {...q.level} />
            </div>

            {/* Usage count */}
            <div style={{
              padding: "0 12px", fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12, fontWeight: 800, color: "#4A4F6A",
            }}>
              {q.usage}
            </div>

            {/* Progress bar */}
            <div style={{ padding: "0 12px" }}>
              <ProgressBar pct={q.pct} color={q.pctColor} />
            </div>

            {/* Score */}
            <div style={{
              padding: "0 12px", fontFamily: "'JetBrains Mono',monospace",
              fontSize: 11, color: "#8A90AB",
            }}>
              {q.score}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{
          borderTop: "1px solid #E2E5EF", height: 47,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 14px",
        }}>
          <span style={{ fontSize: 11, color: "#8A90AB" }}>Top 3 харуулж байна</span>
          <button style={{
            background: "#fff", border: "1px solid #E2E5EF", borderRadius: 6,
            padding: "5px 14px", fontSize: 10.5, fontWeight: 700, color: "#4A4F6A",
            cursor: "pointer", fontFamily: "'Noto Sans',sans-serif",
          }}>
            Бүгдийг харах →
          </button>
        </div>
      </div>
    </div>
  );
}