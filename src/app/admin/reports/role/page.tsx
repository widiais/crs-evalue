'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UsersIcon, 
  ArrowLeftIcon,
  ChartBarIcon,
  TrophyIcon,
  DocumentArrowDownIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { employeeService } from '@/services/employees';
import { assessmentService } from '@/services/assessments';
import { templateService } from '@/services/templates';
import { AssessmentResult } from '@/types';

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
  employeeList: string[];
}

export default function RoleReportPage() {
  const router = useRouter();
  const [roleStats, setRoleStats] = useState<RoleStats[]>([]);
  const [availablePositions, setAvailablePositions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    loadRoleReports();
  }, []);

  const loadRoleReports = async () => {
    try {
      setLoading(true);
      
      // Load all required data in parallel
      const [employees, allResults, templates] = await Promise.all([
        employeeService.getAllEmployees(),
        assessmentService.getAllAssessmentResults(),
        templateService.getAllTemplates()
      ]);

      // Get unique positions from templates (which are the actual job levels)
      const positions = Array.from(new Set(templates.map(template => template.level))).sort();
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
        let totalScore = 0;
        let scoreCount = 0;

        positionResults.forEach((result: AssessmentResult) => {
          result.scores.forEach((categoryScore: any) => {
            if (!competencyScores[categoryScore.category]) {
              competencyScores[categoryScore.category] = [];
            }
            competencyScores[categoryScore.category].push(categoryScore.average);
            totalScore += categoryScore.average;
            scoreCount++;
          });
        });

        // Calculate average competency scores per category
        const competencyBreakdown: Record<string, number> = {};
        Object.entries(competencyScores).forEach(([category, scores]) => {
          competencyBreakdown[category] = scores.reduce((a, b) => a + b, 0) / scores.length;
        });

        // Calculate overall average score for the position
        const averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;

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
    if (score >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPromotionReadinessColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600 bg-green-100';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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
          ).join('\n') + `\nSkills Gap: ${stats.skillsGap.join('; ')}`;
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading role reports...</p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-3xl font-bold text-gray-900">Report Role</h1>
                <p className="mt-2 text-gray-600">Analisis performance per jabatan berdasarkan data real Firebase</p>
              </div>
            </div>
            
            <button
              onClick={exportReport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="form-input max-w-xs"
          >
            <option value="">Semua Jabatan</option>
            {availablePositions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Jabatan</p>
                <p className="text-2xl font-semibold text-gray-900">{roleStats.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Karyawan</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {roleStats.reduce((sum, stats) => sum + stats.totalEmployees, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrophyIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Best Performing Role</p>
                <p className="text-lg font-semibold text-gray-900">
                  {roleStats.sort((a, b) => b.averageScore - a.averageScore)[0]?.position || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <StarIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Promotion Ready</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {roleStats.length > 0 ? Math.round(roleStats.reduce((sum, stats) => sum + stats.promotionReadiness, 0) / roleStats.length) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredStats.map((stats) => (
            <div key={stats.position} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{stats.position}</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.averageScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">Performance</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Karyawan:</span>
                  <span className="text-sm font-medium">{stats.totalEmployees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Assessments:</span>
                  <span className="text-sm font-medium">{stats.totalAssessments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Top Performer:</span>
                  <span className="text-sm font-medium text-blue-600">{stats.topPerformer}</span>
                </div>
                
                <div className="pt-2 space-y-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getScoreColor(stats.averageScore)
                  }`}>
                    {stats.averageScore >= 4.5 ? 'Excellent' : 
                     stats.averageScore >= 3.5 ? 'Good' : 'Needs Improvement'}
                  </span>
                  
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getPromotionReadinessColor(stats.promotionReadiness)
                    }`}>
                      {stats.promotionReadiness}% Promotion Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skills Gap Analysis */}
        {selectedRole && filteredStats.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Skills Gap Analysis - {selectedRole}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Key Competencies</h4>
                <div className="space-y-3">
                  {Object.entries(filteredStats[0].competencyBreakdown).map(([competency, score]) => (
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
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Skills Development Needed</h4>
                <div className="space-y-2">
                  {filteredStats[0].skillsGap.map((skill, index) => (
                    <div key={index} className="flex items-center p-2 bg-orange-50 rounded-lg">
                      <span className="text-orange-500 mr-2">⚠️</span>
                      <span className="text-sm text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">Promotion Readiness</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full" 
                      style={{ width: `${filteredStats[0].promotionReadiness}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {filteredStats[0].promotionReadiness}% of employees ready for promotion
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Perbandingan Antar Jabatan</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jabatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Karyawan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promotion Ready
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Top Skills Gap
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roleStats
                  .sort((a, b) => b.averageScore - a.averageScore)
                  .map((stats, index) => (
                  <tr key={stats.position} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 && (
                          <TrophyIcon className={`h-4 w-4 mr-2 ${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-400' : 'text-orange-500'
                          }`} />
                        )}
                        <span className="font-medium text-gray-900">{stats.position}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {stats.totalEmployees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">
                        {stats.averageScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getPromotionReadinessColor(stats.promotionReadiness)
                      }`}>
                        {stats.promotionReadiness}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getScoreColor(stats.averageScore)
                      }`}>
                        {stats.averageScore >= 4.5 ? 'Excellent' : 
                         stats.averageScore >= 3.5 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {stats.skillsGap[0] || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Career Development Insights */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 Career Development Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Leadership Pipeline:</h4>
              <p className="text-gray-700">
                {roleStats.filter(r => r.position.includes('Supervisor') || r.position.includes('Team Leader')).length} leadership positions with {Math.round(roleStats.filter(r => r.position.includes('Supervisor') || r.position.includes('Team Leader')).reduce((avg, r) => avg + r.promotionReadiness, 0) / roleStats.filter(r => r.position.includes('Supervisor') || r.position.includes('Team Leader')).length || 0)}% promotion readiness
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">High Performers:</h4>
              <p className="text-gray-700">
                {roleStats.filter(r => r.averageScore >= 4.0).length} roles with excellent performance levels
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Development Focus:</h4>
              <p className="text-gray-700">
                Leadership development and technical skills are top priorities across roles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 