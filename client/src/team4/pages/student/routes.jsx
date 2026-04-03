// ============================================================
// STUDENT ROUTES — Member C OWNS this file
// All student-specific pages are registered here.
//
// To add a new student page:
//   1. Create YourPage.jsx in this folder  (pages/student/)
//   2. Import it below
//   3. Add a <Route> entry — do NOT edit any other routes file
// ============================================================
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../utils/AuthContext";

import StudentDashboard from "./StudentDashboard";

const studentRoutes = [
  // Student dashboard — /team4/student
  <Route key="student-dashboard" path="student"
    element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />,

  // Add more student <Route> entries below this line
];

export default studentRoutes;
