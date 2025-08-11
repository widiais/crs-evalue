'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowPathIcon,
  LockClosedIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading: isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login if not authenticated
      router.push('/admin/login');
    }
  }, [user, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // We don't have role-based authorization yet; only check authentication
  if (user && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Akses Ditolak
            </h1>
            
            <p className="text-gray-600 mb-6">
              Anda belum memiliki izin untuk mengakses panel ini.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admin/login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors"
              >
                Kembali ke Login
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl transition-colors"
              >
                Kembali ke Beranda
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
              <p className="text-sm text-yellow-800">
                <strong>Butuh akses admin?</strong><br />
                Hubungi administrator sistem untuk mendapatkan izin akses.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show unauthorized message if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <LockClosedIcon className="h-8 w-8 text-blue-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Login Diperlukan
            </h1>
            
            <p className="text-gray-600 mb-6">
              Anda perlu login terlebih dahulu untuk mengakses panel admin.
            </p>
            
            <button
              onClick={() => router.push('/admin/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors"
            >
              Login Sekarang
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render children if user is authenticated and authorized
  return <>{children}</>;
} 