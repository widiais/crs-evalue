'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DocumentChartBarIcon, 
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  UserIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { employeeService } from '@/services/employees';
import { assessmentService } from '@/services/assessments';
import { divisionService, Division } from '@/services/divisions';
import { templateService } from '@/services/templates';
import { locationService } from '@/services/locations';
import { Employee, AssessmentResult } from '@/types';

interface PersonalReport {
  employee: Employee;
  totalAssessments: number;
  averageScore: number;
  competencyScores: Record<string, number>;
  workSpiritScores: number[];
  lastAssessment: Date | null;
  recommendations: string[];
  assessmentResults: AssessmentResult[];
  workSpiritQuestions: string[];
}

export default function PersonalReportPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [reportData, setReportData] = useState<PersonalReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allResults, setAllResults] = useState<AssessmentResult[]>([]);

  // Get unique positions from templates and locations
  const availablePositions = Array.from(new Set(templates.map(template => template.level))).sort();
  const availableLocations = locations.map(location => location.name).sort();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load all required data in parallel
      const [employeesData, divisionsData, templatesData, locationsData, resultsData] = await Promise.all([
        employeeService.getAllEmployees(),
        divisionService.getActiveDivisions(),
        templateService.getAllTemplates(),
        locationService.getAllLocations(),
        assessmentService.getAllAssessmentResults()
      ]);

      setEmployees(employeesData);
      setDivisions(divisionsData);
      setTemplates(templatesData);
      setLocations(locationsData.filter(location => location.isActive));
      setAllResults(resultsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const generatePersonalReport = async (employee: Employee): Promise<PersonalReport> => {
    try {
      // Get all assessment results for this employee from Firebase
      const allResults = await assessmentService.getAllAssessmentResults();
      const employeeResults = allResults.filter((result: AssessmentResult) => 
        result.targetUser.id === employee.id
      );

      if (employeeResults.length === 0) {
        // Return empty report if no assessments found
        return {
          employee,
          totalAssessments: 0,
          averageScore: 0,
          competencyScores: {},
          workSpiritScores: [],
          lastAssessment: null,
          recommendations: [],
          assessmentResults: [],
          workSpiritQuestions: []
        };
      }

      // Get the template for work spirit questions (use the first assessment's associated template)
      let workSpiritQuestions: string[] = [];
      if (employeeResults.length > 0) {
        try {
          // Find template that matches employee's position
          const employeeTemplate = templates.find(t => t.level === employee.position);
          if (employeeTemplate && employeeTemplate.section2) {
            workSpiritQuestions = employeeTemplate.section2.map((q: any) => q.text);
          }
        } catch (error) {
          console.error('Error loading template for work spirit questions:', error);
        }
      }

      // Calculate statistics from real assessment results
      const totalAssessments = employeeResults.length;
      
      // Calculate average competency scores by category
      const competencyScores: Record<string, number[]> = {};
      employeeResults.forEach((result: AssessmentResult) => {
        result.scores.forEach((categoryScore: any) => {
          if (!competencyScores[categoryScore.category]) {
            competencyScores[categoryScore.category] = [];
          }
          competencyScores[categoryScore.category].push(categoryScore.average);
        });
      });

      // Average the scores per category
      const avgCompetencyScores: Record<string, number> = {};
      Object.entries(competencyScores).forEach(([category, scores]) => {
        avgCompetencyScores[category] = scores.reduce((a, b) => a + b, 0) / scores.length;
      });

      // Calculate overall average score
      const allScores = Object.values(avgCompetencyScores);
      const averageScore = allScores.length > 0 
        ? allScores.reduce((a, b) => a + b, 0) / allScores.length 
        : 0;

      // Get work spirit scores (average across all assessments)
      const allWorkSpiritScores: number[][] = employeeResults.map((result: AssessmentResult) => result.semangatScores);
      const workSpiritAverages: number[] = [];
      
      if (allWorkSpiritScores.length > 0) {
        const maxLength = Math.max(...allWorkSpiritScores.map(scores => scores.length));
        for (let i = 0; i < maxLength; i++) {
          const scores = allWorkSpiritScores.map(scoreArray => scoreArray[i]).filter(score => score !== undefined);
          if (scores.length > 0) {
            workSpiritAverages.push(scores.reduce((a, b) => a + b, 0) / scores.length);
          }
        }
      }

      // Get all recommendations
      const recommendations = Array.from(new Set(employeeResults.map((result: AssessmentResult) => result.recommendation)));

      // Get last assessment date
      const lastAssessment = employeeResults.length > 0
        ? new Date(Math.max(...employeeResults.map((result: AssessmentResult) => new Date(result.submittedAt).getTime())))
        : null;

      return {
        employee,
        totalAssessments,
        averageScore,
        competencyScores: avgCompetencyScores,
        workSpiritScores: workSpiritAverages,
        lastAssessment,
        recommendations,
        assessmentResults: employeeResults,
        workSpiritQuestions
      };
    } catch (error) {
      console.error('Error generating personal report:', error);
      // Return empty report on error
      return {
        employee,
        totalAssessments: 0,
        averageScore: 0,
        competencyScores: {},
        workSpiritScores: [],
        lastAssessment: null,
        recommendations: ['Error loading assessment data'],
        assessmentResults: [],
        workSpiritQuestions: []
      };
    }
  };

  const handleSelectEmployee = async (employee: Employee) => {
    setSelectedEmployee(employee);
    setLoading(true);
    
    try {
      const report = await generatePersonalReport(employee);
      setReportData(report);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600 bg-green-100';
    if (score >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 3.5) return 'Good';
    if (score >= 2.5) return 'Fair';
    return 'Needs Improvement';
  };

  const exportReport = () => {
    if (!reportData) return;
    
    // Create CSV content
    const csvContent = `Personal Assessment Report - ${reportData.employee.name}\n\n` +
      `Employee Details:\n` +
      `Name,${reportData.employee.name}\n` +
      `Position,${reportData.employee.position}\n` +
      `Location,${reportData.employee.location}\n` +
      `Division,${reportData.employee.division || 'N/A'}\n\n` +
      
      `Assessment Summary:\n` +
      `Total Assessments,${reportData.totalAssessments}\n` +
      `Average Score,${reportData.averageScore.toFixed(2)}\n` +
      `Last Assessment,${reportData.lastAssessment ? reportData.lastAssessment.toLocaleDateString() : 'N/A'}\n\n` +
      
      `Competency Scores:\n` +
      Object.entries(reportData.competencyScores).map(([category, score]) => 
        `${category},${score.toFixed(2)}`
      ).join('\n') + '\n\n' +
      
      `Work Spirit Scores:\n` +
      reportData.workSpiritScores.map((score, index) => 
        `Question ${index + 1},${score.toFixed(2)}`
      ).join('\n') + '\n\n' +
      
      `Recommendations:\n` +
      reportData.recommendations.map(rec => `"${rec}"`).join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `personal_report_${reportData.employee.name.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Build rows of employees that have at least one assessment
  const employeesWithCounts = useMemo(() => {
    if (employees.length === 0) return [] as Array<{ emp: Employee; count: number }>;
    const counts = new Map<string, number>();
    allResults.forEach(r => {
      counts.set(r.targetUser.id, (counts.get(r.targetUser.id) || 0) + 1);
    });
    const rows = employees
      .map(emp => ({ emp, count: counts.get(emp.id) || 0 }))
      .filter(row => row.count > 0);
    if (!searchTerm) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter(({ emp }) =>
      emp.name.toLowerCase().includes(term) ||
      emp.location.toLowerCase().includes(term) ||
      emp.position.toLowerCase().includes(term)
    );
  }, [employees, allResults, searchTerm]);

  // Detail view moved to /admin/reports/personal/[id]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Report Personal</h1>
                <p className="mt-2 text-gray-600">Laporan detail assessment per individu berdasarkan data real Firebase</p>
              </div>
            </div>
            
            {reportData && (
              <button
                onClick={exportReport}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Export Report
              </button>
            )}
          </div>
        </div>

        {/* List view */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Karyawan dengan Report</h3>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama/lokasi/jabatan..."
                className="pl-10 form-input"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Assessment</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeesWithCounts.map(({ emp, count }) => (
                  <tr key={emp.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/admin/reports/personal/${emp.id}`)}>
                    <td className="px-6 py-3">{emp.name}</td>
                    <td className="px-6 py-3">{emp.location}</td>
                    <td className="px-6 py-3">{emp.position}</td>
                    <td className="px-6 py-3">{count}</td>
                  </tr>
                ))}
                {employeesWithCounts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Belum ada data report</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail view intentionally removed per simplified list requirement */}
      </div>
    </div>
  );
} 