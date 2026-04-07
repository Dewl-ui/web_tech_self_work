// ============================================================
// Profile.jsx — SHARED shell, owned by the infra/lead member.
//
// DO NOT add role-specific content here.
// Each member updates their own profile file:
//   Admin   → pages/admin/AdminProfile.jsx    (Member A)
//   Teacher → pages/teacher/TeacherProfile.jsx (Member B)
//   Student → pages/student/StudentProfile.jsx (Member C)
// ============================================================
import { useAuth } from "../../utils/AuthContext";
import { ROLES } from "../../utils/constants";
import AdminProfile   from "../admin/AdminProfile";
import TeacherProfile from "../teacher/TeacherProfile";
import StudentProfile from "../student/StudentProfile";

export default function Profile() {
  const { role } = useAuth();

  if (role === ROLES.ADMIN)   return <AdminProfile />;
  if (role === ROLES.TEACHER) return <TeacherProfile />;
  if (role === ROLES.STUDENT) return <StudentProfile />;

  return (
    <div className="mx-auto max-w-xl space-y-2">
      <h1 className="text-2xl font-bold text-zinc-900">Миний профайл</h1>
      <p className="text-sm text-zinc-500">
        Сургуулиа сонгосны дараа таны профайл харагдана.
      </p>
    </div>
  );
}
