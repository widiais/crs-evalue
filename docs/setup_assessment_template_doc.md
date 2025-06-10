# 📋 Dokumentasi Fitur: Setup Template Assessment - CRS Web App

## 🎯 Tujuan
Fitur ini memungkinkan admin membuat template assessment yang terdiri dari 3 bagian utama:
1. Penilaian 6 Dimensi Kompetensi
2. Penerapan 7 Semangat Sedjati
3. Rekomendasi Evaluator

---

## 🧩 Struktur Template Assessment

### Section 1: Penilaian 6 Dimensi Kompetensi
Admin dapat menambahkan pertanyaan dan memilih kategori dari 6 kategori tetap:

- Functional Competency
- Leadership dan Managerial
- Soft Skill
- Problem Solving & Analytical Thinking
- Culture Fit and Commitment
- Akhlak dan Etika Kerja Islam

**Setiap pertanyaan menggunakan skala penilaian 1–5:**
1. Kurang Sekali
2. Kurang
3. Cukup
4. Baik
5. Baik Sekali

### Section 2: Penerapan 7 Semangat Sedjati
Admin dapat menambahkan pertanyaan bebas terkait semangat kerja.
Semua pertanyaan juga menggunakan skala penilaian 1–5 seperti di atas.

### Section 3: Rekomendasi Evaluator
Evaluator diminta memilih satu dari empat opsi tetap:
- Dipertahankan di Level Sekarang
- Layak Dipromosikan
- Perlu Pembinaan Lebih Lanjut
- Perlu Rotasi / Penyesuaian Posisi

---

## 🧱 Struktur Firestore: `criteria_templates`

```json
{
  "id": "template_middle_manager",
  "level": "Middle Manager",
  "createdAt": "timestamp",
  "section1": [
    { "text": "Disiplin dalam menyelesaikan tugas", "category": "Functional Competency" }
  ],
  "section2": [
    { "text": "Menunjukkan sikap positif saat bekerja" }
  ],
  "section3": {
    "type": "fixed_options",
    "label": "Rekomendasi Evaluator",
    "options": [
      "Dipertahankan di Level Sekarang",
      "Layak Dipromosikan",
      "Perlu Pembinaan Lebih Lanjut",
      "Perlu Rotasi / Penyesuaian Posisi"
    ]
  }
}
```

---

## 🛡️ Akses Role

- Hanya `admin` yang dapat membuat/mengedit template assessment.
- Semua user (admin, assessor, user) dapat menggunakan template saat mengisi penilaian.

---

## 🖥️ Tampilan Form (UI Sketch)

```
[ Level Assessment: ___________ ]

== Section 1: Penilaian 6 Dimensi ==
[ Pertanyaan ] [ Kategori ▼ ] [+ Tambah]

== Section 2: 7 Semangat Sedjati ==
[ Pertanyaan ] [+ Tambah]

== Section 3: Rekomendasi Evaluator ==
(•) Dipertahankan di Level Sekarang
( ) Layak Dipromosikan
( ) Perlu Pembinaan Lebih Lanjut
( ) Perlu Rotasi / Penyesuaian Posisi

[ SIMPAN TEMPLATE ]
```