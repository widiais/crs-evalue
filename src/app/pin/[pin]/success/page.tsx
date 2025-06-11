'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  CheckCircleIcon, 
  UserIcon, 
  IdentificationIcon,
  HomeIcon,
  DocumentCheckIcon 
} from '@heroicons/react/24/solid';
import { employeeService } from '@/services/employees';
import { Employee, Evaluator } from '@/types';

export default function SuccessPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pin = params.pin as string;
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [evaluator, setEvaluator] = useState<Evaluator | null>(null);
  const [loading, setLoading] = useState(true);

  // Get data from URL params
  const employeeId = searchParams.get('employee');
  const evaluatorData = searchParams.get('evaluator');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load employee data
        if (employeeId) {
          const allEmployees = await employeeService.getAllEmployees();
          const emp = allEmployees.find(e => e.id === employeeId);
          if (emp) {
            setEmployee(emp);
          }
        }
        
        // Parse evaluator data
        if (evaluatorData) {
          try {
            const evaluatorInfo = JSON.parse(decodeURIComponent(evaluatorData));
            setEvaluator(evaluatorInfo);
          } catch (e) {
            console.error('Error parsing evaluator data:', e);
          }
        }
      } catch (error) {
        console.error('Error loading success page data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [employeeId, evaluatorData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
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
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-6 px-4">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 text-center">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Penilaian Berhasil Disimpan!
            </h1>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Terima kasih telah mengisi formulir penilaian. Data Anda telah berhasil disimpan dalam sistem.
            </p>

            {/* Assessment Summary */}
            {(employee || evaluator) && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
                  <DocumentCheckIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Ringkasan Assessment
                </h2>
                
                <div className="space-y-4">
                  {employee && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center mb-2">
                        <UserIcon className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium text-green-800">Target Assessment</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{employee.name}</p>
                      <p className="text-sm text-gray-600">{employee.position} • {employee.location}</p>
                      <p className="text-sm text-gray-600">{employee.division}</p>
                    </div>
                  )}
                  
                  {evaluator && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center mb-2">
                        <IdentificationIcon className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="font-medium text-purple-800">Evaluator</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{evaluator.name}</p>
                      <p className="text-sm text-gray-600">{evaluator.position} • {evaluator.division}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/pin/${pin}`)}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <DocumentCheckIcon className="h-5 w-5 mr-2" />
                Isi Penilaian Lain
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full flex items-center justify-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                Kembali ke Halaman Utama
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                PIN Assessment: <span className="font-medium">{pin}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Waktu: {new Date().toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 