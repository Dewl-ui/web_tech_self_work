// Member C OWNS this file — /team4/student/courses/:courseId
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiBook, FiTag, FiInfo } from "react-icons/fi";
import { getCourseDetail } from "./api/studentCourseApi";

function fmt(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function courseStatus(startOn, endOn) {
  const now   = Date.now();
  const start = startOn ? new Date(startOn).getTime() : null;
  const end   = endOn   ? new Date(endOn).getTime()   : null;
  if (end && now > end)     return { label: "Дууссан",        color: "bg-zinc-100 text-zinc-600" };
  if (start && now < start) return { label: "Эхлээгүй",       color: "bg-yellow-100 text-yellow-700" };
  return                           { label: "Явагдаж байна",  color: "bg-green-100 text-green-700" };
}

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-zinc-100 last:border-0">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
        <Icon className="h-4 w-4 text-zinc-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="text-sm font-medium text-zinc-800">{value}</p>
      </div>
    </div>
  );
}

export default function StudentCourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!courseId) return;
    getCourseDetail(courseId)
      .then((data) => setCourse(data))
      .catch((err) => setError(err.message || "Хичээлийн мэдээлэл авахад алдаа гарлаа."))
      .finally(() => setLoading(false));
  }, [courseId]);

  const status = course ? courseStatus(course.start_on, course.end_on) : null;
  const hasImage = course?.picture && course.picture !== "no-image.jpg";

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      {/* Back link */}
      <Link
        to="/team4/student"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <FiArrowLeft className="h-4 w-4" />
        Хичээлүүд рүү буцах
      </Link>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-48 rounded-xl bg-zinc-100" />
          <div className="h-6 w-3/4 rounded bg-zinc-100" />
          <div className="h-4 w-1/3 rounded bg-zinc-100" />
          <div className="h-24 rounded-xl bg-zinc-100" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Course detail */}
      {!loading && course && (
        <>
          {/* Hero image */}
          {hasImage ? (
            <img
              src={course.picture}
              alt={course.name}
              className="h-48 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-48 rounded-xl bg-zinc-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-zinc-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}

          {/* Title + status */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-zinc-900 uppercase leading-snug">
                {course.name}
              </h1>
              {status && (
                <span className={`shrink-0 mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {course.description && (
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="mb-2 text-sm font-semibold text-zinc-700">Тайлбар</h2>
              <p className="text-sm leading-relaxed text-zinc-600">{course.description}</p>
            </div>
          )}

          {/* Info rows */}
          <div className="rounded-xl border border-zinc-200 bg-white px-5">
            <DetailRow
              icon={FiCalendar}
              label="Эхлэх огноо"
              value={fmt(course.start_on)}
            />
            <DetailRow
              icon={FiCalendar}
              label="Дуусах огноо"
              value={fmt(course.end_on)}
            />
            <DetailRow
              icon={FiBook}
              label="Кредит"
              value={course.credits != null ? `${course.credits} кредит` : null}
            />
            <DetailRow
              icon={FiTag}
              label="Үнэ"
              value={course.price != null ? `${course.price}₮` : "Үнэгүй"}
            />
            <DetailRow
              icon={FiInfo}
              label="Хичээлийн ID"
              value={String(course.id)}
            />
          </div>
        </>
      )}
    </div>
  );
}
