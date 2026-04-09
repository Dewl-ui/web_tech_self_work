import React, { useState } from "react";

const initialRows = [
  { label: "☑️ Сонгох",        vals: [2, 4, 5, 7] },
  { label: "🔗 Харгалзуулах",  vals: [3, 5, 7, 10] },
  { label: "✍️ Нөхөх",         vals: [2, 3, 5, 7] },
  { label: "📝 Бичих (Essay)", vals: [5, 10, 12, 20] },
  { label: "📦 Багц асуулт",   vals: [10, 15, 18, 25] },
];

const levels = [
  { label: "🔴 Санах",      badge: "bg-[#FFE4E6] text-[#E11D48]" },
  { label: "🟡 Ойлгох",     badge: "bg-[#FEF3C7] text-[#D97706]" },
  { label: "🟦 Хэрэглэх",   badge: "bg-[#CCFBF1] text-[#0D9488]" },
  { label: "🟢 Шийдвэрлэх", badge: "bg-[#DCFCE7] text-[#16A34A]" },
];

export default function QuestionPoints() {
  const [rows, setRows] = useState(initialRows);
  const [saved, setSaved] = useState(false);

  const handleChange = (ri, ci, value) => {
    const updated = rows.map((row, r) =>
      r === ri
        ? { ...row, vals: row.vals.map((v, c) => (c === ci ? Number(value) : v)) }
        : row
    );
    setRows(updated);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 bg-[#F5F6FA] min-h-screen">

      {/* Page header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-[18px] font-extrabold text-[#1A1D2E] tracking-tight">
            Асуултын оноо удирдах
          </h1>
          <p className="text-[11.5px] text-[#8A90AB] mt-1">
            Төрөл × Түвшний оноон матриц — анхдагч утгуудыг тохируулна
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-[#E2E5EF] rounded-md text-[10.5px] font-bold text-[#4A4F6A] hover:bg-[#F5F6FA]">
            ↩ Буцаах
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#DCFCE7] border border-[#BBF7D0] rounded-md text-[10.5px] font-bold text-[#16A34A] hover:bg-[#bbf7d0]"
          >
            {saved ? "✓ Хадгалагдлаа" : "💾 Хадгалах"}
          </button>
        </div>
      </div>

      {/* Warning banner */}
      <div className="flex items-center gap-2 bg-[#FEF3C7] border border-[#FDE68A] rounded-md px-4 py-2.5 mb-4 text-[11.5px] text-[#92400E]">
        <span>⚠️</span>
        <span>
          Оноо өөрчлөх нь{" "}
          <strong>одоогийн нийтлэгдсэн шалгалтуудад нөлөөлөхгүй.</strong>{" "}
          Зөвхөн цаашид нэмэгдэх асуултад хэрэглэгдэнэ.
        </span>
      </div>

      {/* Matrix card */}
      <div className="bg-white border border-[#E2E5EF] rounded-[10px] overflow-hidden">

        {/* Card header */}
        <div className="flex items-center justify-between px-4 h-[42px] border-b border-[#E2E5EF]">
          <span className="text-[12.5px] font-extrabold text-[#1A1D2E]">
            Оноон матриц — Асуулт Төрөл × Түвшин
          </span>
          <span className="text-[11px] text-[#8A90AB]">Нүдийг дараад засна</span>
        </div>

        {/* Table */}
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr>
              <th className="bg-[#F8F9FC] border border-[#E2E5EF] h-[37px] text-left pl-3 text-[9.5px] font-extrabold text-[#8A90AB] uppercase tracking-[0.5px] w-[28%]">
                Асуулт Төрөл
              </th>
              {levels.map((l) => (
                <th key={l.label} className="bg-[#F8F9FC] border border-[#E2E5EF] h-[37px] text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-[0.5px] ${l.badge}`}>
                    {l.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 1 ? "bg-[#FAFBFD]" : "bg-white"}>
                <td className="bg-[#F8F9FC] border border-[#E2E5EF] h-[45px] pl-3 text-[11.5px] font-bold text-[#1A1D2E]">
                  {row.label}
                </td>
                {row.vals.map((val, ci) => (
                  <td key={ci} className="border border-[#E2E5EF] h-[45px] text-center">
                    <input
                      type="number"
                      min={1}
                      value={val}
                      onChange={(e) => handleChange(ri, ci, e.target.value)}
                      className="w-[54px] h-[26px] bg-[#F8F9FC] border border-[#E2E5EF] rounded-[5px] text-center text-[12px] font-bold font-mono text-[#1A1D2E] focus:outline-none focus:border-[#3B6FF5] focus:bg-[#EEF2FE]"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}