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