'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CvInteractiveViewerProps {
  cv: any;
  token: string;
}

export default function CvInteractiveViewer({ cv, token }: CvInteractiveViewerProps) {
  const router = useRouter();

  // activeJson is the saved state
  const [activeJson, setActiveJson] = useState(cv.cvContentJson);

  // proposedJson is the unsaved, AI-modified state
  const [proposedJson, setProposedJson] = useState<any>(null);

  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);

  // The current content to display
  const displayContent = proposedJson || activeJson;

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setLoading(true);
    const prompt = chatInput;
    setChatInput('');

    try {
      const { chatCvAction } = await import('@/app/actions/cv');
      const newJson = await chatCvAction(cv.id, prompt, displayContent);
      setProposedJson(newJson);
    } catch (error) {
      console.error(error);
      alert('Error de red al comunicarse con la IA.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!proposedJson) return;
    setLoading(true);

    try {
      const { updateCvAction } = await import('@/app/actions/cv');
      await updateCvAction(cv.id, proposedJson);

      setActiveJson(proposedJson);
      setProposedJson(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error al guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    setProposedJson(null);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

      {/* Main CV View */}
      <div className="xl:col-span-3 print:col-span-full space-y-4">
        {proposedJson && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
            <div>
              <div className="font-bold text-yellow-800">Modificaciones sin guardar</div>
              <div className="text-sm text-yellow-700">La IA modificó el CV. Revisa los cambios a continuación. Puedes seguir pidiéndole cambios.</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                disabled={loading}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Rechazar cambios
              </button>
              <button
                onClick={handleAccept}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                {loading ? 'Guardando...' : 'Aceptar y Guardar'}
              </button>
            </div>
          </div>
        )}

        <div className={`bg-white border rounded-xl shadow-sm p-8 font-sans transition-colors print:border-none print:shadow-none print:p-0 print:ring-0 ${proposedJson ? 'border-yellow-300 ring-4 ring-yellow-50' : 'border-gray-200'}`}>
          <div className="mb-8 border-b pb-6 print:border-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">{displayContent.titles?.summary || 'Resumen Profesional'}</h2>
            <p className="text-gray-700 leading-relaxed text-sm">{displayContent.summary}</p>
          </div>

          {displayContent.experiences?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">{displayContent.titles?.experiences || 'Experiencia'}</h3>
              <div className="space-y-6">
                {displayContent.experiences.map((exp: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                      <span className="text-sm text-gray-500">{exp.startDate} - {exp.endDate || 'Presente'}</span>
                    </div>
                    <div className="text-blue-600 font-medium text-sm mb-2">{exp.company}</div>
                    <p className="text-gray-700 text-sm mb-2 whitespace-pre-wrap">{exp.description}</p>
                    {exp.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {exp.technologies.map((tech: string, i: number) => (
                          <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-sm">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {displayContent.educations?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">{displayContent.titles?.educations || 'Educación'}</h3>
              <div className="space-y-4">
                {displayContent.educations.map((edu: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                      <span className="text-sm text-gray-500">{edu.startDate} - {edu.endDate || 'Presente'}</span>
                    </div>
                    <div className="text-gray-600 text-sm">{edu.institution}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Chat Sidebar */}
      <div className="xl:col-span-1 flex flex-col h-full space-y-4 print:hidden">

        {/* Keywords & Skills Mini-View */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">{displayContent.titles?.skills || 'Habilidades'}</h3>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {displayContent.skills?.map((s: any, i: number) => (
              <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 text-xs px-2 py-0.5 rounded-md">{s.name}</span>
            ))}
          </div>

          <h3 className="font-bold text-gray-900 mb-2 text-sm">{displayContent.titles?.keywords || 'Palabras Clave (ATS)'}</h3>
          <div className="flex flex-wrap gap-1.5">
            {displayContent.keywords?.map((kw: string, i: number) => (
              <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md">{kw}</span>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-1 flex flex-col min-h-[400px]">
          <div className="flex items-center gap-2 mb-4 border-b pb-3">
            <span className="text-xl">✨</span>
            <h3 className="font-bold text-gray-900 text-sm">Asistente IA</h3>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 text-sm text-gray-600 space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none">
              ¡Hola! Soy tu asistente de IA. Si quieres hacer algún cambio al CV, pídeme lo que necesites.
              Por ejemplo: <br /><br />
              <span className="italic text-gray-500">"Añade que use AWS en mi experiencia en Google"</span><br />
              <span className="italic text-gray-500">"Haz el resumen más corto y directo"</span>
            </div>
          </div>

          <form onSubmit={handleChatSubmit} className="mt-auto relative">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Escribe un cambio para el CV..."
              disabled={loading}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
            />
            <button
              type="submit"
              disabled={loading || !chatInput.trim()}
              className="absolute right-2 bottom-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
