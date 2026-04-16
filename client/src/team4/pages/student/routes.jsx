import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../utils/AuthContext";
import { ROLES } from "../../utils/constants";

import StudentCourses      from "./StudentCourses";
import StudentCourseDetail from "./StudentCourseDetail";
import StudentGroups       from "./StudentGroups";
import StudentCalendar     from "./StudentCalendar";
import StudentProfile      from "./StudentProfile";
import StudentProfileEdit  from "./StudentProfileEdit";

const studentRoutes = [
  <Route key="student-courses" path="student"
    element={<ProtectedRoute role={ROLES.STUDENT}><StudentCourses /></ProtectedRoute>} />,

  <Route key="student-course-detail" path="student/courses/:courseId"
    element={<ProtectedRoute role={ROLES.STUDENT}><StudentCourseDetail /></ProtectedRoute>} />,

  <Route key="student-groups" path="student/groups"
    element={<ProtectedRoute role={ROLES.STUDENT}><StudentGroups /></ProtectedRoute>} />,

  <Route key="student-calendar" path="student/calendar"
    element={<ProtectedRoute role={ROLES.STUDENT}><StudentCalendar /></ProtectedRoute>} />,

  <Route key="student-profile-edit" path="student/profile/edit"
    element={<ProtectedRoute role={ROLES.STUDENT}><StudentProfileEdit /></ProtectedRoute>} />,

  <Route key="student-profile" path="student/profile"
    element={<ProtectedRoute role={ROLES.STUDENT}><StudentProfile /></ProtectedRoute>} />,

];

export default studentRoutes;
