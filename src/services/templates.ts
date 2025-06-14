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

export const templateService = {
  // Get all templates
  async getAllTemplates(): Promise<CriteriaTemplate[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(collection(db, 'criteria_templates'), orderBy('level', 'asc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CriteriaTemplate[];
    } catch (error) {
      console.error('Error getting templates:', error);
      throw error;
    }
  },

  // Get template by ID
  async getTemplateById(id: string): Promise<CriteriaTemplate | null> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const docRef = doc(db, 'criteria_templates', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as CriteriaTemplate;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting template by ID:', error);
      throw error;
    }
  },

  // Get templates by level
  async getTemplatesByLevel(level: string): Promise<CriteriaTemplate[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(
        collection(db, 'criteria_templates'),
        orderBy('level', 'asc')
      );
      const snapshot = await getDocs(q);
      
      const templates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CriteriaTemplate[];
      
      return templates.filter(template => template.level === level);
    } catch (error) {
      console.error('Error getting templates by level:', error);
      throw error;
    }
  },

  // Add new template
  async addTemplate(template: Omit<CriteriaTemplate, 'id'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const docRef = await addDoc(collection(db, 'criteria_templates'), template);
      return docRef.id;
    } catch (error) {
      console.error('Error adding template:', error);
      throw error;
    }
  },

  // Update template
  async updateTemplate(id: string, template: Partial<CriteriaTemplate>): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const templateRef = doc(db, 'criteria_templates', id);
      await updateDoc(templateRef, template);
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  // Delete template
  async deleteTemplate(id: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const templateRef = doc(db, 'criteria_templates', id);
      await deleteDoc(templateRef);
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
}; 