'use client';

import React, { useState } from 'react';
import { Users, Search, ShieldCheck, Smartphone, Trash2, AlertTriangle } from 'lucide-react';

interface UserRecord {
  id: string;
  email: string;
  appId: string;
  role: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'END_USER';
  twoFactorEnabled: boolean;
  activeSessions: number;
  lastActive: string;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserRecord[]>([
    {
      id: 'usr_8819',
      email: 'alex.admin@domain.com',
      appId: 'app_9812a',
      role: 'SUPER_ADMIN',
      twoFactorEnabled: true,
      activeSessions: 3,
      lastActive: '5 mins ago',
    },
    {
      id: 'usr_3342',
      email: 'dev.lead@clientapp.io',
      appId: 'app_4410b',
      role: 'ORG_ADMIN',
      twoFactorEnabled: true,
      activeSessions: 1,
      lastActive: '12 mins ago',
    },
    {
      id: 'usr_9910',
      email: 'user.john@sample.org',
      appId: 'app_7721c',
      role: 'END_USER',
      twoFactorEnabled: false,
      activeSessions: 2,
      lastActive: '1 hour ago',
    },
  ]);

  const revokeSessions = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, activeSessions: 0 } : u))
    );
  };

  const filteredUsers = users.filter(
    (u) => u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.id.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-sky-600" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              User & Identity Management
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage tenant user accounts, RBAC/ABAC security roles, and active JWT device sessions.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search user by email, ID, or appId..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
        />
      </div>

      {/* Responsive Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-base">{user.email}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {user.id}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>App Scope: <strong className="font-mono text-slate-700 dark:text-slate-300">{user.appId}</strong></span>
                <span>•</span>
                <span>Last active: {user.lastActive}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/50">
                Role: {user.role}
              </span>

              {user.twoFactorEnabled ? (
                <span className="text-xs flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> 2FA Active
                </span>
              ) : (
                <span className="text-xs flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5" /> 2FA Off
                </span>
              )}

              <span className="text-xs flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Smartphone className="h-3.5 w-3.5 text-slate-400" /> {user.activeSessions} Sessions
              </span>

              {user.activeSessions > 0 && (
                <button
                  onClick={() => revokeSessions(user.id)}
                  className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 dark:text-rose-400 transition-colors font-medium"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Revoke Sessions
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
