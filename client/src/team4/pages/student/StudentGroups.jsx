import { useState } from "react";
import { FiUsers } from "react-icons/fi";
import { useAuth } from "../../utils/AuthContext";
import { getStudentCourses } from "./api/studentCourseApi";
import { getGroupDetail, getCourseMembers } from "./api/studentGroupApi";
import { useStudentData } from "./hooks";
import PageHeader from "./components/PageHeader";
import TeamCard from "./components/TeamCard";
import GroupDetailView from "./components/GroupDetailView";
import Pagination from "./components/Pagination";

const PAGE_SIZE = 6;

async function loadStudentGroups(userId) {
  if (!userId) return [];

  const enrolled = await getStudentCourses(userId);
  const courses = enrolled?.items ?? [];

  const withGroup = courses
    .map((enrollment) => {
      const course = enrollment.course ?? {};
      return {
        enrollment,
        course,
        courseId: course.id ?? enrollment.course_id,
        groupId: enrollment.group_id ?? enrollment.group?.id ?? null,
      };
    })
    .filter((e) => e.groupId != null);

  return Promise.all(
    withGroup.map(async ({ enrollment, course, courseId, groupId }) => {
      const [groupDetail, members] = await Promise.all([
        getGroupDetail(groupId).catch(() => null),
        getCourseMembers(courseId).catch(() => ({ items: [] })),
      ]);

      const classmates = (members?.items ?? []).filter(
        (m) => m.group_id === groupId,
      );

      return {
        courseId,
        courseName: course.name ?? `Хичээл #${courseId}`,
        groupId,
        groupDetail: groupDetail ?? {
          id: groupId,
          name: enrollment.group?.name,
        },
        classmates,
      };
    }),
  );
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
      }`}
    >
      {children}
    </button>
  );
}

function FilterTabs({ groups, active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterBtn active={active === "all"} onClick={() => onChange("all")}>
        Бүгд
      </FilterBtn>
      {groups.map((g) => (
        <FilterBtn
          key={g.courseId}
          active={active === g.courseId}
          onClick={() => onChange(g.courseId)}
        >
          {g.groupDetail?.name || `Team ${g.courseId}`}
        </FilterBtn>
      ))}
    </div>
  );
}

export default function StudentGroups() {
  const { user } = useAuth();
  const { data, loading, error } = useStudentData(
    () => loadStudentGroups(user?.id),
    [user?.id],
  );

  const groups = data ?? [];

  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const expanded = expandedCourseId
    ? groups.find((g) => g.courseId === expandedCourseId)
    : null;

  if (expanded) {
    return (
      <GroupDetailView
        group={expanded}
        meId={user?.id}
        onBack={() => setExpandedCourseId(null)}
      />
    );
  }

  const filtered =
    filter === "all" ? groups : groups.filter((g) => g.courseId === filter);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {!loading && groups.length > 0 ? (
        <FilterTabs
          groups={groups}
          active={filter}
          onChange={(v) => {
            setFilter(v);
            setPage(1);
          }}
        />
      ) : null}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl bg-zinc-100"
            />
          ))}
        </div>
      )}

      {!loading && groups.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white py-16 text-center">
          <FiUsers className="mb-3 h-10 w-10 text-zinc-300" />
          <p className="font-medium text-zinc-700">Баг олдсонгүй</p>
          <p className="mt-1 text-sm text-zinc-400">
            Та ямар нэг хичээлд багд хуваарилагдаагүй байна.
          </p>
        </div>
      )}

      {!loading && groups.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((g) => (
              <TeamCard
                key={g.courseId}
                group={g}
                onClick={() => setExpandedCourseId(g.courseId)}
              />
            ))}
          </div>

          {pageCount > 1 && (
            <Pagination
              page={currentPage}
              pageCount={pageCount}
              onChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
