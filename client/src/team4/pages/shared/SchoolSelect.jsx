import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiChevronRight, FiAlertCircle, FiSend } from "react-icons/fi";
import { FaSchool } from "react-icons/fa";
import { useAuth } from "../../utils/AuthContext";
import { apiGet, apiPost, parseField, withCurrentUser } from "../../utils/api";
import { useToast } from "../../components/ui/Toast";
import { ROLES } from "../../utils/constants";

// Tailwind colour classes keyed by role ID (10, 20, 30)
const ROLE_COLORS = {
  [ROLES.ADMIN]: "bg-purple-100 text-purple-700",
  [ROLES.TEACHER]: "bg-blue-100 text-blue-700",
  [ROLES.STUDENT]: "bg-green-100 text-green-700",
};

export default function SchoolSelect() {
  const navigate = useNavigate();
  const { user, selectSchool, logout } = useAuth();
  const toast = useToast();

  const [schools, setSchools] = useState([]);
  const [allSchools, setAllSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allSchoolsLoading, setAllSchoolsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);

  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [roleId, setRoleId] = useState(String(ROLES.STUDENT));
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    apiGet(`/users/${user.id}/schools`)
      .then(async (data) => {
        const userSchools = data?.items ?? [];

        const hasSystemAdmin = userSchools.some((s) => {
          const role = parseField(s, "role");
          return s.id === 0 && role?.id === ROLES.ADMIN;
        });

        if (hasSystemAdmin) {
          setIsSystemAdmin(true);
          try {
            const allData = await apiGet("/schools?limit=10000");
            const allItems = allData?.items ?? [];

            const systemSchool = userSchools.find((s) => s.id === 0);
            const otherSchools = allItems.filter((s) => s.id !== 0);

            setSchools(systemSchool ? [systemSchool, ...otherSchools] : otherSchools);
          } catch {
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
  }, [user?.id, toast]);

  useEffect(() => {
    if (!user?.id || loading || error || schools.length > 0) return;

    setAllSchoolsLoading(true);

    apiGet("/schools?limit=10000")
      .then((data) => {
        const items = data?.items ?? [];
        setAllSchools(items.filter((s) => s.id !== 0));
      })
      .catch((err) => {
        toast.error(err.message || "Сургуулийн жагсаалт авахад алдаа гарлаа.");
      })
      .finally(() => setAllSchoolsLoading(false));
  }, [user?.id, loading, error, schools.length, toast]);

  function handleSelect(school) {
    const roleObj = parseField(school, "role");

    if (!roleObj && isSystemAdmin) {
      const adminSchool = {
        ...school,
        "{}role": JSON.stringify({ id: ROLES.ADMIN, name: "Админ" }),
      };
      selectSchool(adminSchool);
    } else {
      selectSchool(school);
    }

    toast.success(`${school.name ?? "Сургууль"} сонгогдлоо.`);
    navigate("/team4/", { replace: true });
  }

  async function handleRequestSubmit(e) {
    e.preventDefault();

    if (!selectedSchoolId) {
      toast.warning("Сургууль сонгоно уу.");
      return;
    }

    setSubmitting(true);

    try {
      await apiPost(
        `/schools/${selectedSchoolId}/requests`,
        withCurrentUser({
          description: description.trim(),
          role_id: roleId,
        })
      );

      toast.success("Эрхийн хүсэлт амжилттай илгээгдлээ.");

      setSelectedSchoolId("");
      setRoleId(String(ROLES.STUDENT));
      setDescription("");
    } catch (err) {
      toast.error(err.message || "Эрхийн хүсэлт илгээхэд алдаа гарлаа.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/team4/login", { replace: true });
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-900">Сургуулиа сонгоно уу</h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            {user?.email && (
              <span className="font-medium text-zinc-700">{user.email}</span>
            )}{" "}
            хэрэглэгчийн сургуулиуд
          </p>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-zinc-100" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <FiAlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {!loading && !error && schools.length === 0 && (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-5 text-center">
              <div className="mb-3 flex justify-center text-4xl">
                <FaSchool />
              </div>
              <p className="font-medium text-zinc-800">Сургуультай холбогдоогүй байна</p>
              <p className="mt-1 text-sm text-zinc-500">
                Доороос сургууль сонгоод эрхийн хүсэлт илгээнэ үү.
              </p>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Сургууль
                </label>
                <select
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  disabled={allSchoolsLoading}
                >
                  <option value="">
                    {allSchoolsLoading ? "Ачаалж байна..." : "-- Сургууль сонгох --"}
                  </option>
                  {allSchools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name ?? `Сургууль #${school.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Хүсэж буй эрх
                </label>
                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                >
                  <option value={ROLES.ADMIN}>Админ</option>
                  <option value={ROLES.TEACHER}>Багш</option>
                  <option value={ROLES.STUDENT}>Суралцагч</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Тайлбар
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Жишээ: Энэ сургуульд суралцагчаар элсэх хүсэлт илгээж байна."
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || allSchoolsLoading || allSchools.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiSend className="h-4 w-4" />
                {submitting ? "Илгээж байна..." : "Эрхийн хүсэлт илгээх"}
              </button>
            </form>
          </div>
        )}

        {!loading && !error && schools.length > 0 && (
          <div className="space-y-3">
            {schools.map((school) => {
              const roleObj = parseField(school, "role");
              const roleLabel = roleObj?.name;
              const roleColor =
                ROLE_COLORS[roleObj?.id] ?? "bg-zinc-100 text-zinc-600";

              return (
                <button
                  key={school.id}
                  onClick={() => handleSelect(school)}
                  className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4 text-left transition-all hover:border-zinc-400 hover:shadow-sm active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-xl">
                      <FaSchool />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">
                        {school.name ?? `Сургууль #${school.id}`}
                      </p>
                      {roleLabel && (
                        <span
                          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${roleColor}`}
                        >
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

        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-red-600"
          >
            <FiLogOut className="h-4 w-4" />
            Гарах
          </button>
        </div>
      </div>
    </div>
  );
}