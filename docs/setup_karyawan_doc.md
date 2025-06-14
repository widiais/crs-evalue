# 👥 Employee Setup Guide - CRS Web App

## 📋 Table of Contents
- [Overview](#overview)
- [Accessing Employee Management](#accessing-employee-management)
- [Adding New Employees](#adding-new-employees)
- [Managing Employee Data](#managing-employee-data)
- [Employee Data Fields](#employee-data-fields)
- [Bulk Operations](#bulk-operations)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Employee Setup adalah proses fundamental dalam CRS untuk mengelola data karyawan yang akan menjadi target assessment. Sistem ini memungkinkan admin untuk menambah, mengedit, menghapus, dan mengelola data karyawan secara komprehensif.

### Key Features
- ✅ **CRUD Operations**: Create, Read, Update, Delete employee data
- ✅ **Data Validation**: Automatic validation untuk data integrity
- ✅ **Position Linking**: Otomatis link dengan assessment templates
- ✅ **Location & Division**: Integrasi dengan master data lokasi dan divisi
- ✅ **Search & Filter**: Pencarian dan filter data karyawan
- ✅ **Active Status**: Management status aktif/non-aktif karyawan

### Prerequisites
- Admin access ke CRS dashboard
- Master data lokasi kerja sudah disetup
- Master data divisi sudah disetup
- Assessment templates sudah tersedia

---

## 🔐 Accessing Employee Management

### Step 1: Login to Admin Dashboard
1. Buka aplikasi CRS di browser
2. Akses halaman admin dashboard
3. Pilih menu **"Employees"** di sidebar

### Step 2: Employee Management Interface
Setelah mengakses menu Employees, Anda akan melihat:
- **Employee List**: Daftar semua karyawan
- **Add New Employee**: Tombol untuk menambah karyawan baru
- **Search Bar**: Pencarian berdasarkan nama atau posisi
- **Filter Options**: Filter berdasarkan lokasi, divisi, atau status

```
┌─────────────────────────────────────────────────────┐
│                  Employee Management                │
├─────────────────────────────────────────────────────┤
│  [+ Add New Employee]     [Search...]  [Filters▼]  │
├─────────────────────────────────────────────────────┤
│  Name          Position        Location    Actions  │
│  John Doe      Supervisor      Jakarta     [Edit]   │
│  Jane Smith    Team Leader     Bandung     [Edit]   │
│  Ahmad Ali     All Star        Surabaya    [Edit]   │
└─────────────────────────────────────────────────────┘
```

---

## ➕ Adding New Employees

### Step 1: Access Add Employee Form
1. Klik tombol **"Add New Employee"**
2. Form input akan terbuka dalam modal atau halaman baru

### Step 2: Fill Employee Information

#### Required Fields
```
┌─────────────────────────────────────────┐
│           Add New Employee              │
├─────────────────────────────────────────┤
│ Full Name*: [________________]          │
│ Position*:  [Dropdown Select ▼]        │
│ Location*:  [Dropdown Select ▼]        │
│ Division*:  [Dropdown Select ▼]        │
├─────────────────────────────────────────┤
│ Employee ID: [_______________]          │
│ Email:       [_______________]          │
├─────────────────────────────────────────┤
│ [Cancel]              [Save Employee]   │
└─────────────────────────────────────────┘
```

#### Field Details:

**1. Full Name*** (Required)
- Format: "Nama Lengkap"
- Example: "Ahmad Fadli Rahman"
- Validasi: Minimum 2 karakter, maksimum 50 karakter

**2. Position*** (Required)
- Dropdown berisi 14 level jabatan:
  - Magang
  - Training
  - Member
  - Star
  - All Star
  - Team Leader 1
  - Team Leader 2
  - Junior Supervisor
  - Senior Supervisor
  - Junior Manager
  - Middle Manager
  - Senior Manager
  - Regional Manager
  - Division Head

**3. Location*** (Required)
- Dropdown dari master data lokasi
- Categories: Head Office, Store, Warehouse, Branch
- Example: "Jakarta Timur", "Bandung Utara"

**4. Division*** (Required)
- Dropdown dari master data divisi
- Example: "Operations", "Finance", "IT", "HRD"

**5. Employee ID** (Optional)
- Format bebas untuk ID karyawan
- Example: "EMP2024001"

**6. Email** (Optional)
- Format valid email address
- Example: "ahmad.fadli@sedjati.com"

### Step 3: Save Employee Data
1. Pastikan semua required fields terisi
2. Klik **"Save Employee"**
3. Sistem akan validasi data
4. Jika berhasil, employee akan ditambahkan ke database
5. Redirect ke employee list dengan confirmation message

### Step 4: Verification
Setelah save, verifikasi bahwa:
- ✅ Employee muncul di employee list
- ✅ Data tersimpan dengan benar
- ✅ Status "Active" terisi otomatis
- ✅ Timestamp created terisi

---

## ✏️ Managing Employee Data

### Editing Employee Information

#### Step 1: Access Edit Mode
1. Di employee list, klik tombol **"Edit"** pada baris employee
2. Form edit akan terbuka dengan data existing

#### Step 2: Modify Data
- Edit field yang diperlukan
- Validasi sama seperti saat add new employee
- Klik **"Update Employee"** untuk save changes

#### Step 3: Confirmation
- Sistem akan update data di database
- Employee list akan refresh dengan data terbaru
- Success message akan ditampilkan

### Deactivating Employees

#### Option 1: Status Toggle
```
Employee Status: [Active ▼]
Options: Active, Inactive
```

#### Option 2: Soft Delete
- Employee tidak dihapus permanent
- Status diubah menjadi "Inactive"
- Data tetap tersimpan untuk historical purposes

### Deleting Employees

⚠️ **Warning**: Delete operation bersifat permanent!

#### Step 1: Delete Confirmation
1. Klik tombol **"Delete"** pada employee
2. Confirmation dialog akan muncul:

```
┌─────────────────────────────────────────┐
│              Confirm Delete             │
├─────────────────────────────────────────┤
│ Are you sure you want to delete this    │
│ employee?                               │
│                                         │
│ Name: Ahmad Fadli Rahman                │
│ Position: Supervisor                    │
│                                         │
│ This action cannot be undone.           │
├─────────────────────────────────────────┤
│ [Cancel]              [Delete Employee] │
└─────────────────────────────────────────┘
```

#### Step 2: Impact Check
Before deleting, system akan check:
- ❓ Apakah employee pernah di-assess?
- ❓ Apakah ada assessment results terkait?

#### Step 3: Handle Dependencies
Jika ada assessment results:
- **Option A**: Tidak bisa dihapus (recommended)
- **Option B**: Delete cascade (hapus semua results)
- **Option C**: Convert to inactive status

---

## 📊 Employee Data Fields

### Core Employee Schema

```typescript
interface Employee {
  id: string;                    // Auto-generated unique ID
  name: string;                  // Full employee name
  position: string;              // Job position from 14 levels
  location: string;              // Work location
  division: string;              // Division name
  email?: string;                // Optional email
  employeeNumber?: string;       // Optional employee ID
  isActive: boolean;             // Active status
  createdAt: Timestamp;          // Creation timestamp
  createdBy: string;             // Creator admin ID
  updatedAt?: Timestamp;         // Last update timestamp
}
```

### Field Validations

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| name | string | Yes | 2-50 characters, no special chars |
| position | string | Yes | Must exist in position master |
| location | string | Yes | Must exist in location master |
| division | string | Yes | Must exist in division master |
| email | string | No | Valid email format if provided |
| employeeNumber | string | No | Alphanumeric, max 20 chars |

### Position-Template Relationship

Setiap position harus memiliki assessment template yang sesuai:

```
Position: "Supervisor" → Template: "template_supervisor"
Position: "Manager" → Template: "template_manager" 
```

**Important**: Jika tidak ada template untuk position tertentu, employee tidak bisa di-assess.

---

## 📦 Bulk Operations

### Bulk Import Employees

#### Step 1: Prepare Import File
Create CSV file dengan format:

```csv
name,position,location,division,email,employeeNumber
Ahmad Fadli Rahman,Supervisor,Jakarta Timur,Operations,ahmad@sedjati.com,EMP001
Sarah Putri,Team Leader,Bandung Utara,Finance,sarah@sedjati.com,EMP002
Budi Santoso,All Star,Surabaya Selatan,IT,budi@sedjati.com,EMP003
```

#### Step 2: Upload and Validate
1. Klik **"Import Employees"** button
2. Select CSV file
3. System akan preview data
4. Validasi automatic untuk:
   - Format data
   - Position existence
   - Location existence  
   - Division existence
   - Duplicate detection

#### Step 3: Confirm Import
```
┌─────────────────────────────────────────┐
│            Import Preview               │
├─────────────────────────────────────────┤
│ Total Records: 3                        │
│ Valid Records: 2                        │
│ Invalid Records: 1                      │
├─────────────────────────────────────────┤
│ Errors:                                 │
│ Row 3: Position "CEO" not found         │
├─────────────────────────────────────────┤
│ [Fix Errors]         [Import Valid Only]│
└─────────────────────────────────────────┘
```

### Bulk Export Employees

#### Export Options:
- **CSV Export**: All employee data
- **PDF Report**: Formatted employee report
- **Excel Export**: With formatting and formulas

#### Export Filters:
- By Division
- By Location  
- By Position
- By Status (Active/Inactive)
- By Date Range

---

## ✅ Best Practices

### Data Entry Guidelines

#### 1. Naming Conventions
```
✅ Good: "Ahmad Fadli Rahman"
✅ Good: "Sarah Putri Dewi"
❌ Bad: "ahmad fadli" (tidak konsisten capitalization)
❌ Bad: "A. Rahman" (terlalu singkat)
```

#### 2. Position Assignment
- Pilih position yang sesuai dengan job level actual
- Pastikan assessment template tersedia untuk position tersebut
- Update position saat ada promosi/demosi

#### 3. Location Accuracy
- Pastikan location sesuai dengan tempat kerja actual
- Update saat ada transfer lokasi
- Konsisten dengan master data location

#### 4. Division Alignment
- Sesuaikan dengan struktur organisasi actual
- Update saat ada reorganisasi
- Konsisten dengan master data division

### Data Maintenance

#### Regular Tasks:
- [ ] **Weekly**: Review new employee additions
- [ ] **Monthly**: Update employee positions after promotions
- [ ] **Quarterly**: Cleanup inactive employees
- [ ] **Yearly**: Full data audit and cleanup

#### Data Quality Checks:
- [ ] No duplicate employees
- [ ] All positions have corresponding templates
- [ ] All locations exist in master data
- [ ] All divisions exist in master data
- [ ] Email formats are valid (if provided)

### Security Considerations

#### Access Control:
- Only admin dapat manage employee data
- Log semua changes untuk audit trail
- Backup data secara regular

#### Data Privacy:
- Minimal data collection (hanya yang diperlukan)
- Secure storage di Firebase Firestore
- Comply dengan data protection regulations

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Position not found" Error
**Problem**: Position yang dipilih tidak tersedia di dropdown

**Solutions**:
1. Check master data positions di system
2. Pastikan assessment template exists untuk position tersebut
3. Contact admin untuk add position baru

#### Issue 2: Employee Not Appearing in Assessment
**Problem**: Employee tidak muncul saat evaluator memilih target

**Solutions**:
1. ✅ Check employee status = Active
2. ✅ Check position memiliki assessment template
3. ✅ Check location matching dengan filter
4. ✅ Refresh browser atau logout/login

#### Issue 3: Duplicate Employee Detection
**Problem**: System mencegah add employee dengan nama sama

**Solutions**:
1. Check existing employees dengan nama serupa
2. Add middle name atau initial untuk diferensiasi
3. Gunakan employee number untuk uniqueness

#### Issue 4: Import CSV Failures
**Problem**: Bulk import gagal atau sebagian data tidak terimport

**Solutions**:
1. ✅ Check CSV format sesuai template
2. ✅ Pastikan encoding UTF-8
3. ✅ Validasi required fields terisi semua
4. ✅ Check master data (positions, locations, divisions) exists

### Error Messages Reference

| Error Code | Message | Solution |
|------------|---------|----------|
| EMP001 | "Name is required" | Fill employee name field |
| EMP002 | "Position not found" | Select valid position from dropdown |
| EMP003 | "Location not found" | Select valid location from dropdown |
| EMP004 | "Division not found" | Select valid division from dropdown |
| EMP005 | "Invalid email format" | Provide valid email address |
| EMP006 | "Employee already exists" | Check for duplicates |
| EMP007 | "Position has no template" | Contact admin to create template |

### Performance Issues

#### Slow Loading Employee List
**Causes**:
- Large dataset (1000+ employees)
- Network connectivity issues
- Firestore query performance

**Solutions**:
1. Implement pagination (show 50 employees per page)
2. Add search/filter to narrow results
3. Check network connection
4. Contact technical support for database optimization

---

## 📞 Support and Help

### Getting Assistance
- **Technical Issues**: Contact IT Support
- **Process Questions**: Refer to Admin Guide
- **Data Issues**: Contact System Administrator

### Quick Reference

#### Essential Employee Fields:
```
Name ✓ | Position ✓ | Location ✓ | Division ✓
```

#### Employee Status Flow:
```
New → Active → [Assessment Ready] → Inactive (if needed)
```

#### Critical Checkpoints:
1. ✅ Position has assessment template
2. ✅ Location exists in master data  
3. ✅ Division exists in master data
4. ✅ Employee status = Active
5. ✅ No duplicate names in same location

---

**📧 Questions?** Contact the CRS support team or system administrator for assistance with employee setup and data management.

---

**📝 Last Updated**: January 2025  
**👤 Document Owner**: CRS Admin Team  
**🔄 Review Cycle**: Monthly