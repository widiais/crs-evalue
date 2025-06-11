# 🏗️ System Architecture & Technical Guidelines - CRS Web App

## 📋 Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture Patterns](#architecture-patterns)
- [Project Structure](#project-structure)
- [Database Architecture](#database-architecture)
- [Security Architecture](#security-architecture)
- [Development Guidelines](#development-guidelines)
- [Performance Guidelines](#performance-guidelines)
- [Deployment Architecture](#deployment-architecture)

## 🎯 Overview

CRS (Competency Review System) adalah aplikasi web modern untuk manajemen assessment karyawan berbasis PIN. Sistem ini menggunakan arsitektur **Serverless Frontend + Firebase Backend** yang memungkinkan skalabilitas tinggi dengan maintenance minimal.

### Core Principles
- **Serverless Architecture**: No backend server required
- **Real-time Data**: Firebase Firestore untuk data synchronization
- **Role-based Access**: Admin vs Evaluator permissions
- **Mobile-first Design**: Responsive untuk semua device
- **Type Safety**: Full TypeScript implementation

## 🛠️ Technology Stack

### Frontend Stack
```
Framework: Next.js 14 (App Router)
Language: TypeScript 5.x
Styling: Tailwind CSS 3.x
UI Components: Heroicons, React-Select
State Management: React Hooks + Context
Form Handling: Native React forms
PDF Generation: Built-in utilities
```

### Backend Stack (Serverless)
```
Database: Firebase Firestore
Authentication: Firebase Auth (ready for implementation)
Storage: Firebase Storage (for file uploads)
Hosting: Firebase Hosting / Vercel
Functions: Firebase Cloud Functions (optional)
```

### Development Tools
```
Package Manager: npm
Build Tool: Next.js built-in
Linting: ESLint + TypeScript
Formatting: Prettier (if configured)
Version Control: Git
```

## 🏛️ Architecture Patterns

### 1. **Frontend Architecture Pattern**

```
┌─────────────────────────────────────────┐
│                 Frontend                │
├─────────────────────────────────────────┤
│  Next.js App Router + TypeScript        │
│  ┌─────────────┬─────────────────────┐  │
│  │    Pages    │     Components      │  │
│  │   (Routes)  │   (Reusable UI)     │  │
│  └─────────────┴─────────────────────┘  │
│  ┌─────────────┬─────────────────────┐  │
│  │  Services   │      Utils          │  │
│  │ (Firebase)  │   (Helpers)         │  │
│  └─────────────┴─────────────────────┘  │
└─────────────────────────────────────────┘
                    │
                    │ HTTPS/REST
                    ▼
┌─────────────────────────────────────────┐
│            Firebase Backend             │
├─────────────────────────────────────────┤
│  ┌─────────────┬─────────────────────┐  │
│  │ Firestore   │    Authentication   │  │
│  │ Database    │    (Optional)       │  │
│  └─────────────┴─────────────────────┘  │
│  ┌─────────────┬─────────────────────┐  │
│  │   Storage   │   Cloud Functions   │  │
│  │ (Optional)  │    (Optional)       │  │
│  └─────────────┴─────────────────────┘  │
└─────────────────────────────────────────┘
```

### 2. **Data Flow Pattern**

```
User Input → Component → Service → Firebase → Real-time Update → UI
```

### 3. **Authentication Flow** (Ready for implementation)

```
Login → Firebase Auth → Custom Claims → Role-based Routing
```

## 📁 Project Structure

```
crs-evalue/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard routes
│   │   │   ├── assessments/   # Assessment management
│   │   │   ├── employees/     # Employee management
│   │   │   ├── locations/     # Location management
│   │   │   ├── templates/     # Template management
│   │   │   └── reports/       # Reporting system
│   │   ├── pin/               # PIN-based assessment
│   │   │   └── [pin]/         # Dynamic PIN routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable UI components
│   ├── constants/             # Application constants
│   ├── features/              # Feature-specific modules
│   ├── services/              # Firebase service wrappers
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── docs/                      # Documentation
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── firebase.json              # Firebase configuration
├── next.config.js             # Next.js configuration
└── package.json               # Dependencies
```

### Directory Guidelines

#### `/src/app/` - Routes & Pages
- Follow Next.js App Router conventions
- Each route should have its own directory
- Use `page.tsx` for route components
- Implement loading.tsx and error.tsx when needed

#### `/src/components/` - UI Components
- Create reusable, composable components
- Follow atomic design principles
- Each component should have single responsibility
- Use TypeScript interfaces for props

#### `/src/services/` - Firebase Integration
- Abstract Firebase operations
- Provide clean API for components
- Handle error states consistently
- Include TypeScript types for all operations

#### `/src/types/` - Type Definitions
- Define interfaces for all data models
- Export types for reuse across application
- Keep types aligned with Firestore schema

## 🗄️ Database Architecture

### Firestore Collections Schema

```typescript
// Main Collections
assessments/          # Assessment sessions
├── {assessmentId}
│   ├── id: string
│   ├── title: string
│   ├── description?: string
│   ├── templateIds: string[]
│   ├── pin: string
│   ├── isActive: boolean
│   ├── startDate?: Timestamp
│   ├── endDate?: Timestamp
│   ├── createdAt: Timestamp
│   └── createdBy: string

criteria_templates/   # Assessment templates
├── {templateId}
│   ├── id: string
│   ├── level: string
│   ├── section1: Question[]
│   ├── section2: Question[]
│   └── section3: RecommendationSection

employees/           # Employee data
├── {employeeId}
│   ├── id: string
│   ├── name: string
│   ├── position: string
│   ├── location: string
│   └── division: string

locations/           # Work locations
├── {locationId}
│   ├── id: string
│   ├── name: string
│   ├── city: string
│   ├── category: 'Head Office' | 'Store'
│   └── isActive: boolean

divisions/           # Company divisions
├── {divisionId}
│   ├── id: string
│   ├── name: string
│   ├── description?: string
│   ├── head?: string
│   └── isActive: boolean

assessment_results/  # Assessment submissions
├── {resultId}
│   ├── id: string
│   ├── assessmentId: string
│   ├── targetUser: EmployeeRef
│   ├── evaluator: EvaluatorData
│   ├── scores: CategoryScore[]
│   ├── semangatScores: number[]
│   ├── recommendation: string
│   └── submittedAt: Timestamp
```

### Data Relationships

```
Assessment (1) ──→ (N) AssessmentResult
Assessment (N) ──→ (N) CriteriaTemplate
Employee (1) ──→ (N) AssessmentResult
Location (1) ──→ (N) Employee
Division (1) ──→ (N) Employee
```

## 🔒 Security Architecture

### Client-Side Security
- **Input Validation**: All forms validated before Firebase calls
- **Type Safety**: TypeScript ensures data integrity
- **Error Handling**: Graceful error handling for all operations
- **Data Sanitization**: Clean user inputs before storage

### Firebase Security (Ready for implementation)
```javascript
// Firestore Security Rules Example
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin-only collections
    match /assessments/{document} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Public read for PIN access
    match /assessments/{assessmentId} {
      allow read: if resource.data.isActive == true;
    }
  }
}
```

### Environment Security
```bash
# .env.local (Development)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Production: Use environment variables in hosting platform
```

## 👨‍💻 Development Guidelines

### 1. **Code Style & Standards**

#### TypeScript Guidelines
```typescript
// ✅ Good: Clear interface definitions
interface Employee {
  id: string;
  name: string;
  position: Position;
  location: string;
  division: string;
}

// ✅ Good: Explicit return types
const getEmployees = async (): Promise<Employee[]> => {
  // implementation
};

// ❌ Bad: Any types
const getData = async (): Promise<any> => {
  // avoid this
};
```

#### Component Guidelines
```typescript
// ✅ Good: Functional components with TypeScript
interface Props {
  employee: Employee;
  onEdit: (id: string) => void;
}

export default function EmployeeCard({ employee, onEdit }: Props) {
  return (
    <div className="card">
      {/* component content */}
    </div>
  );
}
```

#### Service Guidelines
```typescript
// ✅ Good: Consistent error handling
export const employeeService = {
  async getAllEmployees(): Promise<Employee[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }
      // implementation
      return employees;
    } catch (error) {
      console.error('Error getting employees:', error);
      throw error;
    }
  }
};
```

### 2. **File Naming Conventions**

```
Components: PascalCase.tsx (EmployeeCard.tsx)
Pages: lowercase (page.tsx, loading.tsx)
Services: camelCase.ts (employeeService.ts)
Types: camelCase.ts (employee.ts)
Constants: camelCase.ts (positions.ts)
```

### 3. **Git Workflow**

```bash
# Feature development
git checkout -b feature/employee-management
git commit -m "feat: add employee CRUD operations"
git push origin feature/employee-management

# Bug fixes
git checkout -b fix/assessment-validation
git commit -m "fix: resolve PIN validation issue"

# Documentation
git commit -m "docs: update API documentation"
```

### 4. **Testing Guidelines** (Future Implementation)

```typescript
// Unit tests for services
describe('employeeService', () => {
  it('should fetch all employees', async () => {
    const employees = await employeeService.getAllEmployees();
    expect(employees).toBeDefined();
    expect(Array.isArray(employees)).toBe(true);
  });
});

// Integration tests for components
describe('EmployeeCard', () => {
  it('should render employee information', () => {
    render(<EmployeeCard employee={mockEmployee} onEdit={jest.fn()} />);
    expect(screen.getByText(mockEmployee.name)).toBeInTheDocument();
  });
});
```

## ⚡ Performance Guidelines

### 1. **Frontend Optimization**

#### Code Splitting
```typescript
// Dynamic imports for large components
const ReportDashboard = dynamic(() => import('@/components/ReportDashboard'), {
  loading: () => <LoadingSpinner />
});
```

#### Image Optimization
```typescript
import Image from 'next/image';

// Use Next.js Image component
<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={100}
  priority 
/>
```

### 2. **Firebase Optimization**

#### Query Optimization
```typescript
// ✅ Good: Indexed queries with limits
const q = query(
  collection(db, 'employees'),
  where('location', '==', location),
  orderBy('name'),
  limit(50)
);

// ❌ Bad: Unindexed complex queries
const badQuery = query(
  collection(db, 'employees'),
  where('location', '==', location),
  where('position', '==', position),
  orderBy('createdAt')  // May require composite index
);
```

#### Data Loading Strategies
```typescript
// Pagination for large datasets
const loadEmployees = async (lastDoc?: DocumentSnapshot) => {
  let q = query(
    collection(db, 'employees'),
    orderBy('name'),
    limit(20)
  );
  
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  
  return await getDocs(q);
};
```

### 3. **Bundle Size Optimization**

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
```

## 🚀 Deployment Architecture

### Development Environment
```
Local Development → localhost:3000
Database → Firebase Firestore (dev project)
Hosting → Local Next.js dev server
```

### Staging Environment
```
Staging → Vercel preview deployment
Database → Firebase Firestore (staging project)
Domain → Generated Vercel URL
```

### Production Environment
```
Production → Firebase Hosting / Vercel
Database → Firebase Firestore (production project)
Domain → Custom domain
CDN → Firebase/Vercel CDN
```

### Environment Configuration

```bash
# Development
npm run dev

# Build for production
npm run build
npm run start

# Firebase deployment
firebase deploy --only hosting

# Vercel deployment
vercel --prod
```

### CI/CD Pipeline (Recommended)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: crs-production
```

## 📊 Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals**: Monitor LCP, FID, CLS
- **Bundle Analysis**: Regular bundle size monitoring
- **Firebase Usage**: Monitor read/write operations

### Error Tracking (Future Implementation)
```typescript
// Sentry integration example
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Analytics (Future Implementation)
```typescript
// Google Analytics 4
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
      <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
    </html>
  );
}
```

---

## 🔄 Maintenance & Updates

### Regular Maintenance Tasks
- [ ] **Weekly**: Dependency updates review
- [ ] **Monthly**: Performance audit
- [ ] **Quarterly**: Security review
- [ ] **Yearly**: Architecture review

### Version Control Strategy
```
main branch: Production-ready code
develop branch: Integration branch
feature/* branches: Feature development
hotfix/* branches: Critical fixes
```

### Backup Strategy
- **Database**: Firebase automatic backups
- **Code**: Git repository with multiple remotes
- **Assets**: Firebase Storage automatic backup

---

**📧 Questions?** Contact the development team for architecture clarifications or system design discussions. 