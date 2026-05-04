'use client';

import { useActionState } from 'react';
import { saveProfile } from '@/app/actions/profile';

interface Props {
  profile: { fullName: string; title?: string; summary?: string; location?: string; linkedinUrl?: string; githubUrl?: string } | null;
}

export default function ProfileForm({ profile }: Props) {
  const [, action, pending] = useActionState(async (_: unknown, formData: FormData) => {
    await saveProfile(formData);
  }, null);

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="font-semibold text-gray-900 mb-4">Datos personales</h2>
      <form action={action} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
            <input name="fullName" defaultValue={profile?.fullName ?? ''} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título profesional</label>
            <input name="title" defaultValue={profile?.title ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Senior Backend Engineer" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resumen profesional</label>
          <textarea name="summary" defaultValue={profile?.summary ?? ''} rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Breve descripción de tu perfil profesional..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input name="location" defaultValue={profile?.location ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ciudad, País" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input name="linkedinUrl" defaultValue={profile?.linkedinUrl ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="linkedin.com/in/..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
            <input name="githubUrl" defaultValue={profile?.githubUrl ?? ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="github.com/..." />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={pending}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
            {pending ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </section>
  );
}
