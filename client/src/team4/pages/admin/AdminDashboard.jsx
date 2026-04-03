// Member A implements this page.
// Accessible at: /team4/admin
// Only visible to users with role "admin".
export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Админ самбар</h1>
      <p className="text-zinc-500">
        Энэ хуудсыг Member A хөгжүүлнэ. Admin-д зориулсан хяналтын самбар.
      </p>
    </div>
  );
}
