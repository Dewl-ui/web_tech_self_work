// Member 3 OWNS this file
import { Route } from "react-router-dom";
import Profile from "./Profile";
import ChangePassword from "./ChangePassword";
import { ProtectedRoute } from "../../utils/AuthContext";

const profileRoutes = [
  <Route key="profile" path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />,
  <Route key="change-password" path="profile/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />,
];

export default profileRoutes;
