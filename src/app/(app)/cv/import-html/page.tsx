'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportHtmlCvPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    targetCompany: '',
    targetRole: '',
    htmlContent: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { importHtmlCvAction } = await import('@/app/actions/cv');
      const generatedCv = await importHtmlCvAction(formData);

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
        <h1 className="text-2xl font-bold text-gray-900">Importar CV en HTML</h1>
        <p className="text-gray-500 text-sm mt-1">
          Pega el código HTML de tu CV. La IA extraerá los datos y lo establecerá automáticamente como tu <strong>CV Principal</strong>.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título de tu Rol *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Empresa Destino (Opcional) *</label>
              <input
                type="text"
                name="targetCompany"
                required
                value={formData.targetCompany}
                onChange={handleChange}
                placeholder="Ej. Todas, General..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código HTML del CV *</label>
            <textarea
              name="htmlContent"
              required
              rows={12}
              value={formData.htmlContent}
              onChange={handleChange}
              placeholder="<!DOCTYPE html><html><body><h1>Mi CV...</h1></body></html>"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
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
                  Procesando HTML con IA...
                </>
              ) : (
                'Importar y Guardar como Principal'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
