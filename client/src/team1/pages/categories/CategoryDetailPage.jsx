import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTeam1Role from "../../hooks/useTeam1Role";
import useTeam1School from "../../hooks/useTeam1School";
import {
  deleteCategory,
  getCategory,
  getCategoriesBySchool,
  getCoursesByCategory,
  removeCourseFromCategory,
  updateCategory,
} from "../../services/categoryService";
import {
  getCoursesBySchool,
  moveCourseToCategory,
} from "../../services/courseService";
import {
  canCreateCategory,
  canCreateCourse,
  getErrorMessage,
  setCurrentCourse,
} from "../../utils/school";

export default function CategoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useTeam1Role();
  const currentSchool = useTeam1School();
  const [category, setCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [moveTargets, setMoveTargets] = useState({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", picture: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const mergeCourses = (primaryCourses = [], schoolCourses = []) => {
    const directItems = Array.isArray(primaryCourses) ? primaryCourses : [];
    const fallbackItems = (Array.isArray(schoolCourses) ? schoolCourses : []).filter(
      (course) => Number(course?.category_id) === Number(id)
    );

    const merged = [...directItems];

    fallbackItems.forEach((course) => {
      if (!merged.some((item) => Number(item?.id) === Number(course?.id))) {
        merged.push(course);
      }
    });

    return merged;
  };

  const loadData = async () => {
    if (!currentSchool?.id || !id) return;

    const [categoryItem, categoryItems, categoryCourses, schoolCourses] =
      await Promise.all([
        getCategory(id),
        getCategoriesBySchool(currentSchool.id),
        getCoursesByCategory(id),
        getCoursesBySchool(currentSchool.id),
      ]);

    setCategory(categoryItem);
    setForm({
      name: categoryItem?.name || "",
      picture: categoryItem?.picture || "",
    });
    setCategories(categoryItems || []);
    setCourses(mergeCourses(categoryCourses, schoolCourses));
    setAllCourses(schoolCourses || []);
  };

  useEffect(() => {
    if (!currentSchool?.id || !id) {
      setLoading(false);
      return;
    }

    loadData()
      .catch((loadError) => {
        setError(
          getErrorMessage(loadError, "Ангиллын мэдээлэл уншиж чадсангүй.")
        );
      })
      .finally(() => setLoading(false));
  }, [currentSchool?.id, id]);

  const availableCourses = useMemo(
    () => allCourses.filter((course) => Number(course?.category_id) !== Number(id)),
    [allCourses, id]
  );

  const categoryOptions = useMemo(
    () => categories.filter((item) => Number(item.id) !== Number(id)),
    [categories, id]
  );

  const handleSaveCategory = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      const updated = await updateCategory(id, {
        school_id: currentSchool?.id,
        name: form.name,
        picture: form.picture || null,
      });
      setCategory(updated);
      setEditing(false);
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Ангилал засаж чадсангүй."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      setSaving(true);
      setError("");
      await deleteCategory(id);
      navigate("/team1/categories");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Ангилал устгаж чадсангүй."));
    } finally {
      setSaving(false);
    }
  };

  const handleAddExistingCourse = async () => {
    if (!selectedCourseId || !currentSchool?.id) return;

    const selectedCourse = allCourses.find(
      (course) => Number(course.id) === Number(selectedCourseId)
    );

    if (!selectedCourse) return;

    try {
      setSaving(true);
      setError("");
      const updatedCourse = await moveCourseToCategory(
        currentSchool.id,
        selectedCourse,
        Number(id)
      );

      setSelectedCourseId("");
      setCourses((prev) => {
        const next = [...prev];

        if (!next.some((item) => Number(item?.id) === Number(updatedCourse?.id))) {
          next.push({
            ...selectedCourse,
            ...updatedCourse,
            category_id: Number(id),
          });
        }

        return next;
      });
      await loadData();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Хичээлийг ангилалд нэмж чадсангүй."));
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFromCategory = async (course) => {
    try {
      setSaving(true);
      setError("");
      await removeCourseFromCategory(id, course.id);
      setCourses((prev) =>
        prev.filter((item) => Number(item?.id) !== Number(course.id))
      );
      await loadData();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Ангиллаас хасаж чадсангүй."));
    } finally {
      setSaving(false);
    }
  };

  const handleMoveToCategory = async (course) => {
    const targetCategoryId = moveTargets[course.id];

    if (!targetCategoryId || !currentSchool?.id) return;

    try {
      setSaving(true);
      setError("");
      const updatedCourse = await moveCourseToCategory(
        currentSchool.id,
        course,
        Number(targetCategoryId)
      );
      setCourses((prev) =>
        prev.filter((item) => Number(item?.id) !== Number(updatedCourse?.id))
      );
      await loadData();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Өөр ангилал руу шилжүүлж чадсангүй."));
    } finally {
      setSaving(false);
    }
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
        <button
          type="button"
          onClick={() => navigate("/team1/categories")}
          className="mb-2 text-sm text-indigo-500 hover:underline"
        >
          ← Буцах
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {category?.name || "Ангиллын дэлгэрэнгүй"}
            </h1>
            <p className="mt-2 text-slate-500">{currentSchool.name}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {canCreateCourse(role) ? (
              <button
                type="button"
                onClick={() =>
                  navigate("/team1/courses/create", {
                    state: { school: currentSchool, category },
                  })
                }
                className="rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white"
              >
                + Хичээл нэмэх
              </button>
            ) : null}

            {canCreateCategory(role) ? (
              <>
                <button
                  type="button"
                  onClick={() => setEditing((prev) => !prev)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700"
                >
                  {editing ? "Засвар хаах" : "Ангилал засах"}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  className="rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-500"
                >
                  Ангилал устгах
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {editing && canCreateCategory(role) ? (
        <form
          onSubmit={handleSaveCategory}
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
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white"
          >
            {saving ? "Хадгалж байна..." : "Ангилал хадгалах"}
          </button>
        </form>
      ) : null}

      {canCreateCourse(role) ? (
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            Өмнө үүссэн хичээлээс нэмэх
          </h2>
          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <select
              value={selectedCourseId}
              onChange={(event) => setSelectedCourseId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none"
            >
              <option value="">Хичээл сонгоно уу</option>
              {availableCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddExistingCourse}
              disabled={!selectedCourseId || saving}
              className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
            >
              Ангилалд нэмэх
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</div>
      ) : null}

      {loading ? (
        <div className="rounded-xl bg-white p-6 shadow">Ачаалж байна...</div>
      ) : courses.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow">
          Энэ ангилалд хичээл алга.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => (
            <div
              key={course.id || index}
              className="rounded-2xl bg-white p-5 text-left shadow-sm"
            >
              <button
                type="button"
                onClick={() => {
                  setCurrentCourse(course);
                  navigate(`/team1/courses/${course.id}`);
                }}
                className="w-full text-left"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-500">
                  Хичээл
                </p>
                <h2 className="mt-3 text-lg font-bold text-slate-800">
                  {course.name || `Хичээл ${index + 1}`}
                </h2>
              </button>

              {canCreateCourse(role) ? (
                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => handleRemoveFromCategory(course)}
                    className="w-full rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
                  >
                    Ангиллаас хасах
                  </button>

                  <div className="flex gap-2">
                    <select
                      value={moveTargets[course.id] || ""}
                      onChange={(event) =>
                        setMoveTargets((prev) => ({
                          ...prev,
                          [course.id]: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                    >
                      <option value="">Өөр ангилал сонгох</option>
                      {categoryOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleMoveToCategory(course)}
                      disabled={!moveTargets[course.id] || saving}
                      className="rounded-xl bg-slate-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      Шилжүүлэх
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
