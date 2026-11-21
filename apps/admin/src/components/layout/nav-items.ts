import {
  LayoutDashboard,
  AppWindow,
  Users,
  CreditCard,
  Wallet,
  KeyRound,
  HardDrive,
  ShieldAlert,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Applications',
    href: '/apps',
    icon: AppWindow,
  },
  {
    title: 'Users & Orgs',
    href: '/users',
    icon: Users,
  },
  {
    title: 'Subscriptions',
    href: '/billing',
    icon: CreditCard,
  },
  {
    title: 'Wallet Ledger',
    href: '/wallet',
    icon: Wallet,
  },
  {
    title: 'License Keys',
    href: '/activation',
    icon: KeyRound,
  },
  {
    title: 'Storage Explorer',
    href: '/storage',
    icon: HardDrive,
  },
  {
    title: 'Audit Logs',
    href: '/audit',
    icon: ShieldAlert,
  },
];
