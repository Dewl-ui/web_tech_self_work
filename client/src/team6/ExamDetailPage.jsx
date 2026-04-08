const ExamDetailPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Завсрын шалгалт - Мод ба графикууд</h1>
            <p className="text-sm text-gray-500 mt-2">
              Хоёртын мод, AVL мод, график алгоритмуудыг хамарсан цогц шалгалт
            </p>
            <p className="text-sm text-gray-400">Өгөгдлийн бүтэц ба алгоритмууд</p>
          </div>

          <div className="flex gap-3">
            <button className="border px-4 py-2 rounded-lg">Засварлах</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Тайлан харах
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-4 border-t">
          <div>
            <p className="text-sm text-gray-400">Хугацаа</p>
            <p className="font-semibold">90 мин</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Оноо</p>
            <p className="font-semibold">100</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Асуултууд</p>
            <p className="font-semibold">2</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Эхлэх цаг</p>
            <p className="font-semibold">5-р сарын 05, 12:00 цаг</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Хувилбар</p>
            <p className="font-semibold">2</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-semibold">A хувилбар</h2>
        </div>

        <div className="p-4 space-y-4">
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-400">1 онон сонголттой · 2 оноо</p>
            <h3 className="font-semibold mt-2">
              Тэнцвэртэй хоёртын хайлтын модонд хайлтын цагийн нарийн төвөгтэй байдал хэд вэ?
            </h3>

            <div className="mt-4 space-y-2 text-sm">
              <div>A. O(1)</div>
              <div className="text-green-600 font-semibold">B. O(log n)</div>
            </div>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-400">Үнэн/Худал · 3 оноо</p>
            <h3 className="font-semibold mt-2">
              AVL мод нь үргэлж бүрэн хоёртын мод байдаг.
            </h3>

            <div className="mt-4 space-y-2 text-sm">
              <div>A. Үнэн</div>
              <div className="text-green-600 font-semibold">B. Худал</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-semibold">Б хувилбар</h2>
        </div>

        <div className="p-4">
          <div className="border rounded-xl p-4">
            <p className="text-sm text-gray-400">1 онон сонголттой · 2 оноо</p>
            <h3 className="font-semibold mt-2">
              Тэнцвэртэй хоёртын хайлтын модонд хайлтын цагийн нарийн төвөгтэй байдал хэд вэ?
            </h3>

            <div className="mt-4 space-y-2 text-sm">
              <div>A. O(1)</div>
              <div className="text-green-600 font-semibold">B. O(log n)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage;