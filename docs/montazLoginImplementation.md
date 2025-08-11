## Implementasi Login Montaz (sesuai kode saat ini, tanpa middleware)

Dokumen ini memandu implementasi login ke Montaz (`https://crs.montaz.id/api/login/`) agar bisa diterapkan kembali di aplikasi web lain. Contoh utama menggunakan Next.js (App Router), namun pola umumnya dapat diadaptasi ke framework lain.

### Ringkasan Arsitektur (tanpa middleware)
- Client mengirim email & password ke endpoint backend lokal (proxy) `/api/login`.
- Backend proxy meneruskan request ke API Montaz dengan header `Appkey` dan `FormData`, lalu mengembalikan JSON ke client.
- Jika sukses, backend menyetel cookie auth httpOnly (saat ini tidak dipakai untuk proteksi sisi server) dan client menyimpan token+profil user ke `localStorage` + cookie biasa.
- Auth Context di client memegang state user, menyediakan `login()` dan `logout()`, serta validasi sederhana (cek keberadaan token dan user di storage).
- Proteksi rute dilakukan di sisi client pada masing-masing halaman (cek `isAuthenticated`, lalu `router.push('/login')` bila belum login).

### Format Respons API Montaz (ringkas)
- Sukses: `{ code: "00", message: { key, first_name, last_name, client_id, user_type, email, job_title, role_id, ... } }`
- Gagal: `{ code: "400|420|430|...", message: "alasan gagal" }`

### Prasyarat
- Menggunakan App Key Montaz yang saat ini di-hardcode sesuai kode: `CRSMonT4z4pp$2o24` (ikuti persis implementasi repo ini). Catatan: untuk produksi, direkomendasikan memindahkan ke environment variable.
- Jalankan di HTTPS di produksi agar opsi cookie `secure` aktif.

## Implementasi di Next.js (App Router)

### 1) Endpoint Proxy `/api/login`
Lokasi: `src/app/api/login/route.ts`
- Membaca `email` dan `password` dari `FormData`.
- Meneruskan ke `https://crs.montaz.id/api/login/` dengan header `Appkey: 'CRSMonT4z4pp$2o24'` dan `Accept: 'application/json'`.
- Mengembalikan JSON ke client dan, jika sukses, menyetel cookie httpOnly `crs_auth_token`. Cookie ini saat ini tidak dipakai untuk middleware.

```ts
// src/app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const montazForm = new FormData()
    montazForm.append('email', email)
    montazForm.append('password', password)

    const response = await fetch('https://crs.montaz.id/api/login/', {
      method: 'POST',
      headers: {
        Appkey: 'CRSMonT4z4pp$2o24',
        Accept: 'application/json',
      },
      body: montazForm,
      cache: 'no-store',
    })

    const data = await response.json()

    const res = NextResponse.json(data, { status: response.status })

    if (data && data.code === '00' && typeof data.message === 'object') {
      const user = data.message as { key: string; email: string }
      const token = Buffer.from(`${user.key}_${user.email}_${Date.now()}`).toString('base64')

// Cookie httpOnly (saat ini tidak dipakai untuk middleware)
      res.cookies.set('crs_auth_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
      })
    } else {
      // Bersihkan cookie pada kegagalan
      res.cookies.set('crs_auth_token', '', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
        secure: process.env.NODE_ENV === 'production',
      })
    }

    return res
  } catch (error) {
    return NextResponse.json({ code: '500', message: 'Internal server error' }, { status: 500 })
  }
}
```

Catatan:
- Simpan App Key Montaz di `process.env.MONTAZ_APP_KEY`.
- Token yang dibuat di atas adalah contoh sederhana. Untuk produksi, gunakan token yang ditandatangani (mis. JWT) di server.

### 2) Service Auth di Client
Lokasi: `src/services/auth.ts`
- Memanggil `/api/login` (proxy lokal), meneruskan `email` & `password` sebagai `FormData`.
- Menyimpan token (dibuat lokal via `btoa`) dan data user ke `localStorage`.
- Menyetel cookie non-httpOnly `crs_auth_token` (untuk konsistensi state client). Tidak ada middleware yang membaca cookie ini.

