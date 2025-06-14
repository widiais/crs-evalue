# 📍 Location Setup Guide - CRS Web App

## 📋 Table of Contents
- [Overview](#overview)
- [Accessing Location Management](#accessing-location-management)
- [Adding New Locations](#adding-new-locations)
- [Managing Location Data](#managing-location-data)
- [Location Categories](#location-categories)
- [Integration with Employee Data](#integration-with-employee-data)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Location Setup adalah proses penting dalam CRS untuk mengelola master data lokasi kerja. Data lokasi ini akan digunakan dalam employee management dan assessment filtering untuk memastikan evaluator dapat memilih karyawan berdasarkan lokasi kerja yang tepat.

### Key Features
- ✅ **Location Categories**: Head Office, Store, Warehouse, Branch
- ✅ **Geographic Information**: City and address details
- ✅ **Active Status Management**: Enable/disable locations
- ✅ **Employee Integration**: Direct link dengan employee data
- ✅ **Assessment Filtering**: Location-based employee filtering
- ✅ **Bulk Operations**: Import/export location data

### Prerequisites
- Admin access ke CRS dashboard
- Understanding organizational structure
- Geographic knowledge of company locations

---

## 🔐 Accessing Location Management

### Step 1: Login to Admin Dashboard
1. Buka aplikasi CRS di browser
2. Akses halaman admin dashboard
3. Pilih menu **"Locations"** di sidebar

### Step 2: Location Management Interface
Setelah mengakses menu Locations, Anda akan melihat:
- **Location List**: Daftar semua lokasi kerja
- **Add New Location**: Tombol untuk menambah lokasi baru
- **Search Bar**: Pencarian berdasarkan nama atau kota
- **Filter Options**: Filter berdasarkan kategori atau status

```
┌─────────────────────────────────────────────────────┐
│                Location Management                  │
├─────────────────────────────────────────────────────┤
│  [+ Add New Location]     [Search...]  [Filters▼]  │
├─────────────────────────────────────────────────────┤
│  Name            Category       City      Actions   │
│  Jakarta Timur   Store         Jakarta   [Edit]     │
│  Head Office     Head Office   Jakarta   [Edit]     │
│  Bandung Utara   Store         Bandung   [Edit]     │
│  Warehouse JKT   Warehouse     Jakarta   [Edit]     │
└─────────────────────────────────────────────────────┘
```

---

## ➕ Adding New Locations

### Step 1: Access Add Location Form
1. Klik tombol **"Add New Location"**
2. Form input akan terbuka dalam modal atau halaman baru

### Step 2: Fill Location Information

#### Required Fields
```
┌─────────────────────────────────────────┐
│           Add New Location              │
├─────────────────────────────────────────┤
│ Location Name*: [___________________]   │
│ Category*:      [Dropdown Select ▼]    │
│ City*:          [___________________]   │
│ Address:        [___________________]   │
│                 [___________________]   │
├─────────────────────────────────────────┤
│ [Cancel]              [Save Location]   │
└─────────────────────────────────────────┘
```

#### Field Details:

**1. Location Name*** (Required)
- Format: "Nama Lokasi"
- Example: "Jakarta Timur", "Bandung Utara", "Head Office"
- Validasi: Minimum 2 karakter, maksimum 50 karakter
- Must be unique within the system

**2. Category*** (Required)
- Dropdown dengan 4 pilihan:
  - **Head Office**: Kantor pusat perusahaan
  - **Store**: Toko/outlet retail
  - **Warehouse**: Gudang penyimpanan
  - **Branch**: Cabang atau office lainnya

**3. City*** (Required)
- Format: "Nama Kota"
- Example: "Jakarta", "Bandung", "Surabaya"
- Validasi: Minimum 2 karakter, maksimum 30 karakter

**4. Address** (Optional)
- Format: Alamat lengkap
- Example: "Jl. Raya Jakarta Timur No. 123, Matraman"
- Maksimum 200 karakter

### Step 3: Save Location Data
1. Pastikan semua required fields terisi
2. Klik **"Save Location"**
3. Sistem akan validasi data
4. Jika berhasil, location akan ditambahkan ke database
5. Redirect ke location list dengan confirmation message

### Step 4: Verification
Setelah save, verifikasi bahwa:
- ✅ Location muncul di location list
- ✅ Data tersimpan dengan benar
- ✅ Status "Active" terisi otomatis
- ✅ Timestamp created terisi

---

## ✏️ Managing Location Data

### Editing Location Information

#### Step 1: Access Edit Mode
1. Di location list, klik tombol **"Edit"** pada baris location
2. Form edit akan terbuka dengan data existing

#### Step 2: Modify Data
- Edit field yang diperlukan
- Validasi sama seperti saat add new location
- Klik **"Update Location"** untuk save changes

#### Step 3: Confirmation
- Sistem akan update data di database
- Location list akan refresh dengan data terbaru
- Success message akan ditampilkan

### Deactivating Locations

#### Option 1: Status Toggle
```
Location Status: [Active ▼]
Options: Active, Inactive
```

#### Option 2: Soft Delete
- Location tidak dihapus permanent
- Status diubah menjadi "Inactive"
- Data tetap tersimpan untuk historical purposes
- Employees dengan location ini tetap valid

### Deleting Locations

⚠️ **Warning**: Delete operation bersifat permanent dan berisiko!

#### Step 1: Dependency Check
Sebelum delete, system akan check:
- ❓ Apakah ada employees menggunakan location ini?
- ❓ Apakah ada assessment results terkait?

#### Step 2: Delete Confirmation
Jika safe untuk delete:

```
┌─────────────────────────────────────────┐
│              Confirm Delete             │
├─────────────────────────────────────────┤
│ Are you sure you want to delete this    │
│ location?                               │
│                                         │
│ Name: Jakarta Timur                     │
│ Category: Store                         │
│ City: Jakarta                           │
│                                         │
│ This action cannot be undone.           │
├─────────────────────────────────────────┤
│ [Cancel]              [Delete Location] │
└─────────────────────────────────────────┘
```

#### Step 3: Handle Dependencies
Jika ada dependencies:
```
┌─────────────────────────────────────────┐
│              Cannot Delete              │
├─────────────────────────────────────────┤
│ This location cannot be deleted because │
│ it is being used by:                    │
│                                         │
│ • 5 employees                           │
│ • 12 assessment results                 │
│                                         │
│ Please move employees to other locations│
│ or set location status to Inactive.     │
├─────────────────────────────────────────┤
│ [OK]                [Set as Inactive]   │
└─────────────────────────────────────────┘
```

---

## 🏢 Location Categories

### Category Definitions

#### 1. Head Office
- **Purpose**: Kantor pusat perusahaan
- **Characteristics**: Management, administration, executive functions
- **Example**: "Head Office Jakarta", "Corporate Center"
- **Typical Positions**: Division Head, Senior Manager, Corporate functions

#### 2. Store
- **Purpose**: Toko/outlet retail untuk penjualan
- **Characteristics**: Customer-facing, sales operations, retail staff
- **Example**: "Jakarta Timur", "Bandung Utara", "Mall Kelapa Gading"
- **Typical Positions**: Supervisor, Team Leader, All Star, Member

#### 3. Warehouse
- **Purpose**: Gudang penyimpanan dan distribusi
- **Characteristics**: Logistics, inventory, distribution operations
- **Example**: "Warehouse Jakarta", "Distribution Center Surabaya"
- **Typical Positions**: Warehouse Supervisor, Logistics Manager, Staff

#### 4. Branch
- **Purpose**: Cabang atau office lainnya
- **Characteristics**: Regional operations, support functions
- **Example**: "Regional Office Medan", "Training Center Bandung"
- **Typical Positions**: Regional Manager, Branch Manager, Support Staff

### Category Usage Guidelines

#### Choosing the Right Category:
1. **Identify Primary Function**: What is the main purpose of this location?
2. **Consider Operations**: What type of work happens here?
3. **Think about Reporting**: How should this location be grouped in reports?
4. **Plan for Growth**: Will this categorization make sense as company expands?

---

## 🔗 Integration with Employee Data

### Location-Employee Relationship

#### Database Relationship:
```
Location (1) ──→ (N) Employee
```

#### Example Data Flow:
```
Location: "Jakarta Timur" → Employees: [John Doe, Jane Smith, Ahmad Ali]
```

### Impact on Assessment Process

#### Employee Filtering:
When evaluator starts assessment:
1. Select Location → System shows employees in that location
2. Select Position → System filters employees by position within location
3. Select Employee → Assessment form loads

#### Assessment Flow:
```
PIN Entry → Location Selection → Position Selection → Employee Selection → Assessment Form
```

### Location-based Reporting

#### Reports Available:
- **Location Performance**: Average scores per location
- **Location Comparison**: Compare performance across locations
- **Geographic Analysis**: Performance by city/region
- **Category Analysis**: Performance by location category

---

## 📦 Bulk Operations

### Bulk Import Locations

#### Step 1: Prepare Import File
Create CSV file dengan format:

```csv
name,category,city,address
Jakarta Timur,Store,Jakarta,"Jl. Raya Jakarta Timur No. 123"
Bandung Utara,Store,Bandung,"Jl. Cihampelas No. 45"
Head Office,Head Office,Jakarta,"Jl. Sudirman No. 1"
Warehouse JKT,Warehouse,Jakarta,"Kawasan Industri Pulogadung"
```

#### Step 2: Upload and Validate
1. Klik **"Import Locations"** button
2. Select CSV file
3. System akan preview data
4. Validasi automatic untuk:
   - Format data
   - Category validity
   - Duplicate location names
   - Required field completeness

#### Step 3: Confirm Import
```
┌─────────────────────────────────────────┐
│            Import Preview               │
├─────────────────────────────────────────┤
│ Total Records: 4                        │
│ Valid Records: 3                        │
│ Invalid Records: 1                      │
├─────────────────────────────────────────┤
│ Errors:                                 │
│ Row 2: Category "Shop" is invalid       │
├─────────────────────────────────────────┤
│ [Fix Errors]         [Import Valid Only]│
└─────────────────────────────────────────┘
```

### Bulk Export Locations

#### Export Options:
- **CSV Export**: All location data with usage statistics
- **PDF Report**: Formatted location directory
- **Excel Export**: With charts and analysis

#### Export includes:
- Location details (name, category, city, address)
- Employee count per location
- Assessment count per location
- Last activity date

---

## ✅ Best Practices

### Location Naming Conventions

#### 1. Store Locations
```
✅ Good: "Jakarta Timur", "Bandung Utara", "Surabaya Kota"
✅ Good: "Mall Kelapa Gading", "Plaza Indonesia"
❌ Bad: "Toko 1", "Store JKT" (tidak descriptive)
❌ Bad: "jakarta timur" (tidak consistent capitalization)
```

#### 2. Office Locations
```
✅ Good: "Head Office", "Regional Office Medan"
✅ Good: "Training Center Bandung"
❌ Bad: "Office 1", "Kantor" (terlalu generic)
```

#### 3. Warehouse Locations
```
✅ Good: "Warehouse Jakarta", "Distribution Center Surabaya"
✅ Good: "Logistics Hub Medan"
❌ Bad: "Gudang 1", "WH" (tidak clear)
```

### Location Organization Strategy

#### Geographic Grouping:
- Group by major cities: Jakarta, Bandung, Surabaya
- Use consistent geographic identifiers
- Consider regional management structure

#### Functional Grouping:
- Separate stores, offices, warehouses
- Consider operational workflows
- Think about reporting needs

### Data Maintenance

#### Regular Tasks:
- [ ] **Monthly**: Review new location additions
- [ ] **Quarterly**: Update addresses and contact information
- [ ] **Yearly**: Cleanup inactive locations
- [ ] **As needed**: Update categories based on operational changes

#### Data Quality Checks:
- [ ] No duplicate location names
- [ ] All cities are spelled consistently
- [ ] Categories are appropriate for operations
- [ ] Addresses are accurate (if provided)
- [ ] All locations have at least one active employee

---

## 🗄️ Location Data Schema

### Core Location Schema

```typescript
interface Location {
  id: string;                    // Auto-generated unique ID
  name: string;                  // Location name
  city?: string;                 // City name
  address?: string;              // Full address
  category: 'Head Office' | 'Store' | 'Warehouse' | 'Branch';
  isActive: boolean;             // Location status
  createdAt: Timestamp;          // Creation timestamp
  createdBy: string;             // Creator admin ID
  updatedAt?: Timestamp;         // Last update timestamp
}
```

### Field Validations

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| name | string | Yes | 2-50 characters, unique |
| category | enum | Yes | Must be one of 4 valid categories |
| city | string | Yes | 2-30 characters |
| address | string | No | Max 200 characters |

### Usage Statistics (Read-only)

```typescript
interface LocationStats {
  locationId: string;
  employeeCount: number;         // Current active employees
  totalAssessments: number;      // Total assessments conducted
  lastAssessmentDate?: Date;     // Most recent assessment
  avgPerformanceScore?: number;  // Average performance (if available)
}
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Location name already exists" Error
**Problem**: Trying to add location dengan nama yang sudah ada

**Solutions**:
1. Check existing locations untuk duplicates
2. Use more specific names (add city or identifier)
3. Consider if existing location can be reused

#### Issue 2: Employees Not Showing in Location
**Problem**: Employees tidak muncul saat filter by location

**Solutions**:
1. ✅ Check employee location field matches exactly
2. ✅ Verify location status = Active
3. ✅ Check for typos in location names
4. ✅ Refresh browser cache

#### Issue 3: Cannot Delete Location
**Problem**: System prevents location deletion

**Solutions**:
1. Check for employees using this location
2. Check for historical assessment data
3. Consider setting status to Inactive instead
4. Move employees to different locations first

#### Issue 4: Import CSV Failures
**Problem**: Bulk import gagal atau sebagian data tidak terimport

**Solutions**:
1. ✅ Check CSV format matches template exactly
2. ✅ Validate category values (case-sensitive)
3. ✅ Ensure no duplicate location names
4. ✅ Check for empty required fields

### Error Messages Reference

| Error Code | Message | Solution |
|------------|---------|----------|
| LOC001 | "Location name is required" | Fill location name field |
| LOC002 | "Category is required" | Select valid category |
| LOC003 | "City is required" | Fill city field |
| LOC004 | "Location name already exists" | Use unique location name |
| LOC005 | "Invalid category" | Select from valid category options |
| LOC006 | "Cannot delete - has dependencies" | Remove dependencies or set inactive |
| LOC007 | "Location name too long" | Use shorter name (max 50 chars) |

### Performance Considerations

#### Large Location Lists:
- Implement pagination for 100+ locations
- Use search/filter to narrow results
- Consider regional grouping for very large organizations

#### Database Optimization:
- Index location names for fast searches
- Index category for filtering
- Consider geographic indexing for mapping features

---

## 📊 Location Analytics

### Key Metrics to Track

#### Operational Metrics:
1. **Employee Distribution**: Employees per location
2. **Assessment Activity**: Assessments per location per period
3. **Performance Trends**: Performance scores by location
4. **Utilization**: Active vs inactive locations

#### Geographic Analysis:
1. **City Performance**: Average scores by city
2. **Regional Comparison**: Performance across regions
3. **Location Type Analysis**: Store vs Office vs Warehouse performance
4. **Growth Patterns**: New locations and their performance

### Reporting Capabilities

#### Standard Reports:
- Location Directory (all locations with details)
- Employee Distribution by Location
- Assessment Activity by Location
- Location Performance Summary

#### Custom Analytics:
- Geographic heat maps (future feature)
- Location-based trending analysis
- Operational efficiency by location type
- Regional management dashboards

---

## 📞 Support and Help

### Getting Assistance
- **Setup Questions**: Refer to Admin Guide
- **Data Issues**: Contact System Administrator
- **Geographic Questions**: Contact Operations Team

### Quick Reference

#### Essential Location Setup:
```
Name ✓ | Category ✓ | City ✓ | Status = Active ✓
```

#### Location Categories:
```
Head Office | Store | Warehouse | Branch
```

#### Integration Checkpoints:
1. ✅ Location created and active
2. ✅ Employees assigned to location
3. ✅ Assessment templates available for employee positions
4. ✅ Location appears in evaluator filters
5. ✅ Reporting includes location data

---

**📧 Questions?** Contact the CRS support team or system administrator for assistance with location setup and management.

---

**📝 Last Updated**: January 2025  
**👤 Document Owner**: CRS Admin Team  
**🔄 Review Cycle**: Quarterly