'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BuildingOfficeIcon, 
  ArrowLeftIcon,
  ChartBarIcon,
  UserGroupIcon,
  TrophyIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { employeeService } from '@/services/employees';
import { assessmentService } from '@/services/assessments';
import { divisionService, Division } from '@/services/divisions';
import { AssessmentResult } from '@/types';

interface DivisionStats {
  division: string;
  totalEmployees: number;
  totalAssessments: number;
  averageScore: number;
  topPerformer: string;
  topPerformerScore: number;
  competencyBreakdown: Record<string, number>;
  employeeList: string[];
}

export default function DivisionReportPage() {
  const router = useRouter();
  const [divisionStats, setDivisionStats] = useState<DivisionStats[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState<string>('');

  useEffect(() => {
    loadDivisionReports();
  }, []);

  const loadDivisionReports = async () => {
    try {
      setLoading(true);
      
      // Load all required data in parallel
      const [employees, allResults, divisionsData] = await Promise.all([
        employeeService.getAllEmployees(),
        assessmentService.getAllAssessmentResults(),
        divisionService.getActiveDivisions()
      ]);

      setDivisions(divisionsData);

      // Generate real division statistics
      const stats: DivisionStats[] = divisionsData.map(division => {
        const divisionEmployees = employees.filter(emp => emp.division === division.name);
        
        // Get all assessment results for employees in this division
        const divisionResults = allResults.filter((result: AssessmentResult) => {
          const employee = employees.find(emp => emp.id === result.targetUser.id);
          return employee && employee.division === division.name;
        });

        // Calculate competency scores by category
        const competencyScores: Record<string, number[]> = {};
        let totalScore = 0;
        let scoreCount = 0;

        divisionResults.forEach((result: AssessmentResult) => {
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

        // Calculate overall average score for the division
        const averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;

        // Find top performer in division
        const employeePerformance: Record<string, number> = {};
        divisionResults.forEach((result: AssessmentResult) => {
          const employeeId = result.targetUser.id;
          const employeeName = result.targetUser.name;
          
          if (!employeePerformance[employeeId]) {
            employeePerformance[employeeId] = 0;
          }
          
          const resultAverage = result.scores.reduce((sum, score) => sum + score.average, 0) / result.scores.length;
          employeePerformance[employeeId] += resultAverage;
          employeePerformance[employeeName] = employeePerformance[employeeId]; // Store by name too
        });

        // Find top performer
        let topPerformer = 'N/A';
        let topPerformerScore = 0;
        
        Object.entries(employeePerformance).forEach(([key, score]) => {
          // Skip if key is an ID (contains underscore or numbers)
          if (key.includes('_') || /\d/.test(key)) return;
          
          if (score > topPerformerScore) {
            topPerformerScore = score;
            topPerformer = key;
          }
        });

        return {
          division: division.name,
          totalEmployees: divisionEmployees.length,
          totalAssessments: divisionResults.length,
          averageScore,
          topPerformer,
          topPerformerScore,
          competencyBreakdown,
          employeeList: divisionEmployees.map(emp => emp.name)
        };
      });

      setDivisionStats(stats);
    } catch (error) {
      console.error('Error loading division reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600 bg-green-100';
    if (score >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceRank = (score: number) => {
    const sorted = [...divisionStats].sort((a, b) => b.averageScore - a.averageScore);
    return sorted.findIndex(stats => stats.averageScore === score) + 1;
  };

  const exportReport = () => {
    if (divisionStats.length === 0) return;
    
    // Create CSV content
    const csvContent = `Division Performance Report\n\n` +
      `Generated on: ${new Date().toLocaleDateString()}\n\n` +
      
      `Division Summary:\n` +
      `Division,Total Employees,Total Assessments,Average Score,Top Performer,Top Score\n` +
      divisionStats.map(stats => 
        `${stats.division},${stats.totalEmployees},${stats.totalAssessments},${stats.averageScore.toFixed(2)},${stats.topPerformer},${stats.topPerformerScore.toFixed(2)}`
      ).join('\n') + '\n\n' +
      
      `Competency Breakdown by Division:\n` +
      divisionStats.map(stats => {
        return `\n${stats.division}:\n` + 
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
    a.download = `division_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const filteredStats = selectedDivision 
    ? divisionStats.filter(stats => stats.division === selectedDivision)
    : divisionStats;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading division reports...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Report Division</h1>
                <p className="mt-2 text-gray-600">Analisis performance per divisi berdasarkan data real Firebase</p>
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
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="form-input max-w-xs"
          >
            <option value="">Semua Divisi</option>
            {divisions.map(division => (
              <option key={division.id} value={division.name}>{division.name}</option>
            ))}
          </select>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Divisi</p>
                <p className="text-2xl font-semibold text-gray-900">{divisions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Karyawan</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {divisionStats.reduce((sum, stats) => sum + stats.totalEmployees, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Assessments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {divisionStats.reduce((sum, stats) => sum + stats.totalAssessments, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrophyIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Top Division</p>
                <p className="text-lg font-semibold text-gray-900">
                  {divisionStats.sort((a, b) => b.averageScore - a.averageScore)[0]?.division || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Division Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredStats.map((stats) => (
            <div key={stats.division} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{stats.division}</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.averageScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Rank #{getPerformanceRank(stats.averageScore)}
                  </div>
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
                
                <div className="pt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getScoreColor(stats.averageScore)
                  }`}>
                    {stats.averageScore >= 4.5 ? 'Excellent' : 
                     stats.averageScore >= 3.5 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Competency Analysis */}
        {selectedDivision && filteredStats.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Analisis Kompetensi - {selectedDivision}
            </h3>
            
            <div className="space-y-4">
              {Object.entries(filteredStats[0].competencyBreakdown).map(([competency, score]) => (
                <div key={competency}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{competency}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {score.toFixed(1)}/5.0
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full" 
                      style={{ width: `${(score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Perbandingan Antar Divisi</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Divisi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Karyawan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assessments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Top Performer
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {divisionStats
                  .sort((a, b) => b.averageScore - a.averageScore)
                  .map((stats, index) => (
                  <tr key={stats.division} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 && (
                          <TrophyIcon className={`h-4 w-4 mr-2 ${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-400' : 'text-orange-500'
                          }`} />
                        )}
                        <span className="font-medium text-gray-900">{stats.division}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {stats.totalEmployees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {stats.totalAssessments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">
                        {stats.averageScore.toFixed(1)}
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
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-medium">
                      {stats.topPerformer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">📊 Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Top Performing Division:</h4>
              <p>{divisionStats.sort((a, b) => b.averageScore - a.averageScore)[0]?.division} dengan rata-rata score {divisionStats.sort((a, b) => b.averageScore - a.averageScore)[0]?.averageScore.toFixed(1)}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Area for Improvement:</h4>
              <p>Focus pada leadership development dan technical skills training</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 