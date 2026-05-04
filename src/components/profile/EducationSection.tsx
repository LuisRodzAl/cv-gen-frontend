'use client';

import { useState } from 'react';
import { addEducation, deleteEducation } from '@/app/actions/profile';
import type { Education } from '@/app/(app)/profile/page';

export default function EducationSection({ educations }: { educations: Education[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Educación</h2>
        <button onClick={() => setAdding(!adding)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          {adding ? 'Cancelar' : '+ Agregar'}
        </button>
      </div>

      {adding && (
        <form action={async (fd) => { await addEducation(fd); setAdding(false); }}
          className="border border-gray-200 rounded-lg p-4 mb-4 space-y-3 bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Institución *</label>
              <input name="institution" required className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Título / Carrera *</label>
              <input name="degree" required className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Inicio *</label>
              <input name="startDate" type="date" required className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fin (vacío = en curso)</label>
              <input name="endDate" type="date" className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700">
            Guardar
          </button>
        </form>
      )}

      <div className="space-y-3">
        {educations.length === 0 && !adding && (
          <p className="text-sm text-gray-400 text-center py-4">Sin educación registrada aún</p>
        )}
        {educations.map((edu) => (
          <div key={edu.id} className="flex items-start justify-between border border-gray-100 rounded-lg p-3">
            <div>
              <div className="font-medium text-sm text-gray-900">{edu.degree}</div>
              <div className="text-xs text-gray-500">{edu.institution} · {edu.startDate.slice(0, 7)} — {edu.endDate?.slice(0, 7) ?? 'En curso'}</div>
            </div>
            <form action={deleteEducation.bind(null, edu.id)}>
              <button type="submit" className="text-gray-300 hover:text-red-400 text-lg leading-none ml-3">×</button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
