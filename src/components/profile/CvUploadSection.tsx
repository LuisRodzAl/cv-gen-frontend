'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CvUploadSection({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Por favor sube un archivo PDF.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Using raw fetch here since apiFetch needs the token and we're in a client component.
      // Wait, we can pass token to this component and just use fetch directly.
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/parse`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Error al procesar el CV');
      }

      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Importar datos desde tu CV</h2>
      <p className="text-gray-500 mb-4 text-sm">
        Sube tu CV en formato PDF. Nuestra IA extraerá automáticamente tu información y la guardará en tu perfil.
      </p>

      <div className="flex items-center gap-4">
        <label className={`
          relative flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
          <span>{loading ? 'Procesando CV...' : 'Seleccionar PDF'}</span>
          <input
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>
        
        {success && <span className="text-green-600 text-sm font-medium">¡CV procesado con éxito!</span>}
        {error && <span className="text-red-600 text-sm font-medium">{error}</span>}
      </div>
    </div>
  );
}
