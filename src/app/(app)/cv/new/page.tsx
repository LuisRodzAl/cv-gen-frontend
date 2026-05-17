'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCvPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    targetCompany: '',
    targetRole: '',
    jobDescription: '',
    templateName: 'modern',
    dataSource: 'primary_cv',
    customPrompt: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { generateCvAction } = await import('@/app/actions/cv');
      const generatedCv = await generateCvAction(formData);

      router.push(`/cv/${generatedCv.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block">
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Generar nuevo CV</h1>
        <p className="text-gray-500 text-sm mt-1">
          La Inteligencia Artificial analizará tu perfil y adaptará tu experiencia para esta oferta.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origen de datos</label>
            <select
              name="dataSource"
              value={formData.dataSource}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="primary_cv">Desde mi CV Principal (Recomendado)</option>
              <option value="profile">Desde los datos de mi Perfil</option>
              <option value="prompt">Desde cero (Custom Prompt)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Puesto (Target Role) *</label>
              <input
                type="text"
                name="targetRole"
                required
                value={formData.targetRole}
                onChange={handleChange}
                placeholder="Ej. Frontend Developer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empresa *</label>
              <input
                type="text"
                name="targetCompany"
                required
                value={formData.targetCompany}
                onChange={handleChange}
                placeholder="Ej. Google, Startup..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la oferta *</label>
            <p className="text-xs text-gray-500 mb-2">Pega aquí los requisitos y detalles del trabajo para que la IA sepa qué destacar de tu perfil.</p>
            <textarea
              name="jobDescription"
              required
              rows={6}
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Se busca desarrollador con experiencia en React, TypeScript..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          {formData.dataSource === 'prompt' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contexto o Prompt Personalizado *</label>
              <p className="text-xs text-gray-500 mb-2">Escribe toda tu información, experiencia o indicaciones que debe seguir la IA para crear el CV desde cero.</p>
              <textarea
                name="customPrompt"
                required
                rows={6}
                value={formData.customPrompt}
                onChange={handleChange}
                placeholder="Soy un ingeniero de software con 10 años de experiencia. He trabajado en Google usando Node.js..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plantilla</label>
            <select
              name="templateName"
              value={formData.templateName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="modern">Moderna</option>
              <option value="classic">Clásica</option>
              <option value="creative">Creativa</option>
            </select>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando CV con IA...
                </>
              ) : (
                'Generar CV'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

