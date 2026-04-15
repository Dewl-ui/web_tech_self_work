import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Award,
  Target,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { StatsCard } from "../../components/shared/StatsCard";
import { Card } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { mockCourses, mockExams } from "../../data/mockData";

export function ViewAnalytics() {
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedExam, setSelectedExam] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("semester");

  // Mock data for charts
  const scoreDistributionData = [
    { range: "0-20", students: 2 },
    { range: "21-40", students: 5 },
    { range: "41-60", students: 12 },
    { range: "61-80", students: 28 },
    { range: "81-100", students: 38 },
  ];

  const examPerformanceData = [
    { exam: "Quiz 1", average: 78, highest: 95, lowest: 45 },
    { exam: "Quiz 2", average: 82, highest: 98, lowest: 52 },
    { exam: "Midterm", average: 75, highest: 92, lowest: 38 },
    { exam: "Quiz 3", average: 85, highest: 100, lowest: 60 },
    { exam: "Final", average: 80, highest: 96, lowest: 42 },
  ];

  const questionTypeData = [
    { name: "Олон сонголт", value: 450, color: "#3B82F6" },
    { name: "Үнэн/Худал", value: 180, color: "#10B981" },
    { name: "Богино хариулт", value: 120, color: "#F59E0B" },
  ];

  const weeklyPerformanceData = [
    { week: "Week 1", participation: 95, avgScore: 75 },
    { week: "Week 2", participation: 92, avgScore: 78 },
    { week: "Week 3", participation: 98, avgScore: 80 },
    { week: "Week 4", participation: 90, avgScore: 76 },
    { week: "Week 5", participation: 94, avgScore: 82 },
    { week: "Week 6", participation: 96, avgScore: 85 },
    { week: "Week 7", participation: 93, avgScore: 83 },
    { week: "Week 8", participation: 97, avgScore: 87 },
  ];

  const topPerformingStudents = [
    { id: "1", name: "Анхбаяр Болд", score: 96.5, exams: 8 },
    { id: "2", name: "Сарангэрэл Дорж", score: 94.2, exams: 8 },
    { id: "3", name: "Батбаяр Гантулга", score: 92.8, exams: 7 },
    { id: "4", name: "Мөнхзул Өлзий", score: 91.5, exams: 8 },
    { id: "5", name: "Эрдэнэбат Алтан", score: 90.3, exams: 8 },
  ];

  const questionDifficultyData = [
    { question: "Q1", difficulty: "Easy", successRate: 92 },
    { question: "Q2", difficulty: "Easy", successRate: 88 },
    { question: "Q3", difficulty: "Medium", successRate: 75 },
    { question: "Q4", difficulty: "Medium", successRate: 68 },
    { question: "Q5", difficulty: "Hard", successRate: 45 },
    { question: "Q6", difficulty: "Hard", successRate: 38 },
    { question: "Q7", difficulty: "Medium", successRate: 72 },
    { question: "Q8", difficulty: "Easy", successRate: 95 },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics & Reports</h1>
        <p className="text-muted-foreground">
          Шалгалтын үр дүн, оюутны ахиц, статистик мэдээлэл
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Хичээл</label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Хичээл сонгох" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Бүх хичээл</SelectItem>
                {mockCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Шалгалт</label>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger>
                <SelectValue placeholder="Шалгалт сонгох" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Бүх шалгалт</SelectItem>
                {mockExams.slice(0, 5).map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Хугацаа</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Хугацаа сонгох" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Энэ долоо хоног</SelectItem>
                <SelectItem value="month">Энэ сар</SelectItem>
                <SelectItem value="semester">Энэ улирал</SelectItem>
                <SelectItem value="year">Энэ жил</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Нийт шалгалт"
          value={mockExams.length}
          icon={FileText}
          trend={{ value: "+3 энэ сараас", isPositive: true }}
        />
        <StatsCard
          title="Нийт оюутан"
          value={mockCourses.reduce((acc, c) => acc + c.studentsCount, 0)}
          icon={Users}
          color="bg-purple-500"
          trend={{ value: "+8 энэ сараас", isPositive: true }}
        />
        <StatsCard
          title="Дундаж оноо"
          value="82.5%"
          icon={Award}
          color="bg-green-500"
          trend={{ value: "+2.3% өмнөх сараас", isPositive: true }}
        />
        <StatsCard
          title="Амжилтын хувь"
          value="91.2%"
          icon={Target}
          color="bg-blue-500"
          trend={{ value: "+1.5% өмнөх сараас", isPositive: true }}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Score Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Оноо тархалт</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="range" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="students" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-4">
            Оюутдын ихэнх нь 61-100 оноонд байна
          </p>
        </Card>

        {/* Exam Performance Comparison */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Шалгалтын үр дүн харьцуулалт</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={examPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="exam" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Дундаж"
              />
              <Line 
                type="monotone" 
                dataKey="highest" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Хамгийн өндөр"
              />
              <Line 
                type="monotone" 
                dataKey="lowest" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Хамгийн доош"
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-4">
            Дундаж оноо тогтвортой өсч байна
          </p>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Question Type Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Асуултын төрөл хувиарлалт</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={questionTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {questionTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-4">
            {questionTypeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value} асуулт</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Performance Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Долоо хоног бүрийн ахиц</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyPerformanceData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorParticipation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="avgScore" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorScore)"
                name="Дундаж оноо"
              />
              <Area 
                type="monotone" 
                dataKey="participation" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#colorParticipation)"
                name="Ирц %"
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-4">
            Ирц болон дундаж оноо өсч байна
          </p>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Students */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Шилдэг оюутнууд</h3>
          <div className="space-y-4">
            {topPerformingStudents.map((student, index) => (
              <div 
                key={student.id} 
                className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <span className="font-semibold text-primary">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {student.exams} шалгалт өгсөн
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg text-primary">{student.score}%</p>
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <TrendingUp className="w-3 h-3" />
                    <span>Өсч байна</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Question Difficulty Analysis */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Асуултын хүндрэл шинжилгээ</h3>
          <div className="space-y-4">
            {questionDifficultyData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.question}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      item.difficulty === 'Easy' 
                        ? 'bg-green-100 text-green-700'
                        : item.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {item.difficulty}
                    </span>
                  </div>
                  <span className="font-semibold">{item.successRate}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      item.successRate >= 70 
                        ? 'bg-green-500'
                        : item.successRate >= 50
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${item.successRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Зөвлөмж:</span> Хүнд асуултуудын амжилт 50%-аас доош байна. Заах аргаа сайжруулах эсвэл асуултыг дахин засах хэрэгтэй.
            </p>
          </div>
        </Card>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Амжилттай өгсөн</p>
              <p className="text-2xl font-bold">158</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +12 энэ долоо хоног
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Амжилтгүй</p>
              <p className="text-2xl font-bold">15</p>
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3" />
                -3 энэ долоо хоног
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Дундаж хугацаа</p>
              <p className="text-2xl font-bold">42 мин</p>
              <p className="text-xs text-muted-foreground mt-1">
                60 минутын шалгалт
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
