/**
 * Team4 entry point — assembled by Member 1, never edited again.
 * Each member adds routes only inside their own pages/<feature>/routes.jsx file.
 */
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import Layout from "./Layout";

// Route slices — each member owns their own file
import authRoutes from "./pages/auth/routes";
import userRoutes from "./pages/users/routes";
import profileRoutes from "./pages/profile/routes";
import roleRoutes from "./pages/roles/routes";
import schoolRoutes from "./pages/schools/routes";
import courseUserRoutes from "./pages/course-users/routes";
import groupRoutes from "./pages/groups/routes";
import homeRoutes from "./pages/home/routes";

export default function Team4() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public auth routes — no layout wrapper */}
        {authRoutes}

        {/* Protected routes — wrapped in sidebar + header layout */}
        <Route element={<Layout />}>
          {homeRoutes}
          {userRoutes}
          {profileRoutes}
          {roleRoutes}
          {schoolRoutes}
          {courseUserRoutes}
          {groupRoutes}
        </Route>
      </Routes>
    </AuthProvider>
  );
}
