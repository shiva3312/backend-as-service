'use client';

import React, { useState } from 'react';
import {
  AppWindow,
  Plus,
  Key,
  ToggleLeft,
  ToggleRight,
  Search,
  Copy,
  Check,
  RotateCw,
} from 'lucide-react';

interface ClientApp {
  id: string;
  name: string;
  apiKey: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  modules: {
    auth: boolean;
    billing: boolean;
    wallet: boolean;
    storage: boolean;
    activation: boolean;
  };
}

export default function AppsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [appsList, setAppsList] = useState<ClientApp[]>([
    {
      id: 'app_9812a',
      name: 'Android Mobile App',
      apiKey: 'ak_live_8832a79401bf',
      status: 'ACTIVE',
      createdAt: '2026-01-15',
      modules: { auth: true, billing: true, wallet: true, storage: true, activation: true },
    },
    {
      id: 'app_4410b',
      name: 'iOS SwiftUI Portal',
      apiKey: 'ak_live_10492817cc91',
      status: 'ACTIVE',
      createdAt: '2026-02-01',
      modules: { auth: true, billing: true, wallet: false, storage: true, activation: false },
    },
    {
      id: 'app_7721c',
      name: 'Electron Desktop Client',
      apiKey: 'ak_live_992148172ffa',
      status: 'ACTIVE',
      createdAt: '2026-02-20',
      modules: { auth: true, billing: false, wallet: true, storage: true, activation: true },
    },
  ]);

  const toggleModule = (appId: string, moduleName: keyof ClientApp['modules']) => {
    setAppsList((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            modules: {
              ...app.modules,
              [moduleName]: !app.modules[moduleName],
            },
          };
        }
        return app;
      })
    );
  };

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredApps = appsList.filter(
    (a) => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <AppWindow className="h-6 w-6 text-sky-600" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              Application Management
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Provision tenant applications, manage API keys, and configure dynamic module feature flags.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Provision New App
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search application by name or appId..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
        />
      </div>

      {/* Responsive Cards Layout for Mobile & Tablet */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  {app.id}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  ● {app.status}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-2">{app.name}</h2>
              <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800 text-xs font-mono">
                <Key className="h-3.5 w-3.5 text-slate-400" />
                <span className="flex-1 truncate text-slate-700 dark:text-slate-300">{app.apiKey}</span>
                <button
                  onClick={() => copyKey(app.apiKey, app.id)}
                  className="p-1 hover:text-sky-600 transition-colors"
                >
                  {copiedId === app.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Feature Flags Module Section */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Enabled Feature Modules</p>
              {(['auth', 'billing', 'wallet', 'storage', 'activation'] as const).map((modKey) => {
                const isEnabled = app.modules[modKey];
                return (
                  <div key={modKey} className="flex items-center justify-between text-xs py-1">
                    <span className="capitalize font-medium text-slate-700 dark:text-slate-300">{modKey} Module</span>
                    <button
                      onClick={() => toggleModule(app.id, modKey)}
                      className="flex items-center gap-1.5 focus:outline-none"
                    >
                      {isEnabled ? (
                        <ToggleRight className="h-6 w-6 text-sky-600" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-slate-400" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Created {app.createdAt}</span>
              <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-sky-600 font-medium">
                <RotateCw className="h-3.5 w-3.5" /> Rotate Key
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
