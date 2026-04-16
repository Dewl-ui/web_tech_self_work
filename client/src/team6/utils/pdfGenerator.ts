import { jsPDF } from 'jspdf';

interface ExamResultData {
  studentName: string;
  studentId?: string;
  examTitle: string;
  courseName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
  timeTaken: string;
  submittedAt: string;
  grade: string;
}

interface QuestionData {
  question: string;
  type: string;
  marks: number;
  studentAnswer?: string;
  correctAnswer: string;
  isCorrect: boolean;
  options?: string[];
}

export function generateStudentResultPDF(data: ExamResultData, questions?: QuestionData[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Header with Logo/Title
  doc.setFillColor(59, 130, 246); // Primary blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Exam Result Certificate', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('University Learning Management System', pageWidth / 2, 30, { align: 'center' });

  yPos = 55;
  doc.setTextColor(0, 0, 0);

  // Student Information
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Information', 20, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${data.studentName}`, 20, yPos);
  yPos += 7;
  
  if (data.studentId) {
    doc.text(`Student ID: ${data.studentId}`, 20, yPos);
    yPos += 7;
  }

  doc.text(`Exam: ${data.examTitle}`, 20, yPos);
  yPos += 7;
  doc.text(`Course: ${data.courseName}`, 20, yPos);
  yPos += 7;
  doc.text(`Submitted: ${data.submittedAt}`, 20, yPos);
  yPos += 15;

  // Score Section with Background
  doc.setFillColor(243, 244, 246); // Light gray
  doc.roundedRect(20, yPos, pageWidth - 40, 50, 3, 3, 'F');

  yPos += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Final Score', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Large percentage display
  doc.setFontSize(32);
  doc.setTextColor(59, 130, 246); // Primary blue
  doc.text(`${data.percentage}%`, pageWidth / 2, yPos, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128); // Gray
  doc.text(`${data.score} / ${data.totalMarks} marks`, pageWidth / 2, yPos + 8, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(34, 197, 94); // Green
  doc.text(`Grade: ${data.grade}`, pageWidth / 2, yPos + 18, { align: 'center' });

  yPos += 40;
  doc.setTextColor(0, 0, 0);

  // Performance Statistics
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Performance Statistics', 20, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  // Create a table-like layout
  const col1X = 20;
  const col2X = 110;
  const rowHeight = 8;

  const stats = [
    { label: 'Total Questions:', value: data.totalQuestions.toString() },
    { label: 'Correct Answers:', value: data.correctAnswers.toString(), color: [34, 197, 94] },
    { label: 'Wrong Answers:', value: data.wrongAnswers.toString(), color: [239, 68, 68] },
    { label: 'Time Taken:', value: data.timeTaken },
    { label: 'Accuracy Rate:', value: `${((data.correctAnswers / data.totalQuestions) * 100).toFixed(1)}%` },
  ];

  stats.forEach((stat, index) => {
    const currentY = yPos + (index * rowHeight);
    doc.setTextColor(107, 114, 128);
    doc.text(stat.label, col1X, currentY);
    
    if (stat.color) {
      doc.setTextColor(stat.color[0], stat.color[1], stat.color[2]);
    } else {
      doc.setTextColor(0, 0, 0);
    }
    doc.setFont('helvetica', 'bold');
    doc.text(stat.value, col2X, currentY);
    doc.setFont('helvetica', 'normal');
  });

  yPos += stats.length * rowHeight + 15;

  // Performance Bar
  if (yPos + 30 < pageHeight - 20) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Performance', 20, yPos);
    yPos += 8;

    // Progress bar background
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(20, yPos, pageWidth - 40, 8, 2, 2, 'F');

    // Progress bar fill
    const fillWidth = ((pageWidth - 40) * data.percentage) / 100;
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(20, yPos, fillWidth, 8, 2, 2, 'F');

    yPos += 15;
  }

  // Questions Review (if provided)
  if (questions && questions.length > 0) {
    yPos += 10;
    
    // Check if we need a new page
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Answer Review', 20, yPos);
    yPos += 10;

    questions.forEach((q, index) => {
      // Check if we need a new page for this question
      if (yPos > pageHeight - 80) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      
      // Question header with status icon
      const statusText = q.isCorrect ? '✓' : '✗';
      const statusColor = q.isCorrect ? [34, 197, 94] : [239, 68, 68];
      
      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.text(statusText, 20, yPos);
      
      doc.setTextColor(0, 0, 0);
      doc.text(`Question ${index + 1}`, 28, yPos);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      doc.text(`${q.type} • ${q.marks} marks`, 60, yPos);
      
      yPos += 7;

      // Question text
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      
      const questionLines = doc.splitTextToSize(q.question, pageWidth - 50);
      doc.text(questionLines, 25, yPos);
      yPos += questionLines.length * 5 + 3;

      // Answer section based on question type
      if (q.type === 'multiple-choice' && q.options) {
        q.options.forEach((option, i) => {
          const letter = String.fromCharCode(65 + i);
          const isStudentAnswer = q.studentAnswer === i.toString();
          const isCorrectAnswer = q.correctAnswer === i.toString();
          
          doc.setFontSize(9);
          
          if (isCorrectAnswer) {
            doc.setTextColor(34, 197, 94);
            doc.setFont('helvetica', 'bold');
            doc.text(`${letter}. ${option} (Correct)`, 30, yPos);
          } else if (isStudentAnswer) {
            doc.setTextColor(239, 68, 68);
            doc.setFont('helvetica', 'bold');
            doc.text(`${letter}. ${option} (Your answer)`, 30, yPos);
          } else {
            doc.setTextColor(107, 114, 128);
            doc.setFont('helvetica', 'normal');
            doc.text(`${letter}. ${option}`, 30, yPos);
          }
          
          yPos += 5;
        });
      } else if (q.type === 'true-false') {
        doc.setFontSize(9);
        
        ['True', 'False'].forEach((option) => {
          const isStudentAnswer = q.studentAnswer?.toLowerCase() === option.toLowerCase();
          const isCorrectAnswer = q.correctAnswer?.toLowerCase() === option.toLowerCase();
          
          if (isCorrectAnswer) {
            doc.setTextColor(34, 197, 94);
            doc.setFont('helvetica', 'bold');
            doc.text(`${option} (Correct)`, 30, yPos);
          } else if (isStudentAnswer) {
            doc.setTextColor(239, 68, 68);
            doc.setFont('helvetica', 'bold');
            doc.text(`${option} (Your answer)`, 30, yPos);
          } else {
            doc.setTextColor(107, 114, 128);
            doc.setFont('helvetica', 'normal');
            doc.text(option, 30, yPos);
          }
          
          yPos += 5;
        });
      } else if (q.type === 'short-answer') {
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        doc.text('Your answer:', 30, yPos);
        yPos += 5;
        
        doc.setTextColor(0, 0, 0);
        const answerLines = doc.splitTextToSize(q.studentAnswer || 'No answer provided', pageWidth - 60);
        doc.text(answerLines, 35, yPos);
        yPos += answerLines.length * 5 + 2;
        
        doc.setTextColor(107, 114, 128);
        doc.text('Sample answer:', 30, yPos);
        yPos += 5;
        
        doc.setTextColor(34, 197, 94);
        const correctLines = doc.splitTextToSize(q.correctAnswer, pageWidth - 60);
        doc.text(correctLines, 35, yPos);
        yPos += correctLines.length * 5;
      }

      yPos += 8;
    });
  }

  // Footer
  const footerY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('This is an official exam result certificate.', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, pageWidth / 2, footerY + 4, { align: 'center' });

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, footerY, { align: 'right' });
  }

  // Save the PDF
  const fileName = `${data.examTitle.replace(/[^a-z0-9]/gi, '_')}_${data.studentName.replace(/[^a-z0-9]/gi, '_')}_Result.pdf`;
  doc.save(fileName);
}

