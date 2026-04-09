import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE = "https://todu.mn/bs/lms/v1";

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

const TYPE_COLORS = ["#BFDBFE", "#99F6E4", "#FDE68A", "#DDD6FE", "#FECDD3"];
const TYPE_LABELS = ["Сонгох", "Нөхөх", "Харгалзуулах", "Бичих", "Багц"];

const LEVEL_COLORS = ["#FCA5A5", "#FDE68A", "#6EE7B7"];
const LEVEL_LABELS = ["Санах", "Ойлгох", "Шийдвэрлэх"];

export default function Home() {
  const navigate = useNavigate();
  const courseId = localStorage.getItem("current_course_id") || 1;

  const [stats, setStats] = useState({
    total: 82,
    published: 74,
    types: 5,
    totalPoints: 540,
  });
  const [typeData, setTypeData] = useState([31, 18, 15, 12, 6]);
  const [levelData, setLevelData] = useState([35, 28, 19]);
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [courseName, setCourseName] = useState("Мэдээлэл зүй");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch(`/courses/${courseId}/questions?limit=100`),
      apiFetch(`/courses/${courseId}`),
    ])
      .then(([questions, course]) => {
        setCourseName(course.name || "Мэдээлэл зүй");

        const total = questions.length || 82;
        const published = questions.filter((q) => q.published).length || 74;

        // Count by type
        const typeCounts = [0, 0, 0, 0, 0];
        questions.forEach((q) => {
          if (q.type_id >= 1 && q.type_id <= 5) typeCounts[q.type_id - 1]++;
        });
        if (typeCounts.some((c) => c > 0)) setTypeData(typeCounts);

        // Count by level
        const levelCounts = [0, 0, 0];
        questions.forEach((q) => {
          if (q.level_id >= 1 && q.level_id <= 3) levelCounts[q.level_id - 1]++;
        });
        if (levelCounts.some((c) => c > 0)) setLevelData(levelCounts);

        const totalPoints = questions.reduce((s, q) => s + (q.point || 0), 0);
        setStats({ total, published, types: 5, totalPoints });

        // Recent 3
        setRecentQuestions(questions.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId]);

  const maxType = Math.max(...typeData, 1);
  const totalLevel = levelData.reduce((a, b) => a + b, 0) || 1;

  // Donut chart segments
  const r = 39;
  const cx = 55;
  const cy = 55;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = levelData.map((val, i) => {
    const pct = val / totalLevel;
    const dash = pct * circumference;
    const seg = { color: LEVEL_COLORS[i], dash, gap: circumference - dash, offset };
    offset += dash;
    return seg;
  });

  const RECENT_COLORS = ["#16A34A", "#3B6FF5", "#D97706"];
  const RECENT_TYPE_LABELS = ["📝 Бичих", "☑️ Сонгох", "✍️ Нөхөх"];
  const RECENT_TYPE_BG = ["#EDE9FE", "#EEF2FE", "#CCFBF1"];
  const RECENT_TYPE_COLOR = ["#7C3AED", "#3B6FF5", "#0D9488"];

  const fallbackRecent = [
    { date: "2025-01-22 14:30", question: "Нейрон сүлжээний давуу тал...", typeIdx: 0 },
    { date: "2025-01-21 09:15", question: "Turing тестийн зорилго", typeIdx: 1 },
    { date: "2025-01-20 16:45", question: "Машины сурах алгоритм", typeIdx: 2 },
  ];

  const displayRecent =
    recentQuestions.length > 0
      ? recentQuestions.map((q, i) => ({
          date: q.created_at
            ? new Date(q.created_at).toLocaleString("mn-MN")
            : fallbackRecent[i]?.date || "",
          question:
            q.question?.length > 30 ? q.question.slice(0, 30) + "..." : q.question || "",
          typeIdx: Math.min(i, 2),
        }))
      : fallbackRecent;

  return (
    <div style={{ background: "#F5F6FA", minHeight: "100%" }}>
      {/* Top bar */}
      <div
        style={{
          background: "#fff",
          height: 52,
          display: "flex",
          alignItems: "center",
          paddingLeft: 22,
          borderBottom: "1px solid #E2E5EF",
          justifyContent: "space-between",
          paddingRight: 22,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#8A90AB", opacity: 0.5, fontSize: 11.5 }}>›</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: "#1A1D2E" }}>
            Хяналтын самбар
          </span>
          <span
            style={{
              marginLeft: 8,
              background: "#F0F2F8",
              border: "1px solid #E2E5EF",
              borderRadius: 4,
              padding: "2px 6px",
              fontFamily: "monospace",
              fontSize: 9.5,
              color: "#3B6FF5",
            }}
          >
            /
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["🔔", "⚙️"].map((icon, i) => (
            <div
              key={i}
              style={{
                width: 30,
                height: 30,
                background: "#F0F2F8",
                border: "1px solid #E2E5EF",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>

      {/* Page content */}
      <div style={{ padding: "20px 22px", background: "#F5F6FA" }}>
        {/* Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#1A1D2E",
                letterSpacing: -0.2,
              }}
            >
              Хяналтын самбар
            </div>
            <div style={{ fontSize: 11.5, color: "#8A90AB", marginTop: 4 }}>
              CS{courseId} {courseName} • 2024–2025
            </div>
          </div>
          <button
            onClick={() => navigate(`/courses/${courseId}/questions/create`)}
            style={{
              background: "#3B6FF5",
              border: "none",
              borderRadius: 6,
              padding: "0 16px",
              height: 25,
              fontSize: 10.5,
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ＋ Асуулт нэмэх
          </button>
        </div>

        {/* 4 stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {[
            {
              label: "НИЙТ АСУУЛТ",
              value: stats.total,
              sub: "+12 энэ сар",
              color: "#1A1D2E",
              bar: "#3B6FF5",
              barPct: 82,
            },
            {
              label: "НИЙТЛЭГДСЭН",
              value: stats.published,
              sub: "90.2%",
              color: "#16A34A",
              bar: "#16A34A",
              barPct: 90,
            },
            {
              label: "АСУУЛТ ТӨРӨЛ",
              value: stats.types,
              sub: "бүгд идэвхтэй",
              color: "#1A1D2E",
              bar: null,
            },
            {
              label: "НИЙТ ОНОО",
              value: stats.totalPoints,
              sub: `дундаж ${(stats.totalPoints / (stats.total || 1)).toFixed(1)}/асуулт`,
              color: "#1A1D2E",
              bar: null,
            },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid #E2E5EF",
                borderRadius: 10,
                padding: "15px 17px",
              }}
            >
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: "#8A90AB",
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 24,
                  fontWeight: 800,
                  color: card.color,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {card.value}
              </div>
              <div style={{ fontSize: 10, color: "#8A90AB", marginBottom: card.bar ? 8 : 0 }}>
                {card.sub}
              </div>
              {card.bar && (
                <div
                  style={{
                    height: 3,
                    background: "#E2E5EF",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${card.barPct}%`,
                      background: card.bar,
                      borderRadius: 2,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {/* Bar chart — by type */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #E2E5EF",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                height: 42,
                borderBottom: "1px solid #E2E5EF",
                display: "flex",
                alignItems: "center",
                paddingLeft: 16,
              }}
            >
              <span style={{ fontSize: 12.5, fontWeight: 800, color: "#1A1D2E" }}>
                Асуулт — Төрлөөр
              </span>
            </div>
            <div
              style={{
                padding: "16px 17px",
                display: "flex",
                alignItems: "flex-end",
                gap: 0,
                height: 160,
                boxSizing: "border-box",
              }}
            >
              {typeData.map((val, i) => {
                const barH = Math.max(4, (val / maxType) * 100);
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 4,
                      height: "100%",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#4A4F6A",
                      }}
                    >
                      {val}
                    </span>
                    <div
                      style={{
                        width: "60%",
                        height: `${barH}%`,
                        background: TYPE_COLORS[i],
                        borderRadius: "4px 4px 0 0",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 9,
                        color: "#8A90AB",
                        textAlign: "center",
                        lineHeight: 1.2,
                      }}
                    >
                      {TYPE_LABELS[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Donut chart — by level */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #E2E5EF",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                height: 42,
                borderBottom: "1px solid #E2E5EF",
                display: "flex",
                alignItems: "center",
                paddingLeft: 16,
              }}
            >
              <span style={{ fontSize: 12.5, fontWeight: 800, color: "#1A1D2E" }}>
                Асуулт — Түвшнээр
              </span>
            </div>
            <div
              style={{
                padding: "16px",
                display: "flex",
                alignItems: "center",
                gap: 24,
              }}
            >
              {/* SVG donut */}
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="#F1F2F7"
                  strokeWidth="16"
                />
                {segments.map((seg, i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="16"
                    strokeDasharray={`${seg.dash} ${seg.gap}`}
                    strokeDashoffset={-seg.offset + circumference / 4}
                    style={{ transform: "rotate(-90deg)", transformOrigin: "55px 55px" }}
                  />
                ))}
                <text
                  x={cx}
                  y={cy + 6}
                  textAnchor="middle"
                  style={{
                    fontFamily: "monospace",
                    fontSize: 14,
                    fontWeight: 700,
                    fill: "#1A1D2E",
                  }}
                >
                  {stats.total}
                </text>
              </svg>

              {/* Legend */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {LEVEL_LABELS.map((label, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        background: LEVEL_COLORS[i],
                        borderRadius: 2,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 11, color: "#4A4F6A", minWidth: 70 }}>
                      {label}
                    </span>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 11.5,
                        fontWeight: 800,
                        color: "#1A1D2E",
                      }}
                    >
                      {levelData[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E2E5EF",
            borderRadius: 10,
          }}
        >
          <div
            style={{
              height: 42,
              borderBottom: "1px solid #E2E5EF",
              display: "flex",
              alignItems: "center",
              paddingLeft: 16,
            }}
          >
            <span style={{ fontSize: 12.5, fontWeight: 800, color: "#1A1D2E" }}>
              🕐 Сүүлийн үйлдлүүд
            </span>
          </div>
          <div style={{ padding: "8px 0" }}>
            {displayRecent.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 17px",
                  gap: 16,
                  borderBottom: i < displayRecent.length - 1 ? "1px solid #F0F2F8" : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 10,
                    color: "#8A90AB",
                    minWidth: 110,
                  }}
                >
                  {item.date}
                </span>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    background: RECENT_COLORS[item.typeIdx],
                    borderRadius: 3,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#1A1D2E",
                    flex: 1,
                  }}
                >
                  {item.question}
                </span>
                <span
                  style={{
                    background: RECENT_TYPE_BG[item.typeIdx],
                    borderRadius: 4,
                    padding: "2px 8px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: RECENT_TYPE_COLOR[item.typeIdx],
                  }}
                >
                  {RECENT_TYPE_LABELS[item.typeIdx]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
