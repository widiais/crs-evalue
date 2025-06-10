'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DocumentTextIcon,
  PlusIcon, 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { templateService } from '@/services/templates';
import { CriteriaTemplate, AssessmentCriteria } from '@/types';
import { COMPETENCY_CATEGORIES, RECOMMENDATION_OPTIONS } from '@/constants/templates';
import { POSITIONS, Position } from '@/constants/positions';

export default function AdminTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<CriteriaTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CriteriaTemplate | null>(null);
  
  const [templateForm, setTemplateForm] = useState({
    level: '' as Position | '',
    section1: [] as AssessmentCriteria[],
    section2: [] as AssessmentCriteria[],
    section3: {
      type: 'fixed_options' as const,
      options: [...RECOMMENDATION_OPTIONS]
    }
  });

  const [newQuestion, setNewQuestion] = useState({
    section1: { text: '', category: '' },
    section2: { text: '', category: 'semangat' }
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await templateService.getAllTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTemplateForm({
      level: '',
      section1: [],
      section2: [],
      section3: {
        type: 'fixed_options',
        options: [...RECOMMENDATION_OPTIONS]
      }
    });
    setNewQuestion({
      section1: { text: '', category: '' },
      section2: { text: '', category: 'semangat' }
    });
    setEditingTemplate(null);
  };

  const addQuestion = (section: 'section1' | 'section2') => {
    const question = newQuestion[section];
    if (!question.text.trim()) {
      alert('Pertanyaan tidak boleh kosong');
      return;
    }

    if (section === 'section1' && !question.category) {
      alert('Kategori harus dipilih untuk Section 1');
      return;
    }

    setTemplateForm(prev => ({
      ...prev,
      [section]: [...prev[section], { ...question }]
    }));

    setNewQuestion(prev => ({
      ...prev,
      [section]: section === 'section1' 
        ? { text: '', category: '' }
        : { text: '', category: 'semangat' }
    }));
  };

  const removeQuestion = (section: 'section1' | 'section2', index: number) => {
    setTemplateForm(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSubmitTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!templateForm.level) {
      alert('Level assessment harus diisi');
      return;
    }

    if (templateForm.section1.length === 0) {
      alert('Minimal harus ada 1 pertanyaan di Section 1');
      return;
    }

    if (templateForm.section2.length === 0) {
      alert('Minimal harus ada 1 pertanyaan di Section 2');
      return;
    }

    setSubmitting(true);
    try {
      const templateData = {
        level: templateForm.level as Position,
        section1: templateForm.section1,
        section2: templateForm.section2,
        section3: templateForm.section3
      };

      if (editingTemplate) {
        // Update existing template
        await templateService.updateTemplate(editingTemplate.id, templateData);
        alert('✅ Template berhasil diperbarui!');
      } else {
        // Create new template
        await templateService.createTemplate(templateData);
        alert('✅ Template berhasil dibuat!');
      }

      resetForm();
      setShowCreateForm(false);
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('❌ Gagal menyimpan template');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTemplate = (template: CriteriaTemplate) => {
    setTemplateForm({
      level: template.level,
      section1: [...template.section1],
      section2: [...template.section2],
      section3: { 
        type: 'fixed_options',
        options: [...RECOMMENDATION_OPTIONS]
      }
    });
    setEditingTemplate(template);
    setShowCreateForm(true);
  };

  const deleteTemplate = async (template: CriteriaTemplate) => {
    if (!confirm(`Yakin ingin menghapus template "${template.level}"?`)) {
      return;
    }

    try {
      await templateService.deleteTemplate(template.id);
      alert('✅ Template berhasil dihapus!');
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('❌ Gagal menghapus template');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading templates...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Setup Template Assessment</h1>
                <p className="mt-2 text-gray-600">Kelola pertanyaan assessment per section</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                resetForm();
                setShowCreateForm(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Buat Template Baru
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Template</p>
                <p className="text-2xl font-semibold text-gray-900">{templates.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClipboardDocumentListIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Section 1 Questions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {templates.length > 0 ? Math.round(templates.reduce((sum, t) => sum + t.section1.length, 0) / templates.length) : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClipboardDocumentCheckIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Section 2 Questions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {templates.length > 0 ? Math.round(templates.reduce((sum, t) => sum + t.section2.length, 0) / templates.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Create/Edit Template Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingTemplate ? 'Edit Template' : 'Buat Template Baru'}
              </h3>
              
              <form onSubmit={handleSubmitTemplate} className="space-y-6">
                {/* Template Level */}
                <div>
                  <label className="form-label">Level Assessment *</label>
                  <select
                    value={templateForm.level}
                    onChange={(e) => setTemplateForm({...templateForm, level: e.target.value as Position})}
                    className="form-input"
                    required
                  >
                    <option value="">Pilih Level</option>
                    {POSITIONS.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>

                {/* Section 1: 6 Dimensi Kompetensi */}
                <div className="border-b pb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Section 1: Penilaian 6 Dimensi Kompetensi
                  </h4>
                  
                  {/* Add Question Form */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="space-y-3">
                      {/* Question input - full width */}
                      <input
                        type="text"
                        value={newQuestion.section1.text}
                        onChange={(e) => setNewQuestion(prev => ({
                          ...prev,
                          section1: { ...prev.section1, text: e.target.value }
                        }))}
                        className="form-input w-full"
                        placeholder="Masukkan pertanyaan..."
                      />
                      
                      {/* Category and Add button - same row */}
                      <div className="flex gap-3">
                        <select
                          value={newQuestion.section1.category}
                          onChange={(e) => setNewQuestion(prev => ({
                            ...prev,
                            section1: { ...prev.section1, category: e.target.value }
                          }))}
                          className="form-input flex-1"
                        >
                          <option value="">Pilih Kategori</option>
                          {COMPETENCY_CATEGORIES.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => addQuestion('section1')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap"
                        >
                          + Tambah
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-2">
                    {templateForm.section1.map((question, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                        <div>
                          <p className="font-medium">{question.text}</p>
                          <p className="text-sm text-gray-500">Kategori: {question.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuestion('section1', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {templateForm.section1.length === 0 && (
                      <p className="text-gray-500 text-center py-4">Belum ada pertanyaan</p>
                    )}
                  </div>
                </div>

                {/* Section 2: 7 Semangat Sedjati */}
                <div className="border-b pb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Section 2: Penerapan 7 Semangat Sedjati
                  </h4>
                  
                  {/* Add Question Form */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newQuestion.section2.text}
                        onChange={(e) => setNewQuestion(prev => ({
                          ...prev,
                          section2: { ...prev.section2, text: e.target.value }
                        }))}
                        className="form-input flex-1"
                        placeholder="Masukkan pertanyaan terkait semangat kerja..."
                      />
                      <button
                        type="button"
                        onClick={() => addQuestion('section2')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        + Tambah
                      </button>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-2">
                    {templateForm.section2.map((question, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                        <p className="font-medium">{question.text}</p>
                        <button
                          type="button"
                          onClick={() => removeQuestion('section2', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {templateForm.section2.length === 0 && (
                      <p className="text-gray-500 text-center py-4">Belum ada pertanyaan</p>
                    )}
                  </div>
                </div>

                {/* Section 3: Rekomendasi (Fixed) */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Section 3: Rekomendasi Evaluator (Opsi Tetap)
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {RECOMMENDATION_OPTIONS.map((option, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm mr-3">
                            {index + 1}
                          </span>
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
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
                    {submitting ? 'Menyimpan...' : editingTemplate ? 'Update Template' : 'Buat Template'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Templates Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Template Assessment ({templates.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level Assessment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Section 1 Questions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Section 2 Questions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {templates.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada template</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Mulai dengan membuat template assessment baru
                      </p>
                    </td>
                  </tr>
                ) : (
                  templates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {template.level}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {template.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {template.section1.length} pertanyaan
                        </div>
                        <div className="text-xs text-gray-500">
                          Categories: {Array.from(new Set(template.section1.map(q => q.category))).length}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {template.section2.length} pertanyaan
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteTemplate(template)}
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
          <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Informasi Setup Template</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Section 1 - 6 Dimensi Kompetensi:</h4>
              <ul className="space-y-1">
                <li>• Functional Competency</li>
                <li>• Leadership dan Managerial</li>
                <li>• Soft Skill</li>
                <li>• Problem Solving & Analytical Thinking</li>
                <li>• Culture Fit and Commitment</li>
                <li>• Akhlak dan Etika Kerja Islam</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Section 2 - 7 Semangat Sedjati:</h4>
              <ul className="space-y-1">
                <li>• Pertanyaan bebas terkait semangat kerja</li>
                <li>• Skala penilaian 1-5 (sama dengan Section 1)</li>
                <li>• Fokus pada motivasi dan dedikasi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 