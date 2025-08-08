'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { assessmentService } from '@/services/assessments';
import { employeeService } from '@/services/employees';
import { divisionService, Division } from '@/services/divisions';
import { templateService } from '@/services/templates';
import { locationService } from '@/services/locations';
import { Assessment, Employee, Evaluator, CriteriaTemplate, } from '@/types';
import { RELATIONSHIP_STATUS } from '@/constants';
import { POSITIONS } from '@/constants/positions';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const pin = params.pin as string;
  const { user } = useAuth();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [evaluator, setEvaluator] = useState<Partial<Evaluator>>({
    name: '',
    position: undefined,
    division: undefined,
    status: undefined
  });

  // Dynamic data from services
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [templates, setTemplates] = useState<CriteriaTemplate[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  // Get unique positions from templates and locations
  const availablePositions = Array.from(new Set(templates.map(template => template.level))).sort();
  const availableLocations = locations.map(location => location.name).sort();

  // We now show evaluator position exactly as Montaz JobTitle on the form.

  function mapJobTitleToDivision(jobTitle?: string): string {
    if (!jobTitle) return 'Operations';
    const jt = jobTitle.toLowerCase();
    if (jt.includes('hr')) return 'HRD';
    if (jt.includes('finance') || jt.includes('account')) return 'Finance';
    if (jt.includes('marketing') || jt.includes('sales')) return 'Marketing';
    if (jt.includes('it') || jt.includes('developer') || jt.includes('programmer')) return 'IT';
    if (jt.includes('quality') || jt.includes('qa')) return 'Quality Assurance';
    if (jt.includes('procure') || jt.includes('purchasing')) return 'Procurement';
    if (jt.includes('legal')) return 'Legal';
    return 'Operations';
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load assessment
        const assessmentData = await assessmentService.getAssessmentByPIN(pin);
        if (!assessmentData) {
          setError('PIN tidak valid atau sudah tidak aktif');
          return;
        }
        setAssessment(assessmentData);

        // Load all required data in parallel
        const [employees, divisionsData, templatesData, locationsData] = await Promise.all([
          employeeService.getAllEmployees(),
          divisionService.getActiveDivisions(),
          templateService.getAllTemplates(),
          locationService.getAllLocations()
        ]);

        setAllEmployees(employees);
        setFilteredEmployees(employees);
        setDivisions(divisionsData);
        setTemplates(templatesData);
        // Filter for active locations only
        setLocations(locationsData.filter(location => location.isActive));
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    if (pin) {
      loadData();
    }
  }, [pin]);

  // Prefill evaluator info from Montaz user data when available
  useEffect(() => {
    if (!user) return;
    setEvaluator(prev => ({
      ...prev,
      name: user.name || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
      position: user.jobTitle || 'Member',
      division: prev.division,
      status: prev.status
    }));
  }, [user]);

  // Filter employees when location or position changes
  useEffect(() => {
    let filtered = allEmployees;
    
    if (selectedLocation) {
      filtered = filtered.filter(emp => emp.location === selectedLocation);
    }
    
    if (selectedPosition) {
      filtered = filtered.filter(emp => emp.position === selectedPosition);
    }
    
    setFilteredEmployees(filtered);
    
    // Reset selected employee if current selection is not in filtered list
    if (selectedEmployee && !filtered.find(emp => emp.id === selectedEmployee)) {
      setSelectedEmployee('');
    }
  }, [selectedLocation, selectedPosition, allEmployees, selectedEmployee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee || !evaluator.name || !evaluator.position || !evaluator.division || !evaluator.status) {
      setError('Semua field harus diisi');
      return;
    }

    // Check if evaluator already assessed this employee
    try {
      const hasAssessed = await assessmentService.hasEvaluatorAssessedTarget(
        assessment!.id, 
        evaluator.name!, 
        selectedEmployee
      );

      if (hasAssessed) {
        setError('Anda sudah pernah menilai karyawan ini dalam sesi assessment ini');
        return;
      }
    } catch (err) {
      console.warn('Could not check duplicate assessment:', err);
    }

    // Redirect to assessment form
    router.push(`/pin/${pin}/form?employee=${selectedEmployee}&evaluator=${encodeURIComponent(JSON.stringify(evaluator))}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 btn-primary"
          >
             ke Halaman Utama
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => router.push('/')} aria-label="Kembali" className="p-2 rounded-md border border-gray-200 hover:bg-gray-50">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {assessment?.title}
            </h1>
            <p className="text-gray-600">
              PIN: <span className="font-mono font-semibold">{pin}</span>
            </p>
            </div>
            <div className="w-9" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target Employee Selection */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Siapa yang Dinilai?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Lokasi Kerja</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Semua Lokasi</option>
                    {availableLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Jabatan</label>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Semua Jabatan</option>
                    {availablePositions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="form-label">Karyawan</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Pilih Karyawan</option>
                  {filteredEmployees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position} ({employee.location})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Evaluator Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Data Penilai (Evaluator)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Nama Lengkap</label>
                  {user ? (
                    <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200 text-gray-800">
                      {evaluator.name}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={evaluator.name}
                      onChange={(e) => setEvaluator({...evaluator, name: e.target.value})}
                      className="form-input"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="form-label">Jabatan Evaluator</label>
                  {user ? (
                    <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200 text-gray-800">
                      {evaluator.position}
                    </div>
                  ) : (
                    <select
                      value={evaluator.position || ''}
                      onChange={(e) => setEvaluator({...evaluator, position: e.target.value as any})}
                      className="form-input"
                      required
                    >
                      <option value="">Pilih Jabatan</option>
                      {availablePositions.map(position => (
                        <option key={position} value={position}>{position}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="form-label">Divisi</label>
                  <select
                    value={evaluator.division || ''}
                    onChange={(e) => setEvaluator({...evaluator, division: e.target.value as any})}
                    className="form-input"
                    required
                  >
                    <option value="">Pilih Divisi</option>
                    {divisions.map(division => (
                      <option key={division.id} value={division.name}>{division.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Status Hubungan</label>
                  <select
                    value={evaluator.status || ''}
                    onChange={(e) => setEvaluator({...evaluator, status: e.target.value as any})}
                    className="form-input"
                    required
                  >
                    <option value="">Pilih Status</option>
                    {RELATIONSHIP_STATUS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!selectedEmployee || !evaluator.name || !evaluator.position || !evaluator.division || !evaluator.status}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mulai Assessment
              </button>
            </div>
          </form>

          {/* Information Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Informasi:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Total karyawan tersedia: {allEmployees.length}</li>
              <li>• Karyawan sesuai filter: {filteredEmployees.length}</li>
              <li>• Anda hanya bisa menilai satu karyawan sekali per sesi assessment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 