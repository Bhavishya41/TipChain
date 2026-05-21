'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  LayoutDashboard,
  Rocket,
  Store,
  Chrome,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthContext';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/marketplace', label: 'Marketplace', icon: Store },
  { href: '/claim', label: 'Claim', icon: ShieldCheck },
  { href: '/launch-token', label: 'Launch', icon: Rocket },
  { href: '/extension', label: 'Extension', icon: Chrome },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-2 border-[#27272A] bg-[#0B0B0C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center border-2 border-[#6D28FF] bg-[#6D28FF] transition-transform group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[2px_2px_0px_0px_#F5F5F5]">
              <Zap className="h-5 w-5 text-white" strokeWidth={3} />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-[#F5F5F5]">
              TIPCHAIN
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-150 ${
                    isActive
                      ? 'text-[#F5F5F5] bg-[#18181B] border-2 border-[#27272A]'
                      : 'text-[#A1A1AA] hover:text-[#F5F5F5] border-2 border-transparent hover:border-[#27272A]'
                  }`}
                >
                  <link.icon className="h-4 w-4" strokeWidth={2.5} />
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6D28FF]"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 bg-[#18181B] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#4ADE80] border-2 border-[#4ADE80]/40 hover:border-[#4ADE80] transition-all"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                @{user?.handle}
              </Link>
            ) : (
              <Link
                href="/claim"
                className="hidden sm:flex items-center gap-2 bg-[#6D28FF] px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white border-2 border-[#6D28FF] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#F5F5F5]"
              >
                Claim Vault
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[#A1A1AA] hover:text-[#F5F5F5] border-2 border-[#27272A]"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t-2 border-[#27272A] bg-[#111113] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider border-2 ${
                      isActive
                        ? 'text-[#F5F5F5] bg-[#18181B] border-[#6D28FF]'
                        : 'text-[#A1A1AA] border-transparent hover:text-[#F5F5F5] hover:border-[#27272A]'
                    }`}
                  >
                    <link.icon className="h-5 w-5" strokeWidth={2.5} />
                    {link.label}
                  </Link>
                );
              })}
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-[#18181B] px-5 py-3 text-sm font-bold uppercase tracking-wider text-[#4ADE80] border-2 border-[#4ADE80]/40"
                >
                  <ShieldCheck className="h-4 w-4" />
                  @{user?.handle}
                </Link>
              ) : (
                <Link
                  href="/claim"
                  onClick={() => setMobileOpen(false)}
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-[#6D28FF] px-5 py-3 text-sm font-bold uppercase tracking-wider text-white border-2 border-[#6D28FF]"
                >
                  Claim Vault
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
