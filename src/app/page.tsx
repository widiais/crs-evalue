"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { assessmentService } from '@/services/assessments';

export default function HomePage() {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [pin, setPin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('PIN tidak boleh kosong');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const assessment = await assessmentService.getAssessmentByPIN(pin.toUpperCase());
      if (!assessment) {
        setError('PIN tidak valid atau sudah tidak aktif');
        return;
      }
      router.push(`/pin/${pin.toUpperCase()}`);
    } catch (err) {
      console.error('Error validating PIN:', err);
      setError('Terjadi kesalahan saat validasi PIN');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-700">Mengarahkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border border-white transform rotate-45"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-white transform rotate-12"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-white transform -rotate-12"></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 border border-white transform rotate-45"></div>
        </div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12 translate-y-20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12 translate-y-40"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12 translate-y-60"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
          <div className="max-w-md w-full">
            <div className="relative">
              <div className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="bg-gray-800 w-32 h-20 rounded-lg shadow-lg relative">
                      <div className="bg-white w-28 h-16 rounded-md absolute top-2 left-2">
                        <div className="bg-blue-500 w-full h-4 rounded-t-md"></div>
                        <div className="p-2 space-y-1">
                          <div className="bg-gray-200 w-16 h-1 rounded"></div>
                          <div className="bg-gray-200 w-20 h-1 rounded"></div>
                          <div className="bg-gray-200 w-12 h-1 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -left-16 -top-8">
                      <div className="bg-amber-200 w-8 h-8 rounded-full"></div>
                      <div className="bg-green-400 w-10 h-12 rounded-lg mt-1 -ml-1"></div>
                      <div className="bg-green-400 w-12 h-3 rounded-full absolute top-8 -left-1"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-100 w-full h-4 rounded-b-xl"></div>
                <div className="absolute -right-4 -top-2">
                  <div className="bg-green-500 w-6 h-8 rounded-full"></div>
                  <div className="bg-green-400 w-4 h-6 rounded-full absolute top-2 left-1"></div>
                  <div className="bg-amber-700 w-2 h-4 absolute bottom-0 left-2"></div>
                </div>
              </div>
            </div>
            <div className="text-center mt-8 text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome to CRS</h2>
              <p className="text-blue-100">Competency Review System untuk evaluasi kinerja modern</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12 w-full max-w-md backdrop-blur-sm bg-opacity-95">
            {/* Greeting */}
            <div className="text-center mb-6 lg:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-3">
                Assalamualaikum {user?.name || user?.email}
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">Jabatan {user?.jobTitle || '-'}</p>
              <div className="mt-4">
                <button
                  onClick={() => logout()}
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              <div>
                <label htmlFor="pin" className="block text-sm font-semibold text-gray-700 mb-2">PIN Assessment</label>
                <input
                  id="pin"
                  name="pin"
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-mono tracking-wider text-center"
                  placeholder="Masukkan PIN"
                  maxLength={8}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {submitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Memvalidasi...
                  </div>
                ) : (
                  'Masuk Assessment'
                )}
              </button>
            </form>

            <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500 space-y-2 lg:space-y-3">
                <p>Tidak memiliki PIN assessment?</p>
                <p>Hubungi administrator untuk mendapatkan akses</p>
                <button
                  onClick={() => router.push('/admin/login')}
                  className="inline-block text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline"
                >
                  Masuk sebagai Administrator
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}