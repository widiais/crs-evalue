'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentService } from '@/services/assessments';
import { employeeService } from '@/services/employees';
import { Assessment, AssessmentResult, Employee } from '@/types';
import { 
  ArrowLeftIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

export default function LocationReportsPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [emps, asmt, res] = await Promise.all([
          employeeService.getAllEmployees(),
          assessmentService.getAllAssessments(),
          assessmentService.getAllAssessmentResults()
        ]);
        setEmployees(emps);
        setAssessments(asmt);
        setResults(res);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pins = useMemo(() => assessments.map(a => ({ id: a.id, pin: a.pin })).sort((a, b) => a.pin.localeCompare(b.pin)), [assessments]);

  const resultsByAssessment = useMemo(() => {
    if (!selectedAssessmentId) return results;
    return results.filter(r => r.assessmentId === selectedAssessmentId);
  }, [results, selectedAssessmentId]);

  // map: location -> { employees, compScores[], spiritScores[] }
  const rows = useMemo(() => {
    const map: Record<string, { employeeIds: Set<string>; comp: number[]; spirit: number[] }>= {};
    resultsByAssessment.forEach(r => {
      const emp = employees.find(e => e.id === r.targetUser.id);
      if (!emp) return;
      if (!map[emp.location]) map[emp.location] = { employeeIds: new Set(), comp: [], spirit: [] };

      map[emp.location].employeeIds.add(emp.id);
      // competency average per result
      if (r.scores.length > 0) {
        const avgComp = r.scores.reduce((s, sc) => s + sc.average, 0) / r.scores.length;
        map[emp.location].comp.push(avgComp);
      }
      if (r.semangatScores.length > 0) {
        const avgSem = r.semangatScores.reduce((s, sc) => s + sc, 0) / r.semangatScores.length;
        map[emp.location].spirit.push(avgSem);
      }
    });

    // Include locations with employees but no results so they show up with zeros
    employees.forEach(emp => {
      if (!map[emp.location]) map[emp.location] = { employeeIds: new Set([emp.id]), comp: [], spirit: [] };
      else map[emp.location].employeeIds.add(emp.id);
    });

    const arr = Object.entries(map).map(([location, v]) => {
      const avgComp = v.comp.length ? v.comp.reduce((a,b)=>a+b,0) / v.comp.length : 0;
      const avgSpirit = v.spirit.length ? v.spirit.reduce((a,b)=>a+b,0) / v.spirit.length : 0;
      return { location, totalEmployees: v.employeeIds.size, avgComp, avgSpirit };
    });

    return arr
      .filter(row => row.location.toLowerCase().includes(search.toLowerCase()))
      .sort((a,b)=> a.location.localeCompare(b.location));
  }, [employees, resultsByAssessment, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 relative overflow-hidden">
      <div className="relative z-10 min-h-screen py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <button onClick={() => router.push('/admin')} className="flex items-center text-gray-600 hover:text-gray-900 mb-2">
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Dashboard
                  </button>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Location Reports</h1>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Cari lokasi..." className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500" />
                </div>
                <div className="md:col-span-2">
                  <div className="relative">
                    <KeyIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select value={selectedAssessmentId} onChange={(e)=>setSelectedAssessmentId(e.target.value)} className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500">
                      <option value="">Semua PIN</option>
                      {pins.map(p => <option key={p.id} value={p.id}>{p.pin}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 lg:px-8 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Daftar Lokasi</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Competency Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Spirit Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.map(row => (
                    <tr key={row.location} className="hover:bg-gray-50 cursor-pointer" onClick={()=>router.push(`/admin/reports/location/${encodeURIComponent(row.location)}`)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">{row.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.totalEmployees}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.avgComp.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.avgSpirit.toFixed(2)}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Tidak ada data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


