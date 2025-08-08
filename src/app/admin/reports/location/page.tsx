'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { employeeService } from '@/services/employees';
import { assessmentService } from '@/services/assessments';
import { Employee, AssessmentResult } from '@/types';

export default function ReportLocationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [emps, res] = await Promise.all([
          employeeService.getAllEmployees(),
          assessmentService.getAllAssessmentResults(),
        ]);
        setEmployees(emps);
        setResults(res);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const rows = useMemo(() => {
    // Group employees by location
    const locationToEmployees = new Map<string, Employee[]>();
    employees.forEach((e) => {
      if (!e.location) return;
      if (!locationToEmployees.has(e.location)) locationToEmployees.set(e.location, []);
      locationToEmployees.get(e.location)!.push(e);
    });

    // Build result map: employeeId -> list of results
    const empToResults = new Map<string, AssessmentResult[]>();
    results.forEach((r) => {
      const id = r.targetUser?.id;
      if (!id) return;
      if (!empToResults.has(id)) empToResults.set(id, []);
      empToResults.get(id)!.push(r);
    });

    // Calculate per-location totals
    const data: Array<{ location: string; totalEmployees: number; averageScore: number }> = [];
    locationToEmployees.forEach((emps, location) => {
      const totalEmployees = emps.length;
      // For each employee, compute a combined average across their results (competency + spirit combined average)
      const perEmployeeAverages: number[] = emps.map((emp) => {
        const empResults = empToResults.get(emp.id) || [];
        if (empResults.length === 0) return 0;

        // For each result, compute overall score: average of competencyQuestionScores and semangatScores
        const perResultAverages = empResults.map((res) => {
          const compScores = (res.competencyQuestionScores || []).filter((v): v is number => typeof v === 'number');
          const spiritScores = (res.semangatScores || []).filter((v): v is number => typeof v === 'number');
          const compAvg = compScores.length ? compScores.reduce((a, b) => a + b, 0) / compScores.length : 0;
          const spiritAvg = spiritScores.length ? spiritScores.reduce((a, b) => a + b, 0) / spiritScores.length : 0;
          // Combined overall result average: simple mean of two sections when both exist; else whichever exists
          const haveComp = compScores.length > 0; const haveSpirit = spiritScores.length > 0;
          if (haveComp && haveSpirit) return (compAvg + spiritAvg) / 2;
          if (haveComp) return compAvg;
          if (haveSpirit) return spiritAvg;
          return 0;
        });
        if (perResultAverages.length === 0) return 0;
        return perResultAverages.reduce((a, b) => a + b, 0) / perResultAverages.length;
      });

      const numerator = perEmployeeAverages.reduce((a, b) => a + b, 0);
      const averageScore = totalEmployees > 0 ? numerator / totalEmployees : 0;
      data.push({ location, totalEmployees, averageScore });
    });

    // search filter
    const filtered = search
      ? data.filter((d) => d.location.toLowerCase().includes(search.toLowerCase()))
      : data;
    // sort by location name asc
    return filtered.sort((a, b) => a.location.localeCompare(b.location));
  }, [employees, results, search]);

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
            <h1 className="text-2xl font-bold text-gray-900">Report Location</h1>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari lokasi..."
            className="border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row) => (
                <tr
                  key={row.location}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/admin/reports/location/${encodeURIComponent(row.location)}`)}
                >
                  <td className="px-6 py-3">{row.location}</td>
                  <td className="px-6 py-3">{row.totalEmployees}</td>
                  <td className="px-6 py-3">{row.averageScore.toFixed(2)}</td>
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


