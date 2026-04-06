import { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { EmptyState, Skeleton } from "../../components/ui";
import { apiGet, getStoredUser, parseField } from "../../utils/api";

const COURSE_IMAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80",
  "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80",
];

function CourseCard({ course, index, loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-100 overflow-hidden bg-white">
        <Skeleton className="h-36 w-full rounded-none" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  const img = COURSE_IMAGES[index % COURSE_IMAGES.length];

  return (
    <div className="rounded-2xl border border-zinc-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow group">
      <div className="relative h-36 overflow-hidden bg-zinc-100">
        <img
          src={img}
          alt={course.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        {(course.code || course.teacher) && (
          <div className="absolute top-2.5 left-2.5 rounded-md bg-black/50 px-2 py-0.5 backdrop-blur-sm">
            <span className="text-[10px] font-semibold text-white/90">{course.code}</span>
            {course.teacher && (
              <span className="text-[10px] text-white/60 ml-1">{course.teacher}</span>
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-zinc-900 text-sm leading-snug line-clamp-2">
          {course.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <FiUser className="h-3.5 w-3.5" />
            <span>Оюутан : {course.userCount ?? 0}</span>
          </div>
          <Link
            to={`/team4/courses/${course.courseId}/users`}
            className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Дэлгэрэнгүй
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const storedUser = getStoredUser();

  // 1. Хэрэглэгч нэвтрээгүй бол зогсоох
  if (!storedUser?.id) { 
    console.warn("Хэрэглэгчийн ID олдсонгүй");
    setLoading(false); 
    return; 
  }

  // 2. Багшийн ID-аар хичээлүүдийг авах
  // Endpoint: /users/41/courses
  apiGet(`/users/${storedUser.id}/courses`)
    .then(async (data) => {
      const items = data?.items ?? [];
      
      if (items.length === 0) {
        setCourses([]);
        return;
      }

      const enriched = await Promise.all(
        items.map(async (item) => {
          // Swagger-ээс ирж буй 'course' объектыг задалж авах
          const c = parseField(item, "course") ?? item;
          const course_id = c.id ?? item.course_id;
          
          // Нэмэлт: Оюутны тоог авах (Endpoint: /courses/{id}/users)
          let studentCount = 0;
          try {
            const usersData = await apiGet(`/courses/${course_id}/users`);
            studentCount = usersData?.count ?? usersData?.items?.length ?? 0;
          } catch (e) {
            console.error(`${course_id} хичээлийн оюутан авахад алдаа:`, e);
          }

          return {
            courseId: course_id,
            name: c.name ?? c.title ?? `Хичээл #${course_id}`,
            code: c.code ?? "",
            teacher: c.teacher_name ?? "",
            userCount: studentCount
          };
        })
      );
      setCourses(enriched);
    })
    .catch((err) => {
      console.error("Хичээл ачааллахад алдаа:", err);
      setCourses([]);
    })
    .finally(() => setLoading(false));
}, []);
  const ghostCount = loading ? 0 : (3 - (courses.length % 3)) % 3;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <h1 className="text-xl font-semibold text-zinc-800">Миний хичээл</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <CourseCard key={i} loading course={{}} index={i} />
          ))
        ) : courses.length === 0 ? (
          <div className="col-span-3 py-16">
            <EmptyState title="Хичээл байхгүй" description="Танд одоогоор хичээл оноогдоогүй байна." />
          </div>
        ) : (
          <>
            {courses.map((course, i) => (
              <CourseCard key={course.courseId} course={course} index={i} loading={false} />
            ))}
            {Array.from({ length: ghostCount }).map((_, i) => (
              <div
                key={`ghost-${i}`}
                className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 h-[220px]"
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
