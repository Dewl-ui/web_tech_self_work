import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lessonAPI } from "../api";

const CURRENT_USER = { id: 4, name: "Оюутан С", role_id: 3 }; // 3=student

const MOCK_LECTURE = {
  id: 1, name: "Лекц - 1",
  type: { name: "Лекц" },
  content: "Энэ хичээлд веб системийн үндсэн ойлголтуудыг авч үзнэ.",
  video_url: "https://www.youtube.com/watch?v=vDfR1qjONW0",
  files: [
    { id: 1, name: "Лекц", type: "PDF Document", size: "2.4 MB", icon: "pdf" },
    { id: 2, name: "Лекц", type: "PDF Document", size: "1.8 MB", icon: "doc" },
  ],
};

const MOCK_LAB = {
  id: 2, name: "Лаборатори - 1",
  type: { name: "Лаборатори" },
  open_date: "Нээгдсэн: ням, 25 нэгдүгээр сар 2026, 12:00 AM",
  description: "ТАЙЛБАР",
  content: "",
  files: [
    { id: 1, name: "Сем", type: "PDF Document", size: "2.4 MB", icon: "pdf" },
    { id: 2, name: "Сем", type: "PDF Document", size: "1.8 MB", icon: "doc" },
  ],
};

// ===== File Icon =====
function FileIcon({ type }) {
  if (type === "pdf") return (
    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-500 font-bold text-xs flex-shrink-0">PDF</div>
  );
  return (
    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500 font-bold text-xs flex-shrink-0">DOC</div>
  );
}

// ===== File Card =====
function FileCard({ file }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <FileIcon type={file.icon} />
        <div>
          <p className="font-semibold text-gray-700 text-sm">{file.name}</p>
          <p className="text-xs text-gray-400">{file.type} • {file.size}</p>
        </div>
      </div>
      <button className="flex items-center gap-1 text-indigo-500 text-xs font-medium hover:underline w-fit">
        ⬇ Татаж авах
      </button>
    </div>
  );
}

