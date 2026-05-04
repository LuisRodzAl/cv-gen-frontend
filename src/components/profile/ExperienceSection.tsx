'use client';

import { useState } from 'react';
import { addExperience, deleteExperience } from '@/app/actions/profile';
import type { Experience } from '@/app/(app)/profile/page';

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Experiencia laboral</h2>
        <button onClick={() => setAdding(!adding)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          {adding ? 'Cancelar' : '+ Agregar'}
        </button>
      </div>

      {adding && (
        <form action={async (fd) => { await addExperience(fd); setAdding(false); }}
          className="border border-gray-200 rounded-lg p-4 mb-4 space-y-3 bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Empresa *</label>
              <input name="company" required className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cargo *</label>
              <input name="position" required className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Inicio *</label>
              <input name="startDate" type="date" required className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fin (vacío = actual)</label>
              <input name="endDate" type="date" className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Descripción *</label>
            <textarea name="description" required rows={2} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tecnologías (separadas por coma)</label>
            <input name="technologies" placeholder="React, Node.js, PostgreSQL" className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700">
            Guardar
          </button>
        </form>
      )}

      <div className="space-y-3">
        {experiences.length === 0 && !adding && (
          <p className="text-sm text-gray-400 text-center py-4">Sin experiencias aún</p>
        )}
        {experiences.map((exp) => (
          <div key={exp.id} className="flex items-start justify-between border border-gray-100 rounded-lg p-3">
            <div>
              <div className="font-medium text-sm text-gray-900">{exp.position}</div>
              <div className="text-xs text-gray-500">{exp.company} · {exp.startDate.slice(0, 7)} — {exp.endDate?.slice(0, 7) ?? 'Presente'}</div>
              {exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {exp.technologies.map((t) => (
                    <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              )}
            </div>
            <form action={deleteExperience.bind(null, exp.id)}>
              <button type="submit" className="text-gray-300 hover:text-red-400 text-lg leading-none ml-3">×</button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
