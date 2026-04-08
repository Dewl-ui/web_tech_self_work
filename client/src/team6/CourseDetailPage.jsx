import { Link, useParams } from "react-router-dom";

const CourseDetailPage = () => {
  const { courseId } = useParams();

  return (
    <div className="space-y-6">
      <Link to="/team6/courses" className="text-sm text-gray-500 hover:underline">
        ← Сургалтууд руу буцах
      </Link>

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">CS201</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">2026 оны намар</span>
            </div>

            <h1 className="text-4xl font-bold">Өгөгдлийн бүтэц ба алгоритмууд</h1>
            <p className="text-gray-500 mt-2">
              Шалгалт, оюутнууд болон сургалтын материалыг удирдах
            </p>
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Шалгалт үүсгэх
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500">Оюутнууд</p>
            <p className="text-3xl font-bold">45</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500">Шалгалтууд</p>
            <p className="text-3xl font-bold">3</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500">Дундаж оноо</p>
            <p className="text-3xl font-bold">78.5%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Шалгалтууд</h2>
          <Link
            to={`/team6/courses/${courseId}/exams`}
            className="text-sm text-gray-600 hover:underline"
          >
            Бүгдийг харах
          </Link>
        </div>

        <div className="p-4 space-y-4">
          <div className="border rounded-xl p-4">
            <h3 className="font-semibold">Завсрын шалгалт - Мод ба графикууд</h3>
            <p className="text-gray-500 text-sm mt-1">
              Хоёртын мод, AVL мод, график алгоритмуудыг хамарсан цогц шалгалт
            </p>
            <p className="text-gray-500 text-sm mt-2">75 минут · 100 оноо · 25 асуулт · 12 оролцогч</p>
          </div>

          <div className="border rounded-xl p-4">
            <h3 className="font-semibold">Завсрын шалгалт - Мод ба графикууд</h3>
            <p className="text-gray-500 text-sm mt-1">
              Хоёртын мод, AVL мод, график алгоритмуудыг хамарсан цогц шалгалт
            </p>
            <p className="text-gray-500 text-sm mt-2">75 минут · 100 оноо · 25 асуулт · 12 оролцогч</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;