'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LockClosedIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  HomeIcon,
  UserIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, loading: isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Username dan password harus diisi');
      return;
    }

    try {
      setIsSigningIn(true);
      setError(null);
      
      await loginAdmin(formData.username, formData.password);
      
      // Redirect to admin dashboard after successful login
      router.push('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message.includes('Invalid username or password')) {
        setError('❌ Username atau password salah!');
      } else {
        setError('❌ Terjadi kesalahan saat login. Silakan coba lagi.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white transform rotate-45"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-white transform rotate-12"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-white transform -rotate-12"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 border border-white transform rotate-45"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back to Home Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-white/80 hover:text-white mb-8 transition-colors group"
        >
          <HomeIcon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
          <span>Kembali ke Beranda</span>
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <LockClosedIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600">
              Masuk dengan username dan password admin
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || isSigningIn}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSigningIn ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 mr-3 animate-spin" />
                  Sedang masuk...
                </>
              ) : (
                <>
                  <LockClosedIcon className="h-5 w-5 mr-3" />
                  Masuk
                </>
              )}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">ℹ️ Informasi Login</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Gunakan username dan password yang telah diberikan</li>
              <li>• Pastikan credentials Anda benar</li>
              <li>• Hubungi administrator jika lupa password</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              CRS Admin Panel © 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 