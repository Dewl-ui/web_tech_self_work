import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTeam1Role from "../../hooks/useTeam1Role";
import { getCourse } from "../../services/courseService";
import {
  addCourseUser,
  createCourseGroup,
  findUserByEmail,
  getCourseGroups,
  getCourseUsers,
  removeCourseUser,
} from "../../services/courseUserService";
import {
  canManageCourseStudents,
  getErrorMessage,
} from "../../utils/school";

function formatStudentName(student) {
  const fullName = `${student?.last_name || ""} ${student?.first_name || ""}`.trim();
  return fullName || student?.email || student?.username || "Сурагч";
}

function groupStudentsByGroup(students = [], groups = []) {
  const groupMap = new Map(
    groups.map((group) => [String(group.id), { ...group, students: [] }])
  );

  students.forEach((student) => {
    const key = String(student.group_id || "");

    if (!groupMap.has(key)) {
      groupMap.set(key, {
        id: student.group_id || key || `unknown-${student.user_id || student.id}`,
        name: student.group_name || student["{}group"] || "Баггүй",
        priority: 999,
        students: [],
      });
    }

    groupMap.get(key).students.push(student);
  });

  return Array.from(groupMap.values()).sort(
    (left, right) => Number(left.priority || 0) - Number(right.priority || 0)
  );
}

