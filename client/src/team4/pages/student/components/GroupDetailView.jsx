import { FiArrowLeft, FiUsers } from "react-icons/fi";
import { avatarSrc } from "../utils";

const CARD = "rounded-xl border border-zinc-200 bg-white p-5";

export default function GroupDetailView({ group, meId, onBack }) {
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
  const name =
    [u.last_name, u.first_name].filter((x) => x && x !== "-").join(" ") ||
    u.username ||
    `User #${u.id}`;
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
