import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageTitle, Panel, Shell, PrimaryButton } from '../../components/common'; 

export default function CourseBreakdown() {
  const { courseId } = useParams();
  const base = `/team3/teacher/journal/${courseId}`;

  // Туршилтын дата
  const journalData = [
    { id: 'B200910101', name: 'Б. Бат-Эрдэнэ', attendance: 10, lab1: 15, lab2: 15, midterm: 28, total: 68 },
    { id: 'B200910102', name: 'Д. Сувд', attendance: 8, lab1: 12, lab2: 14, midterm: 25, total: 59 },
    { id: 'B200910103', name: 'Г. Тэмүүлэн', attendance: 10, lab1: 15, lab2: 15, midterm: 30, total: 70 },
  ];

  return (
    <Shell role="teacher">
      <PageTitle 
        title="F.ITM301 Веб систем ба технологи" 
        right={<div className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm">Нийт сурагчид: {journalData.length}</div>} 
      />

      <Panel className="min-h-[400px]">
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-slate-800">Онооны нэгдсэн журнал</h3>
          <PrimaryButton className="bg-[#afd0ef] text-[#08335a] hover:bg-[#9ec9f3]">↓ Excel татах</PrimaryButton>
        </div>

        <div className="overflow-x-auto rounded-md border border-[#d8d8e4]">
          <table className="min-w-full text-sm">
            <thead className="bg-[#cfe6fb]">
              <tr>
                <th className="border border-[#d4d7e5] px-3 py-3 text-left font-bold text-[#08335a] uppercase">Оюутан</th>
                <th className="border border-[#d4d7e5] px-3 py-3 text-center font-bold text-[#08335a] uppercase">Ирц (10)</th>
                <th className="border border-[#d4d7e5] px-3 py-3 text-center font-bold text-[#08335a] uppercase">Лаб 1 (15)</th>
                <th className="border border-[#d4d7e5] px-3 py-3 text-center font-bold text-[#08335a] uppercase">Лаб 2 (15)</th>
                <th className="border border-[#d4d7e5] px-3 py-3 text-center font-bold text-[#08335a] uppercase">Явц (30)</th>
                <th className="border border-[#d4d7e5] px-3 py-3 text-center font-extrabold text-[#ff5a74] uppercase">Нийт (100)</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {journalData.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition">
                  <td className="border px-3 py-3">
                    <Link to={`${base}/student/${student.id}`} className="font-bold text-blue-600 hover:text-blue-800 hover:underline block">
                      {student.name}
                    </Link>
                    <div className="text-xs text-slate-500 mt-1">{student.id}</div>
                  </td>
                  <td className="border px-3 py-3 text-center">
                    <Link to={`${base}/student/${student.id}/attendance`} className="text-blue-600 font-bold hover:underline">
                        {student.attendance}
                    </Link>
                    </td>
                  <td className="border px-3 py-3 text-center">
                    <Link to={`${base}/assignment/1`} className="text-blue-600 font-bold hover:underline">
                      {student.lab1}
                    </Link>
                  </td>
                  <td className="border px-3 py-3 text-center">
                    <Link to={`${base}/assignment/2`} className="text-blue-600 font-bold hover:underline">
                      {student.lab2}
                    </Link>
                  </td>
                  <td className="border px-3 py-3 text-center font-medium">{student.midterm}</td>
                  <td className="border px-3 py-3 text-center font-extrabold text-[#ff5a74]">
                    {student.total}
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