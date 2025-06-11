'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  UserIcon, 
  ArrowLeftIcon,
  ChartBarIcon,
  DocumentTextIcon,
  StarIcon,
  TrophyIcon,
  EyeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { assessmentService } from '@/services/assessments';
import { templateService } from '@/services/templates';
import { employeeService } from '@/services/employees';
import { Assessment, CriteriaTemplate, Employee, AssessmentResult } from '@/types';

interface EmployeeSummary {
  employeeId: string;
  employeeName: string;
  totalAssessments: number;
  averageScore: number;
  latestAssessment: string;
  latestAssessmentDate: Date;
  competencyBreakdown: Record<string, number>;
  assessmentHistory: AssessmentResult[];
}

function PersonalReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [templates, setTemplates] = useState<CriteriaTemplate[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allResults, setAllResults] = useState<AssessmentResult[]>([]);
  const [employeeSummaries, setEmployeeSummaries] = useState<EmployeeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [filteredSummaries, setFilteredSummaries] = useState<EmployeeSummary[]>([]);

  // Get assessment ID from URL params
  const assessmentFromUrl = searchParams.get('assessment');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (assessmentFromUrl && assessments.length > 0) {
      setSelectedAssessment(assessmentFromUrl);
      generateEmployeeSummaries(assessmentFromUrl);
    }
  }, [assessmentFromUrl, assessments, allResults]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assessmentData, templateData, employeeData, resultsData] = await Promise.all([
        assessmentService.getAllAssessments(),
        templateService.getAllTemplates(),
        employeeService.getAllEmployees(),
        assessmentService.getAllAssessmentResults()
      ]);
      setAssessments(assessmentData);
      setTemplates(templateData);
      setEmployees(employeeData);
      setAllResults(resultsData);
      
      // Generate summaries for all employees if no specific assessment selected
      if (!assessmentFromUrl) {
        generateEmployeeSummaries('', resultsData, employeeData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEmployeeSummaries = (assessmentId: string = '', results: AssessmentResult[] = allResults, employeeData: Employee[] = employees) => {
    const summaries: EmployeeSummary[] = [];
    
    // Group results by employee
    const employeeResults = results.reduce((acc, result) => {
      const employeeId = result.targetUser.id;
      if (!acc[employeeId]) {
        acc[employeeId] = [];
      }
      acc[employeeId].push(result);
      return acc;
    }, {} as Record<string, AssessmentResult[]>);

    // Filter by selected assessment if specified
    const filteredResults = assessmentId 
      ? results.filter(result => result.assessmentId === assessmentId)
      : results;

    const filteredEmployeeResults = filteredResults.reduce((acc, result) => {
      const employeeId = result.targetUser.id;
      if (!acc[employeeId]) {
        acc[employeeId] = [];
      }
      acc[employeeId].push(result);
      return acc;
    }, {} as Record<string, AssessmentResult[]>);

    // Generate summary for each employee
    Object.entries(filteredEmployeeResults).forEach(([employeeId, empResults]) => {
      if (empResults.length === 0) return;

      // Calculate average score across all assessments
      let totalScore = 0;
      let scoreCount = 0;
      const competencyTotals: Record<string, number[]> = {};

      empResults.forEach(result => {
        result.scores.forEach(categoryScore => {
          if (!competencyTotals[categoryScore.category]) {
            competencyTotals[categoryScore.category] = [];
          }
          competencyTotals[categoryScore.category].push(categoryScore.average);
          totalScore += categoryScore.average;
          scoreCount++;
        });
      });

      const averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;

      // Calculate competency breakdown
      const competencyBreakdown: Record<string, number> = {};
      Object.entries(competencyTotals).forEach(([category, scores]) => {
        competencyBreakdown[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      });

      // Find latest assessment
      const sortedResults = empResults.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      const latestResult = sortedResults[0];
      const latestAssessment = assessments.find(a => a.id === latestResult.assessmentId);

      summaries.push({
        employeeId,
        employeeName: latestResult.targetUser.name,
        totalAssessments: empResults.length,
        averageScore,
        latestAssessment: latestAssessment?.title || 'Unknown',
        latestAssessmentDate: new Date(latestResult.submittedAt),
        competencyBreakdown,
        assessmentHistory: employeeResults[employeeId] || []
      });
    });

    // Sort by average score descending
    summaries.sort((a, b) => b.averageScore - a.averageScore);
    
    setEmployeeSummaries(summaries);
    setFilteredSummaries(summaries);
  };

  const handleAssessmentChange = (assessmentId: string) => {
    setSelectedAssessment(assessmentId);
    if (assessmentId) {
      generateEmployeeSummaries(assessmentId);
    } else {
      generateEmployeeSummaries('');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600 bg-green-100';
    if (score >= 3.5) return 'text-blue-600 bg-blue-100';
    if (score >= 2.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 3.5) return 'Good';
    if (score >= 2.5) return 'Fair';
    return 'Poor';
  };

  const selectedAssessmentData = assessments.find(a => a.id === selectedAssessment);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 relative overflow-hidden">
      {/* Background Geometric Shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 border border-white transform rotate-45"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-white transform rotate-12"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-white transform -rotate-12"></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 border border-white transform rotate-45"></div>
        </div>
        
        {/* Gradient Overlay Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12 translate-y-20"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <button
                    onClick={() => router.push('/admin')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Dashboard
                  </button>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    Personal Assessment Reports
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Laporan akumulasi penilaian per karyawan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                  <DocumentTextIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Assessment</p>
                  <p className="text-2xl font-semibold text-gray-900">{assessments.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Karyawan Dinilai</p>
                  <p className="text-2xl font-semibold text-gray-900">{filteredSummaries.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Penilaian</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {filteredSummaries.reduce((sum, emp) => sum + emp.totalAssessments, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                  <TrophyIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg Score</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {filteredSummaries.length > 0 
                      ? (filteredSummaries.reduce((sum, emp) => sum + emp.averageScore, 0) / filteredSummaries.length).toFixed(1)
                      : '0.0'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FunnelIcon className="h-6 w-6 mr-2" />
              Filter Report
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Assessment</label>
                <select
                  value={selectedAssessment}
                  onChange={(e) => handleAssessmentChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Semua Assessment</option>
                  {assessments.map(assessment => (
                    <option key={assessment.id} value={assessment.id}>
                      {assessment.title} ({assessment.pin})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  {selectedAssessment ? (
                    <p>Menampilkan data untuk assessment terpilih</p>
                  ) : (
                    <p>Menampilkan akumulasi dari semua assessment</p>
                  )}
                </div>
              </div>
            </div>

            {selectedAssessmentData && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h3 className="font-semibold text-blue-900 mb-2">Assessment Info:</h3>
                <div className="text-sm text-blue-800">
                  <p><strong>Title:</strong> {selectedAssessmentData.title}</p>
                  <p><strong>PIN:</strong> {selectedAssessmentData.pin}</p>
                  <p><strong>Status:</strong> {selectedAssessmentData.isActive ? 'Active' : 'Inactive'}</p>
                  {selectedAssessmentData.description && (
                    <p><strong>Description:</strong> {selectedAssessmentData.description}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Employee Summary Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 lg:px-8 py-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                📊 Laporan Per Karyawan ({filteredSummaries.length})
              </h3>
            </div>

            {filteredSummaries.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <ChartBarIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Belum ada data</h3>
                <p className="mt-2 text-gray-500">
                  Pilih assessment atau tunggu hingga ada hasil penilaian
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Karyawan
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah Assessment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rata-rata Score
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assessment Terakhir
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal Terakhir
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSummaries.map((employee) => (
                      <tr key={employee.employeeId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                              <UserIcon className="h-5 w-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {employee.employeeName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {employee.employeeId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            {employee.totalAssessments} assessment{employee.totalAssessments > 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(employee.averageScore)}`}>
                            <StarIcon className="h-4 w-4 mr-1" />
                            {employee.averageScore.toFixed(1)} - {getScoreLabel(employee.averageScore)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{employee.latestAssessment}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.latestAssessmentDate.toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => router.push(`/admin/reports/personal/${employee.employeeId}?assessment=${selectedAssessment}`)}
                            className="text-blue-600 hover:text-blue-900 transition-colors flex items-center"
                            title="View Details"
                          >
                            <EyeIcon className="h-5 w-5 mr-1" />
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Informasi Personal Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <h4 className="font-semibold mb-3">Cara Menggunakan:</h4>
                <ul className="space-y-2">
                  <li>• Pilih assessment tertentu atau lihat akumulasi semua</li>
                  <li>• Klik "Detail" pada baris karyawan untuk melihat rincian</li>
                  <li>• Data diurutkan berdasarkan rata-rata score tertinggi</li>
                  <li>• Satu baris per karyawan menampilkan akumulasi penilaian</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Score Interpretation:</h4>
                <ul className="space-y-2">
                  <li>• <strong>4.5-5.0:</strong> Excellent - Outstanding performance</li>
                  <li>• <strong>3.5-4.4:</strong> Good - Above average performance</li>
                  <li>• <strong>2.5-3.4:</strong> Fair - Meets expectations</li>
                  <li>• <strong>1.0-2.4:</strong> Poor - Needs improvement</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PersonalReportsPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    }>
      <PersonalReportsPage />
    </Suspense>
  );
} 