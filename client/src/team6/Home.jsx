import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-10 shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Team 6 Exam Portal</h1>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="teacher"
            className="rounded-2xl bg-blue-600 px-6 py-4 text-center text-white transition hover:bg-blue-700"
          >
            Teacher Portal
          </Link>
          <Link
            to="student"
            className="rounded-2xl bg-green-600 px-6 py-4 text-center text-white transition hover:bg-green-700"
          >
            Student Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