```ts
// src/services/auth.ts (ringkasan inti)
class AuthService {
  private readonly API_URL = '/api/login'
  private readonly TOKEN_KEY = 'crs_auth_token'
  private readonly USER_KEY = 'crs_user_data'

  private setCookie(name: string, value: string, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`
  }

  private deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`
  }

  async login({ email, password }: { email: string; password: string }) {
    const form = new FormData()
    form.append('email', email)
    form.append('password', password)

    const res = await fetch(this.API_URL, {
      method: 'POST',
      headers: { Accept: 'application/json', Appkey: 'CRSMonT4z4pp$2o24' },
      body: form,
      credentials: 'include', // penting agar cookie httpOnly dari server ikut tersimpan
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    if (data.code === '00' && typeof data.message === 'object') {
      const u = data.message
      const token = btoa(`${u.key}_${u.email}_${Date.now()}`)
      const user = {
        id: u.key,
        email: u.email,
        name: `${u.first_name} ${u.last_name}`,
        role: u.user_type,
        firstName: u.first_name,
        lastName: u.last_name,
        clientId: u.client_id,
        userType: u.user_type,
        jobTitle: u.job_title,
        roleId: u.role_id,
      }

      localStorage.setItem(this.TOKEN_KEY, token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
      this.setCookie(this.TOKEN_KEY, token, 7)

      return { success: true, token, user }
    }

    // mapping error code → pesan
    const messages: Record<string, string> = {
      '400': 'Email atau password salah',
      '420': 'Akun tidak ditemukan',
      '430': 'Karyawan telah resign',
    }
    return { success: false, message: messages[data.code] || data.message || 'Login gagal' }
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    this.deleteCookie(this.TOKEN_KEY)
    window.location.href = '/login'
  }

  getToken() { return typeof window === 'undefined' ? null : localStorage.getItem(this.TOKEN_KEY) }
  getUser()  { const v = typeof window === 'undefined' ? null : localStorage.getItem(this.USER_KEY); return v ? JSON.parse(v) : null }
  async validateToken() { return !!(this.getToken() && this.getUser()) }
}

export const authService = new AuthService()
```

### 3) Auth Context Provider
Lokasi: `src/contexts/AuthContext.tsx`
- Memuat state user saat mount dengan membaca dari `authService`.
- Validasi token sederhana: cek keberadaan token dan user di storage.
- Menyediakan `login(email, password)` dan `logout()`.

```tsx
// src/contexts/AuthContext.tsx (ringkasan inti)
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '@/services/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      const token = authService.getToken()
      const u = authService.getUser()
      if (token && u && (await authService.validateToken())) setUser(u)
      setLoading(false)
    }
    run()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password })
    if (res.success && res.user) setUser(res.user)
    return res
  }

  const logout = () => { setUser(null); authService.logout() }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user && !loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthContext = createContext<any>(null)
export const useAuth = () => useContext(AuthContext)
```

### 4) Halaman Login + Redirect (tanpa middleware)
Lokasi: `src/app/login/page.tsx`
- Jika user sudah login, otomatis redirect ke `/`.
- Submit form memanggil `useAuth().login()`. Jika sukses, `router.push('/')`.

```tsx
// src/app/login/page.tsx (potongan inti)
'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => { if (!authLoading && isAuthenticated) router.push('/') }, [authLoading, isAuthenticated, router])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await login(email, password)
    if (res.success) router.push('/')
  }

  return (<form onSubmit={submit}>{/* input email/password + tombol */}</form>)
}
```

### 5) Proteksi Rute di Client (sesuai implementasi saat ini)
Contoh: `src/app/page.tsx` melakukan redirect ke `/login` bila belum terautentikasi.

```tsx
// src/app/page.tsx (potongan inti)
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Redirecting...</div>
  return <div>/* Konten yang butuh login */</div>
}
```

### 6) Logout
- Hapus token & user di `localStorage`.
- Hapus cookie `crs_auth_token`.
- Redirect ke `/login`.

```ts
// di AuthService
logout() {
  localStorage.removeItem('crs_auth_token')
  localStorage.removeItem('crs_user_data')
  document.cookie = 'crs_auth_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;'
  window.location.href = '/login'
}
```

## Catatan Adaptasi
- Tanpa middleware: proteksi rute dilakukan di level halaman/komponen melalui `useAuth()`.
- Jika di masa depan ingin proteksi sisi server, baru aktifkan middleware (saat ini tidak digunakan di repo ini).

## Alur Redirect
- Setelah `login()` sukses, lakukan `router.push('/')` (Next.js) atau navigasi sesuai framework.
- Opsi: tambahkan query `?next=/halaman-tujuan` saat redirect ke login; setelah sukses, arahkan ke nilai `next`.

## Keamanan & Praktik Baik
- Appkey saat ini di-hardcode untuk meniru persis implementasi. Disarankan memindahkan ke environment variable di produksi.
- Cookie httpOnly disetel oleh proxy namun tidak dipakai untuk middleware. Proteksi rute dilakukan di client.
- Aktifkan `secure: true` untuk cookie di produksi (HTTPS).
- Pertimbangkan mengganti token sederhana dengan JWT bertandatangan di sisi server.
- Batasi retry login, logging sensitif, dan tampilkan pesan error generik ke user.

## Troubleshooting
- 401/403/CORS: pastikan pemanggilan dari client menuju endpoint backend lokal (bukan langsung Montaz) dan gunakan `credentials: 'include'`.
- 500 dari proxy: cek konektivitas dari server ke `crs.montaz.id` dan nilai `MONTAZ_APP_KEY`.
- Redirect tidak jalan: pastikan pemanggilan `router.push()` terjadi setelah `login()` resolve dan konteks auth terisi.
- Middleware memblokir asset: cek `config.matcher` agar mengecualikan asset statis/API/login.

## Referensi
- Endpoint Montaz: `https://crs.montaz.id/api/login/`
- Contoh koleksi Postman: lihat `docs/montaz_postman.md`


