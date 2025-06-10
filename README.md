# 🏢 CRS - Competency Review System

🔥 **Firebase-Powered Employee Assessment Platform**

Sistem penilaian kompetensi karyawan berbasis web dengan Firebase sebagai backend untuk real-time data management.

## 📋 Deskripsi

CRS (Competency Review System) adalah aplikasi web untuk melakukan penilaian kompetensi karyawan secara terstruktur. Sistem ini memungkinkan evaluator untuk menilai karyawan berdasarkan template pertanyaan yang telah ditentukan, dengan akses yang dikontrol melalui PIN.

## ✨ Features

### 🎯 Core Features
- **PIN-based Assessment Access** - Secure entry untuk evaluator
- **Employee Management** - Database karyawan dengan filter lokasi/jabatan
- **3-Section Assessment Form** - Competency, Work Spirit, dan Recommendations
- **Real-time Firebase Integration** - Data tersimpan langsung ke Firestore
- **Duplicate Prevention** - Validasi untuk mencegah penilaian ganda
- **Admin Dashboard** - Management console dengan analytics

### 🚀 Technical Features
- **Firebase Firestore** - NoSQL database untuk scalability
- **Responsive Design** - Mobile-first approach
- **TypeScript** - Type safety dan better DX
- **Real-time Sync** - Data konsisten across devices
- **Fallback System** - Mock data jika Firebase tidak tersedia

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - App Router dengan Server Components
- **React 18** - Latest React features
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Heroicons** - Beautiful icon set

### Backend & Database
- **Firebase v10** - Google's mobile and web app platform
- **Firestore** - NoSQL document database
- **Firebase Auth** - Authentication (ready for future use)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Struktur Project

```
crs-evalue/
├── docs/                           # Dokumentasi lengkap
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx               # Halaman input PIN
│   │   ├── pin/[pin]/             # Assessment berdasarkan PIN
│   │   │   ├── page.tsx           # Form data evaluator & target
│   │   │   ├── form/page.tsx      # Formulir penilaian
│   │   │   └── success/page.tsx   # Halaman sukses
│   │   └── admin/                 # Dashboard admin
│   ├── components/                # Komponen UI reusable
│   ├── constants/                 # Konstanta dan enums
│   ├── services/                  # Firebase services
│   ├── types/                     # TypeScript interfaces
│   └── utils/                     # Utility functions
├── package.json
└── README.md
```

## 🔧 Installation

### Prerequisites
```bash
Node.js 18+ 
npm atau yarn
```

### 1. Clone & Install
```bash
git clone <repository-url>
cd crs-evalue
npm install
```

### 2. Firebase Setup

#### A. Firebase Console Setup
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Buat project baru dengan nama `crs-evalue`
3. Enable Firestore Database
4. Copy configuration dari Project Settings

#### B. Environment Configuration
File `.env.local` sudah dibuat dengan konfigurasi Firebase:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC0EyEfBjskf7iLhs65aNM-ZkQ_Z06rrVE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=crs-evalue.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=crs-evalue
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=crs-evalue.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=155444535947
NEXT_PUBLIC_FIREBASE_APP_ID=1:155444535947:web:9d9a7ffd40921667b76a8e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-RNDBXVTW9V
```

### 3. Start Development
```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## 🗄 Database Structure

### Collections

#### `employees`
```javascript
{
  id: string,
  name: string,
  position: string, // 'Supervisor' | 'Team Leader' | 'All Star'
  location: string, // 'Jakarta Timur' | 'Jakarta Pusat' | dst
  division: string  // 'Operations' | 'Finance' | 'IT' | dst
}
```

#### `assessments`
```javascript
{
  id: string,
  title: string,
  templateIds: string[],
  pin: string,
  isActive: boolean,
  createdAt: Timestamp,
  createdBy: string
}
```

#### `assessment_results`
```javascript
{
  id: string,
  assessmentId: string,
  targetUser: Employee,
  evaluator: Evaluator,
  competencyScores: Record<string, number>,
  workSpiritScores: Record<string, number>,
  recommendations: string,
  submittedAt: Timestamp
}
```

## 🚀 Usage

### 1. Admin Dashboard
- Akses: `/admin`
- Features:
  - View statistics (assessments, employees, results)
  - Firebase connection status
  - Seed initial data ke Firebase
  - Test Firebase connection

### 2. Assessment Flow
```
Homepage (PIN Input) → Employee Selection → Assessment Form → Success Page
```

