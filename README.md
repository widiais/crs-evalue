# 🏢 CRS - Competency Review System

<div align="center">

**🔥 Firebase-Powered Employee Assessment Platform**

*Sistem penilaian kompetensi karyawan berbasis web dengan Firebase untuk real-time data management*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10-orange?style=flat&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 📋 Deskripsi

**CRS (Competency Review System)** adalah aplikasi web modern untuk melakukan penilaian kompetensi karyawan secara terstruktur dan komprehensif. Sistem ini memungkinkan evaluator untuk menilai karyawan berdasarkan template pertanyaan yang dapat dikustomisasi, dengan akses yang dikontrol melalui sistem PIN yang aman.

### 🎯 Tujuan Sistem
- **Standardisasi** penilaian kompetensi karyawan
- **Digitalisasi** proses assessment yang efisien
- **Analitik** real-time untuk decision making
- **Fleksibilitas** template berdasarkan level jabatan
- **Keamanan** data dengan sistem PIN dan Firebase

---

## ✨ Features Lengkap

### 🔐 **Authentication & Security**
- **PIN-based Assessment Access** - Secure entry untuk evaluator
- **Session Management** - Kontrol akses per assessment
- **Data Validation** - Validasi komprehensif di frontend dan backend
- **Duplicate Prevention** - Mencegah penilaian ganda

### 👥 **Employee Management**
- **CRUD Operations** - Create, Read, Update, Delete karyawan
- **Hierarchical Filtering** - Filter berdasarkan Kategori Lokasi → Lokasi → Karyawan
- **Position-based Templates** - Template assessment sesuai jabatan
- **Advanced Search** - Search dengan debounce dan multiple filters
- **Export Capabilities** - Ready untuk export data

### 📝 **Assessment System**
- **3-Section Assessment** - Competency, Work Spirit, Recommendations
- **Dynamic Templates** - Template dapat disesuaikan per level jabatan
- **Progress Tracking** - Real-time progress bar dengan persentase
- **Interactive Rating** - Star rating system dengan color coding
- **Recommendation Engine** - 4 opsi rekomendasi terstandar

### 🎨 **Template Management**
- **Flexible Template Creation** - Buat template per jabatan/level
- **6 Kategori Kompetensi** - Functional, Leadership, Soft Skill, Problem Solving, Culture Fit, Akhlak
- **Unlimited Questions** - Tidak ada batasan jumlah pertanyaan
- **Template Inheritance** - Template dapat diedit dan diupdate
- **Recommendation Options Fix** - Tombol untuk memperbaiki opsi rekomendasi

### 🏗️ **Admin Dashboard**
- **Real-time Statistics** - Total assessments, employees, results
- **Firebase Status Monitor** - Connection status real-time
- **Data Seeding** - One-click setup untuk data awal
- **Setup Management** - Kelola employees, templates, assessments, locations
- **Analytics Dashboard** - Laporan per divisi, personal, dan role

### 📊 **Reporting System**
- **Personal Reports** - Laporan detail per individu
- **Division Reports** - Analisis per divisi
- **Role-based Reports** - Laporan berdasarkan jabatan
- **Real-time Data** - Data terintegrasi langsung dari Firebase

---

## �� Tech Stack Lengkap

### **Frontend Architecture**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.x | React framework dengan App Router |
| **React** | 18.x | UI library dengan latest features |
| **TypeScript** | 5.x | Type safety dan better DX |
| **Tailwind CSS** | 3.x | Utility-first styling framework |
| **Heroicons** | 2.x | Beautiful SVG icon library |
| **React-Select** | 5.x | Advanced searchable dropdowns |

### **Backend & Database**
| Service | Purpose |
|---------|---------|
| **Firebase Firestore** | NoSQL document database |
| **Firebase Auth** | Authentication (ready for future) |
| **Firebase Hosting** | Web hosting dan CDN |
| **Firebase Functions** | Serverless backend (ready) |

### **Development Tools**
| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting dan quality |
| **PostCSS** | CSS processing |
| **Autoprefixer** | CSS vendor prefixes |
| **TypeScript** | Static type checking |

---

## 📁 Struktur Project Detail

