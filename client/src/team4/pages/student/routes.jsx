import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../utils/AuthContext";
import { ROLES } from "../../utils/constants";

import StudentCourses      from "./StudentCourses";
import StudentCourseDetail from "./StudentCourseDetail";
import StudentGroups       from "./StudentGroups";
import StudentCalendar     from "./StudentCalendar";

const studentRoutes = [
  // Courses list — /team4/student
  <Route key="student-courses" path="student"
    element={<ProtectedRoute role={ROLES.STUDENT}><StudentCourses /></ProtectedRoute>} />,

  // Course detail — /team4/student/courses/:courseId
  <Route key="student-course-detail" path="student/courses/:courseId"
    element={<ProtectedRoute role={ROLES.STUDENT}><StudentCourseDetail /></ProtectedRoute>} />,

  // Groups — /team4/student/groups
  <Route key="student-groups" path="student/groups"
    element={<ProtectedRoute role={ROLES.STUDENT}><StudentGroups /></ProtectedRoute>} />,

  // Calendar — /team4/student/calendar
  <Route key="student-calendar" path="student/calendar"
    element={<ProtectedRoute role={ROLES.STUDENT}><StudentCalendar /></ProtectedRoute>} />,

  // Add more student <Route> entries below this line
];

export default studentRoutes;
