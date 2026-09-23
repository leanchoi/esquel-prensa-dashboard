import React from 'react';
import { X, ExternalLink, Share2, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export default function NoteDetailModal({ note, onClose }) {
  if (!note) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-y-auto modal-mobile-safe shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {note.thematicGroup}
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1.5 leading-snug">
              {note.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-3 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Formato Periodístico</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{note.format}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Mes de Registro</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{note.month}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Impactos Auditados</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-1">
                <Share2 className="w-3 h-3" />
                <span>{note.clippingCount} medios</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Replicabilidad</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 text-xs">{note.replicabilityLevel}</span>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 text-xs block">
              Documentos y Enlaces Oficiales:
            </span>
            <div className="flex flex-col space-y-1.5">
              {note.docLink && note.docLink.startsWith('http') ? (
                <a
                  href={note.docLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 hover:underline flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="truncate">Documento en Google Docs / Drive</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              ) : (
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 text-[11px]">
                  {note.docLink || 'Archivo almacenado en la subcarpeta correspondiente de Google Drive'}
                </div>
              )}

              {note.directMediaLink && note.directMediaLink.startsWith('http') && (
                <a
                  href={note.directMediaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 hover:underline flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <span className="truncate">Enlace directo a portal de noticias</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              )}
            </div>
          </div>

          {/* Matched Clippings */}
          <div>
            <span className="font-bold text-slate-700 dark:text-slate-300 text-xs block mb-2">
              Medios que publicaron este tema ({note.matchedClippings.length}):
            </span>
            {note.matchedClippings.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">
                {note.clippingCount > 0 ? 'Publicación registrada en enlace directo de medios.' : 'No se registraron clippings para esta nota.'}
              </p>
            ) : (
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
                {note.matchedClippings.map((m, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{m.media}</span>
                      <span className="text-[10px] text-slate-400">{m.category}</span>
                    </div>
                    {m.link && m.link.startsWith('http') ? (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                      >
                        <span>Nota</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Sin link</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
