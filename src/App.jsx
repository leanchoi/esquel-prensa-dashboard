import React, { useState, useEffect } from 'react';
import initialData from './data/dataset.json';
import Navbar from './components/Navbar';
import OverviewDashboard from './components/OverviewDashboard';
import MediaMonitor from './components/MediaMonitor';
import SuccessFailureMatrix from './components/SuccessFailureMatrix';
import PressManagementPanel from './components/PressManagementPanel';
import MethodologyAuditModal from './components/MethodologyAuditModal';
import NoteDetailModal from './components/NoteDetailModal';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('esquel_theme') === 'dark' || true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('esquel_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('esquel_theme', 'light');
    }
  }, [darkMode]);

  // Main Active Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals state
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // Persistent notes and clippings in localStorage
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('esquel_notes_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialData.notes || [];
  });

  const [clippings, setClippings] = useState(() => {
    try {
      const saved = localStorage.getItem('esquel_clippings_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialData.clippings || [];
  });

  const [mediaList, setMediaList] = useState(initialData.mediaList || []);

  // Save to localStorage when notes or clippings change
  useEffect(() => {
    try {
      localStorage.setItem('esquel_notes_v1', JSON.stringify(notes));
    } catch (e) {
      console.error('Local storage save error:', e);
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem('esquel_clippings_v1', JSON.stringify(clippings));
    } catch (e) {
      console.error('Local storage save error:', e);
    }
  }, [clippings]);

  // Handlers for Add / Delete
  const handleAddNote = (newNote) => {
    setNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('¿Seguro que deseas eliminar esta gacetilla del registro?')) {
      setNotes(prev => prev.filter(n => n.id !== noteId));
    }
  };

  const handleAddClipping = (newClip) => {
    setClippings(prev => [newClip, ...prev]);

    // Recalculate media list count dynamically
    setMediaList(prev => {
      const existing = prev.find(m => m.name.toLowerCase() === newClip.media.toLowerCase());
      if (existing) {
        return prev.map(m => m.name.toLowerCase() === newClip.media.toLowerCase()
          ? { ...m, totalClippings: m.totalClippings + 1 }
          : m
        );
      } else {
        return [
          {
            name: newClip.media,
            category: newClip.category,
            totalClippings: 1,
            uniqueThemesCount: 1,
            topThemes: [{ theme: newClip.theme, count: 1 }],
            topMonths: [[newClip.month, 1]],
            sampleLinks: [{ theme: newClip.theme, date: newClip.date, link: newClip.link }]
          },
          ...prev
        ];
      }
    });
  };

  const handleDeleteClipping = (clipId) => {
    if (window.confirm('¿Seguro que deseas eliminar este clipping?')) {
      setClippings(prev => prev.filter(c => c.id !== clipId));
    }
  };

  // Export full JSON database
  const handleExportData = () => {
    const dataToExport = {
      exportedAt: new Date().toISOString(),
      source: 'Sistema de Gestión, Prensa y Clipping - Subsecretaría de Esquel',
      notes,
      clippings,
      mediaList
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prensa_esquel_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV for notes or clippings
  const handleExportCSV = (type) => {
    let csvContent = '';
    if (type === 'notes') {
      csvContent = 'ID,Titulo,Formato,Mes,EjeTematico,Clippings,DocLink,MediaLink\n';
      notes.forEach(n => {
        csvContent += `"${n.id}","${n.title.replace(/"/g, '""')}","${n.format}","${n.month}","${n.thematicGroup}",${n.clippingCount},"${n.docLink}","${n.directMediaLink}"\n`;
      });
    } else {
      csvContent = 'ID,Fecha,Medio,Categoria,Tema,Lugar,Link\n';
      clippings.forEach(c => {
        csvContent += `"${c.id}","${c.date || c.month}","${c.media.replace(/"/g, '""')}","${c.category}","${c.theme.replace(/"/g, '""')}","${c.place}","${c.link}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esquel_${type}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAudit={() => setIsAuditOpen(true)}
        onExportData={handleExportData}
        notesCount={notes.length}
        clippingsCount={clippings.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <OverviewDashboard
            notes={notes}
            clippings={clippings}
            mediaList={mediaList}
            onSelectNote={(note) => setSelectedNote(note)}
            onSelectMedia={(mediaName) => {
              setActiveTab('media');
            }}
          />
        )}

        {activeTab === 'media' && (
          <MediaMonitor
            mediaList={mediaList}
            clippings={clippings}
            notes={notes}
          />
        )}

        {activeTab === 'matrix' && (
          <SuccessFailureMatrix
            notes={notes}
            clippings={clippings}
          />
        )}

        {activeTab === 'management' && (
          <PressManagementPanel
            notes={notes}
            clippings={clippings}
            onAddNote={handleAddNote}
            onAddClipping={handleAddClipping}
            onDeleteNote={handleDeleteNote}
            onDeleteClipping={handleDeleteClipping}
            onExportCSV={handleExportCSV}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Subsecretaría de Turismo de Esquel • Área de Prensa y Comunicación</span>
          <span className="text-[11px]">83 Gacetillas • 371 Clippings • 150 Medios Auditados</span>
        </div>
      </footer>

      {/* Modals */}
      <MethodologyAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
      />

      <NoteDetailModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
      />
    </div>
  );
}
