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