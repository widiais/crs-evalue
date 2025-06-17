'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  IdentificationIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import Select from 'react-select';
import { assessmentService } from '@/services/assessments';
import { employeeService } from '@/services/employees';
import { divisionService } from '@/services/divisions';
import { templateService } from '@/services/templates';
import { locationService } from '@/services/locations';
import { Assessment, Employee, Evaluator, CriteriaTemplate, Division, Location } from '@/types';
import { RELATIONSHIP_STATUS } from '@/constants';

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const pin = params.pin as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [selectedLocationCategory, setSelectedLocationCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
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
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);

  // Get available positions from assessment templates
  const availableAssessmentPositions = useMemo(() => {
    if (!assessment || !templates.length) return [];
    
    // Get templates that are used in this assessment
    const assessmentTemplates = templates.filter(template => 
      assessment.templateIds?.includes(template.id)
    );
    
    // Extract unique positions/levels from these templates
    return Array.from(new Set(assessmentTemplates.map(template => template.level))).sort();
  }, [assessment, templates]);

  // Get unique positions from templates and location categories
  const availablePositions = Array.from(new Set(templates.map(template => template.level))).sort();
  const availableCategories = ['Semua Kategori Lokasi', 'Store', 'Head Office'];

  // Prepare options for react-select
  const locationOptions = useMemo(() => {
    const baseOptions = filteredLocations.map(location => ({
      value: location.name,
      label: `${location.name} - ${location.city}`,
      location: location
    }));
    
    // Add "Semua Lokasi Kerja" option if category is selected and not "Semua Kategori Lokasi"
    if (selectedLocationCategory && selectedLocationCategory !== 'Semua Kategori Lokasi' && filteredLocations.length > 0) {
      return [
        { value: 'all', label: 'Semua Lokasi Kerja', location: null },
        ...baseOptions
      ];
    }
    
    return baseOptions;
  }, [filteredLocations, selectedLocationCategory]);

  const employeeOptions = useMemo(() => 
    filteredEmployees.map(employee => ({
      value: employee.id,
      label: `${employee.name} (${employee.division})`,
      employee: employee
    }))
  , [filteredEmployees]);

  // Custom styles for react-select
  const selectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      padding: '8px 12px',
      borderRadius: '12px',
      border: `1px solid ${state.isFocused ? '#3b82f6' : '#d1d5db'}`,
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#3b82f6'
      }
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
      padding: '12px',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#eff6ff'
      }
    })
  };

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
        const activeLocations = locationsData.filter(location => location.isActive);
        setLocations(activeLocations);
        setFilteredLocations(activeLocations);
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

  // Filter locations when category changes
  useEffect(() => {
    let filtered = locations;
    
    if (selectedLocationCategory && selectedLocationCategory !== 'Semua Kategori Lokasi') {
      filtered = filtered.filter(loc => loc.category === selectedLocationCategory);
    }
    // If "Semua Kategori Lokasi" is selected, show all locations
    
    setFilteredLocations(filtered);
    
    // Reset selected location if current selection is not in filtered list
    if (selectedLocation && selectedLocation !== 'all' && !filtered.find(loc => loc.name === selectedLocation)) {
      setSelectedLocation('');
    }
  }, [selectedLocationCategory, locations, selectedLocation]);

  // Filter employees when location changes
  useEffect(() => {
    let filtered = allEmployees;
    
    // First, filter by available positions in this assessment
    if (availableAssessmentPositions.length > 0) {
      filtered = filtered.filter(emp => availableAssessmentPositions.includes(emp.position));
    }
    
    // Then apply location filtering
    if (selectedLocation && selectedLocation !== 'all') {
      filtered = filtered.filter(emp => emp.location === selectedLocation);
    } else if (selectedLocationCategory && selectedLocationCategory !== 'Semua Kategori Lokasi') {
      // If "Semua Lokasi Kerja" is selected, filter by category only
      const categoryLocations = locations.filter(loc => loc.category === selectedLocationCategory);
      const categoryLocationNames = categoryLocations.map(loc => loc.name);
      filtered = filtered.filter(emp => categoryLocationNames.includes(emp.location));
    }
    // If "Semua Kategori Lokasi" is selected, show all employees (no location filtering)
    
    setFilteredEmployees(filtered);
    
    // Reset selected employee if current selection is not in filtered list
    if (selectedEmployee && !filtered.find(emp => emp.id === selectedEmployee)) {
      setSelectedEmployee('');
    }
  }, [selectedLocation, selectedLocationCategory, allEmployees, locations, selectedEmployee, availableAssessmentPositions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee || !evaluator.name || !evaluator.position || !evaluator.division || !evaluator.status) {
      setError('Semua field harus diisi');
      return;
    }

    // Get selected employee data to check if template exists for their position
    const selectedEmployeeData = allEmployees.find(emp => emp.id === selectedEmployee);
    if (!selectedEmployeeData) {
      setError('Data karyawan tidak ditemukan');
      return;
    }

    // Check if template exists for employee's position
    const employeeTemplate = templates.find(template => template.level === selectedEmployeeData.position);
    if (!employeeTemplate) {
      setError(`Template assessment untuk jabatan "${selectedEmployeeData.position}" belum tersedia. Silakan hubungi admin.`);
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

  // Get selected employee data for display
  const selectedEmployeeData = selectedEmployee ? allEmployees.find(emp => emp.id === selectedEmployee) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white text-lg">Memuat assessment...</p>
        </div>
      </div>
    );
  }

  if (error && !assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
          <div className="bg-red-100 p-4 rounded-xl mb-6">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-600 mx-auto mb-2" />
            <div className="text-red-800 font-medium">{error}</div>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Kembali ke Halaman Utama
          </button>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <IdentificationIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {assessment?.title}
            </h1>
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-xl">
                <span className="text-gray-600 text-sm font-medium mr-2">PIN:</span>
                <span className="font-mono font-bold text-lg text-blue-600">{pin}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Target Employee Selection Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl mr-4">
                  <UserGroupIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                Siapa yang Dinilai?
              </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori Lokasi
                  </label>
                  <select
                    value={selectedLocationCategory}
                    onChange={(e) => setSelectedLocationCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                  >
                    <option value="">Pilih Kategori Lokasi</option>
                    {availableCategories.map(category => (
                      <option key={category} value={category}>
                        {category === 'Semua Kategori Lokasi' ? '🌐' : category === 'Head Office' ? '🏢' : '🏪'} {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi Kerja
                  </label>
                  <Select
                    value={locationOptions.find(option => option.value === selectedLocation) || null}
                    onChange={(selectedOption) => setSelectedLocation(selectedOption?.value || '')}
                    options={locationOptions}
                    placeholder={
                      selectedLocationCategory 
                        ? selectedLocationCategory === 'Semua Kategori Lokasi' 
                          ? "Ketik untuk mencari lokasi spesifik..."
                          : "Ketik untuk mencari lokasi atau pilih semua..."
                        : "Pilih Kategori Terlebih Dahulu"
                    }
                    isSearchable
                    isClearable
                    isDisabled={!selectedLocationCategory}
                    styles={selectStyles}
                    noOptionsMessage={() => "Tidak ada lokasi yang cocok"}
                    filterOption={(option, inputValue) => {
                      if (!inputValue) return true;
                      return option.label.toLowerCase().includes(inputValue.toLowerCase());
                    }}
                  />
                  {selectedLocationCategory === 'Semua Kategori Lokasi' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Biarkan kosong untuk mencari di semua lokasi, atau pilih lokasi spesifik
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Karyawan
                </label>
                <Select
                  value={employeeOptions.find(option => option.value === selectedEmployee) || null}
                  onChange={(selectedOption) => setSelectedEmployee(selectedOption?.value || '')}
                  options={employeeOptions}
                  placeholder={
                    selectedLocationCategory
                      ? selectedLocationCategory === 'Semua Kategori Lokasi'
                        ? "Ketik nama karyawan untuk mencari di semua lokasi..."
                        : selectedLocation
                          ? selectedLocation === 'all'
                            ? "Ketik nama karyawan untuk mencari di semua lokasi kategori ini..."
                            : "Ketik nama karyawan untuk mencari..."
                          : "Pilih lokasi atau 'Semua Lokasi Kerja' terlebih dahulu"
                      : "Pilih Kategori Lokasi Terlebih Dahulu"
                  }
                  isSearchable
                  isClearable
                  isDisabled={!selectedLocationCategory}
                  styles={selectStyles}
                  noOptionsMessage={() => "Tidak ada karyawan yang cocok"}
                  filterOption={(option, inputValue) => {
                    if (!inputValue) return true;
                    return option.label.toLowerCase().includes(inputValue.toLowerCase());
                  }}
                />
              </div>
            </div>

            {/* Evaluator Information Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl mr-4">
                  <BuildingOfficeIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                Data Penilai (Evaluator)
              </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={evaluator.name}
                    onChange={(e) => setEvaluator({...evaluator, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jabatan Evaluator
                  </label>
                  <select
                    value={evaluator.position || ''}
                    onChange={(e) => setEvaluator({...evaluator, position: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                    required
                  >
                    <option value="">Pilih Jabatan</option>
                    {availablePositions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Divisi
                  </label>
                  <select
                    value={evaluator.division || ''}
                    onChange={(e) => setEvaluator({...evaluator, division: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                    required
                  >
                    <option value="">Pilih Divisi</option>
                    {divisions.map(division => (
                      <option key={division.id} value={division.name}>{division.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Hubungan
                  </label>
                  <select
                    value={evaluator.status || ''}
                    onChange={(e) => setEvaluator({...evaluator, status: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
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
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                {error}
                </div>
              </div>
            )}

            {/* Information Section - Show available positions */}
            {availableAssessmentPositions.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 lg:p-8 border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl mr-4">
                    <InformationCircleIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-900">Informasi Assessment</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">📋 Jabatan yang Tersedia:</div>
                    <div className="flex flex-wrap gap-2">
                      {availableAssessmentPositions.map(position => (
                        <span key={position} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {position}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">👥 Karyawan Tersedia:</div>
                    <div className="text-2xl font-bold text-green-600">{filteredEmployees.length}</div>
                    <div className="text-xs text-gray-500">karyawan sesuai jabatan template</div>
                  </div>
                </div>
                
                <div className="text-sm text-blue-800 bg-blue-100 rounded-xl p-3">
                  💡 <strong>Catatan:</strong> Hanya karyawan dengan jabatan yang sesuai dengan template assessment ini yang akan ditampilkan.
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                  className="flex items-center justify-center px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
              >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Kembali
              </button>
              
              <button
                type="submit"
                disabled={!selectedEmployee || !evaluator.name || !evaluator.position || !evaluator.division || !evaluator.status}
                  className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                  <span>Mulai Assessment</span>
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
} 