### 3. Sample Data
**Test PINs:**
- `ABC123` - Evaluasi Q3 Supervisor
- `XYZ789` - Performance Review Team Leader
- `PERF2024` - Performance Review Q4 2024 (seeded)
- `LEAD2024` - Leadership Assessment (seeded)
- `TEAM2024` - Team Evaluation (seeded)

### 4. Data Seeding
1. Buka Admin Dashboard
2. Klik **"Seed Initial Data"**
3. Sample employees dan assessments akan ditambahkan ke Firestore

## 🔄 Development Workflow

### Firebase Testing
```bash
# Via Admin Dashboard
1. /admin → Test Connection
2. /admin → Seed Initial Data

# Manual Testing
- Check browser console for Firebase logs
- Verify data di Firebase Console
```

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📱 Mobile Support

Aplikasi fully responsive dengan breakpoints:
- `sm:` 640px+
- `md:` 768px+
- `lg:` 1024px+
- `xl:` 1280px+

## 🔒 Security Features

- **PIN-based access** - Secure entry point
- **Firestore rules** - Server-side security (to be configured)
- **Environment variables** - Sensitive config di .env
- **Input validation** - Form validation di frontend
- **Duplicate prevention** - Business logic validation

## 🎨 UI/UX Features

- **Consistent Design System** - Tailwind classes
- **Loading States** - User feedback durante operasi async
- **Error Handling** - Graceful fallbacks
- **Accessibility** - Semantic HTML dan proper contrast
- **Animation** - Smooth transitions

## 📊 Performance

- **SSR/SSG** - Next.js optimization
- **Code Splitting** - Dynamic imports
- **Firebase Caching** - Efficient data fetching
- **Optimized Bundle** - Tree shaking
- **Image Optimization** - Next.js Image component

## 🔮 Future Enhancements

### Planned Features
- [ ] Firebase Authentication integration
- [ ] Real-time notifications
- [ ] Advanced reporting dan analytics
- [ ] Export to PDF/Excel
- [ ] Multi-language support
- [ ] Assessment templates management
- [ ] Bulk employee import
- [ ] Email notifications

### Technical Improvements
- [ ] Firestore security rules
- [ ] PWA capabilities
- [ ] Offline support
- [ ] Advanced caching strategies
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)

## 🐛 Troubleshooting

### Common Issues

**Firebase Connection Error:**
```
Solution: Check .env.local file dan Firebase project settings
```

**Build Errors:**
```
Solution: npm install && npm run build
```

**TypeScript Errors:**
```
Solution: npm run lint -- --fix
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**🔥 Firebase Integration Status: ✅ COMPLETED**

> **Current Status**: Fully functional dengan Firebase Firestore integration, admin dashboard, dan seeding capabilities.

## 📞 Support

Untuk pertanyaan atau dukungan, hubungi tim development.

---

**CRS - Competency Review System** | Built with ❤️ using Next.js & Firebase 

## 🎛 Admin Dashboard

### 🔐 Admin Access
- **Homepage**: Click "**Masuk sebagai Admin**" link
- **Direct Access**: `/admin`
- **No Authentication Required** (development mode)

### 📊 Admin Features Overview

#### 🔧 **Setup & Configuration**
- **Setup Employees** (`/admin/employees`)
  - Add, edit, delete employees
  - Filter by location, position, division
  - Bulk import capabilities
  - Real-time search and filtering

- **Setup Assessments** (`/admin/assessments`)
  - Create new assessment sessions
  - Generate unique PINs
  - Manage assessment periods
  - Template management

- **Setup Work Location** (`/admin/locations`)
  - Manage work locations and regional mapping
  - Location codes and hierarchy
  - Active/inactive status management
  - Regional grouping

#### 📈 **Reports & Analytics**
- **Report Personal** (`/admin/reports/personal`)
  - Individual employee assessment analysis
  - Competency and work spirit breakdowns
  - Performance trends and recommendations
  - Export functionality

- **Report Division** (`/admin/reports/division`)
  - Division-wide performance analysis
  - Inter-division comparisons
  - Top performers per division
  - Competency breakdowns by division

- **Report Role** (`/admin/reports/role`)
  - Position-based performance analysis
  - Skills gap identification
  - Promotion readiness tracking
  - Career development insights

#### ⚙️ **System Management**
- **Firebase Management**
  - Real-time connection monitoring
  - Data seeding capabilities
  - Database status indicators
  - Seed initial sample data

- **Settings & Configuration**
  - System-wide settings (placeholder)
  - Template management (future)
  - Advanced configurations (future) 