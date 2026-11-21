'use client';

import React, { useState } from 'react';
import { KeyRound, Plus, Copy, Check } from 'lucide-react';

export default function ActivationPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const keys = [
    { code: 'ACT-9812-4401-K912', plan: 'PRO_TIER', maxRedemptions: 1, redeemed: 1, hash: 'sha256_8832a7...', createdAt: '2026-02-10' },
    { code: 'ACT-1102-9981-L771', plan: 'ENTERPRISE', maxRedemptions: 5, redeemed: 2, hash: 'sha256_104928...', createdAt: '2026-02-18' },
    { code: 'ACT-3341-8812-M004', plan: 'CREDIT_TOPUP_100', maxRedemptions: 1, redeemed: 0, hash: 'sha256_771234...', createdAt: '2026-02-21' },
  ];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(code);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="h-6 w-6 text-indigo-500" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              Activation & License Key Engine
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate cryptographically hashed activation keys, bind entitlements, and track redemptions.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Generate New Key Batch
        </button>
      </div>

      <div className="space-y-3">
        {keys.map((k, idx) => (
          <div
            key={idx}
            className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{k.code}</span>
                <button onClick={() => copyCode(k.code)} className="p-1 hover:text-indigo-600">
                  {copiedKey === k.code ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                </button>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span>Entitlement: <strong className="text-slate-700 dark:text-slate-300">{k.plan}</strong></span>
                <span>•</span>
                <span>Hash: <strong className="font-mono">{k.hash}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                Redeemed {k.redeemed} / {k.maxRedemptions}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
