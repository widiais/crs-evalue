'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UsersIcon, 
  ArrowLeftIcon,
  ChartBarIcon,
  TrophyIcon,
  DocumentArrowDownIcon,
  StarIcon,
  ArrowDownTrayIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { employeeService } from '@/services/employees';
import { assessmentService } from '@/services/assessments';
import { templateService } from '@/services/templates';
import { AssessmentResult, Assessment, CriteriaTemplate } from '@/types';

interface RoleStats {
  position: string;
  totalEmployees: number;
  totalAssessments: number;
  averageScore: number;
  topPerformer: string;
  topPerformerScore: number;
  skillsGap: string[];
  promotionReadiness: number;
  competencyBreakdown: Record<string, number>;
  semangatBreakdown: Record<string, number>;
  recommendationCounts: Record<string, number>;
  semangatAverage: number;
  employeeList: string[];
}

export default function RoleReportPage() {
  const router = useRouter();
  const [roleStats, setRoleStats] = useState<RoleStats[]>([]);
  const [availablePositions, setAvailablePositions] = useState<string[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [templates, setTemplates] = useState<CriteriaTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    loadRoleReports();
  }, []);

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

  const loadRoleReports = async () => {
    try {
      setLoading(true);
      
      // Load all required data in parallel
      const [employees, allResults, templatesData, assessmentsData] = await Promise.all([
        employeeService.getAllEmployees(),
        assessmentService.getAllAssessmentResults(),
        templateService.getAllTemplates(),
        assessmentService.getAllAssessments()
      ]);

      setTemplates(templatesData);
      setAssessments(assessmentsData);

      // Get unique positions from templates (which are the actual job levels)
      const positions = Array.from(new Set(templatesData.map(template => template.level))).sort();
      setAvailablePositions(positions);

      // Generate real role statistics
      const stats: RoleStats[] = positions.map(position => {
        const positionEmployees = employees.filter(emp => emp.position === position);
        
        // Get all assessment results for employees in this position
        const positionResults = allResults.filter((result: AssessmentResult) => {
          const employee = employees.find(emp => emp.id === result.targetUser.id);
          return employee && employee.position === position;
        });

        // Calculate competency scores by category
        const competencyScores: Record<string, number[]> = {};
        const semangatTotals: Record<string, number[]> = {};
        const recommendationCounts: Record<string, number> = {};
        let totalScore = 0;
        let scoreCount = 0;
        let totalSemangat = 0;
        let semangatCount = 0;

        positionResults.forEach((result: AssessmentResult) => {
          // Process competency scores
          result.scores.forEach((categoryScore: any) => {
            if (!competencyScores[categoryScore.category]) {
              competencyScores[categoryScore.category] = [];
            }
            competencyScores[categoryScore.category].push(categoryScore.average);
            totalScore += categoryScore.average;
            scoreCount++;
          });

          // Process semangat scores with actual question text
          result.semangatScores.forEach((score, index) => {
            const questionText = getSemangatQuestionText(index, result.assessmentId, assessmentsData, templatesData);
            if (!semangatTotals[questionText]) {
              semangatTotals[questionText] = [];
            }
            semangatTotals[questionText].push(score);
            totalSemangat += score;
            semangatCount++;
          });

          // Count recommendations
          if (result.recommendation) {
            if (!recommendationCounts[result.recommendation]) {
              recommendationCounts[result.recommendation] = 0;
            }
            recommendationCounts[result.recommendation]++;
          }
        });

        // Calculate average competency scores per category
        const competencyBreakdown: Record<string, number> = {};
        Object.entries(competencyScores).forEach(([category, scores]) => {
          competencyBreakdown[category] = scores.reduce((a, b) => a + b, 0) / scores.length;
        });

        // Calculate semangat breakdown
        const semangatBreakdown: Record<string, number> = {};
        Object.entries(semangatTotals).forEach(([question, scores]) => {
          semangatBreakdown[question] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        });

        // Calculate overall average score for the position
        const averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;
        const semangatAverage = semangatCount > 0 ? totalSemangat / semangatCount : 0;

        // Find top performer in position
        const employeePerformance: Record<string, number> = {};
        positionResults.forEach((result: AssessmentResult) => {
          const employeeId = result.targetUser.id;
          const employeeName = result.targetUser.name;
          
          if (!employeePerformance[employeeId]) {
            employeePerformance[employeeId] = 0;
          }
          
          const resultAverage = result.scores.reduce((sum, score) => sum + score.average, 0) / result.scores.length;
          employeePerformance[employeeId] += resultAverage;
          employeePerformance[employeeName] = employeePerformance[employeeId];
        });

        // Find top performer
        let topPerformer = 'N/A';
        let topPerformerScore = 0;
        
        Object.entries(employeePerformance).forEach(([key, score]) => {
          // Skip if key is an ID
          if (key.includes('_') || /\d/.test(key)) return;
          
          if (score > topPerformerScore) {
            topPerformerScore = score;
            topPerformer = key;
          }
        });

        // Calculate promotion readiness based on average score
        let promotionReadiness = 0;
        if (averageScore >= 4.5) promotionReadiness = 85;
        else if (averageScore >= 4.0) promotionReadiness = 70;
        else if (averageScore >= 3.5) promotionReadiness = 50;
        else if (averageScore >= 3.0) promotionReadiness = 30;
        else promotionReadiness = 15;

        return {
          position,
          totalEmployees: positionEmployees.length,
          totalAssessments: positionResults.length,
          averageScore,
          topPerformer,
          topPerformerScore,
          skillsGap: getSkillsGapForPosition(position),
          promotionReadiness,
          competencyBreakdown,
          semangatBreakdown,
          recommendationCounts,
          semangatAverage,
          employeeList: positionEmployees.map(emp => emp.name)
        };
      }).filter(stat => stat.totalEmployees > 0); // Only include positions that have employees

      setRoleStats(stats);
    } catch (error) {
      console.error('Error loading role reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSkillsGapForPosition = (position: string): string[] => {
    const skillsGaps: Record<string, string[]> = {
      'Supervisor': ['Advanced Leadership', 'Strategic Planning', 'Team Management'],
      'Team Leader': ['Delegation Skills', 'Conflict Resolution', 'Performance Management'],
      'All Star': ['Leadership Development', 'Mentoring Skills', 'Project Management'],
      'Star': ['Advanced Technical Skills', 'Cross-functional Knowledge'],
      'Member': ['Time Management', 'Communication Skills', 'Technical Proficiency'],
      'Manager': ['Strategic Planning', 'Budget Management', 'Team Leadership'],
      'Senior': ['Technical Expertise', 'Knowledge Transfer', 'Mentoring'],
      'Junior': ['Basic Skills Development', 'Process Understanding', 'Task Management']
    };
    
    // If exact match not found, try partial match
    const matchedKey = Object.keys(skillsGaps).find(key => 
      position.toLowerCase().includes(key.toLowerCase()) || 
      key.toLowerCase().includes(position.toLowerCase())
    );
    
    return skillsGaps[matchedKey || position] || ['General Skills Development', 'Communication Skills', 'Technical Proficiency'];
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

  const getPromotionReadinessColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600 bg-green-100';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const handleDownloadPDF = async () => {
    try {
      // Use the utility function for PDF generation
      const { generateRoleReportPDF } = await import('@/utils/rolePdfGenerator');
      
      const blob = await generateRoleReportPDF(
        filteredStats,
        selectedRole
      );
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Role_Report_${selectedRole || 'All'}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF');
    }
  };

  const exportReport = () => {
    if (roleStats.length === 0) return;
    
    // Create CSV content
    const csvContent = `Role Performance Report\n\n` +
      `Generated on: ${new Date().toLocaleDateString()}\n\n` +
      
      `Role Summary:\n` +
      `Position,Total Employees,Total Assessments,Average Score,Top Performer,Top Score,Promotion Readiness\n` +
      roleStats.map(stats => 
        `${stats.position},${stats.totalEmployees},${stats.totalAssessments},${stats.averageScore.toFixed(2)},${stats.topPerformer},${stats.topPerformerScore.toFixed(2)},${stats.promotionReadiness}%`
      ).join('\n') + '\n\n' +
      
      `Competency Breakdown by Role:\n` +
      roleStats.map(stats => {
        return `\n${stats.position}:\n` + 
          Object.entries(stats.competencyBreakdown).map(([category, score]) => 
            `${category},${score.toFixed(2)}`
          ).join('\n');
      }).join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `role_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const filteredStats = selectedRole 
    ? roleStats.filter(stats => stats.position === selectedRole)
    : roleStats;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading role reports...</p>
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
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl">
                      <UsersIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="ml-4">
                      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Report Role</h1>
                      <p className="text-gray-600 text-lg mt-2">
                        Analisis performance berdasarkan role/posisi jabatan
                      </p>
                    </div>
              </div>
            </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    Download PDF
                  </button>
            <button
              onClick={exportReport}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                    Export CSV
            </button>
                </div>
              </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Filter Role/Position:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
                  <option value="">Semua Role</option>
            {availablePositions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
                {selectedRole && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {filteredStats.length} Role Selected
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Roles</p>
                  <p className="text-2xl font-semibold text-gray-900">{filteredStats.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200">
            <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
              <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <p className="text-2xl font-semibold text-gray-900">
                    {filteredStats.reduce((sum, stats) => sum + stats.totalEmployees, 0)}
                </p>
              </div>
            </div>
          </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                  <StarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Assessments</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {filteredStats.reduce((sum, stats) => sum + stats.totalAssessments, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200">
            <div className="flex items-center">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
                  <TrophyIcon className="h-6 w-6 text-white" />
                </div>
              <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Top Role</p>
                <p className="text-lg font-semibold text-gray-900">
                  {roleStats.sort((a, b) => b.averageScore - a.averageScore)[0]?.position || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredStats.map((stats) => (
              <div key={stats.position} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{stats.position}</h3>
                <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                    {stats.averageScore.toFixed(1)}
                  </div>
                    <div className="text-xs text-gray-500">
                      {stats.promotionReadiness}% Ready
                    </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Employees:</span>
                  <span className="text-sm font-medium">{stats.totalEmployees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Assessments:</span>
                  <span className="text-sm font-medium">{stats.totalAssessments}</span>
                </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Semangat Avg:</span>
                    <span className="text-sm font-medium text-red-600">{stats.semangatAverage.toFixed(1)}</span>
                  </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Top Performer:</span>
                    <span className="text-sm font-medium text-purple-600">{stats.topPerformer}</span>
                </div>
                
                  <div className="pt-2 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getScoreColor(stats.averageScore)
                  }`}>
                      {getScoreLabel(stats.averageScore)}
                  </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getPromotionReadinessColor(stats.promotionReadiness)
                    }`}>
                      {stats.promotionReadiness}% Promotion Ready
                    </span>
                </div>
              </div>
            </div>
          ))}
        </div>

          {/* Detailed Analysis for Selected Role */}
        {selectedRole && filteredStats.length > 0 && (
            <>
              {/* Competency Breakdown */}
              {Object.keys(filteredStats[0].competencyBreakdown).length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Breakdown Kompetensi - {selectedRole}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(filteredStats[0].competencyBreakdown).map(([category, score]) => (
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
              {Object.keys(filteredStats[0].semangatBreakdown).length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <HeartIcon className="h-6 w-6 mr-2 text-red-500" />
                    Breakdown Semangat - {selectedRole}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(filteredStats[0].semangatBreakdown).map(([question, score]) => (
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
              {Object.keys(filteredStats[0].recommendationCounts).length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrophyIcon className="h-6 w-6 mr-2 text-yellow-500" />
                    Rekomendasi Evaluator - {selectedRole}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(filteredStats[0].recommendationCounts)
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
              </div>
              )}

              {/* Skills Gap Analysis */}
              <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">🎯 Skills Gap Analysis - {selectedRole}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStats[0].skillsGap.map((skill, index) => (
                    <div key={index} className="bg-orange-50 rounded-xl p-4">
                      <div className="flex items-center">
                        <div className="bg-orange-100 rounded-full p-2 mr-3">
                          <span className="text-orange-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700">{skill}</p>
                          <p className="text-xs text-orange-500">Development Area</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Summary Table for All Roles */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 lg:px-8 py-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">📋 Summary All Roles</h3>
            </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employees
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assessments
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Score
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semangat Avg
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promotion Ready
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Top Performer
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {roleStats.map((stats) => (
                    <tr key={stats.position} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{stats.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{stats.totalEmployees}</div>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{stats.totalAssessments}</div>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{stats.averageScore.toFixed(1)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{stats.semangatAverage.toFixed(1)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getPromotionReadinessColor(stats.promotionReadiness)
                      }`}>
                        {stats.promotionReadiness}%
                      </span>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-purple-600">{stats.topPerformer}</div>
                        <div className="text-xs text-gray-500">({stats.topPerformerScore.toFixed(1)})</div>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getScoreColor(stats.averageScore)
                      }`}>
                          {getScoreLabel(stats.averageScore)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 