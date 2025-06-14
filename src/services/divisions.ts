import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Division } from '@/types';

export const divisionService = {
  // Get all divisions
  async getAllDivisions(): Promise<Division[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const divisionsRef = collection(db, 'divisions');
      const q = query(divisionsRef, orderBy('name'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Division[];
    } catch (error) {
      console.error('Error fetching divisions:', error);
      throw error;
    }
  },

  // Get active divisions only
  async getActiveDivisions(): Promise<Division[]> {
    const allDivisions = await this.getAllDivisions();
    return allDivisions.filter(division => division.isActive);
  },

  // Add new division
  async addDivision(division: Omit<Division, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'divisions'), {
        ...division,
        createdAt: now,
        updatedAt: now
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding division:', error);
      throw error;
    }
  },

  // Update division
  async updateDivision(id: string, updates: Partial<Division>): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const divisionRef = doc(db, 'divisions', id);
      await updateDoc(divisionRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating division:', error);
      throw error;
    }
  },

  // Delete division
  async deleteDivision(id: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const divisionRef = doc(db, 'divisions', id);
      await deleteDoc(divisionRef);
    } catch (error) {
      console.error('Error deleting division:', error);
      throw error;
    }
  }
}; 