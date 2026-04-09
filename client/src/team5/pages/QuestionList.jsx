import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getQuestions, deleteQuestion } from '../api'

const COURSE_ID = 1 // өөрийн course_id-г тавих

export default function QuestionList() {
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    getQuestions(COURSE_ID).then(data => setQuestions(data.items || []))
  }, [])

  async function handleDelete(id) {
    if (confirm('Устгах уу?')) {
      await deleteQuestion(id)
      setQuestions(questions.filter(q => q.id !== id))
    }
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Асуултын жагсаалт</h1>
        <Link to="create" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Асуулт нэмэх
        </Link>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Асуулт</th>
            <th className="border p-2">Төрөл</th>
            <th className="border p-2">Түвшин</th>
            <th className="border p-2">Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(q => (
            <tr key={q.id}>
              <td className="border p-2">{q.question}</td>
              <td className="border p-2">{q.type_id}</td>
              <td className="border p-2">{q.level_id}</td>
              <td className="border p-2 space-x-2">
                <Link to={`${q.id}`} className="text-blue-600">Харах</Link>
                <Link to={`${q.id}/edit`} className="text-yellow-600">Засах</Link>
                <button onClick={() => handleDelete(q.id)} className="text-red-600">Устгах</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}