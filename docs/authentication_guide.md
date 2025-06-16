# 🔐 Authentication System - CRS Admin Panel

## 📋 Overview

Sistem autentikasi CRS menggunakan **Username/Password Authentication** untuk mengamankan akses ke panel admin. Hanya credentials yang terdaftar dalam sistem yang dapat mengakses panel admin.

## 🚀 Cara Mengakses Admin Panel

### 1. Akses Halaman Login
- Buka halaman utama: `http://localhost:3000`
- Klik **"Masuk sebagai Administrator"** di bagian bawah halaman
- Atau akses langsung: `http://localhost:3000/admin/login`

### 2. Login dengan Username/Password
- Masukkan **Username**: `admin`
- Masukkan **Password**: `admin123`
- Klik tombol **"Masuk"**
- Sistem akan memverifikasi credentials Anda

### 3. Akses Dashboard
- Setelah login berhasil, Anda akan diarahkan ke dashboard admin
- Header akan menampilkan nama dan username Anda
- Dapat logout melalui dropdown menu di header

## 👥 Admin Credentials

Saat ini, credentials yang dapat mengakses admin panel:
- **Username**: `admin`
- **Password**: `admin123`

### Menambah Admin Baru
Untuk menambah admin baru, edit file `src/contexts/AuthContext.tsx`:

```typescript
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
  user: {
    id: 'admin-001',
    username: 'admin',
    email: 'admin@crs-system.com',
    displayName: 'Administrator',
    role: 'admin'
  }
};

// Untuk multiple admin, bisa dibuat array:
const ADMIN_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    user: { /* user data */ }
  },
  {
    username: 'admin2',
    password: 'password123',
    user: { /* user data */ }
  }
];
```

## 🔒 Fitur Keamanan

### Proteksi Route
- Semua halaman `/admin/*` (kecuali `/admin/login`) dilindungi oleh autentikasi
- User yang belum login akan diarahkan ke halaman login
- User dengan credentials salah akan melihat pesan error

### Session Management
- Menggunakan localStorage untuk session management
- Session otomatis tersimpan di browser
- Logout akan menghapus session dan redirect ke homepage

### Error Handling
Sistem menangani berbagai error scenario:
- **Username/Password kosong**: Pesan "Username dan password harus diisi"
- **Credentials salah**: Pesan "Username atau password salah!"
- **Error umum**: Pesan "Terjadi kesalahan saat login"

## 🏗️ Struktur Sistem

### Components & Files
```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication context & provider
├── components/
│   ├── ProtectedRoute.tsx       # Route protection component
│   └── AdminHeader.tsx          # Admin header with user info & logout
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout with AuthProvider
│   │   ├── AdminLayoutClient.tsx # Client-side layout logic
│   │   └── login/
│   │       └── page.tsx        # Username/Password login page
```

### Authentication Flow
```
1. User clicks "Masuk sebagai Administrator"
2. Redirected to /admin/login
3. User enters username and password
4. System validates credentials
5. If valid: save to localStorage and redirect to /admin dashboard
6. If invalid: show error message
```

## 🛠️ Development Notes

### Testing Authentication
1. **Valid Credentials**: Use `admin` / `admin123` untuk testing login berhasil
2. **Invalid Credentials**: Use wrong username/password untuk testing error
3. **Empty Fields**: Leave fields empty untuk testing validation

### Local Storage
Authentication menggunakan localStorage dengan key:
- `crs_admin_user`: Menyimpan data user yang login

### State Management
- `useAuth()` hook provides user state globally
- `isLoading`, `isAuthorized`, `user` states available
- Automatic session restoration on page refresh

## 🚨 Security Considerations

### Production Deployment
Untuk production, pastikan:
1. **JANGAN** hardcode credentials di code
2. Gunakan database untuk menyimpan user credentials
3. Implement password hashing (bcrypt, etc.)
4. Add rate limiting untuk login attempts
5. Implement proper session management

### Best Practices
- Ganti default password sebelum production
- Implement password complexity requirements
- Add password reset functionality
- Monitor login attempts untuk security
- Consider implementing JWT tokens

## 📞 Support

Jika mengalami masalah:
1. Pastikan menggunakan credentials yang benar
2. Clear browser localStorage jika session error
3. Pastikan JavaScript enabled di browser
4. Check browser console untuk error logs

## 🔄 Updates & Maintenance

### Mengubah Password
Edit `src/contexts/AuthContext.tsx`:
```typescript
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'new_password_here', // Ganti password
  user: {
    // ... user data
  }
};
```

### Implementasi Multiple Users
Untuk mendukung multiple admin users:

```typescript
// Array of admin users
const ADMIN_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    user: {
      id: 'admin-001',
      username: 'admin',
      email: 'admin@crs-system.com',
      displayName: 'Administrator',
      role: 'admin'
    }
  },
  {
    username: 'manager',
    password: 'manager123',
    user: {
      id: 'manager-001',
      username: 'manager',
      email: 'manager@crs-system.com',
      displayName: 'Manager',
      role: 'admin'
    }
  }
];

// Update signInWithCredentials function
const signInWithCredentials = async (username: string, password: string) => {
  const foundUser = ADMIN_USERS.find(
    admin => admin.username === username && admin.password === password
  );
  
  if (foundUser) {
    setUser(foundUser.user);
    localStorage.setItem('crs_admin_user', JSON.stringify(foundUser.user));
  } else {
    throw new Error('Invalid username or password');
  }
};
```

## 🔐 Demo Credentials

Untuk testing dan demo:
- **Username**: `admin`
- **Password**: `admin123`

> ⚠️ **Warning**: Ganti credentials ini sebelum deployment ke production!

---

**Created**: January 2024  
**Last Updated**: January 2024  
**Version**: 2.0 - Username/Password Authentication 