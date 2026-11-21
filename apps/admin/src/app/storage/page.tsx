'use client';

import React, { useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { HardDrive, Database, Cloud, Upload } from 'lucide-react';

export default function StoragePage() {
  const { selectedAppId } = useAuth();
  const [loading, setLoading] = useState(false);

  const providers = [
    { name: 'Cloudflare R2', type: 'S3-Compatible Object Storage', files: '14,280 files', size: '210 GB', status: 'PRIMARY', icon: Cloud },
    { name: 'AWS S3 Bucket', type: 'Backup & Archival', files: '1,490 files', size: '74 GB', status: 'BACKUP', icon: Database },
    { name: 'Local Volume Storage', type: 'Temp Chunk Processing', files: '42 files', size: '1.2 GB', status: 'ACTIVE', icon: HardDrive },
  ];

  const testUpload = async () => {
    setLoading(true);
    await ApiClient.request('/v1/files/upload', {
      method: 'POST',
      body: JSON.stringify({
        filename: 'admin_test_document.pdf',
        mimeType: 'application/pdf',
        sizeInBytes: 1048576,
        encryptionEnabled: true,
      }),
    });
    alert(`File uploaded via /v1/files/upload under tenant scope ${selectedAppId}!`);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <HardDrive className="h-6 w-6 text-purple-500" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              Storage & Envelope Encryption Explorer
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Abstract storage provider delegation with client-managed AES-256-GCM envelope encryption via `/v1/files`.
          </p>
        </div>
        <button
          onClick={testUpload}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-colors shadow-sm"
        >
          <Upload className="h-4 w-4" /> {loading ? 'Uploading...' : 'Test Upload File'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {providers.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {p.status}
                </span>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{p.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{p.type}</p>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500">{p.files}</span>
                <span className="font-bold text-slate-900 dark:text-white">{p.size}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