```
crs-evalue/
├── 📁 .firebase/                  # Firebase deployment configs
├── 📁 .next/                     # Next.js build output
├── 📁 docs/                      # Dokumentasi project
├── 📁 src/
│   ├── 📁 app/                   # Next.js App Router
│   │   ├── 📄 page.tsx           # 🏠 Homepage - PIN input
│   │   ├── 📄 layout.tsx         # Root layout dengan metadata
│   │   ├── 📁 pin/[pin]/         # 🔐 Assessment routes
│   │   │   ├── 📄 page.tsx       # Employee & evaluator selection
│   │   │   ├── 📁 form/          
│   │   │   │   └── 📄 page.tsx   # 📝 Assessment form
│   │   │   └── 📁 success/
│   │   │       └── 📄 page.tsx   # ✅ Success page dengan summary
│   │   └── 📁 admin/             # 👨‍💼 Admin dashboard
│   │       ├── 📄 page.tsx       # Main dashboard
│   │       ├── 📁 employees/     # Employee management
│   │       ├── 📁 templates/     # Template management
│   │       ├── 📁 assessments/   # Assessment management
│   │       ├── 📁 locations/     # Location management
│   │       ├── 📁 divisions/     # Division management
│   │       └── 📁 reports/       # Reporting system
│   ├── 📁 components/            # 🧩 Reusable UI components
│   ├── 📁 constants/             # 📊 Constants & enums
│   │   ├── 📄 positions.ts       # Job positions
│   │   ├── 📄 templates.ts       # Template constants
│   │   └── 📄 locations.ts       # Location constants
│   ├── 📁 services/              # 🔌 Firebase services
│   │   ├── 📄 firebase.ts        # Firebase configuration
│   │   ├── 📄 assessments.ts     # Assessment CRUD
│   │   ├── 📄 employees.ts       # Employee CRUD
│   │   ├── 📄 templates.ts       # Template CRUD
│   │   └── 📄 locations.ts       # Location CRUD
│   ├── 📁 types/                 # 📝 TypeScript interfaces
│   │   └── 📄 index.ts           # Main type definitions
│   └── 📁 utils/                 # 🛠 Utility functions
│       └── 📄 seedData.ts        # Data seeding utilities
├── 📄 .env.local                 # Environment variables
├── 📄 firebase.json              # Firebase configuration
├── 📄 package.json               # Dependencies
├── 📄 tailwind.config.js         # Tailwind configuration
├── 📄 tsconfig.json              # TypeScript configuration
└── 📄 README.md                  # 📖 Documentation
```

---

## 🔧 Installation & Setup

### 📋 Prerequisites
```bash
# Required
Node.js 18.x atau higher
npm 9.x atau yarn 1.22.x
Git

# Recommended
VS Code dengan TypeScript extension
Firebase CLI (optional untuk deployment)
```

### 🚀 Quick Start

#### 1. **Clone Repository**
```bash
git clone <repository-url>
cd crs-evalue
```

#### 2. **Install Dependencies**
```bash
npm install
# atau
yarn install
```

