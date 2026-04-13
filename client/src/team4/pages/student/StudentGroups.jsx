import { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { useAuth } from "../../utils/AuthContext";
import { getStudentCourses, parseField } from "./api/studentCourseApi";
import { getGroupDetail, getCourseMembers } from "./api/studentGroupApi";
import { useToast } from "../../components/ui/Toast";

function avatarSrc(picture) {
  if (!picture || picture === "no-image.jpg") return null;
  if (/^(https?:)?\/\//i.test(picture)) return picture;
  if (picture.startsWith("data:image/")) return picture;
  return `https://todu.mn/bs/lms/v1/${picture}`;
}

export default function StudentGroups() {
  const { user } = useAuth();
  const toast = useToast();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);

    (async () => {
      try {
        const enrolled = await getStudentCourses(user.id);
        const courses = enrolled?.items ?? [];

        const results = await Promise.all(
          courses.map(async (enrollment) => {
            const course = parseField(enrollment, "course") ?? {};
            const courseId = course.id ?? enrollment.course_id;
            const groupId = enrollment.group_id ?? parseField(enrollment, "group")?.id ?? null;

            let groupDetail = null;
            if (groupId) {
              try {
                groupDetail = await getGroupDetail(groupId);
              } catch {
                groupDetail = { id: groupId, name: parseField(enrollment, "group")?.name ?? null };
              }
            }

            let classmates = [];
            try {
              const members = await getCourseMembers(courseId);
              classmates = (members?.items ?? []).filter(
                (m) => groupId && m.group_id === groupId
              );
            } catch {
              classmates = [];
            }

            return {
              courseId,
              courseName: course.name ?? `Хичээл #${courseId}`,
              groupId,
              groupDetail,
              classmates,
            };
          })
        );

        setGroups(results);
      } catch (err) {
        const msg = err.message || "Бүлгийн мэдээлэл ачааллахад алдаа гарлаа.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100">
          <FiUsers className="h-5 w-5 text-zinc-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Миний бүлгүүд</h1>
          <p className="text-sm text-zinc-500">Хичээл тус бүрт хуваарилагдсан бүлэг болон ангийн гишүүд</p>
        </div>
      </div>

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
          <div key={g.courseId} className="rounded-xl border border-zinc-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-zinc-400">{g.courseName}</p>
                <h2 className="text-lg font-semibold text-zinc-900">
                  {g.groupDetail?.name || "Бүлэгт хуваарилагдаагүй"}
                </h2>
              </div>
              {g.groupDetail?.priority != null && (
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                  Эрэмбэ: {g.groupDetail.priority}
                </span>
              )}
            </div>

            <div className="mt-4 border-t border-zinc-100 pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Ангийн гишүүд ({g.classmates.length})
              </p>
              {g.classmates.length === 0 ? (
                <p className="text-sm text-zinc-400">Гишүүн олдсонгүй.</p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {g.classmates.map((m) => {
                    const u = m.user ?? {};
                    const name = [u.last_name, u.first_name].filter((x) => x && x !== "-").join(" ") || u.username || u.email;
                    const pic = avatarSrc(u.picture);
                    const isMe = u.id === user?.id;
                    return (
                      <div
                        key={m.id ?? m.user_id}
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
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
