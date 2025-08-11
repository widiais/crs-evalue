import { NextRequest, NextResponse } from 'next/server';

// Ensure Node runtime and dynamic execution (no caching)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const montazFormData = new FormData();
    montazFormData.append('email', email);
    montazFormData.append('password', password);

    const response = await fetch('https://crs.montaz.id/api/login/', {
      method: 'POST',
      headers: {
        'Appkey': 'CRSMonT4z4pp$2o24',
        'Accept': 'application/json',
      },
      body: montazFormData,
      cache: 'no-store',
    });

    const data = await response.json();

    const res = NextResponse.json(data, { status: response.status });

    if (data && data.code === '00' && typeof data.message === 'object') {
      const user = data.message as { key: string; email: string };
      const token = Buffer.from(`${user.key}_${user.email}_${Date.now()}`).toString('base64');
      res.cookies.set('crs_auth_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production',
      });
    } else {
      // Clear cookie on failure
      res.cookies.set('crs_auth_token', '', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
        secure: process.env.NODE_ENV === 'production',
      });
    }

    return res;
  } catch (error) {
    console.error('Proxy login error:', error);
    return NextResponse.json(
      { code: '500', message: 'Internal server error' },
      { status: 500 }
    );
  }
}





