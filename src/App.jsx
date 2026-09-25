import React, { useState, useEffect } from 'react';
import initialData from './data/dataset.json';
import Navbar from './components/Navbar';
import OverviewDashboard from './components/OverviewDashboard';
import MediaMonitor from './components/MediaMonitor';
import SuccessFailureMatrix from './components/SuccessFailureMatrix';
import PressManagementPanel from './components/PressManagementPanel';
import AdvancedExplorer from './components/AdvancedExplorer';
import MethodologyAuditModal from './components/MethodologyAuditModal';
import NoteDetailModal from './components/NoteDetailModal';
import LoginScreen from './components/LoginScreen';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-8 text-center">
          <div className="max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              ⚠️
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Se produjo un error visual
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              {this.state.error?.message || 'Error inesperado al renderizar la vista.'}
            </p>
            <button
              onClick={() => {
                sessionStorage.clear();
                window.location.reload();
              }}
              className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Reiniciar y limpiar sesión
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('esquel_theme') !== 'light';
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

  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem('yagoneitor_user') || localStorage.getItem('yagoneitor_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const handleLogin = (user) => {
    setCurrentUser(user);
    sessionStorage.setItem('yagoneitor_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('yagoneitor_user');
    localStorage.removeItem('yagoneitor_user');
  };

  // Toast Notification System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Global Keyboard Shortcuts (Ctrl+K or '/' to jump to Explorer)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName;
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag);
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && !isInput)) {
        e.preventDefault();
        setActiveTab('explorer');
        showToast('Atajo activado: Explorador y Filtros', 'info');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    showToast('Gacetilla registrada exitosamente en el sistema', 'success');
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('¿Seguro que deseas eliminar esta gacetilla del registro?')) {
      setNotes(prev => prev.filter(n => n.id !== noteId));
      showToast('Gacetilla eliminada del registro', 'info');
    }
  };

  const handleAddClipping = (newClip) => {
    setClippings(prev => [newClip, ...prev]);
    showToast(`Nuevo clipping registrado: ${newClip.media}`, 'success');

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
      showToast('Clipping eliminado del registro', 'info');
    }
  };

  // Export full JSON database
  const handleExportData = () => {
    const dataToExport = {
      exportedAt: new Date().toISOString(),
      source: 'YAGONEITOR 3000 - Prensa Esquel',
      notes,
      clippings,
      mediaList
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yagoneitor_esquel_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Base de datos exportada en formato JSON', 'success');
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
    a.download = `yagoneitor_${type}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Archivo CSV de ${type === 'notes' ? 'gacetillas' : 'clippings'} descargado`, 'success');
  };

  // If user is not logged in, show Login Screen
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <ErrorBoundary>
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
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <OverviewDashboard
            notes={notes}
            clippings={clippings}
            mediaList={mediaList}
            onSelectNote={(note) => setSelectedNote(note)}
            onSelectMedia={() => {
              setActiveTab('media');
            }}
          />
        )}

        {activeTab === 'explorer' && (
          <AdvancedExplorer
            notes={notes}
            clippings={clippings}
            mediaList={mediaList}
            onSelectNote={(note) => setSelectedNote(note)}
            showToast={showToast}
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
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">YAGONEITOR 3000</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Prensa Esquel</span>
            <span>•</span>
            <span>Subsecretaría de Turismo</span>
          </div>
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
        showToast={showToast}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold backdrop-blur-md transition-all bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 border-slate-200/80 dark:border-slate-700/80 ring-1 ring-black/5 dark:ring-white/10">
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-500 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2 shrink-0 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      </div>
    </ErrorBoundary>
  );
}
