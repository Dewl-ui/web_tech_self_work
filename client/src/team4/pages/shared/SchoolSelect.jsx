import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiAlertCircle,
  FiSend,
  FiArrowRight,
} from "react-icons/fi";
import { FaSchool } from "react-icons/fa";
import { useAuth } from "../../utils/AuthContext";
import { apiGet, parseField } from "../../utils/api";
import { useToast } from "../../components/ui/Toast";
import { ROLES } from "../../utils/constants";
import RequestAccessDialog from "../../components/RequestAccessDialog";

const ROLE_META = {
  [ROLES.ADMIN]: {
    label: "Админ",
    bg: "bg-purple-500/10",
    text: "text-purple-600",
    border: "border-purple-500/20",
    // dot: "bg-purple-500",
    dot: "bg-red-500",
  },
  [ROLES.TEACHER]: {
    label: "Багш",
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    border: "border-blue-500/20",
    dot: "bg-blue-500",
  },
  [ROLES.STUDENT]: {
    label: "Оюутан",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
};

const FALLBACK_ROLE = {
  bg: "bg-zinc-500/10",
  text: "text-zinc-500",
  border: "border-zinc-500/20",
  dot: "bg-zinc-400",
};

/* ── Gradient palette for cards without images ── */
const CARD_GRADIENTS = [
  "from-violet-600 to-indigo-700",
  "from-sky-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-fuchsia-500 to-purple-600",
  "from-blue-600 to-indigo-600",
  "from-teal-500 to-emerald-600",
];

function pictureUrl(picture) {
  if (!picture || picture === "no-image.jpg") return null;
  if (/^(https?:)?\/\//i.test(picture)) return picture;
  if (picture.startsWith("data:image/")) return picture;
  return `https://todu.mn/bs/lms/v1/${picture}`;
}

export default function SchoolSelect() {
  const navigate = useNavigate();
  const { user, selectSchool, logout } = useAuth();
  const toast = useToast();

  const [schools, setSchools] = useState([]);
  const [schoolPictures, setSchoolPictures] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  /* ── Fetch school pictures from API ── */
  const fetchSchoolPictures = useCallback(async (schoolList) => {
    const pics = {};
    await Promise.allSettled(
      schoolList.map(async (s) => {
        if (s.id === 0) return; // skip system school
        try {
          const detail = await apiGet(`/schools/${s.id}`);
          if (detail?.picture) {
            const url = pictureUrl(detail.picture);
            if (url) pics[s.id] = url;
          }
        } catch {
          /* silently ignore — card will use gradient fallback */
        }
      }),
    );
    setSchoolPictures(pics);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    apiGet(`/users/${user.id}/schools`)
      .then(async (data) => {
        const userSchools = data?.items ?? [];

        const hasSystemAdmin = userSchools.some((s) => {
          const role = parseField(s, "role");
          return s.id === 0 && role?.id === ROLES.ADMIN;
        });

        let finalSchools;
        if (hasSystemAdmin) {
          setIsSystemAdmin(true);
          try {
            const allData = await apiGet("/schools?limit=10000");
            const allSchools = allData?.items ?? [];
            const systemSchool = userSchools.find((s) => s.id === 0);
            const otherSchools = allSchools.filter((s) => s.id !== 0);
            finalSchools = systemSchool
              ? [systemSchool, ...otherSchools]
              : otherSchools;
          } catch {
            finalSchools = userSchools;
          }
        } else {
          finalSchools = userSchools;
        }

        finalSchools.sort((a, b) => {
          if (a.id === 0) return -1;
          if (b.id === 0) return 1;
          return Number(a.id) - Number(b.id);
        });

        setSchools(finalSchools);
        fetchSchoolPictures(finalSchools);
      })
      .catch((err) => {
        const msg = err.message || "Сургуулийн мэдээлэл авахад алдаа гарлаа";
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, [user?.id, toast, fetchSchoolPictures]);

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

  async function handleLogout() {
    await logout();
    navigate("/team4/login", { replace: true });
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-2 sm:p-6">
      <div className="w-full max-w-[1100px]">
        {/* ── Header ── */}
        <div className="flex flex-col mb-8 text-center school-card-enter items-center justify-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-zinc-300 text-primary text-2xl mb-4  shadow-indigo-500/20">
            <FaSchool />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Сургуулиа сонгоно уу
            </h1>
            <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
              {user?.email && (
                <span className="font-medium text-zinc-600">{user.email}</span>
              )}{" "}
              хэрэглэгчийн хандах боломжтой сургуулиуд
            </p>
          </div>
        </div>

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="flex flex-wrap justify-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-sm"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-32 school-shimmer" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 rounded-lg school-shimmer" />
                  <div className="h-3 w-1/3 rounded-lg school-shimmer" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Error state ── */}
        {!loading && error && (
          <div className="school-card-enter flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <FiAlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Алдаа гарлаа</p>
              <p className="mt-0.5 text-red-600/80">{error}</p>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && schools.length === 0 && (
          <div className="school-card-enter rounded-lg border border-zinc-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-100 text-3xl text-zinc-400">
              <FaSchool />
            </div>
            <h2 className="text-lg font-semibold text-zinc-800">
              Сургуультай холбогдоогүй байна
            </h2>
            <p className="mt-1.5 text-sm text-zinc-500 max-w-xs mx-auto">
              Та ямар нэг сургуулийн гишүүн биш байна. Доорх товчийг ашиглан
              эрхийн хүсэлт илгээнэ үү.
            </p>

            <button
              type="button"
              onClick={() => setShowRequestDialog(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-300 px-5 py-2.5 text-sm font-medium text-white  shadow-indigo-500/20 transition-all hover:bg-zinc-400 active:scale-[0.98]"
            >
              <FiSend className="h-4 w-4" />
              Эрхийн санал хүсэлт
            </button>
          </div>
        )}

        {/* ── School cards grid ── */}
        {!loading && !error && schools.length > 0 && (
          <>
            <div className="flex flex-wrap justify-center gap-6">
              {schools.map((school, idx) => {
                const roleObj =
                  parseField(school, "role") ??
                  (isSystemAdmin
                    ? { id: ROLES.ADMIN, name: "Админ" }
                    : null);
                const roleMeta =
                  ROLE_META[roleObj?.id] ?? FALLBACK_ROLE;
                const roleLabel = roleObj?.name;
                const imgSrc = schoolPictures[school.id];
                const gradient =
                  CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
                const isHovered = hoveredId === school.id;

                return (
                  <button
                    key={school.id}
                    onClick={() => handleSelect(school)}
                    onMouseEnter={() => setHoveredId(school.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="school-card-enter group relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white text-left shadow-sm transition-all duration-300 hover:border-zinc-300 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                    style={{ animationDelay: `${idx * 70}ms` }}
                  >
                    {/* ── Card header — image or gradient ── */}
                    <div className="relative h-36 overflow-hidden">
                      {imgSrc ? (
                        <>
                          <img
                            src={imgSrc}
                            alt={school.name ?? ""}
                            className="h-full w-full object-cover transition-transform duration-500"
                          />
                          {/* Dark overlay for readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                        </>
                      ) : (
                        <div
                          // className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
                          className={`flex h-full w-full items-center justify-center bg-zinc-400/80`}
                        >
                          <FaSchool className="text-4xl text-zinc-600/50" />
                          {/* Decorative circles */}
                          {/* <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" /> */}
                          {/* <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5" /> */}
                        </div>
                      )}

                      {/* School ID badge */}
                      {school.id !== 0 && (
                        <div className="absolute top-3 right-3 rounded-lg bg-black/30 backdrop-blur-md px-2 py-0.5 text-[11px] font-medium text-white/80">
                          #{school.id}
                        </div>
                      )}

                      {/* System school badge */}
                      {school.id === 0 && (
                        <div className="absolute top-3 right-3 rounded-lg bg-red-800/30 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-white">
                          Систем
                        </div>
                      )}
                    </div>

                    {/* ── Card body ── */}
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <h3 className="text-[15px] font-semibold text-zinc-900 line-clamp-2 leading-snug">
                          {school.name ?? `Сургууль #${school.id}`}
                        </h3>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        {roleLabel ? (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${roleMeta.bg} ${roleMeta.text} ${roleMeta.border} border bg-zinc-200 text-zinc-800 border-zinc-200`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full bg-zinc-700 ${roleMeta.dot}`}
                            />
                            {roleLabel}
                          </span>
                        ) : (
                          <span />
                        )}

                        {/* <span
                          className={`inline-flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300 ${
                            isHovered
                              ? "bg-zinc-800 text-white"
                              : "bg-zinc-100 text-zinc-400"
                          }`}
                        >
                          <FiArrowRight className="h-3.5 w-3.5" />
                        </span> */}
                        <span
                          className={`inline-flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300 ${
                            isHovered
                              ? "bg-zinc-800 text-white"
                              : "bg-zinc-100 text-zinc-400"
                          }`}
                        >
                          <FiArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── Request access button ── */}
            <div className="mt-6 text-center school-card-enter" style={{ animationDelay: "300ms" }}>
              <button
                type="button"
                onClick={() => setShowRequestDialog(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-600 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-800 hover: active:scale-[0.98]"
              >
                <FiSend className="h-4 w-4" />
                Эрхийн санал хүсэлт
              </button>
            </div>
          </>
        )}

        {/* ── Logout ── */}
        <div className="mt-8 text-center school-card-enter" style={{ animationDelay: "400ms" }}>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-red-500"
          >
            <FiLogOut className="h-4 w-4" />
            Гарах
          </button>
        </div>
      </div>

      <RequestAccessDialog
        open={showRequestDialog}
        onClose={() => setShowRequestDialog(false)}
        userSchools={schools}
      />
    </div>
  );
}
