'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentService } from '@/services/assessments';

export default function HomePage() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('PIN tidak boleh kosong');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const assessment = await assessmentService.getAssessmentByPIN(pin.toUpperCase());
      
      if (!assessment) {
        setError('PIN tidak valid atau sudah tidak aktif');
        return;
      }

      // Redirect to assessment form
      router.push(`/pin/${pin.toUpperCase()}`);
    } catch (err) {
      console.error('Error validating PIN:', err);
      setError('Terjadi kesalahan saat validasi PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CRS - Competency Review System
          </h1>
          <p className="text-gray-600">
            Masukkan PIN untuk mengakses formulir penilaian
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="pin" className="form-label">
              PIN Assessment
            </label>
            <input
              id="pin"
              name="pin"
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value.toUpperCase())}
              className="form-input"
              placeholder="Masukkan PIN (6 karakter)"
              maxLength={8}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Memvalidasi...' : 'Masuk Assessment'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>Hubungi administrator jika Anda tidak memiliki PIN</p>
          <button
            onClick={() => router.push('/admin')}
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Masuk sebagai Admin
          </button>
        </div>
      </div>
    </div>
  );
} 