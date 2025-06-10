# 📘 Dokumentasi Lengkap: CRS Web App



---

## 📄 Proses Pengisian Assessments

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

---

## 📄 Report Assessments Doc

# 📊 Dokumentasi Fitur: Menu Reports – CRS Web App

## 🎯 Tujuan
Menampilkan hasil assessment yang telah dilakukan melalui sistem, dari tingkat ringkasan sampai laporan detail per karyawan. Memungkinkan admin melakukan analisis kinerja berdasarkan data penilaian.

---

## 🧾 Halaman Utama Menu `Reports`

Menampilkan daftar seluruh assessment yang telah dibuat dan memiliki hasil penilaian.

### Tabel:

| Judul Assessment        | Tanggal Dibuat | Jumlah Penilaian Masuk | Aksi     |
|------------------------|----------------|-------------------------|----------|
| Evaluasi Q3 Supervisor | 10 Juni 2025   | 23                      | [Lihat]  |

- **Judul Assessment**: Nama dari sesi assessment
- **Tanggal Dibuat**: Tanggal saat sesi dibuat oleh admin
- **Jumlah Penilaian Masuk**: Total data hasil penilaian yang sudah disubmit
- **Aksi (Lihat)**: Masuk ke halaman daftar hasil assessment per karyawan

---

## 📋 Halaman Daftar Hasil per Karyawan (Setelah Klik “Lihat”)

Menampilkan daftar karyawan yang telah dinilai dalam sesi assessment tersebut.

### Tabel:

| Karyawan       | Divisi      | Jabatan     |
|----------------|-------------|-------------|
| Ahmad Fadli    | Operation   | Supervisor  |
| Rina Kartika   | Finance     | Supervisor  |

- **Header tabel bisa di-sort** (nama, divisi, jabatan)
- Klik nama karyawan untuk membuka halaman detail hasilnya

---

## 📄 Halaman Detail Hasil per Karyawan

Menampilkan detail hasil penilaian individual:

- **Informasi Dasar:**
  - Nama
  - Jabatan
  - Lokasi Kerja
  - Divisi

- **Hasil Penilaian:**
  - Rata-rata skor per kategori dari 6 dimensi
  - Rata-rata skor dari 7 semangat kerja
  - Rekomendasi evaluator (Section 3)

- **Tombol:** Download laporan PDF per individu (opsional)

---

## 🧱 Struktur Firestore (Contoh)

```json
// assessments/{assessmentId}/results/{userId}
{
  "userId": "emp_001",
  "scores": [
    { "category": "Functional Competency", "average": 4.2 },
    { "category": "Soft Skill", "average": 3.8 }
  ],
  "semangatScores": [4, 5, 3, 4],
  "recommendation": "Layak Dipromosikan",
  "submittedAt": "timestamp",
  "submittedBy": "uid_assessor"
}
```

---

## 🛡️ Hak Akses

| Role    | Akses                                    |
|---------|------------------------------------------|
| Admin   | Melihat semua hasil laporan              |
| User    | Tidak dapat mengakses laporan            |

---

## ✅ Manfaat Fitur Reports

- Mempermudah admin melihat dan menganalisis hasil assessment
- Memberikan transparansi dan validitas terhadap proses evaluasi
- Mendukung pengambilan keputusan berbasis data

---

## 📄 Fitur Tambahan Crs

# 🚀 Fitur Tambahan & Penyempurnaan – CRS Web App

## ✅ 1. Satu Penilaian per Karyawan (per PIN)
- Dalam satu sesi assessment (berdasarkan PIN), **satu evaluator hanya boleh menilai satu karyawan sekali saja**
- Sistem akan:
  - Cek jika `evaluatorId + employeeId` sudah pernah digunakan pada assessmentId yang sama
  - Jika sudah, tampilkan peringatan dan larang pengisian ulang

---

## 🧾 2. Logging Aktivitas Penilaian

### Struktur Firestore (logs/)

```json
{
  "id": "log_001",
  "assessmentId": "assess_001",
  "evaluatorId": "uid_001",
  "targetId": "emp_021",
  "timestamp": "2025-06-10T14:20:00Z",
  "action": "submit_assessment",
  "status": "success"
}
```

> Log ini mencatat siapa menilai siapa, kapan, dan dalam konteks assessment yang mana.

---

## 📄 3. Export PDF – Report Per Orang

- Setiap hasil penilaian individu dapat diekspor ke PDF
- Isi PDF mencakup:
  - Data Karyawan (nama, jabatan, divisi, lokasi)
  - Hasil penilaian per kategori (rata-rata)
  - Semangat kerja
  - Rekomendasi evaluator
- Teknologi: `@react-pdf/renderer` atau `html2pdf.js`

---

## 🗂️ 4. Report Penilaian per Divisi

- Menampilkan rekap seluruh hasil penilaian per divisi
- Isi:
  - Daftar divisi
  - Jumlah karyawan dinilai
  - Rata-rata skor divisi
- Klik divisi → daftar karyawan → detail penilaian

---

## 📊 5. Report Penilaian per Jabatan

- Menampilkan hasil penilaian berdasarkan jabatan:
  - Jumlah orang per jabatan yang dinilai
  - Rata-rata skor per kategori
  - Jumlah rekomendasi promosi, pembinaan, dll.
- Tujuan: melihat performa kolektif berdasarkan peran struktural

---

## 🛡️ Implementasi & Validasi

- Semua fitur akan menggunakan role `admin` untuk mengakses
- Evaluator tetap hanya memiliki akses via PIN dan tidak melihat hasil
- Data PDF hanya bisa diunduh oleh admin

---

## 🧠 Manfaat Utama Fitur Tambahan

- Mencegah duplikasi penilaian
- Menyediakan audit trail (log)
- Memberikan akses laporan mendalam untuk analisis SDM
- Mempermudah export laporan resmi