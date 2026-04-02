// Member 2 OWNS this file
import { Route } from "react-router-dom";
import UserList from "./UserList";
import UserCreate from "./UserCreate";
import UserDetail from "./UserDetail";
import UserEdit from "./UserEdit";
import { ProtectedRoute } from "../../utils/AuthContext";

const userRoutes = [
  <Route key="users" path="users" element={<ProtectedRoute role="admin"><UserList /></ProtectedRoute>} />,
  <Route key="users-create" path="users/create" element={<ProtectedRoute role={["admin", "teacher"]}><UserCreate /></ProtectedRoute>} />,
  <Route key="users-id" path="users/:user_id" element={<ProtectedRoute role="admin"><UserDetail /></ProtectedRoute>} />,
  <Route key="users-edit" path="users/:user_id/edit" element={<ProtectedRoute role="admin"><UserEdit /></ProtectedRoute>} />,
];

export default userRoutes;
