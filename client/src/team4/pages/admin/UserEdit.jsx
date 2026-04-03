import { useParams } from "react-router-dom";

export default function UserEdit() {
  const { user_id } = useParams();
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-zinc-900">Хэрэглэгч засах</h1>
      <p className="mt-1 text-sm text-zinc-500">ID: {user_id} — API: PUT /users/{"{id}"}</p>
    </div>
  );
}
