import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Share2, 
  TrendingUp, 
  Radio, 
  ExternalLink, 
  Calendar,
  Layers, 
  CheckCircle2, 
  BarChart2,
  Globe,
  MapPin,
  Mountain,
  Scale,
  Compass
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';

export default function OverviewDashboard({ notes, clippings, mediaList, onSelectNote, onSelectMedia }) {
  // Segmentation mode: 'all', 'local', 'provincial', 'nacional', 'internacional', 'compare'
  const [segmentMode, setSegmentMode] = useState('all');

  // Helpers to identify media scope
  const isLocalClip = (c) => {
    const m = (c.media || '').toLowerCase();
    return (c.category && c.category.includes('Local')) || 
           m.includes('eqs') || m.includes('red 43') || m.includes('del lago') || 
           m.includes('la portada') || m.includes('canal 4') || m.includes('turismo esquel');
  };

  const isProvincialClip = (c) => {
    return (c.category && c.category.includes('Provincial')) && !isLocalClip(c);
  };

  const isNacionalClip = (c) => {
    return (c.category && c.category.includes('Nacional')) && !isLocalClip(c);
  };

  const isInternacionalClip = (c) => {
    return (c.category && (c.category.includes('Binacional') || c.category.includes('Internacional')));
  };

  // Pre-calculated arena counts
  const arenaTotals = useMemo(() => {
    let local = 0, provincial = 0, nacional = 0, internacional = 0;
    clippings.forEach(c => {
      if (isLocalClip(c)) local++;
      else if (isProvincialClip(c)) provincial++;
      else if (isInternacionalClip(c)) internacional++;
      else nacional++;
    });
    return {
      local,
      provincial,
      nacional,
      internacional,
      otros: provincial + nacional + internacional,
      total: clippings.length
    };
  }, [clippings]);

  // Month aggregations with segmentation data
  const monthlyData = useMemo(() => {
    const months = [
      { name: 'Ene', fullName: 'ENERO', order: 1 },
      { name: 'Feb', fullName: 'FEBRERO', order: 2 },
      { name: 'Mar', fullName: 'MARZO', order: 3 },
      { name: 'Abr', fullName: 'ABRIL', order: 4 },
      { name: 'May', fullName: 'MAYO', order: 5 },
      { name: 'Jun', fullName: 'JUNIO', order: 6 },
      { name: 'Jul', fullName: 'JULIO', order: 7 },
      { name: 'Ago', fullName: 'AGOSTO', order: 8 },
      { name: 'Sep', fullName: 'SEPTIEMBRE', order: 9 },
    ];

    return months.map(m => {
      const notesInMonth = notes.filter(n => (n.month || '').toUpperCase().includes(m.fullName));
      const clippingsInMonth = clippings.filter(c => {
        const cMonth = (c.month || '').toUpperCase();
        return cMonth.includes(m.fullName) || 
               (m.name === 'Ene' && cMonth.includes('ENERO-FEBRERO')) || 
               (m.name === 'Feb' && cMonth.includes('ENERO-FEBRERO'));
      });

      const totalClips = clippingsInMonth.length;
      const localClips = clippingsInMonth.filter(isLocalClip).length;
      const provClips = clippingsInMonth.filter(isProvincialClip).length;
      const nacClips = clippingsInMonth.filter(isNacionalClip).length;
      const intClips = clippingsInMonth.filter(isInternacionalClip).length;
      const otrosClips = totalClips - localClips;

      const nNotes = notesInMonth.length || 1; // avoid division by zero

      return {
        mes: m.name,
        fullName: m.fullName,
        notasEmitidas: notesInMonth.length,
        // Absolute counts
        clippingsTotal: totalClips,
        clippingsLocal: localClips,
        clippingsProvincial: provClips,
        clippingsNacional: nacClips,
        clippingsInternacional: intClips,
        clippingsOtros: otrosClips,
        // Replicability Indices (Multipliers per press release)
        indiceTotal: +(totalClips / nNotes).toFixed(1),
        indiceLocal: +(localClips / nNotes).toFixed(1),
        indiceProvincial: +(provClips / nNotes).toFixed(1),
        indiceNacional: +(nacClips / nNotes).toFixed(1),
        indiceInternacional: +(intClips / nNotes).toFixed(1),
        indiceOtros: +(otrosClips / nNotes).toFixed(1),
      };
    });
  }, [notes, clippings]);

  // Weekly estimation (4 weeks per month)
  const weeklyData = useMemo(() => {
    const weeks = [];
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'];
    monthNames.forEach((m, mIdx) => {
      const monthObj = monthlyData[mIdx];
      const nTotal = monthObj ? monthObj.notasEmitidas : 0;
      const cTotal = monthObj ? monthObj.clippingsTotal : 0;
      for (let w = 1; w <= 4; w++) {
        const nW = Math.round(nTotal / 4);
        const cW = Math.round(cTotal / 4);
        weeks.push({
          semana: `${m} S${w}`,
          notas: nW,
          clippings: cW
        });
      }
    });
    return weeks;
  }, [monthlyData]);

  // Geographic scope distribution
  const geoScopeData = useMemo(() => {
    return [
      { name: 'Local (Esquel / Cordillera)', value: arenaTotals.local },
      { name: 'Provincial (Chubut / Patagonia)', value: arenaTotals.provincial },
      { name: 'Nacional / Especializado', value: arenaTotals.nacional },
      { name: 'Internacional / Binacional (Chile)', value: arenaTotals.internacional },
    ];
  }, [arenaTotals]);

  // Thematic groups distribution
  const thematicData = useMemo(() => {
    const map = {};
    notes.forEach(n => {
      const tg = n.thematicGroup || 'Otros';
      if (!map[tg]) map[tg] = { name: tg, count: 0, clippings: 0 };
      map[tg].count++;
      map[tg].clippings += (n.clippingCount || 0);
    });
    return Object.values(map).sort((a,b) => b.clippings - a.clippings);
  }, [notes]);

  // KPIs
  const totalNotes = notes.length;
  const totalClippings = clippings.length;
  const highReplicability = notes.filter(n => n.replicabilityLevel === 'Alta').length;
  const mediumReplicability = notes.filter(n => n.replicabilityLevel === 'Media').length;
  const avgMultiplier = (totalClippings / (totalNotes || 1)).toFixed(1);

  const PIE_COLORS = ['#0284c7', '#6366f1', '#a855f7', '#14b8a6'];

  // Top viral notes
  const topNotes = useMemo(() => {
    return [...notes].sort((a, b) => (b.clippingCount || 0) - (a.clippingCount || 0)).slice(0, 6);
  }, [notes]);

  // Configuration for current segmentation view
  const segmentConfig = useMemo(() => {
    switch (segmentMode) {
      case 'local':
        return {
          title: 'Segmento: Medios Locales de Esquel',
          subtitle: 'EQS Notas, Red 43, FM del Lago, Diario La Portada, Canal 4 Esquel y Turismo Esquel',
          dataKeyBar: 'clippingsLocal',
          barName: 'Clippings Medios Locales',
          barColor: '#0284c7',
          dataKeyLine: 'indiceLocal',
          lineName: 'Índice Replicabilidad Local',
          lineColor: '#f59e0b'
        };
      case 'provincial':
        return {
          title: 'Segmento: Medios Provinciales (Chubut / Patagonia)',
          subtitle: 'Diario El Chubut, ADN Sur, Cholila Online, Radio 3, Diario Jornada, LU17, Río Negro, etc.',
          dataKeyBar: 'clippingsProvincial',
          barName: 'Clippings Provinciales (Chubut)',
          barColor: '#6366f1',
          dataKeyLine: 'indiceProvincial',
          lineName: 'Índice Replicabilidad Provincial',
          lineColor: '#f59e0b'
        };
      case 'nacional':
        return {
          title: 'Segmento: Medios Nacionales y Especializados',
          subtitle: 'Radio Continental, Meteored, The Post Arg, Destino Córdoba, Cadena 3, Municipios de Argentina',
          dataKeyBar: 'clippingsNacional',
          barName: 'Clippings Nacionales',
          barColor: '#a855f7',
          dataKeyLine: 'indiceNacional',
          lineName: 'Índice Replicabilidad Nacional',
          lineColor: '#f59e0b'
        };
      case 'internacional':
        return {
          title: 'Segmento: Internacional / Binacional (Chile)',
          subtitle: 'Diario Binacional (Chile) y medios de la Patagonia Chilena',
          dataKeyBar: 'clippingsInternacional',
          barName: 'Clippings Binacionales Chile',
          barColor: '#14b8a6',
          dataKeyLine: 'indiceInternacional',
          lineName: 'Índice Replicabilidad Chile',
          lineColor: '#f59e0b'
        };
      case 'compare':
        return {
          title: 'Comparativa de Incidencia: Medios Locales vs Otros Medios',
          subtitle: 'Compara mes a mes el volumen y tasa de réplica en la cordillera frente al resto de la provincia y país',
          barColorLocal: '#0284c7',
          barColorOtros: '#8b5cf6',
          lineColorLocal: '#0284c7',
          lineColorOtros: '#f59e0b'
        };
      default: // 'all'
        return {
          title: 'Consolidado Global: Todos los Medios',
          subtitle: 'Picos de cobertura en Abril (Eclipse 2027) y Septiembre (FIT + Primavera)',
          dataKeyBar: 'clippingsTotal',
          barName: 'Clippings Replicados (Total)',
          barColor: '#10b981',
          dataKeyLine: 'indiceTotal',
          lineName: 'Índice Replicabilidad Total',
          lineColor: '#f59e0b'
        };
    }
  }, [segmentMode]);

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Notas Emitidas</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-lg text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalNotes}</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
              Ene - Sep 2026
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Redacción oficial (Yago Miguens + Epikoy)
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Impactos en Medios</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Share2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalClippings}</span>
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
              {avgMultiplier}x réplica media
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Artículos auditados en planillas de clipping
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tasa Replicabilidad</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {Math.round(((highReplicability + mediumReplicability) / (totalNotes || 1)) * 100)}%
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
              {highReplicability} masivas
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {highReplicability} alta (3+ medios) | {mediumReplicability} media (1-2)
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Red de Difusión</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/60 rounded-lg text-amber-600 dark:text-amber-400">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{mediaList.length}</span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded">
              Medios únicos
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Locales cordilleranos, provinciales y nacionales
          </p>
        </div>
      </div>

      {/* ARENAS TERRITORIALES CARDS (LOCAL VS OTROS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Local */}
        <div 
          onClick={() => setSegmentMode('local')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            segmentMode === 'local'
              ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500 shadow-sm ring-1 ring-sky-500'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Arena Local</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              {Math.round((arenaTotals.local / arenaTotals.total) * 100)}%
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {arenaTotals.local} <span className="text-xs font-normal text-slate-400">impactos</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
            EQS, Red 43, FM Lago, Portada, Canal 4
          </span>
        </div>

        {/* Provincial */}
        <div 
          onClick={() => setSegmentMode('provincial')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            segmentMode === 'provincial'
              ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 shadow-sm ring-1 ring-indigo-500'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center space-x-1">
              <Mountain className="w-3.5 h-3.5" />
              <span>Arena Provincial</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              {Math.round((arenaTotals.provincial / arenaTotals.total) * 100)}%
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {arenaTotals.provincial} <span className="text-xs font-normal text-slate-400">impactos</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
            El Chubut, ADN Sur, Cholila, Radio 3
          </span>
        </div>

        {/* Nacional */}
        <div 
          onClick={() => setSegmentMode('nacional')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            segmentMode === 'nacional'
              ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-500 shadow-sm ring-1 ring-purple-500'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Arena Nacional</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              {Math.round((arenaTotals.nacional / arenaTotals.total) * 100)}%
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {arenaTotals.nacional} <span className="text-xs font-normal text-slate-400">impactos</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
            Continental, Meteored, The Post, Cba
          </span>
        </div>

        {/* Internacional */}
        <div 
          onClick={() => setSegmentMode('internacional')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            segmentMode === 'internacional'
              ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 shadow-sm ring-1 ring-teal-500'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Internacional (Chile)</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              {Math.round((arenaTotals.internacional / arenaTotals.total) * 100)}%
            </span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {arenaTotals.internacional} <span className="text-xs font-normal text-slate-400">impactos</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
            Diario Binacional y medios chilenos
          </span>
        </div>
      </div>

      {/* Main Charts Row: Monthly Production & Clippings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly evolution */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Header of Chart with Segment Selector Buttons */}
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <BarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{segmentConfig.title}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {segmentConfig.subtitle}
                </p>
              </div>

              {/* Axis indicator badges */}
              <div className="flex items-center space-x-1.5 shrink-0">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Eje Izq: Volumen
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Eje Der: Índice Replicabilidad (x)
                </span>
              </div>
            </div>

            {/* SEGMENTATION BUTTONS ROW */}
            <div className="flex items-center space-x-1.5 overflow-x-auto text-xs pb-1 no-scrollbar pt-1">
              <button
                onClick={() => setSegmentMode('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1 border ${
                  segmentMode === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:border-slate-300'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Todos los Medios</span>
              </button>

              <button
                onClick={() => setSegmentMode('local')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1 border ${
                  segmentMode === 'local'
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:border-sky-300'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Medios Locales ({arenaTotals.local})</span>
              </button>

              <button
                onClick={() => setSegmentMode('provincial')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1 border ${
                  segmentMode === 'provincial'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:border-indigo-300'
                }`}
              >
                <Mountain className="w-3.5 h-3.5" />
                <span>Provincial ({arenaTotals.provincial})</span>
              </button>

              <button
                onClick={() => setSegmentMode('nacional')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1 border ${
                  segmentMode === 'nacional'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:border-purple-300'
                }`}
              >
                <span>🇦🇷 Nacional ({arenaTotals.nacional})</span>
              </button>

              <button
                onClick={() => setSegmentMode('internacional')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1 border ${
                  segmentMode === 'internacional'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:border-teal-300'
                }`}
              >
                <span>🇨🇱 Chile ({arenaTotals.internacional})</span>
              </button>

              <button
                onClick={() => setSegmentMode('compare')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1 border ${
                  segmentMode === 'compare'
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Comparativa: Locales vs Otros</span>
              </button>
            </div>
          </div>

          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              {segmentMode === 'compare' ? (
                /* COMPARATIVE VIEW: Local vs Others */
                <ComposedChart data={monthlyData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="mes" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#f59e0b" 
                    fontSize={11} 
                    tickLine={false}
                    tickFormatter={(val) => `${val}x`}
                    domain={[0, 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderColor: '#334155', 
                      borderRadius: '8px', 
                      fontSize: '12px',
                      color: '#f8fafc' 
                    }} 
                    formatter={(value, name) => {
                      if (name.includes('Índice')) return [`${value}x por nota`, name];
                      return [value, name];
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar yAxisId="left" dataKey="clippingsLocal" name="Clippings Locales" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="clippingsOtros" name="Clippings Otros Medios (Chubut/Nac/Chile)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="indiceLocal" 
                    name="Índice Réplica Local" 
                    stroke="#0284c7" 
                    strokeWidth={2.5} 
                    dot={{ r: 3, fill: '#0284c7' }} 
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="indiceOtros" 
                    name="Índice Réplica Otros" 
                    stroke="#f59e0b" 
                    strokeWidth={2.5} 
                    dot={{ r: 3, fill: '#f59e0b' }} 
                  />
                </ComposedChart>
              ) : (
                /* SINGLE SEGMENT VIEW */
                <ComposedChart data={monthlyData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="mes" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#f59e0b" 
                    fontSize={11} 
                    tickLine={false}
                    tickFormatter={(val) => `${val}x`}
                    domain={[0, 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderColor: '#334155', 
                      borderRadius: '8px', 
                      fontSize: '12px',
                      color: '#f8fafc' 
                    }} 
                    formatter={(value, name) => {
                      if (name.includes('Índice')) return [`${value}x por nota`, name];
                      return [value, name];
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar yAxisId="left" dataKey="notasEmitidas" name="Notas Producidas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey={segmentConfig.dataKeyBar} name={segmentConfig.barName} fill={segmentConfig.barColor} radius={[4, 4, 0, 0]} />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey={segmentConfig.dataKeyLine} 
                    name={segmentConfig.lineName} 
                    stroke={segmentConfig.lineColor} 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: segmentConfig.lineColor, strokeWidth: 1, stroke: '#ffffff' }}
                    activeDot={{ r: 6, fill: segmentConfig.lineColor }} 
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Distribution Pie */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Distribución Geográfica de la Cobertura</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proporción de impactos en medios locales vs provinciales vs nacionales
            </p>
          </div>

          <div className="h-56 my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={geoScopeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {geoScopeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#334155', 
                    borderRadius: '8px', 
                    fontSize: '11px',
                    color: '#f8fafc' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            {geoScopeData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                  <span className="text-slate-600 dark:text-slate-300 truncate max-w-[170px]">{item.name}</span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {item.value} ({Math.round((item.value / (totalClippings || 1)) * 100)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cadencia Semanal y Ranking de Temáticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly cadency curve */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Cadencia Semanal: Ritmo de Lanzamiento vs Replicabilidad</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Seguimiento de las ~36 semanas del ciclo analizado (promedio 2.3 gacetillas por semana)
            </p>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="semana" stroke="#94a3b8" fontSize={9} tickLine={false} interval={3} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#334155', 
                    borderRadius: '8px', 
                    fontSize: '12px',
                    color: '#f8fafc' 
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="notas" name="Notas/Semana" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="clippings" name="Impactos/Semana" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Thematic Ranking Table */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Rendimiento por Eje Temático</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Correlación de volumen producido vs impacto efectivo en medios
            </p>
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs table-compact">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="font-semibold">Eje Temático</th>
                  <th className="font-semibold text-center">Gacetillas</th>
                  <th className="font-semibold text-center">Clippings</th>
                  <th className="font-semibold text-right">Efectividad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {thematicData.map((t) => {
                  const ratio = (t.clippings / (t.count || 1)).toFixed(1);
                  return (
                    <tr key={t.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="font-medium text-slate-800 dark:text-slate-200 py-2">
                        {t.name}
                      </td>
                      <td className="text-center text-slate-600 dark:text-slate-400">{t.count}</td>
                      <td className="text-center font-bold text-slate-900 dark:text-white">{t.clippings}</td>
                      <td className="text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          +ratio >= 4 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                          +ratio >= 2 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {ratio}x / nota
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Replicated Press Releases Showcase */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Gacetillas de Máxima Replicabilidad (Casos de Éxito Noticioso)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Notas que superaron ampliamente la media de publicaciones en prensa local, provincial y nacional
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {topNotes.map((n) => (
            <div 
              key={n.id}
              onClick={() => onSelectNote(n)}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {n.thematicGroup}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Share2 className="w-3 h-3" />
                    <span>{n.clippingCount} medios</span>
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mb-1">
                  {n.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Formato: <span className="font-medium text-slate-700 dark:text-slate-300">{n.format}</span> | Mes: {n.month}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                {n.docLink && n.docLink.startsWith('http') ? (
                  <a
                    href={n.docLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 text-[11px]"
                  >
                    <span>Ver Doc Original</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-400 text-[11px]">En carpeta Drive</span>
                )}
                <span className="text-slate-400 text-[10px]">Click para desglose</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