#### 3. **Environment Setup**
File `.env.local` sudah tersedia dengan konfigurasi Firebase:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC0EyEfBjskf7iLhs65aNM-ZkQ_Z06rrVE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=crs-evalue.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=crs-evalue
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=crs-evalue.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=155444535947
NEXT_PUBLIC_FIREBASE_APP_ID=1:155444535947:web:9d9a7ffd40921667b76a8e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-RNDBXVTW9V
```

#### 4. **Start Development Server**
```bash
npm run dev
```

🎉 **Aplikasi berjalan di [http://localhost:3000](http://localhost:3000)**

---

## 🗄 Database Architecture

### **Firestore Collections**

#### 📋 `employees`
```typescript
interface Employee {
  id: string;
  name: string;
  position: Position; // 'Training' | 'Member' | 'Star' | 'All Star' | 'Team Leader 1' | etc.
  location: Location; // 'LC Margahayu' | 'LC Dago' | 'Central Kitchen' | etc.
  division: string;   // 'Operations' | 'Finance' | 'IT' | 'Marketing' | 'HRD'
}
```

#### 📝 `criteria_templates`
```typescript
interface CriteriaTemplate {
  id: string;
  level: Position;
  section1: AssessmentCriteria[]; // Kompetensi questions
  section2: AssessmentCriteria[]; // Semangat questions  
  section3: {
    type: 'fixed_options';
    options: string[]; // Recommendation options
  };
}
```

#### 🎯 `assessments`
```typescript
interface Assessment {
  id: string;
  title: string;
  templateIds: string[];
  pin: string;
  isActive: boolean;
  createdAt: Timestamp;
  createdBy: string;
}
```

#### 📊 `assessment_results`
```typescript
interface AssessmentResult {
  id: string;
  assessmentId: string;
  targetUser: Employee;
  evaluator: Evaluator;
  scores: CategoryScore[];
  semangatScores: number[];
  recommendation: string;
  submittedAt: Timestamp;
}
```

#### 🏢 `locations`
```typescript
interface Location {
  id: string;
  name: string;
  category: 'Store' | 'Head Office';
  isActive: boolean;
}
```

#### 🏗️ `divisions`
```typescript
interface Division {
  id: string;
  name: string;
  isActive: boolean;
}
```

---

## 🚀 Penggunaan Sistem

### 1. **🎛️ Admin Dashboard**
```
URL: /admin
```

**Features:**
- ✅ **Statistics Overview** - Total assessments, employees, results
- ✅ **Firebase Status** - Real-time connection monitoring  
- ✅ **Data Seeding** - One-click setup sample data
- ✅ **Quick Access** - Navigate ke semua setup pages

**Setup Menu:**
- 👥 **Setup Employees** - CRUD karyawan dengan filtering
- 🏢 **Setup Divisions** - Kelola divisi perusahaan
- 📝 **Setup Assessment Templates** - Buat template per jabatan
- 🎯 **Setup Assessments** - Generate PIN dan assign templates
- 📍 **Setup Work Location** - Kelola lokasi kerja

**Reports Menu:**
- 👤 **Report Personal** - Laporan detail per individu
- 🏢 **Report Division** - Laporan per divisi
- 👥 **Report Role** - Laporan per jabatan

### 2. **📋 Assessment Flow**
```
Homepage → PIN Input → Employee Selection → Assessment Form → Success Page
     ↓         ↓            ↓                    ↓             ↓
   Enter PIN  Validate   Choose Employee    Fill Assessment  View Summary
```

#### **Step-by-Step:**

**🔐 Step 1: PIN Authentication**
- Input PIN di homepage
- Sistem validasi PIN dengan database assessments
- Redirect ke halaman employee selection

**👥 Step 2: Employee & Evaluator Selection**
- **Hierarchical Filtering**: Kategori Lokasi → Lokasi Kerja → Karyawan
- **Searchable Dropdowns** dengan debounce
- **Template Matching** - Hanya tampilkan karyawan sesuai template
- Input data evaluator (nama, posisi, divisi)

**📝 Step 3: Assessment Form**
- **Progress Tracking** dengan real-time percentage
- **Section 1**: Kompetensi (6 kategori, unlimited questions)
- **Section 2**: Semangat Kerja (motivation assessment)
- **Section 3**: Rekomendasi (4 pilihan terstandar)
- **Interactive Rating** dengan star system dan color coding

**✅ Step 4: Success Page**
- Summary lengkap assessment
- Data evaluator dan target employee
- PIN dan timestamp
- Navigation untuk assessment lain

### 3. **🎯 Template Management**

**Membuat Template Baru:**
1. Admin Dashboard → Setup Assessment Templates
2. Klik "Buat Template Baru"
3. Pilih Level/Jabatan
4. Tambah pertanyaan Section 1 (Kompetensi)
5. Tambah pertanyaan Section 2 (Semangat)
6. Save template

**6 Kategori Kompetensi:**
1. **Functional Competency** - Kemampuan teknis
2. **Leadership dan Managerial** - Kepemimpinan
3. **Soft Skill** - Interpersonal skills
4. **Problem Solving & Analytical Thinking** - Analitis
5. **Culture Fit and Commitment** - Budaya perusahaan
6. **Akhlak dan Etika Kerja Islam** - Nilai-nilai

**Memperbaiki Opsi Rekomendasi:**
- Klik tombol "🔧 Perbaiki Opsi Rekomendasi"
- Sistem akan update semua template dengan opsi terbaru:
  - "Dipertahankan di Level Sekarang"
  - "Layak Dipromosikan" 
  - "Perlu Pembinaan Lebih Lanjut"
  - "Perlu Rotasi / Penyesuaian Posisi"

### 4. **📊 Sample Data & Testing**

**Test PINs untuk Development:**
| PIN | Assessment Title | Template |
|-----|------------------|----------|
| `PERF2024` | Performance Review Q4 2024 | Junior Supervisor |
| `LEAD2024` | Leadership Assessment Jan 2024 | Team Leader 1 |
| `TEAM2024` | Team Evaluation December 2024 | Junior Supervisor |

**Sample Employees:**
- Ahmad Fadli (Junior Supervisor, LC Margahayu)
- Rina Kartika (Middle Supervisor, Central Kitchen)
- Budi Santoso (Team Leader 1, LC Dago)
- Sari Dewi (Team Leader 2, LC Cihampelas)
- Dan lainnya...

**Seeding Data:**
1. Buka `/admin`
2. Klik **"Seed Initial Data"**
3. Sample data akan ditambahkan ke Firestore:
   - ✅ Divisions (Operations, Finance, IT, Marketing, HRD)
   - ✅ Locations (berbagai LC dan Head Office)
   - ✅ Employees (8 sample karyawan)
   - ✅ Templates (Junior Supervisor, Team Leader 1)
   - ✅ Assessments (3 sample assessments)

---

## 🔄 Development Workflow

### **🧪 Testing & Quality Assurance**

**Firebase Testing:**
```bash
# Via Admin Dashboard
/admin → "Test Firebase Connection"
/admin → "Seed Initial Data"

