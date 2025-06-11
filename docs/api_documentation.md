# 📡 API Documentation - CRS Web App

## 📋 Table of Contents
- [Overview](#overview)
- [Firebase Services](#firebase-services)
- [Assessment Service](#assessment-service)
- [Employee Service](#employee-service)
- [Template Service](#template-service)
- [Location Service](#location-service)
- [Division Service](#division-service)
- [Results Service](#results-service)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## 🎯 Overview

CRS Web App menggunakan **Firebase Firestore** sebagai backend serverless. Semua operasi data dilakukan melalui Firebase SDK dengan service layer abstraction untuk kemudahan maintenance dan consistency.

### Architecture Pattern
```
Component → Service Layer → Firebase SDK → Firestore
```

### Base Configuration
```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

---

## 🔥 Firebase Services

### Core Firebase Operations

```typescript
// src/utils/firebase.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export const firebaseUtils = {
  // Create document with auto-generated ID
  async create<T>(collectionName: string, data: Partial<T>): Promise<string> {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Update existing document
  async update<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  // Delete document
  async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  },

  // Get single document
  async getById<T>(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  },

  // Get all documents in collection
  async getAll<T>(collectionName: string): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }
};
```

---

## 📊 Assessment Service

### Interface Definition

```typescript
// src/types/assessment.ts
export interface Assessment {
  id: string;
  title: string;
  description?: string;
  templateIds: string[];
  pin: string;
  isActive: boolean;
  startDate?: Timestamp;
  endDate?: Timestamp;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt?: Timestamp;
  updatedBy?: string;
}

export interface CreateAssessmentRequest {
  title: string;
  description?: string;
  templateIds: string[];
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateAssessmentRequest {
  title?: string;
  description?: string;
  templateIds?: string[];
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}
```

### Service Implementation

```typescript
// src/services/assessments.ts
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export const assessmentService = {
  /**
   * Create new assessment
   * @param data Assessment creation data
   * @returns Promise<Assessment>
   */
  async createAssessment(data: CreateAssessmentRequest): Promise<Assessment> {
    try {
      const pin = await generateUniquePin();
      
      const assessmentData = {
        title: data.title,
        description: data.description || '',
        templateIds: data.templateIds,
        pin,
        isActive: true,
        startDate: data.startDate ? Timestamp.fromDate(data.startDate) : null,
        endDate: data.endDate ? Timestamp.fromDate(data.endDate) : null,
        createdAt: serverTimestamp(),
        createdBy: 'admin' // TODO: Replace with actual user ID
      };

      const docRef = await addDoc(collection(db, 'assessments'), assessmentData);
      
      return {
        id: docRef.id,
        ...assessmentData,
        createdAt: Timestamp.now(), // For immediate return
      } as Assessment;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw new Error('Failed to create assessment');
    }
  },

  /**
   * Get all assessments
   * @returns Promise<Assessment[]>
   */
  async getAllAssessments(): Promise<Assessment[]> {
    try {
      const q = query(
        collection(db, 'assessments'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assessment[];
    } catch (error) {
      console.error('Error getting assessments:', error);
      throw new Error('Failed to get assessments');
    }
  },

  /**
   * Get assessment by ID
   * @param id Assessment ID
   * @returns Promise<Assessment | null>
   */
  async getAssessmentById(id: string): Promise<Assessment | null> {
    try {
      const docRef = doc(db, 'assessments', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Assessment;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting assessment by ID:', error);
      throw new Error('Failed to get assessment');
    }
  },

  /**
   * Get assessment by PIN
   * @param pin Assessment PIN
   * @returns Promise<Assessment | null>
   */
  async getAssessmentByPin(pin: string): Promise<Assessment | null> {
    try {
      const q = query(
        collection(db, 'assessments'),
        where('pin', '==', pin),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as Assessment;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting assessment by PIN:', error);
      throw new Error('Failed to get assessment by PIN');
    }
  },

  /**
   * Update assessment
   * @param id Assessment ID
   * @param data Update data
   * @returns Promise<void>
   */
  async updateAssessment(id: string, data: UpdateAssessmentRequest): Promise<void> {
    try {
      const docRef = doc(db, 'assessments', id);
      
      const updateData: any = {
        ...data,
        updatedAt: serverTimestamp(),
        updatedBy: 'admin' // TODO: Replace with actual user ID
      };

      // Convert dates to Timestamps if provided
      if (data.startDate) {
        updateData.startDate = Timestamp.fromDate(data.startDate);
      }
      if (data.endDate) {
        updateData.endDate = Timestamp.fromDate(data.endDate);
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw new Error('Failed to update assessment');
    }
  },

  /**
   * Delete assessment
   * @param id Assessment ID
   * @returns Promise<void>
   */
  async deleteAssessment(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'assessments', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw new Error('Failed to delete assessment');
    }
  },

  /**
   * Get active assessments only
   * @returns Promise<Assessment[]>
   */
  async getActiveAssessments(): Promise<Assessment[]> {
    try {
      const q = query(
        collection(db, 'assessments'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assessment[];
    } catch (error) {
      console.error('Error getting active assessments:', error);
      throw new Error('Failed to get active assessments');
    }
  }
};

/**
 * Generate unique PIN for assessment
 * @returns Promise<string>
 */
async function generateUniquePin(): Promise<string> {
  const generatePin = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  let pin = generatePin();
  let isUnique = false;

  while (!isUnique) {
    const existing = await assessmentService.getAssessmentByPin(pin);
    if (!existing) {
      isUnique = true;
    } else {
      pin = generatePin();
    }
  }

  return pin;
}
```

---

## 👥 Employee Service

### Interface Definition

```typescript
// src/types/employee.ts
export interface Employee {
  id: string;
  name: string;
  position: string;
  location: string;
  division: string;
  email?: string;
  employeeNumber?: string;
  isActive: boolean;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt?: Timestamp;
}

export interface CreateEmployeeRequest {
  name: string;
  position: string;
  location: string;
  division: string;
  email?: string;
  employeeNumber?: string;
}

export interface UpdateEmployeeRequest {
  name?: string;
  position?: string;
  location?: string;
  division?: string;
  email?: string;
  employeeNumber?: string;
  isActive?: boolean;
}
```

### Service Implementation

```typescript
// src/services/employees.ts
export const employeeService = {
  /**
   * Create new employee
   * @param data Employee creation data
   * @returns Promise<Employee>
   */
  async createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
    try {
      const employeeData = {
        ...data,
        isActive: true,
        createdAt: serverTimestamp(),
        createdBy: 'admin'
      };

      const docRef = await addDoc(collection(db, 'employees'), employeeData);
      
      return {
        id: docRef.id,
        ...employeeData,
        createdAt: Timestamp.now(),
      } as Employee;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw new Error('Failed to create employee');
    }
  },

  /**
   * Get all employees
   * @returns Promise<Employee[]>
   */
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const q = query(
        collection(db, 'employees'),
        orderBy('name', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees:', error);
      throw new Error('Failed to get employees');
    }
  },

  /**
   * Get employees by location
   * @param location Location name
   * @returns Promise<Employee[]>
   */
  async getEmployeesByLocation(location: string): Promise<Employee[]> {
    try {
      const q = query(
        collection(db, 'employees'),
        where('location', '==', location),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees by location:', error);
      throw new Error('Failed to get employees by location');
    }
  },

  /**
   * Get employees by position
   * @param position Position name
   * @returns Promise<Employee[]>
   */
  async getEmployeesByPosition(position: string): Promise<Employee[]> {
    try {
      const q = query(
        collection(db, 'employees'),
        where('position', '==', position),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees by position:', error);
      throw new Error('Failed to get employees by position');
    }
  },

  /**
   * Get employees by location and position
   * @param location Location name
   * @param position Position name
   * @returns Promise<Employee[]>
   */
  async getEmployeesByLocationAndPosition(location: string, position: string): Promise<Employee[]> {
    try {
      const q = query(
        collection(db, 'employees'),
        where('location', '==', location),
        where('position', '==', position),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
    } catch (error) {
      console.error('Error getting employees by location and position:', error);
      throw new Error('Failed to get employees by location and position');
    }
  },

  /**
   * Update employee
   * @param id Employee ID
   * @param data Update data
   * @returns Promise<void>
   */
  async updateEmployee(id: string, data: UpdateEmployeeRequest): Promise<void> {
    try {
      const docRef = doc(db, 'employees', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      throw new Error('Failed to update employee');
    }
  },

  /**
   * Delete employee
   * @param id Employee ID
   * @returns Promise<void>
   */
  async deleteEmployee(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'employees', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw new Error('Failed to delete employee');
    }
  }
};
```

---

## 📋 Template Service

### Interface Definition

```typescript
// src/types/template.ts
export interface Question {
  text: string;
  category?: string; // Only for Section 1
}

export interface RecommendationSection {
  type: 'fixed_options';
  label: string;
  options: string[];
}

export interface CriteriaTemplate {
  id: string;
  level: string;
  description?: string;
  section1: Question[];
  section2: Question[];
  section3: RecommendationSection;
  createdAt: Timestamp;
  createdBy: string;
  isActive: boolean;
  version: string;
  updatedAt?: Timestamp;
}

export interface CreateTemplateRequest {
  level: string;
  description?: string;
  section1: Question[];
  section2: Question[];
}

export interface UpdateTemplateRequest {
  level?: string;
  description?: string;
  section1?: Question[];
  section2?: Question[];
  isActive?: boolean;
}
```

### Service Implementation

```typescript
// src/services/templates.ts
import { RECOMMENDATION_OPTIONS } from '@/constants/templates';

export const templateService = {
  /**
   * Create new template
   * @param data Template creation data
   * @returns Promise<CriteriaTemplate>
   */
  async addTemplate(data: CreateTemplateRequest): Promise<CriteriaTemplate> {
    try {
      const templateData = {
        ...data,
        section3: {
          type: 'fixed_options' as const,
          label: 'Rekomendasi Evaluator',
          options: [...RECOMMENDATION_OPTIONS]
        },
        isActive: true,
        version: '1.0',
        createdAt: serverTimestamp(),
        createdBy: 'admin'
      };

      const docRef = await addDoc(collection(db, 'criteria_templates'), templateData);
      
      return {
        id: docRef.id,
        ...templateData,
        createdAt: Timestamp.now(),
      } as CriteriaTemplate;
    } catch (error) {
      console.error('Error creating template:', error);
      throw new Error('Failed to create template');
    }
  },

  /**
   * Get all templates
   * @returns Promise<CriteriaTemplate[]>
   */
  async getAllTemplates(): Promise<CriteriaTemplate[]> {
    try {
      const q = query(
        collection(db, 'criteria_templates'),
        orderBy('level', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CriteriaTemplate[];
    } catch (error) {
      console.error('Error getting templates:', error);
      throw new Error('Failed to get templates');
    }
  },

  /**
   * Get template by ID
   * @param id Template ID
   * @returns Promise<CriteriaTemplate | null>
   */
  async getTemplateById(id: string): Promise<CriteriaTemplate | null> {
    try {
      const docRef = doc(db, 'criteria_templates', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as CriteriaTemplate;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting template by ID:', error);
      throw new Error('Failed to get template');
    }
  },

  /**
   * Get templates by level
   * @param level Template level
   * @returns Promise<CriteriaTemplate[]>
   */
  async getTemplatesByLevel(level: string): Promise<CriteriaTemplate[]> {
    try {
      const q = query(
        collection(db, 'criteria_templates'),
        where('level', '==', level),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CriteriaTemplate[];
    } catch (error) {
      console.error('Error getting templates by level:', error);
      throw new Error('Failed to get templates by level');
    }
  },

  /**
   * Update template
   * @param id Template ID
   * @param data Update data
   * @returns Promise<void>
   */
  async updateTemplate(id: string, data: UpdateTemplateRequest): Promise<void> {
    try {
      const docRef = doc(db, 'criteria_templates', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating template:', error);
      throw new Error('Failed to update template');
    }
  },

  /**
   * Delete template
   * @param id Template ID
   * @returns Promise<void>
   */
  async deleteTemplate(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'criteria_templates', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting template:', error);
      throw new Error('Failed to delete template');
    }
  },

  /**
   * Get active templates only
   * @returns Promise<CriteriaTemplate[]>
   */
  async getActiveTemplates(): Promise<CriteriaTemplate[]> {
    try {
      const q = query(
        collection(db, 'criteria_templates'),
        where('isActive', '==', true),
        orderBy('level', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CriteriaTemplate[];
    } catch (error) {
      console.error('Error getting active templates:', error);
      throw new Error('Failed to get active templates');
    }
  }
};
```

---

## 📍 Location Service

### Interface Definition

```typescript
// src/types/location.ts
export interface Location {
  id: string;
  name: string;
  city?: string;
  address?: string;
  category: 'Head Office' | 'Store' | 'Warehouse' | 'Branch';
  isActive: boolean;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt?: Timestamp;
}

export interface CreateLocationRequest {
  name: string;
  city?: string;
  address?: string;
  category: 'Head Office' | 'Store' | 'Warehouse' | 'Branch';
}
```

### Service Implementation

```typescript
// src/services/locations.ts
export const locationService = {
  /**
   * Create new location
   * @param data Location creation data
   * @returns Promise<Location>
   */
  async createLocation(data: CreateLocationRequest): Promise<Location> {
    try {
      const locationData = {
        ...data,
        isActive: true,
        createdAt: serverTimestamp(),
        createdBy: 'admin'
      };

      const docRef = await addDoc(collection(db, 'locations'), locationData);
      
      return {
        id: docRef.id,
        ...locationData,
        createdAt: Timestamp.now(),
      } as Location;
    } catch (error) {
      console.error('Error creating location:', error);
      throw new Error('Failed to create location');
    }
  },

  /**
   * Get all locations
   * @returns Promise<Location[]>
   */
  async getAllLocations(): Promise<Location[]> {
    try {
      const q = query(
        collection(db, 'locations'),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Location[];
    } catch (error) {
      console.error('Error getting locations:', error);
      throw new Error('Failed to get locations');
    }
  },

  /**
   * Update location
   * @param id Location ID
   * @param data Update data
   * @returns Promise<void>
   */
  async updateLocation(id: string, data: Partial<CreateLocationRequest>): Promise<void> {
    try {
      const docRef = doc(db, 'locations', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating location:', error);
      throw new Error('Failed to update location');
    }
  },

  /**
   * Delete location
   * @param id Location ID
   * @returns Promise<void>
   */
  async deleteLocation(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'locations', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting location:', error);
      throw new Error('Failed to delete location');
    }
  }
};
```

---

## 🏢 Division Service

### Interface Definition

```typescript
// src/types/division.ts
export interface Division {
  id: string;
  name: string;
  description?: string;
  head?: string;
  isActive: boolean;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt?: Timestamp;
}

export interface CreateDivisionRequest {
  name: string;
  description?: string;
  head?: string;
}
```

### Service Implementation

```typescript
// src/services/divisions.ts
export const divisionService = {
  /**
   * Create new division
   * @param data Division creation data
   * @returns Promise<Division>
   */
  async createDivision(data: CreateDivisionRequest): Promise<Division> {
    try {
      const divisionData = {
        ...data,
        isActive: true,
        createdAt: serverTimestamp(),
        createdBy: 'admin'
      };

      const docRef = await addDoc(collection(db, 'divisions'), divisionData);
      
      return {
        id: docRef.id,
        ...divisionData,
        createdAt: Timestamp.now(),
      } as Division;
    } catch (error) {
      console.error('Error creating division:', error);
      throw new Error('Failed to create division');
    }
  },

  /**
   * Get all divisions
   * @returns Promise<Division[]>
   */
  async getAllDivisions(): Promise<Division[]> {
    try {
      const q = query(
        collection(db, 'divisions'),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Division[];
    } catch (error) {
      console.error('Error getting divisions:', error);
      throw new Error('Failed to get divisions');
    }
  },

  /**
   * Update division
   * @param id Division ID
   * @param data Update data
   * @returns Promise<void>
   */
  async updateDivision(id: string, data: Partial<CreateDivisionRequest>): Promise<void> {
    try {
      const docRef = doc(db, 'divisions', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating division:', error);
      throw new Error('Failed to update division');
    }
  },

  /**
   * Delete division
   * @param id Division ID
   * @returns Promise<void>
   */
  async deleteDivision(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'divisions', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting division:', error);
      throw new Error('Failed to delete division');
    }
  }
};
```

---

## 📊 Results Service

### Interface Definition

```typescript
// src/types/results.ts
export interface EmployeeRef {
  id: string;
  name: string;
  position: string;
  location: string;
}

export interface EvaluatorData {
  name: string;
  position: string;
  division: string;
  relationshipStatus: string;
}

export interface CategoryScore {
  category: string;
  scores: number[];
  average: number;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  targetUser: EmployeeRef;
  evaluator: EvaluatorData;
  templateId: string;
  scores: CategoryScore[];
  semangatScores: number[];
  recommendation: string;
  submittedAt: Timestamp;
  ipAddress?: string;
}

export interface CreateResultRequest {
  assessmentId: string;
  targetUser: EmployeeRef;
  evaluator: EvaluatorData;
  templateId: string;
  scores: CategoryScore[];
  semangatScores: number[];
  recommendation: string;
}
```

### Service Implementation

```typescript
// src/services/results.ts
export const resultService = {
  /**
   * Submit assessment result
   * @param data Result submission data
   * @returns Promise<AssessmentResult>
   */
  async submitResult(data: CreateResultRequest): Promise<AssessmentResult> {
    try {
      // Check for duplicate submission
      const isDuplicate = await this.hasEvaluatorAssessedTarget(
        data.assessmentId,
        data.evaluator.name,
        data.targetUser.id
      );

      if (isDuplicate) {
        throw new Error('You have already assessed this employee in this session');
      }

      const resultData = {
        ...data,
        submittedAt: serverTimestamp(),
        ipAddress: typeof window !== 'undefined' ? 
          await fetch('https://api.ipify.org?format=text').then(res => res.text()).catch(() => 'unknown') : 
          'unknown'
      };

      const docRef = await addDoc(collection(db, 'assessment_results'), resultData);
      
      return {
        id: docRef.id,
        ...resultData,
        submittedAt: Timestamp.now(),
      } as AssessmentResult;
    } catch (error) {
      console.error('Error submitting result:', error);
      throw error;
    }
  },

  /**
   * Check if evaluator has already assessed target in this assessment
   * @param assessmentId Assessment ID
   * @param evaluatorName Evaluator name
   * @param targetUserId Target user ID
   * @returns Promise<boolean>
   */
  async hasEvaluatorAssessedTarget(
    assessmentId: string,
    evaluatorName: string,
    targetUserId: string
  ): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'assessment_results'),
        where('assessmentId', '==', assessmentId),
        where('evaluator.name', '==', evaluatorName),
        where('targetUser.id', '==', targetUserId)
      );
      
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking duplicate assessment:', error);
      return false;
    }
  },

  /**
   * Get results by assessment ID
   * @param assessmentId Assessment ID
   * @returns Promise<AssessmentResult[]>
   */
  async getResultsByAssessmentId(assessmentId: string): Promise<AssessmentResult[]> {
    try {
      const q = query(
        collection(db, 'assessment_results'),
        where('assessmentId', '==', assessmentId),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AssessmentResult[];
    } catch (error) {
      console.error('Error getting results by assessment ID:', error);
      throw new Error('Failed to get assessment results');
    }
  },

  /**
   * Get results by employee ID
   * @param employeeId Employee ID
   * @returns Promise<AssessmentResult[]>
   */
  async getResultsByEmployeeId(employeeId: string): Promise<AssessmentResult[]> {
    try {
      const q = query(
        collection(db, 'assessment_results'),
        where('targetUser.id', '==', employeeId),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AssessmentResult[];
    } catch (error) {
      console.error('Error getting results by employee ID:', error);
      throw new Error('Failed to get employee results');
    }
  },

  /**
   * Get all assessment results
   * @returns Promise<AssessmentResult[]>
   */
  async getAllResults(): Promise<AssessmentResult[]> {
    try {
      const q = query(
        collection(db, 'assessment_results'),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AssessmentResult[];
    } catch (error) {
      console.error('Error getting all results:', error);
      throw new Error('Failed to get assessment results');
    }
  }
};
```

---

## ⚠️ Error Handling

### Error Types

```typescript
// src/types/errors.ts
export enum ErrorCodes {
  FIREBASE_ERROR = 'FIREBASE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_ERROR = 'DUPLICATE_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

export interface CRSError {
  code: ErrorCodes;
  message: string;
  details?: any;
}
```

### Error Handler

```typescript
// src/utils/errorHandler.ts
import { FirebaseError } from 'firebase/app';

export const handleFirebaseError = (error: any): CRSError => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'permission-denied':
        return {
          code: ErrorCodes.PERMISSION_DENIED,
          message: 'You do not have permission to perform this action',
          details: error
        };
        
      case 'not-found':
        return {
          code: ErrorCodes.NOT_FOUND,
          message: 'The requested resource was not found',
          details: error
        };
        
      case 'network-request-failed':
        return {
          code: ErrorCodes.NETWORK_ERROR,
          message: 'Network error. Please check your connection and try again',
          details: error
        };
        
      default:
        return {
          code: ErrorCodes.FIREBASE_ERROR,
          message: error.message || 'An unexpected error occurred',
          details: error
        };
    }
  }
  
  return {
    code: ErrorCodes.FIREBASE_ERROR,
    message: error.message || 'An unexpected error occurred',
    details: error
  };
};

export const handleServiceError = (error: any, operation: string): never => {
  const crsError = handleFirebaseError(error);
  console.error(`Error in ${operation}:`, crsError);
  throw new Error(crsError.message);
};
```

### Usage in Services

```typescript
// Example usage in service methods
async createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
  try {
    // ... implementation
  } catch (error) {
    handleServiceError(error, 'createEmployee');
  }
}
```

---

## 🚦 Rate Limiting

### PIN Attempt Limiting

```typescript
// src/utils/rateLimit.ts
const pinAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const rateLimitPinAttempts = (ip: string): boolean => {
  const now = Date.now();
  const attempts = pinAttempts.get(ip);
  
  if (!attempts) {
    pinAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Reset if more than 15 minutes have passed
  if (now - attempts.lastAttempt > 15 * 60 * 1000) {
    pinAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Allow up to 10 attempts per 15 minutes
  if (attempts.count >= 10) {
    return false;
  }
  
  attempts.count++;
  attempts.lastAttempt = now;
  return true;
};
```

### Usage Example

```typescript
// In PIN validation component
const handlePinSubmit = async (pin: string) => {
  const userIP = await getUserIP();
  
  if (!rateLimitPinAttempts(userIP)) {
    setError('Too many attempts. Please try again in 15 minutes.');
    return;
  }
  
  // Continue with PIN validation
};
```

---

## 📝 API Usage Examples

### Complete Assessment Flow

```typescript
// Example: Complete assessment submission flow
const submitAssessment = async (formData: any) => {
  try {
    // 1. Get assessment by PIN
    const assessment = await assessmentService.getAssessmentByPin(formData.pin);
    if (!assessment) {
      throw new Error('Invalid PIN');
    }

    // 2. Get template
    const template = await templateService.getTemplateById(formData.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // 3. Check for duplicate
    const isDuplicate = await resultService.hasEvaluatorAssessedTarget(
      assessment.id,
      formData.evaluator.name,
      formData.targetUser.id
    );
    if (isDuplicate) {
      throw new Error('Already assessed');
    }

    // 4. Submit result
    const result = await resultService.submitResult({
      assessmentId: assessment.id,
      targetUser: formData.targetUser,
      evaluator: formData.evaluator,
      templateId: template.id,
      scores: formData.scores,
      semangatScores: formData.semangatScores,
      recommendation: formData.recommendation
    });

    return result;
  } catch (error) {
    console.error('Assessment submission failed:', error);
    throw error;
  }
};
```

---

**📚 References:**
- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) 