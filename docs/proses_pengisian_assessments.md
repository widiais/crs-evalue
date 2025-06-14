# 🖊️ Dokumentasi Proses Pengisian Assessments – CRS Web App

## 🎯 Tujuan
Menjelaskan alur dan logika teknis bagi evaluator dalam mengisi penilaian setelah menerima PIN dari admin. Termasuk pemilihan target karyawan, data evaluator, dan pengisian form assessment.

---

## 🧾 Halaman Awal: Akses Menggunakan PIN

- Textbox input PIN: 6 karakter (kombinasi huruf dan angka)
- Tombol: [Submit]
- Validasi:
  - Jika PIN valid → lanjut ke halaman pengisian
  - Jika tidak valid → tampilkan error

---

## 📋 Halaman Isi Data Penilaian

### 1. **Siapa yang Dinilai (Target Assessment)**

#### 🔹 Lokasi Kerja
- Dropdown, data diambil dari Setup Lokasi Kerja

#### 🔹 Jabatan
- Dropdown, berisi jabatan yang tersedia di lokasi kerja tersebut

#### 🔹 Karyawan
- Dropdown otomatis menampilkan karyawan yang sesuai berdasarkan:
  - Lokasi kerja
  - Jabatan

> Sistem akan menampilkan **data karyawan yang aktif dan valid untuk assessment ini**

---

### 2. **Data Evaluator (Si Penilai)**

#### 🔹 Divisi Evaluator
- Dropdown list divisi internal perusahaan

#### 🔹 Jabatan Evaluator
- Dropdown (data jabatan aktif)

#### 🔹 Nama Evaluator
- Input teks (nama lengkap penilai)

#### 🔹 Status Hubungan dengan yang Dinilai
- Dropdown pilihan tetap:
  - Atasan Langsung
  - Rekan Kerja Setara
  - Bawahan
  - Bagian Terkait
  - Human Capital Development (HCD)

> Semua data ini akan disimpan agar admin bisa melihat siapa menilai siapa, berapa kali, dan dalam konteks hubungan kerja apa

---

## ▶️ Setelah Submit Data

- Tombol: [Next / Mulai Assessment]
- Sistem:
  - Menyimpan data evaluator dan target
  - Menampilkan form assessment berdasarkan **template yang digunakan pada PIN**

---

## 📁 Data yang Disimpan (Contoh)

```json
{
  "assessmentId": "assess_001",
  "evaluator": {
    "name": "Fajar Ananda",
    "division": "HRD",
    "position": "Team Leader",
    "status": "Atasan Langsung"
  },
  "target": {
    "employeeId": "emp_021",
    "name": "Arif Maulana",
    "location": "Bandung Utara",
    "position": "Supervisor"
  },
  "submittedAt": "timestamp"
}
```

---

## 🛡️ Keamanan & Validasi
- Hanya PIN aktif yang bisa digunakan
- Setiap kombinasi evaluator + target disimpan untuk keperluan rekap & analisis
- Evaluator bisa menilai lebih dari satu orang selama dalam sesi yang sama

---

## ✅ Manfaat Sistem Ini
- Penilaian jadi **terstruktur dan akurat**
- Admin bisa melihat **siapa menilai siapa dan berapa kali**
- **Akses berbasis PIN** menjaga penilaian tetap terbatas dan sesuai jadwal

# ✍️ Assessment Process Guide - CRS Web App