# Manual Verification
1. Check browser console for Firebase logs
2. Verify data di Firebase Console
3. Test CRUD operations
```

**Local Development:**
```bash
npm run dev          # Start development server
npm run build        # Build untuk production
npm run start        # Start production server
npm run lint         # Run ESLint checks
```

**Code Quality:**
- ✅ **TypeScript** untuk type safety
- ✅ **ESLint** untuk code consistency
- ✅ **Error Handling** di semua services
- ✅ **Loading States** untuk UX
- ✅ **Responsive Design** untuk all devices

### **🚀 Deployment**

**Firebase Hosting:**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Build project
npm run build

# Deploy to Firebase
firebase deploy
```

**Production Environment:**
- ✅ **Next.js Optimizations** - Static generation, image optimization
- ✅ **Firebase Security Rules** - Production-ready rules
- ✅ **Error Monitoring** - Console logging
- ✅ **Performance Monitoring** - Firebase Performance

---

## 🎨 UI/UX Design System

### **🎨 Design Principles**
- **Modern Gradient Design** - Cyan to purple gradients
- **Card-based Layout** - Rounded corners dengan shadows
- **Interactive Elements** - Hover effects dan transitions
- **Color-coded Sections** - Visual hierarchy yang jelas
- **Mobile-first Responsive** - Perfect di semua devices

### **🌈 Color Palette**
```css
/* Primary Gradients */
background: linear-gradient(to bottom right, #06b6d4, #3b82f6, #8b5cf6);

/* Status Colors */
Success: #10b981 (Green)
Warning: #f59e0b (Yellow/Orange)  
Error: #ef4444 (Red)
Info: #3b82f6 (Blue)

/* Neutrals */
Gray 50: #f9fafb
Gray 100: #f3f4f6
Gray 900: #111827
```

### **📱 Responsive Breakpoints**
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

---

## 🤝 Contributing & Development

### **📝 Contributing Guidelines**
1. **Fork** repository
2. **Create feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit changes** (`git commit -m 'Add AmazingFeature'`)
4. **Push to branch** (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

### **🐛 Bug Reports**
Gunakan GitHub Issues dengan template:
- **Description** - Deskripsi bug
- **Steps to Reproduce** - Langkah-langkah reproduce
- **Expected Behavior** - Behavior yang diharapkan
- **Screenshots** - Screenshot jika perlu
- **Environment** - Browser, OS, device

### **💡 Feature Requests**
- Deskripsi detail feature yang diinginkan
- Use case dan business value
- Mockup atau wireframe (jika ada)
- Priority level

---

## 📞 Support & Contact

### **📧 Technical Support**
- **Developer**: CRS Development Team
- **Email**: support@crs-system.com
- **Documentation**: [GitHub Wiki](./docs)

### **🔗 Links**
- **Live Demo**: [https://crs-evalue.web.app](https://crs-evalue.web.app)
- **Firebase Console**: [Console](https://console.firebase.google.com/project/crs-evalue)
- **Repository**: [GitHub](https://github.com/username/crs-evalue)

---