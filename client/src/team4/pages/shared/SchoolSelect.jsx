import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiChevronRight, FiAlertCircle } from "react-icons/fi";
import { FaSchool } from "react-icons/fa";
import { useAuth } from "../../utils/AuthContext";
import { apiGet, parseField } from "../../utils/api";
import { useToast } from "../../components/ui/Toast";
import { ROLES } from "../../utils/constants";

// Tailwind colour classes keyed by role ID (10, 20, 30)
const ROLE_COLORS = {
  [ROLES.ADMIN]:   "bg-purple-100 text-purple-700",
  [ROLES.TEACHER]: "bg-blue-100   text-blue-700",
  [ROLES.STUDENT]: "bg-green-100  text-green-700",
};

export default function SchoolSelect() {
  const navigate = useNavigate();
  const { user, selectSchool, logout } = useAuth();
  const toast = useToast();

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    apiGet(`/users/${user.id}/schools`)
      .then(async (data) => {
        const userSchools = data?.items ?? [];

        // If the user belongs to the system school (id=0) with admin role,
        // fetch ALL registered schools so they can access any school.
        const hasSystemAdmin = userSchools.some((s) => {
          const role = parseField(s, "role");
          return s.id === 0 && role?.id === ROLES.ADMIN;
        });

        if (hasSystemAdmin) {
          setIsSystemAdmin(true);
          try {
            const allData = await apiGet("/schools?limit=10000");
            const allSchools = allData?.items ?? [];
            // Merge: keep system school from userSchools (has role info),
            // then add all other schools
            const systemSchool = userSchools.find((s) => s.id === 0);
            const otherSchools = allSchools.filter((s) => s.id !== 0);
            setSchools(systemSchool ? [systemSchool, ...otherSchools] : otherSchools);
          } catch {
            // Fallback to user's own schools if /schools fails
            setSchools(userSchools);
          }
        } else {
          setSchools(userSchools);
        }
      })
      .catch((err) => {
        const msg = err.message || "Сургуулийн мэдээлэл авахад алдаа гарлаа";
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  function handleSelect(school) {
    // For system admin selecting a school without role info, inject admin role
    const roleObj = parseField(school, "role");
    if (!roleObj && isSystemAdmin) {
      const adminSchool = { ...school, "{}role": JSON.stringify({ id: ROLES.ADMIN, name: "Админ" }) };
      selectSchool(adminSchool);
    } else {
      selectSchool(school);
    }
    toast.success(`${school.name ?? "Сургууль"} сонгогдлоо.`);
    navigate("/team4/", { replace: true });
  }

  async function handleLogout() {
    await logout();
    navigate("/team4/login", { replace: true });
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-900">Сургуулиа сонгоно уу</h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            {user?.email && (
              <span className="font-medium text-zinc-700">{user.email}</span>
            )}{" "}
            хэрэглэгчийн сургуулиуд
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-zinc-100" />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <FiAlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && schools.length === 0 && (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
            <div className="mb-3 text-4xl"><FaSchool /></div>
            <p className="font-medium text-zinc-800">Сургуультай холбогдоогүй байна</p>
            <p className="mt-1 text-sm text-zinc-500">
              Та ямар нэг сургуулийн гишүүн биш байна.
            </p>
          </div>
        )}

        {/* School list */}
        {!loading && !error && schools.length > 0 && (
          <div className="space-y-3">
            {schools.map((school) => {
              const roleObj   = parseField(school, "role");
              const roleLabel = roleObj?.name;                          // from API e.g. "Суралцагч"
              const roleColor = ROLE_COLORS[roleObj?.id] ?? "bg-zinc-100 text-zinc-600";

              return (
                <button
                  key={school.id}
                  onClick={() => handleSelect(school)}
                  className="flex w-full items-center justify-between rounded-xl border border-zinc-200
                    bg-white px-5 py-4 text-left transition-all hover:border-zinc-400 hover:shadow-sm
                    active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-xl">
                      <FaSchool />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">{school.name ?? `Сургууль #${school.id}`}</p>
                      {roleLabel && (
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${roleColor}`}>
                          {roleLabel}
                        </span>
                      )}
                    </div>
                  </div>
                  <FiChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
                </button>
              );
            })}
          </div>
        )}

        {/* Logout */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-red-600 transition-colors"
          >
            <FiLogOut className="h-4 w-4" />
            Гарах
          </button>
        </div>
      </div>
    </div>
  );
}
