import React from 'react';
import { Link } from 'react-router-dom'; // 1. Link-ийг импортлох

const Home = () => {
  // Figma-ийн өгөгдлүүд
  const courses = [
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

  return (
    <div className="bg-[#F5F6FA] min-h-screen p-6 font-['Noto_Sans']">
      {/* Header Section */}
      <div className="mb-6 ml-1">
        <h1 className="text-[18px] font-extrabold text-[#1A1D2E] tracking-tight">Хичээлүүд</h1>
        <p className="text-[11.5px] text-[#8A90AB] mt-1">Нийт {courses.length + 3} хичээл бүртгэлтэй байна</p>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-8 gap-4 px-1">
        <div className="relative w-full max-w-[344px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BCC0D4] text-[11.5px]">🔍</span>
          <input 
            type="text" 
            placeholder="Хичээлийн нэр, код хайх..." 
            className="w-full h-[31px] pl-10 pr-4 bg-white border border-[#E2E5EF] rounded-md text-[11.5px] focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-[#BCC0D4]"
          />
        </div>
        <button className="h-[26px] px-4 bg-white border border-[#E2E5EF] rounded-md text-[10.5px] font-bold text-[#4A4F6A] flex items-center gap-2 hover:bg-gray-50 transition-colors">
          <span className="text-[12px]">⠿</span> Хүснэгт харагдал
        </button>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {courses.map((course) => (
          <div key={course.id} className="bg-white border border-[#E2E5EF] rounded-[10px] overflow-hidden flex flex-col h-[205px] shadow-sm relative group">
            {/* Top Color Bar */}
            <div className="h-[4px] w-full" style={{ backgroundColor: course.color }}></div>
            
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
                    style={{ 
                      width: `${(course.pub / course.q) * 100}%`,
                      backgroundColor: course.color 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="h-[47px] bg-[#FAFBFF] border-t border-[#E2E5EF] px-4 flex items-center justify-between">
              <div 
                className={`px-2 py-0.5 rounded text-[9.5px] font-bold flex items-center gap-1.5 ${
                  course.status === 'Идэвхтэй' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEF3C7] text-[#D97706]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${course.status === 'Идэвхтэй' ? 'bg-[#16A34A]' : 'bg-[#D97706]'}`}></span> 
                {course.status}
              </div>
              <div className="flex gap-2">
                <button className="w-7 h-7 bg-[#F1F2F7] border border-[#E2E5EF] rounded-md flex items-center justify-center text-[11px] hover:bg-gray-200 transition-all">👁️</button>
                <button className="w-7 h-7 bg-[#EEF2FE] border border-[#C7D4FC] rounded-md flex items-center justify-center text-[11px] hover:bg-blue-100 transition-all">✏️</button>
                <button className="w-7 h-7 bg-[#FFE4E6] border border-[#FECDD3] rounded-md flex items-center justify-center text-[11px] hover:bg-red-100 transition-all">🗑️</button>
              </div>
            </div>
          </div>
        ))}

        {/* 2. Шинэ хичээл нэмэх карт - Link ашиглан холбосон */}
        <Link 
          to="/team5/courses/create" 
          className="bg-[#F8FAFF] border-2 border-dashed border-[#E2E5EF] rounded-[10px] h-[205px] flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 group transition-all text-decoration-none"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl mb-3 group-hover:scale-110 transition-transform">
            +
          </div>
          <span className="text-[13px] font-bold text-blue-600">Шинэ хичээл нэмэх</span>
          <span className="text-[10px] text-[#8A90AB] mt-1">Хичээл бүртгэх</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;