import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTeam1Role from "../../hooks/useTeam1Role";
import useTeam1School from "../../hooks/useTeam1School";
import {
  createCategory,
  deleteCategory,
  getCategoriesBySchool,
  updateCategory,
} from "../../services/categoryService";
import { canCreateCategory, getErrorMessage } from "../../utils/school";

const emptyForm = {
  name: "",
  picture: "",
};

export default function CategoriesPage() {
  const navigate = useNavigate();
  const role = useTeam1Role();
  const currentSchool = useTeam1School();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentSchool?.id) {
      setLoading(false);
      return;
    }

    getCategoriesBySchool(currentSchool.id)
      .then((items) => setCategories(items || []))
      .catch((loadError) => {
        setError(
          getErrorMessage(loadError, "Ангиллын жагсаалтыг уншиж чадсангүй.")
        );
      })
      .finally(() => setLoading(false));
  }, [currentSchool?.id]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentSchool?.id) return;

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        const updated = await updateCategory(editingId, {
          school_id: currentSchool.id,
          name: form.name,
          picture: form.picture || null,
        });

        setCategories((prev) =>
          prev.map((item) => (Number(item.id) === Number(editingId) ? updated : item))
        );
      } else {
        const created = await createCategory(currentSchool.id, {
          school_id: currentSchool.id,
          name: form.name,
          picture: form.picture || null,
        });

        setCategories((prev) => [...prev, created]);
      }

      resetForm();
    } catch (saveError) {
      setError(
        getErrorMessage(
          saveError,
          editingId
            ? "Ангилал засахад алдаа гарлаа."
            : "Ангилал нэмэхэд алдаа гарлаа."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      setSaving(true);
      setError("");
      await deleteCategory(categoryId);
      setCategories((prev) =>
        prev.filter((item) => Number(item.id) !== Number(categoryId))
      );

      if (Number(editingId) === Number(categoryId)) {
        resetForm();
      }
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Ангилал устгаж чадсангүй."));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name || "",
      picture: category.picture || "",
    });
    setError("");
  };

  if (!currentSchool?.id) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        Эхлээд сургууль сонгоно уу.
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-8">
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Ангилал</h1>
        <p className="mt-2 text-slate-500">{currentSchool.name}</p>
      </div>

      {canCreateCategory(role) ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-[2rem] bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Ангиллын нэр
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Ангиллын нэр"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Зураг
              </label>
              <input
                type="text"
                value={form.picture}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, picture: event.target.value }))
                }
                placeholder="Зургийн холбоос"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white"
            >
              {saving
                ? "Хадгалж байна..."
                : editingId
                  ? "Ангилал хадгалах"
                  : "Ангилал нэмэх"}
            </button>

            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700"
              >
                Болих
              </button>
            ) : null}
          </div>
        </form>
      ) : null}

      {error ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</div>
      ) : null}

      {loading ? (
        <div className="rounded-xl bg-white p-6 shadow">Ачаалж байна...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <div
              key={category.id || index}
              className="rounded-2xl bg-white p-5 text-left shadow-sm"
            >
              <button
                type="button"
                onClick={() => navigate(`/team1/categories/${category.id}`)}
                className="w-full text-left"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-500">
                  Ангилал
                </p>
                <h2 className="mt-3 text-lg font-bold text-slate-800">
                  {category.name || `Ангилал ${index + 1}`}
                </h2>
              </button>

              {canCreateCategory(role) ? (
                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(category)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Засах
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category.id)}
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-500"
                  >
                    Устгах
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
