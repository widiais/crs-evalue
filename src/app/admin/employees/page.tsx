'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserGroupIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { employeeService } from '@/services/employees';
import { divisionService } from '@/services/divisions';
import { templateService } from '@/services/templates';
import { locationService } from '@/services/locations';
import { Employee, CriteriaTemplate, Division } from '@/types';

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
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Form state for new employee
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    location: '',
    division: ''
  });

  // Form state for edit employee
  const [editEmployee, setEditEmployee] = useState({
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

  const handleEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee || !editEmployee.name || !editEmployee.position || !editEmployee.location || !editEmployee.division) {
      alert('Semua field harus diisi');
      return;
    }

    try {
      await employeeService.updateEmployee(selectedEmployee.id, {
        name: editEmployee.name,
        position: editEmployee.position as any,
        location: editEmployee.location as any,
        division: editEmployee.division as any
      });
      setEditEmployee({ name: '', position: '', location: '', division: '' });
      setShowEditForm(false);
      setSelectedEmployee(null);
      loadEmployees(); // Refresh list
      alert('✅ Karyawan berhasil diperbarui!');
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('❌ Gagal memperbarui karyawan');
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      await employeeService.deleteEmployee(selectedEmployee.id);
      setShowDeleteConfirm(false);
      setSelectedEmployee(null);
      loadEmployees(); // Refresh list
      alert('✅ Karyawan berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('❌ Gagal menghapus karyawan');
    }
  };

  const openEditForm = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditEmployee({
      name: employee.name,
      position: employee.position,
      location: employee.location,
      division: employee.division || ''
    });
    setShowEditForm(true);
  };

  const openDeleteConfirm = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDeleteConfirm(true);
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
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading employees...</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
              <button
                onClick={() => router.push('/admin')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    Setup Employees
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Kelola data karyawan dan struktur organisasi
                  </p>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Tambah Karyawan
            </button>
              </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Karyawan</p>
                <p className="text-2xl font-semibold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Hasil Filter</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredEmployees.length}</p>
            </div>
          </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Lokasi Kerja</p>
              <p className="text-2xl font-semibold text-gray-900">{availableLocations.length}</p>
            </div>
          </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Template Jabatan</p>
              <p className="text-2xl font-semibold text-gray-900">{availablePositions.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🔍 Filter & Search</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama..."
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Semua Lokasi</option>
                {availableLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan</label>
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Semua Jabatan</option>
                {availablePositions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Divisi</label>
              <select
                value={filterDivision}
                onChange={(e) => setFilterDivision(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 w-full shadow-lg"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Add Employee Modal */}
        {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-md mx-4 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tambah Karyawan Baru</h2>
              
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan (Template) *</label>
                  <select
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Pilih Jabatan</option>
                    {availablePositions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                  {availablePositions.length === 0 && (
                      <p className="text-sm text-orange-600 mt-2">
                      ⚠️ Belum ada template. Silakan buat template terlebih dahulu di Setup Assessment Templates.
                    </p>
                  )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Kerja *</label>
                  <select
                    value={newEmployee.location}
                    onChange={(e) => setNewEmployee({...newEmployee, location: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Pilih Lokasi</option>
                    {availableLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  {availableLocations.length === 0 && (
                      <p className="text-sm text-orange-600 mt-2">
                      ⚠️ Belum ada lokasi. Silakan buat lokasi terlebih dahulu di Setup Work Location.
                    </p>
                  )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Divisi *</label>
                  <select
                    value={newEmployee.division}
                    onChange={(e) => setNewEmployee({...newEmployee, division: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Pilih Divisi</option>
                    {divisions.map(division => (
                      <option key={division.id} value={division.name}>{division.name}</option>
                    ))}
                  </select>
                  {divisions.length === 0 && (
                      <p className="text-sm text-orange-600 mt-2">
                      ⚠️ Belum ada divisi. Silakan buat divisi terlebih dahulu di Setup Divisions.
                    </p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={divisions.length === 0 || availablePositions.length === 0 || availableLocations.length === 0}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    Tambah
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Employee Modal */}
          {showEditForm && selectedEmployee && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-md mx-4 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Karyawan</h2>
                
                <form onSubmit={handleEditEmployee} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={editEmployee.name}
                      onChange={(e) => setEditEmployee({...editEmployee, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan (Template) *</label>
                    <select
                      value={editEmployee.position}
                      onChange={(e) => setEditEmployee({...editEmployee, position: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Pilih Jabatan</option>
                      {availablePositions.map(position => (
                        <option key={position} value={position}>{position}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Kerja *</label>
                    <select
                      value={editEmployee.location}
                      onChange={(e) => setEditEmployee({...editEmployee, location: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Pilih Lokasi</option>
                      {availableLocations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Divisi *</label>
                    <select
                      value={editEmployee.division}
                      onChange={(e) => setEditEmployee({...editEmployee, division: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Pilih Divisi</option>
                      {divisions.map(division => (
                        <option key={division.id} value={division.name}>{division.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditForm(false);
                        setSelectedEmployee(null);
                        setEditEmployee({ name: '', position: '', location: '', division: '' });
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && selectedEmployee && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-md mx-4 shadow-2xl">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <TrashIcon className="h-8 w-8 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Hapus</h2>
                  <p className="text-gray-600 mb-6">
                    Apakah Anda yakin ingin menghapus karyawan <strong>{selectedEmployee.name}</strong>?
                    <br />
                    <span className="text-sm text-red-600">Tindakan ini tidak dapat dibatalkan.</span>
                  </p>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDeleteEmployee}
                      className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Ya, Hapus
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setSelectedEmployee(null);
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Employees Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 lg:px-8 py-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                👥 Daftar Karyawan ({filteredEmployees.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jabatan (Template)
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Divisi
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{employee.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => openEditForm(employee)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit karyawan"
                          >
                            <PencilIcon className="h-5 w-5" />
                        </button>
                          <button 
                            onClick={() => openDeleteConfirm(employee)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Hapus karyawan"
                          >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEmployees.length === 0 && (
                <div className="text-center py-12">
                  <UserGroupIcon className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Tidak ada karyawan</h3>
                  <p className="mt-2 text-gray-500">
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
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Info Setup Karyawan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <h4 className="font-semibold mb-3">Field Karyawan:</h4>
                <ul className="space-y-2">
                  <li>• <strong>Jabatan:</strong> Diambil dari template assessment yang telah dibuat</li>
                  <li>• <strong>Lokasi Kerja:</strong> Diambil dari Setup Work Location</li>
                  <li>• <strong>Divisi:</strong> Diambil dari Setup Divisions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Persyaratan:</h4>
                <ul className="space-y-2">
                  <li>• Template assessment harus sudah dibuat</li>
                  <li>• Lokasi kerja harus sudah setup</li>
                  <li>• Divisi harus sudah dibuat dan aktif</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 