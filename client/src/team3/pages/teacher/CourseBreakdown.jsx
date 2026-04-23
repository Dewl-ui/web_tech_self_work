import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageTitle, Panel, Shell, PrimaryButton } from '../../components/common';

export default function CourseBreakdown() {
  const { courseId } = useParams();
  const base = `/team3/teacher/journal/${courseId}`;

  const journalData = [
    { id: 'B200910101', name: 'Б. Бат-Эрдэнэ', attendanceScore: 10, lab1Score: 15, lab2Score: 15, midtermScore: 28, totalScore: 68 },
    { id: 'B200910102', name: 'Д. Сувд', attendanceScore: 8, lab1Score: 12, lab2Score: 14, midtermScore: 25, totalScore: 59 },
    { id: 'B200910103', name: 'Г. Тэмүүлэн', attendanceScore: 10, lab1Score: 15, lab2Score: 15, midtermScore: 30, totalScore: 70 },
    { id: 'B200910104', name: 'Х. Номин', attendanceScore: 6, lab1Score: 10, lab2Score: 12, midtermScore: 20, totalScore: 48 },
    { id: 'B200910105', name: 'С. Билгүүн', attendanceScore: 10, lab1Score: 14, lab2Score: 15, midtermScore: 29, totalScore: 68 },
  ];

  return (
    <Shell role="teacher">
      <PageTitle 
        title="F.ITM301 Веб систем ба технологи" 
        right={
          <div className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm">
            Нийт сурагчид: {journalData.length}
          </div>
        } 
      />

      <Panel className="min-h-[400px]">
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-slate-800">Онооны нэгдсэн журнал</h3>
          <PrimaryButton className="bg-[#afd0ef] text-[#08335a] hover:bg-[#9ec9f3]">Excel татах</PrimaryButton>
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
              {journalData.map((student, index) => (
                <tr key={index} className="hover:bg-slate-50 transition">
                  <td className="border px-3 py-3">
                    <Link to={`${base}/student/${student.id}`} className="font-bold text-blue-600 hover:text-blue-800 hover:underline block">
                      {student.name}
                    </Link>
                    <div className="text-xs text-slate-500 mt-1">{student.id}</div>
                  </td>
                  <td className="border px-3 py-3 text-center font-medium">
                    <Link to={`${base}/student/${student.id}/attendance`} className="text-blue-600 font-bold hover:underline">
                      {student.attendanceScore}
                    </Link>
                  </td>
                  <td className="border px-3 py-3 text-center">
                    <Link to={`${base}/assignment/1`} className="text-blue-600 font-bold hover:underline">
                      {student.lab1Score}
                    </Link>
                  </td>
                  <td className="border px-3 py-3 text-center">
                    <Link to={`${base}/assignment/2`} className="text-blue-600 font-bold hover:underline">
                      {student.lab2Score}
                    </Link>
                  </td>
                  <td className="border px-3 py-3 text-center font-medium">{student.midtermScore}</td>
                  <td className="border px-3 py-3 text-center font-extrabold text-[#ff5a74]">
                    {student.totalScore}
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