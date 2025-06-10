import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc,
  deleteDoc,
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { Employee } from '@/types';

// Mock employees as fallback with new location structure
const mockEmployees: Employee[] = [
  { id: 'emp_001', name: 'Ahmad Fadli', position: 'Supervisor', location: 'LC Margahayu', division: 'Operations' },
  { id: 'emp_002', name: 'Rina Kartika', position: 'Supervisor', location: 'Central Kitchen', division: 'Finance' },
  { id: 'emp_003', name: 'Budi Santoso', position: 'Team Leader', location: 'LC Dago', division: 'IT' },
  { id: 'emp_004', name: 'Sari Dewi', position: 'Team Leader', location: 'LC Cihampelas', division: 'Marketing' },
  { id: 'emp_005', name: 'Agus Prasetyo', position: 'All Star', location: 'Head Office Bandung', division: 'Operations' },
  { id: 'emp_006', name: 'Lisa Andini', position: 'All Star', location: 'LC Pasteur', division: 'HRD' },
  { id: 'emp_007', name: 'Rio Putra', position: 'Team Leader', location: 'Warehouse Bandung', division: 'Operations' },
  { id: 'emp_008', name: 'Maya Sari', position: 'Supervisor', location: 'LC Dipatiukur', division: 'Finance' },
];

export const employeeService = {
  // Get all employees
  async getAllEmployees(): Promise<Employee[]> {
    try {
      if (!db) {
        return [...mockEmployees];
      }

      const q = query(collection(db, 'employees'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return [...mockEmployees];
      }

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees:', error);
      return [...mockEmployees];
    }
  },

  // Get employees by location
  async getEmployeesByLocation(location: string): Promise<Employee[]> {
    try {
      if (!db) {
        return mockEmployees.filter(emp => emp.location === location);
      }

      const q = query(
        collection(db, 'employees'),
        where('location', '==', location),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return mockEmployees.filter(emp => emp.location === location);
      }

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees by location:', error);
      return mockEmployees.filter(emp => emp.location === location);
    }
  },

  // Get employees by position
  async getEmployeesByPosition(position: string): Promise<Employee[]> {
    try {
      if (!db) {
        return mockEmployees.filter(emp => emp.position === position);
      }

      const q = query(
        collection(db, 'employees'),
        where('position', '==', position),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return mockEmployees.filter(emp => emp.position === position);
      }

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees by position:', error);
      return mockEmployees.filter(emp => emp.position === position);
    }
  },

  // Get employees by location and position
  async getEmployeesByLocationAndPosition(location: string, position: string): Promise<Employee[]> {
    try {
      if (!db) {
        return mockEmployees.filter(emp => 
          emp.location === location && emp.position === position
        );
      }

      const q = query(
        collection(db, 'employees'),
        where('location', '==', location),
        where('position', '==', position),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return mockEmployees.filter(emp => 
          emp.location === location && emp.position === position
        );
      }

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees by location and position:', error);
      return mockEmployees.filter(emp => 
        emp.location === location && emp.position === position
      );
    }
  },

  // Add new employee
  async addEmployee(employee: Omit<Employee, 'id'>): Promise<string> {
    try {
      if (!db) {
        // Mock implementation
        return `emp_${Date.now()}`;
      }

      const docRef = await addDoc(collection(db, 'employees'), employee);
      return docRef.id;
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  },

  // Seed initial employees to Firebase
  async seedEmployees(): Promise<void> {
    try {
      if (!db) {
        console.log('Firebase not available, skipping seed');
        return;
      }

      // Check if employees already exist
      const snapshot = await getDocs(collection(db, 'employees'));
      if (!snapshot.empty) {
        console.log('Employees already exist in Firebase');
        return;
      }

      // Add mock employees to Firebase
      const promises = mockEmployees.map(emp => 
        addDoc(collection(db, 'employees'), {
          name: emp.name,
          position: emp.position,
          location: emp.location,
          division: emp.division
        })
      );

      await Promise.all(promises);
      console.log('Successfully seeded employees to Firebase');
    } catch (error) {
      console.error('Error seeding employees:', error);
    }
  }
}; 