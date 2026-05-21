import Link from 'next/link';
import { Zap, Github, Twitter } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Launch Token', href: '/launch-token' },
    { label: 'Extension', href: '/extension' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'SDK', href: '#' },
    { label: 'Status', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t-2 border-[#27272A] bg-[#0B0B0C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center bg-[#6D28FF] border-2 border-[#6D28FF]">
                <Zap className="h-4 w-4 text-white" strokeWidth={3} />
              </div>
              <span className="text-base font-extrabold tracking-tight text-[#F5F5F5]">
                TIPCHAIN
              </span>
            </div>
            <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6 max-w-[240px]">
              The creator economy protocol. Launch tokens. Get tipped. Build your community on-chain.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center border-2 border-[#27272A] text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-[#6D28FF] transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center border-2 border-[#27272A] text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-[#6D28FF] transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA] mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#71717A] hover:text-[#F5F5F5] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t-2 border-[#1E1E22] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#52525B]">
            &copy; {new Date().getFullYear()} TipChain. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-[#52525B] hover:text-[#A1A1AA] transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-xs text-[#52525B] hover:text-[#A1A1AA] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
