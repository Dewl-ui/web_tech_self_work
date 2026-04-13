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
  FiSend,
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
  getLessonSubmissions,
  submitLessonAssignment,
  updateLessonSubmission,
} from "./api/studentCourseApi";
import { useToast } from "../../components/ui/Toast";

function fmt(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function fmtDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${fmt(dateStr)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function courseStatus(startOn, endOn) {
  const now = Date.now();
  const start = startOn ? new Date(startOn).getTime() : null;
  const end = endOn ? new Date(endOn).getTime() : null;
  if (end && now > end) return { label: "Дууссан", color: "bg-zinc-100 text-zinc-600" };
  if (start && now < start) return { label: "Эхлээгүй", color: "bg-yellow-100 text-yellow-700" };
  return { label: "Явагдаж байна", color: "bg-green-100 text-green-700" };
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

const TABS = [
  { id: "info", label: "Тайлбар", icon: FiInfo },
  { id: "teachers", label: "Багш", icon: FiUsers },
  { id: "lessons", label: "Контент", icon: FiBook },
  { id: "exams", label: "Шалгалт", icon: FiClipboard },
  { id: "grades", label: "Дүн", icon: FiAward },
];

export default function StudentCourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("info");
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [exams, setExams] = useState([]);
  const [gradeExams, setGradeExams] = useState([]);
  const [gradeSubs, setGradeSubs] = useState([]);
  const [gradeAtts, setGradeAtts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    Promise.all([
      getCourseDetail(courseId),
      getAllCourseLessons(courseId),
      getCourseTeachers(courseId).catch(() => ({ items: [] })),
      getCourseExams(courseId).catch(() => ({ items: [] })),
      getGradebookExams(courseId).catch(() => ({ items: [] })),
      getGradebookSubmissions(courseId).catch(() => ({ items: [] })),
      getGradebookAttendances(courseId).catch(() => ({ items: [] })),
    ])
      .then(([c, lessonsData, teachersRes, examsRes, gE, gS, gA]) => {
        setCourse(c);
        setLessons(Array.isArray(lessonsData) ? lessonsData : []);
        setTeachers(teachersRes?.items ?? []);
        setExams(examsRes?.items ?? []);
        setGradeExams(gE?.items ?? []);
        setGradeSubs(gS?.items ?? []);
        setGradeAtts(gA?.items ?? []);
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

  const totals = useMemo(() => {
    const examTotal = gradeExams.reduce((s, r) => s + (Number(r.grade_point) || 0), 0);
    const subTotal = gradeSubs.reduce((s, r) => s + (Number(r.grade_point) || 0), 0);
    const attTotal = gradeAtts.reduce((s, r) => s + (Number(r.grade_point) || 0), 0);
    return { examTotal, subTotal, attTotal, total: examTotal + subTotal + attTotal };
  }, [gradeExams, gradeSubs, gradeAtts]);

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
          {hasImage ? (
            <img src={course.picture} alt={course.name} className="h-48 w-full rounded-xl object-cover" />
          ) : (
            <div className="flex items-center justify-center h-48 rounded-xl bg-zinc-100">
              <FiBook className="h-20 w-20 text-zinc-300" />
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-zinc-900 uppercase leading-snug">{course.name}</h1>
            {status && (
              <span className={`shrink-0 mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                {status.label}
              </span>
            )}
          </div>

          {/* Tabs */}
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

          {/* Tab content */}
          {activeTab === "info" && (
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
          )}

          {activeTab === "teachers" && (
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              {teachers.length === 0 ? (
                <p className="text-sm text-zinc-400">Багш бүртгэгдээгүй.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {teachers.map((t) => {
                    const fullName = [t.last_name, t.first_name].filter((x) => x && x !== "-").join(" ") || t.email;
                    const pic = t.picture && t.picture !== "no-image.jpg" ? t.picture : null;
                    return (
                      <div key={t.id} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                        {pic ? (
                          <img src={pic} alt={fullName} className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                            <FiUsers className="h-5 w-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-800">{fullName}</p>
                          <p className="truncate text-xs text-zinc-500">{t.email}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "lessons" && (
            <LessonsTab lessons={lessons} userId={user?.id} toast={toast} />
          )}

          {activeTab === "exams" && (
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              {exams.length === 0 ? (
                <p className="text-sm text-zinc-400">Шалгалт байхгүй.</p>
              ) : (
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
                          {isOpen ? (
                            <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                              Нээлттэй
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                              Хаалттай
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "grades" && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-4">
                <GradeStat label="Шалгалт" value={totals.examTotal} icon={FiClipboard} />
                <GradeStat label="Даалгавар" value={totals.subTotal} icon={FiFileText} />
                <GradeStat label="Ирц" value={totals.attTotal} icon={FiCalendar} />
                <GradeStat label="Нийт" value={totals.total} icon={FiAward} highlight />
              </div>

              <GradeTable
                title="Шалгалтын дүн"
                rows={gradeExams}
                resolveName={(row) => exams.find((e) => e.id === row.exam_id)?.name || `Шалгалт #${row.exam_id}`}
              />

              <GradeTable
                title="Даалгаврын дүн"
                rows={gradeSubs}
                resolveName={(row) => lessons.find((l) => l.id === row.lesson_id)?.name || `Хичээл #${row.lesson_id}`}
              />

              <GradeTable
                title="Ирцийн дүн"
                rows={gradeAtts}
                resolveName={(row) => lessons.find((l) => l.id === row.lesson_id)?.name || `Хичээл #${row.lesson_id}`}
              />
            </div>
          )}
        </>
      )}
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

function GradeTable({ title, rows, resolveName }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold text-zinc-700">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-zinc-400">Дүн бүртгэгдээгүй.</p>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between py-2 text-sm">
              <span className="truncate text-zinc-700">{resolveName(row)}</span>
              <span className="font-semibold text-zinc-900">{row.grade_point ?? 0}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LessonsTab({ lessons, userId, toast }) {
  return (
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
            .map((lesson) => (
              <LessonRow key={lesson.id} lesson={lesson} userId={userId} toast={toast} />
            ))}
        </div>
      )}
    </div>
  );
}

function LessonRow({ lesson, userId, toast }) {
  const [submissions, setSubmissions] = useState(null);
  const [showSubmitBox, setShowSubmitBox] = useState(false);
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  const typeName = lesson?.type?.name || "Тодорхойгүй төрөл";
  const links = extractContentLinks(lesson.content);
  const hasSubmission = Number(lesson.has_submission) === 1;

  async function loadSubmissions() {
    try {
      const res = await getLessonSubmissions(lesson.id);
      const items = res?.items ?? [];
      setSubmissions(items);
      const mine = items.find((s) => s.user_id === userId);
      if (mine) setContent(mine.content || "");
    } catch (err) {
      toast.error(err.message || "Даалгаврын мэдээлэл ачааллахад алдаа гарлаа.");
    }
  }

  async function handleSubmit() {
    if (!content.trim()) {
      toast.error("Агуулгаа бөглөнө үү.");
      return;
    }
    setBusy(true);
    try {
      const mine = submissions?.find((s) => s.user_id === userId);
      if (mine) {
        await updateLessonSubmission(mine.id, lesson.id, userId, content);
        toast.success("Даалгаврыг шинэчиллээ.");
      } else {
        await submitLessonAssignment(lesson.id, userId, content);
        toast.success("Даалгаврыг илгээлээ.");
      }
      await loadSubmissions();
      setShowSubmitBox(false);
    } catch (err) {
      toast.error(err.message || "Илгээхэд алдаа гарлаа.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-800">{lesson.name}</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {typeName}
            {lesson.point ? ` • ${lesson.point} оноо` : ""}
            {hasSubmission ? " • Даалгавар" : ""}
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

      {(lesson.content || links.length > 0) && (
        <div className="mt-2 text-xs">
          {links.length > 0 ? (
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
                      allowFullScreen
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-600 break-words">{String(lesson.content)}</p>
          )}
        </div>
      )}

      {hasSubmission && userId && (
        <div className="mt-3 space-y-2 border-t border-zinc-200 pt-2">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (submissions === null) loadSubmissions();
                setShowSubmitBox((v) => !v);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              <FiSend className="h-3 w-3" />
              {showSubmitBox ? "Хаах" : "Даалгавар илгээх"}
            </button>
            {submissions && (
              <span className="text-xs text-zinc-500">{submissions.length} илгээлт</span>
            )}
          </div>
          {showSubmitBox && (
            <div className="space-y-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="Илгээх агуулга..."
                className="w-full rounded-md border border-zinc-200 bg-white p-2 text-sm focus:border-zinc-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={busy}
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                {busy ? "Илгээж байна..." : "Илгээх"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
