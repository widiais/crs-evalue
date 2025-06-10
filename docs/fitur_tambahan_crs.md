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