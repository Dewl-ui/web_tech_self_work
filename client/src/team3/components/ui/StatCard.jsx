import Card from './Card';

export default function StatCard({ label, value, className = '' }) {
  return (
    <Card className={`text-center ${className}`}>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-3 bg-[linear-gradient(135deg,#2563eb,#7c3aed)] bg-clip-text text-4xl font-extrabold text-transparent">{value}</p>
    </Card>
  );
}
