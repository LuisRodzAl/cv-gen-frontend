'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
});

export type AuthFormState = {
  errors?: { email?: string[]; password?: string[]; general?: string[] };
} | undefined;

export async function login(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validated = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error || !data.session) {
    return { errors: { general: [error?.message ?? 'Credenciales incorrectas'] } };
  }

  const cookieStore = await cookies();
  cookieStore.set('sb-token', data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: data.session.expires_in,
    path: '/',
  });

  redirect('/dashboard');
}

export async function register(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validated = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    return { errors: { general: [error.message] } };
  }

  redirect('/login?registered=true');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('sb-token');
  redirect('/login');
}

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('sb-token')?.value ?? null;
}
