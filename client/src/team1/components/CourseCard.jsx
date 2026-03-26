import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/team1/courses/${course.id}`}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition block"
    >
      <div className={`h-24 ${course.color}`}></div>

      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-900 mb-4">
          {course.name}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Явц</span>
          <span className="text-indigo-500 font-semibold">{course.progress}%</span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div
            className="h-2 bg-indigo-500 rounded-full"
            style={{ width: `${course.progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>👤</span>
            <span>{course.teacher}</span>
          </div>
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="text-xl leading-none"
          >
            ⋮
          </button>
        </div>
      </div>
    </Link>
  );
}