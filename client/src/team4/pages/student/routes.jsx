// ============================================================
// STUDENT ROUTES — Member C OWNS this file
// All student-specific pages are registered here.
//
// To add a new student page:
//   1. Create YourPage.jsx in this folder  (pages/student/)
//   2. Import it below
//   3. Add a <Route> entry — do NOT edit any other routes file
// ============================================================
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../utils/AuthContext";

import StudentCourses      from "./StudentCourses";
import StudentCourseDetail from "./StudentCourseDetail";
import StudentGroups       from "./StudentGroups";
import StudentCalendar     from "./StudentCalendar";

const studentRoutes = [
  // Courses list — /team4/student
  <Route key="student-courses" path="student"
    element={<ProtectedRoute role="student"><StudentCourses /></ProtectedRoute>} />,

  // Course detail — /team4/student/courses/:courseId
  <Route key="student-course-detail" path="student/courses/:courseId"
    element={<ProtectedRoute role="student"><StudentCourseDetail /></ProtectedRoute>} />,

  // Groups — /team4/student/groups
  <Route key="student-groups" path="student/groups"
    element={<ProtectedRoute role="student"><StudentGroups /></ProtectedRoute>} />,

  // Calendar — /team4/student/calendar
  <Route key="student-calendar" path="student/calendar"
    element={<ProtectedRoute role="student"><StudentCalendar /></ProtectedRoute>} />,

  // Add more student <Route> entries below this line
];

export default studentRoutes;
