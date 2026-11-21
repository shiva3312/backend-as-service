'use client';

import React from 'react';
import Link from 'next/link';
import {
  Layers,
  ShieldCheck,
  Zap,
  Lock,
  Wallet,
  HardDrive,
  KeyRound,
  CreditCard,
  ArrowRight,
  Server,
  Database,
  Cpu,
  Globe,
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Layers,
      title: 'Multi-Tenant Application Isolation',
      desc: 'Provision isolated applications with appId scoping, individual API key generation, and dynamic module feature flags.',
      badge: 'Core Platform',
    },
    {
      icon: Lock,
      title: 'Argon2id Auth & Rotating JWTs',
      desc: 'Enterprise security with Argon2id password hashing, rotating refresh tokens in Redis, 2FA TOTP, and remote session revocation.',
      badge: 'Security First',
    },
    {
      icon: HardDrive,
      title: 'AES-256-GCM Envelope Encryption',
      desc: 'Client-managed envelope file encryption integrated seamlessly across Cloudflare R2, AWS S3, and Local volumes.',
      badge: 'Data Privacy',
    },
    {
      icon: Wallet,
      title: 'Immutable Credit Ledger & Wallet',
      desc: 'Double-entry financial ledger for pay-as-you-go credit top-ups, usage deductions, and idempotent transaction safety.',
      badge: 'FinTech Grade',
    },
    {
      icon: CreditCard,
      title: 'Subscriptions & Quota Entitlements',
      desc: 'Centralized entitlement resolution engine enforcing API request limits, trial periods, and tier-based feature access.',
      badge: 'Monetization',
    },
    {
      icon: KeyRound,
      title: 'Activation & License Key Engine',
      desc: 'Generate cryptographically hashed activation codes, bind entitlements, and track usage redemptions automatically.',
      badge: 'Licensing',
    },
  ];

  const stack = [
    { name: 'NestJS 10', role: 'API Gateway Framework', icon: Server },
    { name: 'Fastify', role: 'High-Throughput HTTP Engine', icon: Zap },
    { name: 'Prisma + PostgreSQL', role: 'Relational Database & ORM', icon: Database },
    { name: 'Redis + BullMQ', role: 'Distributed Queues & Caching', icon: Cpu },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      {/* Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-600 rounded-xl text-white shadow-lg shadow-sky-600/30">
              <Layers className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">Data Manager</span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800">
              BaaS Monorepo
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="http://localhost:3000/api/docs"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 transition-colors"
            >
              <Globe className="h-3.5 w-3.5" /> API Specs (Swagger)
            </a>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors shadow-lg shadow-sky-600/20"
            >
              Launch Admin Portal <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center space-y-8 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-sky-400 font-semibold mb-4">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Production-Grade Modular BaaS Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Unified Backend Infrastructure for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">All Client Applications</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Power Native Android, iOS, Web SPAs, and Desktop clients with multi-tenant isolation, Argon2id authentication, envelope-encrypted storage, and credit wallet ledgers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm transition-all shadow-xl shadow-sky-600/25 flex items-center justify-center gap-2"
          >
            Access Super Admin Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="http://localhost:3000/api/docs"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            Explore Swagger API Docs
          </a>
        </div>
      </section>

      {/* Platform Feature Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Platform Core Capabilities</h2>
          <p className="text-slate-400 text-sm">Modular domain packages designed for complete operational flexibility.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-sky-950/80 text-sky-400 border border-sky-800/40">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-400">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Monorepo Architecture Stack */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl font-bold text-white">High-Performance Tech Stack</h2>
          <p className="text-slate-400 text-xs">Monorepo design powered by pnpm workspaces and TurboRepo.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stack.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-4"
              >
                <div className="p-2.5 rounded-xl bg-sky-900/40 text-sky-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{item.name}</h4>
                  <p className="text-[11px] text-slate-400">{item.role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-500" />
            <span className="font-bold text-slate-300">data-manager BaaS</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="http://localhost:3000/api/docs" target="_blank" rel="noreferrer" className="hover:text-slate-300">
              OpenAPI Swagger
            </a>
            <Link href="/login" className="hover:text-slate-300">
              Admin Login
            </Link>
          </div>
          <p>© 2026 Modular Backend Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
