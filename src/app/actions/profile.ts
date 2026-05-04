'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api';
import { getToken } from './auth';

export async function saveProfile(formData: FormData) {
  const token = await getToken();
  const body = {
    fullName: formData.get('fullName'),
    title: formData.get('title') || undefined,
    summary: formData.get('summary') || undefined,
    location: formData.get('location') || undefined,
    linkedinUrl: formData.get('linkedinUrl') || undefined,
    githubUrl: formData.get('githubUrl') || undefined,
  };

  try {
    await apiFetch('/api/profile', { method: 'PATCH', body: JSON.stringify(body) }, token!);
  } catch {
    await apiFetch('/api/profile', { method: 'POST', body: JSON.stringify(body) }, token!);
  }

  revalidatePath('/profile');
  revalidatePath('/dashboard');
}

export async function addExperience(formData: FormData) {
  const token = await getToken();
  const body = {
    company: formData.get('company'),
    position: formData.get('position'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate') || undefined,
    description: formData.get('description'),
    technologies: (formData.get('technologies') as string)
      ?.split(',').map((t) => t.trim()).filter(Boolean) ?? [],
  };
  await apiFetch('/api/profile/experience', { method: 'POST', body: JSON.stringify(body) }, token!);
  revalidatePath('/profile');
}

export async function deleteExperience(id: string) {
  const token = await getToken();
  await apiFetch(`/api/profile/experience/${id}`, { method: 'DELETE' }, token!);
  revalidatePath('/profile');
}

export async function addEducation(formData: FormData) {
  const token = await getToken();
  const body = {
    institution: formData.get('institution'),
    degree: formData.get('degree'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate') || undefined,
  };
  await apiFetch('/api/profile/education', { method: 'POST', body: JSON.stringify(body) }, token!);
  revalidatePath('/profile');
}

export async function deleteEducation(id: string) {
  const token = await getToken();
  await apiFetch(`/api/profile/education/${id}`, { method: 'DELETE' }, token!);
  revalidatePath('/profile');
}

export async function addSkill(formData: FormData) {
  const token = await getToken();
  const body = {
    name: formData.get('name'),
    category: formData.get('category') || undefined,
    level: formData.get('level') ? Number(formData.get('level')) : undefined,
  };
  await apiFetch('/api/profile/skill', { method: 'POST', body: JSON.stringify(body) }, token!);
  revalidatePath('/profile');
}

export async function deleteSkill(id: string) {
  const token = await getToken();
  await apiFetch(`/api/profile/skill/${id}`, { method: 'DELETE' }, token!);
  revalidatePath('/profile');
}
