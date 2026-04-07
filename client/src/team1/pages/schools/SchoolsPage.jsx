import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SchoolCard from "../../components/school/SchoolCard";
import useTeam1Role from "../../hooks/useTeam1Role";
import { deleteSchool, getSchools } from "../../services/schoolService";
import {
  canCreateSchool,
  getErrorMessage,
  setCurrentSchool,
} from "../../utils/school";

function normalizeSchool(school, index) {
  const rawId = school?.id || school?.school_id || index + 1;
  const rawName = school?.name || school?.school_name || "Сургууль";

  return {
    id: rawId,
    key: `${rawId}-${rawName}-${index}`,
    name: rawName,
    picture: school?.picture || school?.image || "",
    priority: school?.priority ?? index + 1,
  };
}

export default function SchoolsPage() {
  const navigate = useNavigate();
  const role = useTeam1Role();
  const [schools, setSchools] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getSchools()
      .then((items) => {
        if (isMounted) {
          setSchools(items.map(normalizeSchool));
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(
            getErrorMessage(loadError, "Сургуулиудыг ачаалж чадсангүй.")
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSchools = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return schools;
    }

    return schools.filter((school) =>
      String(school.name || "").toLowerCase().includes(query)
    );
  }, [schools, search]);

  const handleOpenSchool = (school) => {
    setCurrentSchool(school);
    navigate(`/team1/schools/${school.id}`, {
      state: { school },
    });
  };

  const handleDeleteSchool = async (schoolId) => {
    try {
      setError("");
      await deleteSchool(schoolId);
      setSchools((prev) =>
        prev.filter((school) => Number(school.id) !== Number(schoolId))
      );
    } catch (deleteError) {
      setError(
        getErrorMessage(deleteError, "Сургуулийг устгаж чадсангүй.")
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
            Сургуулиуд
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Сургуулиуд
          </h1>
        </div>

        {canCreateSchool(role) ? (
          <button
            onClick={() => navigate("/team1/schools/create")}
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            + Сургууль нэмэх
          </button>
        ) : null}
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Сургуулийн нэрээр хайх"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
        />
      </div>

      {loading ? (
        <p>Ачаалж байна...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredSchools.length === 0 ? (
        <p>Илэрц олдсонгүй</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredSchools.map((school) => (
            <div
              key={school.key}
              onClick={() => handleOpenSchool(school)}
              className="cursor-pointer"
            >
              <SchoolCard
                school={school}
                canDelete={canCreateSchool(role)}
                onDelete={handleDeleteSchool}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
