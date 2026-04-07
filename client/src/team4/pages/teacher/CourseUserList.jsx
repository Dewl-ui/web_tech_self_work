import { useParams } from "react-router-dom";

export default function CourseUserList() {
  const { course_id } = useParams();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-zinc-900">Хичээлийн хэрэглэгчид</h1>
      <p className="mt-1 text-sm text-zinc-500">Хичээл ID: {course_id} — API: GET /courses/{"{cid}"}/users</p>
    </div>
  );
}
