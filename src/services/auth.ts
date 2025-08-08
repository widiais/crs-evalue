interface LoginCredentials {
  email: string;
  password: string;
}

interface MontazUser {
  key: string;
  first_name: string;
  last_name: string;
  client_id: string;
  user_type: string;
  email: string;
  job_title: string;
  note: string;
  last_online: string;
  role_id: string;
}

interface MontazLoginResponse {
  code: string;
  message: MontazUser | string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    firstName: string;
    lastName: string;
    clientId: string;
    userType: string;
    jobTitle: string;
    roleId: string;
  };
  message?: string;
}

class AuthService {
  private readonly API_URL = '/api/login'; // Gunakan API route lokal
  private readonly API_KEY = 'CRSMonT4z4pp$2o24';
  private readonly TOKEN_KEY = 'crs_auth_token';
  private readonly USER_KEY = 'crs_user_data';

  // Helper function untuk set cookie
  private setCookie(name: string, value: string, days: number = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  // Helper function untuk hapus cookie
  private deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('Attempting login to:', this.API_URL);
      
      // Buat FormData sesuai dengan format API Montaz
      const formData = new FormData();
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Appkey': this.API_KEY,
        },
        body: formData,
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MontazLoginResponse = await response.json();
      console.log('Response data:', data);

      // Handle berbagai response code dari API Montaz
      // Dalam method login, setelah berhasil:
      if (data.code === '00' && typeof data.message === 'object') {
      // Login berhasil
      const userData = data.message as MontazUser;
      
      // Generate token sederhana (karena API tidak memberikan token)
      const token = btoa(`${userData.key}_${userData.email}_${Date.now()}`);
      
      const user = {
        id: userData.key,
        email: userData.email,
        name: `${userData.first_name} ${userData.last_name}`,
        role: userData.user_type,
        firstName: userData.first_name,
        lastName: userData.last_name,
        clientId: userData.client_id,
        userType: userData.user_type,
        jobTitle: userData.job_title,
        roleId: userData.role_id,
      };
      
      // Simpan token dan data user ke localStorage DAN cookies
      console.log('Saving to localStorage and cookies:', { token, user });
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      // Simpan token ke cookies untuk middleware
      this.setCookie(this.TOKEN_KEY, token, 7); // 7 hari
      
      // Verify save
      const savedToken = localStorage.getItem(this.TOKEN_KEY);
      const savedUser = localStorage.getItem(this.USER_KEY);
      console.log('Verification - Data saved:', { 
        tokenSaved: !!savedToken, 
        userSaved: !!savedUser 
      });

      return {
        success: true,
        token,
        user,
        message: 'Login berhasil'
      };
      } else {
        // Handle error responses
        let errorMessage = 'Login gagal';
        
        switch (data.code) {
          case '400':
            errorMessage = 'Email atau password salah!';
            break;
          case '420':
            errorMessage = 'Akun tidak ditemukan dengan email ini.';
            break;
          case '430':
            errorMessage = 'Karyawan telah resign.';
            break;
          default:
            errorMessage = typeof data.message === 'string' ? data.message : 'Login gagal';
        }

        return {
          success: false,
          message: errorMessage,
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle CORS error specifically
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Tidak dapat terhubung ke server. Pastikan koneksi internet Anda stabil.',
        };
      }
      
      return {
        success: false,
        message: `Terjadi kesalahan saat login: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  async loginAsAdmin(username: string, password: string): Promise<LoginResponse> {
    // Hardcoded admin credentials as requested
    if (username === 'superadmin' && password === 'superlogin2025') {
      const now = Date.now();
      const user = {
        id: 'admin',
        email: 'admin@local',
        name: 'Super Admin',
        role: 'admin',
        firstName: 'Super',
        lastName: 'Admin',
        clientId: '0',
        userType: 'admin',
        jobTitle: 'Administrator',
        roleId: '0',
      };

      const token = btoa(`admin_${now}`);

      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.setCookie(this.TOKEN_KEY, token, 7);

      return {
        success: true,
        token,
        user,
        message: 'Admin login berhasil',
      };
    }

    return {
      success: false,
      message: 'Username atau password admin salah',
    };
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    // Hapus cookie juga
    this.deleteCookie(this.TOKEN_KEY);
    
    window.location.href = '/login';
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): any | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Validasi token sederhana (karena API tidak menyediakan endpoint validasi)
  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    const user = this.getUser();
    
    // Validasi sederhana: cek apakah token dan user data ada
    return !!(token && user);
  }
}

export const authService = new AuthService();