'use client';

import { useParams, useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function SuccessPage() {
  const params = useParams();
  const router = useRouter();
  const pin = params.pin as string;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Penilaian Berhasil Disimpan!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Terima kasih telah mengisi formulir penilaian. Data Anda telah berhasil disimpan dalam sistem.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push(`/pin/${pin}`)}
              className="w-full btn-primary"
            >
              Isi Penilaian Lain
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full btn-secondary"
            >
               ke Halaman Utama
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 