import React from 'react';
import { X, CheckCircle, Database, ShieldAlert, Sparkles, Sliders } from 'lucide-react';

export default function MethodologyAuditModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90dvh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed & safe from notch */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/98 dark:bg-slate-900/98 backdrop-blur z-10 shrink-0">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Criterios de Depuración y Agregación Metodológica
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed overflow-y-auto flex-1 overscroll-contain">
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-950 dark:text-blue-200">
            <span className="font-bold block mb-1">Objetivo de Auditoría Pública y Administrativa</span>
            <p className="text-[11px]">
              Este documento explica con transparencia las reglas aplicadas para normalizar los datos de las carpetas de Google Drive, hojas de cálculo de clippings mensuales y registros de redacción oficial.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1.5 flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>1. Normalización y Desduplicación de Nombres de Medios</span>
            </h4>
            <p className="text-[11px] mb-2">
              En las planillas de clipping originales coexistían variantes tipográficas y mayúsculas/minúsculas de un mismo medio. Se unificaron bajo criterios canónicos:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
              <li><strong>Red 43</strong>: Agrupa <code>"Red 43"</code>, <code>"REd 43"</code> y <code>"Red43"</code>.</li>
              <li><strong>EQS Notas</strong>: Agrupa <code>"EQS Notas"</code>, <code>"Eqs Notas"</code> y <code>"eqsnotas"</code>.</li>
              <li><strong>Canal 4 Esquel</strong>: Agrupa <code>"Canal 4"</code> y <code>"Canal 4 Esquel"</code>.</li>
              <li><strong>Diario El Chubut</strong>: Agrupa <code>"El Chubut"</code> y <code>"Chubut"</code>.</li>
              <li><strong>Radio 3</strong>: Agrupa <code>"Radio 3"</code>, <code>"Radio 3 Cadena Patagonia"</code> y <code>"Radio 3 Cadena Patagónica"</code>.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1.5 flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              <span>2. Algoritmo de Correlación: Gacetilla vs Impactos de Clipping</span>
            </h4>
            <p className="text-[11px]">
              Se relacionó cada una de las 83 notas emitidas con las 371 filas de clippings mensuales mediante concordancia semántica de palabras clave específicas (descartando conectores neutros como <em>"Esquel"</em>, <em>"Chubut"</em>, <em>"para"</em>) y corroboración cruzada de fechas de publicación del mismo mes.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1.5 flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-amber-600" />
              <span>3. Tratamiento de FM del Lago y Emisoras Radiales</span>
            </h4>
            <p className="text-[11px]">
              Se identificó que el clipping histórico de la Subsecretaría recolectaba exclusivamente URLs de noticias web. Debido a ello, <strong>FM del Lago</strong> registraba una única mención escrita, omitiendo las decenas de salidas y entrevistas radiales en vivo. Para subsanar esta distorsión, el sistema ahora incluye la categoría <em>"Salida Radial / Audio al Aire"</em>.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1.5 flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              <span>4. Clasificación de Alcance Territorial</span>
            </h4>
            <p className="text-[11px]">
              Los 150 medios se categorizaron en 4 niveles geográficos para permitir una evaluación real de penetración:
              <strong> Local (Esquel y Cordillera)</strong>, <strong>Provincial (Chubut y Patagonia)</strong>, <strong>Nacional / Especializado</strong> e <strong>Internacional / Binacional (Chile)</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Entendido y Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
