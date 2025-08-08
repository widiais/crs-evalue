'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAuth() as any;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await loginAdmin(username, password);
    setLoading(false);
    if (res.success) {
      router.replace('/admin');
    } else {
      setError(res.message || 'Gagal login admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-semibold mb-4">Login Admin</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}


