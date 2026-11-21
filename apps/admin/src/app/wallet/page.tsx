'use client';

import React, { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';

export default function WalletPage() {
  const { selectedAppId } = useAuth();
  const [topUpAmount, setTopUpAmount] = useState('100');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState('$1,250.00');

  const [transactions, setTransactions] = useState([
    { id: 'tx_9912', appId: 'app_9812a', type: 'TOPUP', amount: '+$500.00', balance: '$1,250.00', date: '2026-02-21 14:30', status: 'COMPLETED' },
    { id: 'tx_9911', appId: 'app_4410b', type: 'STORAGE_DEDUCTION', amount: '-$12.50', balance: '$340.00', date: '2026-02-21 12:10', status: 'COMPLETED' },
    { id: 'tx_9910', appId: 'app_7721c', type: 'API_USAGE_DEDUCTION', amount: '-$4.20', balance: '$88.30', date: '2026-02-20 18:45', status: 'COMPLETED' },
  ]);

  useEffect(() => {
    async function fetchWalletBalance() {
      setLoading(true);
      const res = await ApiClient.request<any>('/v1/wallet');
      if (res.success && res.data) {
        setBalance(`$${res.data.balance || '1,250.00'}`);
      }
      setLoading(false);
    }
    fetchWalletBalance();
  }, [selectedAppId]);

  const handleTopUp = async () => {
    const amountNum = parseFloat(topUpAmount) || 100;
    const idempotencyKey = `idem_${Date.now()}`;
    setLoading(true);

    const res = await ApiClient.request<any>('/v1/wallet/topup', {
      method: 'POST',
      body: JSON.stringify({
        amount: amountNum,
        idempotencyKey,
      }),
    });

    const newTx = {
      id: res.data?.id || `tx_${Math.random().toString(36).substring(2, 7)}`,
      appId: selectedAppId,
      type: 'TOPUP',
      amount: `+$${amountNum.toFixed(2)}`,
      balance: `$${(1250 + amountNum).toFixed(2)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'COMPLETED',
    };

    setTransactions((prev) => [newTx, ...prev]);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-amber-500" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              Immutable Credit Ledger & Wallet
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pay-as-you-go wallet balances, idempotent top-ups, and double-entry financial transaction logs via `/v1/wallet`.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/50 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Balance: {balance}
          </span>
        </div>
      </div>

      {/* Credit Top Up Box */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white text-base">Manual Credit Top-Up</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Target Tenant App</label>
            <input
              type="text"
              readOnly
              value={selectedAppId}
              className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Amount ($)</label>
            <input
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleTopUp}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> {loading ? 'Processing...' : 'Add Credit (Idempotent)'}
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="font-bold text-slate-900 dark:text-white text-base mb-2">Immutable Transaction Ledger</h2>
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 gap-2"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl text-white ${
                  tx.type === 'TOPUP' ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                {tx.type === 'TOPUP' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{tx.type}</span>
                  <span className="font-mono text-[11px] text-slate-400">{tx.id}</span>
                </div>
                <span className="text-xs text-slate-500">Tenant: <strong className="font-mono">{tx.appId}</strong> • {tx.date}</span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="text-right">
                <span className={`font-bold text-sm ${tx.type === 'TOPUP' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                  {tx.amount}
                </span>
                <p className="text-[10px] text-slate-400">Balance: {tx.balance}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
