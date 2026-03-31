// Member 3 OWNS this file
import { Route } from "react-router-dom";
import RoleManagement from "./RoleManagement";
import { ProtectedRoute } from "../../utils/AuthContext";

const roleRoutes = [
  <Route key="roles" path="roles" element={<ProtectedRoute role="admin"><RoleManagement /></ProtectedRoute>} />,
];

export default roleRoutes;
