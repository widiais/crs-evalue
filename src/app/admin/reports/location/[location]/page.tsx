'use client';

export const dynamic = 'force-static';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { assessmentService } from '@/services/assessments';
import { employeeService } from '@/services/employees';
import { Assessment, AssessmentResult, Employee } from '@/types';
import { 
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  KeyIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function LocationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locationName = decodeURIComponent(params.location as string);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const selectedAssessmentId = searchParams.get('assessment') || '';

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [emps, asmt, res] = await Promise.all([
          employeeService.getAllEmployees(),
          assessmentService.getAllAssessments(),
          assessmentService.getAllAssessmentResults()
        ]);
        setEmployees(emps.filter(e => e.location === locationName));
        setAssessments(asmt);
        setResults(res);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [locationName]);

  const pins = useMemo(() => assessments.map(a => ({ id: a.id, pin: a.pin })).sort((a,b)=>a.pin.localeCompare(b.pin)), [assessments]);

  const resultsByAssessment = useMemo(() => {
    if (!selectedAssessmentId) return results;
    return results.filter(r => r.assessmentId === selectedAssessmentId);
  }, [results, selectedAssessmentId]);

  const rows = useMemo(() => {
    return employees
      .filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
      .map(emp => {
        const empResults = resultsByAssessment.filter(r => r.targetUser.id === emp.id);
        const comp = empResults.length ? empResults.reduce((acc, r) => acc + (r.scores.length ? r.scores.reduce((s, sc)=>s+sc.average,0)/r.scores.length : 0), 0) / empResults.length : 0;
        const spirit = empResults.length ? empResults.reduce((acc, r) => acc + (r.semangatScores.length ? r.semangatScores.reduce((s, sc)=>s+sc,0)/r.semangatScores.length : 0), 0) / empResults.length : 0;
        return { emp, comp, spirit };
      })
      .sort((a,b)=> a.emp.name.localeCompare(b.emp.name));
  }, [employees, resultsByAssessment, search]);

  const handlePinChange = (val: string) => {
    const base = `/admin/reports/location/${encodeURIComponent(locationName)}`;
    if (!val) router.push(base);
    else router.push(`${base}?assessment=${val}`);
  };

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
                  <button onClick={() => router.push('/admin/reports/location')} className="flex items-center text-gray-600 hover:text-gray-900 mb-2">
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Location Reports
                  </button>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{locationName}</h1>
                </div>
                <div className="hidden md:block">
                  <label className="block text-xs text-gray-500 mb-1">Assessment PIN</label>
                  <select value={selectedAssessmentId} onChange={(e)=>handlePinChange(e.target.value)} className="px-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Semua PIN</option>
                    {pins.map(p => <option key={p.id} value={p.id}>{p.pin}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-1">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Cari karyawan..." className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500" />
                </div>
                <div className="md:hidden">
                  <div className="relative">
                    <KeyIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select value={selectedAssessmentId} onChange={(e)=>handlePinChange(e.target.value)} className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500">
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
              <h3 className="text-lg font-bold text-gray-900">Karyawan ({rows.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Competency Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Spirit Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.map(row => (
                    <tr key={row.emp.id} className="hover:bg-gray-50 cursor-pointer" onClick={()=>router.push(`/admin/reports/personal/${row.emp.id}${selectedAssessmentId ? `?assessment=${selectedAssessmentId}`:''}`)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">{row.emp.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.comp.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.spirit.toFixed(2)}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Tidak ada data</td>
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


