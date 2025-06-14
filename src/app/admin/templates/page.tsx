'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DocumentTextIcon,
  PlusIcon, 
  ArrowLeftIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  ClipboardDocumentCheckIcon,
  PlusCircleIcon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { templateService } from '@/services/templates';
import { CriteriaTemplate, AssessmentCriteria } from '@/types';
import { POSITIONS, Position } from '@/constants/positions';
import { COMPETENCY_CATEGORIES, RECOMMENDATION_OPTIONS } from '@/constants/templates';
import { getTemplateByLevel } from '@/data';

export default function AdminTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<CriteriaTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CriteriaTemplate | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<CriteriaTemplate | null>(null);
  
  // Form state
  const [templateForm, setTemplateForm] = useState({
    level: '' as Position | '',
    section1: [{ text: '', category: COMPETENCY_CATEGORIES[0] }] as AssessmentCriteria[],
    section2: [{ text: '', category: 'semangat' }] as AssessmentCriteria[]
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
      section1: [{ text: '', category: COMPETENCY_CATEGORIES[0] }],
      section2: [{ text: '', category: 'semangat' }]
    });
    setEditingTemplate(null);
  };

  const updateQuestion = (section: 'section1' | 'section2', index: number, field: 'text' | 'category', value: string) => {
    setTemplateForm(prev => ({
      ...prev,
      [section]: prev[section].map((q, i) => i === index ? { ...q, [field]: value } : q)
    }));
  };

  const addQuestion = (section: 'section1' | 'section2') => {
    const category = section === 'section1' ? COMPETENCY_CATEGORIES[0] : 'semangat';
    setTemplateForm(prev => ({
      ...prev,
      [section]: [...prev[section], { text: '', category }]
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
      alert('Level/Jabatan harus dipilih');
      return;
    }

    // Check if each section has at least one question
    if (templateForm.section1.length === 0) {
      alert('Section Kompetensi harus memiliki minimal 1 pertanyaan');
      return;
    }

    if (templateForm.section2.length === 0) {
      alert('Section Semangat harus memiliki minimal 1 pertanyaan');
      return;
    }

    // Check if all questions are filled
    const allSection1Filled = templateForm.section1.every(q => q.text.trim() && q.category.trim());
    const allSection2Filled = templateForm.section2.every(q => q.text.trim());
    
    if (!allSection1Filled || !allSection2Filled) {
      alert('Semua pertanyaan dan kategori harus diisi');
      return;
    }

    // Check if template for this level already exists (only for create, not edit)
    if (!editingTemplate && templates.some(t => t.level === templateForm.level)) {
      alert('Template untuk level ini sudah ada');
      return;
    }

    setSubmitting(true);
    try {
      const templateData = {
        level: templateForm.level as Position,
        section1: templateForm.section1.filter(q => q.text.trim()),
        section2: templateForm.section2.filter(q => q.text.trim()),
        section3: {
          type: 'fixed_options' as const,
          options: [...RECOMMENDATION_OPTIONS]
        }
      };

      if (editingTemplate) {
        await templateService.updateTemplate(editingTemplate.id, templateData);
        alert('✅ Template berhasil diperbarui!');
      } else {
        await templateService.addTemplate(templateData);
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
      section2: [...template.section2]
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

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.level]) {
      acc[template.level] = [];
    }
    acc[template.level].push(template);
    return acc;
  }, {} as Record<string, CriteriaTemplate[]>);

  // Generate template from predefined data
  const generateTemplate = () => {
    if (!templateForm.level) {
      alert('Pilih level/jabatan terlebih dahulu');
      return;
    }

    // Check if form already has content
    const hasContent = templateForm.section1.some(q => q.text.trim()) || 
                      templateForm.section2.some(q => q.text.trim());
    
    if (hasContent) {
      if (!confirm('Form sudah berisi data. Yakin ingin mengganti dengan template otomatis?')) {
        return;
      }
    }

    const predefinedTemplate = getTemplateByLevel(templateForm.level);
    
    if (!predefinedTemplate) {
      alert(`Template untuk level "${templateForm.level}" belum tersedia. Silakan isi manual atau pilih level lain.`);
      return;
    }

    // Convert predefined template to form format
    const section1Questions = predefinedTemplate.section1.map(q => ({
      text: q.text,
      category: q.category
    }));

    const section2Questions = predefinedTemplate.section2.map(q => ({
      text: q.text,
      category: 'semangat'
    }));

    setTemplateForm(prev => ({
      ...prev,
      section1: section1Questions,
      section2: section2Questions
    }));

    alert(`✨ Template untuk level "${templateForm.level}" berhasil di-generate!\n\nSection 1: ${section1Questions.length} pertanyaan kompetensi\nSection 2: ${section2Questions.length} pertanyaan semangat\n\nAnda dapat mengedit sesuai kebutuhan sebelum menyimpan.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading templates...</p>
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
        
        {/* Gradient Overlay Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12 translate-y-20"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
              <button
                onClick={() => router.push('/admin')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    Setup Assessment Templates
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Kelola template pertanyaan assessment berdasarkan level jabatan
                  </p>
            </div>
            
                <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                resetForm();
                setShowCreateForm(true);
              }}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Buat Template Baru
            </button>
                </div>
              </div>
          </div>
        </div>

        {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                  <DocumentTextIcon className="h-8 w-8 text-white" />
                </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Template</p>
                <p className="text-2xl font-semibold text-gray-900">{templates.length}</p>
              </div>
            </div>
          </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                  <ClipboardDocumentCheckIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Level Tersedia</p>
                  <p className="text-2xl font-semibold text-gray-900">{Object.keys(groupedTemplates).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                  <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-white" />
                </div>
              <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Kompetensi</p>
                <p className="text-2xl font-semibold text-gray-900">
                    {templates.reduce((acc, t) => acc + t.section1.length, 0)}
                </p>
              </div>
            </div>
          </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="flex items-center">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                  <HeartIcon className="h-8 w-8 text-white" />
                </div>
              <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Semangat</p>
                <p className="text-2xl font-semibold text-gray-900">
                    {templates.reduce((acc, t) => acc + t.section2.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Create/Edit Template Form Modal */}
        {showCreateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {editingTemplate ? 'Edit Template' : 'Buat Template Baru'}
              </h3>
              
              <form onSubmit={handleSubmitTemplate} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level/Jabatan *</label>
                  <select
                    value={templateForm.level}
                    onChange={(e) => setTemplateForm({...templateForm, level: e.target.value as Position})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                      disabled={!!editingTemplate}
                  >
                      <option value="">Pilih Level/Jabatan</option>
                    {POSITIONS.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                  
                  {/* Generate Button */}
                  {!editingTemplate && templateForm.level && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={generateTemplate}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
                      >
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Generate Template Otomatis
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        Klik untuk mengisi form otomatis berdasarkan template standar level ini
                      </p>
                    </div>
                  )}
                </div>

                  {/* Section 1 - Kompetensi */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-blue-900 flex items-center">
                        <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-2" />
                        Section 1: Pertanyaan Kompetensi ({templateForm.section1.length})
                  </h4>
                      <button
                        type="button"
                        onClick={() => addQuestion('section1')}
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <PlusCircleIcon className="h-4 w-4 mr-1" />
                        Tambah Pertanyaan
                      </button>
                    </div>
                    <div className="space-y-4">
                      {templateForm.section1.map((question, index) => (
                        <div key={index} className="relative bg-white rounded-lg p-4 border border-blue-200">
                          <div className="flex items-start space-x-4">
                            <div className="flex-1 space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-blue-700 mb-2">
                                  Pertanyaan {index + 1} *
                                </label>
                                <textarea
                                  value={question.text}
                                  onChange={(e) => updateQuestion('section1', index, 'text', e.target.value)}
                                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                  rows={3}
                                  placeholder={`Masukkan pertanyaan kompetensi ${index + 1}...`}
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-blue-700 mb-2">
                                  Kategori Kompetensi *
                                </label>
                        <select
                                  value={question.category}
                                  onChange={(e) => updateQuestion('section1', index, 'category', e.target.value)}
                                  className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                  required
                                >
                          {COMPETENCY_CATEGORIES.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                              </div>
                            </div>
                            {templateForm.section1.length > 1 && (
                        <button
                          type="button"
                                onClick={() => removeQuestion('section1', index)}
                                className="mt-8 p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                                title="Hapus pertanyaan"
                        >
                                <XMarkIcon className="h-5 w-5" />
                        </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                      <h5 className="text-sm font-medium text-blue-900 mb-2">📋 Kategori Kompetensi Tersedia:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-800">
                        {COMPETENCY_CATEGORIES.map((category, index) => (
                          <div key={category} className="flex items-center">
                            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs mr-2">{index + 1}</span>
                            {category}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section 2 - Semangat */}
                  <div className="bg-orange-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-orange-900 flex items-center">
                        <HeartIcon className="h-5 w-5 mr-2" />
                        Section 2: Pertanyaan Semangat ({templateForm.section2.length})
                  </h4>
                      <button
                        type="button"
                        onClick={() => addQuestion('section2')}
                        className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <PlusCircleIcon className="h-4 w-4 mr-1" />
                        Tambah Pertanyaan
                      </button>
                    </div>
                    <div className="space-y-4">
                      {templateForm.section2.map((question, index) => (
                        <div key={index} className="relative bg-white rounded-lg p-4 border border-orange-200">
                          <div className="flex items-start space-x-2">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-orange-700 mb-2">
                                Pertanyaan {index + 1} *
                              </label>
                              <textarea
                                value={question.text}
                                onChange={(e) => updateQuestion('section2', index, 'text', e.target.value)}
                                className="w-full px-4 py-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                rows={3}
                                placeholder={`Masukkan pertanyaan semangat ${index + 1}...`}
                                required
                              />
                  </div>
                            {templateForm.section2.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion('section2', index)}
                                className="mt-8 p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                                title="Hapus pertanyaan"
                        >
                                <XMarkIcon className="h-5 w-5" />
                        </button>
                    )}
                  </div>
                </div>
                      ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      resetForm();
                    }}
                      className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    disabled={submitting}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 shadow-lg"
                    disabled={submitting}
                  >
                    {submitting ? 'Menyimpan...' : editingTemplate ? 'Update Template' : 'Buat Template'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

          {/* View Template Modal */}
          {viewingTemplate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Template: {viewingTemplate.level}
                  </h3>
                  <button
                    onClick={() => setViewingTemplate(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Section 1 Preview */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                      <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-2" />
                      Section 1: Kompetensi ({viewingTemplate.section1.length} pertanyaan)
                    </h4>
                    <div className="space-y-3">
                      {viewingTemplate.section1.map((question, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-medium text-blue-700">Pertanyaan {index + 1}</p>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {question.category}
                            </span>
                          </div>
                          <p className="text-gray-800">{question.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 2 Preview */}
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                      <HeartIcon className="h-5 w-5 mr-2" />
                      Section 2: Semangat ({viewingTemplate.section2.length} pertanyaan)
                    </h4>
                    <div className="space-y-3">
                      {viewingTemplate.section2.map((question, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-orange-200">
                          <p className="text-sm font-medium text-orange-700 mb-2">Pertanyaan {index + 1}</p>
                          <p className="text-gray-800">{question.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3 Preview */}
                  <div className="bg-green-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                      <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2" />
                      Section 3: Opsi Rekomendasi ({viewingTemplate.section3.options.length} opsi)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {viewingTemplate.section3.options.map((option, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="flex items-center">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-3">
                              {index + 1}
                            </span>
                            <p className="text-gray-800 text-sm">{option}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4">
                  <button
                    onClick={() => setViewingTemplate(null)}
                    className="w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Templates List */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 lg:px-8 py-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                📝 Template Assessment ({templates.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level/Jabatan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kompetensi
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Semangat
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Pertanyaan
                  </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {templates.length === 0 ? (
                  <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <DocumentTextIcon className="mx-auto h-16 w-16 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Belum ada template</h3>
                        <p className="mt-2 text-gray-500">
                          Mulai dengan membuat template assessment
                      </p>
                    </td>
                  </tr>
                ) : (
                  templates.map((template) => (
                      <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{template.level}</div>
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {template.section1.length} pertanyaan
                          </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {template.section2.length} pertanyaan
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {template.section1.length + template.section2.length} pertanyaan
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setViewingTemplate(template)}
                              className="text-green-600 hover:text-green-900 transition-colors"
                              title="View"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                          <button
                            onClick={() => handleEditTemplate(template)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit"
                          >
                              <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteTemplate(template)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                          >
                              <TrashIcon className="h-5 w-5" />
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
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Informasi Template Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div>
                <h4 className="font-semibold mb-3">Struktur Template:</h4>
                <ul className="space-y-2">
                  <li>• <strong>Level/Jabatan:</strong> Menentukan untuk siapa template ini</li>
                  <li>• <strong>Section 1 (Kompetensi):</strong> Pertanyaan dengan 6 kategori kompetensi (minimal 1)</li>
                  <li>• <strong>Section 2 (Semangat):</strong> Pertanyaan tentang motivasi dan semangat (minimal 1)</li>
                  <li>• <strong>Jumlah Pertanyaan:</strong> Tidak dibatasi, bisa ditambah sesuai kebutuhan</li>
              </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-3">Kategori Kompetensi:</h4>
                <ul className="space-y-1 text-sm">
                  {COMPETENCY_CATEGORIES.map((category, index) => (
                    <li key={category}>• {category}</li>
                  ))}
              </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 