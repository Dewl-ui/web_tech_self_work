import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../utils/AuthContext";

import StudentCourses  from "./StudentCourses";
import StudentGroups   from "./StudentGroups";
import StudentCalendar from "./StudentCalendar";

const studentRoutes = [
  <Route key="student-dashboard" path="student"
    element={<ProtectedRoute role="student"><StudentCourses /></ProtectedRoute>} />,

  <Route key="student-groups" path="student/groups"
    element={<ProtectedRoute role="student"><StudentGroups /></ProtectedRoute>} />,

  <Route key="student-calendar" path="student/calendar"
    element={<ProtectedRoute role="student"><StudentCalendar /></ProtectedRoute>} />,

  // Add more student <Route> entries below this line
];

export default studentRoutes;
   