# 📍 Dokumentasi Fitur: Setup Lokasi Kerja - CRS Web App

## 🎯 Tujuan
Fitur ini memungkinkan admin menambahkan daftar lokasi kerja secara manual. Data lokasi kerja ini akan digunakan dalam:
- Dropdown pemilihan lokasi di Setup Karyawan
- Filter dan rekap laporan penilaian berdasarkan lokasi kerja

---

## 🧾 Field yang Dibutuhkan

### 1. **Nama Lokasi Kerja**
- Tipe: Input teks bebas
- Contoh: "Jakarta Timur", "Bandung Utara", "Depok Training Center"

---

## 🧱 Struktur Firestore: `locations`

```json
{
  "id": "loc_001",
  "name": "Bandung Utara",
  "createdAt": "timestamp",
  "createdBy": "uid_admin"
}
```

---

## 🛡️ Hak Akses

- Hanya `admin` yang dapat menambahkan, mengedit, atau menghapus lokasi kerja.

---

## 🖥️ Tampilan Form (UI Sketch)

```
[ Nama Lokasi Kerja: ____________________ ]  [+ Tambah]

📋 Daftar Lokasi Kerja:
1. Jakarta Timur
2. Bandung Utara
3. Cikarang Selatan
...

[ SIMPAN / HAPUS / EDIT ]
```

---

## 🔗 Integrasi

- Digunakan sebagai **dropdown pada form Setup Karyawan**
- Lokasi ini akan menjadi dasar untuk **filtering dan grouping laporan hasil assessment per lokasi kerja**

---

## 📌 Catatan:
- Lokasi kerja dapat terus ditambah seiring perkembangan cabang/area kerja baru