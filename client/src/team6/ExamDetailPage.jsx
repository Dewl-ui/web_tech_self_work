import { useParams } from "react-router-dom";
import { examDetails } from "./mockData";

const ExamDetailPage = () => {
  const { examId } = useParams();
  const exam = examDetails[examId];

  if (!exam) {
    return <div className="text-red-500">Шалгалтын мэдээлэл олдсонгүй.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{exam.title}</h1>
            <p className="text-sm text-gray-500 mt-2">{exam.description}</p>
            <p className="text-sm text-gray-400">{exam.course}</p>
          </div>

          <div className="flex gap-3">
            <button className="border px-4 py-2 rounded-lg">Засварлах</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Тайлан харах
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-4 border-t">
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
          <div>
            <p className="text-sm text-gray-400">Хувилбар</p>
            <p className="font-semibold">{exam.variants.length}</p>
          </div>
        </div>
      </div>

      {exam.variants.map((variant, variantIndex) => (
        <div key={variantIndex} className="bg-white rounded-2xl shadow">
          <div className="p-4 border-b">
            <h2 className="text-2xl font-semibold">{variant.name}</h2>
          </div>

          <div className="p-4 space-y-4">
            {variant.questions.map((question) => (
              <div key={question.id} className="border rounded-xl p-4">
                <p className="text-sm text-gray-400">
                  {question.type} · {question.point} оноо
                </p>
                <h3 className="font-semibold mt-2">{question.text}</h3>

                <div className="mt-4 space-y-2 text-sm">
                  {question.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={idx === question.correct ? "text-green-600 font-semibold" : ""}
                    >
                      {String.fromCharCode(65 + idx)}. {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExamDetailPage;