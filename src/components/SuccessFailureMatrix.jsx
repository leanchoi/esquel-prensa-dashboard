import React, { useState, useMemo } from 'react';
import { 
  Target, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle, 
  ExternalLink, 
  CheckSquare, 
  Search,
  BookOpen,
  Compass
} from 'lucide-react';

export default function SuccessFailureMatrix({ notes, clippings }) {
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      const matchLevel = filterLevel === 'ALL' || 
        (filterLevel === 'ALTA' && n.replicabilityLevel === 'Alta') ||
        (filterLevel === 'MEDIA' && n.replicabilityLevel === 'Media') ||
        (filterLevel === 'BAJA' && n.replicabilityLevel === 'Baja / Sin registro');
      const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.thematicGroup.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLevel && matchSearch;
    });
  }, [notes, filterLevel, searchQuery]);

  // Statistics
  const highCount = notes.filter(n => n.replicabilityLevel === 'Alta').length;
  const medCount = notes.filter(n => n.replicabilityLevel === 'Media').length;
  const lowCount = notes.filter(n => n.replicabilityLevel === 'Baja / Sin registro').length;

  return (
    <div className="space-y-6">
      {/* Header Diagnostic Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Matriz Causal de Replicabilidad: Éxito vs Falla Noticiosa</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Análisis comparativo de los denominadores comunes que convierten una gacetilla en viral vs las que quedan ignoradas
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              {highCount} Éxitos ({Math.round(highCount*100/notes.length)}%)
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              {medCount} Medias ({Math.round(medCount*100/notes.length)}%)
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">
              {lowCount} Bajas ({Math.round(lowCount*100/notes.length)}%)
            </span>
          </div>
        </div>

        {/* 2-Columns Factor Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
          {/* SUCCESS FACTORS */}
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/10 p-4">
            <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm mb-3">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Denominadores Comunes del ÉXITO Noticioso (3 a 56 Medios)</span>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-100 dark:border-emerald-900/40 shadow-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-xs mb-1">
                  1. Factor "Récord / Singularidad Única" (Incentivo al Asombro)
                </span>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  Temas como <em>"La Empanada Más Grande del Mundo - Guinness"</em> (25 menciones) o <em>"Alfajor de Fernet"</em> triunfan porque no son publicidad: son curiosidades atractivas que los editores de medios quieren compartir para traccionar lecturas orgánicas.
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-100 dark:border-emerald-900/40 shadow-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-xs mb-1">
                  2. Astroturismo y Eventos Científicos de Impacto Futuro
                </span>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  El <em>"Eclipse Solar Anular 2027"</em> (56 impactos en medios de todo el país) rompió récords porque combinó interés científico, expectativa a largo plazo y posicionó a Esquel como el epicentro geográfico del fenómeno.
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-100 dark:border-emerald-900/40 shadow-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-xs mb-1">
                  3. Información de Alto Valor de Servicio (Nieve y Vuelos)
                </span>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  <em>"La nieve llegó a La Hoya"</em> y <em>"Vuelo directo Córdoba - Esquel"</em> tienen repercusión garantizada porque resuelven dudas comerciales concretas para el sector hotelero, agencias de viaje y turistas de otras provincias.
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-100 dark:border-emerald-900/40 shadow-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-xs mb-1">
                  4. Aventura en Primera Persona (Notas de Color)
                </span>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  Notas vivenciales como <em>"Túneles de Hielo"</em>, <em>"Kayak en Los Alerces"</em> y <em>"Experiencia Krugger"</em> penetraron con enorme fuerza en medios binacionales de Chile (Diario Binacional) y suplementos especializados de turismo.
                </p>
              </div>
            </div>
          </div>

          {/* FAILURE FACTORS */}
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/10 p-4">
            <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-300 font-extrabold text-sm mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Denominadores Comunes del FRACASO o Baja Replicabilidad</span>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-rose-100 dark:border-rose-900/40 shadow-xs">
                <span className="font-bold text-rose-700 dark:text-rose-400 block text-xs mb-1">
                  1. Gacetillas Burocráticas sin Novedad Pública
                </span>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  Reuniones internas de comisiones, balances administrativos o firmas protocolares sin datos de apertura, precios ni fechas exactas. Los portales las consideran autobombo político y no las reproducen.
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-rose-100 dark:border-rose-900/40 shadow-xs">
                <span className="font-bold text-rose-700 dark:text-rose-400 block text-xs mb-1">
                  2. Promociones en Otras Ciudades sin Ángulo Local
                </span>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  Giras de promoción en Trelew o Madryn redactadas desde la perspectiva del evento en la costa tuvieron casi nula repercusión en Esquel. Deben enfocarse en qué acuerdos o demanda concreta traerán para los prestadores locales.
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-rose-100 dark:border-rose-900/40 shadow-xs">
                <span className="font-bold text-rose-700 dark:text-rose-400 block text-xs mb-1">
                  3. Falta de Material Multimedia (Fotos/Videos)
                </span>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  Medios audiovisuales como <em>Canal 4 Esquel</em> y portales de alto impacto visual necesitan fotos de alta resolución o clips cortos. Una nota sin adjuntos gráficos pierde el 60% de su probabilidad de réplica.
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-rose-100 dark:border-rose-900/40 shadow-xs">
                <span className="font-bold text-rose-700 dark:text-rose-400 block text-xs mb-1">
                  4. Ausencia de Vocero para Entrevistas Radiales
                </span>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  Para emisoras como <em>FM del Lago</em>, el texto no basta. Se requiere adjuntar la disponibilidad del Subsecretario o vocero con teléfono directo para salir al aire en vivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Checklist for Press Writers */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-5 text-white shadow-md">
        <div className="flex items-center space-x-2 mb-2">
          <CheckSquare className="w-5 h-5 text-blue-300" />
          <h3 className="text-sm font-bold">
            Guía de Control de Viralidad: Antes de Emitir una Gacetilla
          </h3>
        </div>
        <p className="text-xs text-blue-200 mb-4">
          Criterios recomendados para el equipo de redacción (Yago Miguens) para garantizar máxima replicabilidad:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
            <span className="font-bold text-amber-300 block mb-1">¿Tiene Gancho Noticioso?</span>
            <p className="text-[11px] text-blue-100">
              ¿Hay un récord, una fecha límite, un número asombroso o una experiencia nueva?
            </p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
            <span className="font-bold text-emerald-300 block mb-1">¿Resuelve una Necesidad?</span>
            <p className="text-[11px] text-blue-100">
              ¿Aclara precios, estado de pistas en La Hoya, horarios de La Trochita o vuelos?
            </p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
            <span className="font-bold text-sky-300 block mb-1">¿Incluye Carpeta de Fotos?</span>
            <p className="text-[11px] text-blue-100">
              ¿Se adjunta enlace a Google Drive con 3 a 5 fotos en horizontal de alta resolución?
            </p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
            <span className="font-bold text-purple-300 block mb-1">¿Vocero para Radios?</span>
            <p className="text-[11px] text-blue-100">
              ¿Se especifica el contacto para coordinar entrevistas al aire con FM del Lago y radios?
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Notes Audit Table */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Inventario Analítico de Notas y Replicabilidad Observada</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explora las 83 notas oficiales con su nivel de impacto y enlaces directos
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar nota o tema..."
                className="pl-8 pr-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-1 text-xs">
              <button
                onClick={() => setFilterLevel('ALL')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  filterLevel === 'ALL'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Todas ({notes.length})
              </button>
              <button
                onClick={() => setFilterLevel('ALTA')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  filterLevel === 'ALTA'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                }`}
              >
                Alta ({highCount})
              </button>
              <button
                onClick={() => setFilterLevel('MEDIA')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  filterLevel === 'MEDIA'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                }`}
              >
                Media ({medCount})
              </button>
              <button
                onClick={() => setFilterLevel('BAJA')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                  filterLevel === 'BAJA'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                }`}
              >
                Baja ({lowCount})
              </button>
            </div>
          </div>
        </div>

        {/* Notes Table */}
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs table-compact">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="font-semibold">Mes</th>
                <th className="font-semibold">Título / Tema Oficial</th>
                <th className="font-semibold">Eje Temático</th>
                <th className="font-semibold">Formato</th>
                <th className="font-semibold text-center">Impactos</th>
                <th className="font-semibold text-center">Nivel</th>
                <th className="font-semibold text-right">Documento / Medios</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredNotes.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="text-slate-500 dark:text-slate-400 whitespace-nowrap text-[11px] font-mono">
                    {n.month}
                  </td>
                  <td className="font-bold text-slate-900 dark:text-white max-w-xs">
                    {n.title}
                  </td>
                  <td className="text-slate-600 dark:text-slate-300">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-medium">
                      {n.thematicGroup}
                    </span>
                  </td>
                  <td className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {n.format}
                  </td>
                  <td className="text-center font-black text-slate-900 dark:text-white text-xs">
                    {n.clippingCount}
                  </td>
                  <td className="text-center whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      n.replicabilityLevel === 'Alta' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                      n.replicabilityLevel === 'Media' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}>
                      {n.replicabilityLevel}
                    </span>
                  </td>
                  <td className="text-right whitespace-nowrap space-x-2">
                    {n.docLink && n.docLink.startsWith('http') && (
                      <a
                        href={n.docLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center space-x-0.5 text-[11px]"
                      >
                        <span>Doc</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    {n.directMediaLink && n.directMediaLink.startsWith('http') && (
                      <a
                        href={n.directMediaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center space-x-0.5 text-[11px]"
                      >
                        <span>Nota Web</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
