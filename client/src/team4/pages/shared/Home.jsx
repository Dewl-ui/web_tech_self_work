import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import AdminHomeSummary   from "../admin/AdminHomeSummary";
import TeacherHomeSummary from "../teacher/TeacherHomeSummary";
import StudentHome from "../student/StudentHome";

const ROLE_TITLES = {
  admin:   "Системийн Dashboard",
  teacher: "Багшийн Dashboard",
  student: "Оюутны Dashboard",
};

export default function Home() {
  const { user, role, school, isAdmin, isTeacher, isStudent } = useAuth();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          {ROLE_TITLES[role] ?? "Dashboard"}
        </h1>
        {/* {school?.name && (
          <p className="mt-0.5 text-sm text-zinc-500">{school.name}</p>
        )} */}
        <p className="mt-0.5 text-sm text-zinc-500">Цахим шалгалтын системийн удирдах хэсэг</p>
      </div>

      {isAdmin   && <AdminHomeSummary   userId={user?.id} />}
      {isTeacher && <TeacherHomeSummary userId={user?.id} />}
      {isStudent && <StudentHome userId={user?.id} />}

      {!isAdmin && !isTeacher && !isStudent && (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
          Таны эрх тодорхойлогдоогүй байна.{" "}
          <Link to="/team4/schools/current" className="text-zinc-900 underline">
            Сургуулиа дахин сонгоно уу
          </Link>
        </div>
      )}
    </div>
  );
}
