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

export const employeeService = {
  // Get all employees
  async getAllEmployees(): Promise<Employee[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(collection(db, 'employees'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees:', error);
      throw error;
    }
  },

  // Get employees by location
  async getEmployeesByLocation(location: string): Promise<Employee[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(
        collection(db, 'employees'),
        where('location', '==', location),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees by location:', error);
      throw error;
    }
  },

  // Get employees by position
  async getEmployeesByPosition(position: string): Promise<Employee[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(
        collection(db, 'employees'),
        where('position', '==', position),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees by position:', error);
      throw error;
    }
  },

  // Get employees by location and position
  async getEmployeesByLocationAndPosition(location: string, position: string): Promise<Employee[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(
        collection(db, 'employees'),
        where('location', '==', location),
        where('position', '==', position),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees by location and position:', error);
      throw error;
    }
  },

  // Add new employee
  async addEmployee(employee: Omit<Employee, 'id'>): Promise<string> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const docRef = await addDoc(collection(db, 'employees'), employee);
      return docRef.id;
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  },

  // Update employee
  async updateEmployee(id: string, employee: Partial<Employee>): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const employeeRef = doc(db, 'employees', id);
      await updateDoc(employeeRef, employee);
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
      }
  },

  // Delete employee
  async deleteEmployee(id: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const employeeRef = doc(db, 'employees', id);
      await deleteDoc(employeeRef);
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }
}; 