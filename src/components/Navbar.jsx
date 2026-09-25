import React from 'react';
import { 
  BarChart3, 
  Newspaper, 
  Target, 
  PlusCircle, 
  Moon, 
  Sun, 
  FileText, 
  Info,
  Download,
  LogOut,
  UserCheck,
  ListFilter
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  darkMode, 
  setDarkMode, 
  onOpenAudit, 
  onExportData, 
  notesCount, 
  clippingsCount,
  currentUser,
  onLogout
}) {
  const navItems = [
    { id: 'dashboard', label: 'Tablero General', icon: BarChart3, badge: `${notesCount} notas` },
    { id: 'explorer', label: 'Explorador & Filtros', icon: ListFilter, badge: 'Multifiltro' },
    { id: 'media', label: 'Monitor de Medios', icon: Newspaper, badge: 'Locales y Regionales' },
    { id: 'matrix', label: 'Matriz Éxito / Falla', icon: Target, badge: 'Análisis Causal' },
    { id: 'management', label: 'Panel de Carga y Gestión', icon: PlusCircle, badge: 'Prensa' },
  ];

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-40 backdrop-blur transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand: YAGONEITOR 3000 / Prensa Esquel */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-slate-900 dark:text-white text-base tracking-tight uppercase">
                  YAGONEITOR 3000
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 hidden sm:inline-block">
                  Subsecretaría de Turismo
                </span>
              </div>
              <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                Prensa Esquel
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 shadow-sm border border-blue-200/60 dark:border-blue-800/60'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Tools & User Profile */}
          <div className="flex items-center space-x-2">
            {/* User Badge */}
            {currentUser && (
              <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <div className="text-left">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] leading-tight capitalize">
                    {currentUser.username}
                  </span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 block leading-none truncate max-w-[90px]">
                    {(currentUser.role || 'Usuario').split(' ')[0]}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={onOpenAudit}
              title="Criterios de Depuración y Auditoría"
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <Info className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="hidden lg:inline text-xs">Criterios</span>
            </button>

            <button
              onClick={onExportData}
              title="Exportar base completa (JSON)"
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden lg:inline text-xs">Exportar</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Logout button */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Cerrar Sesión"
                className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors border border-rose-200 dark:border-rose-900/60"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 space-x-2 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
