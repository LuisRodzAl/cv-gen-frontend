import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToken } from '@/app/actions/auth';
import { apiFetch } from '@/lib/api';
import CvInteractiveViewer from '@/components/cv/CvInteractiveViewer';
import PrintCvButton from '@/components/cv/PrintCvButton';

interface CV {
  id: string;
  targetRole: string;
  targetCompany: string;
  jobDescription: string;
  templateName: string;
  createdAt: string;
  cvContentJson: {
    summary: string;
    experiences: any[];
    educations: any[];
    skills: any[];
    certificates: any[];
    keywords: string[];
  };
}

export default async function CvViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const token = await getToken();
  let cv: CV | null = null;

  try {
    cv = await apiFetch<CV>(`/api/cv/${resolvedParams.id}`, {}, token!);
  } catch (error) {
    console.error('Error fetching CV', error);
  }

  if (!cv) {
    notFound();
  }

  const { cvContentJson: content } = cv;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <Link href="/cv" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">
            ← Volver a mis CVs
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            CV: {cv.targetRole} en {cv.targetCompany}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Generado el {new Date(cv.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <PrintCvButton />
        </div>
      </div>

      <CvInteractiveViewer cv={cv} token={token!} />
    </div>
  );
}
