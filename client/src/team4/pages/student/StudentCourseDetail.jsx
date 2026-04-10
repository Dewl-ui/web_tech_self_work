// Member C OWNS this file — /team4/student/courses/:courseId
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiBook, FiTag, FiInfo } from "react-icons/fi";
import { getCourseDetail, getAllCourseLessons } from "./api/studentCourseApi";
import { useToast } from "../../components/ui/Toast";

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

function decodeHtml(value) {
  if (!value) return "";
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function extractContentLinks(content) {
  if (!content || typeof content !== "string") return [];

  const links = [];
  const seen = new Set();
  const source = decodeHtml(content);

  const iframeRegex = /<iframe[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi;
  const urlRegex = /https?:\/\/[^\s"'<>]+/gi;

  for (const match of source.matchAll(iframeRegex)) {
    const url = match[1];
    if (!url || seen.has(url)) continue;
    seen.add(url);
    links.push(url);
  }

  for (const match of source.matchAll(urlRegex)) {
    const url = match[0];
    if (!url || seen.has(url)) continue;
    seen.add(url);
    links.push(url);
  }

  return links;
}

function isEmbeddable(url) {
  return /youtube\.com|youtu\.be|sharepoint\.com|office\.com/i.test(url);
}

export default function StudentCourseDetail() {
  const { courseId } = useParams();
  const toast = useToast();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!courseId) return;
    Promise.all([getCourseDetail(courseId), getAllCourseLessons(courseId)])
      .then(([courseData, lessonsData]) => {
        setCourse(courseData);
        setLessons(Array.isArray(lessonsData) ? lessonsData : []);
      })
      .catch((err) => {
        const msg = err.message || "Хичээлийн мэдээлэл авахад алдаа гарлаа.";
        setError(msg);
        toast.error(msg);
      })
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

          {/* Lessons */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-zinc-700">Хичээлийн контент</h2>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                {lessons.length} хичээл
              </span>
            </div>

            {lessons.length === 0 ? (
              <p className="text-sm text-zinc-500">Контент олдсонгүй.</p>
            ) : (
              <div className="space-y-2">
                {lessons
                  .slice()
                  .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
                  .map((lesson) => {
                    const typeName = lesson?.type?.name || "Тодорхойгүй төрөл";
                    const links = extractContentLinks(lesson.content);
                    const hasLinks = links.length > 0;

                    return (
                      <div
                        key={lesson.id}
                        className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-zinc-800">{lesson.name}</p>
                            <p className="mt-0.5 text-xs text-zinc-500">
                              {typeName}
                              {lesson.point ? ` • ${lesson.point} оноо` : ""}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-zinc-600 border border-zinc-200">
                            #{lesson.priority ?? "-"}
                          </span>
                        </div>

                        <div className="mt-2 grid gap-1 text-xs text-zinc-500 sm:grid-cols-3">
                          <span>{`Нээх: ${fmt(lesson.open_on)}`}</span>
                          <span>{`Хаах: ${fmt(lesson.close_on)}`}</span>
                          <span>{`Дуусах: ${fmt(lesson.end_on)}`}</span>
                        </div>

                        {(lesson.content || hasLinks) && (
                          <div className="mt-2 text-xs">
                            {hasLinks ? (
                              <div className="space-y-2">
                                {links.map((url) => (
                                  <div key={url} className="space-y-1">
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="block font-medium text-blue-600 hover:text-blue-700 hover:underline break-all"
                                    >
                                      {url}
                                    </a>
                                    {isEmbeddable(url) && (
                                      <iframe
                                        src={url}
                                        title={`${lesson.name}-${url}`}
                                        className="h-52 w-full rounded-md border border-zinc-200 bg-white"
                                        loading="lazy"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-zinc-600 wrap-break-word">{String(lesson.content)}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
