import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiBook,
  FiTag,
  FiInfo,
  FiUsers,
  FiClipboard,
  FiAward,
  FiFileText,
} from "react-icons/fi";
import { useAuth } from "../../utils/AuthContext";
import {
  getCourseDetail,
  getAllCourseLessons,
  getCourseTeachers,
  getCourseExams,
  getGradebookExams,
  getGradebookSubmissions,
  getGradebookAttendances,
} from "./api/studentCourseApi";
import { useStudentData } from "./hooks";
import { useToast } from "../../components/ui/Toast";
import { fmt, fmtDateTime, courseStatus, avatarSrc } from "./utils";
import LessonRow from "./components/LessonRow";
import GradeTable from "./components/GradeTable";

const TABS = [
  { id: "info",     label: "Тайлбар", icon: FiInfo },
  { id: "teachers", label: "Багш",    icon: FiUsers },
  { id: "lessons",  label: "Контент", icon: FiBook },
  { id: "exams",    label: "Шалгалт", icon: FiClipboard },
  { id: "grades",   label: "Дүн",     icon: FiAward },
];

export default function StudentCourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("info");

  const { data: course, loading, error } = useStudentData(
    () => getCourseDetail(courseId),
    [courseId]
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to="/team4/student"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <FiArrowLeft className="h-4 w-4" />
        Хичээлүүд рүү буцах
      </Link>

      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-48 rounded-xl bg-zinc-100" />
          <div className="h-6 w-3/4 rounded bg-zinc-100" />
          <div className="h-24 rounded-xl bg-zinc-100" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && course && (
        <>
          <CourseHeader course={course} />

          <div className="flex flex-wrap gap-1 border-b border-zinc-200">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-b-2 border-zinc-900 text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === "info"     && <InfoTab course={course} />}
          {activeTab === "teachers" && <TeachersTab courseId={courseId} toast={toast} />}
          {activeTab === "lessons"  && <LessonsTab courseId={courseId} userId={user?.id} toast={toast} />}
          {activeTab === "exams"    && <ExamsTab courseId={courseId} toast={toast} />}
          {activeTab === "grades"   && <GradesTab courseId={courseId} toast={toast} />}
        </>
      )}
    </div>
  );
}

