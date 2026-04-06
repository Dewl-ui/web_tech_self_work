import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { login as apiLogin, logout as apiLogout, parseField } from "./api";
import { STORAGE_KEYS, ROLES, SESSION_EXPIRED_EVENT } from "./constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    } catch {
      return null;
    }
  });

  const [school, setSchool] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOOL));
    } catch {
      return null;
    }
  });

  // Role is stored as a number (10 / 20 / 30). localStorage always returns
  // strings, so parse it back to a number on load.
  const [role, setRole] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ROLE);
    return stored ? Number(stored) : null;
  });

  // When the token refresh in api.js fails, it fires SESSION_EXPIRED_EVENT.
  // Catch it here and redirect to login so individual components don't need to.
  useEffect(() => {
    function handleExpired() {
      setUser(null);
      setSchool(null);
      setRole(null);
      navigate("/team4/login", { replace: true });
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
  }, [navigate]);

  async function login(email, password) {
    localStorage.removeItem(STORAGE_KEYS.SCHOOL);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
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

  function selectSchool(schoolObj) {
    const parsedRole = parseField(schoolObj, "role");
    const roleId = parsedRole?.id ?? null;           // e.g. 10, 20, or 30
    localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(schoolObj));
    if (roleId != null) localStorage.setItem(STORAGE_KEYS.ROLE, roleId);
    setSchool(schoolObj);
    setRole(roleId);
  }

  const isAdmin   = role === ROLES.ADMIN;
  const isTeacher = role === ROLES.TEACHER;
  const isStudent = role === ROLES.STUDENT;

  return (
    <AuthContext.Provider
      value={{ user, school, role, isAdmin, isTeacher, isStudent, login, logout, selectSchool }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function ProtectedRoute({ children, role: requiredRole, skipSchoolCheck = false }) {
  const { user, role, school } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/team4/login" state={{ from: location }} replace />;
  }

  if (!skipSchoolCheck && !school) {
    return <Navigate to="/team4/schools/current" replace />;
  }

  if (requiredRole != null) {
    const allowed = Array.isArray(requiredRole)
      ? requiredRole.includes(role)
      : role === requiredRole;

    if (!allowed) {
      return <Navigate to="/team4/" replace />;
    }
  }

  return children;
}
