import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SchoolCard from "../../components/school/SchoolCard";
import { deleteSchool, getSchools } from "../../services/schoolService";
import { getRole } from "../../utils/school";

function extractSchools(res) {
  if (Array.isArray(res?.data?.items)) {
    return res.data.items;
  }

  if (Array.isArray(res?.data?.data)) {
    return res.data.data;
  }

  if (Array.isArray(res?.data)) {
    return res.data;
  }

  return [];
}

function normalizeSchool(school, index) {
  return {
    id: school?.id || school?.school_id || index + 1,
    name: school?.name || school?.school_name || "Сургууль",
    picture:
      school?.picture ||
      school?.image ||
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    priority: school?.priority ?? index + 1,
  };
}

export default function SchoolsPage() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const role = getRole();
  const canManage = role === "admin" || role === "teacher";

  useEffect(() => {
    getSchools()
      .then((res) => {
        const data = extractSchools(res).map(normalizeSchool);
        setSchools(data);
      })
      .catch((loadError) => {
        console.error(loadError);
        setError(loadError.message || "Сургуулиудыг ачаалж чадсангүй");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    deleteSchool(id)
      .then(() => {
        setSchools((prev) => prev.filter((school) => school.id !== id));
      })
      .catch((deleteError) => {
        console.error(deleteError);
        setError(deleteError.message || "Сургуулийг устгаж чадсангүй");
      });
  };

  const filteredSchools = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return schools;
    }

    return schools.filter((school) =>
      String(school.name || "").toLowerCase().includes(query)
    );
  }, [schools, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
            Schools
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Сургуулиуд
          </h1>
        </div>

        {canManage ? (
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
              key={school.id}
              onClick={() => navigate(`/team1/schools/${school.id}`)}
              className="cursor-pointer"
            >
              <SchoolCard
                school={school}
                onDelete={handleDelete}
                canDelete={canManage}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
