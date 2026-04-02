// Member 5 OWNS this file
import { Route } from "react-router-dom";
import GroupManagement from "./GroupManagement";
import GroupUserList from "./GroupUserList";
import { ProtectedRoute } from "../../utils/AuthContext";

const groupRoutes = [
  <Route key="groups" path="courses/:course_id/groups" element={<ProtectedRoute role={["admin", "teacher"]}><GroupManagement /></ProtectedRoute>} />,
  <Route key="group-users" path="courses/:course_id/groups/:group_id/users" element={<ProtectedRoute role={["admin", "teacher"]}><GroupUserList /></ProtectedRoute>} />,
];

export default groupRoutes;