interface ExamReportData {
  examTitle: string;
  courseName: string;
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  gradeDistribution: {
    grade: string;
    count: number;
    percentage: number;
  }[];
  topPerformers: {
    studentName: string;
    score: number;
    submittedAt: string;
  }[];
}

export function generateExamReportPDF(data: ExamReportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Header with Logo/Title
  doc.setFillColor(59, 130, 246); // Primary blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Exam Analytics Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('University Learning Management System', pageWidth / 2, 30, { align: 'center' });

  yPos = 55;
  doc.setTextColor(0, 0, 0);

  // Exam Information
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Exam Information', 20, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Exam: ${data.examTitle}`, 20, yPos);
  yPos += 7;
  doc.text(`Course: ${data.courseName}`, 20, yPos);
  yPos += 7;
  doc.text(`Total Students: ${data.totalStudents}`, 20, yPos);
  yPos += 7;
  doc.text(`Report Generated: ${new Date().toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 20, yPos);
  yPos += 15;

  // Key Statistics Section with colored boxes
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Statistics', 20, yPos);
  yPos += 10;

  // Create 4 colored stat boxes in a 2x2 grid
  const boxWidth = (pageWidth - 50) / 2;
  const boxHeight = 25;
  const gap = 10;

  // Average Score
  doc.setFillColor(59, 130, 246); // Blue
  doc.roundedRect(20, yPos, boxWidth, boxHeight, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Average Score', 25, yPos + 8);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.averageScore.toFixed(1)}%`, 25, yPos + 18);

  // Highest Score
  doc.setFillColor(34, 197, 94); // Green
  doc.roundedRect(20 + boxWidth + gap, yPos, boxWidth, boxHeight, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Highest Score', 25 + boxWidth + gap, yPos + 8);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.highestScore}%`, 25 + boxWidth + gap, yPos + 18);

  yPos += boxHeight + gap;

  // Lowest Score
  doc.setFillColor(239, 68, 68); // Red
  doc.roundedRect(20, yPos, boxWidth, boxHeight, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Lowest Score', 25, yPos + 8);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.lowestScore}%`, 25, yPos + 18);

  // Pass Rate
  doc.setFillColor(168, 85, 247); // Purple
  doc.roundedRect(20 + boxWidth + gap, yPos, boxWidth, boxHeight, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Pass Rate', 25 + boxWidth + gap, yPos + 8);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.passRate.toFixed(0)}%`, 25 + boxWidth + gap, yPos + 18);

  yPos += boxHeight + 20;
  doc.setTextColor(0, 0, 0);

  // Grade Distribution
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Grade Distribution', 20, yPos);
  yPos += 10;

  // Table header
  doc.setFillColor(243, 244, 246);
  doc.rect(20, yPos, pageWidth - 40, 10, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Grade', 25, yPos + 7);
  doc.text('Students', 80, yPos + 7);
  doc.text('Percentage', 130, yPos + 7);
  
  yPos += 10;

  // Table rows
  doc.setFont('helvetica', 'normal');
  data.gradeDistribution.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, yPos, pageWidth - 40, 8, 'F');
    }
    
    doc.setTextColor(0, 0, 0);
    doc.text(item.grade, 25, yPos + 6);
    doc.text(item.count.toString(), 80, yPos + 6);
    doc.text(`${item.percentage.toFixed(1)}%`, 130, yPos + 6);
    
    // Visual bar
    const barWidth = (item.percentage / 100) * 50;
    doc.setFillColor(59, 130, 246);
    doc.rect(155, yPos + 2, barWidth, 4, 'F');
    
    yPos += 8;
  });

  yPos += 10;

  // Top Performers
  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Top Performers', 20, yPos);
  yPos += 10;

  // Table header
  doc.setFillColor(243, 244, 246);
  doc.rect(20, yPos, pageWidth - 40, 10, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Rank', 25, yPos + 7);
  doc.text('Student Name', 50, yPos + 7);
  doc.text('Score', 130, yPos + 7);
  doc.text('Submitted', 160, yPos + 7);
  
  yPos += 10;

  // Table rows
  doc.setFont('helvetica', 'normal');
  data.topPerformers.slice(0, 10).forEach((student, index) => {
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
    }

    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, yPos, pageWidth - 40, 8, 'F');
    }
    
    // Rank with medal colors for top 3
    if (index < 3) {
      const colors = [
        [255, 215, 0], // Gold
        [192, 192, 192], // Silver
        [205, 127, 50] // Bronze
      ];
      doc.setFillColor(colors[index][0], colors[index][1], colors[index][2]);
      doc.circle(30, yPos + 4, 3, 'F');
      doc.setTextColor(0, 0, 0);
    }
    
    doc.text(`${index + 1}`, 35, yPos + 6);
    
    const studentNameText = doc.splitTextToSize(student.studentName, 75);
    doc.text(studentNameText[0], 50, yPos + 6);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text(`${student.score}%`, 130, yPos + 6);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(8);
    const dateText = new Date(student.submittedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    doc.text(dateText, 160, yPos + 6);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    yPos += 8;
  });

  // Footer
  const footerY = pageHeight - 15;
  doc.setPage(1);
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('This is an official exam analytics report.', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, pageWidth / 2, footerY + 4, { align: 'center' });

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, footerY, { align: 'right' });
  }

  // Save the PDF
  const fileName = `${data.examTitle.replace(/[^a-z0-9]/gi, '_')}_Report.pdf`;
  doc.save(fileName);
}