import { Link, useParams } from "react-router";
import { ArrowLeft, Download, Users, TrendingUp, TrendingDown, Award, BarChart3 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { StatsCard } from "../../components/shared/StatsCard";
import { mockExams, mockExamAttempts } from "../../data/mockData";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { generateExamReportPDF } from "../../utils/pdfGenerator";

export function ExamReport() {
  const { examId } = useParams();
  const exam = mockExams.find(e => e.id === examId);
  const attempts = mockExamAttempts.filter(a => a.examId === examId);

  const averageScore = attempts.reduce((acc, a) => acc + (a.score || 0), 0) / attempts.length;
  const highestScore = Math.max(...attempts.map(a => a.score || 0));
  const lowestScore = Math.min(...attempts.map(a => a.score || 0));
  const passRate = (attempts.filter(a => (a.score || 0) >= 60).length / attempts.length) * 100;

  // Grade distribution data
  const gradeDistribution = [
    { name: 'A (90-100)', value: attempts.filter(a => (a.score || 0) >= 90).length, color: '#10B981' },
    { name: 'B (80-89)', value: attempts.filter(a => (a.score || 0) >= 80 && (a.score || 0) < 90).length, color: '#3B82F6' },
    { name: 'C (70-79)', value: attempts.filter(a => (a.score || 0) >= 70 && (a.score || 0) < 80).length, color: '#F59E0B' },
    { name: 'D (60-69)', value: attempts.filter(a => (a.score || 0) >= 60 && (a.score || 0) < 70).length, color: '#EF4444' },
    { name: 'F (<60)', value: attempts.filter(a => (a.score || 0) < 60).length, color: '#991B1B' },
  ];

  // Score distribution data
  const scoreRanges = [
    { range: '0-20', count: attempts.filter(a => (a.score || 0) < 20).length },
    { range: '20-40', count: attempts.filter(a => (a.score || 0) >= 20 && (a.score || 0) < 40).length },
    { range: '40-60', count: attempts.filter(a => (a.score || 0) >= 40 && (a.score || 0) < 60).length },
    { range: '60-80', count: attempts.filter(a => (a.score || 0) >= 60 && (a.score || 0) < 80).length },
    { range: '80-100', count: attempts.filter(a => (a.score || 0) >= 80).length },
  ];

  if (!exam) return <div>Exam not found</div>;

  const handleExportReport = () => {
    // Prepare grade distribution data for PDF
    const gradeDistributionData = gradeDistribution.map(grade => ({
      grade: grade.name,
      count: grade.value,
      percentage: (grade.value / attempts.length) * 100,
    }));

    // Prepare top performers data
    const topPerformers = attempts
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 10)
      .map(attempt => ({
        studentName: attempt.studentName || 'Unknown Student',
        score: attempt.score || 0,
        submittedAt: attempt.submittedAt || new Date().toISOString(),
      }));

    generateExamReportPDF({
      examTitle: exam.title,
      courseName: exam.courseName || 'Course',
      totalStudents: attempts.length,
      averageScore,
      highestScore,
      lowestScore,
      passRate,
      gradeDistribution: gradeDistributionData,
      topPerformers,
    });
  };

  return (
    <div className="p-8">
      <Link 
        to={`/team6/teacher/exams/${examId}`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Exam
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Exam Report</h1>
          <p className="text-muted-foreground">{exam.title}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/team6/teacher/analytics">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </Link>
          <Link to={`/team6/teacher/exams/${examId}/results`}>
            <Button variant="outline">View All Results</Button>
          </Link>
          <Button onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Average Score"
          value={`${averageScore.toFixed(1)}%`}
          icon={TrendingUp}
          color="bg-blue-500"
        />
        <StatsCard
          title="Highest Score"
          value={`${highestScore}%`}
          icon={Award}
          color="bg-green-500"
        />
        <StatsCard
          title="Lowest Score"
          value={`${lowestScore}%`}
          icon={TrendingDown}
          color="bg-red-500"
        />
        <StatsCard
          title="Pass Rate"
          value={`${passRate.toFixed(0)}%`}
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart - Grade Distribution */}
        <div className="bg-white rounded-lg border border-border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Grade Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Score Distribution */}
        <div className="bg-white rounded-lg border border-border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Score Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreRanges}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-lg border border-border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Top Performers</h2>
        <div className="space-y-3">
          {attempts
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 5)
            .map((attempt, index) => (
              <div key={attempt.id} className="flex items-center gap-4 p-4 rounded-lg border border-border">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-gray-100 text-gray-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-secondary text-foreground'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{attempt.studentName}</p>
                  <p className="text-sm text-muted-foreground">
                    Submitted: {new Date(attempt.submittedAt || '').toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{attempt.score}%</p>
                  <p className="text-sm text-muted-foreground">{attempt.score}/100</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}