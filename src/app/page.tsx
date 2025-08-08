'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const router = useRouter();
  const [pin, setPin] = useState('');

  console.log('HomePage - Auth state:', { isAuthenticated, loading, user: !!user });

  useEffect(() => {
    console.log('HomePage useEffect - checking auth:', { loading, isAuthenticated });
    
    // HANYA redirect jika loading sudah selesai DAN user TIDAK authenticated
    if (!loading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login...');
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    console.log('HomePage - showing loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    console.log('HomePage - not authenticated, showing redirect message...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  console.log('HomePage - rendering dashboard...');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Assalamualaikum, {user?.name ? `User ${user.name}` : 'User'}
              </h1>
              <p className="text-gray-700 mb-6">
                Email {user?.email || '-'} jabatan {user?.jobTitle || '-'}
              </p>

              {/* PIN Section */}
              <div className="bg-white rounded-lg shadow p-6 mb-6 max-w-lg mx-auto text-left">
                <p className="mb-4">silahkan masukan 6 karakter PIN (huruf/angka) yang didapatkan dari HCD untuk mulai Assessment</p>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 6))}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan 6 digit PIN"
                  />
                  <button
                    onClick={() => {
                      if (pin.length === 6) router.push(`/pin/${pin}`);
                    }}
                    disabled={pin.length !== 6}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Admin login link */}
              <div className="mt-6 text-sm text-gray-600">
                <p>
                  atau{' '}
                  <Link href="/admin/login" className="text-blue-600 hover:underline">
                    login sebagai admin
                  </Link>
                </p>
              </div>

              {/* Logout button */}
              <div className="mt-6">
                <button
                  onClick={() => logout()}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}