import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageTitle, Panel, Shell, PrimaryButton } from '../../components/common';
import api from '../../utils/api'; // API тохиргоо

export default function TeacherStudentAttendanceDetail() {
  const { courseId, studentId } = useParams();
  
  // Журнал руу буцах зам
  const backUrl = `/team3/teacher/journal/${courseId}/detail`;

  const [attendanceData, setAttendanceData] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceAndStudent = async () => {
      setIsLoading(true);
      try {
        // 1. Оюутны мэдээлэл болон Ирцийн мэдээллийг зэрэг татах
        const [studentsRes, attendancesRes] = await Promise.all([
          api.get(`/courses/${courseId}/students`),
          api.get(`/courses/${courseId}/attendances`) // Тухайн хичээлийн бүх ирцийг татах
        ]);

        // 2. Оюутны нэрийг олох
        const studentsList = studentsRes.data.items || studentsRes.data || [];
        // id эсвэл user_id-аар хайх (Өгөгдлийн бүтцээс хамаарч)
        const currentStudent = studentsList.find(s => String(s.id) === String(studentId) || String(s.user_id) === String(studentId));
        
        if (currentStudent) {
          setStudentInfo({
            name: currentStudent.last_name ? `${currentStudent.last_name[0]}. ${currentStudent.first_name}` : (currentStudent.name || currentStudent.first_name),
            code: currentStudent.username || currentStudent.email || studentId
          });
        } else {
          setStudentInfo({ name: 'Оюутан олдсонгүй', code: studentId });
        }

        // 3. Зөвхөн энэ оюутны ирцийг шүүж авах
        const allAttendances = attendancesRes.data.items || attendancesRes.data || [];
        const studentAttendances = allAttendances.filter(a => String(a.user_id) === String(studentId));
        
        setAttendanceData(studentAttendances);

      } catch (err) {
        console.error("Ирцийн мэдээлэл татахад алдаа:", err);
        setError("Ирцийн мэдээлэл татахад алдаа гарлаа. Та дахин оролдоно уу.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceAndStudent();
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

      <PageTitle 
        title="Оюутны ирцийн дэлгэрэнгүй" 
        right={
          <PrimaryButton className="bg-[#afd0ef] text-[#08335a] hover:bg-[#9ec9f3]">
            Ирц засах
          </PrimaryButton>
        }
      />

      <Panel>
        {/* Оюутны мэдээлэл харуулах хэсэг */}
        <div className="mb-6 flex items-center space-x-4 border-b border-slate-100 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
            {studentInfo?.name ? studentInfo.name.charAt(0) : '?'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{studentInfo?.name || 'Уншиж байна...'}</h2>
            <p className="text-sm text-slate-500">{studentInfo?.code}</p>
          </div>
        </div>

        {/* Ирцийн хүснэгт */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Ирцийн түүх</h3>
          <div className="text-sm font-medium text-slate-500">
            Нийт бүртгэл: {attendanceData.length}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></span>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-center text-red-600 border border-red-100">
            {error}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-600">Огноо</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Төлөв</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 text-right">Оноо</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {attendanceData.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-slate-500">
                      Ирцийн бүртгэл олдсонгүй эсвэл сервер дээр хоосон байна.
                    </td>
                  </tr>
                ) : (
                  attendanceData.map((record, index) => (
                    <tr key={record.id || index} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-4 font-medium text-slate-800">
                        {/* Огноог форматлах (2026-04-15 гэх мэт) */}
                        {record.created_on ? new Date(record.created_on).toLocaleDateString() : 'Тодорхойгүй'}
                      </td>
                      <td className="px-4 py-4">
                        {/* Онооноос хамаарч Ирсэн, Тасалсан гэж харуулах */}
                        {(record.point || record.grade_point) > 0 ? (
                          <span className="inline-block rounded bg-green-50 px-2 py-1 text-xs font-bold text-green-600 border border-green-100">Ирсэн</span>
                        ) : (
                          <span className="inline-block rounded bg-red-50 px-2 py-1 text-xs font-bold text-red-600 border border-red-100">Тасалсан</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-slate-800">
                        {record.point || record.grade_point || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </Shell>
  );
}