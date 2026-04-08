import { Link } from "react-router-dom";

const courses = [
  {
    id: 1,
    code: "CS201",
    semester: "2026 оны намар",
    name: "Өгөгдлийн бүтэц ба алгоритмууд",
    students: 45,
    exams: 3,
  },
  {
    id: 2,
    code: "CS301",
    semester: "2026 оны намар",
    name: "Өгөгдлийн сангийн удирдлагын системүүд",
    students: 38,
    exams: 2,
  },
  {
    id: 3,
    code: "CS205",
    semester: "2026 оны намар",
    name: "Вэб хөгжүүлэлт",
    students: 52,
    exams: 4,
  },
  {
    id: 4,
    code: "CS302",
    semester: "2026 оны намар",
    name: "Үйлдлийн системүүд",
    students: 41,
    exams: 2,
  },
];

const CoursesPage = () => {
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Миний сургалтууд</h1>
          <p className="text-gray-500 mt-1">Хичээл, шалгалтаа удирдах</p>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          + Курс нэмэх
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            to={`/team6/courses/${course.id}`}
            key={course.id}
            className="bg-white rounded-2xl shadow p-6 block hover:shadow-md transition"
          >
            <p className="text-sm text-gray-400">{course.code}</p>
            <p className="font-semibold text-lg">{course.semester}</p>
            <h2 className="text-xl font-bold mt-3">{course.name}</h2>

            <div className="flex gap-8 mt-6 text-sm text-gray-600">
              <div>
                <p>Оюутнууд</p>
                <p className="text-xl font-bold text-black">{course.students}</p>
              </div>
              <div>
                <p>Шалгалтууд</p>
                <p className="text-xl font-bold text-black">{course.exams}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;