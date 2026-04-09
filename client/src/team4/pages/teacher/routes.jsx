// ============================================================
// TEACHER ROUTES — Member B OWNS this file
// All teacher-facing pages are registered here.
//
// To add a new teacher page:
//   1. Create YourPage.jsx in this folder  (pages/teacher/)
//   2. Import it below
//   3. Add a <Route> entry — do NOT edit any other routes file
// ============================================================
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../utils/AuthContext";
import { ROLES } from "../../utils/constants";

import AttendancePage from "./AttendancePage";
import CourseUserEdit from "./CourseUserEdit";
import CourseUserList from "./CourseUserList";
import GroupManagement from "./GroupManagement";
import GroupUserList from "./GroupUserList";
import TeacherDashboard from "./TeacherDashboard";
import TimetableManagePage from "./TimetableManagePage"; 

const teacherRoutes = [
  // Teacher dashboard — /team4/teacher
  <Route key="teacher-dashboard" path="teacher"
    element={<ProtectedRoute role={ROLES.TEACHER}><TeacherDashboard /></ProtectedRoute>} />,

  <Route key="attendance" path="teacher/attendance"
    element={<ProtectedRoute role={ROLES.TEACHER}><AttendancePage /></ProtectedRoute>} />,

  // Course user management — /team4/courses/:course_id/users*
  <Route key="course-users" path="courses/:course_id/users"
    element={<ProtectedRoute role={[ROLES.ADMIN, ROLES.TEACHER]}><CourseUserList /></ProtectedRoute>} />,
  <Route key="course-users-edit" path="courses/:course_id/users/edit"
    element={<ProtectedRoute role={[ROLES.ADMIN, ROLES.TEACHER]}><CourseUserEdit /></ProtectedRoute>} />,

      // Course attendance — /team4/courses/:course_id/attendance
  <Route key="course-attendance" path="courses/:course_id/attendance"
    element={<ProtectedRoute role={[ROLES.ADMIN, ROLES.TEACHER]}><AttendancePage /></ProtectedRoute>} />,

  // Group management — /team4/courses/:course_id/groups*
  <Route key="groups" path="courses/:course_id/groups"
    element={<ProtectedRoute role={[ROLES.ADMIN, ROLES.TEACHER]}><GroupManagement /></ProtectedRoute>} />,
  <Route key="group-users" path="courses/:course_id/groups/:group_id/users"
    element={<ProtectedRoute role={[ROLES.ADMIN, ROLES.TEACHER]}><GroupUserList /></ProtectedRoute>} />,

  // Timetable management — /team4/courses/:course_id/timetable
  <Route key="timetable-manage" path="courses/:course_id/timetable"
    element={<ProtectedRoute role={[ROLES.ADMIN, ROLES.TEACHER]}><TimetableManagePage /></ProtectedRoute>} />,


  // Add more teacher <Route> entries below this line
];

export default teacherRoutes;
