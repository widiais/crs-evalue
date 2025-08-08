'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { employeeService } from '@/services/employees';
import { assessmentService } from '@/services/assessments';
import { Employee, AssessmentResult } from '@/types';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ReportLocationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locationName = decodeURIComponent((params as any).location as string);

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [allEmployees, allResults] = await Promise.all([
          employeeService.getAllEmployees(),
          assessmentService.getAllAssessmentResults(),
        ]);
        setEmployees(allEmployees);
        setResults(allResults);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [locationName]);

  const rows = useMemo(() => {
    const normalize = (s?: string) => (s || '').trim().toLowerCase();
    const target = normalize(locationName);
    const employeesInLocation = employees.filter((e) => normalize(e.location) === target);
    // Build results by employee
    const empToResults = new Map<string, AssessmentResult[]>();
    results.forEach((r) => {
      const id = r.targetUser?.id;
      if (!id) return;
      if (!empToResults.has(id)) empToResults.set(id, []);
      empToResults.get(id)!.push(r);
    });

    const employeesWithResults = employeesInLocation.filter((emp) => (empToResults.get(emp.id) || []).length > 0);
    const data = employeesWithResults.map((emp) => {
      const empResults = empToResults.get(emp.id) || [];
      // competency avg per result
      const compAverages = empResults.map((res) => {
        const compScores = (res.competencyQuestionScores || []).filter((v): v is number => typeof v === 'number');
        if (compScores.length === 0) return 0;
        return compScores.reduce((a, b) => a + b, 0) / compScores.length;
      });
      const spiritAverages = empResults.map((res) => {
        const spiritScores = (res.semangatScores || []).filter((v): v is number => typeof v === 'number');
        if (spiritScores.length === 0) return 0;
        return spiritScores.reduce((a, b) => a + b, 0) / spiritScores.length;
      });

      const compAvg = compAverages.length ? compAverages.reduce((a, b) => a + b, 0) / compAverages.length : 0;
      const spiritAvg = spiritAverages.length ? spiritAverages.reduce((a, b) => a + b, 0) / spiritAverages.length : 0;

      return {
        id: emp.id,
        name: emp.name,
        compAvg,
        spiritAvg,
      };
    });

    const filtered = search
      ? data.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
      : data;
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [employees, results, search]);

  const styles = useMemo(() => StyleSheet.create({
    page: {
      padding: 24,
      fontSize: 11,
      fontFamily: 'Helvetica'
    },
    header: {
      fontSize: 16,
      fontWeight: 700,
      marginBottom: 6
    },
    subHeader: {
      fontSize: 12,
      color: '#4b5563',
      marginBottom: 12
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#f3f4f6',
      borderTop: '1px solid #e5e7eb',
      borderBottom: '1px solid #e5e7eb'
    },
    row: {
      flexDirection: 'row',
      borderBottom: '1px solid #e5e7eb'
    },
    cell: {
      padding: 6,
      fontSize: 10,
      flexGrow: 1
    },
    cellName: { flexBasis: '60%' },
    cellScore: { flexBasis: '20%', textAlign: 'right' }
  }), []);

  const LocationEmployeesPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Report Location</Text>
        <Text style={styles.subHeader}>Location: {locationName} • Employees: {rows.length}</Text>

        <View style={styles.tableHeader} wrap={false}>
          <Text style={[styles.cell, styles.cellName]}>Employee Name</Text>
          <Text style={[styles.cell, styles.cellScore]}>Competency Score</Text>
          <Text style={[styles.cell, styles.cellScore]}>Spirit Score</Text>
        </View>
        {rows.map((r, i) => (
          <View key={r.id + String(i)} style={styles.row} wrap={false}>
            <Text style={[styles.cell, styles.cellName]}>{r.name}</Text>
            <Text style={[styles.cell, styles.cellScore]}>{r.compAvg.toFixed(2)}</Text>
            <Text style={[styles.cell, styles.cellScore]}>{r.spiritAvg.toFixed(2)}</Text>
          </View>
        ))}
        {rows.length === 0 && (
          <View style={styles.row} wrap={false}>
            <Text style={styles.cell}>Tidak ada data</Text>
          </View>
        )}
      </Page>
    </Document>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              aria-label="Kembali"
              className="p-2 rounded-md border border-gray-200 hover:bg-gray-50"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Location: {locationName}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari karyawan..."
              className="border rounded-md px-3 py-2 text-sm"
            />
            <PDFDownloadLink
              document={<LocationEmployeesPDF />}
              fileName={`report-location-${encodeURIComponent(locationName)}.pdf`}
            >
              {({ loading: downloading }) => (
                <button
                  className="px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  disabled={downloading}
                >
                  {downloading ? 'Menyiapkan...' : 'Download PDF'}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competency Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spirit Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/admin/reports/personal/${row.id}`)}
                >
                  <td className="px-6 py-3">{row.name}</td>
                  <td className="px-6 py-3">{row.compAvg.toFixed(2)}</td>
                  <td className="px-6 py-3">{row.spiritAvg.toFixed(2)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-center text-gray-500" colSpan={3}>Tidak ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


