import { Link, useParams } from "react-router";
import { ArrowLeft, Download, Eye, Search, Edit, BarChart3 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { mockExams, mockExamAttempts } from "../../data/mockData";

export function StudentResults() {
  const { examId } = useParams();
  const exam = mockExams.find(e => e.id === examId);
  const attempts = mockExamAttempts.filter(a => a.examId === examId);

  if (!exam) return <div>Exam not found</div>;

  return (
    <div className="p-8">
      <Link 
        to={`/team6/teacher/exams/${examId}/report`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Report
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Student Results</h1>
          <p className="text-muted-foreground">{exam.title}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/team6/teacher/analytics">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </Link>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export to CSV
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-border shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-10" />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attempts.map((attempt, index) => (
              <TableRow key={attempt.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{attempt.studentName}</TableCell>
                <TableCell className="text-muted-foreground">{attempt.studentId}</TableCell>
                <TableCell>
                  {new Date(attempt.submittedAt || '').toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell>
                  <span className="font-semibold">{attempt.score}/{exam.totalMarks}</span>
                </TableCell>
                <TableCell>
                  <span className={`font-semibold ${
                    (attempt.percentage || 0) >= 80 ? 'text-green-600' :
                    (attempt.percentage || 0) >= 60 ? 'text-blue-600' :
                    (attempt.percentage || 0) >= 40 ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {attempt.percentage}%
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    attempt.status === 'submitted' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {attempt.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/team6/teacher/exams/${examId}/results/${attempt.studentId}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Link to={`/team6/teacher/exams/${examId}/results/${attempt.studentId}/grade`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Grade
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}