// Member 3 OWNS this file
import { Route } from "react-router-dom";
import SchoolSelect from "./SchoolSelect";
import { ProtectedRoute } from "../../utils/AuthContext";

const schoolRoutes = [
  // skipSchoolCheck prevents the school guard from redirecting back here infinitely
  <Route key="schools-current" path="schools/current" element={<ProtectedRoute skipSchoolCheck><SchoolSelect /></ProtectedRoute>} />,
];

export default schoolRoutes;
