# 👥 Dokumentasi Fitur: Setup Karyawan - CRS Web App (Revisi)

## 🎯 Tujuan
Fitur ini memungkinkan admin untuk menambahkan data karyawan yang akan dinilai melalui sistem assessment. Data karyawan ini akan digunakan saat pengisian form penilaian dan pelaporan hasil.

---

## 🧾 Field yang Dibutuhkan

### 1. **Nama**
- Tipe: Input teks
- Deskripsi: Nama lengkap karyawan

### 2. **Jabatan**
- Tipe: Dropdown / Select
- **Data diambil dari daftar template assessment yang sudah dibuat**
- Contoh: "Supervisor", "Team Leader", "All Star"
- **Hanya jabatan yang memiliki template aktif yang bisa dipilih**

> Ini memastikan setiap karyawan memiliki assessment yang sesuai dengan levelnya

### 3. **Lokasi Kerja**
- Tipe: Dropdown / Select
- Data berasal dari **Setup Lokasi Kerja**
- Contoh nilai: "Jakarta Barat", "Bandung Utara", dll.
- Admin harus membuat daftar lokasi kerja terlebih dahulu

---

## 🧱 Struktur Firestore: `employees`

```json
{
  "id": "emp_001",
  "name": "Ahmad Fadli",
  "position": "Supervisor",
  "location": "Jakarta Timur",
  "createdAt": "timestamp",
  "createdBy": "uid_admin"
}
```

---

## 🛡️ Hak Akses

- Hanya `admin` yang dapat menambahkan, mengedit, atau menghapus data karyawan.
- Data ini digunakan oleh semua role saat melakukan assessment terhadap karyawan lain.

---

## 🖥️ Tampilan Form (UI Sketch)

```
[ Nama: ______________________ ]

[ Jabatan ▼ ] 
- (Diambil dari daftar template assessment)

[ Lokasi Kerja ▼ ]
- (Daftar lokasi dari setup lokasi)

[ SIMPAN DATA KARYAWAN ]
```

---

## 📌 Catatan:
- Jabatan akan sinkron langsung dari data template assessment, memastikan konsistensi penilaian.
- Lokasi kerja harus di-setup terlebih dahulu sebelum mengisi data karyawan.