export default function CourseUsersPage() {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const role = useTeam1Role();
  const [course, setCourse] = useState(null);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentEmail, setStudentEmail] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingStudent, setSavingStudent] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    const [courseItem, courseGroups, courseUsers] = await Promise.all([
      getCourse(course_id),
      getCourseGroups(course_id).catch(() => []),
      getCourseUsers(course_id).catch(() => []),
    ]);

    setCourse({
      id: courseItem?.id || course_id,
      name: courseItem?.name || "Хичээл",
      teacher: courseItem?.teacher?.name || courseItem?.teacher_name || "Багш",
      code: courseItem?.code || courseItem?.course_code || "—",
    });
    setGroups(courseGroups || []);
    setStudents(courseUsers || []);
    setSelectedGroupId((previous) => {
      if (previous && courseGroups?.some((group) => String(group.id) === String(previous))) {
        return previous;
      }

      return courseGroups?.[0]?.id ? String(courseGroups[0].id) : "";
    });
  };

  useEffect(() => {
    loadData()
      .catch((loadError) => {
        setError(getErrorMessage(loadError, "Хэрэглэгчдийн мэдээлэл ачаалж чадсангүй."));
      })
      .finally(() => setLoading(false));
  }, [course_id]);

  const groupedStudents = useMemo(
    () => groupStudentsByGroup(students, groups),
    [students, groups]
  );

  const handleCreateGroup = async () => {
    const name = String(newGroupName || "").trim();

    if (!name) {
      setError("Багийн нэр оруулна уу.");
      return;
    }

    try {
      setCreatingGroup(true);
      setError("");
      await createCourseGroup(course_id, {
        name,
        priority: String((groups?.length || 0) + 1),
      });
      setNewGroupName("");
      await loadData();
    } catch (groupError) {
      setError(getErrorMessage(groupError, "Баг үүсгэж чадсангүй."));
    } finally {
      setCreatingGroup(false);
    }
  };

  const handleAddStudent = async () => {
    const email = String(studentEmail || "").trim();
    const emailPattern = /^[A-Za-z][0-9]{8,10}@must\.edu\.mn$/i;

    if (!emailPattern.test(email)) {
      setError("Оюутны имэйл must.edu.mn хэлбэртэй байх ёстой.");
      return;
    }

    if (!selectedGroupId) {
      setError("Эхлээд баг сонгоно уу.");
      return;
    }

    try {
      setSavingStudent(true);
      setError("");
      const user = await findUserByEmail(email);

      if (!user?.id) {
        setError("Тухайн имэйлтэй хэрэглэгч олдсонгүй.");
        return;
      }

      await addCourseUser(course_id, user.id, selectedGroupId);
      setStudentEmail("");
      await loadData();
    } catch (studentError) {
      setError(getErrorMessage(studentError, "Сурагч нэмж чадсангүй."));
    } finally {
      setSavingStudent(false);
    }
  };

  const handleRemoveStudent = async (userId) => {
    try {
      setError("");
      await removeCourseUser(course_id, userId);
      setStudents((previous) =>
        previous.filter(
          (student) => Number(student.user_id || student.id) !== Number(userId)
        )
      );
    } catch (studentError) {
      setError(getErrorMessage(studentError, "Сурагч хасаж чадсангүй."));
    }
  };

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm">Ачаалж байна...</div>;
  }

  if (!canManageCourseStudents(role)) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={() => navigate(`/team1/courses/${course_id}`)}
          className="mb-3 text-sm text-indigo-500 hover:underline"
        >
          ← Буцах
        </button>
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-amber-700">
          Энэ хэсгийг зөвхөн багш, сургуулийн админ, системийн админ ашиглана.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-8 py-6">
      <div className="rounded-2xl border border-gray-100 bg-white px-8 py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate(`/team1/courses/${course_id}`)}
              className="mb-1 block text-sm text-indigo-500 hover:underline"
            >
              ← Буцах
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              {course?.name || "Хичээл"} - Сурагчид ба багууд
            </h1>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-5 text-xs text-gray-500">
          <span>Багш: {course?.teacher || "Багш"}</span>
          <span>Код: {course?.code || "—"}</span>
          <span>Баг: {groups.length}</span>
          <span>Сурагч: {students.length}</span>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</div>
      ) : null}

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Баг үүсгэх</h2>
        <p className="mt-1 text-sm text-slate-500">
          Нэг хичээлд олон баг үүсгээд, сурагчдыг зөв багт нь бүртгэнэ.
        </p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={newGroupName}
            onChange={(event) => setNewGroupName(event.target.value)}
            placeholder="Багийн нэр"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          />
          <button
            type="button"
            onClick={handleCreateGroup}
            disabled={creatingGroup}
            className="rounded-xl bg-amber-500 px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            {creatingGroup ? "Үүсгэж байна..." : "Баг үүсгэх"}
          </button>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Сурагч бүртгэх</h2>
        <p className="mt-1 text-sm text-slate-500">
          Оюутны имэйл жишээ: B232270040@must.edu.mn
        </p>

        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <input
            type="email"
            value={studentEmail}
            onChange={(event) => setStudentEmail(event.target.value)}
            placeholder="Оюутны имэйл"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          />
          <select
            value={selectedGroupId}
            onChange={(event) => setSelectedGroupId(event.target.value)}
            className="min-w-[220px] rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          >
            <option value="">Баг сонгох</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddStudent}
            disabled={savingStudent || !selectedGroupId}
            className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            {savingStudent ? "Нэмж байна..." : "Сурагч нэмэх"}
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="mt-4 rounded-xl bg-amber-50 px-4 py-4 text-sm text-amber-700">
            Сурагч нэмэхийн өмнө эхлээд дор хаяж нэг баг үүсгэнэ үү.
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        {groupedStudents.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-8 text-sm text-slate-500 shadow-sm">
            Бүртгэлтэй баг эсвэл сурагч алга.
          </div>
        ) : (
          groupedStudents.map((group) => (
            <div key={group.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{group.name}</h3>
                  <p className="text-sm text-slate-400">
                    Сурагчийн тоо: {group.students.length}
                  </p>
                </div>
              </div>

              {group.students.length === 0 ? (
                <div className="rounded-xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
                  Энэ багт сурагч бүртгэлгүй байна.
                </div>
              ) : (
                <div className="space-y-3">
                  {group.students.map((student, index) => (
                    <div
                      key={`${group.id}-${student.user_id || student.id}-${index}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {formatStudentName(student)}
                        </p>
                        <p className="text-sm text-slate-400">
                          {student.email || student.username || "И-мэйлгүй"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveStudent(student.user_id || student.id)}
                        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-500"
                      >
                        Хасах
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
