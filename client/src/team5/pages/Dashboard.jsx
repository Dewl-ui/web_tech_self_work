import React from 'react';

const Dashboard = () => {
  const stats = [
    { label: 'Нийт Асуулт', value: 82, sub: '+12 энэ сар', color: 'bg-blue-500', percent: '82%' },
    { label: 'Нийтлэгдсэн', value: 74, sub: '90.2%', color: 'bg-green-500', percent: '90%' },
    { label: 'Асуулт Төрөл', value: 5, sub: 'бүгд идэвхтэй', color: 'bg-orange-500', percent: '100%' },
    { label: 'Нийт Оноо', value: 540, sub: 'дундаж 6.6/асуулт', color: 'bg-purple-500', percent: '65%' },
  ];

  const barData = [
    { name: 'Сонгох', value: 31, color: 'bg-[#BFDBFE]' },
    { name: 'Нөхөх', value: 18, color: 'bg-[#99F6E4]' },
    { name: 'Харгалзуулах', value: 15, color: 'bg-[#FDE68A]' },
    { name: 'Бичих', value: 12, color: 'bg-[#DDD6FE]' },
    { name: 'Багц', value: 6, color: 'bg-[#FECDD3]' },
  ];

  const pieData = [
    { name: 'Санах', value: 35, color: 'bg-[#FCA5A5]' },
    { name: 'Ойлгох', value: 28, color: 'bg-[#FDE68A]' },
    { name: 'Шийдвэрлэх', value: 19, color: 'bg-[#6EE7B7]' },
  ];

  return (
    <div className="p-6 bg-[#F5F6FA] min-h-screen font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-[#1A1D2E]">Хяналтын самбар</h1>
        <p className="text-xs text-[#8A90AB]">CS101 Мэдээлэл зүй • 2025–2026</p>
      </div>

      {/* 1. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border border-[#E2E5EF] relative shadow-sm">
            <p className="text-[10px] font-bold text-[#8A90AB] uppercase tracking-wider">{stat.label}</p>
            <h2 className="text-2xl font-mono font-extrabold text-[#1A1D2E] my-1">{stat.value}</h2>
            <p className="text-[10px] text-[#8A90AB]">{stat.sub}</p>
            <div className="mt-3 h-[3px] w-full bg-[#E2E5EF] rounded-full">
              <div className={`h-full ${stat.color} rounded-full`} style={{ width: stat.percent }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        
        {/* CSS Bar Chart */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E5EF] shadow-sm">
          <h3 className="text-sm font-extrabold text-[#1A1D2E] mb-4">Асуулт — Төрлөөр</h3>
          <div className="flex items-end justify-between gap-2 h-48 px-2">
            {barData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full flex justify-center items-end h-32">
                  <div 
                    className={`${item.color} w-full max-w-[40px] rounded-t-md transition-all duration-500 hover:opacity-80`} 
                    style={{ height: `${(item.value / 31) * 100}%` }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.value}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] text-[#8A90AB] text-center font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CSS Progress List */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E5EF] shadow-sm">
          <h3 className="text-sm font-extrabold text-[#1A1D2E] mb-6">Асуулт — Түвшнээр</h3>
          <div className="space-y-5">
            {pieData.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#4A4F6A]">
                  <span>{item.name}</span>
                  <span>{item.value} асуулт</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full">
                  <div 
                    className={`${item.color} h-full rounded-full`} 
                    style={{ width: `${(item.value / 35) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="pt-2 text-center">
              <p className="text-2xl font-bold text-[#1A1D2E]">82</p>
              <p className="text-[10px] text-[#8A90AB]">НИЙТ АСУУЛТ</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recent Activity */}
      <div className="bg-white rounded-xl border border-[#E2E5EF] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#E2E5EF] bg-gray-50/50">
          <h3 className="text-sm font-extrabold text-[#1A1D2E]">🕐 Сүүлийн үйлдлүүд</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { date: '2026-04-08 14:30', title: 'Нейрон сүлжээний давуу тал...', type: '📝 Бичих', color: 'text-purple-600', bg: 'bg-purple-50' },
            { date: '2026-04-07 09:15', title: 'Turing тестийн зорилго', type: '🔘 Сонгох', color: 'text-blue-600', bg: 'bg-blue-50' },
            { date: '2026-04-06 16:45', title: 'Машины сурах алгоритм', type: '✍️ Нөхөх', color: 'text-teal-600', bg: 'bg-teal-50' },
          ].map((item, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] text-[#8A90AB] hidden sm:inline">{item.date}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${i===0 ? 'bg-green-500' : i===1 ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                  <span className="text-[11px] font-bold text-[#1A1D2E] truncate max-w-[200px]">{item.title}</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${item.bg} ${item.color}`}>{item.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;