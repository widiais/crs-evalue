import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc,
  deleteDoc,
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Location {
  id: string;
  name: string;
  city: string;
  category: 'Head Office' | 'Store';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mock locations as fallback
const mockLocations: Location[] = [
  {
    id: 'loc_1',
    name: 'LC Margahayu',
    city: 'Bandung',
    category: 'Store',
    isActive: true
  },
  {
    id: 'loc_2',
    name: 'LC Dago',
    city: 'Bandung',
    category: 'Store', 
    isActive: true
  },
  {
    id: 'loc_3',
    name: 'LC Cihampelas',
    city: 'Bandung',
    category: 'Store',
    isActive: true
  },
  {
    id: 'loc_4',
    name: 'Central Kitchen',
    city: 'Bandung',
    category: 'Head Office',
    isActive: true
  },
  {
    id: 'loc_5',
    name: 'Head Office Bandung',
    city: 'Bandung',
    category: 'Head Office',
    isActive: true
  },
  {
    id: 'loc_6',
    name: 'Warehouse Bandung',
    city: 'Bandung',
    category: 'Head Office',
    isActive: true
  }
];

export const locationService = {
  // Get all locations
  async getAllLocations(): Promise<Location[]> {
    try {
      if (!db) {
        return [...mockLocations];
      }

      const q = query(collection(db, 'locations'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return [...mockLocations];
      }

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Location[];
    } catch (error) {
      console.error('Error getting locations:', error);
      return [...mockLocations];
    }
  },

  // Add new location
  async addLocation(location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      if (!db) {
        // Mock implementation
        return `loc_${Date.now()}`;
      }

      const now = new Date();
      const docRef = await addDoc(collection(db, 'locations'), {
        ...location,
        createdAt: now,
        updatedAt: now
      });
      
      console.log('Location added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  },

  // Update location
  async updateLocation(id: string, updates: Partial<Omit<Location, 'id' | 'createdAt'>>): Promise<void> {
    try {
      if (!db) {
        console.log('Mock update location:', id, updates);
        return;
      }

      const locationRef = doc(db, 'locations', id);
      await updateDoc(locationRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      console.log('Location updated:', id);
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  },

  // Delete location
  async deleteLocation(id: string): Promise<void> {
    try {
      if (!db) {
        console.log('Mock delete location:', id);
        return;
      }

      const locationRef = doc(db, 'locations', id);
      await deleteDoc(locationRef);
      
      console.log('Location deleted:', id);
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  },

  // Seed initial locations to Firebase
  async seedLocations(): Promise<void> {
    try {
      if (!db) {
        console.log('Firebase not available, skipping seed');
        return;
      }

      // Check if locations already exist
      const snapshot = await getDocs(collection(db, 'locations'));
      if (!snapshot.empty) {
        console.log('Locations already exist in Firebase');
        return;
      }

      // Add mock locations to Firebase
      const promises = mockLocations.map(loc => 
        addDoc(collection(db, 'locations'), {
          name: loc.name,
          city: loc.city,
          category: loc.category,
          isActive: loc.isActive,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      );

      await Promise.all(promises);
      console.log('Successfully seeded locations to Firebase');
    } catch (error) {
      console.error('Error seeding locations:', error);
    }
  }
}; 