// ===== Upload Section =====
function UploadSection({ onSubmit, onCancel }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
        onClick={() => document.getElementById("file-upload-input").click()}
        className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center gap-3 cursor-pointer transition ${
          dragging ? "border-indigo-400 bg-indigo-50" : "border-indigo-300 bg-white hover:bg-indigo-50"
        }`}
      >
        <div className="text-4xl text-indigo-400">⬆</div>
        <p className="text-sm text-gray-500">select your file or drag and drop</p>
        <p className="text-xs text-gray-400">img, gif, jpg, doc, docx, pdf, txt</p>
        <button type="button" className="px-5 py-1.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600">
          browse
        </button>
        <input id="file-upload-input" type="file" className="hidden"
          onChange={(e) => setFile(e.target.files[0])} />
      </div>

      {file && (
        <div className="mt-3 flex items-center gap-2 bg-indigo-50 rounded-xl px-4 py-2 text-sm text-indigo-700">
          📎 {file.name}
          <button onClick={() => setFile(null)} className="ml-auto text-gray-400 hover:text-red-400">✕</button>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
          Цуцлах
        </button>
        <button onClick={() => file && onSubmit(file)}
          className={`px-6 py-2 rounded-xl text-sm font-medium text-white transition ${
            file ? "bg-indigo-500 hover:bg-indigo-600" : "bg-gray-300 cursor-not-allowed"
          }`}>
          Байршуулах
        </button>
      </div>
    </div>
  );
}

export default function LessonDetailPage() {
  const { course_id, lesson_id } = useParams();
  const navigate = useNavigate();
  const isTeacher = CURRENT_USER.role_id === 1 || CURRENT_USER.role_id === 2;
  const isStudent = CURRENT_USER.role_id === 3;

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);   // upload хэсэг харагдах эсэх
  const [submitted, setSubmitted] = useState(false);     // илгээсэн эсэх
  const assignmentRef = useRef(null);                    // scroll target

  useEffect(() => {
    lessonAPI.getOne(course_id, lesson_id)
      .then((data) => setLesson(data))
      .catch(() => {
        setLesson(Number(lesson_id) % 2 === 0 ? MOCK_LAB : MOCK_LECTURE);
      })
      .finally(() => setLoading(false));
  }, [course_id, lesson_id]);

  // "Даалгавар илгээх" товч дарахад upload хэсэг нээж scroll хийнэ
  const handleOpenUpload = () => {
    setShowUpload(true);
    setTimeout(() => {
      assignmentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleSubmit = (file) => {
    console.log("Илгээж байна:", file.name);
    // TODO: API submission call
    setSubmitted(true);
    setShowUpload(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-indigo-500 font-semibold animate-pulse">
      Уншиж байна...
    </div>
  );

  if (!lesson) return <div className="p-8 text-gray-500">Сэдэв олдсонгүй.</div>;

  const typeName = lesson.type?.name || "Лекц";
  const isLecture = typeName === "Лекц";
  const files = lesson.files || [];
  const embedUrl = lesson.video_url
    ? lesson.video_url.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")
    : null;

  return (
    <div className="px-8 py-6 max-w-4xl mx-auto">

      {/* ===== ЛЕКЦ ===== */}
      {isLecture && (
        <>
          {files.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-700 mb-3">{typeName} Материал</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {files.map((f) => <FileCard key={f.id} file={f} />)}
              </div>
            </div>
          )}

          {embedUrl && (
            <div className="bg-black rounded-2xl overflow-hidden mb-4">
              <iframe src={embedUrl} className="w-full" height="380"
                allowFullScreen title="Lesson video" />
              <div className="px-5 py-3 bg-white">
                <p className="font-semibold text-gray-800">{lesson.name}</p>
              </div>
            </div>
          )}

          {lesson.content && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 text-sm text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: lesson.content }} />
          )}

          {/* Товчнууд */}
          <div className="flex items-center justify-between mt-6">
            {/* Даалгавар товч - доош scroll хийж upload гаргана */}
            <button onClick={handleOpenUpload}
              className="px-6 py-2 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition text-sm">
              Даалгавар
            </button>
            <button onClick={() => navigate(`/team1/courses/${course_id}`)}
              className="px-6 py-2 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition text-sm">
              Буцах
            </button>
          </div>

          {/* Upload хэсэг — Даалгавар дарсны дараа гарч ирнэ */}
          {showUpload && !submitted && (
            <div ref={assignmentRef} className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Даалгаврын гүйцэтгэл нэмэх</h3>
              <UploadSection onSubmit={handleSubmit} onCancel={() => setShowUpload(false)} />
            </div>
          )}

          {submitted && (
            <div className="mt-6 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-medium">
              ✅ Даалгавар амжилттай илгээгдлээ!
            </div>
          )}
        </>
      )}

      {/* ===== ЛАБ / СЕМ / БИЕ ДААЛТ ===== */}
      {!isLecture && (
        <>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Даалгавар</h2>

          {/* Мэдээлэл */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
            {lesson.open_date && <p className="text-sm text-gray-600 mb-2">{lesson.open_date}</p>}
            {lesson.description && <p className="font-semibold text-gray-800">{lesson.description}</p>}
            {lesson.content && (
              <div className="text-gray-600 text-sm mt-2 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: lesson.content }} />
            )}
          </div>

          {/* Файлууд */}
          {files.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {files.map((f) => <FileCard key={f.id} file={f} />)}
            </div>
          )}

          {/* Амжилттай илгээсэн */}
          {submitted && (
            <div className="mb-5 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-medium">
              ✅ Даалгавар амжилттай илгээгдлээ!
            </div>
          )}

          {/* "Даалгавар илгээх" товч — upload хаалттай үед харагдана */}
          {isStudent && !submitted && !showUpload && (
            <button onClick={handleOpenUpload}
              className="px-6 py-2 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition text-sm">
              Даалгавар илгээх
            </button>
          )}

          {/* Upload section — товч дарсны дараа гарч ирнэ */}
          {showUpload && !submitted && (
            <div ref={assignmentRef} className="mt-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Даалгаврын гүйцэтгэл нэмэх</h3>
              <UploadSection onSubmit={handleSubmit} onCancel={() => setShowUpload(false)} />
            </div>
          )}

          {/* Гүйцэтгэлийн төлөв — upload хаалттай, илгээгдээгүй үед */}
          {!showUpload && !submitted && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Даалгаврын гүйцэтгэлийн төлөв</h3>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {[
                  ["Даалгаврын гүйцэтгэлийн төлөв", "Даалгаврын гүйцэтгэлийг хараахан үүсгэгүй байна"],
                  ["Дүгнэсэн төлөв", "Дүгнээгүй"],
                  ["Хамгийн сүүл өөрчлөгдсөн", "-"],
                  ["Илгээх материалд тайлбар хийх", "▶ Сэтгэгдүүд (0)"],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-2 px-5 py-3 border-b border-gray-100 last:border-b-0 text-sm">
                    <span className="font-semibold text-gray-700">{label}</span>
                    <span className="text-gray-500">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button onClick={() => navigate(`/team1/courses/${course_id}`)}
              className="px-6 py-2 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition text-sm">
              Буцах
            </button>
          </div>
        </>
      )}

      {/* Багшид засах товч */}
      {isTeacher && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button onClick={() => navigate(`/team1/courses/${course_id}/lessons/${lesson_id}/edit`)}
            className="px-5 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition text-sm">
            ✎ Засах
          </button>
        </div>
      )}
    </div>
  );
}