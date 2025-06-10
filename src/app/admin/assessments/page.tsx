'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ClipboardDocumentListIcon,
  PlusIcon, 
  EyeIcon,
  ArrowLeftIcon,
  PencilIcon,
  ClockIcon,
  KeyIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { assessmentService } from '@/services/assessments';
import { templateService } from '@/services/templates';
import { generatePIN } from '@/utils/generatePIN';
import { Assessment, CriteriaTemplate } from '@/types';
import { POSITIONS } from '@/constants/positions';

export default function AdminAssessmentsPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [templates, setTemplates] = useState<CriteriaTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  
  const [assessmentForm, setAssessmentForm] = useState({
    title: '',
    description: '',
    pin: '',
    startDate: '',
    endDate: '',
    selectedTemplates: [] as string[],
    isActive: true,
    manualPin: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assessmentData, templateData] = await Promise.all([
        assessmentService.getAllAssessments(),
        templateService.getAllTemplates()
      ]);
      setAssessments(assessmentData);
      setTemplates(templateData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAssessmentForm({
      title: '',
      description: '',
      pin: '',
      startDate: '',
      endDate: '',
      selectedTemplates: [],
      isActive: true,
      manualPin: false
    });
    setEditingAssessment(null);
  };

  const generateNewPIN = () => {
    const newPin = generatePIN();
    setAssessmentForm({...assessmentForm, pin: newPin});
  };

  const toggleTemplateSelection = (templateId: string) => {
    setAssessmentForm(prev => ({
      ...prev,
      selectedTemplates: prev.selectedTemplates.includes(templateId)
        ? prev.selectedTemplates.filter(id => id !== templateId)
        : [...prev.selectedTemplates, templateId]
    }));
  };

  const handleSubmitAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assessmentForm.title.trim()) {
      alert('Judul assessment harus diisi');
      return;
    }

    if (!assessmentForm.pin.trim()) {
      alert('PIN harus diisi atau generate PIN baru');
      return;
    }

    if (assessmentForm.selectedTemplates.length === 0) {
      alert('Minimal pilih 1 template assessment');
      return;
    }

    // Check PIN uniqueness (only for new assessments)
    if (!editingAssessment && assessments.some(a => a.pin === assessmentForm.pin.toUpperCase())) {
      alert('PIN sudah digunakan, silakan gunakan PIN lain');
      return;
    }

    setSubmitting(true);
    try {
      const assessmentData = {
        title: assessmentForm.title.trim(),
        description: assessmentForm.description.trim(),
        templateIds: assessmentForm.selectedTemplates,
        pin: assessmentForm.pin.toUpperCase(),
        isActive: assessmentForm.isActive,
        startDate: assessmentForm.startDate ? new Date(assessmentForm.startDate) : undefined,
        endDate: assessmentForm.endDate ? new Date(assessmentForm.endDate) : undefined,
        createdAt: new Date(),
        createdBy: 'admin'
      };

      if (editingAssessment) {
        // Update existing assessment
        await assessmentService.updateAssessment(editingAssessment.id, assessmentData);
        alert('✅ Assessment berhasil diperbarui!');
      } else {
        // Create new assessment
        await assessmentService.createAssessment(assessmentData);
        alert('✅ Assessment berhasil dibuat!');
      }

      resetForm();
      setShowCreateForm(false);
      loadData();
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('❌ Gagal menyimpan assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAssessment = (assessment: Assessment) => {
    setAssessmentForm({
      title: assessment.title,
      description: assessment.description || '',
      pin: assessment.pin,
      startDate: assessment.startDate ? new Date(assessment.startDate).toISOString().split('T')[0] : '',
      endDate: assessment.endDate ? new Date(assessment.endDate).toISOString().split('T')[0] : '',
      selectedTemplates: assessment.templateIds,
      isActive: assessment.isActive,
      manualPin: true
    });
    setEditingAssessment(assessment);
    setShowCreateForm(true);
  };

  const toggleAssessmentStatus = async (assessment: Assessment) => {
    try {
      await assessmentService.updateAssessment(assessment.id, {
        isActive: !assessment.isActive
      });
      loadData(); // Refresh list
    } catch (error) {
      console.error('Error toggling assessment status:', error);
      alert('❌ Gagal mengubah status assessment');
    }
  };

  const deleteAssessment = async (assessment: Assessment) => {
    if (!confirm(`Yakin ingin menghapus assessment "${assessment.title}"?`)) {
      return;
    }

    try {
      await assessmentService.deleteAssessment(assessment.id);
      alert('✅ Assessment berhasil dihapus!');
      loadData();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      alert('❌ Gagal menghapus assessment');
    }
  };

  const copyPIN = (pin: string) => {
    navigator.clipboard.writeText(pin);
    alert('📋 PIN berhasil disalin ke clipboard!');
  };

  const getTemplatesByPosition = (position: string) => {
    return templates.filter(t => t.level === position);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Setup Assessments</h1>
                <p className="mt-2 text-gray-600">Generate PIN dan assign template berdasarkan jobdesk</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                resetForm();
                generateNewPIN(); // Auto-generate PIN for new assessment
                setShowCreateForm(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Buat Assessment Baru
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClipboardDocumentListIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Assessment</p>
                <p className="text-2xl font-semibold text-gray-900">{assessments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <PlayIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Assessment Aktif</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assessments.filter(a => a.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Template Tersedia</p>
                <p className="text-2xl font-semibold text-gray-900">{templates.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Dengan Periode</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assessments.filter(a => a.startDate && a.endDate).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Create/Edit Assessment Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingAssessment ? 'Edit Assessment' : 'Buat Assessment Baru'}
              </h3>
              
              <form onSubmit={handleSubmitAssessment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Judul Assessment *</label>
                    <input
                      type="text"
                      value={assessmentForm.title}
                      onChange={(e) => setAssessmentForm({...assessmentForm, title: e.target.value})}
                      className="form-input"
                      placeholder="Contoh: Performance Review Q4 2024"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">PIN Assessment *</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={assessmentForm.pin}
                        onChange={(e) => setAssessmentForm({...assessmentForm, pin: e.target.value.toUpperCase()})}
                        className="form-input flex-1"
                        placeholder="Masukkan PIN atau generate otomatis"
                        maxLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={generateNewPIN}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Generate PIN
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label">Deskripsi</label>
                  <textarea
                    value={assessmentForm.description}
                    onChange={(e) => setAssessmentForm({...assessmentForm, description: e.target.value})}
                    className="form-input"
                    rows={3}
                    placeholder="Deskripsi singkat tentang assessment ini..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Tanggal Mulai</label>
                    <input
                      type="date"
                      value={assessmentForm.startDate}
                      onChange={(e) => setAssessmentForm({...assessmentForm, startDate: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Tanggal Berakhir</label>
                    <input
                      type="date"
                      value={assessmentForm.endDate}
                      onChange={(e) => setAssessmentForm({...assessmentForm, endDate: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Template Selection by Position */}
                <div>
                  <label className="form-label">Pilih Template Assessment berdasarkan Jabatan *</label>
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {POSITIONS.map(position => {
                      const positionTemplates = getTemplatesByPosition(position);
                      
                      if (positionTemplates.length === 0) return null;
                      
                      return (
                        <div key={position} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">{position}</h4>
                          <div className="space-y-2">
                            {positionTemplates.map(template => (
                              <label key={template.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={assessmentForm.selectedTemplates.includes(template.id)}
                                  onChange={() => toggleTemplateSelection(template.id)}
                                  className="mr-3"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Template {template.level}</p>
                                  <p className="text-xs text-gray-500">
                                    {template.section1.length} pertanyaan kompetensi, {template.section2.length} pertanyaan semangat
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Pilih template yang sesuai dengan jabatan yang akan dinilai dalam assessment ini
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={assessmentForm.isActive}
                    onChange={(e) => setAssessmentForm({...assessmentForm, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Assessment aktif (dapat diakses evaluator)</label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    disabled={submitting}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? 'Menyimpan...' : editingAssessment ? 'Update Assessment' : 'Buat Assessment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assessments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Assessment ({assessments.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assessment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PIN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Templates Assigned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assessments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada assessment</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Mulai dengan membuat assessment baru
                      </p>
                    </td>
                  </tr>
                ) : (
                  assessments.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {assessment.title}
                          </div>
                          {assessment.description && (
                            <div className="text-sm text-gray-500">
                              {assessment.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => copyPIN(assessment.pin)}
                          className="font-mono text-sm bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          title="Click to copy PIN"
                        >
                          {assessment.pin}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {assessment.templateIds.length} template(s)
                        </div>
                        <div className="text-xs text-gray-500">
                          {assessment.templateIds.map(templateId => {
                            const template = templates.find(t => t.id === templateId);
                            return template ? template.level : templateId;
                          }).join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assessment.startDate && assessment.endDate ? (
                          <div>
                            <div>{new Date(assessment.startDate).toLocaleDateString('id-ID')}</div>
                            <div>s/d {new Date(assessment.endDate).toLocaleDateString('id-ID')}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Tanpa batas waktu</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleAssessmentStatus(assessment)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            assessment.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {assessment.isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditAssessment(assessment)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/reports/personal?assessment=${assessment.id}`)}
                            className="text-green-600 hover:text-green-900"
                            title="Lihat Hasil"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteAssessment(assessment)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Informasi Setup Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Cara Menggunakan:</h4>
              <ul className="space-y-1">
                <li>• Buat assessment dengan judul yang jelas</li>
                <li>• Generate PIN unik untuk evaluator</li>
                <li>• Pilih template sesuai jabatan yang akan dinilai</li>
                <li>• Set periode jika diperlukan</li>
                <li>• Aktifkan assessment agar dapat diakses</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Template Assignment:</h4>
              <ul className="space-y-1">
                <li>• Template dikelompokkan berdasarkan jabatan</li>
                <li>• Satu assessment bisa menggunakan multiple template</li>
                <li>• Template harus dibuat dulu di Setup Assessment Templates</li>
                <li>• PIN akan di-copy ke clipboard saat diklik</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 