'use client';

import { motion } from 'framer-motion';
import {
  Chrome,
  Zap,
  BadgeCheck,
  ArrowRight,
  Shield,
  Globe,
  Wallet,
  Coins,
  ExternalLink,
  Twitter,
  Smartphone,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'ONE-CLICK TIPPING',
    description: 'Tip creators directly from their Twitter/X posts. No need to leave the platform.',
  },
  {
    icon: Coins,
    title: 'QUICK BUY',
    description: 'Buy creator tokens instantly from the extension popup. Real-time prices.',
  },
  {
    icon: Shield,
    title: 'GAS ABSTRACTED',
    description: 'UGF SDK handles all gas fees. You only pay the tip amount. Zero friction.',
  },
  {
    icon: Wallet,
    title: 'NON-CUSTODIAL',
    description: 'Your wallet, your keys. The extension never has access to your private keys.',
  },
  {
    icon: Globe,
    title: 'CROSS-PLATFORM',
    description: 'Works on Twitter/X, YouTube, and more platforms coming soon.',
  },
  {
    icon: Smartphone,
    title: 'MOBILE READY',
    description: 'Mobile browser extension support for on-the-go tipping.',
  },
];

export default function ExtensionPage() {
  return (
    <div>
      {/* ============== Hero ============== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 border-2 border-[#6D28FF] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6D28FF] mb-6">
            <Chrome className="h-3.5 w-3.5" strokeWidth={3} />
            Browser Extension
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[0.9] tracking-tighter text-[#F5F5F5] mb-6">
            TIP CREATORS
            <br />
            <span className="text-[#6D28FF]">DIRECTLY FROM YOUR</span>
            <br />
            SOCIAL FEED
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-lg mb-8">
            The TipChain extension integrates directly into Twitter/X. Tip creators or swap tokens instantly with zero gas-fee friction.
          </p>
          <div className="flex flex-wrap gap-4">
            {/* TODO: Link to Chrome Web Store */}
            <button className="flex items-center gap-2 bg-[#6D28FF] px-7 py-4 text-sm font-bold uppercase tracking-wider text-white border-2 border-[#6D28FF] transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px_#F5F5F5]">
              <Chrome className="h-4 w-4" />
              Install Extension
            </button>
            <button className="flex items-center gap-2 border-2 border-[#27272A] px-7 py-4 text-sm font-bold uppercase tracking-wider text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-[#F5F5F5] transition-all">
              Watch Demo
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ============== Mockup Showcase ============== */}
      <section className="border-t-2 border-[#27272A] bg-[#111113]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6D28FF] mb-2 block">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F5F5]">
              SEAMLESS INTEGRATION
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mockup 1: Twitter Tipping Popup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <div className="bg-[#0B0B0C] border-2 border-[#27272A] p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B] mb-4">
                  Twitter/X Tipping Popup
                </div>

                {/* Tweet mock */}
                <div className="border-2 border-[#1E1E22] p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 bg-[#18181B] border-2 border-[#27272A] flex items-center justify-center text-xs font-black text-[#6D28FF] shrink-0">
                      P
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs font-bold text-[#F5F5F5]">Priya Sharma</span>
                        <BadgeCheck className="h-3 w-3 text-[#6D28FF]" />
                      </div>
                      <p className="text-xs text-[#A1A1AA] leading-relaxed">
                        New Solidity tutorial is live! Learn how to build a decentralized marketplace from scratch 🛠️
                      </p>
                    </div>
                  </div>
                </div>

                {/* Extension popup */}
                <div className="border-2 border-[#6D28FF] bg-[#111113] p-4 shadow-[4px_4px_0px_0px_#6D28FF]">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b-2 border-[#1E1E22]">
                    <Zap className="h-3.5 w-3.5 text-[#6D28FF]" strokeWidth={3} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5F5F5]">
                      TipChain
                    </span>
                    <span className="ml-auto text-[10px] text-[#52525B]">v1.2.0</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-[#A1A1AA]">Tip @codequeen</span>
                    <span className="text-xs font-bold text-[#F5F5F5]">$CODE</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 mb-3">
                    {['$1', '$5', '$10', '$25'].map((amt) => (
                      <button
                        key={amt}
                        className={`py-1.5 text-[10px] font-bold border-2 ${amt === '$10'
                            ? 'border-[#4ADE80] text-[#4ADE80] bg-[#4ADE80]/5'
                            : 'border-[#27272A] text-[#52525B]'
                          }`}
                      >
                        {amt}
                      </button>
                    ))}
                  </div>
                  <button className="w-full py-2 bg-[#4ADE80] text-[10px] font-bold uppercase tracking-wider text-[#0B0B0C] border-2 border-[#4ADE80]">
                    Send $10 Tip
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Mockup 2: Token Quick Buy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-[#0B0B0C] border-2 border-[#27272A] p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B] mb-4">
                  Quick Buy Popup
                </div>

                <div className="border-2 border-[#6D28FF] bg-[#111113] p-4 shadow-[4px_4px_0px_0px_#6D28FF]">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#1E1E22]">
                    <Zap className="h-3.5 w-3.5 text-[#6D28FF]" strokeWidth={3} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5F5F5]">
                      Quick Buy
                    </span>
                  </div>

                  {/* Token info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 border-2 border-[#27272A] bg-[#18181B] flex items-center justify-center text-sm font-black text-[#6D28FF]">
                      N
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#F5F5F5]">NovaCoin</p>
                      <p className="text-[10px] text-[#52525B]">$NOVA</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm font-black text-[#F5F5F5] tabular-nums">$0.1678</p>
                      <p className="text-[10px] font-bold text-[#4ADE80] tabular-nums">+7.4%</p>
                    </div>
                  </div>

                  {/* Simple sparkline placeholder */}
                  <div className="h-12 border-2 border-[#1E1E22] mb-4 flex items-end px-1 py-1 gap-[2px]">
                    {[30, 45, 35, 52, 48, 60, 55, 65, 58, 72, 68, 75, 70, 80, 78].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-[#6D28FF]/30 border-t border-[#6D28FF]"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#52525B]">Amount</span>
                      <span className="text-[#F5F5F5] font-bold">$50.00</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#52525B]">You receive</span>
                      <span className="text-[#F5F5F5] font-bold">~298 $NOVA</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#52525B]">Gas fee</span>
                      <span className="text-[#4ADE80] font-bold">Covered ✓</span>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-[#6D28FF] text-[10px] font-bold uppercase tracking-wider text-white border-2 border-[#6D28FF]">
                    Buy $NOVA
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Mockup 3: Extension Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-[#0B0B0C] border-2 border-[#27272A] p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B] mb-4">
                  Extension Overlay
                </div>

                {/* Browser extension icon area */}
                <div className="border-2 border-[#1E1E22] p-4 mb-4">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#1E1E22]">
                    <div className="flex gap-1">
                      <div className="h-2.5 w-2.5 bg-[#F97316]" />
                      <div className="h-2.5 w-2.5 bg-[#4ADE80]" />
                      <div className="h-2.5 w-2.5 bg-[#6D28FF]" />
                    </div>
                    <div className="flex-1 bg-[#18181B] border border-[#27272A] px-2 py-1 text-[9px] text-[#52525B] font-mono">
                      x.com/home
                    </div>
                    <div className="flex gap-1.5">
                      <div className="h-5 w-5 bg-[#6D28FF] flex items-center justify-center">
                        <Zap className="h-3 w-3 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  </div>

                  {/* Overlay badges on tweets */}
                  {[
                    { name: 'Sarah Chen', token: '$SARAH', tipBtn: true },
                    { name: 'Mike Torres', token: '$PIXEL', tipBtn: true },
                    { name: 'Random User', token: null, tipBtn: false },
                  ].map((tweet, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 py-2.5 border-b border-[#1E1E22] last:border-b-0"
                    >
                      <div className="h-6 w-6 bg-[#18181B] border border-[#27272A] flex items-center justify-center text-[8px] font-black text-[#6D28FF]">
                        {tweet.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-[#F5F5F5]">{tweet.name}</span>
                      </div>
                      {tweet.token && (
                        <span className="text-[8px] font-bold text-[#6D28FF] border border-[#6D28FF]/30 px-1.5 py-0.5">
                          {tweet.token}
                        </span>
                      )}
                      {tweet.tipBtn && (
                        <button className="text-[8px] font-bold text-[#4ADE80] border border-[#4ADE80]/30 px-1.5 py-0.5 bg-[#4ADE80]/5">
                          ⚡ TIP
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-[#52525B] leading-relaxed">
                  The extension automatically detects TipChain creators in your feed and adds tipping buttons directly to their posts.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============== Features Grid ============== */}
      <section className="border-t-2 border-[#27272A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6D28FF] mb-2 block">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F5F5]">
              BUILT FOR SPEED
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#111113] border-2 border-[#27272A] p-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#6D28FF]"
              >
                <div className="h-10 w-10 border-2 border-[#6D28FF] flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-[#6D28FF]" />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#F5F5F5] mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section className="border-t-2 border-[#27272A] bg-[#111113]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-[#F5F5F5] mb-4">
              GET THE EXTENSION
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-md mx-auto mb-8">
              Available for Chrome. Firefox and Brave support coming soon.
            </p>
            <button className="inline-flex items-center gap-2 bg-[#6D28FF] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white border-2 border-[#6D28FF] transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px_#F5F5F5]">
              <Chrome className="h-4 w-4" />
              Install for Chrome
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
