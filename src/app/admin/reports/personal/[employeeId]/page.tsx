'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  UserIcon, 
  ArrowLeftIcon,
  ChartBarIcon,
  DocumentTextIcon,
  StarIcon,
  TrophyIcon,
  EyeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  HeartIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { assessmentService } from '@/services/assessments';
import { templateService } from '@/services/templates';
import { employeeService } from '@/services/employees';
import { Assessment, CriteriaTemplate, Employee, AssessmentResult } from '@/types';

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const employeeId = params.employeeId as string;
  const selectedAssessment = searchParams.get('assessment') || '';
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [templates, setTemplates] = useState<CriteriaTemplate[]>([]);
  const [employeeResults, setEmployeeResults] = useState<AssessmentResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingResult, setViewingResult] = useState<AssessmentResult | null>(null);
  
  // Accumulated statistics
  const [accumulatedStats, setAccumulatedStats] = useState({
    totalAssessments: 0,
    averageScore: 0,
    competencyBreakdown: {} as Record<string, number>,
    semangatAverage: 0,
    semangatBreakdown: {} as Record<string, number>,
    recommendationCounts: {} as Record<string, number>,
    bestScore: 0,
    worstScore: 0,
    latestRecommendation: ''
  });

  useEffect(() => {
    loadEmployeeData();
  }, [employeeId, selectedAssessment]);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      
      // Load all required data
      const [allEmployees, allAssessments, allTemplates, allResults] = await Promise.all([
        employeeService.getAllEmployees(),
        assessmentService.getAllAssessments(),
        templateService.getAllTemplates(),
        assessmentService.getAllAssessmentResults()
      ]);
      
      // Find employee
      const emp = allEmployees.find(e => e.id === employeeId);
      if (!emp) {
        console.error('Employee not found');
        return;
      }
      setEmployee(emp);
      setAssessments(allAssessments);
      setTemplates(allTemplates);
      
      // Filter results for this employee
      const empResults = allResults.filter(result => result.targetUser.id === employeeId);
      setEmployeeResults(empResults);
      
      // Filter by selected assessment if specified
      const filtered = selectedAssessment 
        ? empResults.filter(result => result.assessmentId === selectedAssessment)
        : empResults;
      setFilteredResults(filtered);
      
      // Calculate accumulated statistics
      calculateAccumulatedStats(filtered, empResults, allAssessments, allTemplates);
      
    } catch (error) {
      console.error('Error loading employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSemangatQuestionText = (questionIndex: number, assessmentId: string | undefined, allAssessments: Assessment[], allTemplates: CriteriaTemplate[]): string => {
    // If we have a specific assessment, try to get its template
    if (assessmentId) {
      const assessment = allAssessments.find(a => a.id === assessmentId);
      
      if (assessment && assessment.templateIds?.length > 0) {
        const template = allTemplates.find(t => assessment.templateIds.includes(t.id));
        
        if (template && template.section2[questionIndex]) {
          return template.section2[questionIndex].text;
        }
      }
    }
    
    // Fallback: try to get from any available template
    for (const template of allTemplates) {
      if (template.section2[questionIndex]) {
        return template.section2[questionIndex].text;
      }
    }
    
    // Ultimate fallback
    return `Pertanyaan ${questionIndex + 1}`;
  };

  const calculateAccumulatedStats = (filtered: AssessmentResult[], allResults: AssessmentResult[], allAssessments: Assessment[], allTemplates: CriteriaTemplate[]) => {
    if (filtered.length === 0) {
      setAccumulatedStats({
        totalAssessments: 0,
        averageScore: 0,
        competencyBreakdown: {},
        semangatAverage: 0,
        semangatBreakdown: {},
        recommendationCounts: {},
        bestScore: 0,
        worstScore: 0,
        latestRecommendation: ''
      });
      return;
    }

    let totalScore = 0;
    let scoreCount = 0;
    const competencyTotals: Record<string, number[]> = {};
    const semangatTotals: Record<string, number[]> = {};
    const recommendationCounts: Record<string, number> = {};
    const allScores: number[] = [];
    let totalSemangat = 0;
    let semangatCount = 0;

    filtered.forEach(result => {
      // Process competency scores
      result.scores.forEach(categoryScore => {
        if (!competencyTotals[categoryScore.category]) {
          competencyTotals[categoryScore.category] = [];
        }
        competencyTotals[categoryScore.category].push(categoryScore.average);
        totalScore += categoryScore.average;
        scoreCount++;
        allScores.push(categoryScore.average);
      });

      // Process semangat scores with actual question text
      result.semangatScores.forEach((score, index) => {
        const questionText = getSemangatQuestionText(index, result.assessmentId, allAssessments, allTemplates);
        if (!semangatTotals[questionText]) {
          semangatTotals[questionText] = [];
        }
        semangatTotals[questionText].push(score);
        totalSemangat += score;
        semangatCount++;
        allScores.push(score);
      });

      // Count recommendations
      if (result.recommendation) {
        if (!recommendationCounts[result.recommendation]) {
          recommendationCounts[result.recommendation] = 0;
        }
        recommendationCounts[result.recommendation]++;
      }
    });

    // Calculate competency breakdown
    const competencyBreakdown: Record<string, number> = {};
    Object.entries(competencyTotals).forEach(([category, scores]) => {
      competencyBreakdown[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });

    // Calculate semangat breakdown
    const semangatBreakdown: Record<string, number> = {};
    Object.entries(semangatTotals).forEach(([question, scores]) => {
      semangatBreakdown[question] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });

    // Find latest recommendation
    const sortedResults = filtered.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    const latestRecommendation = sortedResults[0]?.recommendation || '';

    setAccumulatedStats({
      totalAssessments: filtered.length,
      averageScore: scoreCount > 0 ? totalScore / scoreCount : 0,
      competencyBreakdown,
      semangatAverage: semangatCount > 0 ? totalSemangat / semangatCount : 0,
      semangatBreakdown,
      recommendationCounts,
      bestScore: allScores.length > 0 ? Math.max(...allScores) : 0,
      worstScore: allScores.length > 0 ? Math.min(...allScores) : 0,
      latestRecommendation
    });
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

  const getAverageScore = (result: AssessmentResult) => {
    if (result.scores.length === 0) return 0;
    return result.scores.reduce((sum, score) => sum + score.average, 0) / result.scores.length;
  };

  const handleDownloadPDF = async () => {
    if (!employee) return;
    
    try {
      // Show loading state
      const btn = document.querySelector('[data-pdf-btn]') as HTMLButtonElement;
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Generating PDF...';
      }

      // Use the utility function
      const { generateEmployeePDF } = await import('@/utils/pdfGenerator');
      
      const blob = await generateEmployeePDF(
        employee,
        accumulatedStats,
        selectedAssessment,
        assessments
      );
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Assessment_Report_${employee.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Reset button
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Download PDF';
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF');
      
      // Reset button on error
      const btn = document.querySelector('[data-pdf-btn]') as HTMLButtonElement;
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Download PDF';
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">Employee Not Found</h2>
          <button
            onClick={() => router.push('/admin/reports/personal')}
            className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Back to Reports
          </button>
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
                    onClick={() => router.push('/admin/reports/personal')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Personal Reports
                  </button>
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-xl">
                      <UserIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="ml-4">
                      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                        {employee.name}
                      </h1>
                      <div className="flex items-center text-gray-600 mt-2">
                        <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                        <span>{employee.position} • {employee.location}</span>
                        {employee.division && <span> • {employee.division}</span>}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg">
                    Detail laporan penilaian assessment
                    {selectedAssessment && (
                      <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Assessment Terpilih
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <button
                    data-pdf-btn
                    onClick={handleDownloadPDF}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Accumulated Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Assessment</p>
                  <p className="text-2xl font-semibold text-gray-900">{accumulatedStats.totalAssessments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                  <TrophyIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Rata-rata Score</p>
                  <p className="text-2xl font-semibold text-gray-900">{accumulatedStats.averageScore.toFixed(1)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                  <StarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Score Tertinggi</p>
                  <p className="text-2xl font-semibold text-gray-900">{accumulatedStats.bestScore.toFixed(1)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg Semangat</p>
                  <p className="text-2xl font-semibold text-gray-900">{accumulatedStats.semangatAverage.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Competency Breakdown */}
          {Object.keys(accumulatedStats.competencyBreakdown).length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Breakdown Kompetensi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(accumulatedStats.competencyBreakdown).map(([category, score]) => (
                  <div key={category} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{category}</p>
                        <p className="text-xs text-gray-500 mt-1">{getScoreLabel(score)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
                        {score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Semangat Breakdown */}
          {Object.keys(accumulatedStats.semangatBreakdown).length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <HeartIcon className="h-6 w-6 mr-2 text-red-500" />
                Breakdown Semangat
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(accumulatedStats.semangatBreakdown).map(([question, score]) => (
                  <div key={question} className="bg-red-50 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-red-700">{question}</p>
                        <p className="text-xs text-red-500 mt-1">{getScoreLabel(score)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
                        {score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation Counts */}
          {Object.keys(accumulatedStats.recommendationCounts).length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrophyIcon className="h-6 w-6 mr-2 text-yellow-500" />
                Rekomendasi Evaluator
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(accumulatedStats.recommendationCounts)
                  .filter(([_, count]) => count > 0)
                  .map(([recommendation, count]) => (
                    <div key={recommendation} className="bg-yellow-50 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-yellow-700">{recommendation}</p>
                          <p className="text-xs text-yellow-500 mt-1">
                            {count} evaluator{count > 1 ? 's' : ''}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-200 text-yellow-800">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
              
              {accumulatedStats.latestRecommendation && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-semibold text-blue-900 mb-2">Rekomendasi Terakhir:</h3>
                  <p className="text-blue-800">{accumulatedStats.latestRecommendation}</p>
                </div>
              )}
            </div>
          )}

          {/* Assessment History Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 lg:px-8 py-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                📋 Riwayat Assessment ({filteredResults.length})
              </h3>
            </div>

            {filteredResults.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <DocumentTextIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Belum ada assessment</h3>
                <p className="mt-2 text-gray-500">
                  Karyawan ini belum memiliki hasil assessment
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assessment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kode Collection
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evaluator
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResults.map((result) => {
                      const assessment = assessments.find(a => a.id === result.assessmentId);
                      const avgScore = getAverageScore(result);
                      return (
                        <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {assessment?.title || 'Unknown Assessment'}
                              </div>
                              <div className="text-sm text-gray-500">
                                PIN: {assessment?.pin || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                              {result.assessmentId}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm text-gray-900">{result.evaluator.name}</div>
                              <div className="text-sm text-gray-500">
                                {result.evaluator.position} - {result.evaluator.division}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(avgScore)}`}>
                              <StarIcon className="h-4 w-4 mr-1" />
                              {avgScore.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {new Date(result.submittedAt).toLocaleDateString('id-ID')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => setViewingResult(result)}
                              className="text-blue-600 hover:text-blue-900 transition-colors flex items-center"
                              title="View Details"
                            >
                              <EyeIcon className="h-5 w-5 mr-1" />
                              Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* View Result Detail Modal */}
          {viewingResult && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Detail Hasil Assessment
                  </h3>
                  <button
                    onClick={() => setViewingResult(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 mb-4">Assessment Info</h4>
                    <div className="space-y-2 text-blue-800">
                      <p><strong>Assessment:</strong> {assessments.find(a => a.id === viewingResult.assessmentId)?.title}</p>
                      <p><strong>PIN:</strong> {assessments.find(a => a.id === viewingResult.assessmentId)?.pin}</p>
                      <p><strong>Kode Collection:</strong> <span className="font-mono bg-blue-100 px-2 py-1 rounded text-blue-900">{viewingResult.assessmentId}</span></p>
                      <p><strong>Submitted:</strong> {new Date(viewingResult.submittedAt).toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6">
                    <h4 className="font-semibold text-green-900 mb-4">Evaluator</h4>
                    <div className="space-y-2 text-green-800">
                      <p><strong>Name:</strong> {viewingResult.evaluator.name}</p>
                      <p><strong>Position:</strong> {viewingResult.evaluator.position}</p>
                      <p><strong>Division:</strong> {viewingResult.evaluator.division}</p>
                      <p><strong>Status:</strong> {viewingResult.evaluator.status}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Competency Scores */}
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h4 className="font-semibold text-purple-900 mb-4">Skor Kompetensi</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {viewingResult.scores.map((score, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-purple-700">{score.category}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score.average)}`}>
                              {score.average.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Semangat Scores */}
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h4 className="font-semibold text-orange-900 mb-4">Skor Semangat</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {viewingResult.semangatScores.map((score, index) => {
                        const questionText = getSemangatQuestionText(index, viewingResult.assessmentId, assessments, templates);
                        return (
                          <div key={index} className="bg-white rounded-lg p-4 border border-orange-200">
                            <div className="flex justify-between items-center">
                              <div className="flex-1 mr-3">
                                <div className="text-sm font-medium text-orange-700">{questionText}</div>
                                <div className="text-xs text-orange-500 mt-1">
                                  {getScoreLabel(score)}
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
                                {score}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Rekomendasi</h4>
                    <p className="text-gray-800">{viewingResult.recommendation}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4">
                  <button
                    onClick={() => setViewingResult(null)}
                    className="w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 