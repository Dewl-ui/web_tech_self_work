import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-slate-800">Хичээлийн агуулгын хэсэг</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Link
          to="/team1/schools"
          className="rounded-2xl bg-white p-6 shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Сургууль</h2>
          <p className="mt-2 text-gray-600">Сургуулиудын жагсаалт харах</p>
        </Link>

        <Link
          to="/team1/courses"
          className="rounded-2xl bg-white p-6 shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Сургалтууд</h2>
          <p className="mt-2 text-gray-600">Хичээлийн жагсаалт харах</p>
        </Link>

        <Link
          to="/team1/categories"
          className="rounded-2xl bg-white p-6 shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Ангилал</h2>
          <p className="mt-2 text-gray-600">Хичээлийн ангиллууд харах</p>
        </Link>
      </div>
    </div>
  );
}
