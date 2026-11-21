'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './nav-items';
import { Menu, X, Layers } from 'lucide-react';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const primaryMobileNav = navItems.slice(0, 4);

  return (
    <>
      {/* Top Mobile Bar */}
      <div className="md:hidden flex items-center justify-between h-14 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 fixed top-0 inset-x-0 z-40">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-600 rounded-md text-white">
            <Layers className="h-4 w-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm">Data Manager</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Slide-out Full Sheet Drawer for Mobile */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-900 pt-16 px-4 pb-20 overflow-y-auto">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Navigation Menu</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Sticky Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-1">
        {primaryMobileNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] leading-none">{item.title}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col items-center justify-center py-1 px-3 text-xs text-slate-500 dark:text-slate-400"
        >
          <Menu className="h-5 w-5 mb-0.5" />
          <span className="text-[10px] leading-none">More</span>
        </button>
      </nav>
    </>
  );
}
