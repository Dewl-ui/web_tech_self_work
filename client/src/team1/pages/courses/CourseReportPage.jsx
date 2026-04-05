import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourse } from "../../services/courseService";
import { getLessonsByCourse } from "../../services/lessonService";
import { getCourseUsers } from "../../services/courseUserService";
import {
  getAverageProgress,
  getSubmissionLessonCount,
  getUserProgress,
} from "../../utils/courseMetrics";
import {
  getCompletedLessonIds,
  getCurrentUserProfile,
  getErrorMessage,
} from "../../utils/school";

function formatName(user) {
  const fullName = `${user?.last_name || ""} ${user?.first_name || ""}`.trim();
  return fullName || user?.email || user?.username || "Сурагч";
}

export default function CourseReportPage() {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completionVersion, setCompletionVersion] = useState(0);

  useEffect(() => {
    const handleCompletionChange = () => setCompletionVersion((value) => value + 1);
    window.addEventListener("team1-lesson-completion-change", handleCompletionChange);
    return () =>
      window.removeEventListener("team1-lesson-completion-change", handleCompletionChange);
  }, []);

  useEffect(() => {
    Promise.all([getCourse(course_id), getLessonsByCourse(course_id), getCourseUsers(course_id)])
      .then(([courseItem, lessonItems, userItems]) => {
        setCourse(courseItem);
        setLessons(lessonItems || []);
        setStudents(userItems || []);
      })
      .catch((loadError) => {
        setError(getErrorMessage(loadError, "Хичээлийн тайлан ачаалж чадсангүй."));
      })
      .finally(() => setLoading(false));
  }, [course_id, completionVersion]);

  const submissionLessonCount = useMemo(
    () => getSubmissionLessonCount(lessons),
    [lessons]
  );

  const progressBaseCount = submissionLessonCount || lessons.length;
  const currentUser = getCurrentUserProfile();
  const currentUserId = String(
    currentUser?.id || currentUser?.email || currentUser?.username || ""
  );
  const localCompletedCount = getCompletedLessonIds(course_id).length;

  const studentProgress = useMemo(() => {
    return students.map((student, index) => ({
      ...student,
      name: formatName(student),
      progress: getUserProgress(
        student,
        progressBaseCount,
        String(student?.user_id || student?.id || student?.email || student?.username || "") ===
          currentUserId
          ? localCompletedCount
          : null
      ),
      key: `${student.user_id || student.id}-${index}`,
    }));
  }, [students, progressBaseCount, currentUserId, localCompletedCount]);

  const averageProgress = useMemo(
    () =>
      getAverageProgress(students, progressBaseCount, course?.progress || 0, {
        [currentUserId]: localCompletedCount,
      }),
    [students, progressBaseCount, course?.progress, currentUserId, localCompletedCount]
  );

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm">Ачаалж байна...</div>;
  }

  if (error) {
    return <div className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6 px-6 py-8">
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-3 text-sm text-indigo-500 hover:underline"
        >
          ← Буцах
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Хичээлийн тайлан</h1>
        <p className="mt-2 text-slate-500">{course?.name || "Хичээл"}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Нийт сурагч</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{students.length}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Нийт хичээлийн хэсэг</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{lessons.length}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Гүйцэтгэл авах хэсэг</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{submissionLessonCount}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Дундаж гүйцэтгэл</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{averageProgress}%</p>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Сурагчдын гүйцэтгэлийн хувь</h2>
        <p className="mt-1 text-sm text-slate-500">
          Гүйцэтгэл хүлээж авдаг {submissionLessonCount} хэсэг дээр үндэслэн тооцлоо.
        </p>

        <div className="mt-5 space-y-4">
          {studentProgress.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
              Энэ хичээлд бүртгэлтэй сурагч алга.
            </div>
          ) : (
            studentProgress.map((student) => (
              <div
                key={student.key}
                className="rounded-2xl border border-slate-100 px-4 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">{student.name}</p>
                    <p className="text-sm text-slate-400">
                      {student.email || student.username || "И-мэйл алга"}
                    </p>
                  </div>
                  <div className="text-lg font-bold text-indigo-600">{student.progress}%</div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-indigo-500"
                    style={{ width: `${student.progress}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
