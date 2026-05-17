import Link from 'next/link';
import { getToken } from '@/app/actions/auth';
import { apiFetch } from '@/lib/api';

interface CV {
  id: string;
  targetRole: string;
  targetCompany: string;
  templateName: string;
  isPrimary: boolean;
  createdAt: string;
}

export default async function CvListPage() {
  const token = await getToken();
  let cvs: CV[] = [];
  
  try {
    cvs = await apiFetch<CV[]>('/api/cv', {}, token!);
  } catch (error) {
    console.error('Error fetching CVs', error);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis CVs</h1>
          <p className="text-gray-500 text-sm mt-1">Administra tus currículums generados</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/cv/import-html"
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Importar HTML
          </Link>
          <Link
            href="/cv/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Nuevo CV
          </Link>
        </div>
      </div>

      {cvs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aún no tienes ningún CV</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Genera un CV adaptado específicamente a una oferta de trabajo usando Inteligencia Artificial.
          </p>
          <Link
            href="/cv/new"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Generar mi primer CV
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cvs.map((cv) => (
            <div key={cv.id} className="relative bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-sm transition-all group">
              <div className="absolute top-4 right-4 z-10">
                <form action={async () => {
                  'use server';
                  const { setPrimaryCv } = await import('@/app/actions/cv');
                  await setPrimaryCv(cv.id);
                }}>
                  <button
                    type="submit"
                    title={cv.isPrimary ? "CV Principal" : "Marcar como principal"}
                    className={`text-xl transition-colors ${cv.isPrimary ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-300'}`}
                  >
                    ★
                  </button>
                </form>
              </div>

              <Link href={`/cv/${cv.id}`} className="block w-full h-full">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-2xl">📄</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 pr-8 line-clamp-1">{cv.targetRole}</h3>
                <div className="text-sm text-gray-500 mb-3 line-clamp-1">🏢 {cv.targetCompany}</div>
                <div className="text-xs text-gray-400 mb-2">
                    {new Date(cv.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver detalles →
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
