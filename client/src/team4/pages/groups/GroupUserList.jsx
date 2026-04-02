import { useParams } from "react-router-dom";

export default function GroupUserList() {
  const { course_id, group_id } = useParams();
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-zinc-900">Бүлгийн гишүүд</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Хичээл ID: {course_id} · Бүлэг ID: {group_id} — API: GET /courses/{"{cid}"}/users (filter by group)
      </p>
    </div>
  );
}
