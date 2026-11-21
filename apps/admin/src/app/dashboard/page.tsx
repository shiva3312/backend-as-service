'use client';

import React from 'react';
import {
  AppWindow,
  Users,
  Wallet,
  HardDrive,
  TrendingUp,
  Activity,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardPage() {
  const metrics = [
    {
      title: 'Active Applications',
      value: '14 Apps',
      change: '+2 this month',
      icon: AppWindow,
      color: 'bg-blue-500',
    },
    {
      title: 'Registered Users',
      value: '1,284 Users',
      change: '+14% active',
      icon: Users,
      color: 'bg-emerald-500',
    },
    {
      title: 'Wallet Credit Volume',
      value: '$48,250.00',
      change: 'Idempotent Ledger',
      icon: Wallet,
      color: 'bg-amber-500',
    },
    {
      title: 'Storage Used',
      value: '284 GB',
      change: 'Cloudflare R2 / S3',
      icon: HardDrive,
      color: 'bg-purple-500',
    },
  ];

  const modules = [
    { name: 'Authentication & Identity', path: 'packages/modules/auth', status: 'Active', security: 'Argon2id + 2FA' },
    { name: 'Application Isolation', path: 'packages/modules/app-management', status: 'Active', security: 'appId Scoped' },
    { name: 'Storage & Encryption', path: 'packages/modules/storage', status: 'Active', security: 'AES-256-GCM' },
    { name: 'Wallet & Credit Ledger', path: 'packages/modules/wallet', status: 'Active', security: 'Immutable & Atomic' },
    { name: 'Subscription Billing', path: 'packages/modules/billing', status: 'Active', security: 'Quota Enforcement' },
    { name: 'Activation Keys', path: 'packages/modules/activation', status: 'Active', security: 'SHA-256 Hashing' },
  ];

  const auditEvents = [
    { id: 1, action: 'APP_PROVISIONED', details: 'Created app: "Mobile Android Client"', time: '2 mins ago', level: 'INFO' },
    { id: 2, action: 'WALLET_TOPUP', details: 'Added $500.00 credit to tenant app_9281', time: '14 mins ago', level: 'INFO' },
    { id: 3, action: 'SESSION_REVOKED', details: 'Remote session revoked for user_339', time: '45 mins ago', level: 'WARN' },
    { id: 4, action: 'LICENSE_KEY_REDEEMED', details: 'Key "PRO-8812-4912" redeemed', time: '1 hour ago', level: 'INFO' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            BaaS Overview & System Metrics
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time management for multi-tenant applications, security guards, and platform ledgers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/50">
            <CheckCircle2 className="h-4 w-4" /> System Healthy
          </span>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{m.title}</span>
                <div className={`p-2.5 rounded-xl text-white ${m.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{m.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{m.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section for Modules & Recent Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Modules Status */}
        <div className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-sky-600" />
              <h2 className="font-bold text-slate-900 dark:text-white text-base">Core Domain Modules</h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Strict Typing Enabled</span>
          </div>

          <div className="space-y-3">
            {modules.map((mod, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 gap-2"
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{mod.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{mod.path}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-medium">
                    {mod.security}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-medium">
                    ● {mod.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Audit Log Stream */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-500" />
              <h2 className="font-bold text-slate-900 dark:text-white text-base">Recent Audit Stream</h2>
            </div>
          </div>

          <div className="space-y-3">
            {auditEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{evt.action}</span>
                  <span className="text-[10px] text-slate-400">{evt.time}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{evt.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
