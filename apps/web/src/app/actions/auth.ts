'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// تم إضافة prevState كأول Parameter ليطابق معايير useFormState
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const res = await fetch('http://localhost:4000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || 'Invalid credentials' };
    }

    cookies().set('session_token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    });
  } catch (err) {
    return { error: 'Network error: API Gateway is down' };
  }

  // الـ redirect يجب أن يكون خارج الـ try/catch في Next.js
  redirect('/');
}

export async function logoutAction() {
  cookies().delete('session_token');
  redirect('/login');
}
