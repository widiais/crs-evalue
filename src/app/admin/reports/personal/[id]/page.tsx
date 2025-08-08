'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { employeeService } from '@/services/employees';
import { assessmentService } from '@/services/assessments';
import { templateService } from '@/services/templates';
import { Employee, AssessmentResult } from '@/types';

export default function PersonalReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [workSpiritQuestions, setWorkSpiritQuestions] = useState<string[]>([]);
  const [competencyQuestions, setCompetencyQuestions] = useState<Array<{text: string; category: string; idx: number}>>([]);
  const [pinFilter, setPinFilter] = useState<string>('ALL');
  const [pinOptions, setPinOptions] = useState<string[]>([]);

  const DIMENSIONS = [
    'Functional Competency',
    'Leadership dan Managerial',
    'Soft Skill',
    'Problem Solving & Analytical Thinking',
    'Culture Fit and Commitment',
    'Akhlak dan Etika Kerja Islam',
  ] as const;

  const normalizeCategory = (raw?: string): typeof DIMENSIONS[number] => {
    const s = (raw || '').toLowerCase();
    if (s.includes('lead')) return 'Leadership dan Managerial';
    if (s.includes('soft')) return 'Soft Skill';
    if (s.includes('problem') || s.includes('analyt')) return 'Problem Solving & Analytical Thinking';
    if (s.includes('culture')) return 'Culture Fit and Commitment';
    if (s.includes('akhlak') || s.includes('etika')) return 'Akhlak dan Etika Kerja Islam';
    return 'Functional Competency';
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [allEmployees, allResults, templates] = await Promise.all([
          employeeService.getAllEmployees(),
          assessmentService.getAllAssessmentResults(),
          templateService.getAllTemplates()
        ]);
        const emp = allEmployees.find(e => e.id === id) || null;
        setEmployee(emp);
        const employeeResults = allResults.filter((r: any) => r.targetUser.id === id);
        // Enrich with PIN from assessment document
        const withPins: any[] = await Promise.all(
          employeeResults.map(async (r: any) => {
            const assess = await assessmentService.getAssessmentById(r.assessmentId);
            return { ...r, pin: assess?.pin || r.assessmentId } as any;
          })
        );
        setResults(withPins as any);
        setPinOptions(Array.from(new Set(withPins.map((r: any) => r.pin))) as string[]);
        if (emp) {
          const tpl = templates.find((t: any) => t.level === emp.position);
          if (tpl) {
            if (Array.isArray(tpl.section2)) {
              setWorkSpiritQuestions(tpl.section2.map((q: any) => q.text));
            }
            if (Array.isArray(tpl.section1)) {
              setCompetencyQuestions(
                tpl.section1.map((q: any, i: number) => ({ text: q.text, category: normalizeCategory(q.category), idx: i }))
              );
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const activeResults = useMemo<AssessmentResult[] | any[]>(() => {
    return pinFilter === 'ALL' ? results : (results as any).filter((r: any) => r.pin === pinFilter);
  }, [results, pinFilter]);

  const summary = useMemo(() => {
    if (activeResults.length === 0) {
      return {
        total: 0,
        average: 0,
        byCompetency: {} as Record<string, number>,
        workSpirit: [] as number[],
        last: null as Date | null,
        recommendations: [] as string[],
      };
    }

    // Competency averages
    const comp: Record<string, number[]> = {};
    (activeResults as any[]).forEach((r: any) => {
      (r.scores as any[]).forEach((c: any) => {
        (comp[c.category] ||= []).push(c.average);
      });
    });
    const byCompetency: Record<string, number> = {};
    Object.entries(comp).forEach(([k, arr]) => {
      byCompetency[k as string] = (arr as number[]).reduce((a: number, b: number) => a + b, 0) / (arr as number[]).length;
    });
    const all = Object.values(byCompetency);
    const average = all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0;

    // Work spirit averages by question index
    const wsAll = (activeResults as any[]).map((r: any) => r.semangatScores as number[]);
    const wsMax = Math.max(...wsAll.map((a: number[]) => a.length));
    const workSpirit: number[] = [];
    for (let i = 0; i < wsMax; i++) {
      const vals = wsAll.map((a: number[]) => a[i]).filter((v: number | undefined): v is number => v !== undefined) as number[];
      if (vals.length) workSpirit.push(vals.reduce((a: number, b: number) => a + b, 0) / vals.length);
    }

    const last = new Date(Math.max(...(activeResults as any[]).map((r: any) => new Date(r.submittedAt).getTime())));
    const recommendations = Array.from(new Set((activeResults as any[]).map((r: any) => r.recommendation)));

    return { total: activeResults.length, average, byCompetency, workSpirit, last, recommendations };
  }, [activeResults]);

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

  // Build per-question breakdown grouped by 6 dimensions
  const dimensionBreakdown = useMemo(() => {
    const breakdown: Record<string, Array<{ question: string; average: number }>> = {};
    
    // Initialize each dimension
    DIMENSIONS.forEach(dim => {
      breakdown[dim] = [];
    });
    
    if (activeResults.length && competencyQuestions.length) {
      // For each question in the template
      competencyQuestions.forEach((q, index) => {
        const vals = (activeResults as any[])
          .map((r: any) => r.competencyQuestionScores?.[index] as number | undefined)
          .filter((v: number | undefined): v is number => typeof v === 'number');
        
        if (vals.length) {
          const avg = vals.reduce((a: number, b: number) => a + b, 0) / vals.length;
          if (breakdown[q.category]) {
            breakdown[q.category].push({ question: q.text, average: avg });
          }
        }
      });
    }
    
    return breakdown;
  }, [activeResults, competencyQuestions]);

  const styles = StyleSheet.create({
    page: { padding: 24, fontSize: 11 },
    title: { fontSize: 16, marginBottom: 8, fontWeight: 700 },
    section: { marginTop: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', padding: 6, fontWeight: 700 },
    cell: { padding: 6, flexGrow: 1 },
  });

  // Precompute per-question averages aligned to competencyQuestions index
  const questionAverages = useMemo((): Array<number | null> => {
    if (!competencyQuestions.length) return [] as Array<number | null>;
    const arr: Array<number | null> = Array(competencyQuestions.length).fill(null);
    for (let i = 0; i < competencyQuestions.length; i++) {
      const vals = (activeResults as any[])
        .map((r: any) => r.competencyQuestionScores?.[i] as number | undefined)
        .filter((v: number | undefined): v is number => typeof v === 'number');
      arr[i] = vals.length ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : null;
    }
    return arr;
  }, [activeResults, competencyQuestions]);

  const recommendationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (activeResults as any[]).forEach((r: any) => {
      const key = r.recommendation || 'Tidak ada';
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [activeResults]);

  const ReportPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Personal Assessment Report</Text>
        {employee && (
          <View style={styles.section}>
            <Text>Nama: {employee.name}</Text>
            <Text>Jabatan: {employee.position}</Text>
            <Text>Divisi: {employee.division || 'N/A'}</Text>
            <Text>Lokasi: {employee.location}</Text>
          </View>
        )}
        <View style={styles.section}>
          <Text>Ringkasan</Text>
          <Text>Total Assessments: {summary.total}</Text>
          <Text>Rata-rata: {summary.average.toFixed(2)}</Text>
          <Text>Terakhir: {summary.last ? summary.last.toLocaleDateString('id-ID') : 'N/A'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.title, { fontSize: 14 }]}>Penilaian 6 Dimensi Kompetensi</Text>
          {DIMENSIONS.map((dimension) => {
            const qs = competencyQuestions.filter(q => q.category === dimension);
            if (qs.length === 0) return null;
            return (
              <View key={dimension} style={{ marginTop: 8 }} wrap={false}>
                <Text style={{ fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{dimension}</Text>
                <View style={styles.tableHeader}>
                  <Text style={[styles.cell, { flexBasis: '75%' }]}>Pertanyaan</Text>
                  <Text style={[styles.cell, { textAlign: 'right' }]}>Skor</Text>
                </View>
                {(qs.length === 0 ? [{ text: 'Belum ada pertanyaan', idx: -1 }] : qs).map((q: any, idx: number) => {
                  const avg = questionAverages[q.idx];
                  return (
                    <View key={`${q.idx}-${idx}`} style={{ flexDirection: 'row', backgroundColor: idx % 2 === 0 ? '#f9fafb' : '#ffffff' }} wrap={false}>
                      <Text style={[styles.cell, { flexBasis: '75%', fontSize: 10, paddingTop: 4, paddingBottom: 4 }]}>{q.text}</Text>
                      <Text style={[styles.cell, { textAlign: 'right', paddingTop: 4, paddingBottom: 4 }]}>{q.idx === -1 ? '-' : (typeof avg === 'number' ? avg.toFixed(1) : '-')}</Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
        <View style={styles.section} wrap={false}>
          <Text style={[styles.title, { fontSize: 14 }]}>Work Spirit</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, { flexBasis: '75%' }]}>Pertanyaan</Text>
            <Text style={[styles.cell, { textAlign: 'right' }]}>Skor</Text>
          </View>
          {summary.workSpirit.map((s, i) => (
            <View key={i} style={{ flexDirection: 'row', backgroundColor: i % 2 === 0 ? '#f9fafb' : '#ffffff' }} wrap={false}>
              <Text style={[styles.cell, { flexBasis: '75%', fontSize: 10, paddingTop: 4, paddingBottom: 4 }]}>
                {workSpiritQuestions[i] || `Pertanyaan ${i + 1}`}
              </Text>
              <Text style={[styles.cell, { textAlign: 'right', paddingTop: 4, paddingBottom: 4 }]}>{s.toFixed(2)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.section} wrap={false}>
          <Text style={[styles.title, { fontSize: 14 }]}>Recommendations</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, { flexBasis: '75%' }]}>Keterangan</Text>
            <Text style={[styles.cell, { textAlign: 'right' }]}>Total Suggestion</Text>
          </View>
          {Object.entries(recommendationCounts).map(([keterangan, total], i) => (
            <View key={keterangan + i} style={{ flexDirection: 'row', backgroundColor: i % 2 === 0 ? '#f9fafb' : '#ffffff' }} wrap={false}>
              <Text style={[styles.cell, { flexBasis: '75%', fontSize: 10, paddingTop: 4, paddingBottom: 4 }]}>{keterangan}</Text>
              <Text style={[styles.cell, { textAlign: 'right', paddingTop: 4, paddingBottom: 4 }]}>{`${total} Rekomendasi`}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.push('/admin/reports/personal')} aria-label="Kembali" className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 mr-4">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Report Personal</h1>
              <p className="mt-2 text-gray-600">Detail report berdasarkan hasil assessment</p>
            </div>
          </div>
          {employee && (
            <PDFDownloadLink document={<ReportPDF />} fileName={`personal_report_${employee.name.replace(/\s+/g, '_')}.pdf`}>
              {({ loading: pdfLoading }) => (
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" disabled={pdfLoading}>
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  {pdfLoading ? 'Menyiapkan PDF...' : 'Export PDF'}
                </button>
              )}
            </PDFDownloadLink>
          )}
        </div>

        {loading || !employee ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Employee Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <UserIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{employee.name}</h2>
                    <p className="text-gray-600">{employee.position} • {employee.division}</p>
                    <p className="text-sm text-gray-500">📍 {employee.location}</p>
                  </div>
                </div>
                {/* PIN Filter (All or specific 6-digit PIN) */}
                <div className="mx-6">
                  <label className="block text-xs text-gray-500 mb-1">Filter PIN</label>
                  <select
                    value={pinFilter}
                    onChange={(e) => setPinFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1.5 text-sm min-w-[160px]"
                  >
                    <option value="ALL">All</option>
                    {pinOptions.map((pin) => (
                      <option key={pin} value={pin}>{pin}</option>
                    ))}
                  </select>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{summary.average.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">Average Score</div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center cursor-pointer" onClick={() => router.push(`/admin/reports/personal/${id}/assessments`)}>
                  <ChartBarIcon className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Assessments</p>
                    <p className="text-2xl font-semibold text-gray-900">{summary.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <CalendarIcon className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Last Assessment</p>
                    <p className="text-lg font-semibold text-gray-900">{summary.last ? summary.last.toLocaleDateString('id-ID') : 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm font-medium text-gray-500">Performance Level</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getScoreColor(summary.average)}`}>
                  {getScoreLabel(summary.average)}
                </span>
              </div>
            </div>

            {/* 6 Dimensi Kompetensi - Detailed */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Penilaian 6 Dimensi Kompetensi</h3>
              <div className="space-y-6">
                {DIMENSIONS.map((dimension) => {
                  const qs = competencyQuestions.filter(q => q.category === dimension);
                  return (
                    <div key={dimension} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-800 mb-3">{dimension}</h4>
                      <div className="space-y-2">
                        {(qs.length === 0 ? [{ text: 'Belum ada pertanyaan', idx: -1 }] : qs).map((q: any, idx: number) => {
                          const avg = questionAverages[q.idx];
                          const scoreLabel = q.idx === -1 ? '-' : (typeof avg === 'number' ? avg.toFixed(1) : '-');
                          const color = typeof avg === 'number' ? getScoreColor(avg) : 'text-gray-500 bg-gray-100';
                          return (
                            <div key={`${dimension}-${q.idx}-${idx}`} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                              <span className="text-sm text-gray-700 flex-1 mr-4">{q.text}</span>
                              <span className={`px-2 py-1 rounded text-sm font-medium ${color}`}>{scoreLabel}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Work Spirit */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Spirit Scores</h3>
              <div className="space-y-3">
                {summary.workSpirit.map((s, i) => (
                  <div key={i} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 flex-1 mr-4">{workSpiritQuestions[i] || `Pertanyaan ${i + 1}`}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getScoreColor(s)}`}>{s.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
              <div className="space-y-2">
                {summary.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


