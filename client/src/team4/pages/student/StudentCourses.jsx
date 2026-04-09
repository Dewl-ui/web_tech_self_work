// Member C OWNS this file — /team4/student
import { useEffect, useState } from "react";
import { FiBook } from "react-icons/fi";
import { useAuth } from "../../utils/AuthContext";
import { getStudentCourses } from "./api/studentCourseApi";
import { useToast } from "../../components/ui/Toast";
import CourseCard from "./components/CourseCard";

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm animate-pulse">
      <div className="flex flex-col gap-3 p-4">
        <div className="h-3 w-2/3 rounded bg-zinc-100" />
        <div className="h-4 w-full rounded bg-zinc-100" />
        <div className="h-4 w-3/4 rounded bg-zinc-100" />
        <div className="h-3 w-1/2 rounded bg-zinc-100 mt-2" />
      </div>
      <div className="h-32 bg-zinc-100" />
    </div>
  );
}

export default function StudentCourses() {
  const { user, school } = useAuth();
  const toast = useToast();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  useEffect(() => {
    if (!user?.id) return;
    getStudentCourses(user.id)
      .then((data) => setEnrollments(data?.items ?? []))
      .catch((err) => {
        const msg = err.message || "Хичээлийн мэдээлэл авахад алдаа гарлаа.";
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100">
          <FiBook className="h-5 w-5 text-zinc-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Миний хичээлүүд</h1>
          {!loading && (
            <p className="text-sm text-zinc-500">
              {enrollments.length > 0
                ? `${enrollments.length} хичээлд бүртгэлтэй`
                : "Бүртгэлтэй хичээл байхгүй байна"}
            </p>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading skeleton grid */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && enrollments.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200
          bg-white py-16 text-center">
          <FiBook className="mb-3 h-10 w-10 text-zinc-300" />
          <p className="font-medium text-zinc-700">Хичээл байхгүй байна</p>
          <p className="mt-1 text-sm text-zinc-400">Та ямар нэг хичээлд бүртгэлгүй байна.</p>
        </div>
      )}

      {/* Course grid */}
      {!loading && enrollments.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => (
            <CourseCard
              key={enrollment.id ?? enrollment.course_id}
              enrollment={enrollment}
              schoolName={school?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
