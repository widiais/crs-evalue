'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClipboardDocumentListIcon,
  ArrowLeftIcon,
  UsersIcon,
  FunnelIcon,
  EyeIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { assessmentService } from '@/services/assessments';
import { templateService } from '@/services/templates';
import { employeeService } from '@/services/employees';
import { divisionService } from '@/services/divisions';
import { locationService } from '@/services/locations';
import { generatePIN } from '@/utils/generatePIN';
import { Assessment, CriteriaTemplate, Employee, Division, Location } from '@/types';
import { POSITIONS } from '@/constants/positions';

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<CriteriaTemplate[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  const [assessmentForm, setAssessmentForm] = useState({
    title: '',
    description: '',
    pin: '',
    startDate: '',
    endDate: '',
    selectedTemplates: [] as string[],
    isActive: true,
    manualPin: false
  });

  const [filters, setFilters] = useState({
    selectedLevels: [] as string[],
    selectedDivisions: [] as string[],
    selectedLocations: [] as string[]
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [templateData, employeeData, divisionData, locationData] = await Promise.all([
        templateService.getAllTemplates(),
        employeeService.getAllEmployees(),
        divisionService.getActiveDivisions(),
        locationService.getAllLocations()
      ]);

      setTemplates(templateData);
      setEmployees(employeeData);
      setDivisions(divisionData);
      setLocations(locationData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    // Apply level filter
    if (filters.selectedLevels.length > 0) {
      filtered = filtered.filter(emp => filters.selectedLevels.includes(emp.position));
    }

    // Apply division filter
    if (filters.selectedDivisions.length > 0) {
      filtered = filtered.filter(emp => emp.division && filters.selectedDivisions.includes(emp.division));
    }

    // Apply location filter
    if (filters.selectedLocations.length > 0) {
      filtered = filtered.filter(emp => filters.selectedLocations.includes(emp.location));
    }

    setFilteredEmployees(filtered);

    // Auto-select templates based on filtered employees' positions
    if (filtered.length > 0) {
      const positionsFromFilteredEmployees = Array.from(new Set(filtered.map(emp => emp.position)));
      const templatesForSelectedPositions = templates.filter(template =>
        positionsFromFilteredEmployees.includes(template.level)
      );
      const templateIds = templatesForSelectedPositions.map(template => template.id);

      setAssessmentForm(prev => ({
        ...prev,
        selectedTemplates: templateIds
      }));
    } else {
      // Clear template selection if no employees are selected
      setAssessmentForm(prev => ({
        ...prev,
        selectedTemplates: []
      }));
    }
  };

  const generateNewPIN = () => {
    const newPin = generatePIN();
    setAssessmentForm({...assessmentForm, pin: newPin});
  };

  const toggleTemplateSelection = (templateId: string) => {
    setAssessmentForm(prev => ({
      ...prev,
      selectedTemplates: prev.selectedTemplates.includes(templateId)
        ? prev.selectedTemplates.filter(id => id !== templateId)
        : [...prev.selectedTemplates, templateId]
    }));
  };

  const toggleLevelSelection = (level: string) => {
    setFilters(prev => ({
      ...prev,
      selectedLevels: prev.selectedLevels.includes(level)
        ? prev.selectedLevels.filter(l => l !== level)
        : [...prev.selectedLevels, level]
    }));
  };

  const toggleDivisionSelection = (divisionName: string) => {
    setFilters(prev => ({
      ...prev,
      selectedDivisions: prev.selectedDivisions.includes(divisionName)
        ? prev.selectedDivisions.filter(d => d !== divisionName)
        : [...prev.selectedDivisions, divisionName]
    }));
  };

  const toggleLocationSelection = (locationName: string) => {
    setFilters(prev => ({
      ...prev,
      selectedLocations: prev.selectedLocations.includes(locationName)
        ? prev.selectedLocations.filter(l => l !== locationName)
        : [...prev.selectedLocations, locationName]
    }));
  };

  const handleSubmitAssessment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assessmentForm.title.trim()) {
      alert('Judul assessment harus diisi');
      return;
    }

    if (!assessmentForm.pin.trim()) {
      alert('PIN harus diisi atau generate PIN baru');
      return;
    }

    if (assessmentForm.selectedTemplates.length === 0) {
      alert('Minimal pilih 1 template assessment');
      return;
    }

    if (filteredEmployees.length === 0) {
      alert('Tidak ada karyawan yang sesuai dengan kriteria yang dipilih');
      return;
    }

    setSubmitting(true);
    try {
      const assessmentData = {
        title: assessmentForm.title.trim(),
        description: assessmentForm.description.trim(),
        templateIds: assessmentForm.selectedTemplates,
        pin: assessmentForm.pin.toUpperCase(),
        isActive: assessmentForm.isActive,
        startDate: assessmentForm.startDate ? new Date(assessmentForm.startDate) : undefined,
        endDate: assessmentForm.endDate ? new Date(assessmentForm.endDate) : undefined,
        createdAt: new Date(),
        createdBy: 'admin',
        // Store filtering criteria for reference
        filters: {
          levels: filters.selectedLevels,
          divisions: filters.selectedDivisions,
          locations: filters.selectedLocations,
          employeeCount: filteredEmployees.length
        }
      };

      await assessmentService.createAssessment(assessmentData);
      alert('✅ Assessment berhasil dibuat!');
      router.push('/admin/assessments');
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('❌ Gagal menyimpan assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const getTemplatesByPosition = (position: string) => {
    return templates.filter(t => t.level === position);
  };

  const getActiveFiltersCount = () => {
    return filters.selectedLevels.length + filters.selectedDivisions.length + filters.selectedLocations.length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
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

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12 translate-y-20"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <button
                    onClick={() => router.push('/admin/assessments')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Assessments
                  </button>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    Buat Assessment Baru
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Pilih kriteria karyawan dan template assessment
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Detail Assessment</h2>

                <form onSubmit={handleSubmitAssessment} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Judul Assessment *</label>
                      <input
                        type="text"
                        value={assessmentForm.title}
                        onChange={(e) => setAssessmentForm({...assessmentForm, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Contoh: Performance Review Q4 2024"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PIN Assessment *</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={assessmentForm.pin}
                          onChange={(e) => setAssessmentForm({...assessmentForm, pin: e.target.value.toUpperCase()})}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Masukkan PIN atau generate otomatis"
                          maxLength={8}
                          required
                        />
                        <button
                          type="button"
                          onClick={generateNewPIN}
                          className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          Generate PIN
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                    <textarea
                      value={assessmentForm.description}
                      onChange={(e) => setAssessmentForm({...assessmentForm, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      rows={3}
                      placeholder="Deskripsi singkat tentang assessment ini..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
                      <input
                        type="date"
                        value={assessmentForm.startDate}
                        onChange={(e) => setAssessmentForm({...assessmentForm, startDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Berakhir</label>
                      <input
                        type="date"
                        value={assessmentForm.endDate}
                        onChange={(e) => setAssessmentForm({...assessmentForm, endDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Template Selection by Position */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Assessment (Otomatis Terpilih)
                      {filteredEmployees.length > 0 && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {assessmentForm.selectedTemplates.length} template terpilih otomatis
                        </span>
                      )}
                    </label>
                    <div className="space-y-4 max-h-60 overflow-y-auto bg-gray-50 rounded-xl p-4">
                      {POSITIONS.map(position => {
                        const positionTemplates = getTemplatesByPosition(position);

                        if (positionTemplates.length === 0) return null;

                        return (
                          <div key={position} className="border border-gray-200 rounded-xl p-4 bg-white">
                            <h4 className="font-medium text-gray-900 mb-3">{position}</h4>
                            <div className="space-y-2">
                              {positionTemplates.map(template => {
                                const isAutoSelected = filteredEmployees.length > 0 && filteredEmployees.some(emp => emp.position === template.level);
                                return (
                                  <label key={template.id} className={`flex items-center p-2 rounded-lg ${isAutoSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}>
                                    <input
                                      type="checkbox"
                                      checked={assessmentForm.selectedTemplates.includes(template.id)}
                                      onChange={() => toggleTemplateSelection(template.id)}
                                      disabled={filteredEmployees.length > 0}
                                      className={`mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${filteredEmployees.length > 0 ? 'cursor-not-allowed opacity-60' : ''}`}
                                    />
                                    <div>
                                      <p className={`text-sm font-medium ${isAutoSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                        Template {template.level}
                                        {isAutoSelected && (
                                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                            Auto-selected
                                          </span>
                                        )}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {template.section1.length} pertanyaan kompetensi, {template.section2.length} pertanyaan semangat
                                      </p>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-500">
                        Template akan otomatis terpilih berdasarkan jabatan karyawan yang dipilih di filter di atas
                      </p>
                      {filteredEmployees.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-xs text-blue-800">
                            <strong>💡 Auto-selection aktif:</strong> Template untuk jabatan {Array.from(new Set(filteredEmployees.map(emp => emp.position))).join(', ')} telah dipilih otomatis.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <input
                      type="checkbox"
                      checked={assessmentForm.isActive}
                      onChange={(e) => setAssessmentForm({...assessmentForm, isActive: e.target.checked})}
                      className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">Assessment aktif (dapat diakses evaluator)</label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => router.push('/admin/assessments')}
                      className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                      disabled={submitting}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 shadow-lg"
                      disabled={submitting}
                    >
                      {submitting ? 'Menyimpan...' : 'Buat Assessment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Filtering and Employee Preview */}
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center mb-4">
                  <FunnelIcon className="h-6 w-6 text-gray-600 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Filter Karyawan</h3>
                  {getActiveFiltersCount() > 0 && (
                    <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {getActiveFiltersCount()} aktif
                    </span>
                  )}
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Level/Jabatan</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {POSITIONS.map(position => (
                      <label key={position} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={filters.selectedLevels.includes(position)}
                          onChange={() => toggleLevelSelection(position)}
                          className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{position}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Division Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Divisi</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {divisions.map(division => (
                      <label key={division.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={filters.selectedDivisions.includes(division.name)}
                          onChange={() => toggleDivisionSelection(division.name)}
                          className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{division.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Lokasi</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {locations.map(location => (
                      <label key={location.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={filters.selectedLocations.includes(location.name)}
                          onChange={() => toggleLocationSelection(location.name)}
                          className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{location.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Employee Preview */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <UsersIcon className="h-6 w-6 text-gray-600 mr-2" />
                    <h3 className="text-lg font-bold text-gray-900">Karyawan Terpilih</h3>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {filteredEmployees.length} karyawan
                  </span>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {filteredEmployees.length === 0 ? (
                    <div className="text-center py-8">
                      <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada karyawan terpilih</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Pilih kriteria di atas untuk melihat daftar karyawan
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredEmployees.map(employee => (
                        <div key={employee.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <CheckIcon className="h-5 w-5 text-green-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                            <p className="text-xs text-gray-500">
                              {employee.position} • {employee.division} • {employee.location}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {filteredEmployees.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Assessment ini akan dikirim ke {filteredEmployees.length} karyawan yang memenuhi kriteria yang dipilih
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>📋 Template otomatis:</strong> {assessmentForm.selectedTemplates.length} template telah dipilih berdasarkan jabatan karyawan terpilih
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}