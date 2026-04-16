import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageTitle, Panel, Shell, SmallButton } from '../../components/common';

export default function StudentGradeDetail() {
  const { studentId } = useParams();

  return (
    <Shell role="teacher">
      <PageTitle title="Оюутны хичээлийн явц" subtitle="F.ITM301 Веб систем ба технологи" />
      <Panel className="max-w-5xl">
        <div className="mb-8 flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl">О</div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Б. Бат-Эрдэнэ</h2>
              <p className="text-slate-500 font-medium">{studentId || 'B200910101'}</p>
            </div>
          </div>
          <SmallButton as={Link} to=".." relative="path">← Журнал руу буцах</SmallButton>
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-4">Онооны дэлгэрэнгүй явц</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center">
            <p className="text-slate-500 text-sm mb-2 font-semibold">Ирцийн оноо</p>
            <p className="text-3xl font-black text-slate-700">10 <span className="text-lg font-medium text-slate-400">/ 10</span></p>
            <Link to="attendance" className="mt-3 inline-block text-sm font-bold text-indigo-600 hover:underline">Дэлгэрэнгүй харах →</Link>
            </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center"><p className="text-slate-500 text-sm mb-2 font-semibold">Лаборатори 1</p><p className="text-3xl font-black text-slate-700">15 <span className="text-lg font-medium text-slate-400">/ 15</span></p></div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center"><p className="text-slate-500 text-sm mb-2 font-semibold">Лаборатори 2</p><p className="text-3xl font-black text-slate-700">15 <span className="text-lg font-medium text-slate-400">/ 15</span></p></div>
          <div className="bg-[linear-gradient(135deg,#e0e7ff,#c7d2fe)] p-5 rounded-2xl border border-indigo-200 text-center shadow-sm"><p className="text-indigo-800 text-sm mb-2 font-bold">Явцын шалгалт</p><p className="text-3xl font-black text-indigo-900">28 <span className="text-lg font-medium text-indigo-400">/ 30</span></p></div>
        </div>
      </Panel>
    </Shell>
  );
}