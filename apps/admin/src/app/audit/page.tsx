'use client';

import React, { useState } from 'react';
import { ShieldAlert, Filter } from 'lucide-react';

export default function AuditPage() {
  const [filterLevel, setFilterLevel] = useState('ALL');

  const logs = [
    { id: 'aud_1001', action: 'SECURITY_LOGIN_2FA', ip: '192.168.1.42', user: 'alex.admin@domain.com', level: 'SECURITY', timestamp: '2026-02-21 16:20:11' },
    { id: 'aud_1002', action: 'APP_FEATURE_FLAG_TOGGLED', ip: '192.168.1.42', user: 'alex.admin@domain.com', level: 'INFO', timestamp: '2026-02-21 16:05:40' },
    { id: 'aud_1003', action: 'JWT_REFRESH_REVOKED', ip: '10.0.4.12', user: 'usr_3342', level: 'WARN', timestamp: '2026-02-21 15:42:01' },
    { id: 'aud_1004', action: 'WALLET_LEDGER_MUTATION', ip: '192.168.1.42', user: 'system_worker', level: 'INFO', timestamp: '2026-02-21 14:30:00' },
  ];

  const filtered = logs.filter((l) => filterLevel === 'ALL' || l.level === filterLevel);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-rose-500" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              Security Audit Event Stream
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Immutable security event logs capturing administrative actions, authentication mutations, and ledger updates.
          </p>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Filter Level:</span>
        </div>
        <div className="flex items-center gap-2">
          {['ALL', 'INFO', 'WARN', 'SECURITY'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                filterLevel === lvl
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((log) => (
          <div
            key={log.id}
            className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                <span className="font-mono text-slate-400">{log.id}</span>
              </div>
              <p className="text-slate-500">Initiator: <strong className="text-slate-700 dark:text-slate-300">{log.user}</strong> ({log.ip})</p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span
                className={`font-semibold px-2.5 py-1 rounded-full ${
                  log.level === 'SECURITY'
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                    : log.level === 'WARN'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                    : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                }`}
              >
                {log.level}
              </span>
              <span className="text-slate-400 font-mono">{log.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
