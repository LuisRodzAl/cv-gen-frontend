import Link from 'next/link';
import { getToken } from '@/app/actions/auth';
import { apiFetch } from '@/lib/api';

interface CV {
  id: string;
  targetRole: string;
  targetCompany: string;
  templateName: string;
  createdAt: string;
}

interface Profile {
  fullName: string;
}

async function getData(token: string) {
  const [cvs, profile] = await Promise.allSettled([
    apiFetch<CV[]>('/api/cv', {}, token),
    apiFetch<Profile>('/api/profile', {}, token),
  ]);

  return {
    cvs: cvs.status === 'fulfilled' ? cvs.value : [],
    profile: profile.status === 'fulfilled' ? profile.value : null,
  };
}

export default async function DashboardPage() {
  const token = await getToken();
  const { cvs, profile } = await getData(token!);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {profile ? `Hola, ${profile.fullName.split(' ')[0]} 👋` : 'Bienvenido 👋'}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">¿Qué quieres hacer hoy?</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link
          href="/cv/new"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 transition-colors"
        >
          <div className="text-2xl mb-2">✨</div>
          <div className="font-semibold text-sm">Generar nuevo CV</div>
          <div className="text-blue-200 text-xs mt-1">Con IA a partir de una oferta</div>
        </Link>

        <Link
          href="/profile"
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-5 transition-colors"
        >
          <div className="text-2xl mb-2">👤</div>
          <div className="font-semibold text-sm text-gray-800">
            {profile ? 'Editar perfil' : 'Completar perfil'}
          </div>
          <div className="text-gray-400 text-xs mt-1">Experiencia, skills, educación</div>
        </Link>

        <Link
          href="/cv"
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-5 transition-colors"
        >
          <div className="text-2xl mb-2">📄</div>
          <div className="font-semibold text-sm text-gray-800">Ver mis CVs</div>
          <div className="text-gray-400 text-xs mt-1">{cvs.length} CV{cvs.length !== 1 ? 's' : ''} generado{cvs.length !== 1 ? 's' : ''}</div>
        </Link>
      </div>

      {/* Recent CVs */}
      {cvs.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            CVs recientes
          </h2>
          <div className="space-y-2">
            {cvs.slice(0, 3).map((cv) => (
              <Link
                key={cv.id}
                href={`/cv/${cv.id}`}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="font-medium text-sm text-gray-900">{cv.targetRole}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{cv.targetCompany} · {cv.templateName}</div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(cv.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!profile && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          💡 Completa tu perfil para que la IA pueda generar CVs más precisos.{' '}
          <Link href="/profile" className="font-medium underline">Ir al perfil →</Link>
        </div>
      )}
    </div>
  );
}
