// Member B implements this page.
// Accessible at: /team4/teacher
// Only visible to users with role "teacher".
export default function TeacherDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Багшийн самбар</h1>
      <p className="text-zinc-500">
        Энэ хуудсыг Member B хөгжүүлнэ. Багшид зориулсан хяналтын самбар.
      </p>
    </div>
  );
}
