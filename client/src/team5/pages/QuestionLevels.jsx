import { useState } from "react";

const levelConfig = [
  {
    id: 1,
    num: 1,
    color: "#F87171",
    badgeBg: "#FFE4E6",
    badgeText: "#E11D48",
    borderColor: "#FECDD3",
    numBg: "#FFF1F2",
    numText: "#E11D48",
    name: "Санах (Recall)",
    description: "Тодорхойлолт, үндсэн ойлголтыг санах — хамгийн хялбар",
    count: 35,
  },
  {
    id: 2,
    num: 2,
    color: "#FBBF24",
    badgeBg: "#FEF3C7",
    badgeText: "#D97706",
    borderColor: "#FDE68A",
    numBg: "#FFFBEB",
    numText: "#D97706",
    name: "Ойлгох (Understand)",
    description: "Ойлголтыг хэрэглэх, тайлбарлах — дунд хэмжээний хэцүү",
    count: 28,
  },
  {
    id: 3,
    num: 3,
    color: "#34D399",
    badgeBg: "#CCFBF1",
    badgeText: "#0D9488",
    borderColor: "#99F6E4",
    numBg: "#F0FDFA",
    numText: "#0D9488",
    name: "Хэрэглэх (Apply)",
    description: "Мэдлэгийг шинэ нөхцөлд хэрэглэх, дадлага ажиллах",
    count: 19,
  },
  {
    id: 4,
    num: 4,
    color: "#818CF8",
    badgeBg: "#EDE9FE",
    badgeText: "#7C3AED",
    borderColor: "#DDD6FE",
    numBg: "#F5F3FF",
    numText: "#7C3AED",
    name: "Шийдвэрлэх (Problem-solve)",
    description: "Нарийн шинжилгээ, бүтээлч хандлага — хамгийн хэцүү",
    count: 0,
  },
];

