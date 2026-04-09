import { useState } from "react";

const initialTypes = [
  { id: 1, num: "01", icon: "☑️", name: "Сонгох (Multiple Choice)", description: "Нэг буюу олон зөв хариулт сонгох", active: true },
  { id: 2, num: "02", icon: "🔗", name: "Харгалзуулах (Matching)", description: "Зүүн ба баруун баганыг харгалзуулах", active: true },
  { id: 3, num: "03", icon: "✍️", name: "Нөхөх (Fill-in-blank)", description: "Хоосон зайд зохих үг нөхөх", active: true },
  { id: 4, num: "04", icon: "📝", name: "Бичих (Essay)", description: "Дэлгэрэнгүй бичгийн хариулт", active: true },
  { id: 5, num: "05", icon: "📦", name: "Багц асуулт (Cluster)", description: "Дэд асуулт агуулсан цогц асуулт", active: false },
];

function Toggle({ active, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 34, height: 18, borderRadius: 9,
        background: active ? "#16A34A" : "#E2E5EF",
        position: "relative", cursor: "pointer",
        transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", width: 14, height: 14,
        background: "#fff", borderRadius: 7, top: 2,
        left: active ? 18 : 2,
        boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
        transition: "left 0.2s",
      }} />
    </div>
  );
}

const inputStyle = {
  width: "100%", height: 34, border: "1px solid #E2E5EF",
  borderRadius: 6, padding: "0 10px", fontSize: 12,
  color: "#1A1D2E", fontFamily: "'Noto Sans', sans-serif",
  outline: "none", boxSizing: "border-box",
};

function TypeModal({ mode, initialData, onSave, onClose }) {
  const [form, setForm] = useState(initialData || { icon: "❓", name: "", description: "", active: true });
  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));
  const handleSave = () => { if (!form.name.trim()) return; onSave(form); };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, padding: 28, width: 400, boxShadow: "0 8px 40px rgba(0,0,0,0.18)", fontFamily: "'Noto Sans', sans-serif" }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1A1D2E", margin: "0 0 20px" }}>
          {mode === "edit" ? "Төрөл засах" : "Шинэ төрөл нэмэх"}
        </h2>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#8A90AB", display: "block", marginBottom: 4 }}>Дүрс (Emoji)</label>
        <input value={form.icon} onChange={(e) => set("icon", e.target.value)} style={inputStyle} maxLength={4} />
        <label style={{ fontSize: 11, fontWeight: 700, color: "#8A90AB", display: "block", margin: "12px 0 4px" }}>Нэр *</label>
        <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Асуултын төрлийн нэр" style={inputStyle} />
        <label style={{ fontSize: 11, fontWeight: 700, color: "#8A90AB", display: "block", margin: "12px 0 4px" }}>Тайлбар</label>
        <input value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Товч тайлбар" style={inputStyle} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
          <Toggle active={form.active} onChange={() => set("active", !form.active)} />
          <span style={{ fontSize: 12, color: "#4A4F6A" }}>{form.active ? "Идэвхтэй" : "Идэвхгүй"}</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 22, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "#F0F2F8", border: "1px solid #E2E5EF", borderRadius: 6, padding: "0 16px", height: 32, fontWeight: 600, fontSize: 11, cursor: "pointer", color: "#4A4F6A", fontFamily: "'Noto Sans', sans-serif" }}>Болих</button>
          <button onClick={handleSave} style={{ background: "#3B6FF5", border: "none", borderRadius: 6, padding: "0 18px", height: 32, fontWeight: 700, fontSize: 11, cursor: "pointer", color: "#fff", fontFamily: "'Noto Sans', sans-serif" }}>{mode === "edit" ? "Хадгалах" : "Нэмэх"}</button>
        </div>
      </div>
    </div>
  );
}

