import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Assessment, AssessmentResult } from '@/types';

export const assessmentService = {
  // Get assessment by PIN
  async getAssessmentByPIN(pin: string): Promise<Assessment | null> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(
        collection(db, 'assessments'),
        where('pin', '==', pin),
        where('isActive', '==', true)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return null;
      }
      
      const docData = snapshot.docs[0];
      const data = docData.data();
      return { 
        id: docData.id, 
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        startDate: data.startDate?.toDate(),
        endDate: data.endDate?.toDate()
      } as Assessment;
    } catch (error) {
      console.error('Error getting assessment by PIN:', error);
      throw error;
    }
  },

  // Get all assessments
  async getAllAssessments(): Promise<Assessment[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(collection(db, 'assessments'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          startDate: data.startDate?.toDate(),
          endDate: data.endDate?.toDate()
        };
      }) as Assessment[];
    } catch (error) {
      console.error('Error getting assessments:', error);
      throw error;
    }
  },

  // Create new assessment
  async createAssessment(assessment: Omit<Assessment, 'id'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const docRef = await addDoc(collection(db, 'assessments'), {
        ...assessment,
        createdAt: Timestamp.now(),
        startDate: assessment.startDate ? Timestamp.fromDate(new Date(assessment.startDate)) : null,
        endDate: assessment.endDate ? Timestamp.fromDate(new Date(assessment.endDate)) : null
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  },

  // Update assessment
  async updateAssessment(id: string, updates: Partial<Assessment>): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const docRef = doc(db, 'assessments', id);
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.now()
      };
      
      if (updates.startDate) {
        updateData.startDate = Timestamp.fromDate(new Date(updates.startDate));
      }
      if (updates.endDate) {
        updateData.endDate = Timestamp.fromDate(new Date(updates.endDate));
      }
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  },

  // Delete assessment
  async deleteAssessment(id: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const docRef = doc(db, 'assessments', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  },

  // Submit assessment result
  async submitAssessmentResult(result: Omit<AssessmentResult, 'id'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const docRef = await addDoc(collection(db, 'assessment_results'), {
        ...result,
        submittedAt: Timestamp.now()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error submitting assessment result:', error);
      throw error;
    }
  },

  // Get assessment results for specific assessment
  async getAssessmentResults(assessmentId: string): Promise<AssessmentResult[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(
        collection(db, 'assessment_results'),
        where('assessmentId', '==', assessmentId)
      );
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt?.toDate() || new Date()
        };
      }) as AssessmentResult[];
    } catch (error) {
      console.error('Error getting assessment results:', error);
      throw error;
    }
  },

  // Get all assessment results
  async getAllAssessmentResults(): Promise<AssessmentResult[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(collection(db, 'assessment_results'), orderBy('submittedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt?.toDate() || new Date()
        };
      }) as AssessmentResult[];
    } catch (error) {
      console.error('Error getting all assessment results:', error);
      throw error;
    }
  },

  // Check if evaluator already assessed target
  async hasEvaluatorAssessedTarget(
    assessmentId: string, 
    evaluatorName: string, 
    targetId: string
  ): Promise<boolean> {
    try {
      if (!db) {
        return false; // Allow if Firebase not available
      }

      const q = query(
        collection(db, 'assessment_results'),
        where('assessmentId', '==', assessmentId),
        where('evaluator.name', '==', evaluatorName),
        where('targetUser.id', '==', targetId)
      );
      
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking duplicate assessment:', error);
      return false;
    }
  }
}; 