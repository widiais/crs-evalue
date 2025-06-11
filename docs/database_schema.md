# 🗄️ Database Schema Documentation - CRS Web App

## 📋 Table of Contents
- [Overview](#overview)
- [Collection Structure](#collection-structure)
- [Data Models](#data-models)
- [Relationships](#relationships)
- [Indexes](#indexes)
- [Security Rules](#security-rules)
- [Data Validation](#data-validation)
- [Migration Guide](#migration-guide)

---

## 🎯 Overview

CRS menggunakan **Firebase Firestore** sebagai database NoSQL dengan struktur dokumen yang fleksibel. Database dirancang untuk mendukung:
- Realtime data synchronization
- Scalable assessment system
- Multi-evaluator support
- Comprehensive reporting

### Database Naming Convention
```
Collections: snake_case (assessments, criteria_templates)
Documents: kebab-case or UUID (assessment-001, auto-generated)
Fields: camelCase (createdAt, isActive)
```

---

## 📁 Collection Structure

```
crs-firestore/
├── assessments/                    # Assessment sessions
│   └── {assessmentId}/
├── criteria_templates/             # Assessment templates
│   └── {templateId}/
├── employees/                      # Employee master data
│   └── {employeeId}/
├── locations/                      # Work locations
│   └── {locationId}/
├── divisions/                      # Company divisions
│   └── {divisionId}/
├── assessment_results/             # Assessment submissions
│   └── {resultId}/
└── audit_logs/                     # System audit trail (future)
    └── {logId}/
```

---

## 📊 Data Models

### 1. **assessments** Collection

```typescript
interface Assessment {
  id: string;                       // Document ID
  title: string;                    // Assessment session name
  description?: string;             // Optional description
  templateIds: string[];            // Array of template IDs
  pin: string;                      // 6-8 character PIN
  isActive: boolean;                // Active status
  startDate?: Timestamp;            // Optional start date  
  endDate?: Timestamp;              // Optional end date
  createdAt: Timestamp;             // Creation timestamp
  createdBy: string;                // Creator user ID
  updatedAt?: Timestamp;            // Last update timestamp
  updatedBy?: string;               // Last updater user ID
}
```

**Example Document:**
```json
{
  "id": "assessment_2024_001",
  "title": "Evaluasi Supervisor Q1 2024",
  "description": "Assessment untuk evaluasi kinerja supervisor periode Q1",
  "templateIds": ["template_supervisor", "template_team_leader"],
  "pin": "X7KZ3F",
  "isActive": true,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T23:59:59Z",
  "createdAt": "2024-01-01T10:00:00Z",
  "createdBy": "admin_001"
}
```

### 2. **criteria_templates** Collection

```typescript
interface Question {
  text: string;                     // Question text
  category?: string;                // Competency category (Section 1 only)
}

interface RecommendationSection {
  type: 'fixed_options';            // Always fixed options
  label: string;                    // Section label
  options: string[];                // Recommendation options
}

interface CriteriaTemplate {
  id: string;                       // Document ID
  level: string;                    // Job level (Supervisor, Team Leader, etc.)
  description?: string;             // Template description
  section1: Question[];             // 6 Dimensi Kompetensi questions
  section2: Question[];             // 7 Semangat Sedjati questions
  section3: RecommendationSection;  // Recommendation options
  createdAt: Timestamp;             // Creation timestamp
  createdBy: string;                // Creator user ID
  isActive: boolean;                // Template status
  version: string;                  // Template version
}
```

**Example Document:**
```json
{
  "id": "template_supervisor",
  "level": "Supervisor",
  "description": "Template assessment untuk level Supervisor",
  "section1": [
    {
      "text": "Mampu menyelesaikan tugas dengan standar kualitas tinggi",
      "category": "Functional Competency"
    },
    {
      "text": "Menunjukkan kemampuan memimpin tim dengan efektif",
      "category": "Leadership dan Managerial"
    }
  ],
  "section2": [
    {
      "text": "Menunjukkan semangat kerja yang tinggi dalam setiap tugas"
    },
    {
      "text": "Menjaga komitmen terhadap nilai-nilai perusahaan"
    }
  ],
  "section3": {
    "type": "fixed_options",
    "label": "Rekomendasi Evaluator",
    "options": [
      "Dipertahankan di Level Sekarang",
      "Layak Dipromosikan", 
      "Perlu Pembinaan Lebih Lanjut",
      "Perlu Rotasi / Penyesuaian Posisi"
    ]
  },
  "createdAt": "2024-01-01T10:00:00Z",
  "createdBy": "admin_001",
  "isActive": true,
  "version": "1.0"
}
```

### 3. **employees** Collection

```typescript
interface Employee {
  id: string;                       // Document ID
  name: string;                     // Full employee name
  position: string;                 // Job position
  location: string;                 // Work location name
  division: string;                 // Division name
  email?: string;                   // Optional email
  employeeNumber?: string;          // Optional employee ID
  isActive: boolean;                // Employee status
  createdAt: Timestamp;             // Creation timestamp
  createdBy: string;                // Creator user ID
  updatedAt?: Timestamp;            // Last update timestamp
}
```

**Example Document:**
```json
{
  "id": "emp_001",
  "name": "Ahmad Fadli Rahman",
  "position": "Supervisor",
  "location": "Jakarta Timur",
  "division": "Operations",
  "email": "ahmad.fadli@sedjati.com",
  "employeeNumber": "EMP2024001",
  "isActive": true,
  "createdAt": "2024-01-01T10:00:00Z",
  "createdBy": "admin_001"
}
```

### 4. **locations** Collection

```typescript
interface Location {
  id: string;                       // Document ID
  name: string;                     // Location name
  city?: string;                    // City name
  address?: string;                 // Full address
  category: 'Head Office' | 'Store' | 'Warehouse' | 'Branch';
  isActive: boolean;                // Location status
  createdAt: Timestamp;             // Creation timestamp
  createdBy: string;                // Creator user ID
}
```

**Example Document:**
```json
{
  "id": "loc_001",
  "name": "Jakarta Timur",
  "city": "Jakarta",
  "address": "Jl. Raya Jakarta Timur No. 123",
  "category": "Store",
  "isActive": true,
  "createdAt": "2024-01-01T10:00:00Z",
  "createdBy": "admin_001"
}
```

### 5. **divisions** Collection

```typescript
interface Division {
  id: string;                       // Document ID
  name: string;                     // Division name
  description?: string;             // Division description
  head?: string;                    // Division head name
  isActive: boolean;                // Division status
  createdAt: Timestamp;             // Creation timestamp
  createdBy: string;                // Creator user ID
}
```

**Example Document:**
```json
{
  "id": "div_001",
  "name": "Operations",
  "description": "Divisi operasional harian dan manajemen store",
  "head": "John Doe",
  "isActive": true,
  "createdAt": "2024-01-01T10:00:00Z",
  "createdBy": "admin_001"
}
```

### 6. **assessment_results** Collection

```typescript
interface EmployeeRef {
  id: string;                       // Employee ID
  name: string;                     // Employee name
  position: string;                 // Employee position
  location: string;                 // Employee location
}

interface EvaluatorData {
  name: string;                     // Evaluator name
  position: string;                 // Evaluator position
  division: string;                 // Evaluator division
  relationshipStatus: string;       // Relationship with target
}

interface CategoryScore {
  category: string;                 // Competency category
  scores: number[];                 // Individual question scores
  average: number;                  // Category average
}

interface AssessmentResult {
  id: string;                       // Document ID
  assessmentId: string;             // Reference to assessment
  targetUser: EmployeeRef;          // Employee being assessed
  evaluator: EvaluatorData;         // Evaluator information
  templateId: string;               // Template used
  scores: CategoryScore[];          // Section 1 scores by category
  semangatScores: number[];         // Section 2 scores
  recommendation: string;           // Section 3 recommendation
  submittedAt: Timestamp;           // Submission timestamp
  ipAddress?: string;               // Submitter IP (optional)
}
```

**Example Document:**
```json
{
  "id": "result_001",
  "assessmentId": "assessment_2024_001",
  "targetUser": {
    "id": "emp_001",
    "name": "Ahmad Fadli Rahman",
    "position": "Supervisor",
    "location": "Jakarta Timur"
  },
  "evaluator": {
    "name": "Sarah Putri",
    "position": "Area Manager",
    "division": "Operations",
    "relationshipStatus": "Atasan Langsung"
  },
  "templateId": "template_supervisor",
  "scores": [
    {
      "category": "Functional Competency",
      "scores": [4, 5, 4, 3],
      "average": 4.0
    },
    {
      "category": "Leadership dan Managerial", 
      "scores": [5, 4, 5],
      "average": 4.67
    }
  ],
  "semangatScores": [4, 5, 3, 4, 5, 4, 3],
  "recommendation": "Layak Dipromosikan",
  "submittedAt": "2024-01-15T14:30:00Z",
  "ipAddress": "192.168.1.100"
}
```

### 7. **audit_logs** Collection (Future Implementation)

```typescript
interface AuditLog {
  id: string;                       // Document ID
  userId?: string;                  // User ID (if authenticated)
  action: string;                   // Action performed
  resource: string;                 // Resource affected
  resourceId: string;               // Resource ID
  details?: Record<string, any>;    // Additional details
  timestamp: Timestamp;             // Action timestamp
  ipAddress?: string;               // Client IP address
  userAgent?: string;               // Client user agent
}
```

---

## 🔗 Relationships

### Entity Relationship Diagram

```
Assessment (1) ──→ (N) AssessmentResult
    │
    └──→ (N) CriteriaTemplate

Employee (1) ──→ (N) AssessmentResult

CriteriaTemplate (1) ──→ (N) AssessmentResult

Location (1) ──→ (N) Employee

Division (1) ──→ (N) Employee
```

### Relationship Details

#### Assessment → AssessmentResult
- **Type**: One-to-Many
- **Foreign Key**: `assessmentId` in `assessment_results`
- **Purpose**: Track all results for each assessment session

#### Assessment → CriteriaTemplate  
- **Type**: Many-to-Many
- **Foreign Key**: `templateIds` array in `assessments`
- **Purpose**: Multiple templates can be used in one assessment

#### Employee → AssessmentResult
- **Type**: One-to-Many  
- **Foreign Key**: `targetUser.id` in `assessment_results`
- **Purpose**: Track all assessments for each employee

#### CriteriaTemplate → AssessmentResult
- **Type**: One-to-Many
- **Foreign Key**: `templateId` in `assessment_results`
- **Purpose**: Track which template was used for assessment

#### Location → Employee
- **Type**: One-to-Many
- **Foreign Key**: `location` field in `employees` (denormalized)
- **Purpose**: Group employees by work location

#### Division → Employee
- **Type**: One-to-Many  
- **Foreign Key**: `division` field in `employees` (denormalized)
- **Purpose**: Group employees by division

---

## 📈 Indexes

### Required Composite Indexes

```javascript
// assessment_results collection
assessmentId + targetUser.id          // Query results by assessment and employee
assessmentId + evaluator.name         // Query results by assessment and evaluator
targetUser.id + submittedAt           // Employee assessment history
assessmentId + submittedAt            // Assessment results chronologically

// employees collection  
location + position                   // Filter employees by location and position
division + isActive                   // Active employees by division
position + isActive                   // Active employees by position

// assessments collection
isActive + createdAt                  // Active assessments chronologically
pin                                   // PIN lookup (single field index)
```

### Index Creation Commands

```javascript
// Create indexes via Firebase Console or CLI
firebase firestore:indexes

// Example index definitions in firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "assessment_results",
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "assessmentId", "order": "ASCENDING"},
        {"fieldPath": "targetUser.id", "order": "ASCENDING"}
      ]
    },
    {
      "collectionGroup": "employees", 
      "queryScope": "COLLECTION",
      "fields": [
        {"fieldPath": "location", "order": "ASCENDING"},
        {"fieldPath": "position", "order": "ASCENDING"}
      ]
    }
  ]
}
```

---

## 🔒 Security Rules

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Assessments - Admin only for write, PIN access for read
    match /assessments/{assessmentId} {
      allow read: if resource.data.isActive == true;
      allow write: if isAdmin();
    }
    
    // Criteria Templates - Admin only
    match /criteria_templates/{templateId} {
      allow read: if isAuthenticated() || resource.data.isActive == true;
      allow write: if isAdmin();
    }
    
    // Employees - Admin only
    match /employees/{employeeId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Locations - Admin only  
    match /locations/{locationId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Divisions - Admin only
    match /divisions/{divisionId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Assessment Results - Create for evaluators, read/update for admin
    match /assessment_results/{resultId} {
      allow create: if isAuthenticated();
      allow read, update, delete: if isAdmin();
    }
    
    // Audit Logs - Admin read only
    match /audit_logs/{logId} {
      allow read: if isAdmin();
      allow create: if isAuthenticated();
      allow update, delete: if false;
    }
  }
}
```

### Security Best Practices

1. **Input Validation**: Always validate data on client-side before Firestore write
2. **Rate Limiting**: Implement rate limiting for PIN attempts
3. **Data Sanitization**: Clean user inputs to prevent injection attacks
4. **Audit Trail**: Log all sensitive operations for compliance
5. **Backup Security**: Regular backups with encryption

---

## ✅ Data Validation

### Client-Side Validation Rules

```typescript
// Assessment validation
const assessmentSchema = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100
  },
  pin: {
    required: true,
    pattern: /^[A-Z0-9]{6,8}$/,
    unique: true
  },
  templateIds: {
    required: true,
    minItems: 1,
    validateExists: true
  }
};

// Employee validation  
const employeeSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  position: {
    required: true,
    validateExists: 'criteria_templates'
  },
  location: {
    required: true,
    validateExists: 'locations'  
  },
  division: {
    required: true,
    validateExists: 'divisions'
  }
};

// Assessment Result validation
const resultSchema = {
  assessmentId: {
    required: true,
    validateExists: 'assessments'
  },
  targetUser: {
    required: true,
    validateExists: 'employees'
  },
  evaluator: {
    required: true,
    validateStructure: 'EvaluatorData'
  },
  scores: {
    required: true,
    validateScoreRange: [1, 5]
  }
};
```

### Validation Functions

```typescript
// Unique PIN validation
export const validateUniquePIN = async (pin: string): Promise<boolean> => {
  const snapshot = await getDocs(
    query(collection(db, 'assessments'), where('pin', '==', pin))
  );
  return snapshot.empty;
};

// Duplicate assessment prevention
export const validateDuplicateAssessment = async (
  assessmentId: string,
  evaluatorName: string,
  targetId: string
): Promise<boolean> => {
  const snapshot = await getDocs(
    query(
      collection(db, 'assessment_results'),
      where('assessmentId', '==', assessmentId),
      where('evaluator.name', '==', evaluatorName),
      where('targetUser.id', '==', targetId)
    )
  );
  return snapshot.empty;
};

// Score validation
export const validateScores = (scores: number[]): boolean => {
  return scores.every(score => score >= 1 && score <= 5);
};
```

---

## 🚀 Migration Guide

### Initial Database Setup

```typescript
// Initialize collections with sample data
export const initializeDatabase = async () => {
  
  // 1. Create sample divisions
  const divisions = [
    { name: 'Operations', description: 'Operational management' },
    { name: 'Finance', description: 'Financial management' },
    { name: 'IT', description: 'Information technology' },
    { name: 'HRD', description: 'Human resource development' }
  ];
  
  for (const division of divisions) {
    await addDoc(collection(db, 'divisions'), {
      ...division,
      isActive: true,
      createdAt: serverTimestamp(),
      createdBy: 'system'
    });
  }
  
  // 2. Create sample locations
  const locations = [
    { name: 'Jakarta Timur', city: 'Jakarta', category: 'Store' },
    { name: 'Bandung Utara', city: 'Bandung', category: 'Store' },
    { name: 'Head Office', city: 'Jakarta', category: 'Head Office' }
  ];
  
  for (const location of locations) {
    await addDoc(collection(db, 'locations'), {
      ...location,
      isActive: true,
      createdAt: serverTimestamp(),
      createdBy: 'system'
    });
  }
  
  // 3. Create sample templates
  // ... template creation logic
};
```

### Data Migration Scripts

```typescript
// Migrate from v1.0 to v1.1
export const migrateToV1_1 = async () => {
  
  // Add version field to all templates
  const templatesSnapshot = await getDocs(collection(db, 'criteria_templates'));
  
  for (const doc of templatesSnapshot.docs) {
    await updateDoc(doc.ref, {
      version: '1.1',
      updatedAt: serverTimestamp()
    });
  }
  
  console.log('Migration to v1.1 completed');
};

// Backup before migration
export const backupCollection = async (collectionName: string) => {
  const snapshot = await getDocs(collection(db, collectionName));
  const backup = snapshot.docs.map(doc => ({
    id: doc.id,
    data: doc.data()
  }));
  
  // Save backup to file or another collection
  await addDoc(collection(db, 'backups'), {
    collection: collectionName,
    data: backup,
    createdAt: serverTimestamp()
  });
};
```

### Environment Setup

```bash
# Development environment
npm install -g firebase-tools
firebase login
firebase use --add  # Select development project

# Initialize Firestore
firebase firestore:databases:create

# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes  
firebase deploy --only firestore:indexes
```

---

## 📊 Performance Optimization

### Query Optimization Guidelines

```typescript
// ✅ Good: Use indexes effectively
const getEmployeesByLocation = async (location: string) => {
  return await getDocs(
    query(
      collection(db, 'employees'),
      where('location', '==', location),
      where('isActive', '==', true),
      orderBy('name'),
      limit(50)
    )
  );
};

// ❌ Bad: Multiple inequality filters
const badQuery = async () => {
  return await getDocs(
    query(
      collection(db, 'assessment_results'),
      where('scores.average', '>', 3),
      where('submittedAt', '>', yesterday)  // Requires composite index
    )
  );
};

// ✅ Good: Paginated results
const getPaginatedResults = async (lastDoc?: DocumentSnapshot) => {
  let q = query(
    collection(db, 'assessment_results'),
    orderBy('submittedAt', 'desc'),
    limit(20)
  );
  
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  
  return await getDocs(q);
};
```

### Caching Strategy

```typescript
// Cache frequently accessed data
const templateCache = new Map<string, CriteriaTemplate>();

export const getCachedTemplate = async (templateId: string): Promise<CriteriaTemplate> => {
  if (templateCache.has(templateId)) {
    return templateCache.get(templateId)!;
  }
  
  const doc = await getDoc(doc(db, 'criteria_templates', templateId));
  if (doc.exists()) {
    const template = doc.data() as CriteriaTemplate;
    templateCache.set(templateId, template);
    return template;
  }
  
  throw new Error('Template not found');
};
```

---

## 📋 Monitoring & Maintenance

### Database Monitoring

```typescript
// Monitor collection sizes
export const getCollectionStats = async () => {
  const collections = ['assessments', 'employees', 'assessment_results'];
  const stats = {};
  
  for (const collectionName of collections) {
    const snapshot = await getCountFromServer(collection(db, collectionName));
    stats[collectionName] = snapshot.data().count;
  }
  
  return stats;
};

// Monitor query performance
export const logSlowQueries = (queryName: string, duration: number) => {
  if (duration > 1000) { // Log queries > 1 second
    console.warn(`Slow query detected: ${queryName} took ${duration}ms`);
  }
};
```

### Maintenance Tasks

```typescript
// Cleanup old assessment results (if needed)
export const cleanupOldResults = async (daysOld: number = 365) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  const snapshot = await getDocs(
    query(
      collection(db, 'assessment_results'),
      where('submittedAt', '<', Timestamp.fromDate(cutoffDate))
    )
  );
  
  const batch = writeBatch(db);
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log(`Cleaned up ${snapshot.docs.length} old results`);
};
```

---

**📚 References:**
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Query Optimization](https://firebase.google.com/docs/firestore/query-data/queries) 