export default function QuestionTypes() {
  const [types, setTypes] = useState(initialTypes);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [modal, setModal] = useState(null);

  const toggleActive = (id) => setTypes((prev) => prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t)));
  const deleteType = (id) => { if (window.confirm("Энэ төрлийг устгах уу?")) setTypes((prev) => prev.filter((t) => t.id !== id)); };
  const openAdd = () => setModal({ mode: "add" });
  const openEdit = (row) => setModal({ mode: "edit", id: row.id, data: { icon: row.icon, name: row.name, description: row.description, active: row.active } });
  const closeModal = () => setModal(null);

  const handleSave = (form) => {
    if (modal.mode === "add") {
      const maxNum = types.length > 0 ? Math.max(...types.map((t) => parseInt(t.num))) : 0;
      setTypes((prev) => [...prev, { id: Date.now(), num: String(maxNum + 1).padStart(2, "0"), icon: form.icon || "❓", name: form.name, description: form.description, active: form.active }]);
    } else {
      setTypes((prev) => prev.map((t) => t.id === modal.id ? { ...t, ...form } : t));
    }
    closeModal();
  };

  const filtered = types.filter((t) => {
    const matchSearch = search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || (filterStatus === "active" && t.active) || (filterStatus === "inactive" && !t.active);
    return matchSearch && matchStatus;
  });

  const handleDragStart = (i) => setDragIndex(i);
  const handleDragOver = (e, i) => { e.preventDefault(); setDragOverIndex(i); };
  const handleDrop = (i) => {
    if (dragIndex === null || dragIndex === i) return;
    const reordered = [...types];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(i, 0, moved);
    setTypes(reordered.map((t, idx) => ({ ...t, num: String(idx + 1).padStart(2, "0") })));
    setDragIndex(null); setDragOverIndex(null);
  };
  const handleDragEnd = () => { setDragIndex(null); setDragOverIndex(null); };

  const activeCount = types.filter((t) => t.active).length;

  return (
    <div style={{ padding: "20px 22px", fontFamily: "'Noto Sans', sans-serif", minHeight: "100%" }}>
      {modal && <TypeModal mode={modal.mode} initialData={modal.data} onSave={handleSave} onClose={closeModal} />}

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: "#1A1D2E", margin: 0, letterSpacing: -0.2, lineHeight: "25px" }}>
            Асуултын төрөл удирдах
          </h1>
          <p style={{ fontSize: 11.5, color: "#8A90AB", margin: "4px 0 0" }}>
            Нийт {types.length} төрөл · <span style={{ color: "#16A34A", fontWeight: 600 }}>{activeCount} идэвхтэй</span> · {types.length - activeCount} идэвхгүй — дараалал тохируулах, нэмэх, засах боломжтой
          </p>
        </div>
        <button onClick={openAdd} style={{ background: "#3B6FF5", color: "#fff", border: "none", borderRadius: 6, padding: "0 14px", height: 32, fontWeight: 700, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "'Noto Sans', sans-serif" }}>
          ＋ Шинэ төрөл
        </button>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <div style={{ background: "#fff", border: "1px solid #E2E5EF", borderRadius: 6, height: 32, display: "flex", alignItems: "center", paddingLeft: 10, width: 245, gap: 6 }}>
          <span style={{ fontSize: 12, color: "#BCC0D4" }}>🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Нэрээр хайх..." style={{ border: "none", outline: "none", fontSize: 11.5, color: "#1A1D2E", background: "transparent", flex: 1, fontFamily: "'Noto Sans', sans-serif" }} />
          {search && <span onClick={() => setSearch("")} style={{ fontSize: 11, color: "#BCC0D4", cursor: "pointer", paddingRight: 8 }}>✕</span>}
        </div>
        {[{ key: "all", label: "Бүгд" }, { key: "active", label: "Идэвхтэй" }, { key: "inactive", label: "Идэвхгүй" }].map(({ key, label }) => {
          const isActive = filterStatus === key;
          return (
            <div key={key} onClick={() => setFilterStatus(key)} style={{ background: isActive ? "#3B6FF5" : "#fff", border: `1px solid ${isActive ? "#3B6FF5" : "#E2E5EF"}`, borderRadius: 6, height: 32, display: "flex", alignItems: "center", padding: "0 13px", cursor: "pointer", fontSize: 11, color: isActive ? "#fff" : "#4A4F6A", fontWeight: isActive ? 700 : 400, transition: "all 0.15s" }}>
              {label}
            </div>
          );
        })}
      </div>

      {/* Table card */}
      <div style={{ background: "#fff", border: "1px solid #E2E5EF", borderRadius: 10, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "28px 37px 52px 240px 1fr 93px 108px", background: "#F8F9FC", borderBottom: "1px solid #E2E5EF" }}>
          {["⠿", "#", "Дүрс", "Нэр", "Тайлбар", "Идэвхтэй", "Үйлдэл"].map((col, i) => (
            <div key={i} style={{ padding: "8px 12px", fontSize: 9.5, fontWeight: 800, color: "#8A90AB", letterSpacing: 0.5, textTransform: "uppercase", display: "flex", alignItems: "center" }}>{col}</div>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((row, i) => (
          <div
            key={row.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={() => handleDrop(i)}
            onDragEnd={handleDragEnd}
            style={{ display: "grid", gridTemplateColumns: "28px 37px 52px 240px 1fr 93px 108px", background: dragOverIndex === i ? "#EEF2FE" : i % 2 !== 0 ? "#FAFBFD" : "#fff", borderBottom: i < filtered.length - 1 ? "1px solid #F0F2F8" : "none", transition: "background 0.15s", height: 42, alignItems: "center", opacity: dragIndex === i ? 0.5 : 1 }}
          >
            <div style={{ padding: "0 12px", color: "#BCC0D4", fontSize: 12, cursor: "grab", display: "flex", alignItems: "center" }}>⠿</div>
            <div style={{ padding: "0 12px", fontSize: 11, color: "#8A90AB", fontFamily: "'JetBrains Mono', monospace", display: "flex", alignItems: "center" }}>{row.num}</div>
            <div style={{ padding: "0 12px", fontSize: 17, display: "flex", alignItems: "center" }}>{row.icon}</div>
            <div style={{ padding: "0 12px", fontSize: 11.5, fontWeight: 600, color: "#1A1D2E", display: "flex", alignItems: "center" }}>{row.name}</div>
            <div style={{ padding: "0 12px", fontSize: 11.5, color: "#4A4F6A", display: "flex", alignItems: "center" }}>{row.description}</div>
            <div style={{ padding: "0 12px", display: "flex", alignItems: "center" }}>
              <Toggle active={row.active} onChange={() => toggleActive(row.id)} />
            </div>
            <div style={{ padding: "0 12px", display: "flex", alignItems: "center", gap: 4 }}>
              <button onClick={() => openEdit(row)} title="Засах" style={{ width: 26, height: 24, background: "#fff", border: "1px solid #E2E5EF", borderRadius: 6, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✏️</button>
              <button onClick={() => deleteType(row.id)} title="Устгах" style={{ width: 26, height: 24, background: "#FFE4E6", border: "1px solid #FECDD3", borderRadius: 6, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", color: "#E11D48" }}>🗑️</button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#BCC0D4", fontSize: 13 }}>
            {search ? "Хайлтад тохирох үр дүн олдсонгүй" : "Одоогоор төрөл байхгүй байна"}
          </div>
        )}

        {/* Pagination footer */}
        <div style={{ borderTop: "1px solid #E2E5EF", height: 47, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
          <span style={{ fontSize: 11, color: "#8A90AB" }}>{filtered.length} / {types.length} төрөл харуулж байна</span>
          <div style={{ display: "flex", gap: 3 }}>
            {["‹", "1", "›"].map((p, i) => (
              <div key={i} style={{ width: 26, height: 26, border: i === 1 ? "1px solid #3B6FF5" : "1px solid #E2E5EF", borderRadius: 5, background: i === 1 ? "#3B6FF5" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i === 1 ? "#fff" : "#8A90AB", cursor: "pointer" }}>{p}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}