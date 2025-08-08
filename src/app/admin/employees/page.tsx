'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserGroupIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import { employeeService } from '@/services/employees';
import { divisionService, Division } from '@/services/divisions';
import { templateService } from '@/services/templates';
import { locationService } from '@/services/locations';
import { Employee, CriteriaTemplate } from '@/types';

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [templates, setTemplates] = useState<CriteriaTemplate[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterDivision, setFilterDivision] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [previewRows, setPreviewRows] = useState<Array<{Name:string;Level:string;Division:string;Location:string;__errors?:string[]}>>([]);
  const [isValidPreview, setIsValidPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Form state for new employee
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    location: '',
    division: ''
  });

  useEffect(() => {
    loadEmployees();
    loadDivisions();
    loadTemplates();
    loadLocations();
  }, []);

  useEffect(() => {
    // Filter employees based on search and filters
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterLocation) {
      filtered = filtered.filter(emp => emp.location === filterLocation);
    }

    if (filterPosition) {
      filtered = filtered.filter(emp => emp.position === filterPosition);
    }

    if (filterDivision) {
      filtered = filtered.filter(emp => emp.division === filterDivision);
    }

    setFilteredEmployees(filtered);
  }, [employees, searchTerm, filterLocation, filterPosition, filterDivision]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDivisions = async () => {
    try {
      const data = await divisionService.getActiveDivisions();
      setDivisions(data);
    } catch (error) {
      console.error('Error loading divisions:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await templateService.getAllTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadLocations = async () => {
    try {
      const data = await locationService.getAllLocations();
      // Filter for active locations only
      const activeLocations = data.filter(location => location.isActive);
      setLocations(activeLocations);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmployee.name || !newEmployee.position || !newEmployee.location || !newEmployee.division) {
      alert('Semua field harus diisi');
      return;
    }

    try {
      await employeeService.addEmployee({
        name: newEmployee.name,
        position: newEmployee.position as any,
        location: newEmployee.location as any,
        division: newEmployee.division as any
      });
      setNewEmployee({ name: '', position: '', location: '', division: '' });
      setShowAddForm(false);
      loadEmployees(); // Refresh list
      alert('✅ Karyawan berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('❌ Gagal menambahkan karyawan');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterLocation('');
    setFilterPosition('');
    setFilterDivision('');
  };

  // Get unique positions from templates
  const availablePositions = Array.from(new Set(templates.map(template => template.level))).sort();
  
  // Get location names from location objects
  const availableLocations = locations.map(location => location.name).sort();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                aria-label="Kembali"
                className="p-2 rounded-md border border-gray-200 hover:bg-gray-50"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Setup Employees</h1>
                <p className="mt-2 text-gray-600">Kelola data karyawan dan struktur organisasi</p>
              </div>
            </div>
            
          <div className="flex gap-3">
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Import Excel
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Tambah Karyawan
            </button>
          </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Karyawan</p>
                <p className="text-2xl font-semibold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Hasil Filter</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredEmployees.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Lokasi Kerja</p>
              <p className="text-2xl font-semibold text-gray-900">{availableLocations.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Template Jabatan</p>
              <p className="text-2xl font-semibold text-gray-900">{availablePositions.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter & Search</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama..."
                  className="pl-10 form-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="form-input"
              >
                <option value="">Semua Lokasi</option>
                {availableLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="form-input"
              >
                <option value="">Semua Jabatan</option>
                {availablePositions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
              <select
                value={filterDivision}
                onChange={(e) => setFilterDivision(e.target.value)}
                className="form-input"
              >
                <option value="">Semua Divisi</option>
                {divisions.map(division => (
                  <option key={division.id} value={division.name}>{division.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Add Employee Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tambah Karyawan Baru</h2>
              
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div>
                  <label className="form-label">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    className="form-input"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Jabatan (Template) *</label>
                  <select
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="">Pilih Jabatan</option>
                    {availablePositions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                  {availablePositions.length === 0 && (
                    <p className="text-sm text-orange-600 mt-1">
                      ⚠️ Belum ada template. Silakan buat template terlebih dahulu di Setup Assessment Templates.
                    </p>
                  )}
                </div>

                <div>
                  <label className="form-label">Lokasi Kerja *</label>
                  <select
                    value={newEmployee.location}
                    onChange={(e) => setNewEmployee({...newEmployee, location: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="">Pilih Lokasi</option>
                    {availableLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  {availableLocations.length === 0 && (
                    <p className="text-sm text-orange-600 mt-1">
                      ⚠️ Belum ada lokasi. Silakan buat lokasi terlebih dahulu di Setup Work Location.
                    </p>
                  )}
                </div>

                <div>
                  <label className="form-label">Divisi *</label>
                  <select
                    value={newEmployee.division}
                    onChange={(e) => setNewEmployee({...newEmployee, division: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="">Pilih Divisi</option>
                    {divisions.map(division => (
                      <option key={division.id} value={division.name}>{division.name}</option>
                    ))}
                  </select>
                  {divisions.length === 0 && (
                    <p className="text-sm text-orange-600 mt-1">
                      ⚠️ Belum ada divisi. Silakan buat divisi terlebih dahulu di Setup Divisions.
                    </p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={divisions.length === 0 || availablePositions.length === 0 || availableLocations.length === 0}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tambah
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImport && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowImport(false)} />
            <div className="relative mx-auto mt-10 mb-10 w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Import Karyawan dari Excel</h2>
                <button onClick={() => setShowImport(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pilih File Excel</label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) {
                        setPreviewRows([]);
                        setIsValidPreview(false);
                        return;
                      }
                      try {
                        const data = await file.arrayBuffer();
                        const wb = XLSX.read(data);
                        const ws = wb.Sheets['Employees'] || wb.Sheets[wb.SheetNames[0]];
                        const rows: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

                        const normalized = rows.map((r: any) => ({
                          Name: String(r.Name ?? r.name ?? '').trim(),
                          Level: String(r.Level ?? r.level ?? '').trim(),
                          Division: String(r.Division ?? r.division ?? '').trim(),
                          Location: String(r.Location ?? r.location ?? '').trim(),
                          __errors: [] as string[]
                        }));

                        const levelSet = new Set<string>(Array.from(new Set(templates.map(t => t.level))));
                        const divisionSet = new Set(divisions.map(d => d.name));
                        const locationSet = new Set(locations.map(l => l.name));

                        for (const r of normalized) {
                          if (!r.Name) r.__errors!.push('Name kosong');
                          if (!r.Level) r.__errors!.push('Level kosong');
                          if (!r.Division) r.__errors!.push('Division kosong');
                          if (!r.Location) r.__errors!.push('Location kosong');
                          if (r.Level && !levelSet.has(r.Level)) r.__errors!.push('Level tidak dikenal');
                          if (r.Division && !divisionSet.has(r.Division)) r.__errors!.push('Division tidak dikenal');
                          if (r.Location && !locationSet.has(r.Location)) r.__errors!.push('Location tidak dikenal');
                        }
                        const valid = normalized.length > 0 && normalized.every(r => (r.__errors?.length ?? 0) === 0);

                        setPreviewRows(normalized);
                        setIsValidPreview(valid);
                      } catch (err) {
                        console.error(err);
                        alert('❌ Gagal memproses file. Pastikan format sesuai template.');
                      }
                        }}
                        className="block w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <div className="flex items-center gap-3 mt-3">
                        
                        <span className="text-xs text-gray-500">Template berisi sheet Employees + referensi Level/Division/Location.</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Format: .xlsx atau .xls. Gunakan sheet "Employees" untuk data.</p>
                    </div>

                    {previewRows.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">Preview Data</p>
                          <span className={`text-xs px-2 py-1 rounded ${isValidPreview ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isValidPreview ? 'Siap diimport' : 'Periksa  data/referensi'}
                          </span>
                        </div>
                        <div className="overflow-auto max-h-80">
                          <table className="min-w-full text-sm">
                            <thead className="bg-white sticky top-0">
                              <tr className="text-left">
                                <th className="pr-4">Name</th>
                                <th className="pr-4">Level</th>
                                <th className="pr-4">Division</th>
                                <th className="pr-4">Location</th>
                                <th className="pr-4">Errors</th>
                              </tr>
                            </thead>
                            <tbody>
                              {previewRows.map((r, idx) => {
                                const hasError = (r.__errors?.length ?? 0) > 0;
                                return (
                                  <tr key={idx} className={`border-t ${hasError ? 'bg-red-50' : ''}`}>
                                    <td className="pr-4 py-1">{r.Name}</td>
                                    <td className="pr-4 py-1">{r.Level}</td>
                                    <td className="pr-4 py-1">{r.Division}</td>
                                    <td className="pr-4 py-1">{r.Location}</td>
                                    <td className="pr-4 py-1 text-xs text-red-600">{r.__errors?.join(', ')}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded border">
                      <p className="font-medium mb-2">Aksi</p>
                      <div className="flex flex-col gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const wb = XLSX.utils.book_new();
                            const employeesSheet = XLSX.utils.aoa_to_sheet([["Name","Level","Division","Location"]]);
                            XLSX.utils.book_append_sheet(wb, employeesSheet, 'Employees');
                            const levels = Array.from(new Set(templates.map(t => t.level))).sort();
                            const levelSheet = XLSX.utils.aoa_to_sheet([["Level"], ...levels.map(l => [l])]);
                            XLSX.utils.book_append_sheet(wb, levelSheet, 'Level');
                            const divisionSheet = XLSX.utils.aoa_to_sheet([["Division"], ...divisions.map(d => [d.name])]);
                            XLSX.utils.book_append_sheet(wb, divisionSheet, 'Division');
                            const locationSheet = XLSX.utils.aoa_to_sheet([["Location"], ...locations.map((l: any) => [l.name])]);
                            XLSX.utils.book_append_sheet(wb, locationSheet, 'Location');
                            XLSX.writeFile(wb, 'employees_import_template.xlsx');
                          }}
                          className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Download Template Excel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewRows([]);
                            setIsValidPreview(false);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          Clear Data
                        </button>
                        <button
                          disabled={!isValidPreview || previewRows.length === 0}
                          onClick={async () => {
                            const levelSet = new Set<string>(Array.from(new Set(templates.map(t => t.level))));
                            const divisionSet = new Set(divisions.map(d => d.name));
                            const locationSet = new Set(locations.map(l => l.name));

                            let imported = 0;
                            for (const r of previewRows) {
                              if (!r.Name || !r.Level || !r.Division || !r.Location) continue;
                              if (!levelSet.has(r.Level) || !divisionSet.has(r.Division) || !locationSet.has(r.Location)) continue;
                              await employeeService.addEmployee({ name: r.Name, position: r.Level as any, division: r.Division, location: r.Location as any });
                              imported++;
                            }
                            await loadEmployees();
                            alert(`✅ Import selesai. Berhasil menambahkan ${imported} karyawan.`);
                            setPreviewRows([]);
                            setIsValidPreview(false);
                            setShowImport(false);
                          }}
                          className={`px-3 py-2 rounded text-white ${(!isValidPreview || previewRows.length === 0) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                          Proses Import
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Pastikan preview di sebelah kiri sudah benar sebelum memproses.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 border-t bg-gray-50 text-right">
                <button onClick={() => setShowImport(false)} className="px-4 py-2 bg-gray-200 rounded">Tutup</button>
              </div>
            </div>
          </div>
        )}

        {/* Employees Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Karyawan ({filteredEmployees.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jabatan (Template)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Divisi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{employee.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {employee.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {employee.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {employee.division}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEmployees.length === 0 && (
              <div className="text-center py-8">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada karyawan</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterLocation || filterPosition || filterDivision
                    ? 'Tidak ada karyawan yang sesuai dengan filter'
                    : 'Mulai dengan menambahkan karyawan baru'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Info Setup Karyawan</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• <strong>Jabatan:</strong> Diambil dari template assessment yang telah dibuat (level template)</p>
            <p>• <strong>Lokasi Kerja:</strong> Diambil dari lokasi yang telah dibuat di Setup Work Location</p>
            <p>• <strong>Divisi:</strong> Diambil dari divisi yang telah dibuat di Setup Divisions</p>
            <p>• Pastikan template, lokasi, dan divisi sudah dibuat terlebih dahulu sebelum menambah karyawan</p>
          </div>
        </div>
      </div>
    </div>
  );
} 