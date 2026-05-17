'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api';
import { getToken } from './auth';

export async function setPrimaryCv(id: string) {
  const token = await getToken();
  if (!token) throw new Error('No autorizado');

  await apiFetch(`/api/cv/${id}/primary`, {
    method: 'POST',
  }, token);

  revalidatePath('/cv');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard');
}

export async function generateCvAction(data: any) {
  const token = await getToken();
  if (!token) throw new Error('No autorizado');

  const cv = await apiFetch<any>('/api/cv/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token);

  revalidatePath('/cv');
  revalidatePath('/dashboard');
  return cv;
}

export async function importHtmlCvAction(data: any) {
  const token = await getToken();
  if (!token) throw new Error('No autorizado');

  const cv = await apiFetch<any>('/api/cv/import-html', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token);

  revalidatePath('/cv');
  revalidatePath('/dashboard');
  return cv;
}

export async function chatCvAction(id: string, prompt: string, currentJson: any) {
  const token = await getToken();
  if (!token) throw new Error('No autorizado');

  return apiFetch<any>(`/api/cv/${id}/chat`, {
    method: 'POST',
    body: JSON.stringify({ prompt, currentJson }),
  }, token);
}

export async function updateCvAction(id: string, proposedJson: any) {
  const token = await getToken();
  if (!token) throw new Error('No autorizado');

  const cv = await apiFetch<any>(`/api/cv/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ cvContentJson: proposedJson }),
  }, token);

  revalidatePath(`/cv/${id}`);
  return cv;
}
