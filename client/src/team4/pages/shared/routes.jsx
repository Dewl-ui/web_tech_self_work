// ============================================================
// SHARED ROUTES — accessible to all authenticated users
// Home dashboard, Profile, Change Password, School Select
//
// This file is owned by the infra/lead member.
// Do NOT move role-specific pages here.
// ============================================================
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../utils/AuthContext";

import Home           from "./Home";
import Profile        from "./Profile";
import ChangePassword from "./ChangePassword";
import SchoolSelect   from "./SchoolSelect";

const sharedRoutes = [
  // Home — /team4/  (renders role-specific dashboard inside)
  <Route key="home" index
    element={<ProtectedRoute><Home /></ProtectedRoute>} />,

  // Profile — /team4/profile
  <Route key="profile" path="profile"
    element={<ProtectedRoute><Profile /></ProtectedRoute>} />,

  // Change password — /team4/profile/change-password
  <Route key="change-password" path="profile/change-password"
    element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />,

  // School select — /team4/schools/current
  // skipSchoolCheck prevents infinite redirect when no school is selected yet
  <Route key="schools-current" path="schools/current"
    element={<ProtectedRoute skipSchoolCheck><SchoolSelect /></ProtectedRoute>} />,
];

export default sharedRoutes;