## 📋 Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
- [PIN Access Process](#pin-access-process)
- [Evaluator Information Setup](#evaluator-information-setup)
- [Target Employee Selection](#target-employee-selection)
- [Assessment Form Completion](#assessment-form-completion)
- [Submission and Confirmation](#submission-and-confirmation)
- [Common Issues](#common-issues)
- [Best Practices](#best-practices)

---

## 🎯 Overview

Assessment Process adalah proses dimana evaluator menggunakan sistem CRS untuk menilai kompetensi karyawan berdasarkan template assessment yang telah ditetapkan. Proses ini menggunakan sistem berbasis PIN yang memungkinkan akses mudah tanpa perlu registrasi account.

### Key Features
- ✅ **PIN-based Access**: No registration required
- ✅ **Guided Process**: Step-by-step assessment flow
- ✅ **Duplicate Prevention**: Cannot assess same person twice
- ✅ **Auto-save**: Progress saved automatically
- ✅ **Mobile Friendly**: Works on all devices
- ✅ **Validation**: Built-in validation and error checking

### Assessment Components
1. **Section 1**: 6 Dimensi Kompetensi (Variable questions based on job level)
2. **Section 2**: 7 Semangat Sedjati (Standard questions)
3. **Section 3**: Rekomendasi Evaluator (Fixed options)

---

## 🚀 Getting Started

### Prerequisites for Evaluators
- Assessment PIN from admin/HR
- Knowledge of the employee being assessed
- Understanding of assessment criteria
- Stable internet connection
- Compatible device (computer, tablet, or smartphone)

### Assessment Context
Before starting, ensure you understand:
- **Your relationship** with the employee (atasan, rekan, bawahan)
- **Recent performance** and interactions
- **Assessment timeframe** (what period you're evaluating)
- **Company competency framework** and expectations

---

## 🔐 PIN Access Process

### Step 1: Access the Assessment Portal
1. Buka browser dan navigasi ke aplikasi CRS
2. Akan langsung muncul halaman **PIN Entry**

```
┌─────────────────────────────────────────────────────┐
│                  CRS Assessment                     │
│              Competency Review System               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Masukkan PIN Assessment untuk memulai penilaian    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ PIN Assessment: [________________]          │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│              [Mulai Assessment]                     │
│                                                     │
│  • PIN bersifat case-sensitive                     │
│  • Hubungi admin jika mengalami masalah            │
└─────────────────────────────────────────────────────┘
```

### Step 2: Enter Assessment PIN
1. **Input PIN** yang diberikan oleh admin/HR
2. PIN format: 6-8 karakter alphanumeric (contoh: `X7KZ3F`)
3. Klik **"Mulai Assessment"**

### Step 3: PIN Validation
System akan validasi PIN dan menampilkan informasi assessment:

```
┌─────────────────────────────────────────────────────┐
│                PIN Valid ✓                          │
├─────────────────────────────────────────────────────┤
│ Assessment: Evaluasi Supervisor Q1 2024            │
│ Periode: 1 Januari - 31 Januari 2024               │
│ Template: Level Supervisor, Team Leader, All Star   │
│                                                     │
│              [Lanjutkan ke Assessment]              │
└─────────────────────────────────────────────────────┘
```

### Common PIN Issues:
- **"PIN tidak valid"**: Check typing, case-sensitive
- **"PIN tidak aktif"**: Contact admin, assessment might be expired
- **"Terlalu banyak percobaan"**: Wait 15 minutes or contact admin

---

## 👤 Evaluator Information Setup

### Step 1: Provide Your Information
Setelah PIN valid, Anda akan diminta mengisi informasi evaluator:

```
┌─────────────────────────────────────────────────────┐
│                Informasi Evaluator                  │
├─────────────────────────────────────────────────────┤
│ Nama Evaluator*:        [____________________]      │
│ Jabatan Evaluator*:     [____________________]      │
│ Divisi*:                [Dropdown Select ▼]        │
│ Status Hubungan*:       [Dropdown Select ▼]        │
├─────────────────────────────────────────────────────┤
│                  [Lanjutkan]                        │
└─────────────────────────────────────────────────────┘
```

#### Field Details:

**1. Nama Evaluator*** (Required)
- Format: Nama lengkap Anda
- Example: "Sarah Putri Dewi"
- Validasi: Minimum 2 karakter

**2. Jabatan Evaluator*** (Required)
- Format: Jabatan/posisi Anda saat ini
- Example: "Area Manager", "Senior Supervisor"
- Free text input

**3. Divisi*** (Required)
- Dropdown berisi daftar divisi dalam perusahaan
- Options: "Operations", "Finance", "IT", "HRD", dll
- Pilih divisi dimana Anda bekerja

**4. Status Hubungan*** (Required)
- Dropdown berisi relationship options:
  - **Atasan Langsung**: Direct supervisor
  - **Atasan Tidak Langsung**: Indirect supervisor
  - **Rekan Setingkat**: Peer/colleague
  - **Bawahan**: Subordinate
  - **Tim Internal**: Same team member
  - **Tim Eksternal**: Different team/department

### Step 2: Information Validation
System akan validate dan save informasi Anda untuk digunakan dalam assessment result.

---

## 👥 Target Employee Selection

### Step 1: Location Selection
Pilih lokasi kerja karyawan yang akan dinilai:

```
┌─────────────────────────────────────────────────────┐
│              Pilih Lokasi Kerja                     │
├─────────────────────────────────────────────────────┤
│ Lokasi Kerja*: [Dropdown Select ▼]                 │
│                                                     │
│ Options:                                            │
│ • Jakarta Timur                                     │
│ • Bandung Utara                                     │
│ • Head Office                                       │
│ • Surabaya Selatan                                  │
│ • ... (other locations)                            │
├─────────────────────────────────────────────────────┤
│                  [Lanjutkan]                        │
└─────────────────────────────────────────────────────┘
```

### Step 2: Position Selection
Pilih level jabatan karyawan yang akan dinilai:

```
┌─────────────────────────────────────────────────────┐
│               Pilih Level Jabatan                   │
├─────────────────────────────────────────────────────┤
│ Level Jabatan*: [Dropdown Select ▼]                │
│                                                     │
│ Available positions for Jakarta Timur:             │
│ • Supervisor                                        │
│ • Team Leader                                       │
│ • All Star                                          │
│ • Member                                            │
│ • ... (positions available in location)            │
├─────────────────────────────────────────────────────┤
│                  [Lanjutkan]                        │
└─────────────────────────────────────────────────────┘
```

### Step 3: Employee Selection
Pilih karyawan spesifik yang akan dinilai:

```
┌─────────────────────────────────────────────────────┐
│              Pilih Karyawan                         │
├─────────────────────────────────────────────────────┤
│ Karyawan*: [Dropdown Select ▼]                     │
│                                                     │
│ Supervisors in Jakarta Timur:                      │
│ • Ahmad Fadli Rahman                                │
│ • Budi Santoso                                      │
│ • Siti Nurhaliza                                    │
│ • ... (employees matching criteria)                │
│                                                     │
│ [🔍 Search]: [_______________]                      │
├─────────────────────────────────────────────────────┤
│                [Mulai Penilaian]                    │
└─────────────────────────────────────────────────────┘
```

### Step 4: Duplicate Check
System akan check apakah Anda sudah pernah menilai karyawan ini:

```
┌─────────────────────────────────────────────────────┐
│                Konfirmasi Target                    │
├─────────────────────────────────────────────────────┤
│ Karyawan yang akan dinilai:                        │
│                                                     │
│ Nama: Ahmad Fadli Rahman                            │
│ Jabatan: Supervisor                                 │
│ Lokasi: Jakarta Timur                               │
│ Divisi: Operations                                  │
│                                                     │
│ ✓ Anda belum pernah menilai karyawan ini           │
├─────────────────────────────────────────────────────┤
│          [Kembali]    [Mulai Penilaian]            │
└─────────────────────────────────────────────────────┘
```

**Jika sudah pernah dinilai:**
```
┌─────────────────────────────────────────────────────┐
│                   ⚠️ Peringatan                      │
├─────────────────────────────────────────────────────┤
│ Anda sudah pernah menilai karyawan ini pada        │
│ assessment session ini.                             │
│                                                     │
│ Tanggal penilaian: 15 Januari 2024, 14:30         │
│                                                     │
│ Silakan pilih karyawan lain untuk dinilai.         │
├─────────────────────────────────────────────────────┤
│                    [Kembali]                        │
└─────────────────────────────────────────────────────┘
```

---

## 📝 Assessment Form Completion

### Form Overview
Assessment form terdiri dari 3 sections yang harus diisi secara berurutan:

```
┌─────────────────────────────────────────────────────┐
│    Assessment untuk: Ahmad Fadli Rahman             │
│    Evaluator: Sarah Putri Dewi                      │
├─────────────────────────────────────────────────────┤
│ Progress: [██████████░░░░░░░░░░] 50%                │
│                                                     │
│ ✓ Section 1: 6 Dimensi Kompetensi (Complete)       │
│ ▶ Section 2: 7 Semangat Sedjati (Current)          │
│ ○ Section 3: Rekomendasi Evaluator (Pending)       │
└─────────────────────────────────────────────────────┘
```

### Section 1: 6 Dimensi Kompetensi

#### Question Format:
```
┌─────────────────────────────────────────────────────┐
│         Section 1: 6 Dimensi Kompetensi            │
├─────────────────────────────────────────────────────┤
│ Functional Competency                               │
│                                                     │
│ 1. Mampu menyelesaikan tugas sesuai standar        │
│    kualitas yang ditetapkan                        │
│                                                     │
│    [1] [2] [3] [4] [5]                             │
│     ↑              ↑              ↑                │
│  Kurang       Cukup         Baik Sekali           │
│  Sekali                                             │
│                                                     │
│ 2. Menguasai knowledge dan skills yang             │
│    dibutuhkan untuk posisi saat ini                │
│                                                     │
│    [1] [2] [3] [4] [5]                             │
│                                                     │
│ Leadership & Managerial                             │
│                                                     │
│ 3. Menunjukkan kemampuan memimpin dan              │
│    mengarahkan tim                                  │
│                                                     │
│    [1] [2] [3] [4] [5]                             │
│                                                     │
│ ... (continue for all questions)                   │
├─────────────────────────────────────────────────────┤
│              [Simpan & Lanjutkan]                   │
└─────────────────────────────────────────────────────┘
```

#### Scoring Scale:
- **1 - Kurang Sekali**: Performance jauh di bawah ekspektasi
- **2 - Kurang**: Performance di bawah ekspektasi
- **3 - Cukup**: Performance sesuai ekspektasi minimum
- **4 - Baik**: Performance di atas ekspektasi
- **5 - Baik Sekali**: Performance jauh melebihi ekspektasi

#### Category Progress Indicator:
```
Functional Competency:     ████████████ (3/3 answered)
Leadership & Managerial:   ████████░░░░ (2/3 answered)
Soft Skills:               ░░░░░░░░░░░░ (0/2 answered)
Problem Solving:           ░░░░░░░░░░░░ (0/2 answered)
Culture Fit:               ░░░░░░░░░░░░ (0/2 answered)
Akhlaq & Etika:           ░░░░░░░░░░░░ (0/2 answered)
```

### Section 2: 7 Semangat Sedjati

```
┌─────────────────────────────────────────────────────┐
│          Section 2: 7 Semangat Sedjati             │
├─────────────────────────────────────────────────────┤
│ 1. Menunjukkan semangat kerja yang tinggi dalam    │
│    setiap tugas yang diberikan                     │
│                                                     │
│    [1] [2] [3] [4] [5]                             │
│                                                     │
│ 2. Menjaga komitmen terhadap nilai-nilai           │
│    perusahaan dalam bekerja                        │
│                                                     │
│    [1] [2] [3] [4] [5]                             │
│                                                     │
│ 3. Menerapkan prinsip-prinsip Islami dalam         │
│    interaksi dengan rekan kerja                    │
│                                                     │
│    [1] [2] [3] [4] [5]                             │
│                                                     │
│ ... (continue for remaining 4 questions)           │
├─────────────────────────────────────────────────────┤
│              [Simpan & Lanjutkan]                   │
└─────────────────────────────────────────────────────┘
```

### Section 3: Rekomendasi Evaluator

```
┌─────────────────────────────────────────────────────┐
│         Section 3: Rekomendasi Evaluator           │
├─────────────────────────────────────────────────────┤
│ Berdasarkan penilaian Anda terhadap karyawan ini,  │
│ pilih rekomendasi yang paling sesuai:              │
│                                                     │
│ ( ) Dipertahankan di Level Sekarang                │
│     Karyawan perform dengan baik di level saat ini │
│                                                     │
│ ( ) Layak Dipromosikan                              │
│     Karyawan siap untuk tanggung jawab yang lebih  │
│                                                     │
│ ( ) Perlu Pembinaan Lebih Lanjut                   │
│     Karyawan memerlukan development dan coaching   │
│                                                     │
│ ( ) Perlu Rotasi / Penyesuaian Posisi             │
│     Karyawan lebih cocok di posisi/divisi lain     │
├─────────────────────────────────────────────────────┤
│                [Submit Assessment]                  │
└─────────────────────────────────────────────────────┘
```

### Navigation and Auto-save

#### Form Navigation:
```
[← Kembali]    Section 1 of 3    [Lanjutkan →]
```

#### Auto-save Feature:
- Progress disimpan otomatis setiap 30 detik
- Manual save dengan tombol "Simpan & Lanjutkan"
- Data tersimpan jika browser tertutup tidak sengaja

#### Validation Messages:
```
⚠️ Mohon jawab semua pertanyaan di section ini sebelum melanjutkan
✓ Section 1 berhasil disimpan
ℹ️ Progress assessment: 8 dari 15 pertanyaan dijawab
```

---

## ✅ Submission and Confirmation

### Pre-submission Review

```
┌─────────────────────────────────────────────────────┐
│              Review Assessment                      │
├─────────────────────────────────────────────────────┤
│ Target: Ahmad Fadli Rahman (Supervisor)             │
│ Evaluator: Sarah Putri Dewi (Area Manager)         │
│ Relationship: Atasan Langsung                       │
│                                                     │
│ ✓ Section 1: 15 pertanyaan dijawab                 │
│ ✓ Section 2: 7 pertanyaan dijawab                  │
│ ✓ Section 3: Rekomendasi dipilih                   │
│                                                     │
│ Assessment Summary:                                 │
│ • Total Questions: 22                               │
│ • Completion: 100%                                  │
│ • Recommendation: Layak Dipromosikan               │
├─────────────────────────────────────────────────────┤
│           [Edit]        [Submit Final]              │
└─────────────────────────────────────────────────────┘
```

### Final Confirmation

```
┌─────────────────────────────────────────────────────┐
│              Konfirmasi Pengiriman                  │
├─────────────────────────────────────────────────────┤
│ Apakah Anda yakin ingin mengirim assessment ini?   │
│                                                     │
│ ⚠️ PERHATIAN:                                       │
│ • Assessment tidak dapat diubah setelah dikirim    │
│ • Pastikan semua penilaian sudah sesuai            │
│ • Data akan tersimpan permanent di sistem          │
│                                                     │
│ Klik "Ya, Kirim Assessment" jika sudah yakin.      │
├─────────────────────────────────────────────────────┤
│         [Batal]      [Ya, Kirim Assessment]        │
└─────────────────────────────────────────────────────┘
```

### Success Confirmation

```
┌─────────────────────────────────────────────────────┐
│              ✅ Assessment Berhasil Dikirim         │
├─────────────────────────────────────────────────────┤
│ Assessment untuk Ahmad Fadli Rahman telah          │
│ berhasil disimpan dalam sistem.                    │
│                                                     │
│ Detail Pengiriman:                                 │
│ • Tanggal: 15 Januari 2024, 14:30 WIB             │
│ • Evaluator: Sarah Putri Dewi                      │
│ • Assessment ID: ASS-2024-001-015                  │
│                                                     │
│ Terima kasih atas partisipasi Anda!                │
├─────────────────────────────────────────────────────┤
│    [Nilai Karyawan Lain]    [Selesai]             │
└─────────────────────────────────────────────────────┘
```

### Post-Submission Options

1. **Nilai Karyawan Lain**: Continue dengan assessment untuk karyawan berbeda
2. **Selesai**: Exit assessment system
3. **Download Receipt**: Get confirmation receipt (optional)

---

## 🔧 Common Issues

### Technical Issues

#### Issue 1: Form Tidak Menyimpan
**Symptoms**: Data hilang atau tidak tersimpan
**Solutions**:
1. Check internet connection
2. Refresh page dan coba lagi
3. Use different browser
4. Clear browser cache
5. Contact technical support

#### Issue 2: PIN Tidak Diterima
**Symptoms**: PIN rejected atau invalid
**Solutions**:
1. Double-check PIN spelling (case-sensitive)
2. Verify PIN hasn't expired
3. Try copying/pasting PIN instead of typing
4. Contact admin for new PIN

#### Issue 3: Employee Tidak Muncul di List
**Symptoms**: Target employee tidak ada dalam dropdown
**Solutions**:
1. Verify location selection correct
2. Check position selection matches employee's job level
3. Confirm employee is active in system
4. Use search function if list is long
5. Contact admin if employee should be available

#### Issue 4: Tidak Bisa Submit Assessment
**Symptoms**: Submit button tidak aktif atau error
**Solutions**:
1. Ensure all sections completed (green checkmarks)
2. Check all required questions answered
3. Verify recommendation selected in Section 3
4. Try refreshing page and reviewing
5. Contact technical support

### Process Issues

#### Issue 1: Tidak Familiar dengan Karyawan
**Situation**: Diminta menilai karyawan yang tidak dikenal baik
**Solutions**:
1. Contact admin untuk clarification
2. Gather information dari rekan kerja lain
3. Base assessment pada limited interaction yang ada
4. Pilih "tidak dapat dinilai" jika tersedia
5. Discuss dengan HR tentang appropriateness

#### Issue 2: Conflict of Interest
**Situation**: Personal relationship dengan target employee
**Solutions**:
1. Disclose relationship dalam additional notes (jika tersedia)
2. Focus on professional performance only
3. Consider requesting different evaluator
4. Document potential bias dalam assessment

### Error Messages Reference

| Error Code | Message | Solution |
|------------|---------|----------|
| ASS001 | "PIN tidak valid" | Check PIN spelling and contact admin |
| ASS002 | "Sesi assessment expired" | Contact admin for new PIN |
| ASS003 | "Anda sudah menilai karyawan ini" | Choose different employee |
| ASS004 | "Semua pertanyaan harus dijawab" | Complete all questions in section |
| ASS005 | "Pilih rekomendasi di Section 3" | Select recommendation option |
| ASS006 | "Koneksi terputus" | Check internet and refresh |
| ASS007 | "Data tidak dapat disimpan" | Try again or contact support |

---

## ✅ Best Practices

### Preparation Guidelines

#### Before Starting Assessment:
- [ ] Review competency framework dan expectations
- [ ] Gather recent performance examples
- [ ] Consider multiple time periods dan situations
- [ ] Ensure quiet environment untuk concentrated evaluation
- [ ] Allocate sufficient time (15-30 minutes per employee)

#### During Assessment:
- [ ] Read each question carefully
- [ ] Base ratings on observable behaviors
- [ ] Use full range of 1-5 scale appropriately
- [ ] Be consistent dalam rating standards
- [ ] Take breaks if assessing multiple employees

### Rating Guidelines

#### Effective Rating Practices:
```
✅ Good: Base on specific examples and behaviors
✅ Good: Consider performance over extended period
✅ Good: Use appropriate scale range (don't cluster in middle)
✅ Good: Be honest dan objective

❌ Bad: Rate based on personal likes/dislikes
❌ Bad: Rate based on single incident
❌ Bad: Give all 3s to be "safe"
❌ Bad: Rush through questions
```

#### Scale Usage Guidelines:
- **Use 1-2**: Only for significantly below-standard performance
- **Use 3**: For meets expectations/standard performance
- **Use 4-5**: For above-standard dan exceptional performance
- **Avoid clustering**: Use full range of scale when appropriate

### Quality Assurance

#### Self-Check Before Submission:
- [ ] All questions answered thoughtfully
- [ ] Ratings reflect actual observed performance
- [ ] Recommendation aligns with overall ratings
- [ ] No obvious inconsistencies dalam responses
- [ ] Assessment completed in good faith

#### Documentation:
- Keep notes tentang specific examples (for future reference)
- Document assessment date dan context
- Record any unusual circumstances atau limitations

---

## 📱 Mobile Assessment

### Mobile-Specific Features

#### Responsive Design:
- Form automatically adjusts to screen size
- Touch-friendly rating buttons
- Optimized navigation untuk mobile
- Auto-save works on mobile devices

#### Mobile Best Practices:
- Use landscape mode untuk better view
- Ensure stable internet connection
- Avoid interruptions during assessment
- Consider using tablet untuk easier input

#### Mobile Troubleshooting:
- If form appears cut off, rotate device
- Clear mobile browser cache if issues persist
- Use latest browser version
- Contact support if mobile-specific problems occur

---

## 📞 Support and Help

### Getting Assistance
- **Process Questions**: Contact HR atau assessment coordinator
- **Technical Issues**: Contact IT support atau system administrator
- **PIN Issues**: Contact admin who provided original PIN
- **Employee Information**: Contact HR untuk employee verification

### Quick Reference

#### Assessment Checklist:
```
□ PIN valid dan accepted
□ Evaluator information complete
□ Target employee selected correctly
□ Section 1 completed (6 Dimensi Kompetensi)
□ Section 2 completed (7 Semangat Sedjati)
□ Section 3 completed (Rekomendasi)
□ Review completed before submission
□ Final confirmation submitted
```

#### Contact Information:
- **Assessment Support**: [contact-info]
- **Technical Help**: [contact-info]
- **HR Team**: [contact-info]

---

**📧 Questions?** Contact the assessment support team atau HR department for assistance with the assessment process.

---

**📝 Last Updated**: January 2025  
**👤 Document Owner**: CRS Support Team & HR Department  
**🔄 Review Cycle**: As needed based on user feedback