import { useNavigate } from "react-router-dom";

const progressColors = ["#7C6FCD", "#7C6FCD", "#4DD9AC", "#29D4E6"];
const gradientCovers = [
  "linear-gradient(135deg, #ec4899, #6366f1)",
  "linear-gradient(135deg, #3b82f6, #06b6d4)",
  "linear-gradient(135deg, #22c55e, #84cc16)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
];

export default function CourseCard({
  course,
  index = 0,
  onHide,
  onEdit,
  onDelete,
  onBookmarkToggle,
  onMenuToggle,
  menuOpen = false,
  isTeacherOrAdmin = false,
}) {
  const navigate = useNavigate();
  const bookmarked = course.bookmarked || false;
  const progressColor = progressColors[index % progressColors.length];
  const background =
    gradientCovers[(Number(course.id) || index) % gradientCovers.length];

  const handleMenuToggle = (event) => {
    event.stopPropagation();
    onMenuToggle?.(course.id);
  };

  const handleBookmark = (event) => {
    event.stopPropagation();
    onBookmarkToggle?.(course.id);
  };

  const handleHide = (event) => {
    event.stopPropagation();
    onHide?.(course.id);
  };

  const handleEditClick = (event) => {
    event.stopPropagation();
    onEdit?.(course.id);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDelete?.(course.id);
  };

  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-[20px] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.08)] transition hover:shadow-[0_10px_30px_rgba(15,23,42,0.12)]"
      onClick={() => navigate(`/team1/courses/${course.id}`)}
    >
      <div className="h-[120px]" style={{ background }} />

      {isTeacherOrAdmin ? (
        <div className="absolute right-3 top-3 flex gap-1.5">
          <button
            type="button"
            onClick={handleEditClick}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-sm shadow hover:bg-white"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-sm shadow hover:bg-white"
          >
            🗑
          </button>
        </div>
      ) : null}

      {bookmarked ? (
        <div className="absolute right-3 top-14 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 shadow">
          ★
        </div>
      ) : null}

      <div className="p-4">
        <h3 className="mb-3 text-base font-bold text-gray-800">{course.name}</h3>

        <div className="mb-1 flex justify-between text-xs text-gray-400">
          <span>Явц</span>
          <span style={{ color: progressColor }} className="font-semibold">
            {course.progress || 0}%
          </span>
        </div>
        <div className="mb-4 h-1.5 rounded-full bg-gray-100">
          <div
            className="h-1.5 rounded-full"
            style={{
              width: `${course.progress || 0}%`,
              backgroundColor: progressColor,
            }}
          />
        </div>

        <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
          <span>Сурагч</span>
          <span className="font-semibold text-slate-600">
            {course.studentCount || 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-xl">👤</span>
            <span>{course.teacher}</span>
          </div>

          <div className="relative" onClick={(event) => event.stopPropagation()}>
            <button
              className="px-1 text-xl text-gray-400 hover:text-gray-600"
              onClick={handleMenuToggle}
            >
              ⋮
            </button>

            {menuOpen ? (
              <div className="absolute bottom-8 right-0 z-50 min-w-[160px] overflow-hidden rounded-xl bg-white shadow-[0_10px_25px_rgba(15,23,42,0.15)]">
                <button
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                  onClick={handleBookmark}
                >
                  {bookmarked ? "Тэмдэглэхгүй" : "Тэмдэглэх"}
                </button>

                <button
                  className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50"
                  onClick={handleHide}
                >
                  Хасах
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
