// Member 4 OWNS this file
import { Route } from "react-router-dom";
import CourseUserList from "./CourseUserList";
import CourseUserEdit from "./CourseUserEdit";
import { ProtectedRoute } from "../../utils/AuthContext";

const courseUserRoutes = [
  <Route key="course-users" path="courses/:course_id/users" element={<ProtectedRoute role={["admin", "teacher"]}><CourseUserList /></ProtectedRoute>} />,
  <Route key="course-users-edit" path="courses/:course_id/users/edit" element={<ProtectedRoute role={["admin", "teacher"]}><CourseUserEdit /></ProtectedRoute>} />,
];

export default courseUserRoutes;
