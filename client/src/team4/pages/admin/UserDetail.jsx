import { useParams } from "react-router-dom";

export default function UserDetail() {
  const { user_id } = useParams();
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-zinc-900">Хэрэглэгчийн мэдээлэл</h1>
      <p className="mt-1 text-sm text-zinc-500">ID: {user_id} — API: GET /users/{"{id}"}</p>
    </div>
  );
}
