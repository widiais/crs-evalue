'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { assessmentService } from '@/services/assessments';
import { employeeService } from '@/services/employees';
import { templateService } from '@/services/templates';
import { AssessmentResult, Employee } from '@/types';
import { ArrowLeftIcon, MagnifyingGlassIcon, TrashIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({ page: { padding: 24, fontSize: 11 }, title: { fontSize: 16, marginBottom: 8, fontWeight: 700 }, section: { marginTop: 12 }, row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }, tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', padding: 6, fontWeight: 700 }, cell: { padding: 6, flexGrow: 1 } });

export default function EmployeeAssessmentsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPin, setSearchPin] = useState('');
  const [searchAssessor, setSearchAssessor] = useState('');
  const [competencyQuestions, setCompetencyQuestions] = useState<Array<{ text: string; category: string; idx: number }>>([]);
  const [workSpiritQuestions, setWorkSpiritQuestions] = useState<string[]>([]);

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
        const [emps, all, templates] = await Promise.all([
          employeeService.getAllEmployees(),
          assessmentService.getAllAssessmentResults(),
          templateService.getAllTemplates(),
        ]);
        setEmployee(emps.find(e => e.id === id) || null);
        const mine = all.filter(r => r.targetUser.id === id);
        // Enrich with 6-digit PIN from assessment
        const withPins = await Promise.all(mine.map(async r => {
          const assess = await assessmentService.getAssessmentById(r.assessmentId);
          return { ...r, pin: assess?.pin || r.assessmentId } as any;
        }));
        setResults(withPins as any);
        // Load template-based questions by employee position
        const emp = emps.find(e => e.id === id);
        if (emp) {
          const match = templates.find((t: any) => t.level === emp.position) || templates[0];
          if (match) {
            if (Array.isArray(match.section1)) {
              setCompetencyQuestions(match.section1.map((q: any, i: number) => ({ text: q.text, category: normalizeCategory(q.category), idx: i })));
            }
            if (Array.isArray(match.section2)) {
              setWorkSpiritQuestions(match.section2.map((q: any) => q.text));
            }
          }
        }
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const filtered = useMemo(() => {
    return results.filter(r =>
      (!searchPin || (r as any).assessmentId?.toLowerCase().includes(searchPin.toLowerCase())) &&
      (!searchAssessor || r.evaluator?.name?.toLowerCase().includes(searchAssessor.toLowerCase()))
    );
  }, [results, searchPin, searchAssessor]);

  const handleDelete = async (rid: string) => {
    if (!confirm('Hapus assessment ini?')) return;
    await assessmentService.deleteAssessmentResult(rid);
    setResults(prev => prev.filter(r => r.id !== rid));
  };

  const ResultPDF = ({ result }: { result: AssessmentResult }) => {
    // Build dimension -> list of {question, score}
    const breakdown: Record<string, Array<{ question: string; score: number | null }>> = {} as any;
    DIMENSIONS.forEach(d => (breakdown[d] = []));
    competencyQuestions.forEach(q => {
      const score = result.competencyQuestionScores?.[q.idx] ?? null;
      breakdown[q.category].push({ question: q.text, score: typeof score === 'number' ? score : null });
    });
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>Assessment Report</Text>
          {employee && (
            <View style={styles.section}>
              <Text>Nama: {employee.name}</Text>
              <Text>Jabatan: {employee.position}</Text>
              <Text>Lokasi: {employee.location}</Text>
            </View>
          )}
          <View style={styles.section}>
            <Text>Assessor: {result.evaluator?.name || '-'}</Text>
            <Text>Assessment PIN: {(result as any).pin || result.assessmentId}</Text>
            <Text>Tanggal: {new Date(result.submittedAt).toLocaleDateString('id-ID')}</Text>
          </View>
          <View style={styles.section}>
            <Text>Penilaian 6 Dimensi Kompetensi</Text>
            {DIMENSIONS.map(dim => (
              <View key={dim} wrap={false}>
                <Text style={{ fontWeight: 700, marginTop: 6 }}>{dim}</Text>
                <View style={styles.tableHeader}>
                  <Text style={[styles.cell, { flexBasis: '75%' }]}>Pertanyaan</Text>
                  <Text style={[styles.cell, { textAlign: 'right' }]}>Skor</Text>
                </View>
                {(breakdown[dim] || []).map((row, i) => (
                  <View key={i} style={{ flexDirection: 'row' }} wrap={false}>
                    <Text style={[styles.cell, { flexBasis: '75%' }]}>{row.question}</Text>
                    <Text style={[styles.cell, { textAlign: 'right' }]}>{row.score != null ? row.score.toFixed(1) : '-'}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
          <View style={styles.section} wrap={false}>
            <Text>Work Spirit</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.cell, { flexBasis: '75%' }]}>Pertanyaan</Text>
              <Text style={[styles.cell, { textAlign: 'right' }]}>Skor</Text>
            </View>
            {result.semangatScores.map((s, i) => (
              <View key={i} style={{ flexDirection: 'row' }} wrap={false}>
                <Text style={[styles.cell, { flexBasis: '75%' }]}>{workSpiritQuestions[i] || `Pertanyaan ${i + 1}`}</Text>
                <Text style={[styles.cell, { textAlign: 'right' }]}>{s.toFixed(1)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.section} wrap={false}>
            <Text>Recommendations</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.cell, { flexBasis: '75%' }]}>Keterangan</Text>
              <Text style={[styles.cell, { textAlign: 'right' }]}>Total Suggestion</Text>
            </View>
            <View style={{ flexDirection: 'row' }} wrap={false}>
              <Text style={[styles.cell, { flexBasis: '75%' }]}>{result.recommendation}</Text>
              <Text style={[styles.cell, { textAlign: 'right' }]}>1 Rekomendasi</Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.back()} aria-label="Kembali" className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 mr-4">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Daftar Assessment</h1>
              {employee && <p className="text-sm text-gray-600">Untuk: {employee.name}</p>}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={searchPin} onChange={e => setSearchPin(e.target.value)} placeholder="Cari PIN/Assessment ID..." className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-56 text-sm" />
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={searchAssessor} onChange={e => setSearchAssessor(e.target.value)} placeholder="Cari Assessor..." className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-56 text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pin Assessment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Assessment</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id}>
                  <td className="px-6 py-3 text-sm text-gray-700">{r.evaluator?.name || '-'}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{(r as any).pin || r.assessmentId}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{new Date(r.submittedAt).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-3 text-sm text-gray-700 text-right">
                    <PDFDownloadLink document={<ResultPDF result={r} />} fileName={`assessment_${employee?.name?.replace(/\s+/g,'_')}_${(r as any).pin || r.assessmentId}.pdf`}>
                      {({loading}) => (
                        <button className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 mr-2" disabled={loading}>
                          <DocumentArrowDownIcon className="h-4 w-4 mr-1" /> {loading ? 'Menyiapkan...' : 'Download'}
                        </button>
                      )}
                    </PDFDownloadLink>
                    <button onClick={() => handleDelete(r.id!)} className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700">
                      <TrashIcon className="h-4 w-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
