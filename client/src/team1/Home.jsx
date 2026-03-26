import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-slate-800">Хичээлийн агуулгын хэсэг</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/team1/courses"
          className="bg-white rounded-2xl shadow p-6 hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Сургалтууд</h2>
          <p className="text-gray-600 mt-2">Хичээлийн жагсаалт харах</p>
        </Link>

        <Link
          to="/team1/categories"
          className="bg-white rounded-2xl shadow p-6 hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Ангилал</h2>
          <p className="text-gray-600 mt-2">Хичээлийн ангиллууд харах</p>
        </Link>
      </div>
    </div>
  );
}