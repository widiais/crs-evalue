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
import { Location } from '@/types';

export const locationService = {
  // Get all locations
  async getAllLocations(): Promise<Location[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(collection(db, 'locations'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Location[];
    } catch (error) {
      console.error('Error getting locations:', error);
      throw error;
    }
  },

  // Add new location
  async addLocation(location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'locations'), {
        ...location,
        createdAt: now,
        updatedAt: now
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  },

  // Update location
  async updateLocation(id: string, updates: Partial<Location>): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const locationRef = doc(db, 'locations', id);
      await updateDoc(locationRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  },

  // Delete location
  async deleteLocation(id: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const locationRef = doc(db, 'locations', id);
      await deleteDoc(locationRef);
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  }
}; 