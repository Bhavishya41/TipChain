import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Outfit } from 'next/font/google';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import LenisProvider from '@/components/providers/lenis-provider';
import { AuthProvider } from '@/components/providers/AuthContext';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TipChain — Creator Economy Protocol',
  description:
    'Launch your creator token. Get tipped by fans. Build your community on-chain. TipChain is the protocol for the creator economy.',
  keywords: ['creator economy', 'crypto', 'tipping', 'ERC20', 'tokens', 'web3'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0B0C] text-[#F5F5F5]">
        <AuthProvider>
          <LenisProvider>
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
