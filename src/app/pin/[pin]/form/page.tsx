'use client';

export const dynamic = 'force-static';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  UserIcon, 
  IdentificationIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  LightBulbIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { assessmentService } from '@/services/assessments';
import { templateService } from '@/services/templates';
import { employeeService } from '@/services/employees';
import { Assessment, Employee, Evaluator, AssessmentResult, CriteriaTemplate } from '@/types';

export default function AssessmentFormPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pin = params.pin as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [template, setTemplate] = useState<CriteriaTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get data from URL params
  const employeeId = searchParams.get('employee');
  const evaluatorData = searchParams.get('evaluator');
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [evaluator, setEvaluator] = useState<Evaluator | null>(null);
  
  // Form states
  const [section1Scores, setSection1Scores] = useState<{[key: number]: number}>({});
  const [section2Scores, setSection2Scores] = useState<{[key: number]: number}>({});
  const [recommendation, setRecommendation] = useState('');

  // Progress tracking
  const totalQuestions = (template?.section1.length || 0) + (template?.section2.length || 0) + 1;
  const answeredQuestions = Object.keys(section1Scores).length + Object.keys(section2Scores).length + (recommendation ? 1 : 0);
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load assessment
        const assessmentData = await assessmentService.getAssessmentByPIN(pin);
        if (!assessmentData) {
          setError('PIN tidak valid atau sudah tidak aktif');
          return;
        }
        setAssessment(assessmentData);

        // Load employee data from service
        if (employeeId) {
          try {
            const allEmployees = await employeeService.getAllEmployees();
            const emp = allEmployees.find(e => e.id === employeeId);
            
            if (emp) {
              setEmployee(emp);
              
              // Load template based on employee's position and assessment's available templates
              if (assessmentData.templateIds && assessmentData.templateIds.length > 0) {
                console.log('Loading templates for IDs:', assessmentData.templateIds);
                
                // Load all templates assigned to this assessment
                const templatePromises = assessmentData.templateIds.map(async (templateId) => {
                  try {
                    return await templateService.getTemplateById(templateId);
                  } catch (err) {
                    console.warn(`Failed to load template ${templateId}:`, err);
                    return null;
                  }
                });
                
                const availableTemplates = (await Promise.all(templatePromises)).filter(t => t !== null);
                console.log('Available templates:', availableTemplates);
                
                if (availableTemplates.length === 0) {
                  // If no templates from assessment, try to load all templates and find matching one
                  console.log('No templates from assessment, loading all templates...');
                  const allTemplates = await templateService.getAllTemplates();
                  const matchingTemplate = allTemplates.find(t => t.level === emp.position);
                  
                  if (matchingTemplate) {
                    console.log('Found matching template by position:', matchingTemplate);
                    setTemplate(matchingTemplate);
                  } else if (allTemplates.length > 0) {
                    console.log('Using first available template:', allTemplates[0]);
                    setTemplate(allTemplates[0]);
                  } else {
                    setError('Tidak ada template assessment yang tersedia. Silakan buat template terlebih dahulu di Setup Assessment Templates.');
                    return;
                  }
                } else {
                  // Find template that matches employee's position
                  const matchingTemplate = availableTemplates.find(t => 
                    t && t.level === emp.position
                  );
                  
                  if (matchingTemplate) {
                    console.log('Found matching template for position:', matchingTemplate);
                    setTemplate(matchingTemplate);
                  } else {
                    // Fallback to first available template
                    console.log('Using first available template from assessment:', availableTemplates[0]);
                    setTemplate(availableTemplates[0]);
                  }
                }
              } else {
                // If no template IDs in assessment, load all templates and find match
                console.log('No template IDs in assessment, loading all templates...');
                const allTemplates = await templateService.getAllTemplates();
                
                if (allTemplates.length === 0) {
                  setError('Tidak ada template assessment yang tersedia. Silakan buat template terlebih dahulu di Setup Assessment Templates.');
                  return;
                }
                
                const matchingTemplate = allTemplates.find(t => t.level === emp.position);
                if (matchingTemplate) {
                  console.log('Found matching template by position:', matchingTemplate);
                  setTemplate(matchingTemplate);
                } else {
                  console.log('Using first available template:', allTemplates[0]);
                  setTemplate(allTemplates[0]);
                }
              }
            } else {
              setError('Karyawan tidak ditemukan');
              return;
            }
          } catch (empError) {
            console.error('Error loading employee data:', empError);
            setError('Gagal memuat data karyawan');
            return;
          }
        }
        
        // Parse evaluator data
        if (evaluatorData) {
          try {
            const evaluatorInfo = JSON.parse(decodeURIComponent(evaluatorData));
            setEvaluator(evaluatorInfo);
          } catch (e) {
            console.error('Error parsing evaluator data:', e);
            setError('Data evaluator tidak valid');
            return;
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    if (pin && employeeId && evaluatorData) {
      loadData();
    } else {
      setError('Parameter URL tidak lengkap');
      setLoading(false);
    }
  }, [pin, employeeId, evaluatorData]);

  const handleSection1Score = (index: number, score: number) => {
    setSection1Scores(prev => ({ ...prev, [index]: score }));
  };

  const handleSection2Score = (index: number, score: number) => {
    setSection2Scores(prev => ({ ...prev, [index]: score }));
  };

  const calculateCategoryAverages = () => {
    if (!template) return [];
    
    const categories: {[key: string]: number[]} = {};
    
    template.section1.forEach((criteria, index) => {
      const score = section1Scores[index];
      if (score) {
        if (!categories[criteria.category]) {
          categories[criteria.category] = [];
        }
        categories[criteria.category].push(score);
      }
    });

    return Object.entries(categories).map(([category, scores]) => ({
      category,
      average: scores.reduce((a, b) => a + b, 0) / scores.length
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employee || !evaluator || !assessment || !template) {
      setError('Data tidak lengkap');
      return;
    }

    // Validate all scores are filled
    const section1Complete = template.section1.every((_, index) => section1Scores[index]);
    const section2Complete = template.section2.every((_, index) => section2Scores[index]);
    
    if (!section1Complete || !section2Complete || !recommendation) {
      setError('Semua penilaian harus diisi');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const competencyQuestionScores = template.section1.map((criteria, index) => ({
        category: criteria.category,
        text: criteria.text,
        score: section1Scores[index]
      }));

      const result: Omit<AssessmentResult, 'id'> = {
        assessmentId: assessment.id,
        targetUser: {
          id: employee.id,
          name: employee.name
        },
        evaluator,
        scores: calculateCategoryAverages(),
        competencyQuestionScores,
        semangatScores: Object.values(section2Scores),
        recommendation,
        submittedAt: new Date()
      };

      await assessmentService.submitAssessmentResult(result);
      
      // Redirect to success page with employee and evaluator data
      const searchParams = new URLSearchParams();
      searchParams.set('employee', employee.id);
      searchParams.set('evaluator', encodeURIComponent(JSON.stringify(evaluator)));
      
      router.push(`/pin/${pin}/success?${searchParams.toString()}`);
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('Terjadi kesalahan saat menyimpan penilaian');
    } finally {
      setSubmitting(false);
    }
  };

  // Rating component with improved visual design
  const ScoreRating = ({ 
    name, 
    value, 
    onChange, 
    questionIndex 
  }: { 
    name: string; 
    value: number; 
    onChange: (score: number) => void;
    questionIndex: number;
  }) => {
    const scoreColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Sangat Kurang</span>
          <span>Sangat Baik</span>
        </div>
        <div className="flex gap-3 justify-center">
          {[1, 2, 3, 4, 5].map(score => (
            <label 
              key={score} 
              className={`relative flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                value === score 
                  ? `${scoreColors[score-1]} text-white shadow-lg scale-105` 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={score}
                checked={value === score}
                onChange={() => onChange(score)}
                className="sr-only"
                required
              />
              <StarIcon className={`h-6 w-6 mb-1 ${value === score ? 'fill-current' : ''}`} />
              <span className="text-lg font-bold">{score}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
          <p className="mt-6 text-white text-lg font-medium">Memuat formulir assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
          <div className="bg-red-100 p-4 rounded-xl mb-6">
            <div className="text-red-800 font-medium">{error}</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push(`/pin/${pin}`)}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              Kembali
            </button>
            <button
              onClick={() => router.push('/admin/templates')}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Setup Templates
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!employee || !evaluator || !template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
          <div className="bg-yellow-100 p-4 rounded-xl mb-6">
            <p className="text-yellow-800">Data tidak lengkap. Silakan kembali dan pilih ulang.</p>
          </div>
          <button
            onClick={() => router.push(`/pin/${pin}`)}
            className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
          >
            Kembali
          </button>
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

      <div className="relative z-10 min-h-screen py-6 lg:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-xl mr-4">
                  <ClipboardDocumentListIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Assessment Form
            </h1>
                  <p className="text-gray-600">{assessment?.title}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gray-100 px-4 py-2 rounded-xl">
                  <span className="text-sm text-gray-600">Progress:</span>
                  <span className="ml-2 font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Participant Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center mb-3">
                  <UserIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Target Assessment</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{employee?.name}</p>
                <p className="text-sm text-gray-600">{employee?.position} • {employee?.location}</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center mb-3">
                  <IdentificationIcon className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="font-medium text-purple-800">Evaluator</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{evaluator?.name}</p>
                <p className="text-sm text-gray-600">{evaluator?.position} • {evaluator?.division}</p>
              </div>
            </div>
          </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Competency Assessment */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl mr-4">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                  Bagian 1: Penilaian Kompetensi
                </h2>
                  <p className="text-sm text-gray-600">
                    Berikan penilaian dengan skala 1-5 berdasarkan performa karyawan
                  </p>
                        </div>
                      </div>
                      
              <div className="space-y-6">
                {template.section1.map((criteria, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Soal {index + 1}
                        </h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {criteria.category}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{criteria.text}</p>
                    </div>
                    
                    <ScoreRating
                      name={`section1_${index}`}
                      value={section1Scores[index]}
                      onChange={(score) => handleSection1Score(index, score)}
                      questionIndex={index}
                    />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Work Spirit Assessment */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl mr-4">
                  <HeartIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                  Bagian 2: Penilaian Semangat Kerja
                </h2>
                  <p className="text-sm text-gray-600">
                    Evaluasi motivasi dan dedikasi karyawan dalam bekerja
                </p>
                </div>
              </div>
                
              <div className="space-y-6">
                  {template.section2.map((criteria, index) => (
                  <div key={index} className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-100">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Pertanyaan {index + 1}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{criteria.text}</p>
                    </div>
                    
                    <ScoreRating
                              name={`section2_${index}`}
                      value={section2Scores[index]}
                      onChange={(score) => handleSection2Score(index, score)}
                      questionIndex={index}
                    />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Recommendation */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl mr-4">
                  <LightBulbIcon className="h-6 w-6 text-white" />
                </div>
              <div>
                  <h2 className="text-xl font-bold text-gray-900">
                  Bagian 3: Rekomendasi
                </h2>
                  <p className="text-sm text-gray-600">
                    Berikan rekomendasi terbaik berdasarkan penilaian Anda
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-100">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Pilih rekomendasi untuk karyawan ini:
                </label>
                
                <div className="space-y-3">
                  {template.section3.options.map((option, index) => (
                    <label 
                      key={option} 
                      className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                        recommendation === option 
                          ? 'border-yellow-500 bg-yellow-100 shadow-md' 
                          : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="recommendation"
                        value={option}
                        checked={recommendation === option}
                    onChange={(e) => setRecommendation(e.target.value)}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    required
                      />
                      <div className="ml-3">
                        <span className={`font-medium ${
                          recommendation === option ? 'text-yellow-900' : 'text-gray-900'
                        }`}>
                          {option}
                        </span>
                      </div>
                    </label>
                    ))}
                </div>
                </div>
              </div>

            {/* Error Display */}
              {error && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>{error}</span>
                </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => router.push(`/pin/${pin}`)}
                  className="flex items-center justify-center px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
                  disabled={submitting}
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Kembali
                </button>
                
                <button
                  type="submit"
                  className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg flex-1"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Submit Penilaian
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Progress: {answeredQuestions} dari {totalQuestions} pertanyaan telah dijawab
                </p>
              </div>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
} 