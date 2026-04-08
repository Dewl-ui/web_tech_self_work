import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api'; 
// Note: Ensure your api.js has deleteQuestion, or import it from '../api' if they are different files

const QuestionList = () => {
  const { course_id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getQuestionsData = async () => {
    try {
      setLoading(true);
      const data = await api.fetchQuestions(course_id);
      // Main branch uses data.items, your version used data. Check which one your API returns:
      setQuestions(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      setError("Асуултуудыг ачаалахад алдаа гарлаа.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuestionsData();
  }, [course_id]);

  // Combined Delete function from Main branch
  const handleDelete = async (id) => {
    if (window.confirm('Устгах уу?')) {
      try {
        await api.deleteQuestion(id); // Using your api utility
        setQuestions(questions.filter(q => q.id !== id));
      } catch (err) {
        alert("Устгахад алдаа гарлаа.");
      }
    }
  };

  if (loading) return <div className="p-6 text-center">Ачаалж байна...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Асуултын жагсаалт</h1>
          <p className="text-gray-500">Нийт {questions.length} асуулт олдлоо</p>
        </div>
        
        <Link 
          to={`/courses/${course_id}/questions/create`}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
        >
          <span>+</span> Шинэ асуулт нэмэх
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Асуулт</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Төрөл</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Түвшин</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Оноо</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Үйлдэл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {questions.length > 0 ? (
              questions.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-gray-800 font-medium line-clamp-1">{q.question}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                      {q.type_name || q.type_id}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{q.level_name || q.level_id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">{q.point} оноо</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Link to={`/courses/${course_id}/questions/${q.id}`} className="text-blue-500 hover:underline text-sm font-medium">Харах</Link>
                      <Link to={`/courses/${course_id}/questions/${q.id}/edit`} className="text-gray-500 hover:underline text-sm font-medium">Засах</Link>
                      <button onClick={() => handleDelete(q.id)} className="text-red-500 hover:underline text-sm font-medium">Устгах</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                  Одоогоор асуулт бүртгэгдээгүй байна.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionList;