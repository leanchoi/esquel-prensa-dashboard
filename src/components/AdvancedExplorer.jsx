import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Calendar, 
  Newspaper, 
  Tag, 
  Globe, 
  ExternalLink, 
  Download, 
  RotateCcw,
  Layers,
  Share2,
  FileText,
  CheckCircle2,
  ListFilter,
  Eye
} from 'lucide-react';

const MONTH_ORDER = {
  'ENERO': 1, 'FEBRERO': 2, 'MARZO': 3, 'ABRIL': 4,
  'MAYO': 5, 'JUNIO': 6, 'JULIO': 7, 'AGOSTO': 8,
  'SEPTIEMBRE': 9, 'OCTUBRE': 10, 'NOVIEMBRE': 11, 'DICIEMBRE': 12
};

export default function AdvancedExplorer({ notes, clippings, mediaList, onSelectNote }) {
  // View Mode: 'notes' (grouped by press release) or 'clippings' (individual media hits)
  const [viewMode, setViewMode] = useState('notes');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedMedia, setSelectedMedia] = useState('ALL');
  const [selectedScope, setSelectedScope] = useState('ALL');
  const [selectedThematic, setSelectedThematic] = useState('ALL');
  const [selectedReplicability, setSelectedReplicability] = useState('ALL');

  // Sorting States
  // For notes view: 'clippings-desc', 'clippings-asc', 'date-desc', 'date-asc', 'title-asc', 'title-desc'
  // For clippings view: 'date-desc', 'date-asc', 'media-asc', 'media-desc', 'theme-asc'
  const [sortBy, setSortBy] = useState('clippings-desc');

  // Quick media buttons
  const quickMedias = [
    { label: 'Todos', value: 'ALL' },
    { label: 'EQS Notas', value: 'EQS Notas' },
    { label: 'Red 43', value: 'Red 43' },
    { label: 'Diario La Portada', value: 'Diario La Portada' },
    { label: 'Canal 4 Esquel', value: 'Canal 4 Esquel' },
    { label: 'FM del Lago', value: 'FM del Lago' },
    { label: 'Diario El Chubut', value: 'Diario El Chubut' },
    { label: 'ADN Sur', value: 'ADN Sur' },
    { label: 'Río Negro', value: 'Diario Río Negro' },
    { label: 'Binacional (Chile)', value: 'Diario Binacional (Chile)' }
  ];

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMonth('ALL');
    setSelectedMedia('ALL');
    setSelectedScope('ALL');
    setSelectedThematic('ALL');
    setSelectedReplicability('ALL');
    setSortBy(viewMode === 'notes' ? 'clippings-desc' : 'date-desc');
  };

  // --- FILTER & SORT FOR NOTES VIEW ---
  const filteredNotes = useMemo(() => {
    let result = notes.filter(n => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        n.title.toLowerCase().includes(q) ||
        n.thematicGroup.toLowerCase().includes(q) ||
        n.format.toLowerCase().includes(q) ||
        n.matchedClippings.some(m => m.media.toLowerCase().includes(q));

      // Month
      const matchMonth = selectedMonth === 'ALL' || (n.month || '').toUpperCase().includes(selectedMonth);

      // Media
      const matchMedia = selectedMedia === 'ALL' || 
        n.matchedClippings.some(m => m.media.toLowerCase() === selectedMedia.toLowerCase()) ||
        (n.directMedia && n.directMedia.toLowerCase() === selectedMedia.toLowerCase());

      // Scope
      const matchScope = selectedScope === 'ALL' ||
        n.matchedClippings.some(m => m.category.includes(selectedScope));

      // Thematic Group
      const matchThematic = selectedThematic === 'ALL' || n.thematicGroup === selectedThematic;

      // Replicability level
      const matchRep = selectedReplicability === 'ALL' ||
        (selectedReplicability === 'ALTA' && n.replicabilityLevel === 'Alta') ||
        (selectedReplicability === 'MEDIA' && n.replicabilityLevel === 'Media') ||
        (selectedReplicability === 'BAJA' && n.replicabilityLevel === 'Baja / Sin registro');

      return matchSearch && matchMonth && matchMedia && matchScope && matchThematic && matchRep;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'clippings-desc') return (b.clippingCount || 0) - (a.clippingCount || 0);
      if (sortBy === 'clippings-asc') return (a.clippingCount || 0) - (b.clippingCount || 0);
      if (sortBy === 'date-desc') {
        const oA = MONTH_ORDER[a.month?.toUpperCase()] || 0;
        const oB = MONTH_ORDER[b.month?.toUpperCase()] || 0;
        return oB - oA;
      }
      if (sortBy === 'date-asc') {
        const oA = MONTH_ORDER[a.month?.toUpperCase()] || 0;
        const oB = MONTH_ORDER[b.month?.toUpperCase()] || 0;
        return oA - oB;
      }
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
      return 0;
    });

    return result;
  }, [notes, searchQuery, selectedMonth, selectedMedia, selectedScope, selectedThematic, selectedReplicability, sortBy]);

  // --- FILTER & SORT FOR CLIPPINGS VIEW ---
  const filteredClippings = useMemo(() => {
    let result = clippings.filter(c => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        c.theme.toLowerCase().includes(q) ||
        c.media.toLowerCase().includes(q) ||
        c.place.toLowerCase().includes(q);

      // Month
      const matchMonth = selectedMonth === 'ALL' || (c.month || '').toUpperCase().includes(selectedMonth);

      // Media
      const matchMedia = selectedMedia === 'ALL' || c.media.toLowerCase() === selectedMedia.toLowerCase();

      // Scope
      const matchScope = selectedScope === 'ALL' || c.category.includes(selectedScope);

      return matchSearch && matchMonth && matchMedia && matchScope;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') return (b.monthOrder || 0) - (a.monthOrder || 0);
      if (sortBy === 'date-asc') return (a.monthOrder || 0) - (b.monthOrder || 0);
      if (sortBy === 'media-asc') return a.media.localeCompare(b.media);
      if (sortBy === 'media-desc') return b.media.localeCompare(a.media);
      if (sortBy === 'theme-asc') return a.theme.localeCompare(b.theme);
      return 0;
    });

    return result;
  }, [clippings, searchQuery, selectedMonth, selectedMedia, selectedScope, sortBy]);

  // Export current filtered view
  const handleExportFiltered = () => {
    let csv = '';
    if (viewMode === 'notes') {
      csv = 'Titulo,Mes,Formato,EjeTematico,ImpactosReplicados,MediosPublicadores,LinkDrive\n';
      filteredNotes.forEach(n => {
        const mediaNames = n.matchedClippings.map(m => m.media).join('; ');
        csv += `"${n.title.replace(/"/g, '""')}","${n.month}","${n.format}","${n.thematicGroup}",${n.clippingCount},"${mediaNames}","${n.docLink}"\n`;
      });
    } else {
      csv = 'Fecha,Medio,TitularTema,Alcance,Lugar,Link\n';
      filteredClippings.forEach(c => {
        csv += `"${c.date || c.month}","${c.media.replace(/"/g, '""')}","${c.theme.replace(/"/g, '""')}","${c.category}","${c.place}","${c.link}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yagoneitor_filtrado_${viewMode}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Toggle header sort helper
  const handleToggleSort = (keyAsc, keyDesc) => {
    if (sortBy === keyDesc) {
      setSortBy(keyAsc);
    } else {
      setSortBy(keyDesc);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and View Mode Switch */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ListFilter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Explorador Multifiltro y Ordenamiento Avanzado</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Filtra, busca y ordena en tiempo real por medios, fechas, más publicadas, ejes temáticos y alcance
            </p>
          </div>

          {/* Switcher: Por Notas vs Por Clippings */}
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => { setViewMode('notes'); setSortBy('clippings-desc'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'notes'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Por Gacetillas ({filteredNotes.length})</span>
            </button>
            <button
              onClick={() => { setViewMode('clippings'); setSortBy('date-desc'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'clippings'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Por Publicaciones ({filteredClippings.length})</span>
            </button>
          </div>
        </div>

        {/* Quick Media Filter Chips */}
        <div className="pt-3 pb-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Filtro Rápido por Medio de Comunicación:
          </label>
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs no-scrollbar pb-1">
            {quickMedias.map((m) => (
              <button
                key={m.label}
                onClick={() => setSelectedMedia(m.value)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors border ${
                  selectedMedia.toLowerCase() === m.value.toLowerCase()
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* FILTERS TOOLBAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Text Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar título, tema o palabra clave..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Month Range / Filter */}
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-xs"
            >
              <option value="ALL">Mes: Todos (Ene a Sep)</option>
              {['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Scope Filter */}
          <div>
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-xs"
            >
              <option value="ALL">Alcance: Todos</option>
              <option value="Local">Local (Esquel / Cordillera)</option>
              <option value="Provincial">Provincial (Chubut)</option>
              <option value="Nacional">Nacional / Especializado</option>
              <option value="Binacional">Binacional (Chile)</option>
            </select>
          </div>

          {/* Thematic Group (for Notes view) */}
          {viewMode === 'notes' ? (
            <div>
              <select
                value={selectedThematic}
                onChange={(e) => setSelectedThematic(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-xs"
              >
                <option value="ALL">Eje: Todos los temas</option>
                <option value="Astroturismo & Eclipse">Astroturismo & Eclipse</option>
                <option value="Gastronomía & Récords">Gastronomía & Récords</option>
                <option value="Temporada La Hoya & Nieve">La Hoya & Nieve</option>
                <option value="Conectividad Aérea">Conectividad Aérea</option>
                <option value="Naturaleza & Aventura">Naturaleza & Aventura</option>
                <option value="Turismo Deportivo">Turismo Deportivo</option>
                <option value="Fiestas & Tradición">Fiestas & Tradición</option>
                <option value="Institucional y Gestión">Institucional</option>
              </select>
            </div>
          ) : (
            <div>
              <select
                value={selectedMedia}
                onChange={(e) => setSelectedMedia(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none text-xs"
              >
                <option value="ALL">Medio: Todos (150)</option>
                {mediaList.slice(0, 40).map(m => (
                  <option key={m.name} value={m.name}>{m.name} ({m.totalClippings})</option>
                ))}
              </select>
            </div>
          )}

          {/* Sort By Selector */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold focus:outline-none text-xs"
            >
              {viewMode === 'notes' ? (
                <>
                  <option value="clippings-desc">🔥 Más Publicadas (Mayor Impacto)</option>
                  <option value="clippings-asc">❄️ Menos Publicadas (Menor Impacto)</option>
                  <option value="date-desc">📅 Más Recientes Primero</option>
                  <option value="date-asc">📅 Más Antiguas Primero</option>
                  <option value="title-asc">🔤 Título (A - Z)</option>
                  <option value="title-desc">🔤 Título (Z - A)</option>
                </>
              ) : (
                <>
                  <option value="date-desc">📅 Fecha (Más Recientes)</option>
                  <option value="date-asc">📅 Fecha (Más Antiguas)</option>
                  <option value="media-asc">📰 Medio (A - Z)</option>
                  <option value="media-desc">📰 Medio (Z - A)</option>
                  <option value="theme-asc">🔤 Tema (A - Z)</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Results summary & Reset Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {viewMode === 'notes' ? (
                <>Mostrando <strong className="text-blue-600 dark:text-blue-400">{filteredNotes.length}</strong> de {notes.length} gacetillas</>
              ) : (
                <>Mostrando <strong className="text-emerald-600 dark:text-emerald-400">{filteredClippings.length}</strong> de {clippings.length} publicaciones</>
              )}
            </span>
            {(searchQuery || selectedMonth !== 'ALL' || selectedMedia !== 'ALL' || selectedScope !== 'ALL' || selectedThematic !== 'ALL' || selectedReplicability !== 'ALL') && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                Filtros activos
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetFilters}
              className="px-2.5 py-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs flex items-center space-x-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar filtros</span>
            </button>

            <button
              onClick={handleExportFiltered}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar CSV filtrado</span>
            </button>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {viewMode === 'notes' ? (
          /* ================= NOTES LIST ================= */
          filteredNotes.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No se encontraron gacetillas con los filtros seleccionados. Prueba limpiar los filtros.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-compact">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 select-none">
                  <tr>
                    <th 
                      onClick={() => handleToggleSort('date-asc', 'date-desc')}
                      className="cursor-pointer hover:text-blue-600 font-semibold whitespace-nowrap"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Mes</span>
                        <ArrowUpDown className="w-3 h-3 opacity-60" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleToggleSort('title-asc', 'title-desc')}
                      className="cursor-pointer hover:text-blue-600 font-semibold"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Título / Gacetilla Oficial</span>
                        <ArrowUpDown className="w-3 h-3 opacity-60" />
                      </div>
                    </th>
                    <th className="font-semibold">Eje Temático</th>
                    <th className="font-semibold">Formato</th>
                    <th 
                      onClick={() => handleToggleSort('clippings-asc', 'clippings-desc')}
                      className="cursor-pointer hover:text-blue-600 font-semibold text-center whitespace-nowrap"
                    >
                      <div className="flex items-center justify-center space-x-1 text-blue-600 dark:text-blue-400">
                        <span>Impactos</span>
                        {sortBy === 'clippings-desc' ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                      </div>
                    </th>
                    <th className="font-semibold">Medios que Publicaron</th>
                    <th className="font-semibold text-right whitespace-nowrap">Enlaces</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredNotes.map((n) => (
                    <tr 
                      key={n.id} 
                      onClick={() => onSelectNote(n)}
                      className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer"
                    >
                      <td className="text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap font-medium">
                        {n.month}
                      </td>
                      <td className="font-bold text-slate-900 dark:text-white max-w-sm">
                        <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {n.title}
                        </span>
                      </td>
                      <td className="whitespace-nowrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium">
                          {n.thematicGroup}
                        </span>
                      </td>
                      <td className="text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                        {n.format}
                      </td>
                      <td className="text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-black text-xs ${
                          n.clippingCount >= 10 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          n.clippingCount >= 3 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          n.clippingCount >= 1 ? 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' :
                          'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {n.clippingCount} medios
                        </span>
                      </td>
                      <td className="max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {n.matchedClippings.slice(0, 3).map((m, i) => (
                            <span 
                              key={i} 
                              className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 truncate max-w-[110px]"
                              title={m.media}
                            >
                              {m.media}
                            </span>
                          ))}
                          {n.matchedClippings.length > 3 && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold">
                              +{n.matchedClippings.length - 3} más
                            </span>
                          )}
                          {n.matchedClippings.length === 0 && (
                            <span className="text-[10px] text-slate-400 italic">
                              {n.directMedia ? n.directMedia : 'Sin réplica'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-right whitespace-nowrap space-x-2">
                        {n.docLink && n.docLink.startsWith('http') && (
                          <a
                            href={n.docLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center space-x-0.5 text-[11px]"
                            title="Abrir Google Docs en Drive"
                          >
                            <span>Drive</span>
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
                            title="Abrir nota original en portal"
                          >
                            <span>Medio</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* ================= CLIPPINGS LIST ================= */
          filteredClippings.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No se encontraron publicaciones con los filtros seleccionados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-compact">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 select-none">
                  <tr>
                    <th 
                      onClick={() => handleToggleSort('date-asc', 'date-desc')}
                      className="cursor-pointer hover:text-blue-600 font-semibold whitespace-nowrap"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Fecha</span>
                        <ArrowUpDown className="w-3 h-3 opacity-60" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleToggleSort('media-asc', 'media-desc')}
                      className="cursor-pointer hover:text-blue-600 font-semibold"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Medio de Comunicación</span>
                        <ArrowUpDown className="w-3 h-3 opacity-60" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleToggleSort('theme-asc', 'theme-asc')}
                      className="cursor-pointer hover:text-blue-600 font-semibold"
                    >
                      <span>Titular / Tema Replicado</span>
                    </th>
                    <th className="font-semibold">Alcance Territorial</th>
                    <th className="font-semibold text-center">Lugar</th>
                    <th className="font-semibold text-right whitespace-nowrap">Enlace a la Publicación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredClippings.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap font-medium">
                        {c.date || c.month}
                      </td>
                      <td className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Newspaper className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{c.media}</span>
                        </div>
                      </td>
                      <td className="text-slate-800 dark:text-slate-200 font-medium max-w-md">
                        {c.theme}
                      </td>
                      <td className="whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          c.category.includes('Local') ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          c.category.includes('Provincial') ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                          c.category.includes('Binacional') ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        }`}>
                          {c.category}
                        </span>
                      </td>
                      <td className="text-center text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                        {c.place || 'Esquel'}
                      </td>
                      <td className="text-right whitespace-nowrap">
                        {c.link && c.link.startsWith('http') ? (
                          <a
                            href={c.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center space-x-1 text-[11px] font-semibold"
                          >
                            <span>Abrir Nota</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Sin enlace web</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
