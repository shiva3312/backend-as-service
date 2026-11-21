'use client';

import React from 'react';
import { Bell, Moon, Sun } from 'lucide-react';

export function Header() {
  const [isDark, setIsDark] = React.useState(false);

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
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40">
          ● Platform Online
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">Environment: Production / Main Gateway</span>
      </div>

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

        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          <div className="h-8 w-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
            SA
          </div>
          <span className="hidden lg:inline">Super Admin</span>
        </div>
      </div>
    </header>
  );
}
