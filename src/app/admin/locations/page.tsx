'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPinIcon, 
  PlusIcon, 
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  DocumentArrowUpIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { LOCATION_CATEGORIES } from '@/constants';
import { locationService } from '@/services/locations';
import { Location } from '@/types';

// Excel import types
interface ExcelLocationData {
  'Nama Lokasi': string;
  'category': string;
  'kota': string;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

type SortField = 'name' | 'city' | 'isActive';
type SortDirection = 'asc' | 'desc';

export default function LocationsPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ExcelLocationData[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  
  // Store table features
  const [storeSearchTerm, setStoreSearchTerm] = useState('');
  const [storeSortField, setStoreSortField] = useState<SortField>('name');
  const [storeSortDirection, setStoreSortDirection] = useState<SortDirection>('asc');
  const [storeCurrentPage, setStoreCurrentPage] = useState(1);
  const storeItemsPerPage = 10;
  
  // Head Office table features
  const [headOfficeSearchTerm, setHeadOfficeSearchTerm] = useState('');
  const [headOfficeSortField, setHeadOfficeSortField] = useState<SortField>('name');
  const [headOfficeSortDirection, setHeadOfficeSortDirection] = useState<SortDirection>('asc');
  const [headOfficeCurrentPage, setHeadOfficeCurrentPage] = useState(1);
  const headOfficeItemsPerPage = 10;
  
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

  const resetImportModal = () => {
    setImportFile(null);
    setImportData([]);
    setImportResult(null);
    setShowImportModal(false);
  };

  // Handle Excel file selection and parsing
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    
    // Parse Excel file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // Import xlsx library dynamically
        import('xlsx').then((XLSX) => {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelLocationData[];
          
          // Validate data structure
          const validData = jsonData.filter(row => 
            row['Nama Lokasi'] && 
            row['category'] && 
            row['kota'] &&
            LOCATION_CATEGORIES.includes(row['category'] as any)
          );
          
          setImportData(validData);
        });
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('❌ Error parsing Excel file. Please check the file format.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // Import locations from Excel data
  const handleImportLocations = async () => {
    if (importData.length === 0) {
      alert('No valid data to import');
      return;
    }

    setImporting(true);
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: []
    };

    try {
      // Get existing location names to check for duplicates
      const existingNames = locations.map(loc => loc.name.toLowerCase());

      for (const row of importData) {
        try {
          // Check for duplicates
          if (existingNames.includes(row['Nama Lokasi'].toLowerCase())) {
            result.failed++;
            result.errors.push(`"${row['Nama Lokasi']}" already exists`);
            continue;
          }

          // Add location
          await locationService.addLocation({
            name: row['Nama Lokasi'].trim(),
            city: row['kota'].trim(),
            category: row['category'] as 'Head Office' | 'Store',
            isActive: true
          });

          result.success++;
          existingNames.push(row['Nama Lokasi'].toLowerCase()); // Add to existing names to prevent duplicates in the same import
        } catch (error) {
          result.failed++;
          result.errors.push(`Failed to import "${row['Nama Lokasi']}": ${error}`);
        }
      }

      setImportResult(result);
      loadLocations(); // Refresh the locations list
      
    } catch (error) {
      console.error('Error during bulk import:', error);
      alert('❌ Error during import process');
    } finally {
      setImporting(false);
    }
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

  // Store table sorting and filtering
  const handleStoreSort = (field: SortField) => {
    if (storeSortField === field) {
      setStoreSortDirection(storeSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setStoreSortField(field);
      setStoreSortDirection('asc');
    }
    setStoreCurrentPage(1); // Reset to first page when sorting
  };

  // Head Office table sorting and filtering
  const handleHeadOfficeSort = (field: SortField) => {
    if (headOfficeSortField === field) {
      setHeadOfficeSortDirection(headOfficeSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setHeadOfficeSortField(field);
      setHeadOfficeSortDirection('asc');
    }
    setHeadOfficeCurrentPage(1); // Reset to first page when sorting
  };

  // Filtered and sorted store locations
  const processedStoreLocations = useMemo(() => {
    const storeLocations = locations.filter(loc => loc.category === 'Store');
    
    // Filter by search term
    const filtered = storeLocations.filter(location =>
      location.name.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(storeSearchTerm.toLowerCase())
    );

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | boolean;
      let bValue: string | boolean;

      switch (storeSortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'city':
          aValue = a.city.toLowerCase();
          bValue = b.city.toLowerCase();
          break;
        case 'isActive':
          aValue = a.isActive;
          bValue = b.isActive;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return storeSortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return storeSortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [locations, storeSearchTerm, storeSortField, storeSortDirection]);

  // Filtered and sorted head office locations
  const processedHeadOfficeLocations = useMemo(() => {
    const headOfficeLocations = locations.filter(loc => loc.category === 'Head Office');
    
    // Filter by search term
    const filtered = headOfficeLocations.filter(location =>
      location.name.toLowerCase().includes(headOfficeSearchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(headOfficeSearchTerm.toLowerCase())
    );

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | boolean;
      let bValue: string | boolean;

      switch (headOfficeSortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'city':
          aValue = a.city.toLowerCase();
          bValue = b.city.toLowerCase();
          break;
        case 'isActive':
          aValue = a.isActive;
          bValue = b.isActive;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return headOfficeSortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return headOfficeSortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [locations, headOfficeSearchTerm, headOfficeSortField, headOfficeSortDirection]);

  // Paginated store locations
  const paginatedStoreLocations = useMemo(() => {
    const startIndex = (storeCurrentPage - 1) * storeItemsPerPage;
    return processedStoreLocations.slice(startIndex, startIndex + storeItemsPerPage);
  }, [processedStoreLocations, storeCurrentPage, storeItemsPerPage]);

  // Paginated head office locations
  const paginatedHeadOfficeLocations = useMemo(() => {
    const startIndex = (headOfficeCurrentPage - 1) * headOfficeItemsPerPage;
    return processedHeadOfficeLocations.slice(startIndex, startIndex + headOfficeItemsPerPage);
  }, [processedHeadOfficeLocations, headOfficeCurrentPage, headOfficeItemsPerPage]);

  const storeTotalPages = Math.ceil(processedStoreLocations.length / storeItemsPerPage);
  const headOfficeTotalPages = Math.ceil(processedHeadOfficeLocations.length / headOfficeItemsPerPage);

  // Group locations by category (excluding Store and Head Office for special handling)
  const groupedLocations = locations.reduce((acc, location) => {
    if (location.category !== 'Store' && location.category !== 'Head Office') {
      if (!acc[location.category]) {
        acc[location.category] = [];
      }
      acc[location.category].push(location);
    }
    return acc;
  }, {} as Record<string, Location[]>);

  const getCategoryIcon = (category: string) => {
    return category === 'Head Office' ? BuildingOfficeIcon : BuildingStorefrontIcon;
  };

  const getCategoryColor = (category: string) => {
    return category === 'Head Office' ? 'from-blue-500 to-cyan-500' : 'from-green-500 to-emerald-500';
  };

  const getStoreSortIcon = (field: SortField) => {
    if (storeSortField !== field) {
      return <ChevronUpIcon className="h-4 w-4 text-gray-400" />;
    }
    return storeSortDirection === 'asc' ? 
      <ChevronUpIcon className="h-4 w-4 text-green-600" /> : 
      <ChevronDownIcon className="h-4 w-4 text-green-600" />;
  };

  const getHeadOfficeSortIcon = (field: SortField) => {
    if (headOfficeSortField !== field) {
      return <ChevronUpIcon className="h-4 w-4 text-gray-400" />;
    }
    return headOfficeSortDirection === 'asc' ? 
      <ChevronUpIcon className="h-4 w-4 text-blue-600" /> : 
      <ChevronDownIcon className="h-4 w-4 text-blue-600" />;
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
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                Import Excel
              </button>
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

        {/* Import Excel Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Import Lokasi dari Excel</h3>
              
              {!importResult ? (
                <div className="space-y-6">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih File Excel
                    </label>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      File harus berformat .xlsx atau .xls
                    </p>
                  </div>

                  {/* Format Requirements */}
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-medium text-blue-900 mb-2">📋 Format Excel yang Diperlukan:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• <strong>Kolom A:</strong> Nama Lokasi (contoh: LC Ahmad Yani)</p>
                      <p>• <strong>Kolom B:</strong> category (Store atau Head Office)</p>
                      <p>• <strong>Kolom C:</strong> kota (contoh: Bandung)</p>
                      <p>• Baris pertama harus berisi header kolom</p>
                    </div>
                  </div>

                  {/* Preview Import Data */}
                  {importData.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Preview Data ({importData.length} lokasi)
                      </h4>
                      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Nama Lokasi
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Kategori
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Kota
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {importData.slice(0, 10).map((row, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-900">{row['Nama Lokasi']}</td>
                                <td className="px-4 py-2 text-sm">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    row['category'] === 'Head Office' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {row['category']}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900">{row['kota']}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {importData.length > 10 && (
                          <div className="p-2 text-center text-sm text-gray-500 bg-gray-50">
                            ... dan {importData.length - 10} data lainnya
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetImportModal}
                      className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                      disabled={importing}
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleImportLocations}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 shadow-lg"
                      disabled={importing || importData.length === 0}
                    >
                      {importing ? 'Mengimpor...' : `Import ${importData.length} Lokasi`}
                    </button>
                  </div>
                </div>
              ) : (
                /* Import Results */
                <div className="space-y-6">
                  <div className="text-center">
                    {importResult.success > 0 ? (
                      <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    ) : (
                      <ExclamationCircleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    )}
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Import Selesai</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-xl text-center">
                      <p className="text-2xl font-bold text-green-600">{importResult.success}</p>
                      <p className="text-sm text-green-800">Berhasil diimpor</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl text-center">
                      <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
                      <p className="text-sm text-red-800">Gagal diimpor</p>
                    </div>
                  </div>

                  {importResult.errors.length > 0 && (
                    <div>
                      <h5 className="font-medium text-red-900 mb-2">Error Details:</h5>
                      <div className="max-h-40 overflow-y-auto bg-red-50 p-3 rounded-xl">
                        {importResult.errors.map((error, index) => (
                          <p key={index} className="text-sm text-red-800 mb-1">• {error}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={resetImportModal}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Selesai
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Locations by Category */}
        <div className="space-y-8">
          {/* Store Category with Enhanced Features */}
          {locations.filter(loc => loc.category === 'Store').length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 lg:px-8 py-6 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                      <BuildingStorefrontIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 ml-4">
                      Store ({processedStoreLocations.length} lokasi)
                    </h3>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari lokasi atau kota..."
                      value={storeSearchTerm}
                      onChange={(e) => {
                        setStoreSearchTerm(e.target.value);
                        setStoreCurrentPage(1); // Reset to first page when searching
                      }}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleStoreSort('name')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Nama Lokasi</span>
                          {getStoreSortIcon('name')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleStoreSort('city')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Kota</span>
                          {getStoreSortIcon('city')}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleStoreSort('isActive')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Status</span>
                          {getStoreSortIcon('isActive')}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedStoreLocations.map((location) => (
                      <tr key={location.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{location.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-900">{location.city}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Store
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
                
                {/* No results message */}
                {paginatedStoreLocations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {storeSearchTerm ? 'Tidak ada lokasi yang sesuai dengan pencarian' : 'Belum ada data store'}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {storeTotalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Menampilkan {((storeCurrentPage - 1) * storeItemsPerPage) + 1} - {Math.min(storeCurrentPage * storeItemsPerPage, processedStoreLocations.length)} dari {processedStoreLocations.length} lokasi
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setStoreCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={storeCurrentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </button>
                      
                      <div className="flex space-x-1">
                        {Array.from({ length: storeTotalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setStoreCurrentPage(page)}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                              page === storeCurrentPage
                                ? 'bg-green-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => setStoreCurrentPage(prev => Math.min(prev + 1, storeTotalPages))}
                        disabled={storeCurrentPage === storeTotalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Head Office Category with Enhanced Features */}
          {locations.filter(loc => loc.category === 'Head Office').length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 lg:px-8 py-6 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                      <BuildingOfficeIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 ml-4">
                      Head Office ({processedHeadOfficeLocations.length} lokasi)
                    </h3>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari lokasi atau kota..."
                      value={headOfficeSearchTerm}
                      onChange={(e) => {
                        setHeadOfficeSearchTerm(e.target.value);
                        setHeadOfficeCurrentPage(1); // Reset to first page when searching
                      }}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleHeadOfficeSort('name')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Nama Lokasi</span>
                          {getHeadOfficeSortIcon('name')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleHeadOfficeSort('city')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Kota</span>
                          {getHeadOfficeSortIcon('city')}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleHeadOfficeSort('isActive')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Status</span>
                          {getHeadOfficeSortIcon('isActive')}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedHeadOfficeLocations.map((location) => (
                      <tr key={location.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{location.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-900">{location.city}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Head Office
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
                
                {/* No results message */}
                {paginatedHeadOfficeLocations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {headOfficeSearchTerm ? 'Tidak ada lokasi yang sesuai dengan pencarian' : 'Belum ada data head office'}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {headOfficeTotalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Menampilkan {((headOfficeCurrentPage - 1) * headOfficeItemsPerPage) + 1} - {Math.min(headOfficeCurrentPage * headOfficeItemsPerPage, processedHeadOfficeLocations.length)} dari {processedHeadOfficeLocations.length} lokasi
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setHeadOfficeCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={headOfficeCurrentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </button>
                      
                      <div className="flex space-x-1">
                        {Array.from({ length: headOfficeTotalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setHeadOfficeCurrentPage(page)}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                              page === headOfficeCurrentPage
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => setHeadOfficeCurrentPage(prev => Math.min(prev + 1, headOfficeTotalPages))}
                        disabled={headOfficeCurrentPage === headOfficeTotalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Other Categories (excluding Store and Head Office) */}
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