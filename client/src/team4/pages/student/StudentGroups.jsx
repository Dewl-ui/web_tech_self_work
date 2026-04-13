import { useState } from "react";
import {
  FiUsers,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useAuth } from "../../utils/AuthContext";
import { getStudentCourses } from "./api/studentCourseApi";
import { getGroupDetail, getCourseMembers } from "./api/studentGroupApi";
import { useStudentData } from "./hooks";
import { avatarSrc } from "./utils";
import PageHeader from "./components/PageHeader";

const CARD = "rounded-xl border border-zinc-200 bg-white p-5";
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
        (m) => m.group_id === groupId
      );

      return {
        courseId,
        courseName: course.name ?? `Хичээл #${courseId}`,
        groupId,
        groupDetail: groupDetail ?? { id: groupId, name: enrollment.group?.name },
        classmates,
      };
    })
  );
}

export default function StudentGroups() {
  const { user } = useAuth();
  const { data, loading, error } = useStudentData(
    () => loadStudentGroups(user?.id),
    [user?.id]
  );

  const groups = data ?? [];
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const selected = selectedId ? groups.find((g) => g.courseId === selectedId) : null;

  if (selected) {
    return (
      <GroupDetailView
        group={selected}
        meId={user?.id}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  const filtered = filter === "all" ? groups : groups.filter((g) => g.courseId === filter);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={FiUsers}
        title="Миний багууд"
        subtitle="Хичээл тус бүрт хуваарилагдсан бүлгүүд"
        right={
          !loading && groups.length > 0 ? (
            <FilterTabs
              groups={groups}
              active={filter}
              onChange={(v) => {
                setFilter(v);
                setPage(1);
              }}
            />
          ) : null
        }
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 animate-pulse rounded-xl bg-zinc-100" />)}
        </div>
      )}

      {!loading && groups.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white py-16 text-center">
          <FiUsers className="mb-3 h-10 w-10 text-zinc-300" />
          <p className="font-medium text-zinc-700">Баг олдсонгүй</p>
          <p className="mt-1 text-sm text-zinc-400">Та ямар нэг хичээлд бүртгэлгүй байна.</p>
        </div>
      )}

      {!loading && groups.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((g) => (
              <TeamCard
                key={g.courseId}
                group={g}
                onClick={() => setSelectedId(g.courseId)}
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

function TeamCard({ group, onClick }) {
  const teamName = group.groupDetail?.name || "Баг оноогүй";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${CARD} flex flex-col gap-2 text-left transition-all hover:border-zinc-300 hover:shadow-sm`}
    >
      <p className="truncate text-xs font-medium uppercase tracking-wide text-zinc-400">
        {group.courseName}
      </p>
      <h3 className="text-base font-bold text-zinc-900">{teamName}</h3>
      <p className="text-sm text-zinc-500">{group.classmates.length} гишүүн</p>
    </button>
  );
}

function Pagination({ page, pageCount, onChange }) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <div className="flex justify-end gap-1">
      {pages.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`h-8 w-8 rounded-md border text-sm font-medium transition-colors ${
            page === n
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
          }`}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
      >
        <FiChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
      >
        <FiChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function GroupDetailView({ group, meId, onBack }) {
  const teamName = group.groupDetail?.name || "Баг оноогүй";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
          aria-label="Буцах"
        >
          <FiArrowLeft className="h-4 w-4" />
        </button>
        <span className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700">
          {teamName}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className={`lg:col-span-2 ${CARD}`}>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            {group.courseName}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-zinc-900">{teamName}</h2>

          <div className="mt-4 space-y-2 text-sm">
            {group.groupDetail?.priority != null && (
              <p>
                <span className="text-zinc-500">Эрэмбэ:</span>{" "}
                <span className="font-medium text-zinc-800">{group.groupDetail.priority}</span>
              </p>
            )}
            <p>
              <span className="text-zinc-500">Гишүүдийн тоо:</span>{" "}
              <span className="font-medium text-zinc-800">{group.classmates.length}</span>
            </p>
            {group.groupId && (
              <p>
                <span className="text-zinc-500">Group ID:</span>{" "}
                <span className="font-medium text-zinc-800">{group.groupId}</span>
              </p>
            )}
          </div>
        </div>

        <div className={CARD}>
          <h3 className="mb-3 font-semibold text-zinc-800">Багийн гишүүд</h3>
          {group.classmates.length === 0 ? (
            <p className="text-sm text-zinc-400">Гишүүн олдсонгүй.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {group.classmates.map((m) => (
                <MemberRow key={m.id ?? m.user_id} member={m} isMe={m.user?.id === meId} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function MemberRow({ member, isMe }) {
  const u = member.user ?? {};
  const name = [u.last_name, u.first_name].filter((x) => x && x !== "-").join(" ") || u.username || `User #${u.id}`;
  const pic = avatarSrc(u.picture);

  return (
    <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      {pic ? (
        <img src={pic} alt={name} className="h-9 w-9 rounded-full object-cover" />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100">
          <FiUsers className="h-4 w-4 text-zinc-500" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-zinc-900">
          {name}
          {isMe && <span className="ml-1 text-xs font-normal text-zinc-500">(Би)</span>}
        </p>
        <p className="truncate text-xs text-zinc-500">{u.email || u.username}</p>
      </div>
    </li>
  );
}
