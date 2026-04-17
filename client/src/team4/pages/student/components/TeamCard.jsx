export default function TeamCard({ group, onClick }) {
  const teamName = group.groupDetail?.name || "Баг оноогүй";
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-5 text-left transition-all hover:border-zinc-300 hover:shadow-sm"
    >
      <p className="truncate text-xs font-medium uppercase tracking-wide text-zinc-400">
        {group.courseName}
      </p>
      <h3 className="text-base font-bold text-zinc-900">{teamName}</h3>
      <p className="text-sm text-zinc-500">{group.classmates.length} гишүүн</p>
    </button>
  );
}
