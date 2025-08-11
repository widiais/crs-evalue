'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  KeyIcon,
  StarIcon,
  TrophyIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { employeeService } from '@/services/employees';
import { assessmentService } from '@/services/assessments';
import { Employee, Assessment, AssessmentResult } from '@/types';
import { downloadPersonalReportPDF } from '@/utils/personalReportPdf';

interface KPIData {
  totalEmployees: number;
  totalAssessments: number;
  averageScore: number;
  semangatAverage: number;
  competencyBreakdown: Record<string, number>;
  semangatBreakdown: Record<string, number>;
  recommendationCounts: Record<string, number>;
  bestPerformer: { name: string; score: number };
  promotionReadiness: number;
}

export default function PersonalReportPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [assessmentCounts, setAssessmentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedPin, setSelectedPin] = useState('');
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Get unique locations, divisions, and PINs for filtering
  const locations = Array.from(new Set(employees.map(emp => emp.location))).sort();
  const divisions = Array.from(new Set(employees.map(emp => emp.division))).sort();
  const pins = Array.from(new Set(assessments.map(assessment => assessment.pin))).sort();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, assessmentResults, searchTerm, selectedLocation, selectedDivision, selectedPin]);

  // Compute total assessments per employee (overall)
  useEffect(() => {
    const counts: Record<string, number> = {};
    assessmentResults.forEach(result => {
      const empId = result.targetUser.id;
      counts[empId] = (counts[empId] || 0) + 1;
    });
    setAssessmentCounts(counts);
  }, [assessmentResults]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [employeeData, assessmentData, resultData] = await Promise.all([
        employeeService.getAllEmployees(),
        assessmentService.getAllAssessments(),
        assessmentService.getAllAssessmentResults()
      ]);
      
      setEmployees(employeeData);
      setAssessments(assessmentData);
      setAssessmentResults(resultData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;
    let relevantResults = assessmentResults;

    // Filter results by PIN first if selected
    if (selectedPin) {
      const selectedAssessment = assessments.find(a => a.pin === selectedPin);
      if (selectedAssessment) {
        relevantResults = assessmentResults.filter(result => result.assessmentId === selectedAssessment.id);
      } else {
        relevantResults = [];
      }
    }

    // Only include employees who have at least one assessment in the relevant set
    const employeeIdsWithResults = new Set(relevantResults.map(result => result.targetUser.id));
    filtered = filtered.filter(emp => employeeIdsWithResults.has(emp.id));

    // Apply other filters
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(emp => emp.location === selectedLocation);
    }

    if (selectedDivision) {
      filtered = filtered.filter(emp => emp.division === selectedDivision);
    }

    setFilteredEmployees(filtered);
    setCurrentPage(1);

    // Calculate KPI for filtered employees
    calculateKPI(filtered, relevantResults);
  };

  const calculateKPI = (employees: Employee[], results: AssessmentResult[]) => {
    if (employees.length === 0 || results.length === 0) {
      setKpiData(null);
      return;
    }

    // Filter results to only include filtered employees
    const filteredResults = results.filter(result => 
      employees.some(emp => emp.id === result.targetUser.id)
    );

    let totalScore = 0;
    let scoreCount = 0;
    let totalSemangat = 0;
    let semangatCount = 0;
    const competencyTotals: Record<string, number[]> = {};
    const semangatTotals: Record<string, number[]> = {};
    const recommendationCounts: Record<string, number> = {};
    const employeeScores: Record<string, { name: string; scores: number[]; total: number }> = {};

    filteredResults.forEach(result => {
      // Process competency scores
      result.scores.forEach(categoryScore => {
        if (!competencyTotals[categoryScore.category]) {
          competencyTotals[categoryScore.category] = [];
        }
        competencyTotals[categoryScore.category].push(categoryScore.average);
        totalScore += categoryScore.average;
        scoreCount++;

        // Track employee scores for best performer calculation
        const empId = result.targetUser.id;
        if (!employeeScores[empId]) {
          employeeScores[empId] = {
            name: result.targetUser.name,
            scores: [],
            total: 0
          };
        }
        employeeScores[empId].scores.push(categoryScore.average);
        employeeScores[empId].total += categoryScore.average;
      });

      // Process semangat scores
      result.semangatScores.forEach((score, index) => {
        const questionKey = `Semangat ${index + 1}`;
        if (!semangatTotals[questionKey]) {
          semangatTotals[questionKey] = [];
        }
        semangatTotals[questionKey].push(score);
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

    // Calculate averages
    const averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;
    const semangatAverage = semangatCount > 0 ? totalSemangat / semangatCount : 0;

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

    // Find best performer
    let bestPerformer = { name: 'N/A', score: 0 };
    Object.values(employeeScores).forEach(empData => {
      const avgScore = empData.total / empData.scores.length;
      if (avgScore > bestPerformer.score) {
        bestPerformer = { name: empData.name, score: avgScore };
      }
    });

    // Calculate promotion readiness
    const promotionReadyCount = Object.values(recommendationCounts).reduce((sum, count) => {
      return sum + (recommendationCounts['Layak Dipromosikan'] || 0) + (recommendationCounts['Promosi'] || 0);
    }, 0);
    const promotionReadiness = filteredResults.length > 0 ? (promotionReadyCount / filteredResults.length) * 100 : 0;

    setKpiData({
      totalEmployees: employees.length,
      totalAssessments: filteredResults.length,
      averageScore,
      semangatAverage,
      competencyBreakdown,
      semangatBreakdown,
      recommendationCounts,
      bestPerformer,
      promotionReadiness
    });
  };

  // Paginated data
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEmployees.slice(startIndex, endIndex);
  }, [filteredEmployees, currentPage, itemsPerPage]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredEmployees.length);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEmployeeClick = (employee: Employee) => {
    router.push(`/admin/reports/personal/${employee.id}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedDivision('');
    setSelectedPin('');
    setCurrentPage(1);
  };

  const handleDownloadPDF = async () => {
    if (!kpiData || filteredEmployees.length === 0) {
      alert('Tidak ada data untuk di-download');
      return;
    }

    try {
      setPdfLoading(true);
      
      // Generate comprehensive report data
      const reportData = {
        title: 'Personal Assessment Report',
        generatedAt: new Date().toISOString(),
        filters: {
          pin: selectedPin || 'All PINs',
          location: selectedLocation || 'All Locations',
          division: selectedDivision || 'All Divisions',
          searchTerm: searchTerm || 'No search'
        },
        kpi: kpiData,
        employees: filteredEmployees.map(emp => {
          // Get assessment results for this employee
          const empResults = assessmentResults.filter(result => result.targetUser.id === emp.id);
          
          // Calculate average competency score
          const avgScore = empResults.length > 0 
            ? empResults.reduce((sum, result) => 
                sum + result.scores.reduce((s, score) => s + score.average, 0) / result.scores.length, 0
              ) / empResults.length 
            : 0;

          // Calculate average semangat score
          const avgSemangat = empResults.length > 0
            ? empResults.reduce((sum, result) => {
                const semangatAvg = result.semangatScores.reduce((s, score) => s + score, 0) / result.semangatScores.length;
                return sum + semangatAvg;
              }, 0) / empResults.length
            : 0;

          return {
            ...emp,
            assessmentCount: empResults.length,
            averageScore: avgScore,
            averageSemangat: avgSemangat,
            level: emp.position,
            latestRecommendation: empResults.length > 0 
              ? empResults.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0].recommendation
              : 'N/A'
          };
        })
      };

      // Download using react-pdf
      await downloadPersonalReportPDF(reportData);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  const PaginationButton = ({ page, active = false, disabled = false, onClick }: {
    page: number | string;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 mx-1 text-sm font-medium rounded-lg transition-colors ${
        active
          ? 'bg-purple-600 text-white'
          : disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
      }`}
    >
      {page}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading data...</p>
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
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <button
                    onClick={() => router.push('/admin')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Dashboard
                  </button>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    Personal Reports
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Laporan komprehensif assessment personal dengan analisis KPI
                  </p>
                </div>
                
                {/* Download PDF Button */}
                {kpiData && (
                  <div className="mt-4 lg:mt-0">
                    <button
                      onClick={handleDownloadPDF}
                      disabled={pdfLoading}
                      className={`flex items-center px-6 py-3 ${
                        pdfLoading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                      } text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg`}
                    >
                      {pdfLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                          Download PDF Report
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* KPI Dashboard */}
          {kpiData && (
            <div className="mb-8">
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrophyIcon className="h-6 w-6 mr-2 text-yellow-500" />
                  Key Performance Indicators (KPI)
                </h2>
                
                {/* Main KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{kpiData.totalEmployees}</div>
                      <div className="text-sm text-blue-700">Total Employees</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{kpiData.totalAssessments}</div>
                      <div className="text-sm text-green-700">Total Assessments</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{kpiData.averageScore.toFixed(2)}</div>
                      <div className="text-sm text-purple-700">Avg Score /5.0</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{kpiData.promotionReadiness.toFixed(1)}%</div>
                      <div className="text-sm text-yellow-700">Promotion Ready</div>
                    </div>
                  </div>
                </div>

                {/* Detailed KPI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Best Performer */}
                  <div className="bg-gradient-to-r from-gold-50 to-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <StarIcon className="h-5 w-5 mr-2 text-yellow-500" />
                      Best Performer
                    </h3>
                    <div className="text-lg font-bold text-white">{kpiData.bestPerformer.name}</div>
                    <div className="text-sm text-white">Score: {kpiData.bestPerformer.score.toFixed(2)}/5.0</div>
                  </div>

                  {/* Semangat Average */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-100">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <HeartIcon className="h-5 w-5 mr-2 text-red-500" />
                      Semangat Average
                    </h3>
                    <div className="text-lg font-bold text-red-600">{kpiData.semangatAverage.toFixed(2)}/5.0</div>
                  </div>
                </div>

                {/* Competency & Recommendation Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Competency Breakdown */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Competency Breakdown</h3>
                    <div className="space-y-2">
                      {Object.entries(kpiData.competencyBreakdown).map(([category, score]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{category}</span>
                          <span className="text-sm font-medium text-gray-900">{(score as number).toFixed(2)}/5.0</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation Distribution */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Recommendation Distribution</h3>
                    <div className="space-y-2">
                      {Object.entries(kpiData.recommendationCounts).map(([rec, count]) => (
                        <div key={rec} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{rec}</span>
                          <span className="text-sm font-medium text-gray-900">{count} employees</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                  <UsersIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Karyawan</p>
                  <p className="text-2xl font-semibold text-gray-900">{employees.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                  <BuildingOfficeIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Lokasi Kerja</p>
                  <p className="text-2xl font-semibold text-gray-900">{locations.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active PINs</p>
                  <p className="text-2xl font-semibold text-gray-900">{pins.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🔍 Filter & Search</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari nama atau jabatan..."
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assessment PIN</label>
                <div className="relative">
                  <KeyIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedPin}
                    onChange={(e) => setSelectedPin(e.target.value)}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Semua PIN</option>
                    {pins.map(pin => (
                      <option key={pin} value={pin}>{pin}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Semua Lokasi</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Divisi</label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">Semua Divisi</option>
                  {divisions.map(division => (
                    <option key={division} value={division}>{division}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 w-full shadow-lg"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Employee List */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 lg:px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  👥 Daftar Karyawan
                </h3>
                <div className="text-sm text-gray-600">
                  Menampilkan {filteredEmployees.length > 0 ? startItem : 0}-{endItem} dari {filteredEmployees.length} karyawan
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jabatan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Divisi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Assessment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleEmployeeClick(employee)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full mr-3">
                            <UserIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {employee.position}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2" />
                          {employee.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {employee.division}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {assessmentCounts[employee.id] || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredEmployees.length === 0 && (
                <div className="text-center py-12">
                  <UserIcon className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Tidak ada karyawan</h3>
                  <p className="mt-2 text-gray-500">
                    {searchTerm || selectedLocation || selectedDivision || selectedPin
                      ? 'Tidak ada karyawan yang sesuai dengan filter'
                      : 'Belum ada data karyawan tersedia'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Halaman {currentPage} dari {totalPages}
                  </div>
                  
                  <div className="flex items-center">
                    <PaginationButton
                      page="❮"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    />
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        return page === 1 || 
                               page === totalPages || 
                               Math.abs(page - currentPage) <= 1;
                      })
                      .map((page, index, array) => {
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;
                        
                        return (
                          <div key={page} className="flex items-center">
                            {showEllipsis && (
                              <span className="px-2 text-gray-500">...</span>
                            )}
                            <PaginationButton
                              page={page}
                              active={page === currentPage}
                              onClick={() => handlePageChange(page)}
                            />
                          </div>
                        );
                      })}
                    
                    <PaginationButton
                      page="❯"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 