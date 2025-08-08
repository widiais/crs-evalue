'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ClipboardDocumentListIcon, 
  Cog6ToothIcon,
  CloudIcon,
  PlayIcon,
  MapPinIcon,
  DocumentChartBarIcon,
  UsersIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { assessmentService } from '@/services/assessments';
import { employeeService } from '@/services/employees';
import { seedInitialData, testFirebaseConnection } from '@/utils/seedData';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalAssessments: 0,
    totalEmployees: 0,
    totalResults: 0
  });
  const [firebaseStatus, setFirebaseStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');

  useEffect(() => {
    loadStats();
    checkFirebaseConnection();
  }, []);

  const loadStats = async () => {
    try {
      const [assessments, employees] = await Promise.all([
        assessmentService.getAllAssessments(),
        employeeService.getAllEmployees()
      ]);

      setStats({
        totalAssessments: assessments.length,
        totalEmployees: employees.length,
        totalResults: 0 // TODO: implement assessment results count
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const checkFirebaseConnection = async () => {
    const connected = await testFirebaseConnection();
    setFirebaseStatus(connected ? 'connected' : 'error');
  };

  const handleSeedData = async () => {
    setLoading(true);
    try {
      await seedInitialData();
      await loadStats(); // Refresh stats
      alert('✅ Data berhasil di-seed ke Firebase!');
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('❌ Gagal seeding data: ' + error);
    } finally {
      setLoading(false);
    }
  };

  // Setup Menu Items
  const setupMenuItems = [
    {
      title: 'Setup Employees',
      description: 'Kelola data karyawan dan struktur organisasi',
      icon: UserGroupIcon,
      href: '/admin/employees',
      color: 'bg-green-500'
    },
    {
      title: 'Setup Divisions',
      description: 'Kelola divisi dan struktur organisasi perusahaan',
      icon: BuildingOfficeIcon,
      href: '/admin/divisions',
      color: 'bg-indigo-500'
    },
    {
      title: 'Setup Assessment Templates',
      description: 'Buat pertanyaan assessment per role/jabatan',
      icon: DocumentChartBarIcon,
      href: '/admin/templates',
      color: 'bg-purple-500'
    },
    {
      title: 'Setup Assessments',
      description: 'Generate PIN dan assign template berdasarkan jobdesk',
      icon: ClipboardDocumentListIcon,
      href: '/admin/assessments',
      color: 'bg-blue-500'
    },
    {
      title: 'Setup Work Location',
      description: 'Kelola lokasi kerja dan regional',
      icon: MapPinIcon,
      href: '/admin/locations',
      color: 'bg-orange-500'
    }
  ];

  // Reports Menu Items
  const reportMenuItems = [
    {
      title: 'Report Personal',
      description: 'Laporan detail per individu',
      icon: DocumentChartBarIcon,
      href: '/admin/reports/personal',
      color: 'bg-purple-500'
    },
    {
      title: 'Report Location',
      description: 'Laporan per lokasi kerja',
      icon: MapPinIcon,
      href: '/admin/reports/location',
      color: 'bg-teal-500'
    },
    {
      title: 'Report Division',
      description: 'Laporan per divisi',
      icon: BuildingOfficeIcon,
      href: '/admin/reports/division',
      color: 'bg-indigo-500'
    },
    {
      title: 'Report Role',
      description: 'Laporan per jabatan',
      icon: UsersIcon,
      href: '/admin/reports/role',
      color: 'bg-pink-500'
    }
  ];

  // System Menu Items
  const systemMenuItems = [
    {
      title: 'Pengaturan Sistem',
      description: 'Konfigurasi umum dan template',
      icon: Cog6ToothIcon,
      href: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Kelola sistem CRS (Competency Review System)
              </p>
            </div>
            
            {/* Right header: Firebase status + Logout */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <CloudIcon className={`h-5 w-5 ${
                  firebaseStatus === 'connected' ? 'text-green-500' : 
                  firebaseStatus === 'error' ? 'text-red-500' : 'text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  firebaseStatus === 'connected' ? 'text-green-700' : 
                  firebaseStatus === 'error' ? 'text-red-700' : 'text-gray-500'
                }`}>
                  {firebaseStatus === 'connected' ? 'Firebase Connected' : 
                   firebaseStatus === 'error' ? 'Firebase Error' : 'Checking...'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Selamat datang, {user?.name || user?.email}
                </span>
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentListIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Assessment</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalAssessments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Karyawan</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalEmployees}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Hasil</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalResults}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CloudIcon className={`h-8 w-8 ${
                  firebaseStatus === 'connected' ? 'text-green-500' : 'text-red-500'
                }`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Firebase Status</p>
                <p className={`text-sm font-semibold ${
                  firebaseStatus === 'connected' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {firebaseStatus === 'connected' ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
        </div>
    
        {/* Setup Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔧 Setup & Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {setupMenuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => router.push(item.href)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className={`${item.color} p-3 rounded-full`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Reports Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Reports & Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reportMenuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => router.push(item.href)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className={`${item.color} p-3 rounded-full`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* System Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">⚙️ System Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {systemMenuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => router.push(item.href)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className={`${item.color} p-3 rounded-full`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/admin/assessments')}
              className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <h3 className="font-medium text-gray-900">Buat Assessment Baru</h3>
              <p className="text-sm text-gray-500">Mulai sesi assessment baru</p>
            </button>
            
            <button
              onClick={() => router.push('/admin/employees')}
              className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <h3 className="font-medium text-gray-900">Tambah Karyawan</h3>
              <p className="text-sm text-gray-500">Input data karyawan baru</p>
            </button>
            
            <button
              onClick={() => router.push('/admin/reports/personal')}
              className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <h3 className="font-medium text-gray-900">Lihat Laporan</h3>
              <p className="text-sm text-gray-500">Analisis hasil assessment</p>
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <h3 className="font-medium text-gray-900"> ke Homepage</h3>
              <p className="text-sm text-gray-500">Ke halaman utama aplikasi</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}