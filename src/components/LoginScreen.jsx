import React, { useState } from 'react';
import { 
  KeyRound, 
  User, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  FileText
} from 'lucide-react';

export const USERS_CONFIG = [
  {
    username: 'admin',
    password: 'admin.esquel.2026',
    name: 'Administrador General',
    role: 'Administrador (Acceso Total)',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300'
  },
  {
    username: 'yago',
    password: 'yago.prensa.2026',
    name: 'Yago Miguens',
    role: 'Redactor Jefe de Prensa',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
  },
  {
    username: 'marcela',
    password: 'marcela.prensa.2026',
    name: 'Marcela',
    role: 'Comunicación y Relaciones Institucionales',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
  },
  {
    username: 'brenda',
    password: 'brenda.prensa.2026',
    name: 'Brenda',
    role: 'Monitoreo de Medios & Clipping',
    badgeColor: 'bg-pink-100 text-pink-800 dark:bg-pink-950/60 dark:text-pink-300'
  },
  {
    username: 'walter',
    password: 'walter.prensa.2026',
    name: 'Walter',
    role: 'Estrategia y Difusión Territorial',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
  }
];

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedQuickUser, setSelectedQuickUser] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const found = USERS_CONFIG.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );

    if (found) {
      onLogin(found);
    } else {
      setError('Usuario o contraseña incorrectos. Revisa las credenciales abajo.');
    }
  };

  const handleQuickSelect = (user) => {
    setUsername(user.username);
    setPassword(user.password);
    setSelectedQuickUser(user.username);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 shadow-xl shadow-blue-500/25 mb-3 border border-white/10">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            YAGONEITOR 3000
          </h1>
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-400 mt-0.5">
            Prensa Esquel
          </p>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Subsecretaría de Turismo • Sistema de Gacetillas y Clipping
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Usuario
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin, yago, marcela, brenda o walter"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>Ingresar al Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Access Credentials Selector */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                <KeyRound className="w-3 h-3 text-amber-400" />
                <span>Cuentas Habilitadas (Clic para cargar)</span>
              </span>
              <span className="text-[10px] text-slate-500">Esquel 2026</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {USERS_CONFIG.map((u) => {
                const isSelected = selectedQuickUser === u.username;
                return (
                  <button
                    key={u.username}
                    type="button"
                    onClick={() => handleQuickSelect(u)}
                    className={`p-2 rounded-lg border text-left transition-all text-[11px] ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/40 text-white'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white capitalize">{u.username}</span>
                      <span className="text-[9px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                        {u.username === 'admin' ? 'admin' : 'prensa'}
                      </span>
                    </div>
                    <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                      {u.name}
                    </span>
                    <span className="block text-[9px] font-mono text-blue-400/90 mt-0.5">
                      Clave: {u.password}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-4">
          Subsecretaría de Turismo • Municipalidad de Esquel
        </p>
      </div>
    </div>
  );
}
