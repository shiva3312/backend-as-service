'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './nav-items';
import { Shield, Layers } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2 bg-sky-600 rounded-lg text-white">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 dark:text-white text-base leading-tight">Data Manager</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">BaaS Admin Portal</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-sky-600 dark:text-sky-400' : ''}`} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <Shield className="h-4 w-4 text-emerald-500" />
          <div className="text-xs">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Tenant Isolation</p>
            <p className="text-slate-500 dark:text-slate-400">Strict appId Scoped</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
