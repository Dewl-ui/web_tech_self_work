import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageTitle, Panel, Shell, SmallButton } from '../../components/common';

export default function StudentAttendanceDetail() {
  const { studentId } = useParams();

  // Нэгдсэн ирцийн туршилтын дата (Лекц + Лаб)
  const attendanceRecords = [
    { id: 1, week: '1-р долоо хоног', type: 'Лекц 1-4', date: '2026.02.10', status: 'Ирсэн', color: 'text-emerald-700 bg-emerald-100' },
    { id: 2, week: '1-р долоо хоног', type: 'Лаб 2-4', date: '2026.02.12', status: 'Ирсэн', color: 'text-emerald-700 bg-emerald-100' },
    { id: 3, week: '2-р долоо хоног', type: 'Лекц 1-4', date: '2026.02.17', status: 'Тасалсан', color: 'text-rose-700 bg-rose-100' },
    { id: 4, week: '2-р долоо хоног', type: 'Лаб 2-4', date: '2026.02.19', status: 'Өвчтэй', color: 'text-purple-700 bg-purple-100' },
    { id: 5, week: '3-р долоо хоног', type: 'Лекц 1-4', date: '2026.02.24', status: 'Ирсэн', color: 'text-emerald-700 bg-emerald-100' },
    { id: 6, week: '3-р долоо хоног', type: 'Лаб 2-4', date: '2026.02.26', status: 'Чөлөөтэй', color: 'text-amber-700 bg-amber-100' },
  ];

  return (
    <Shell role="teacher">
      <PageTitle title="Оюутны ирцийн дэлгэрэнгүй" subtitle="Лекц болон Лабораторийн нэгдсэн ирц" />
      <Panel className="max-w-5xl">
        <div className="mb-6 flex justify-between items-center border-b border-slate-200 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold text-xl">О</div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Б. Бат-Эрдэнэ</h2>
              <p className="text-slate-500 text-sm font-medium">{studentId || 'B200910101'}</p>
            </div>
          </div>
          <SmallButton as={Link} to=".." relative="path">← Буцах</SmallButton>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 text-sm font-semibold text-slate-700">
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500"></span>Ирсэн</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-rose-500"></span>Тасалсан</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-purple-500"></span>Өвчтэй</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-500"></span>Чөлөөтэй</div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-5 py-4 font-bold uppercase">Долоо хоног</th>
                <th className="px-5 py-4 font-bold uppercase">Хичээлийн хэлбэр</th>
                <th className="px-5 py-4 font-bold uppercase">Огноо</th>
                <th className="px-5 py-4 font-bold uppercase text-center">Ирцийн төлөв</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {attendanceRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4 font-medium text-slate-700">{record.week}</td>
                  <td className="px-5 py-4 font-medium text-slate-600">{record.type}</td>
                  <td className="px-5 py-4 text-slate-500">{record.date}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full font-bold text-xs ${record.color}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Shell>
  );
}