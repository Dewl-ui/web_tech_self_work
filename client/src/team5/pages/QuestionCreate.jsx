import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api'; 
import DynamicQuestionEditor from '../components/DynamicQuestionEditor';

const QuestionCreate = () => {
  const { course_id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    question: '',
    type_id: '',
    level_id: '',
    lesson_id: '',
    point: 0,
    answer: null,
    options: [],
  });

  const [questionTypes, setQuestionTypes] = useState([]);
  const [questionLevels, setQuestionLevels] = useState([]);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // api.get биш api-ийн функцүүдийг ашиглана
        const [types, levels, lessonsData] = await Promise.all([
          api.fetchQuestionTypes(),
          api.fetchQuestionLevels(),
          api.fetchLessons(course_id)
        ]);
        setQuestionTypes(types);
        setQuestionLevels(levels);
        setLessons(lessonsData);
      } catch (err) {
        console.error("Мэдээлэл авахад алдаа гарлаа:", err);
      }
    };
    fetchData();
  }, [course_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createQuestion(course_id, formData);
      alert('Асуулт амжилттай үүсгэлээ!');
      navigate(`/courses/${course_id}/questions`);
    } catch (err) {
      console.error(err);
      alert('Алдаа гарлаа');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Шинэ асуулт үүсгэх</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Асуулт</label>
          <textarea
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="w-full h-32 p-4 border rounded-xl"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <select name="type_id" onChange={handleChange} className="p-3 border rounded-xl" required>
            <option value="">Төрөл сонгох</option>
            {questionTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          <select name="level_id" onChange={handleChange} className="p-3 border rounded-xl" required>
            <option value="">Түвшин сонгох</option>
            {questionLevels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>

          <select name="lesson_id" onChange={handleChange} className="p-3 border rounded-xl">
            <option value="">Хэсэг сонгох</option>
            {lessons.map(ls => <option key={ls.id} value={ls.id}>{ls.name}</option>)}
          </select>
        </div>

        <DynamicQuestionEditor typeId={formData.type_id} formData={formData} setFormData={setFormData} />

        <div className="flex gap-4 pt-6">
          <button type="button" onClick={() => navigate(-1)} className="px-8 py-3 border rounded-xl">Болих</button>
          <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl">Хадгалах</button>
        </div>
      </form>
    </div>
  );
};

export default QuestionCreate;