// ── Modal ───────────────────────────────────────────────
const inputStyle = {
  width: "100%",
  height: 34,
  border: "1px solid #E2E5EF",
  borderRadius: 6,
  padding: "0 10px",
  fontSize: 12,
  color: "#1A1D2E",
  fontFamily: "'Noto Sans', sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

const COLOR_OPTIONS = [
  { label: "Улаан", color: "#F87171", badgeBg: "#FFE4E6", badgeText: "#E11D48", borderColor: "#FECDD3", numBg: "#FFF1F2", numText: "#E11D48" },
  { label: "Шар", color: "#FBBF24", badgeBg: "#FEF3C7", badgeText: "#D97706", borderColor: "#FDE68A", numBg: "#FFFBEB", numText: "#D97706" },
  { label: "Ногоон", color: "#34D399", badgeBg: "#CCFBF1", badgeText: "#0D9488", borderColor: "#99F6E4", numBg: "#F0FDFA", numText: "#0D9488" },
  { label: "Цэнхэр", color: "#818CF8", badgeBg: "#EDE9FE", badgeText: "#7C3AED", borderColor: "#DDD6FE", numBg: "#F5F3FF", numText: "#7C3AED" },
  { label: "Цэнхэр2", color: "#60A5FA", badgeBg: "#DBEAFE", badgeText: "#1D4ED8", borderColor: "#BFDBFE", numBg: "#EFF6FF", numText: "#1D4ED8" },
];

function LevelModal({ mode, initialData, onSave, onClose }) {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      description: "",
      count: 0,
      ...COLOR_OPTIONS[0],
    }
  );

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));
  const handleSave = () => { if (!form.name.trim()) return; onSave(form); };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, padding: 28, width: 420, boxShadow: "0 8px 40px rgba(0,0,0,0.18)", fontFamily: "'Noto Sans', sans-serif" }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1A1D2E", margin: "0 0 20px" }}>
          {mode === "edit" ? "Түвшин засах" : "Шинэ түвшин нэмэх"}
        </h2>

        <label style={{ fontSize: 11, fontWeight: 700, color: "#8A90AB", display: "block", marginBottom: 4 }}>Нэр *</label>
        <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Түвшний нэр" style={inputStyle} />

        <label style={{ fontSize: 11, fontWeight: 700, color: "#8A90AB", display: "block", margin: "12px 0 4px" }}>Тайлбар</label>
        <input value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Товч тайлбар" style={inputStyle} />

        <label style={{ fontSize: 11, fontWeight: 700, color: "#8A90AB", display: "block", margin: "12px 0 8px" }}>Өнгө</label>
        <div style={{ display: "flex", gap: 8 }}>
          {COLOR_OPTIONS.map((opt) => (
            <div
              key={opt.color}
              onClick={() => setForm((p) => ({ ...p, ...opt }))}
              style={{
                width: 26, height: 26, borderRadius: "50%",
                background: opt.color,
                border: form.color === opt.color ? "3px solid #1A1D2E" : "3px solid transparent",
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 22, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "#F0F2F8", border: "1px solid #E2E5EF", borderRadius: 6, padding: "0 16px", height: 32, fontWeight: 600, fontSize: 11, cursor: "pointer", color: "#4A4F6A", fontFamily: "'Noto Sans', sans-serif" }}>Болих</button>
          <button onClick={handleSave} style={{ background: "#2563EB", border: "none", borderRadius: 6, padding: "0 18px", height: 32, fontWeight: 700, fontSize: 11, cursor: "pointer", color: "#fff", fontFamily: "'Noto Sans', sans-serif" }}>
            {mode === "edit" ? "Хадгалах" : "Нэмэх"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────
export default function QuestionLevels() {
  const [levels, setLevels] = useState(levelConfig);
  const [search, setSearch] = useState("");
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [modal, setModal] = useState(null);

  const deleteLevel = (id) => {
    if (window.confirm("Энэ түвшинг устгах уу?"))
      setLevels((prev) => prev.filter((l) => l.id !== id));
  };

  const openAdd = () => setModal({ mode: "add" });
  const openEdit = (row) => setModal({ mode: "edit", id: row.id, data: { ...row } });
  const closeModal = () => setModal(null);

  const handleSave = (form) => {
    if (modal.mode === "add") {
      const maxNum = levels.length > 0 ? Math.max(...levels.map((l) => l.num)) : 0;
      setLevels((prev) => [...prev, { id: Date.now(), num: maxNum + 1, count: 0, ...form }]);
    } else {
      setLevels((prev) => prev.map((l) => l.id === modal.id ? { ...l, ...form } : l));
    }
    closeModal();
  };

  const filtered = levels.filter(
    (l) =>
      search === "" ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragStart = (i) => setDragIndex(i);
  const handleDragOver = (e, i) => { e.preventDefault(); setDragOverIndex(i); };
  const handleDrop = (i) => {
    if (dragIndex === null || dragIndex === i) return;
    const reordered = [...levels];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(i, 0, moved);
    setLevels(reordered.map((l, idx) => ({ ...l, num: idx + 1 })));
    setDragIndex(null); setDragOverIndex(null);
  };
  const handleDragEnd = () => { setDragIndex(null); setDragOverIndex(null); };

  return (
    <div style={{ padding: "20px 22px", fontFamily: "'Noto Sans', sans-serif", minHeight: "100%" }}>
      {modal && <LevelModal mode={modal.mode} initialData={modal.data} onSave={handleSave} onClose={closeModal} />}

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: "#1A1D2E", margin: 0, letterSpacing: -0.2, lineHeight: "25px" }}>
            Асуултын түвшин удирдах
          </h1>
          <p style={{ fontSize: 11.5, color: "#8A90AB", margin: "4px 0 0" }}>
            Хэцүүлийн зэрэг — дараалал тохируулах, өнгө тодорхойлох
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            background: "#2563EB",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "0 18px",
            height: 37,
            fontWeight: 500,
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'DM Sans', 'Noto Sans', sans-serif",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="1" y="6" width="11" height="1.5" rx="0.75" fill="white" />
            <rect x="6" y="1" width="1.5" height="11" rx="0.75" fill="white" />
          </svg>
          Шинэ түвшин
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ background: "#fff", border: "1px solid #E2E5EF", borderRadius: 6, height: 29, display: "flex", alignItems: "center", paddingLeft: 10, width: 245, gap: 6 }}>
          <span style={{ fontSize: 12, color: "#BCC0D4" }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Нэрээр хайх..."
            style={{ border: "none", outline: "none", fontSize: 11.5, color: "#1A1D2E", background: "transparent", flex: 1, fontFamily: "'Noto Sans', sans-serif" }}
          />
          {search && (
            <span onClick={() => setSearch("")} style={{ fontSize: 11, color: "#BCC0D4", cursor: "pointer", paddingRight: 8 }}>✕</span>
          )}
        </div>
      </div>

      {/* Level cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((level, i) => (
          <div
            key={level.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={() => handleDrop(i)}
            onDragEnd={handleDragEnd}
            style={{
              background: dragOverIndex === i ? "#F0F4FF" : "#fff",
              border: "1px solid #E2E5EF",
              borderRadius: 10,
              height: 56,
              display: "flex",
              alignItems: "center",
              paddingLeft: 0,
              paddingRight: 16,
              gap: 0,
              opacity: dragIndex === i ? 0.5 : 1,
              transition: "background 0.15s",
              cursor: "default",
            }}
          >
            {/* Drag handle */}
            <div style={{ width: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#BCC0D4", fontSize: 12, cursor: "grab", flexShrink: 0 }}>
              ⠿
            </div>

            {/* Color bar */}
            <div style={{ width: 4, height: 32, background: level.color, borderRadius: 2, flexShrink: 0, marginRight: 13 }} />

            {/* Number badge */}
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: level.numBg,
              border: `1px solid ${level.borderColor}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 10.5,
              color: level.numText,
              fontFamily: "'Noto Sans', sans-serif",
              flexShrink: 0,
              marginRight: 14,
            }}>
              {level.num}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1D2E", lineHeight: "17px" }}>{level.name}</div>
              <div style={{ fontSize: 10.5, color: "#8A90AB", lineHeight: "14px", marginTop: 1 }}>{level.description}</div>
            </div>

            {/* Count badge */}
            <div style={{
              background: level.badgeBg,
              borderRadius: 4,
              padding: "2px 6px",
              fontSize: 10,
              fontWeight: 700,
              color: level.badgeText,
              fontFamily: "'Noto Sans', sans-serif",
              whiteSpace: "nowrap",
              marginRight: 12,
              height: 18,
              display: "flex",
              alignItems: "center",
            }}>
              {level.count} асуулт
            </div>

            {/* Edit button */}
            <button
              onClick={() => openEdit(level)}
              style={{
                background: "#fff",
                border: "1px solid #E2E5EF",
                borderRadius: 6,
                height: 26,
                padding: "0 10px",
                fontSize: 10.5,
                fontWeight: 700,
                color: "#4A4F6A",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "'Noto Sans', sans-serif",
                marginRight: 6,
                whiteSpace: "nowrap",
              }}
            >
              ✏️ Засах
            </button>

            {/* Delete button */}
            <button
              onClick={() => deleteLevel(level.id)}
              style={{
                width: 26,
                height: 26,
                background: "#FFE4E6",
                border: "1px solid #FECDD3",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#E11D48",
              }}
              title="Устгах"
            >
              🗑️
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#BCC0D4", fontSize: 13, background: "#fff", borderRadius: 10, border: "1px solid #E2E5EF" }}>
            {search ? "Хайлтад тохирох үр дүн олдсонгүй" : "Одоогоор түвшин байхгүй байна"}
          </div>
        )}
      </div>
    </div>
  );
}