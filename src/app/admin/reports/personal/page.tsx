'use client';

import { useState, useEffect } from 'react';
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
  const [filterLocation, setFilterLocation] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterDivision, setFilterDivision] = useState('');

  // Get unique positions from templates and locations
  const availablePositions = Array.from(new Set(templates.map(template => template.level))).sort();
  const availableLocations = locations.map(location => location.name).sort();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load all required data in parallel
      const [employeesData, divisionsData, templatesData, locationsData] = await Promise.all([
        employeeService.getAllEmployees(),
        divisionService.getActiveDivisions(),
        templateService.getAllTemplates(),
        locationService.getAllLocations()
      ]);

      setEmployees(employeesData);
      setDivisions(divisionsData);
      setTemplates(templatesData);
      setLocations(locationsData.filter(location => location.isActive));
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

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !filterLocation || emp.location === filterLocation;
    const matchesPosition = !filterPosition || emp.position === filterPosition;
    const matchesDivision = !filterDivision || emp.division === filterDivision;
    return matchesSearch && matchesLocation && matchesPosition && matchesDivision;
  });

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
                Back to Dashboard
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Employee Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pilih Karyawan</h3>
              
              {/* Search and Filters */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari nama..."
                    className="pl-10 form-input"
                  />
                </div>

                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="form-input"
                >
                  <option value="">Semua Lokasi</option>
                  {availableLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>

                <select
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value)}
                  className="form-input"
                >
                  <option value="">Semua Jabatan</option>
                  {availablePositions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>

                <select
                  value={filterDivision}
                  onChange={(e) => setFilterDivision(e.target.value)}
                  className="form-input"
                >
                  <option value="">Semua Divisi</option>
                  {divisions.map(division => (
                    <option key={division.id} value={division.name}>{division.name}</option>
                  ))}
                </select>
              </div>

              {/* Employee List */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredEmployees.map(employee => (
                  <div
                    key={employee.id}
                    onClick={() => handleSelectEmployee(employee)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedEmployee?.id === employee.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.position} • {employee.location}</p>
                        {employee.division && (
                          <p className="text-xs text-gray-400">{employee.division}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredEmployees.length === 0 && (
                  <div className="text-center py-8">
                    <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="lg:col-span-2">
            {!selectedEmployee ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <DocumentChartBarIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Pilih Karyawan untuk Melihat Report
                </h3>
                <p className="mt-2 text-gray-500">
                  Pilih karyawan dari daftar di sebelah kiri untuk melihat laporan assessment personal
                </p>
              </div>
            ) : loading ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading report...</p>
              </div>
            ) : reportData ? (
              <div className="space-y-6">
                {/* Employee Info Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <UserIcon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {reportData.employee.name}
                        </h2>
                        <p className="text-gray-600">
                          {reportData.employee.position} • {reportData.employee.division}
                        </p>
                        <p className="text-sm text-gray-500">
                          📍 {reportData.employee.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {reportData.averageScore.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500">Average Score</div>
                    </div>
                  </div>
                </div>

                {/* Assessment Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <ChartBarIcon className="h-8 w-8 text-green-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Assessments</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {reportData.totalAssessments}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <CalendarIcon className="h-8 w-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Last Assessment</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {reportData.lastAssessment ? reportData.lastAssessment.toLocaleDateString('id-ID') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Performance Level</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                        getScoreColor(reportData.averageScore)
                      }`}>
                        {getScoreLabel(reportData.averageScore)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Competency Scores */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Competency Scores</h3>
                  <div className="space-y-4">
                    {Object.entries(reportData.competencyScores).map(([competency, score]) => (
                      <div key={competency}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">{competency}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {score.toFixed(1)}/5.0
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(score / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Spirit Scores */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Spirit Scores</h3>
                  <div className="space-y-3">
                    {reportData.workSpiritScores.map((score, index) => (
                      <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 flex-1 mr-4">
                          {reportData.workSpiritQuestions[index] || `Pertanyaan ${index + 1}`}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          getScoreColor(score)
                        }`}>
                          {score.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                  <div className="space-y-2">
                    {reportData.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-gray-700">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
} 