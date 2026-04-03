// Member C implements this page.
// Accessible at: /team4/student
// Only visible to users with role "student".
export default function StudentDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Оюутны самбар</h1>
      <p className="text-zinc-500">
        Энэ хуудсыг Member C хөгжүүлнэ. Оюутанд зориулсан хяналтын самбар.
      </p>
    </div>
  );
}
