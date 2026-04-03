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

import TeacherDashboard from "./TeacherDashboard";
import CourseUserList   from "./CourseUserList";
import CourseUserEdit   from "./CourseUserEdit";
import GroupManagement  from "./GroupManagement";
import GroupUserList    from "./GroupUserList";

const teacherRoutes = [
  // Teacher dashboard — /team4/teacher
  <Route key="teacher-dashboard" path="teacher"
    element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />,

  // Course user management — /team4/courses/:course_id/users*
  <Route key="course-users" path="courses/:course_id/users"
    element={<ProtectedRoute role={["admin", "teacher"]}><CourseUserList /></ProtectedRoute>} />,
  <Route key="course-users-edit" path="courses/:course_id/users/edit"
    element={<ProtectedRoute role={["admin", "teacher"]}><CourseUserEdit /></ProtectedRoute>} />,

  // Group management — /team4/courses/:course_id/groups*
  <Route key="groups" path="courses/:course_id/groups"
    element={<ProtectedRoute role={["admin", "teacher"]}><GroupManagement /></ProtectedRoute>} />,
  <Route key="group-users" path="courses/:course_id/groups/:group_id/users"
    element={<ProtectedRoute role={["admin", "teacher"]}><GroupUserList /></ProtectedRoute>} />,

  // Add more teacher <Route> entries below this line
];

export default teacherRoutes;
