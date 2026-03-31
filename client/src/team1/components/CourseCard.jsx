import { useState } from "react";
import { useNavigate } from "react-router-dom";

const progressColors = ["#7C6FCD", "#7C6FCD", "#4DD9AC", "#29D4E6"];

export default function CourseCard({ course, index = 0, onHide }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(course.bookmarked || false);

  const progressColor = progressColors[index % progressColors.length];

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setBookmarked((prev) => !prev);
    setMenuOpen(false);
  };

  const handleHide = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (onHide) onHide(course.id);
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition relative"
      onClick={() => navigate(`/team1/courses/${course.id}`)}
    >
      {/* Cover */}
      <div className={`w-full h-44 ${course.color}`} />

      {/* Bookmark badge - тэмдэглэсэн бол харагдана */}
      {bookmarked && (
        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center shadow">
          ⭐
        </div>
      )}

      {/* Card body */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-base mb-3">{course.name}</h3>

        {/* Progress */}
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Явц</span>
          <span style={{ color: progressColor }} className="font-semibold">
            {course.progress}%
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full mb-4">
          <div
            className="h-1.5 rounded-full"
            style={{ width: `${course.progress}%`, backgroundColor: progressColor }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-xl">👤</span>
            <span>{course.teacher}</span>
          </div>

          {/* 3 цэг */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="text-gray-400 hover:text-gray-600 text-xl px-1"
              onClick={handleMenuToggle}
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="absolute right-0 bottom-8 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[150px] overflow-hidden">
                {/* Тэмдэглэх эсвэл Тэмдэглэхгүй */}
                <button
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={handleBookmark}
                >
                  {bookmarked ? "Тэмдэглэхгүй" : "Тэмдэглэх"}
                </button>

                {/* Хасах - жагсаалтаас нуух */}
                <button
                  className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 border-t border-gray-100"
                  onClick={handleHide}
                >
                  Хасах
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}