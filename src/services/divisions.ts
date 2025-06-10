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

export interface Division {
  id: string;
  name: string;
  description?: string;
  head?: string; // Division Head name
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mock divisions as fallback
const mockDivisions: Division[] = [
  {
    id: 'div_001',
    name: 'HRD',
    description: 'Human Resources Development',
    head: 'Sarah Indira',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'div_002', 
    name: 'Finance',
    description: 'Financial Management & Accounting',
    head: 'Ahmad Reza',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'div_003',
    name: 'Operations',
    description: 'Daily Operations & Store Management',
    head: 'Budi Santoso',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'div_004',
    name: 'Marketing',
    description: 'Marketing & Business Development',
    head: 'Linda Wijaya',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'div_005',
    name: 'IT',
    description: 'Information Technology & Systems',
    head: 'Rio Pratama',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'div_006',
    name: 'Quality Assurance',
    description: 'Product Quality Control & Standards',
    head: 'Maya Sari',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'div_007',
    name: 'Procurement',
    description: 'Purchasing & Supply Chain Management',
    head: 'Agus Prasetyo',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'div_008',
    name: 'Legal',
    description: 'Legal Affairs & Compliance',
    head: 'Rina Kartika',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const divisionService = {
  // Get all divisions
  async getAllDivisions(): Promise<Division[]> {
    try {
      if (!db) {
        console.log('Firebase not available, using mock data');
        return mockDivisions;
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
      return mockDivisions;
    }
  },

  // Get active divisions only
  async getActiveDivisions(): Promise<Division[]> {
    const allDivisions = await this.getAllDivisions();
    return allDivisions.filter(division => division.isActive);
  },

  // Add new division
  async addDivision(divisionData: Omit<Division, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      if (!db) {
        console.log('Firebase not available, cannot add division');
        return 'mock_id_' + Date.now();
      }

      const divisionsRef = collection(db, 'divisions');
      const newDivision = {
        ...divisionData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(divisionsRef, newDivision);
      return docRef.id;
    } catch (error) {
      console.error('Error adding division:', error);
      throw error;
    }
  },

  // Update division
  async updateDivision(id: string, divisionData: Partial<Division>): Promise<void> {
    try {
      if (!db) {
        console.log('Firebase not available, cannot update division');
        return;
      }

      const divisionRef = doc(db, 'divisions', id);
      const updateData = {
        ...divisionData,
        updatedAt: new Date()
      };

      await updateDoc(divisionRef, updateData);
    } catch (error) {
      console.error('Error updating division:', error);
      throw error;
    }
  },

  // Delete division
  async deleteDivision(id: string): Promise<void> {
    try {
      if (!db) {
        console.log('Firebase not available, cannot delete division');
        return;
      }

      const divisionRef = doc(db, 'divisions', id);
      await deleteDoc(divisionRef);
    } catch (error) {
      console.error('Error deleting division:', error);
      throw error;
    }
  },

  // Seed sample divisions
  async seedSampleDivisions(): Promise<void> {
    try {
      console.log('🌱 Seeding sample divisions...');
      
      for (const division of mockDivisions) {
        const { id, ...divisionData } = division;
        await this.addDivision(divisionData);
        console.log(`✅ Added division: ${division.name}`);
      }
      
      console.log('🎉 Division seeding completed!');
    } catch (error) {
      console.error('❌ Error seeding divisions:', error);
      throw error;
    }
  }
}; 