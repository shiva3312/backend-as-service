'use client';

import React, { useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { HardDrive, ShieldCheck, Database, Cloud, Upload, FileText, Lock, Trash2, RotateCcw } from 'lucide-react';

interface FileAsset {
  id: string;
  filename: string;
  mimeType: string;
  size: string;
  appId: string;
  provider: string;
  isEncrypted: boolean;
  status: 'ACTIVE' | 'SOFT_DELETED';
  createdAt: string;
}

export default function StoragePage() {
  const { selectedAppId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newFilename, setNewFilename] = useState('user_avatar_report.pdf');

  const [filesList, setFilesList] = useState<FileAsset[]>([
    {
      id: 'file_9912a',
      filename: 'contract_agreement_v2.pdf',
      mimeType: 'application/pdf',
      size: '2.4 MB',
      appId: 'app_9812a',
      provider: 'Cloudflare R2',
      isEncrypted: true,
      status: 'ACTIVE',
      createdAt: '2026-02-21 14:10',
    },
    {
      id: 'file_4401b',
      filename: 'app_assets_archive.zip',
      mimeType: 'application/zip',
      size: '18.5 MB',
      appId: 'app_4410b',
      provider: 'AWS S3',
      isEncrypted: true,
      status: 'ACTIVE',
      createdAt: '2026-02-20 11:45',
    },
  ]);

  const providers = [
    { name: 'Cloudflare R2', type: 'S3-Compatible Object Storage', files: `${filesList.length + 14280} files`, size: '210 GB', status: 'PRIMARY', icon: Cloud },
    { name: 'AWS S3 Bucket', type: 'Backup & Archival', files: '1,490 files', size: '74 GB', status: 'BACKUP', icon: Database },
    { name: 'Local Volume Storage', type: 'Temp Chunk Processing', files: '42 files', size: '1.2 GB', status: 'ACTIVE', icon: HardDrive },
  ];

  const handleUpload = async () => {
    if (!newFilename.trim()) return;
    setLoading(true);

    const res = await ApiClient.request<any>('/v1/files/upload', {
      method: 'POST',
      body: JSON.stringify({
        filename: newFilename,
        mimeType: 'application/pdf',
        sizeInBytes: 2500000,
        encryptionEnabled: true,
      }),
    });

    const newFileAsset: FileAsset = {
      id: res.data?.id || `file_${Math.random().toString(36).substring(2, 7)}`,
      filename: res.data?.filename || newFilename,
      mimeType: res.data?.mimeType || 'application/pdf',
      size: res.data?.sizeInBytes ? `${(res.data.sizeInBytes / 1048576).toFixed(1)} MB` : '2.5 MB',
      appId: res.data?.appId || selectedAppId,
      provider: res.data?.storageProvider || 'Cloudflare R2',
      isEncrypted: res.data?.isEncrypted ?? true,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setFilesList((prev) => [newFileAsset, ...prev]);
    setLoading(false);
  };

  const handleSoftDelete = async (fileId: string) => {
    await ApiClient.request(`/v1/files/${fileId}`, {
      method: 'DELETE',
    });

    setFilesList((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: 'SOFT_DELETED' } : f))
    );
  };

  const handleRestore = async (fileId: string) => {
    await ApiClient.request(`/v1/files/${fileId}/restore`, {
      method: 'POST',
    });

    setFilesList((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: 'ACTIVE' } : f))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
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
        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200/50 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4" /> AES-256-GCM Envelope Encryption Active
        </span>
      </div>

      {/* Upload Widget Card */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white text-base">Upload & Encrypt New File Asset</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs font-medium text-slate-500 block mb-1">Filename</label>
            <input
              type="text"
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              placeholder="e.g. audit_log_export.csv"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors"
            >
              <Upload className="h-4 w-4" /> {loading ? 'Uploading & Encrypting...' : 'Upload File via API'}
            </button>
          </div>
        </div>
      </div>

      {/* Storage Providers Breakdown */}
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
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{p.name}</h3>
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

      {/* Real-time Uploaded File Assets List */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            <h2 className="font-bold text-slate-900 dark:text-white text-base">Uploaded Files & Encrypted Assets</h2>
          </div>
          <span className="text-xs text-slate-500">{filesList.length} Files Recorded</span>
        </div>

        <div className="space-y-3">
          {filesList.map((file) => (
            <div
              key={file.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{file.filename}</span>
                  <span className="font-mono text-slate-400 text-[11px]">{file.id}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <span>Tenant Scope: <strong className="font-mono text-slate-700 dark:text-slate-300">{file.appId}</strong></span>
                  <span>•</span>
                  <span>Provider: <strong>{file.provider}</strong></span>
                  <span>•</span>
                  <span>Size: {file.size}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50 dark:border-slate-800">
                {file.isEncrypted && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 font-medium">
                    <Lock className="h-3 w-3" /> AES-256-GCM
                  </span>
                )}

                {file.status === 'ACTIVE' ? (
                  <button
                    onClick={() => handleSoftDelete(file.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 transition-colors font-medium"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Soft Delete
                  </button>
                ) : (
                  <button
                    onClick={() => handleRestore(file.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 transition-colors font-medium"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Restore File
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
