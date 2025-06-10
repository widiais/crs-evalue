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

// Keep some mock data as fallback for development
const mockAssessments: Assessment[] = [
  {
    id: 'assessment_001',
    title: 'Evaluasi Q3 Supervisor',
    templateIds: ['template_supervisor'],
    pin: 'ABC123',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    createdBy: 'admin'
  },
  {
    id: 'assessment_002', 
    title: 'Performance Review Team Leader',
    templateIds: ['template_team_leader'],
    pin: 'XYZ789',
    isActive: true,
    createdAt: new Date('2024-01-10'),
    createdBy: 'admin'
  }
];

export const assessmentService = {
  // Get assessment by PIN
  async getAssessmentByPIN(pin: string): Promise<Assessment | null> {
    try {
      if (!db) {
        // Fallback to mock data if Firebase not available
        const assessment = mockAssessments.find(a => a.pin === pin && a.isActive);
        return assessment || null;
      }

      const q = query(
        collection(db, 'assessments'),
        where('pin', '==', pin),
        where('isActive', '==', true)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        // Fallback to mock data
        const assessment = mockAssessments.find(a => a.pin === pin && a.isActive);
        return assessment || null;
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
      // Fallback to mock data
      const assessment = mockAssessments.find(a => a.pin === pin && a.isActive);
      return assessment || null;
    }
  },

  // Create new assessment
  async createAssessment(assessment: Omit<Assessment, 'id'>): Promise<string> {
    try {
      if (!db) {
        // Fallback to mock
        const newAssessment: Assessment = {
          ...assessment,
          id: `assessment_${Date.now()}`
        };
        mockAssessments.push(newAssessment);
        return newAssessment.id;
      }

      const docData = {
        ...assessment,
        createdAt: Timestamp.fromDate(assessment.createdAt),
        startDate: assessment.startDate ? Timestamp.fromDate(assessment.startDate) : null,
        endDate: assessment.endDate ? Timestamp.fromDate(assessment.endDate) : null
      };

      const docRef = await addDoc(collection(db, 'assessments'), docData);
      console.log('Assessment created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  },

  // Update assessment
  async updateAssessment(id: string, updates: Partial<Omit<Assessment, 'id' | 'createdAt'>>): Promise<void> {
    try {
      if (!db) {
        console.log('Mock update assessment:', id, updates);
        return;
      }

      const docData: any = { ...updates };
      
      // Convert dates to Firestore timestamps
      if (updates.startDate) {
        docData.startDate = Timestamp.fromDate(updates.startDate);
      }
      if (updates.endDate) {
        docData.endDate = Timestamp.fromDate(updates.endDate);
      }

      const assessmentRef = doc(db, 'assessments', id);
      await updateDoc(assessmentRef, docData);
      
      console.log('Assessment updated:', id);
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  },

  // Delete assessment
  async deleteAssessment(id: string): Promise<void> {
    try {
      if (!db) {
        console.log('Mock delete assessment:', id);
        return;
      }

      const assessmentRef = doc(db, 'assessments', id);
      await deleteDoc(assessmentRef);
      
      console.log('Assessment deleted:', id);
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  },

  // Get all assessments
  async getAllAssessments(): Promise<Assessment[]> {
    try {
      if (!db) {
        return [...mockAssessments];
      }

      const q = query(collection(db, 'assessments'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return [...mockAssessments];
      }

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
      return [...mockAssessments];
    }
  },

  // Submit assessment result
  async submitAssessmentResult(result: Omit<AssessmentResult, 'id'>): Promise<string> {
    try {
      if (!db) {
        // Mock implementation
        return `result_${Date.now()}`;
      }

      const docRef = await addDoc(collection(db, 'assessment_results'), {
        ...result,
        submittedAt: Timestamp.fromDate(result.submittedAt)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error submitting assessment result:', error);
      return `result_${Date.now()}`;
    }
  },

  // Check if evaluator already assessed target (simplified for mock)
  async hasEvaluatorAssessedTarget(
    assessmentId: string, 
    evaluatorName: string, 
    targetId: string
  ): Promise<boolean> {
    try {
      if (!db) {
        return false; // For mock, always allow
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
  },

  // Get assessment results for specific assessment
  async getAssessmentResults(assessmentId: string): Promise<AssessmentResult[]> {
    try {
      if (!db) {
        return [];
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
      return [];
    }
  },

  // Get all assessment results (for reports)
  async getAllAssessmentResults(): Promise<AssessmentResult[]> {
    try {
      if (!db) {
        return [];
      }

      const q = query(
        collection(db, 'assessment_results'),
        orderBy('submittedAt', 'desc')
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
      console.error('Error getting all assessment results:', error);
      return [];
    }
  }
}; 