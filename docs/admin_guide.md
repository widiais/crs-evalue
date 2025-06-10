# 🔧 Admin Guide - CRS System

Panduan lengkap untuk administrator sistem CRS (Competency Review System).

## 🔐 Cara Akses Admin Dashboard

### Login ke Admin Panel
1. Buka halaman utama aplikasi: `http://localhost:3000`
2. Scroll ke bawah hingga menemukan teks **"Hubungi administrator jika Anda tidak memiliki PIN"**
3. Klik link **"Masuk sebagai Admin"** yang ada di bawahnya
4. Anda akan diarahkan ke Admin Dashboard: `/admin`

### Akses Langsung
Alternatif: Akses langsung ke `http://localhost:3000/admin`

## 📊 Menu Admin Dashboard

### 🏠 Dashboard Utama
- **Firebase Status**: Monitoring koneksi database
- **Statistics**: Total assessments, employees, results
- **Quick Actions**: Seed data, test connection

### 👥 Setup Employees
**Path**: `/admin/employees`
- Tambah karyawan baru
- Edit data karyawan existing
- Import bulk employees
- Filter by location, position, division
- Export employee list

### 📋 Setup Assessments
**Path**: `/admin/assessments` 
- Buat assessment session baru
- Generate PIN untuk evaluator
- Set template pertanyaan
- Aktivasi/deaktivasi assessment
- Kelola periode assessment

### 📍 Setup Work Location
**Path**: `/admin/locations`
- Tambah lokasi kerja baru
- Edit lokasi existing
- Mapping location dengan division
- Set default locations

### 📈 Report Personal
**Path**: `/admin/reports/personal`
- Detail assessment per individu
- History penilaian karyawan
- Competency scores breakdown
- Individual performance trends
- Export personal report

### 🏢 Report Division
**Path**: `/admin/reports/division`
- Performance summary per divisi
- Division-wide competency analysis
- Comparison antar divisi
- Division trends over time
- Export division reports

### 👔 Report Role  
**Path**: `/admin/reports/role`
- Performance analysis per jabatan
- Role-based competency standards
- Position comparison
- Career progression insights
- Export role-based reports

## 🛠 Fitur Admin Utama

### Firebase Management
- **Test Connection**: Verifikasi koneksi Firebase
- **Seed Initial Data**: Input sample data untuk testing
- **Database Status**: Real-time monitoring Firestore

### Employee Management
```javascript
// Struktur data employee
{
  id: string,
  name: string,
  position: 'Supervisor' | 'Team Leader' | 'All Star',
  location: string,
  division: 'Operations' | 'Finance' | 'IT' | 'Marketing' | 'HRD',
  email?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Assessment Management
```javascript
// Struktur data assessment
{
  id: string,
  title: string,
  description?: string,
  templateIds: string[],
  pin: string, // 6-8 karakter
  isActive: boolean,
  startDate?: Date,
  endDate?: Date,
  createdAt: Date,
  createdBy: string
}
```

### Location Management
```javascript
// Struktur data location
{
  id: string,
  name: string, // e.g., 'Jakarta Timur'
  code: string, // e.g., 'JKT-T'
  region: string, // e.g., 'Jabodetabek'
  isActive: boolean
}
```

## 📋 Standard Operating Procedures

### 1. Setup Assessment Baru
1. **Buat Assessment**
   - Masuk ke `/admin/assessments`
   - Klik "Buat Assessment Baru"
   - Isi title dan description
   - Generate PIN atau set manual
   - Set periode assessment
   - Activate assessment

2. **Share PIN ke Evaluators**
   - Copy PIN dari dashboard
   - Share via email/komunikasi internal
   - Berikan instruksi cara akses

3. **Monitor Progress**
   - Check real-time statistics
   - Monitor submission rate
   - Follow up incomplete assessments

### 2. Employee Data Management
1. **Bulk Import**
   - Prepare CSV/Excel file
   - Match column headers
   - Import via `/admin/employees`
   - Verify imported data

2. **Manual Entry**
   - Add individual employees
   - Set position dan location
   - Assign to proper division
   - Validate data accuracy

### 3. Reporting & Analytics
1. **Generate Reports**
   - Select report type (Personal/Division/Role)
   - Set date range
   - Apply filters
   - Export results

2. **Analysis Workflow**
   - Review performance trends
   - Identify improvement areas
   - Compare across divisions/roles
   - Prepare recommendations

## 🔒 Security & Permissions

### Admin Access Control
- Admin access tidak perlu authentication (development mode)
- Production: implement proper authentication
- Role-based access control (future enhancement)

### Data Security
- Firebase security rules (to be configured)
- Input validation pada semua forms
- Data encryption untuk sensitive information

### Audit Trail
- Track admin actions
- Log data changes
- Monitor access patterns
- Maintain data integrity

## 🚨 Troubleshooting

### Common Issues

#### Firebase Connection Error
```
Symptoms: Red Firebase status, data tidak load
Solution: 
1. Check .env.local configuration
2. Verify Firebase project settings
3. Test connection via admin dashboard
```

#### PIN Generation Issues
```
Symptoms: PIN tidak unique atau sudah digunakan
Solution:
1. Check existing PINs in database
2. Generate new PIN dengan format berbeda  
3. Verify PIN uniqueness
```

#### Data Import Errors
```
Symptoms: Bulk import gagal atau data corrupt
Solution:
1. Validate file format (CSV/Excel)
2. Check column mapping
3. Verify data types
4. Remove duplicate entries
```

### Performance Optimization
- Use pagination untuk large datasets
- Implement caching untuk frequent queries
- Optimize Firebase queries
- Monitor database usage

## 📈 Best Practices

### Assessment Management
- Set clear assessment periods
- Use descriptive assessment titles
- Generate unique, easy-to-remember PINs
- Monitor completion rates

### Employee Data
- Keep employee data updated
- Regular data validation
- Maintain data consistency
- Backup critical data

### Reporting
- Schedule regular report generation
- Archive historical reports
- Use consistent reporting periods
- Share insights with stakeholders

## 🔮 Future Enhancements

### Planned Admin Features
- [ ] Role-based admin permissions
- [ ] Advanced data analytics
- [ ] Automated report scheduling
- [ ] Email notification system
- [ ] Data backup/restore
- [ ] Audit log viewer
- [ ] Advanced search & filtering
- [ ] Dashboard customization

### Integration Possibilities
- [ ] LDAP/Active Directory integration
- [ ] Email service integration
- [ ] Calendar integration
- [ ] Export to BI tools
- [ ] API untuk external systems

---

**📞 Support**: Hubungi tim development untuk bantuan teknis atau feature request. 