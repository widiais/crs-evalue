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
import { locationService, Location } from '@/services/locations';

export default function LocationsPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [searchHeadOffice, setSearchHeadOffice] = useState('');
  const [searchStore, setSearchStore] = useState('');
  
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
    return category === 'Head Office' ? 'text-blue-600' : 'text-green-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading locations...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Setup Work Location</h1>
                <p className="mt-2 text-gray-600">Kelola lokasi kerja dan kategori</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Tambah Lokasi
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MapPinIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Lokasi</p>
                <p className="text-2xl font-semibold text-gray-900">{locations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BuildingStorefrontIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Store</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {locations.filter(loc => loc.category === 'Store').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Head Office</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {locations.filter(loc => loc.category === 'Head Office').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingLocation ? 'Edit Lokasi' : 'Tambah Lokasi Baru'}
              </h3>
              
              <form onSubmit={handleAddLocation} className="space-y-4">
                <div>
                  <label className="form-label">Nama Lokasi</label>
                  <input
                    type="text"
                    value={locationForm.name}
                    onChange={(e) => setLocationForm({...locationForm, name: e.target.value})}
                    className="form-input"
                    placeholder="Contoh: LC Margahayu"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Contoh: LC Margahayu, Central Kitchen, Head Office Bandung
                  </p>
                </div>

                <div>
                  <label className="form-label">Kota</label>
                  <input
                    type="text"
                    value={locationForm.city}
                    onChange={(e) => setLocationForm({...locationForm, city: e.target.value})}
                    className="form-input"
                    placeholder="Contoh: Bandung"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Masukkan nama kota bebas
                  </p>
                </div>

                <div>
                  <label className="form-label">Kategori</label>
                  <select
                    value={locationForm.category}
                    onChange={(e) => setLocationForm({...locationForm, category: e.target.value as 'Head Office' | 'Store'})}
                    className="form-input"
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

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={locationForm.isActive}
                    onChange={(e) => setLocationForm({...locationForm, isActive: e.target.checked})}
                    className="mr-2"
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
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    disabled={submitting}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? 'Menyimpan...' : editingLocation ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Locations by Category with search inputs aligned with section headers */}
        <div className="space-y-8">
          {Object.entries(groupedLocations).map(([category, categoryLocations]) => {
            const IconComponent = getCategoryIcon(category);
            const term = category === 'Head Office' ? searchHeadOffice.trim().toLowerCase() : searchStore.trim().toLowerCase();
            const filteredList = term
              ? categoryLocations.filter(l =>
                  l.name.toLowerCase().includes(term) ||
                  l.city.toLowerCase().includes(term)
                )
              : categoryLocations;
            return (
              <div key={category} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between gap-4">
                    <IconComponent className={`h-6 w-6 mr-3 ${getCategoryColor(category)}`} />
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {category} ({filteredList.length} lokasi)
                    </h3>
                    <input
                      type="text"
                      value={category === 'Head Office' ? searchHeadOffice : searchStore}
                      onChange={(e) => category === 'Head Office' ? setSearchHeadOffice(e.target.value) : setSearchStore(e.target.value)}
                      className="w-64 border border-gray-300 rounded px-3 py-2 text-sm"
                      placeholder={category === 'Head Office' ? 'Cari Head Office...' : 'Cari Store...'}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama Lokasi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kota
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kategori
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
                      {filteredList.map((location) => (
                        <tr key={location.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{location.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{location.city}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                location.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {location.isActive ? 'Aktif' : 'Nonaktif'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditLocation(location)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => deleteLocation(location)}
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
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Informasi Setup Lokasi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Kategori Lokasi:</h4>
              <ul className="space-y-1">
                <li>• <strong>Head Office:</strong> Kantor pusat, dapur, gudang</li>
                <li>• <strong>Store:</strong> Outlet, toko, cabang</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Contoh Penamaan:</h4>
              <ul className="space-y-1">
                <li>• Store: LC Margahayu, LC Dago</li>
                <li>• Head Office: Central Kitchen, Warehouse</li>
                <li>• Kota bisa nama bebas: Bandung, Jakarta, dll</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 