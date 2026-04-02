import { createContext, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { login as apiLogin, logout as apiLogout, parseField } from "./api";

const AuthContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("team4_user"));
    } catch {
      return null;
    }
  });

  const [school, setSchool] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("team4_school"));
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(
    () => localStorage.getItem("team4_role") || null
  );

  async function login(email, password) {
    // Clear any previous user's school / role before logging in a new user
    localStorage.removeItem("team4_school");
    localStorage.removeItem("team4_role");
    setSchool(null);
    setRole(null);

    const me = await apiLogin(email, password);
    setUser(me);
    return me;
  }

  async function logout() {
    await apiLogout();
    setUser(null);
    setSchool(null);
    setRole(null);
  }

  /**
   * Called from SchoolSelect after the user picks a school.
   * Extracts the per-school role from the {}role field.
   */
  function selectSchool(schoolObj) {
    const parsedRole = parseField(schoolObj, "role");
    const roleName = parsedRole?.name?.toLowerCase() ?? "student";
    localStorage.setItem("team4_school", JSON.stringify(schoolObj));
    localStorage.setItem("team4_role", roleName);
    setSchool(schoolObj);
    setRole(roleName);
  }

  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";
  const isStudent = role === "student";

  return (
    <AuthContext.Provider
      value={{ user, school, role, isAdmin, isTeacher, isStudent, login, logout, selectSchool }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// ── ProtectedRoute ────────────────────────────────────────────────────────────

/**
 * Wraps a page and enforces auth + school selection + optional role check.
 *
 * Props:
 *   role            – string | string[]  allowed roles. Omit to allow any logged-in user.
 *   skipSchoolCheck – set on the schools/current route itself to avoid infinite redirect.
 *
 * Examples:
 *   <ProtectedRoute>…</ProtectedRoute>
 *   <ProtectedRoute role="admin">…</ProtectedRoute>
 *   <ProtectedRoute role={["admin","teacher"]}>…</ProtectedRoute>
 *   <ProtectedRoute skipSchoolCheck>…</ProtectedRoute>
 */
export function ProtectedRoute({ children, role: requiredRole, skipSchoolCheck = false }) {
  const { user, role, school } = useAuth();
  const location = useLocation();

  // 1. Must be logged in
  if (!user) {
    return <Navigate to="/team4/login" state={{ from: location }} replace />;
  }

  // 2. Must have selected a school (unless the route IS the school-select page)
  if (!skipSchoolCheck && !school) {
    return <Navigate to="/team4/schools/current" replace />;
  }

  // 3. Role gate
  if (requiredRole) {
    const allowed = Array.isArray(requiredRole)
      ? requiredRole.includes(role)
      : role === requiredRole;

    if (!allowed) {
      return <Navigate to="/team4/" replace />;
    }
  }

  return children;
}
