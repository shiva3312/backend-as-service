'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Bell, Moon, Sun, LogOut, AppWindow } from 'lucide-react';

export function Header() {
  const [isDark, setIsDark] = React.useState(false);
  const { user, selectedAppId, setSelectedAppId, logout, isApiLive } = useAuth();

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="hidden md:flex h-16 items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
      {/* Left: Tenant App Selector & API Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <AppWindow className="h-4 w-4 text-sky-600" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tenant Scope:</span>
          <select
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="bg-transparent text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="app_9812a" className="dark:bg-slate-900">app_9812a (Android App)</option>
            <option value="app_4410b" className="dark:bg-slate-900">app_4410b (iOS Portal)</option>
            <option value="app_7721c" className="dark:bg-slate-900">app_7721c (Electron Client)</option>
          </select>
        </div>

        {isApiLive ? (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Gateway Connected
          </span>
        ) : (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300/40 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Dev Preview / Fallback
          </span>
        )}
      </div>

      {/* Right: Theme Toggle, User Profile & Logout */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>

        <button className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <div className="h-8 w-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
              SA
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold leading-none">{user?.email || 'Super Admin'}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{user?.role || 'SUPER_ADMIN'}</span>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
