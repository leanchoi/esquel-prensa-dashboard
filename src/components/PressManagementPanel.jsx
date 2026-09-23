import React, { useState } from 'react';
import { 
  PlusCircle, 
  FileText, 
  Share2, 
  Save, 
  Download, 
  Upload, 
  Trash2, 
  Search, 
  ExternalLink,
  CheckCircle2,
  Radio,
  Globe,
  Tag
} from 'lucide-react';

export default function PressManagementPanel({ 
  notes, 
  clippings, 
  onAddNote, 
  onAddClipping, 
  onDeleteNote,
  onDeleteClipping,
  onExportCSV 
}) {
  const [activeSubTab, setActiveSubTab] = useState('notes'); // 'notes' or 'clippings'

  // New Note Form State
  const [noteForm, setNoteForm] = useState({
    title: '',
    format: 'NOTICIA',
    month: 'SEPTIEMBRE',
    thematicGroup: 'Institucional y Gestión',
    docLink: '',
    directMediaLink: ''
  });

  // New Clipping Form State
  const [clippingForm, setClippingForm] = useState({
    theme: '',
    media: 'EQS Notas',
    date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }),
    category: 'Local (Esquel / Cordillera)',
    coverageType: 'Portal Web', // 'Portal Web', 'Radio / Audio', 'TV / Video', 'Gráfica'
    place: 'Esquel',
    link: ''
  });

  const [notification, setNotification] = useState(null);
  const [searchTable, setSearchTable] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateNote = (e) => {
    e.preventDefault();
    if (!noteForm.title.trim()) return;

    const newNote = {
      id: `nota-${Date.now()}`,
      title: noteForm.title.trim(),
      format: noteForm.format,
      month: noteForm.month,
      thematicGroup: noteForm.thematicGroup,
      docLink: noteForm.docLink.trim(),
      directMediaLink: noteForm.directMediaLink.trim(),
      clippingCount: noteForm.directMediaLink ? 1 : 0,
      replicabilityLevel: noteForm.directMediaLink ? 'Media' : 'Baja / Sin registro',
      matchedClippings: []
    };

    onAddNote(newNote);
    setNoteForm({
      title: '',
      format: 'NOTICIA',
      month: 'SEPTIEMBRE',
      thematicGroup: 'Institucional y Gestión',
      docLink: '',
      directMediaLink: ''
    });
    showNotification('¡Gacetilla registrada exitosamente en el sistema!');
  };

  const handleCreateClipping = (e) => {
    e.preventDefault();
    if (!clippingForm.theme.trim() || !clippingForm.media.trim()) return;

    const newClip = {
      id: `clip-${Date.now()}`,
      month: 'Septiembre',
      rawMedia: clippingForm.media,
      media: clippingForm.media.trim(),
      category: clippingForm.category,
      coverageType: clippingForm.coverageType,
      theme: clippingForm.theme.trim(),
      place: clippingForm.place.trim() || 'Esquel',
      link: clippingForm.link.trim(),
      date: clippingForm.date.trim()
    };

    onAddClipping(newClip);
    setClippingForm({
      theme: '',
      media: clippingForm.media,
      date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }),
      category: clippingForm.category,
      coverageType: 'Portal Web',
      place: 'Esquel',
      link: ''
    });
    showNotification('¡Impacto de clipping registrado y correlacionado con éxito!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Panel de Carga y Gestión Operativa de Prensa</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Espacio para que el redactor (Yago Miguens / equipo) alimente continuamente notas y clippings
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveSubTab('notes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'notes'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Gestionar Gacetillas ({notes.length})
            </button>
            <button
              onClick={() => setActiveSubTab('clippings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'clippings'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Gestionar Clippings ({clippings.length})
            </button>
          </div>
        </div>

        {/* FORMS SECTION */}
        <div className="pt-4">
          {activeSubTab === 'notes' ? (
            /* Note creation form */
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div className="flex items-center space-x-2 mb-2 text-xs font-bold text-blue-700 dark:text-blue-400">
                <FileText className="w-4 h-4" />
                <span>Registrar Nueva Gacetilla o Nota Escrita</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Título o Tema de la Nota *
                  </label>
                  <input
                    type="text"
                    required
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                    placeholder="Ej: LANZAMIENTO DE LA TEMPORADA DE TULIPANES 2026..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Format */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Formato Periodístico
                  </label>
                  <select
                    value={noteForm.format}
                    onChange={(e) => setNoteForm({ ...noteForm, format: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="NOTICIA">NOTICIA (Informativa dura)</option>
                    <option value="NOTA DE COLOR">NOTA DE COLOR (Vivencial/Turismo)</option>
                    <option value="NOTICIA - EVENTO">NOTICIA - EVENTO</option>
                    <option value="NOTICIA - NIEVE">NOTICIA - NIEVE / LA HOYA</option>
                    <option value="NOTICIA - GASTRONOMÍA">NOTICIA - GASTRONOMÍA</option>
                    <option value="CRÓNICA">CRÓNICA DEPORTIVA / TURÍSTICA</option>
                  </select>
                </div>

                {/* Thematic Group */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Eje Temático
                  </label>
                  <select
                    value={noteForm.thematicGroup}
                    onChange={(e) => setNoteForm({ ...noteForm, thematicGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Astroturismo & Eclipse">Astroturismo & Eclipse</option>
                    <option value="Gastronomía & Récords">Gastronomía & Récords</option>
                    <option value="Temporada La Hoya & Nieve">Temporada La Hoya & Nieve</option>
                    <option value="Conectividad Aérea">Conectividad Aérea</option>
                    <option value="Naturaleza & Aventura">Naturaleza & Aventura</option>
                    <option value="Turismo Deportivo">Turismo Deportivo</option>
                    <option value="Fiestas & Tradición">Fiestas & Tradición</option>
                    <option value="Institucional y Gestión">Institucional y Gestión</option>
                  </select>
                </div>

                {/* Month */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Mes de Emisión
                  </label>
                  <select
                    value={noteForm.month}
                    onChange={(e) => setNoteForm({ ...noteForm, month: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    {['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Doc Link in Drive */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Link a Google Docs / Drive (Opcional)
                  </label>
                  <input
                    type="url"
                    value={noteForm.docLink}
                    onChange={(e) => setNoteForm({ ...noteForm, docLink: e.target.value })}
                    placeholder="https://docs.google.com/document/d/..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                {/* Direct Media Link */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Link de Primicia o Publicación Directa (Opcional)
                  </label>
                  <input
                    type="url"
                    value={noteForm.directMediaLink}
                    onChange={(e) => setNoteForm({ ...noteForm, directMediaLink: e.target.value })}
                    placeholder="https://www.eqsnotas.com/... o https://red43.com.ar/..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Nota en Base de Datos</span>
                </button>
              </div>
            </form>
          ) : (
            /* Clipping creation form */
            <form onSubmit={handleCreateClipping} className="space-y-4">
              <div className="flex items-center space-x-2 mb-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <Share2 className="w-4 h-4" />
                <span>Registrar Nuevo Impacto de Clipping</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* Associated Note/Theme */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Tema o Nota Asociada *
                  </label>
                  <input
                    type="text"
                    required
                    value={clippingForm.theme}
                    onChange={(e) => setClippingForm({ ...clippingForm, theme: e.target.value })}
                    placeholder="Ej: Eclipse solar anular 2027 o Nieve en La Hoya..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                {/* Media */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Medio de Comunicación *
                  </label>
                  <input
                    type="text"
                    required
                    value={clippingForm.media}
                    onChange={(e) => setClippingForm({ ...clippingForm, media: e.target.value })}
                    placeholder="EQS Notas, Red 43, FM del Lago, Diario El Chubut..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                {/* Publication Date */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Fecha de Publicación (DD/MM)
                  </label>
                  <input
                    type="text"
                    value={clippingForm.date}
                    onChange={(e) => setClippingForm({ ...clippingForm, date: e.target.value })}
                    placeholder="23/09"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                {/* Scope */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Alcance Territorial
                  </label>
                  <select
                    value={clippingForm.category}
                    onChange={(e) => setClippingForm({ ...clippingForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Local (Esquel / Cordillera)">Local (Esquel / Cordillera)</option>
                    <option value="Provincial (Chubut / Patagonia)">Provincial (Chubut / Patagonia)</option>
                    <option value="Nacional / Especializado">Nacional / Especializado</option>
                    <option value="Internacional / Binacional">Internacional / Binacional (Chile)</option>
                  </select>
                </div>

                {/* Coverage Type (Web vs Radio vs TV vs Graphic) */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Formato de Cobertura
                  </label>
                  <select
                    value={clippingForm.coverageType}
                    onChange={(e) => setClippingForm({ ...clippingForm, coverageType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Portal Web">Portal Web / Digital</option>
                    <option value="Radio / Audio">Salida Radial / Audio al Aire (FM del Lago, etc.)</option>
                    <option value="TV / Video">Televisión / Cobertura Audiovisual</option>
                    <option value="Prensa Gráfica">Prensa Gráfica / Diario Impreso</option>
                  </select>
                </div>

                {/* Link or Audio URL */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Enlace de la Nota o Grabación (URL)
                  </label>
                  <input
                    type="url"
                    value={clippingForm.link}
                    onChange={(e) => setClippingForm({ ...clippingForm, link: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Registrar Impacto de Clipping</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* INVENTORY AND AUDIT TABLE */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Inventario de {activeSubTab === 'notes' ? 'Gacetillas Registradas' : 'Clippings Registrados'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Datos 100% reales sincronizados con la carpeta Drive oficial
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                placeholder="Filtrar en tabla..."
                className="pl-8 pr-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <button
              onClick={() => onExportCSV(activeSubTab)}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
            >
              <Download className="w-3 h-3 text-slate-500" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto mt-3">
          {activeSubTab === 'notes' ? (
            <table className="w-full text-left text-xs table-compact">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="font-semibold">Mes</th>
                  <th className="font-semibold">Título / Gacetilla</th>
                  <th className="font-semibold">Formato</th>
                  <th className="font-semibold text-center">Impactos</th>
                  <th className="font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {notes
                  .filter(n => n.title.toLowerCase().includes(searchTable.toLowerCase()))
                  .map((n) => (
                    <tr key={n.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {n.month}
                      </td>
                      <td className="font-bold text-slate-900 dark:text-white">
                        {n.title}
                      </td>
                      <td className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {n.format}
                      </td>
                      <td className="text-center font-bold text-blue-600 dark:text-blue-400">
                        {n.clippingCount}
                      </td>
                      <td className="text-right space-x-2 whitespace-nowrap">
                        {n.docLink && n.docLink.startsWith('http') && (
                          <a
                            href={n.docLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center space-x-0.5"
                          >
                            <span>Drive</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <button
                          onClick={() => onDeleteNote(n.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs table-compact">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="font-semibold">Fecha / Mes</th>
                  <th className="font-semibold">Medio</th>
                  <th className="font-semibold">Tema</th>
                  <th className="font-semibold">Alcance</th>
                  <th className="font-semibold text-right">Enlace / Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {clippings
                  .filter(c => c.media.toLowerCase().includes(searchTable.toLowerCase()) || c.theme.toLowerCase().includes(searchTable.toLowerCase()))
                  .slice(0, 100)
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {c.date || c.month}
                      </td>
                      <td className="font-bold text-slate-900 dark:text-white">
                        {c.media}
                      </td>
                      <td className="text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {c.theme}
                      </td>
                      <td className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {c.category}
                      </td>
                      <td className="text-right space-x-2 whitespace-nowrap">
                        {c.link && c.link.startsWith('http') && (
                          <a
                            href={c.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center space-x-0.5"
                          >
                            <span>Ver nota</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <button
                          onClick={() => onDeleteClipping(c.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                          title="Eliminar clipping"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