function CourseHeader({ course }) {
  const status = courseStatus(course.start_on, course.end_on);
  const hasImage = course.picture && course.picture !== "no-image.jpg";

  return (
    <>
      {hasImage ? (
        <img src={course.picture} alt={course.name} className="h-48 w-full rounded-xl object-cover" />
      ) : (
        <div className="flex items-center justify-center h-48 rounded-xl bg-zinc-100">
          <FiBook className="h-20 w-20 text-zinc-300" />
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <h1 className="text-2xl font-bold text-zinc-900 uppercase leading-snug">{course.name}</h1>
        <span className={`shrink-0 mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>
    </>
  );
}

function InfoTab({ course }) {
  return (
    <div className="space-y-4">
      {course.description && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-2 text-sm font-semibold text-zinc-700">Тайлбар</h2>
          <p className="text-sm leading-relaxed text-zinc-600">{course.description}</p>
        </div>
      )}
      <div className="rounded-xl border border-zinc-200 bg-white px-5">
        <DetailRow icon={FiCalendar} label="Эхлэх огноо" value={fmt(course.start_on)} />
        <DetailRow icon={FiCalendar} label="Дуусах огноо" value={fmt(course.end_on)} />
        <DetailRow icon={FiBook} label="Кредит" value={course.credits != null ? `${course.credits} кредит` : null} />
        <DetailRow icon={FiTag} label="Үнэ" value={course.price != null ? `${course.price}₮` : "Үнэгүй"} />
        <DetailRow icon={FiInfo} label="Хичээлийн ID" value={String(course.id)} />
      </div>
    </div>
  );
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

function TabPanel({ loading, empty, emptyText = "Мэдээлэл байхгүй.", children }) {
  if (loading) return <div className="h-24 animate-pulse rounded-xl bg-zinc-100" />;
  if (empty) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <p className="text-sm text-zinc-400">{emptyText}</p>
      </div>
    );
  }
  return children;
}

function TeachersTab({ courseId }) {
  const { data, loading } = useStudentData(
    () => getCourseTeachers(courseId).catch(() => ({ items: [] })),
    [courseId]
  );
  const teachers = data?.items ?? [];

  return (
    <TabPanel loading={loading} empty={teachers.length === 0} emptyText="Багш бүртгэгдээгүй.">
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {teachers.map((t) => {
            const name = [t.last_name, t.first_name].filter((x) => x && x !== "-").join(" ") || t.email;
            const pic = avatarSrc(t.picture);
            return (
              <div key={t.id} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                {pic ? (
                  <img src={pic} alt={name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                    <FiUsers className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-800">{name}</p>
                  <p className="truncate text-xs text-zinc-500">{t.email}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TabPanel>
  );
}

function LessonsTab({ courseId, userId }) {
  const { data, loading } = useStudentData(
    () => getAllCourseLessons(courseId),
    [courseId]
  );
  const lessons = Array.isArray(data) ? data : [];

  return (
    <TabPanel loading={loading} empty={lessons.length === 0} emptyText="Контент олдсонгүй.">
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-zinc-700">Хичээлийн контент</h2>
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
            {lessons.length} хичээл
          </span>
        </div>
        <div className="space-y-2">
          {lessons
            .slice()
            .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
            .map((lesson) => (
              <LessonRow key={lesson.id} lesson={lesson} userId={userId} />
            ))}
        </div>
      </div>
    </TabPanel>
  );
}

function ExamsTab({ courseId }) {
  const { data, loading } = useStudentData(
    () => getCourseExams(courseId).catch(() => ({ items: [] })),
    [courseId]
  );
  const exams = data?.items ?? [];

  return (
    <TabPanel loading={loading} empty={exams.length === 0} emptyText="Шалгалт байхгүй.">
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="space-y-2">
          {exams.map((exam) => {
            const now = Date.now();
            const open = exam.open_on ? new Date(exam.open_on).getTime() : null;
            const close = exam.close_on ? new Date(exam.close_on).getTime() : null;
            const isOpen = open && close && now >= open && now <= close;
            return (
              <div key={exam.id} className="rounded-lg border border-zinc-100 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-800">{exam.name}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {fmtDateTime(exam.open_on)} — {fmtDateTime(exam.close_on)}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Нийт: {exam.total_point} оноо • {exam.duration} мин • Оролдлого: {exam.max_attempt}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isOpen ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"
                  }`}>
                    {isOpen ? "Нээлттэй" : "Хаалттай"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TabPanel>
  );
}

function GradesTab({ courseId }) {
  const { data, loading } = useStudentData(
    async () => {
      const [gE, gS, gA, examsRes, lessonsRes] = await Promise.all([
        getGradebookExams(courseId).catch(() => ({ items: [] })),
        getGradebookSubmissions(courseId).catch(() => ({ items: [] })),
        getGradebookAttendances(courseId).catch(() => ({ items: [] })),
        getCourseExams(courseId).catch(() => ({ items: [] })),
        getAllCourseLessons(courseId).catch(() => []),
      ]);
      return {
        gradeExams: gE?.items ?? [],
        gradeSubs: gS?.items ?? [],
        gradeAtts: gA?.items ?? [],
        exams: examsRes?.items ?? [],
        lessons: Array.isArray(lessonsRes) ? lessonsRes : [],
      };
    },
    [courseId]
  );

  const totals = useMemo(() => {
    if (!data) return { examTotal: 0, subTotal: 0, attTotal: 0, total: 0 };
    const sum = (arr) => arr.reduce((s, r) => s + (Number(r.grade_point) || 0), 0);
    const examTotal = sum(data.gradeExams);
    const subTotal = sum(data.gradeSubs);
    const attTotal = sum(data.gradeAtts);
    return { examTotal, subTotal, attTotal, total: examTotal + subTotal + attTotal };
  }, [data]);

  if (loading || !data) return <div className="h-24 animate-pulse rounded-xl bg-zinc-100" />;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <GradeStat label="Шалгалт" value={totals.examTotal} icon={FiClipboard} />
        <GradeStat label="Даалгавар" value={totals.subTotal} icon={FiFileText} />
        <GradeStat label="Ирц" value={totals.attTotal} icon={FiCalendar} />
        <GradeStat label="Нийт" value={totals.total} icon={FiAward} highlight />
      </div>

      <GradeTable
        title="Шалгалтын дүн"
        rows={data.gradeExams}
        resolveName={(row) => data.exams.find((e) => e.id === row.exam_id)?.name || `Шалгалт #${row.exam_id}`}
      />
      <GradeTable
        title="Даалгаврын дүн"
        rows={data.gradeSubs}
        resolveName={(row) => data.lessons.find((l) => l.id === row.lesson_id)?.name || `Хичээл #${row.lesson_id}`}
      />
      <GradeTable
        title="Ирцийн дүн"
        rows={data.gradeAtts}
        resolveName={(row) => data.lessons.find((l) => l.id === row.lesson_id)?.name || `Хичээл #${row.lesson_id}`}
      />
    </div>
  );
}

function GradeStat({ label, value, icon: Icon, highlight }) {
  return (
    <div className={`rounded-lg border p-3 ${highlight ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white"}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${highlight ? "text-white" : "text-zinc-500"}`} />
        <p className={`text-xs ${highlight ? "text-zinc-300" : "text-zinc-500"}`}>{label}</p>
      </div>
      <p className={`mt-1 text-xl font-bold ${highlight ? "text-white" : "text-zinc-900"}`}>{value}</p>
    </div>
  );
}
