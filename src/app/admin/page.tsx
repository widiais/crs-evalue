'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ClipboardDocumentListIcon, 
  Cog6ToothIcon,
  CloudIcon,
  MapPinIcon,
  DocumentChartBarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { assessmentService } from '@/services/assessments';
import { employeeService } from '@/services/employees';

export default function AdminDashboard() {
  const router = useRouter();
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
    try {
      // Simple check by trying to get data
      await employeeService.getAllEmployees();
      setFirebaseStatus('connected');
    } catch (error) {
      console.error('Firebase connection failed:', error);
      setFirebaseStatus('error');
    }
  };

  // Setup Menu Items
  const setupMenuItems = [
    {
      title: 'Setup Employees',
      description: 'Kelola data karyawan dan struktur organisasi',
      icon: UserGroupIcon,
      href: '/admin/employees',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      title: 'Setup Divisions',
      description: 'Kelola divisi dan struktur organisasi perusahaan',
      icon: BuildingOfficeIcon,
      href: '/admin/divisions',
      gradient: 'from-indigo-500 to-blue-600'
    },
    {
      title: 'Setup Assessment Templates',
      description: 'Buat pertanyaan assessment per role/jabatan',
      icon: DocumentChartBarIcon,
      href: '/admin/templates',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Setup Assessments',
      description: 'Generate PIN dan assign template berdasarkan jobdesk',
      icon: ClipboardDocumentListIcon,
      href: '/admin/assessments',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Setup Work Location',
      description: 'Kelola lokasi kerja dan regional',
      icon: MapPinIcon,
      href: '/admin/locations',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  // Reports Menu Items
  const reportMenuItems = [
    {
      title: 'Report Personal',
      description: 'Laporan detail per individu',
      icon: DocumentChartBarIcon,
      href: '/admin/reports/personal',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      title: 'Report Division',
      description: 'Laporan per divisi',
      icon: BuildingOfficeIcon,
      href: '/admin/reports/division',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      title: 'Report Role',
      description: 'Laporan per jabatan',
      icon: UsersIcon,
      href: '/admin/reports/role',
      gradient: 'from-pink-500 to-rose-600'
    }
  ];

  // System Menu Items
  const systemMenuItems = [
    {
      title: 'Pengaturan Sistem',
      description: 'Konfigurasi umum dan template',
      icon: Cog6ToothIcon,
      href: '/admin/settings',
      gradient: 'from-gray-500 to-slate-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 relative overflow-hidden">
      {/* Background Geometric Shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 border border-white transform rotate-45"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-white transform rotate-12"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-white transform -rotate-12"></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 border border-white transform rotate-45"></div>
          <div className="absolute top-1/2 left-10 w-20 h-20 border border-white transform rotate-45"></div>
          <div className="absolute top-32 right-1/3 w-36 h-36 border border-white transform -rotate-12"></div>
        </div>
        
        {/* Gradient Overlay Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12 translate-y-20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12 translate-y-60"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12 translate-y-100"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-4 lg:mb-0">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Kelola sistem CRS (Competency Review System)
                  </p>
                </div>
                
                {/* Firebase Status & Home Button */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push('/')}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <HomeIcon className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Home</span>
                  </button>
                  
                  <div className="flex items-center space-x-3 bg-gray-100 rounded-xl px-4 py-2">
                    <CloudIcon className={`h-5 w-5 ${
                      firebaseStatus === 'connected' ? 'text-green-600' : 
                      firebaseStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      firebaseStatus === 'connected' ? 'text-green-700' : 
                      firebaseStatus === 'error' ? 'text-red-700' : 'text-yellow-700'
                    }`}>
                      {firebaseStatus === 'connected' ? 'Firebase Connected' : 
                       firebaseStatus === 'error' ? 'Firebase Error' : 'Checking...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                    <ClipboardDocumentListIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Assessment</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAssessments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-3 rounded-xl">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Karyawan</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                    <ChartBarIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Hasil</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalResults}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${
                    firebaseStatus === 'connected' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500'
                  }`}>
                    <CloudIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Firebase Status</p>
                  <p className="text-sm font-bold text-gray-900">
                    {firebaseStatus === 'connected' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Setup Section */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">🔧</span>
                Setup & Configuration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {setupMenuItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => router.push(item.href)}
                    className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-6 cursor-pointer transition-all duration-200 transform hover:scale-105 border border-gray-200 hover:border-gray-300 group shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className={`bg-gradient-to-r ${item.gradient} p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-200`}>
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 text-center mb-2 group-hover:text-gray-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-center text-sm group-hover:text-gray-800 transition-colors">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reports Section */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">📊</span>
                Reports & Analytics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reportMenuItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => router.push(item.href)}
                    className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-6 cursor-pointer transition-all duration-200 transform hover:scale-105 border border-gray-200 hover:border-gray-300 group shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className={`bg-gradient-to-r ${item.gradient} p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-200`}>
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 text-center mb-2 group-hover:text-gray-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-center text-sm group-hover:text-gray-800 transition-colors">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Section */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">⚙️</span>
                System Management
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {systemMenuItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => router.push(item.href)}
                    className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-6 cursor-pointer transition-all duration-200 transform hover:scale-105 border border-gray-200 hover:border-gray-300 group shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className={`bg-gradient-to-r ${item.gradient} p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-200`}>
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 text-center mb-2 group-hover:text-gray-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-center text-sm group-hover:text-gray-800 transition-colors">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">⚡ Quick Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => router.push('/admin/assessments')}
                className="text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 group transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">Buat Assessment Baru</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Mulai sesi assessment baru</p>
              </button>
              
              <button
                onClick={() => router.push('/admin/employees')}
                className="text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 group transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">Tambah Karyawan</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Input data karyawan baru</p>
              </button>
              
              <button
                onClick={() => router.push('/admin/reports/personal')}
                className="text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 group transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">Lihat Laporan</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Analisis hasil assessment</p>
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 group transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">Kembali ke Homepage</h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Ke halaman utama aplikasi</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 