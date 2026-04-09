import { Link, useParams } from "react-router-dom";
import { examsByCourse } from "./mockData";

const ExamsPage = () => {
  const { courseId } = useParams();
  const exams = examsByCourse[courseId] || [];

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Бүх шалгалтууд</h1>
          <p className="text-gray-500 mt-1">Шалгалтуудаа удирдаж, хянана уу</p>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Шалгалт үүсгэх
        </button>
      </div>

      <div className="space-y-5">
        {exams.map((exam) => (
          <Link
            to={`/team6/exams/${exam.id}`}
            key={exam.id}
            className="block bg-white rounded-2xl shadow p-6 hover:shadow-md transition"
          >
            <h2 className="text-2xl font-semibold">{exam.title}</h2>
            <p className="text-sm text-gray-400 mt-1">{exam.course}</p>
            <p className="text-sm text-gray-500 mt-2">{exam.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-400">Хугацаа</p>
                <p className="font-semibold">{exam.duration}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Оноо</p>
                <p className="font-semibold">{exam.score}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Асуултууд</p>
                <p className="font-semibold">{exam.questions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Эхлэх цаг</p>
                <p className="font-semibold">{exam.start}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Аналитик харах
        </button>
      </div>
    </div>
  );
};

export default ExamsPage;