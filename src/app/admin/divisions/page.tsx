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
import { divisionService, Division } from '@/services/divisions';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading divisions...</p>
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
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Setup Divisions</h1>
                <p className="mt-2 text-gray-600">Kelola divisi dan struktur organisasi perusahaan</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Tambah Divisi
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Divisi</p>
                <p className="text-2xl font-semibold text-gray-900">{divisions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Divisi Aktif</p>
                <p className="text-2xl font-semibold text-gray-900">{activeDivisions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircleIcon className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Divisi Nonaktif</p>
                <p className="text-2xl font-semibold text-gray-900">{inactiveDivisions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Hasil Filter</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredDivisions.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter & Search</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama divisi, deskripsi, atau kepala divisi..."
                  className="pl-10 form-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input"
              >
                <option value="">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
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

        {/* Add/Edit Division Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingDivision ? 'Edit Divisi' : 'Tambah Divisi Baru'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Nama Divisi *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="form-input"
                    placeholder="Contoh: Human Resources"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="form-input"
                    rows={3}
                    placeholder="Deskripsi divisi..."
                  />
                </div>

                <div>
                  <label className="form-label">Kepala Divisi</label>
                  <input
                    type="text"
                    value={formData.head}
                    onChange={(e) => setFormData({...formData, head: e.target.value})}
                    className="form-input"
                    placeholder="Nama kepala divisi"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Divisi aktif
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    {editingDivision ? 'Update' : 'Tambah'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Divisions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Daftar Divisi ({filteredDivisions.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Divisi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kepala Divisi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDivisions.map((division) => (
                  <tr key={division.id} className="hover:bg-gray-50">
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
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(division)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(division)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredDivisions.length === 0 && (
              <div className="text-center py-12">
                <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No divisions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus ? 'Try adjusting your filters' : 'Get started by creating a new division'}
                </p>
                {!searchTerm && !filterStatus && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Info Setup Divisi</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• <strong>Nama Divisi:</strong> Masukkan nama divisi sesuai struktur organisasi perusahaan</p>
            <p>• <strong>Deskripsi:</strong> Jelaskan fungsi dan tanggung jawab divisi (opsional)</p>
            <p>• <strong>Kepala Divisi:</strong> Nama pemimpin atau manager divisi (opsional)</p>
            <p>• <strong>Status:</strong> Klik untuk mengaktifkan/nonaktifkan divisi</p>
            <p>• Divisi yang sudah dibuat akan muncul sebagai pilihan dropdown saat menambah karyawan</p>
          </div>
        </div>
      </div>
    </div>
  );
} 