import './globals.css';
import type { Metadata } from 'next';
import { Shell } from '@/components/layout/shell';

export const metadata: Metadata = {
  title: 'Data Manager — Admin Portal',
  description: 'Modular BaaS Platform Admin Panel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
