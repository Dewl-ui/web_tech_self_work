import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageTitle, Panel, Shell, PrimaryButton } from '../../components/common';
import api from '../../utils/api'; // API тохиргоо

export default function TeacherStudentGradeDetail() {
  const { courseId, studentId } = useParams();
  const backUrl = `/team3/teacher/journal/${courseId}/detail`;

  const [studentProfile, setStudentProfile] = useState(null);
  const [gradeDetails, setGradeDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      setIsLoading(true);
      try {
        // 1. Оюутны мэдээлэл болон бүх оноог API-аас зэрэг татах
        const [studentsRes, attendancesRes, submissionsRes, midtermsRes] = await Promise.all([
          api.get(`/courses/${courseId}/students`),
          api.get(`/courses/${courseId}/gradebook/attendances`),
          api.get(`/courses/${courseId}/gradebook/submissions`),
          api.get(`/courses/${courseId}/gradebook`)
        ]);

        // 2. Тухайн оюутны профайлыг шүүж олох
        const studentsList = studentsRes.data.items || [];
        const student = studentsList.find(s => String(s.id) === String(studentId) || String(s.user_id) === String(studentId));
        
        // 3. Тухайн оюутны оноонуудыг шүүж олох
        const myAtt = (attendancesRes.data.items || []).find(a => String(a.user_id) === String(studentId));
        const attScore = myAtt ? (myAtt.grade_point || myAtt.point || 0) : 0;

        const mySubs = (submissionsRes.data.items || []).filter(s => String(s.user_id) === String(studentId));
        const lab1Score = mySubs.length > 0 ? (mySubs[0].grade_point || mySubs[0].point || 0) : null;
        const lab2Score = mySubs.length > 1 ? (mySubs[1].grade_point || mySubs[1].point || 0) : null;

        const myMid = (midtermsRes.data.items || []).find(m => String(m.user_id) === String(studentId));
        const midScore = myMid ? (myMid.grade_point || myMid.point || 0) : null;

        const total = attScore + (lab1Score || 0) + (lab2Score || 0) + (midScore || 0);

        // 4. State-д хадгалах
        if (student) {
          setStudentProfile({
            id: studentId,
            name: student.last_name ? `${student.last_name[0]}. ${student.first_name}` : (student.name || student.first_name || 'Нэргүй'),
            email: student.email || student.username || 'И-мэйл бүртгэлгүй',
            major: 'Мэдээллийн технологи (API)',
            totalScore: total,
            status: 'Идэвхтэй'
          });
        } else {
          setStudentProfile({ id: studentId, name: 'Оюутан олдсонгүй', email: '-', major: '-', totalScore: 0, status: '-' });
        }

        setGradeDetails([
          { id: 1, type: 'Ирц', title: 'Нийт ирцийн оноо', maxScore: 10, score: attScore, date: myAtt?.created_on ? new Date(myAtt.created_on).toLocaleDateString() : '-' },
          { id: 2, type: 'Лаб', title: 'Лабораторийн ажил 1', maxScore: 15, score: lab1Score, date: '-' },
          { id: 3, type: 'Лаб', title: 'Лабораторийн ажил 2', maxScore: 15, score: lab2Score, date: '-' },
          { id: 4, type: 'Явц', title: 'Улирлын дунд шалгалт', maxScore: 30, score: midScore, date: myMid?.created_on ? new Date(myMid.created_on).toLocaleDateString() : '-' }
        ]);

      } catch (err) {
        console.error("Оюутны дэлгэрэнгүй татахад алдаа:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentDetails();
  }, [courseId, studentId]);

  return (
    <Shell role="teacher">
      <div className="mb-4">
        <Link to={backUrl} className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Журнал руу буцах
        </Link>
      </div>

      <PageTitle title="Оюутны дүнгийн задаргаа (API холбогдсон)" />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ЗҮҮН ТАЛ: Оюутны профайл */}
          <div className="lg:col-span-1">
            <Panel className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl mb-4">
                {studentProfile?.name?.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-slate-800">{studentProfile?.name}</h2>
              <p className="text-slate-500 font-medium">{studentProfile?.id}</p>
              
              <div className="mt-6 w-full space-y-3 text-left text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Мэргэжил:</span>
                  <span className="font-semibold text-slate-800">{studentProfile?.major}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">И-мэйл:</span>
                  <span className="font-semibold text-slate-800">{studentProfile?.email}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Төлөв:</span>
                  <span className="font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">{studentProfile?.status}</span>
                </div>
              </div>

              <div className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-600 to-[#08335a] p-6 text-white">
                <p className="text-blue-100 text-sm font-medium mb-1">Нийт оноо</p>
                <div className="text-4xl font-extrabold">{studentProfile?.totalScore} <span className="text-lg font-medium text-blue-200">/ 100</span></div>
              </div>
            </Panel>
          </div>

          {/* БАРУУН ТАЛ: Онооны жагсаалт */}
          <div className="lg:col-span-2">
            <Panel>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Үнэлгээний түүх</h3>
                <PrimaryButton className="bg-[#afd0ef] text-[#08335a] hover:bg-[#9ec9f3] text-sm py-2">
                  Дүн өөрчлөх
                </PrimaryButton>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Төрөл</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Даалгаврын нэр</th>
                      <th className="px-4 py-3 text-center font-semibold text-slate-600">Огноо</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-600">Оноо</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {gradeDetails.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-4">
                          <span className="inline-block rounded bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600 border border-blue-100">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-800">{item.title}</td>
                        <td className="px-4 py-4 text-center text-slate-500">{item.date}</td>
                        <td className="px-4 py-4 text-right">
                          {item.score !== null ? (
                            <div className="font-bold text-slate-800">
                              {item.score} <span className="text-slate-400 font-normal">/ {item.maxScore}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Дүгнээгүй</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </Shell>
  );
}