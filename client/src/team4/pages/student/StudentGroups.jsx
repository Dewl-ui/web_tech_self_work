import { FiUsers } from "react-icons/fi";
import { useAuth } from "../../utils/AuthContext";
import { getStudentCourses } from "./api/studentCourseApi";
import { getGroupDetail, getCourseMembers } from "./api/studentGroupApi";
import { useStudentData } from "./hooks";
import { avatarSrc } from "./utils";
import PageHeader from "./components/PageHeader";

async function loadStudentGroups(userId) {
  if (!userId) return [];
  const enrolled = await getStudentCourses(userId);
  const courses = enrolled?.items ?? [];

  return Promise.all(
    courses.map(async (enrollment) => {
      const course = enrollment.course ?? {};
      const courseId = course.id ?? enrollment.course_id;
      const groupId = enrollment.group_id ?? enrollment.group?.id ?? null;

      const [groupDetail, members] = await Promise.all([
        groupId ? getGroupDetail(groupId).catch(() => null) : Promise.resolve(null),
        getCourseMembers(courseId).catch(() => ({ items: [] })),
      ]);

      const classmates = (members?.items ?? []).filter(
        (m) => groupId && m.group_id === groupId
      );

      return {
        courseId,
        courseName: course.name ?? `Хичээл #${courseId}`,
        groupId,
        groupDetail: groupDetail ?? (groupId ? { id: groupId, name: enrollment.group?.name } : null),
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

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={FiUsers}
        title="Миний бүлгүүд"
        subtitle="Хичээл тус бүрт хуваарилагдсан бүлэг болон ангийн гишүүд"
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-40 animate-pulse rounded-xl bg-zinc-100" />)}
        </div>
      )}

      {!loading && groups.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white py-16 text-center">
          <FiUsers className="mb-3 h-10 w-10 text-zinc-300" />
          <p className="font-medium text-zinc-700">Бүлэг олдсонгүй</p>
          <p className="mt-1 text-sm text-zinc-400">Та ямар нэг хичээлд бүртгэлгүй байна.</p>
        </div>
      )}

      <div className="space-y-4">
        {groups.map((g) => (
          <GroupCard key={g.courseId} group={g} meId={user?.id} />
        ))}
      </div>
    </div>
  );
}

function GroupCard({ group, meId }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-zinc-400">{group.courseName}</p>
          <h2 className="text-lg font-semibold text-zinc-900">
            {group.groupDetail?.name || "Бүлэгт хуваарилагдаагүй"}
          </h2>
        </div>
        {group.groupDetail?.priority != null && (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
            Эрэмбэ: {group.groupDetail.priority}
          </span>
        )}
      </div>

      <div className="mt-4 border-t border-zinc-100 pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Ангийн гишүүд ({group.classmates.length})
        </p>
        {group.classmates.length === 0 ? (
          <p className="text-sm text-zinc-400">Гишүүн олдсонгүй.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {group.classmates.map((m) => (
              <ClassmateRow key={m.id ?? m.user_id} member={m} isMe={m.user?.id === meId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ClassmateRow({ member, isMe }) {
  const u = member.user ?? {};
  const name = [u.last_name, u.first_name].filter((x) => x && x !== "-").join(" ") || u.username || u.email;
  const pic = avatarSrc(u.picture);

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
        isMe ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-100"
      }`}
    >
      {pic ? (
        <img src={pic} alt={name} className="h-8 w-8 rounded-full object-cover" />
      ) : (
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isMe ? "bg-white/20" : "bg-zinc-100"}`}>
          <FiUsers className={`h-4 w-4 ${isMe ? "text-white" : "text-zinc-500"}`} />
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{name}{isMe ? " (Би)" : ""}</p>
        <p className={`truncate text-xs ${isMe ? "text-zinc-300" : "text-zinc-500"}`}>
          {u.email || u.username}
        </p>
      </div>
    </div>
  );
}
