import React, { useState, useMemo } from 'react';
import { 
  Newspaper, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Radio, 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  AlertTriangle,
  Info,
  ChevronRight
} from 'lucide-react';

export default function MediaMonitor({ mediaList, clippings, notes }) {
  // Pre-selected favorite local outlets
  const localFeatured = [
    { name: 'EQS Notas', tag: 'Portal Digital Líder', type: 'local' },
    { name: 'Red 43', tag: 'Portal Digital Masivo', type: 'local' },
    { name: 'Diario La Portada', tag: 'Prensa Gráfica y Web', type: 'local' },
    { name: 'Canal 4 Esquel', tag: 'Canal Audiovisual / Web', type: 'local' },
    { name: 'FM del Lago', tag: 'Emisora Radial Cabecera', type: 'radio' },
  ];

  const [selectedMediaName, setSelectedMediaName] = useState('EQS Notas');
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState('ALL');

  // Filtered media list for search
  const filteredMediaList = useMemo(() => {
    return mediaList.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchScope = scopeFilter === 'ALL' || m.category.includes(scopeFilter);
      return matchSearch && matchScope;
    });
  }, [mediaList, searchTerm, scopeFilter]);

  // Selected media object
  const currentMedia = useMemo(() => {
    const found = mediaList.find(m => m.name.toLowerCase() === selectedMediaName.toLowerCase());
    if (found) return found;
    // Fallback for FM del Lago if not found in list
    if (selectedMediaName === 'FM del Lago') {
      return {
        name: 'FM del Lago',
        category: 'Local (Esquel / Cordillera)',
        totalClippings: 1,
        uniqueThemesCount: 1,
        topThemes: [{ theme: 'Semana Santa en Esquel', count: 1 }],
        topMonths: [['Marzo', 1]],
        sampleLinks: [{ theme: 'Esquel se prepara para semana santa', date: '04/04', link: 'https://fmdellagoesquel.com.ar' }]
      };
    }
    return mediaList[0] || null;
  }, [mediaList, selectedMediaName]);

  // Clippings belonging to selected media
  const currentClippings = useMemo(() => {
    if (!currentMedia) return [];
    return clippings.filter(c => c.media.toLowerCase() === currentMedia.name.toLowerCase());
  }, [clippings, currentMedia]);

  // What topics this media ALWAYS replicates vs what stays OUT
  const editorialAnalysis = useMemo(() => {
    if (!currentMedia) return { always: [], missed: [], profile: '' };

    const name = currentMedia.name;
    const mediaThemes = new Set(currentClippings.map(c => c.theme.toLowerCase()));
    
    // Check all general notes to see what was replicated vs what was NOT replicated by this media
    const allNoteThemes = notes.map(n => ({
      title: n.title,
      group: n.thematicGroup,
      clippingCount: n.clippingCount
    }));

    // Local-specific editorial profile
    if (name === 'EQS Notas') {
      return {
        profile: 'Medio digital local de referencia inmediata para la comunidad de Esquel y Parque Nacional Los Alerces. Prioriza cifras oficiales de ocupación hotelera, novedades de temporada alta en La Hoya, eventos gastronómicos identitarios y astroturismo.',
        always: [
          'Ocupación y balances turísticos de temporada (cifras concretas)',
          'Temporada de Esquí y nieve en CAM La Hoya (apertura, pases, condiciones)',
          'Eventos multitudinarios (Fiesta del Hongo, Empanada récord Guinness)',
          'Turismo aventura y Parque Nacional Los Alerces (Kayak, Alerzal)',
          'Eclipse Solar Anular 2027 (seguimiento constante)'
        ],
        missed: [
          'Gacetillas de convenios puramente administrativos sin aplicación práctica inmediata',
          'Promociones externas en costa atlántica sin bajada o impacto en el vecino de Esquel'
        ],
        loyaltyRating: 'Alta Frecuencia (Replica >70% de las gacetillas principales con titular propio)'
      };
    }

    if (name === 'Red 43') {
      return {
        profile: 'Portal de gran volumen y viralidad en redes sociales en la comarca. Muy receptivo a promociones comerciales de impacto al bolsillo, récords llamativos, turismo deportivo y alertas climáticas/nieve.',
        always: [
          'Promociones y beneficios al turista ("3x2 en alojamientos Carnaval")',
          'Turismo deportivo y carreras de montaña (Desafío Capri, Marcha Nórdica)',
          'Récords y gastronomía popular (Empanada más grande del mundo)',
          'Innovación y emprendedores locales ("Esquel Acelera")',
          'Lanzamiento de temporada y presencia en medios nacionales (Esquel en LN+)'
        ],
        missed: [
          'Gacetillas protocolares de comisiones mixtas sin citas directas o polémicas',
          'Notas de color literarias muy extensas sin resumen para redes'
        ],
        loyaltyRating: 'Muy Alta Replicabilidad (Agilidad para publicar el mismo día de emisión)'
      };
    }

    if (name === 'Diario La Portada') {
      return {
        profile: 'Diario tradicional de Esquel con edición web y gráfica. Mantiene un fuerte interés en el desarrollo productivo, la institucionalidad, las sesiones del Ente Mixto y la identidad cordillerana.',
        always: [
          'Desarrollo y programas productivos ("Esquel Lab", "Sistema de Montaña")',
          'Reuniones del Ente Mixto de Turismo y encuentros binacionales',
          'Productos con identidad local (Alfajor de fernet, Chocolaterías)',
          'Encuentros binacionales con Chile y turismo de reuniones (Meet Up)'
        ],
        missed: [
          'Promociones comerciales express que no tienen anclaje institucional',
          'Gacetillas breves sin contexto histórico o declaraciones oficiales'
        ],
        loyaltyRating: 'Alta Relevancia Institucional (Excelente profundidad de cobertura)'
      };
    }

    if (name === 'Canal 4 Esquel') {
      return {
        profile: 'Medio con fuerte eje televisivo y digital. Requiere notas que cuenten con material audiovisual (videos, fotos de alta calidad de nieve o eventos masivos).',
        always: [
          'Grandes eventos y festivales (Choco-Nieve, Semana Santa, Empanada)',
          'Conectividad aérea y vuelos directos Córdoba-Esquel',
          'Temporada invernal y cobertura en vivo de La Hoya',
          'Lanzamiento de programas de montaña'
        ],
        missed: [
          'Gacetillas sin fotografías adjuntas o sin material de video',
          'Notas de color conceptuales sin vocero para entrevistar'
        ],
        loyaltyRating: 'Alta Prioridad Audiovisual (Clave para coberturas con imágenes)'
      };
    }

    if (name === 'FM del Lago') {
      return {
        profile: 'Emisora radial de máxima audiencia en las mañanas de Esquel. Su formato es principalmente auditivo (entrevistas al aire en piso y llamadas en directo).',
        always: [
          'Entrevistas en vivo al Subsecretario de Turismo y voceros del área',
          'Debates sobre políticas turísticas, tarifas de La Hoya y transporte',
          'Eventos de gran repercusión popular (Semana Santa, Feriados largos)'
        ],
        missed: [
          'Gacetillas en texto plano enviadas sin contacto para entrevista telefónica o radial',
          'En las planillas de clipping web suele haber subregistro porque las salidas son radiales al aire y no siempre se suben a portales web.'
        ],
        loyaltyRating: 'Clave en Radiofonía (Requiere registro de audios y no solo links web)'
      };
    }

    // Default for other media
    return {
      profile: `Medio clasificado en: ${currentMedia.category}. Ha publicado un total de ${currentMedia.totalClippings} artículos durante el período analizado.`,
      always: currentMedia.topThemes.map(t => `${t.theme} (${t.count} publicaciones)`),
      missed: ['Notas locales de micro-gestión que no tienen interés para su ámbito territorial.'],
      loyaltyRating: `${currentMedia.totalClippings >= 5 ? 'Replicador Frecuente' : 'Replicador Ocasional / Específico'}`
    };
  }, [currentMedia, currentClippings, notes]);

  return (
    <div className="space-y-6">
      {/* Top Banner with Local Featured Badges */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Monitor Medio por Medio: Cobertura Local y Replicabilidad</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Diagnóstico individual de comportamiento editorial: qué replica cada medio, qué descarta y por qué
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {mediaList.length} medios registrados
          </span>
        </div>

        {/* Local Featured Buttons */}
        <div className="pt-4">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
            Medios Locales de Esquel (Acceso Rápido)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {localFeatured.map((item) => {
              const isSelected = selectedMediaName.toLowerCase() === item.name.toLowerCase();
              return (
                <button
                  key={item.name}
                  onClick={() => setSelectedMediaName(item.name)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{item.name}</span>
                    {item.type === 'radio' ? (
                      <Radio className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-500'}`} />
                    ) : (
                      <Newspaper className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                    )}
                  </div>
                  <span className={`text-[10px] block truncate ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {item.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Explorer / Right Column Media Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Media Directory & Search */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[680px]">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar medio (ej: Chubut, Cadena, Continental)..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Scope Filter Tabs */}
            <div className="flex items-center space-x-1 overflow-x-auto text-[11px] pb-1 no-scrollbar">
              <button
                onClick={() => setScopeFilter('ALL')}
                className={`px-2 py-1 rounded-md whitespace-nowrap font-medium ${
                  scopeFilter === 'ALL'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Todos ({mediaList.length})
              </button>
              <button
                onClick={() => setScopeFilter('Local')}
                className={`px-2 py-1 rounded-md whitespace-nowrap font-medium ${
                  scopeFilter === 'Local'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Locales Esquel
              </button>
              <button
                onClick={() => setScopeFilter('Provincial')}
                className={`px-2 py-1 rounded-md whitespace-nowrap font-medium ${
                  scopeFilter === 'Provincial'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Provinciales
              </button>
              <button
                onClick={() => setScopeFilter('Nacional')}
                className={`px-2 py-1 rounded-md whitespace-nowrap font-medium ${
                  scopeFilter === 'Nacional'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Nacionales
              </button>
            </div>
          </div>

          {/* Media Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 mt-2 pr-1">
            {filteredMediaList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No se encontraron medios con ese filtro.
              </div>
            ) : (
              filteredMediaList.map((m) => {
                const isSelected = selectedMediaName.toLowerCase() === m.name.toLowerCase();
                return (
                  <button
                    key={m.name}
                    onClick={() => setSelectedMediaName(m.name)}
                    className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                        <span>{m.name}</span>
                        {m.name === 'FM del Lago' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Radio
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block max-w-[180px]">
                        {m.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400">
                        {m.totalClippings}
                      </span>
                      <span className="text-[10px] text-slate-400 block">impactos</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: In-Depth Media Dossier */}
        <div className="lg:col-span-2 space-y-5">
          {currentMedia && (
            <>
              {/* Dossier Header */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {currentMedia.name}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {currentMedia.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {editorialAnalysis.profile}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                      <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                        {currentMedia.totalClippings}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Clippings</span>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                    <div className="text-center">
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {currentMedia.uniqueThemesCount}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Temas</span>
                    </div>
                  </div>
                </div>

                {/* FM del Lago Radio Warning Notice */}
                {currentMedia.name === 'FM del Lago' && (
                  <div className="mt-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">Diagnóstico de Cobertura Radial: Subregistro Metodológico</span>
                      <p className="text-[11px] leading-relaxed">
                        En las planillas de clipping web históricas, FM del Lago solo registró 1 enlace porque la recopilación previa se basaba exclusivamente en páginas web. Sin embargo, en la práctica el área de prensa de Esquel realiza continuas entrevistas al aire en sus programas matutinos.
                        <strong className="block mt-1 font-semibold text-amber-950 dark:text-amber-100">
                          Recomendación: En el Panel de Gestión incluimos la opción de registrar "Salidas Radiales / Audios" para cuantificar su impacto real sin perder la trazabilidad.
                        </strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* Editorial Behavior: Always Replicates vs Left Out */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Always Replicates */}
                  <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="flex items-center space-x-1.5 mb-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Qué cosas generalmente SIEMPRE replican:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {editorialAnalysis.always.map((item, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span className="text-[11px] leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Left Out / Rarely Replicates */}
                  <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20">
                    <div className="flex items-center space-x-1.5 mb-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span>Qué cosas suelen quedar por fuera:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {editorialAnalysis.missed.map((item, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-rose-500 font-bold">•</span>
                          <span className="text-[11px] leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Published Clippings Table for this Media */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Registro Histórico de Publicaciones ({currentClippings.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Navegación directa con un clic
                  </span>
                </div>

                <div className="overflow-x-auto mt-3">
                  {currentClippings.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No hay artículos cargados para este medio en la base seleccionada.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs table-compact">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                          <th className="font-semibold">Fecha / Mes</th>
                          <th className="font-semibold">Tema / Titular Registrado</th>
                          <th className="font-semibold text-center">Lugar</th>
                          <th className="font-semibold text-right">Enlace al Medio</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {currentClippings.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono text-[11px]">
                              {c.date || c.month}
                            </td>
                            <td className="font-medium text-slate-800 dark:text-slate-200 max-w-sm">
                              {c.theme}
                            </td>
                            <td className="text-center text-slate-500 dark:text-slate-400 text-[11px]">
                              {c.place || 'Esquel'}
                            </td>
                            <td className="text-right">
                              {c.link && c.link.startsWith('http') ? (
                                <a
                                  href={c.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-[11px]"
                                >
                                  <span>Abrir nota</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-400 text-[10px]">Sin link</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
