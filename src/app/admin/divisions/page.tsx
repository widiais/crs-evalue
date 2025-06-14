'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BuildingOfficeIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  UserGroupIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { divisionService } from '@/services/divisions';
import { Division } from '@/types';

export default function DivisionsPage() {
  const router = useRouter();
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [filteredDivisions, setFilteredDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    head: '',
    isActive: true
  });

  useEffect(() => {
    loadDivisions();
  }, []);

  useEffect(() => {
    // Filter divisions based on search and status
    let filtered = divisions;

    if (searchTerm) {
      filtered = filtered.filter(division => 
        division.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        division.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        division.head?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== '') {
      const isActive = filterStatus === 'active';
      filtered = filtered.filter(division => division.isActive === isActive);
    }

    setFilteredDivisions(filtered);
  }, [divisions, searchTerm, filterStatus]);

  const loadDivisions = async () => {
    try {
      setLoading(true);
      const data = await divisionService.getAllDivisions();
      setDivisions(data);
      setFilteredDivisions(data);
    } catch (error) {
      console.error('Error loading divisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      head: '',
      isActive: true
    });
    setEditingDivision(null);
    setShowAddForm(false);
  };

  const handleEdit = (division: Division) => {
    setFormData({
      name: division.name,
      description: division.description || '',
      head: division.head || '',
      isActive: division.isActive
    });
    setEditingDivision(division);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Nama divisi harus diisi');
      return;
    }

    try {
      if (editingDivision) {
        // Update existing division
        await divisionService.updateDivision(editingDivision.id, formData);
        alert('✅ Divisi berhasil diupdate!');
      } else {
        // Add new division
        await divisionService.addDivision(formData);
        alert('✅ Divisi berhasil ditambahkan!');
      }
      
      resetForm();
      loadDivisions();
    } catch (error) {
      console.error('Error saving division:', error);
      alert('❌ Gagal menyimpan divisi');
    }
  };

  const handleDelete = async (division: Division) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus divisi "${division.name}"?`)) {
      return;
    }

    try {
      await divisionService.deleteDivision(division.id);
      alert('✅ Divisi berhasil dihapus!');
      loadDivisions();
    } catch (error) {
      console.error('Error deleting division:', error);
      alert('❌ Gagal menghapus divisi');
    }
  };

  const handleToggleStatus = async (division: Division) => {
    try {
      await divisionService.updateDivision(division.id, {
        isActive: !division.isActive
      });
      loadDivisions();
    } catch (error) {
      console.error('Error updating division status:', error);
      alert('❌ Gagal mengubah status divisi');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
  };

  const activeDivisions = divisions.filter(d => d.isActive);
  const inactiveDivisions = divisions.filter(d => !d.isActive);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading divisions...</p>
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
                    Setup Divisions
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Kelola divisi dan struktur organisasi perusahaan
                  </p>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Tambah Divisi
            </button>
              </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                  <BuildingOfficeIcon className="h-8 w-8 text-white" />
                </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Divisi</p>
                <p className="text-2xl font-semibold text-gray-900">{divisions.length}</p>
              </div>
            </div>
          </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                  <CheckCircleIcon className="h-8 w-8 text-white" />
                </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Divisi Aktif</p>
                <p className="text-2xl font-semibold text-gray-900">{activeDivisions.length}</p>
              </div>
            </div>
          </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="flex items-center">
                <div className="bg-gradient-to-r from-red-500 to-rose-500 p-3 rounded-xl">
                  <XCircleIcon className="h-8 w-8 text-white" />
                </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Divisi Nonaktif</p>
                <p className="text-2xl font-semibold text-gray-900">{inactiveDivisions.length}</p>
              </div>
            </div>
          </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Hasil Filter</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredDivisions.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🔍 Filter & Search</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama divisi, deskripsi, atau kepala divisi..."
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
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

        {/* Add/Edit Division Modal */}
        {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-md mx-4 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingDivision ? 'Edit Divisi' : 'Tambah Divisi Baru'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Divisi *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: Human Resources"
                    required
                  />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={3}
                    placeholder="Deskripsi divisi..."
                  />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kepala Divisi</label>
                  <input
                    type="text"
                    value={formData.head}
                    onChange={(e) => setFormData({...formData, head: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nama kepala divisi"
                  />
                </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                  />
                    <label htmlFor="isActive" className="text-sm text-gray-700">
                    Divisi aktif
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    {editingDivision ? 'Update' : 'Tambah'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Divisions Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 lg:px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                🏢 Daftar Divisi ({filteredDivisions.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Divisi
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deskripsi
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kepala Divisi
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDivisions.map((division) => (
                    <tr key={division.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {division.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {division.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {division.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {division.head || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(division)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          division.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {division.isActive ? (
                          <>
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-3 w-3 mr-1" />
                            Nonaktif
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(division)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit"
                        >
                            <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(division)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredDivisions.length === 0 && (
              <div className="text-center py-12">
                  <BuildingOfficeIcon className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No divisions found</h3>
                  <p className="mt-2 text-gray-500">
                  {searchTerm || filterStatus ? 'Try adjusting your filters' : 'Get started by creating a new division'}
                </p>
                {!searchTerm && !filterStatus && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Tambah Divisi
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Info Setup Divisi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <h4 className="font-semibold mb-3">Field Divisi:</h4>
                <ul className="space-y-2">
                  <li>• <strong>Nama Divisi:</strong> Masukkan nama divisi sesuai struktur organisasi</li>
                  <li>• <strong>Deskripsi:</strong> Jelaskan fungsi dan tanggung jawab divisi</li>
                  <li>• <strong>Kepala Divisi:</strong> Nama pemimpin atau manager divisi</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Penggunaan:</h4>
                <ul className="space-y-2">
                  <li>• <strong>Status:</strong> Klik untuk mengaktifkan/nonaktifkan divisi</li>
                  <li>• Divisi yang dibuat akan muncul saat menambah karyawan</li>
                  <li>• Divisi nonaktif tidak akan muncul di dropdown</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 