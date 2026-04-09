import Card from './Card';
export default function EmptyState({ title = 'Мэдээлэл байхгүй', description = '' }) {
  return <Card className="flex min-h-[240px] flex-col items-center justify-center text-center"><h3 className="text-xl font-bold text-slate-700">{title}</h3>{description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}</Card>;
}
