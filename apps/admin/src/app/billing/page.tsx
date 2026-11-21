'use client';

import React, { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { CreditCard, Check } from 'lucide-react';

export default function BillingPage() {
  const { selectedAppId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([
    {
      id: 'plan_free',
      name: 'Free Tier',
      price: '$0 / mo',
      quota: '1,000 API req / day',
      features: ['Basic Authentication', 'Local Disk Storage', '1 App Tenant'],
      isPopular: false,
    },
    {
      id: 'plan_pro',
      name: 'Pro Tier',
      price: '$49 / mo',
      quota: '100,000 API req / day',
      features: ['2FA & Session Revocation', 'Cloudflare R2 / S3', 'Credit Wallet Engine', '5 App Tenants'],
      isPopular: true,
    },
    {
      id: 'plan_enterprise',
      name: 'Enterprise BaaS',
      price: '$299 / mo',
      quota: 'Unlimited API reqs',
      features: ['AES-256-GCM Envelope Encryption', 'Activation Key Generator', 'Dedicated Redis Queue', 'Unlimited Tenants'],
      isPopular: false,
    },
  ]);

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      const res = await ApiClient.request<any[]>('/v1/subscriptions/plans');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setPlans(
          res.data.map((p, idx) => ({
            id: p.id || `plan_${idx}`,
            name: p.name || 'Subscription Plan',
            price: p.price ? `$${p.price} / mo` : '$49 / mo',
            quota: p.quota || 'Standard Quota',
            features: p.features || ['BaaS Modules', 'Tenant Scoping'],
            isPopular: idx === 1,
          }))
        );
      }
      setLoading(false);
    }
    fetchPlans();
  }, [selectedAppId]);

  const handleSubscribe = async (planId: string) => {
    await ApiClient.request('/v1/subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
    alert(`Subscribed app ${selectedAppId} to plan ${planId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-sky-600" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              Subscriptions & Feature Entitlements
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure subscription plans, quota limits, and dynamic feature entitlement rules via `/v1/subscriptions`.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`p-6 bg-white dark:bg-slate-900 rounded-2xl border ${
              plan.isPopular ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200 dark:border-slate-800'
            } shadow-sm space-y-4 flex flex-col justify-between`}
          >
            <div>
              {plan.isPopular && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 inline-block mb-2">
                  Most Popular
                </span>
              )}
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h2>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{plan.price}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{plan.quota}</p>

              <div className="border-t border-slate-100 dark:border-slate-800 my-4 pt-4 space-y-2">
                {plan.features.map((f, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSubscribe(plan.id)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              Configure Entitlements
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
