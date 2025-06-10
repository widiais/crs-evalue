import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { CriteriaTemplate } from '@/types';
import { COMPETENCY_CATEGORIES, RECOMMENDATION_OPTIONS } from '@/constants/templates';

// Mock templates as fallback
const mockTemplates: CriteriaTemplate[] = [
  {
    id: 'template_supervisor',
    level: 'Supervisor',
    section1: [
      { text: 'Kemampuan teknis dalam menjalankan tugas', category: 'Functional Competency' },
      { text: 'Pemahaman terhadap prosedur kerja', category: 'Functional Competency' },
      { text: 'Kemampuan komunikasi yang efektif', category: 'Soft Skill' },
      { text: 'Kemampuan bekerja dalam tim', category: 'Soft Skill' },
      { text: 'Inisiatif dalam menyelesaikan masalah', category: 'Leadership dan Managerial' },
      { text: 'Kemampuan mengambil keputusan', category: 'Leadership dan Managerial' }
    ],
    section2: [
      { text: 'Semangat dalam bekerja', category: 'semangat' },
      { text: 'Kedisiplinan waktu', category: 'semangat' },
      { text: 'Tanggung jawab terhadap tugas', category: 'semangat' },
      { text: 'Kerjasama dengan rekan kerja', category: 'semangat' },
      { text: 'Loyalitas terhadap perusahaan', category: 'semangat' },
      { text: 'Kemampuan adaptasi', category: 'semangat' },
      { text: 'Motivasi untuk berkembang', category: 'semangat' }
    ],
    section3: {
      type: 'fixed_options',
      options: [...RECOMMENDATION_OPTIONS]
    }
  },
  {
    id: 'template_team_leader',
    level: 'Team Leader',
    section1: [
      { text: 'Kepemimpinan dalam mengelola tim', category: 'Leadership dan Managerial' },
      { text: 'Kemampuan memberikan arahan yang jelas', category: 'Leadership dan Managerial' },
      { text: 'Kemampuan teknis sesuai bidang', category: 'Functional Competency' },
      { text: 'Kemampuan analisis dan problem solving', category: 'Problem Solving & Analytical Thinking' },
      { text: 'Kemampuan komunikasi interpersonal', category: 'Soft Skill' },
      { text: 'Komitmen terhadap nilai perusahaan', category: 'Culture Fit and Commitment' }
    ],
    section2: [
      { text: 'Semangat memimpin dan memotivasi tim', category: 'semangat' },
      { text: 'Konsistensi dalam memberikan contoh', category: 'semangat' },
      { text: 'Tanggung jawab terhadap hasil tim', category: 'semangat' },
      { text: 'Kemampuan bekerja di bawah tekanan', category: 'semangat' },
      { text: 'Inisiatif untuk mengembangkan anggota tim', category: 'semangat' },
      { text: 'Loyalitas dan dedikasi', category: 'semangat' }
    ],
    section3: {
      type: 'fixed_options',
      options: [...RECOMMENDATION_OPTIONS]
    }
  }
];

export const templateService = {
  // Get all templates
  async getAllTemplates(): Promise<CriteriaTemplate[]> {
    try {
      if (!db) {
        return [...mockTemplates];
      }

      const q = query(collection(db, 'criteria_templates'), orderBy('level'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return [...mockTemplates];
      }

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CriteriaTemplate[];
    } catch (error) {
      console.error('Error getting templates:', error);
      return [...mockTemplates];
    }
  },

  // Get template by ID
  async getTemplateById(id: string): Promise<CriteriaTemplate | null> {
    try {
      if (!db) {
        return mockTemplates.find(t => t.id === id) || null;
      }

      const docRef = doc(db, 'criteria_templates', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return mockTemplates.find(t => t.id === id) || null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as CriteriaTemplate;
    } catch (error) {
      console.error('Error getting template:', error);
      return mockTemplates.find(t => t.id === id) || null;
    }
  },

  // Create new template
  async createTemplate(template: Omit<CriteriaTemplate, 'id'>): Promise<string> {
    try {
      if (!db) {
        const newTemplate: CriteriaTemplate = {
          ...template,
          id: `template_${Date.now()}`
        };
        mockTemplates.push(newTemplate);
        return newTemplate.id;
      }

      const docRef = await addDoc(collection(db, 'criteria_templates'), template);
      console.log('Template created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  // Update template
  async updateTemplate(id: string, updates: Partial<Omit<CriteriaTemplate, 'id'>>): Promise<void> {
    try {
      if (!db) {
        console.log('Mock update template:', id, updates);
        const index = mockTemplates.findIndex(t => t.id === id);
        if (index >= 0) {
          mockTemplates[index] = { ...mockTemplates[index], ...updates };
        }
        return;
      }

      const templateRef = doc(db, 'criteria_templates', id);
      await updateDoc(templateRef, updates);
      
      console.log('Template updated:', id);
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  // Delete template
  async deleteTemplate(id: string): Promise<void> {
    try {
      if (!db) {
        console.log('Mock delete template:', id);
        const index = mockTemplates.findIndex(t => t.id === id);
        if (index >= 0) {
          mockTemplates.splice(index, 1);
        }
        return;
      }

      const templateRef = doc(db, 'criteria_templates', id);
      await deleteDoc(templateRef);
      
      console.log('Template deleted:', id);
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  },

  // Seed default templates
  async seedTemplates(): Promise<void> {
    try {
      const existingTemplates = await this.getAllTemplates();
      
      // Only seed if no real Firebase templates exist
      const realTemplates = existingTemplates.filter(t => 
        !t.id.startsWith('template_supervisor') && !t.id.startsWith('template_team_leader')
      );
      
      if (realTemplates.length > 0) {
        console.log('Templates already exist in Firebase');
        return;
      }

      if (!db) {
        console.log('Firebase not available, using mock templates');
        return;
      }

      for (const template of mockTemplates) {
        const { id, ...templateData } = template;
        await addDoc(collection(db, 'criteria_templates'), templateData);
      }

      console.log('✅ Default templates seeded successfully');
    } catch (error) {
      console.error('❌ Error seeding templates:', error);
    }
  }
}; 