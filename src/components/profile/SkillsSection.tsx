'use client';

import { useState } from 'react';
import { addSkill, deleteSkill } from '@/app/actions/profile';
import type { Skill } from '@/app/(app)/profile/page';

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Habilidades</h2>
        <button onClick={() => setAdding(!adding)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          {adding ? 'Cancelar' : '+ Agregar'}
        </button>
      </div>

      {adding && (
        <form action={async (fd) => { await addSkill(fd); setAdding(false); }}
          className="border border-gray-200 rounded-lg p-4 mb-4 space-y-3 bg-gray-50">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Habilidad *</label>
              <input name="name" required placeholder="TypeScript" className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Categoría</label>
              <input name="category" placeholder="Lenguajes" className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nivel (1-5)</label>
              <input name="level" type="number" min="1" max="5" placeholder="4" className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700">
            Guardar
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {skills.length === 0 && !adding && (
          <p className="text-sm text-gray-400 py-4 w-full text-center">Sin habilidades registradas aún</p>
        )}
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1">
            <span className="text-sm text-gray-700">{skill.name}</span>
            {skill.level && <span className="text-xs text-gray-400">{'★'.repeat(skill.level)}</span>}
            <form action={deleteSkill.bind(null, skill.id)}>
              <button type="submit" className="text-gray-300 hover:text-red-400 text-base leading-none ml-1">×</button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
