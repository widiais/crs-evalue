# Template Import Karyawan Excel

## Format File Excel

File Excel untuk import karyawan harus memiliki kolom-kolom berikut:

| Nama Karyawan | Kode Level | Kode Store | Kode Divisi |
|---------------|------------|------------|-------------|
| Fulan         | 3          | 2          | 1           |
| Fulana        | 8          | 15         | 2           |
| Ahmad         | 5          | 45         | 3           |

## Penjelasan Kolom

### 1. Nama Karyawan
- **Format**: Text
- **Contoh**: "Fulan", "Ahmad Syarif"
- **Validasi**: Tidak boleh kosong

### 2. Kode Level
- **Format**: Number (1-15)
- **Referensi**:
  - 1 = Magang
  - 2 = Training
  - 3 = Member
  - 4 = Star
  - 5 = All Star
  - 6 = TL1
  - 7 = TL2
  - 8 = Junior SPV
  - 9 = Middle SPV
  - 10 = Senior SPV
  - 11 = Junior Manager
  - 12 = Middle Manager
  - 13 = Senior Manager
  - 14 = Regional Manager
  - 15 = Division Head

### 3. Kode Store
- **Format**: Number (1-106)
- **Referensi**: (contoh)
  - 1 = LC Ahmad Yani
  - 2 = LC Alfathu
  - 3 = LC Angkrek
  - ... (sampai 106)

### 4. Kode Divisi
- **Format**: Number (1-4)
- **Referensi**:
  - 1 = Operational Store
  - 2 = FAD
  - 3 = HCD
  - 4 = IT

## Cara Menggunakan

1. **Download Template**: Klik tombol "Download Template Excel" untuk mendapatkan file template kosong
2. **Download Referensi**: Klik tombol "Download Referensi Kode" untuk mendapatkan daftar lengkap semua kode
3. **Isi Data**: Lengkapi data karyawan sesuai format di atas
4. **Upload**: Upload file Excel yang sudah diisi melalui fitur import
5. **Preview**: Sistem akan menampilkan preview data sebelum import
6. **Import**: Konfirmasi untuk melakukan import ke database

## Validasi Data

Sistem akan memvalidasi:
- ✅ Nama karyawan tidak boleh kosong
- ✅ Kode level harus valid (1-15)
- ✅ Kode store harus valid (1-106)
- ✅ Kode divisi harus valid (1-4)
- ✅ Karyawan belum ada di lokasi yang sama

## Error Handling

Jika ada data yang tidak valid:
- Sistem akan menampilkan detail error per baris
- Data yang valid tetap akan diimport
- Data yang error akan di-skip dengan pesan error yang jelas

## Tips

1. **Gunakan Template**: Selalu mulai dengan template yang disediakan
2. **Cek Referensi**: Pastikan kode yang digunakan sesuai dengan referensi
3. **Backup Data**: Backup data sebelum melakukan import besar-besaran
4. **Test Import**: Lakukan test import dengan sedikit data terlebih dahulu 