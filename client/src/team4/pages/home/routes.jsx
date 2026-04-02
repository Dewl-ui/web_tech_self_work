// Member 5 OWNS this file
import { Route } from "react-router-dom";
import Home from "./Home";
import { ProtectedRoute } from "../../utils/AuthContext";

const homeRoutes = [
  <Route key="home" index element={<ProtectedRoute><Home /></ProtectedRoute>} />,
];

export default homeRoutes;
