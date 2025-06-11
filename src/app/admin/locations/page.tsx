'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPinIcon, 
  PlusIcon, 
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { LOCATION_CATEGORIES } from '@/constants';
import { locationService } from '@/services/locations';
import { Location } from '@/types';

export default function LocationsPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  
  // Form state for new/edit location
  const [locationForm, setLocationForm] = useState({
    name: '',
    city: '',
    category: 'Store' as 'Head Office' | 'Store',
    isActive: true
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await locationService.getAllLocations();
      setLocations(data);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLocationForm({
      name: '',
      city: '',
      category: 'Store',
      isActive: true
    });
    setEditingLocation(null);
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!locationForm.name.trim() || !locationForm.city.trim() || !locationForm.category) {
      alert('Semua field harus diisi');
      return;
    }

    // Check if location name already exists (only for add, not edit)
    if (!editingLocation && locations.some(loc => loc.name.toLowerCase() === locationForm.name.toLowerCase())) {
      alert('Nama lokasi sudah digunakan');
      return;
    }

    setSubmitting(true);
    try {
      if (editingLocation) {
        // Update existing location
        await locationService.updateLocation(editingLocation.id, {
          name: locationForm.name.trim(),
          city: locationForm.city.trim(),
          category: locationForm.category,
          isActive: locationForm.isActive
        });
        alert('✅ Lokasi berhasil diperbarui!');
      } else {
        // Add new location
        await locationService.addLocation({
          name: locationForm.name.trim(),
          city: locationForm.city.trim(),
          category: locationForm.category,
          isActive: locationForm.isActive
        });
        alert('✅ Lokasi berhasil ditambahkan!');
      }
      
      resetForm();
      setShowAddForm(false);
      loadLocations(); // Refresh list
    } catch (error) {
      console.error('Error saving location:', error);
      alert('❌ Gagal menyimpan lokasi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditLocation = (location: Location) => {
    setLocationForm({
      name: location.name,
      city: location.city,
      category: location.category,
      isActive: location.isActive
    });
    setEditingLocation(location);
    setShowAddForm(true);
  };

  const toggleLocationStatus = async (location: Location) => {
    try {
      await locationService.updateLocation(location.id, {
        isActive: !location.isActive
      });
      loadLocations(); // Refresh list
    } catch (error) {
      console.error('Error toggling location status:', error);
      alert('❌ Gagal mengubah status lokasi');
    }
  };

  const deleteLocation = async (location: Location) => {
    if (!confirm(`Yakin ingin menghapus lokasi "${location.name}"?`)) {
      return;
    }

    try {
      await locationService.deleteLocation(location.id);
      alert('✅ Lokasi berhasil dihapus!');
      loadLocations(); // Refresh list
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('❌ Gagal menghapus lokasi');
    }
  };

  // Group locations by category
  const groupedLocations = locations.reduce((acc, location) => {
    if (!acc[location.category]) {
      acc[location.category] = [];
    }
    acc[location.category].push(location);
    return acc;
  }, {} as Record<string, Location[]>);

  const getCategoryIcon = (category: string) => {
    return category === 'Head Office' ? BuildingOfficeIcon : BuildingStorefrontIcon;
  };

  const getCategoryColor = (category: string) => {
    return category === 'Head Office' ? 'from-blue-500 to-cyan-500' : 'from-green-500 to-emerald-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading locations...</p>
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
                    Setup Work Location
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Kelola lokasi kerja dan kategori
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    resetForm();
                    setShowAddForm(true);
                  }}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Tambah Lokasi
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                  <MapPinIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Lokasi</p>
                  <p className="text-2xl font-semibold text-gray-900">{locations.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                  <BuildingStorefrontIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Store</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {locations.filter(loc => loc.category === 'Store').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-3 rounded-xl">
                  <BuildingOfficeIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Head Office</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {locations.filter(loc => loc.category === 'Head Office').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Lokasi Aktif</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {locations.filter(loc => loc.isActive).length}
                </p>
              </div>
            </div>
          </div>

          {/* Add/Edit Location Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-md mx-4 shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingLocation ? 'Edit Lokasi' : 'Tambah Lokasi Baru'}
                </h3>
                
                <form onSubmit={handleAddLocation} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lokasi</label>
                    <input
                      type="text"
                      value={locationForm.name}
                      onChange={(e) => setLocationForm({...locationForm, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Contoh: LC Margahayu"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Contoh: LC Margahayu, Central Kitchen, Head Office Bandung
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kota</label>
                    <input
                      type="text"
                      value={locationForm.city}
                      onChange={(e) => setLocationForm({...locationForm, city: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Contoh: Bandung"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Masukkan nama kota bebas
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <select
                      value={locationForm.category}
                      onChange={(e) => setLocationForm({...locationForm, category: e.target.value as 'Head Office' | 'Store'})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      {LOCATION_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Head Office: Kantor pusat, dapur, gudang | Store: Outlet, toko
                    </p>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <input
                      type="checkbox"
                      checked={locationForm.isActive}
                      onChange={(e) => setLocationForm({...locationForm, isActive: e.target.checked})}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                    />
                    <label className="text-sm text-gray-700">Lokasi aktif</label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        resetForm();
                      }}
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
                      {submitting ? 'Menyimpan...' : editingLocation ? 'Update' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Locations by Category */}
          <div className="space-y-8">
            {Object.entries(groupedLocations).map(([category, categoryLocations]) => {
              const IconComponent = getCategoryIcon(category);
              const gradientColor = getCategoryColor(category);
              return (
                <div key={category} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="px-6 lg:px-8 py-6 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className={`bg-gradient-to-r ${gradientColor} p-3 rounded-xl`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 ml-4">
                        {category} ({categoryLocations.length} lokasi)
                      </h3>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nama Lokasi
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kota
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kategori
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
                        {categoryLocations.map((location) => (
                          <tr key={location.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{location.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-gray-900">{location.city}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                location.category === 'Head Office' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {location.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleLocationStatus(location)}
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                  location.isActive 
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                              >
                                {location.isActive ? 'Aktif' : 'Nonaktif'}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-3">
                                <button 
                                  onClick={() => handleEditLocation(location)}
                                  className="text-blue-600 hover:text-blue-900 transition-colors"
                                  title="Edit"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button 
                                  onClick={() => deleteLocation(location)}
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
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Informasi Setup Lokasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
              <div>
                <h4 className="font-semibold mb-3">Kategori Lokasi:</h4>
                <ul className="space-y-2">
                  <li>• <strong>Head Office:</strong> Kantor pusat, dapur, gudang</li>
                  <li>• <strong>Store:</strong> Outlet, toko, cabang</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Contoh Penamaan:</h4>
                <ul className="space-y-2">
                  <li>• Store: LC Margahayu, LC Dago</li>
                  <li>• Head Office: Central Kitchen, Warehouse</li>
                  <li>• Kota bisa nama bebas: Bandung, Jakarta, dll</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 