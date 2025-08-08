'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
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
      const result: Omit<AssessmentResult, 'id'> = {
        assessmentId: assessment.id,
        targetUser: {
          id: employee.id,
          name: employee.name
        },
        evaluator,
        scores: calculateCategoryAverages(),
        competencyQuestionScores: Object.values(section1Scores),
        semangatScores: Object.values(section2Scores),
        recommendation,
        submittedAt: new Date()
      };

      await assessmentService.submitAssessmentResult(result);
      
      // Redirect to success page
      router.push(`/pin/${pin}/success`);
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('Terjadi kesalahan saat menyimpan penilaian');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat formulir assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
            <h3 className="font-medium text-lg mb-2">Error</h3>
            <p className="text-sm">{error}</p>
          </div>
          <div className="mt-4 space-x-3">
            <button
              onClick={() => router.push(`/pin/${pin}`)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              
            </button>
            <button
              onClick={() => router.push('/admin/templates')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg">
            <p>Data tidak lengkap. Silakan  dan pilih ulang.</p>
          </div>
          <button
            onClick={() => router.push(`/pin/${pin}`)}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => router.push(`/pin/${pin}`)} aria-label="Kembali" className="p-2 rounded-md border border-gray-200 hover:bg-gray-50">
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 flex-1 text-center">Assessment Form - {assessment?.title}</h1>
              <div className="w-9" />
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><strong>Target:</strong> {employee?.name} ({employee?.position})</p>
                <p><strong>Lokasi:</strong> {employee?.location}</p>
              </div>
              <div>
                <p><strong>Evaluator:</strong> {evaluator?.name} ({evaluator?.position})</p>
                <p><strong>Template:</strong> {template.level}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Competency Assessment */}
              <div className="border-b pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Bagian 1: Penilaian Kompetensi
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Berikan penilaian dengan skala 1-5 (1 = Sangat Kurang, 5 = Sangat Baik)
                </p>
                
                <div className="space-y-4">
                  {template.section1.map((criteria, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-gray-900">{criteria.text}</p>
                          <p className="text-sm text-gray-500">Kategori: {criteria.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(score => (
                          <label key={score} className="flex items-center">
                            <input
                              type="radio"
                              name={`section1_${index}`}
                              value={score}
                              checked={section1Scores[index] === score}
                              onChange={() => handleSection1Score(index, score)}
                              className="mr-1"
                              required
                            />
                            <span className="text-sm">{score}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Work Spirit Assessment */}
              <div className="border-b pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Bagian 2: Penilaian Semangat Kerja
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Berikan penilaian dengan skala 1-5 (1 = Sangat Kurang, 5 = Sangat Baik)
                </p>
                
                <div className="space-y-4">
                  {template.section2.map((criteria, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-900 mb-3">{criteria.text}</p>
                      
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(score => (
                          <label key={score} className="flex items-center">
                            <input
                              type="radio"
                              name={`section2_${index}`}
                              value={score}
                              checked={section2Scores[index] === score}
                              onChange={() => handleSection2Score(index, score)}
                              className="mr-1"
                              required
                            />
                            <span className="text-sm">{score}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Recommendation */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Bagian 3: Rekomendasi
                </h2>
                
                <div>
                  <label className="form-label">Pilih rekomendasi untuk karyawan ini:</label>
                  <select
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">Pilih Rekomendasi</option>
                    {template.section3.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={submitting}
                >
                  {submitting ? 'Menyimpan...' : 'Submit Penilaian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 