import { dashboardStats, upcomingExams, recentActivities } from "./mockData";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Хяналтын самбар</h1>
        <p className="text-gray-500 mt-1">Багш, тавтай морилно уу</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Нийт хичээлүүд</p>
          <h2 className="text-4xl font-bold mt-2">{dashboardStats.totalCourses}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Идэвхтэй шалгалтууд</p>
          <h2 className="text-4xl font-bold mt-2">{dashboardStats.activeExams}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Нийт оюутнууд</p>
          <h2 className="text-4xl font-bold mt-2">{dashboardStats.totalStudents}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Удахгүй болох шалгалтууд</h2>
          </div>

          <div className="p-4 space-y-4">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="border rounded-xl p-4">
                <h3 className="font-semibold">{exam.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{exam.meta}</p>
                <p className="text-sm text-blue-600 mt-2">{exam.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Саяхны үйл ажиллагаа</h2>
          </div>

          <div className="p-4 space-y-4 text-sm text-gray-600">
            {recentActivities.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Түргэн үйлдлүүд</h2>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Шалгалт үүсгэх
          </button>
          <button className="border px-4 py-2 rounded-lg">
            Сургалтыг удирдах
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;