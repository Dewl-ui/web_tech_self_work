// ============================================================
// ADMIN ROUTES — Member A OWNS this file
// All admin-only pages are registered here.
//
// To add a new admin page:
//   1. Create YourPage.jsx in this folder  (pages/admin/)
//   2. Import it below
//   3. Add a <Route> entry — do NOT edit any other routes file
// ============================================================
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../utils/AuthContext";
import { ROLES } from "../../utils/constants";

import AdminDashboard  from "./AdminDashboard";
import UserList        from "./UserList";
import UserCreate      from "./UserCreate";
import UserDetail      from "./UserDetail";
import UserEdit        from "./UserEdit";
import RoleManagement  from "./RoleManagement";

const adminRoutes = [
  // Admin dashboard — /team4/admin
  <Route key="admin-dashboard" path="admin"
    element={<ProtectedRoute role={ROLES.ADMIN}><AdminDashboard /></ProtectedRoute>} />,

  // User management — /team4/users/*
  <Route key="users" path="users"
    element={<ProtectedRoute role={ROLES.ADMIN}><UserList /></ProtectedRoute>} />,
  <Route key="users-create" path="users/create"
    element={<ProtectedRoute role={[ROLES.ADMIN, ROLES.TEACHER]}><UserCreate /></ProtectedRoute>} />,
  <Route key="users-id" path="users/:user_id"
    element={<ProtectedRoute role={ROLES.ADMIN}><UserDetail /></ProtectedRoute>} />,
  <Route key="users-edit" path="users/:user_id/edit"
    element={<ProtectedRoute role={ROLES.ADMIN}><UserEdit /></ProtectedRoute>} />,

  // Role management — /team4/roles
  <Route key="roles" path="roles"
    element={<ProtectedRoute role={ROLES.ADMIN}><RoleManagement /></ProtectedRoute>} />,

  // Add more admin <Route> entries below this line
];

export default adminRoutes;
