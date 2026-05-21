'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Youtube,
  Wallet,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Copy,
  Zap,
} from 'lucide-react';
import { getClaimAuthUrl, postOAuthCallback, postClaimSign } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthContext';

// ─── Step Types ───────────────────────────────────────────────────────────────
type Step = 'handle' | 'oauth' | 'sign' | 'done';

// ─── Inner Component (uses useSearchParams) ───────────────────────────────────

function ClaimFlow() {
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>('handle');
  const [handle, setHandle] = useState('');
  const [wallet, setWallet] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Result from sign step
  const [signResult, setSignResult] = useState<{
    signature: string;
    message: string;
    signerAddress: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // If already authenticated, skip to wallet sign step
  useEffect(() => {
    if (isAuthenticated && user?.handle) {
      setHandle(user.handle);
      setStep('sign');
    }
  }, [isAuthenticated, user]);

  // Handle OAuth callback redirect — ?code=...&state=...
  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // = handle

    if (!code || !state) return;

    setStep('oauth');
    setLoading(true);
    setError(null);
    setHandle(state);

    postOAuthCallback(code, state)
      .then((res) => {
        login(res.token); // store JWT in localStorage via AuthContext
        setHandle(res.handle);
        setStep('sign');
      })
      .catch((err: Error) => {
        setError(err.message);
        setStep('handle');
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // ─── Step 1: Enter handle → redirect to Google OAuth ───────────────────────
  async function handleStartOAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!handle.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { url } = await getClaimAuthUrl(handle.trim().toLowerCase());
      window.location.href = url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to get auth URL');
      setLoading(false);
    }
  }

  // ─── Step 2: Wallet input → server signs claim message ─────────────────────
  async function handleSign(e: React.FormEvent) {
    e.preventDefault();
    if (!wallet.trim() || !user) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('tipchain_creator_jwt') ?? '';
      const res = await postClaimSign(token, wallet.trim());
      setSignResult({
        signature: res.signature,
        message: res.message,
        signerAddress: res.signerAddress,
      });
      setStep('done');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signing failed');
    } finally {
      setLoading(false);
    }
  }

  function copySignature() {
    if (!signResult) return;
    navigator.clipboard.writeText(signResult.signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-10">
        {(['handle', 'oauth', 'sign', 'done'] as Step[]).map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-1 transition-all duration-500 ${
              ['handle', 'oauth', 'sign', 'done'].indexOf(step) >= i
                ? 'bg-[#6D28FF]'
                : 'bg-[#27272A]'
            }`}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6D28FF] mb-2 block">Creator Verification</span>
        <h1 className="text-3xl font-black tracking-tight text-[#F5F5F5]">CLAIM YOUR VAULT</h1>
        <p className="text-sm text-[#52525B] mt-2">
          Verify your YouTube channel identity and link your wallet to claim your creator vault on Base Sepolia.
        </p>
      </motion.div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 border-2 border-[#F97316]/40 bg-[#F97316]/5 px-4 py-3 mb-6 text-sm text-[#F97316]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Step: Handle Input ─────────────────────────────────────────────── */}
      {step === 'handle' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-[#111113] border-2 border-[#27272A] p-6 mb-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 border-2 border-[#6D28FF] flex items-center justify-center">
                <Youtube className="h-5 w-5 text-[#6D28FF]" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#F5F5F5]">Step 1 — Enter Your Handle</p>
                <p className="text-xs text-[#52525B]">We'll match it against your YouTube channel</p>
              </div>
            </div>

            <form onSubmit={handleStartOAuth} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B] block mb-1.5">
                  Creator Handle
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g. synthwave_sarah"
                  className="w-full bg-[#0B0B0C] border-2 border-[#27272A] px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#52525B] focus:border-[#6D28FF] focus:outline-none transition-colors"
                  required
                />
                <p className="text-[10px] text-[#3F3F46] mt-1">
                  Use the exact handle associated with your creator profile.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !handle.trim()}
                className="w-full flex items-center justify-center gap-2 bg-[#6D28FF] py-3 text-sm font-bold uppercase tracking-wider text-white border-2 border-[#6D28FF] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Youtube className="h-4 w-4" />}
                {loading ? 'Redirecting…' : 'Verify with Google'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>

          {/* Info box */}
          <div className="bg-[#0B0B0C] border-2 border-[#1E1E22] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B] mb-2">What happens next</p>
            <ul className="space-y-2">
              {[
                'You\'ll be redirected to Google OAuth to verify your YouTube channel',
                'We confirm your channel identity server-side — no client-supplied IDs trusted',
                'You receive a JWT, then sign your wallet address to link it to your vault',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#52525B]">
                  <span className="text-[#6D28FF] font-bold mt-0.5">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* ── Step: OAuth In Progress ────────────────────────────────────────── */}
      {step === 'oauth' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#111113] border-2 border-[#27272A] p-10 text-center">
          <Loader2 className="h-10 w-10 text-[#6D28FF] animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-[#F5F5F5]">Verifying your Google identity…</p>
          <p className="text-xs text-[#52525B] mt-2">Exchanging OAuth code and resolving your YouTube channel</p>
        </motion.div>
      )}

      {/* ── Step: Sign Wallet ──────────────────────────────────────────────── */}
      {step === 'sign' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-[#111113] border-2 border-[#27272A] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 border-2 border-[#4ADE80] flex items-center justify-center">
                <Wallet className="h-5 w-5 text-[#4ADE80]" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#F5F5F5]">Step 2 — Link Your Wallet</p>
                <p className="text-xs text-[#52525B]">
                  Verified as{' '}
                  <span className="text-[#6D28FF] font-bold">@{handle}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSign} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B] block mb-1.5">
                  Creator Wallet Address (EVM)
                </label>
                <input
                  type="text"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-[#0B0B0C] border-2 border-[#27272A] px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#52525B] focus:border-[#4ADE80] focus:outline-none transition-colors font-mono"
                  required
                />
                <p className="text-[10px] text-[#3F3F46] mt-1">
                  The vault reserve will be transferred to this address on claim.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !wallet.trim()}
                className="w-full flex items-center justify-center gap-2 bg-[#4ADE80] py-3 text-sm font-bold uppercase tracking-wider text-[#0B0B0C] border-2 border-[#4ADE80] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {loading ? 'Generating Signature…' : 'Get Server Signature'}
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* ── Step: Done ─────────────────────────────────────────────────────── */}
      {step === 'done' && signResult && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-[#111113] border-2 border-[#4ADE80] p-6 mb-5">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle2 className="h-10 w-10 text-[#4ADE80]" />
              <div>
                <p className="text-sm font-extrabold text-[#F5F5F5]">Vault Claim Authorised!</p>
                <p className="text-xs text-[#52525B]">
                  Your server signature is ready. Use it to call{' '}
                  <code className="text-[#6D28FF]">claimVault()</code> on the contract.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Signer address */}
              <div className="bg-[#0B0B0C] border-2 border-[#1E1E22] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B] mb-1">Signed By (Server EOA)</p>
                <p className="text-xs font-mono text-[#A1A1AA] break-all">{signResult.signerAddress}</p>
              </div>

              {/* Message */}
              <div className="bg-[#0B0B0C] border-2 border-[#1E1E22] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B] mb-1">Claim Message</p>
                <p className="text-xs font-mono text-[#A1A1AA] break-all">{signResult.message}</p>
              </div>

              {/* Signature */}
              <div className="bg-[#0B0B0C] border-2 border-[#1E1E22] p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">EIP-191 Signature</p>
                  <button
                    onClick={copySignature}
                    className="flex items-center gap-1 text-[10px] text-[#6D28FF] hover:text-[#7C3AED] transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs font-mono text-[#A1A1AA] break-all line-clamp-3">{signResult.signature}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 flex items-center justify-center gap-2 bg-[#6D28FF] py-3 text-sm font-bold uppercase tracking-wider text-white border-2 border-[#6D28FF] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#F5F5F5]"
            >
              <Zap className="h-4 w-4" />
              Go to Dashboard
            </button>
            <a
              href={`https://sepolia.basescan.org/address/0xc5E4E52b264035746C2189701C8Aa46910f08Ef5`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border-2 border-[#27272A] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-[#6D28FF] transition-all"
            >
              Contract
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Page (Suspense boundary required for useSearchParams) ────────────────────

export default function ClaimPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center gap-2 py-32 text-[#52525B]">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-bold uppercase tracking-wider">Loading…</span>
        </div>
      }
    >
      <ClaimFlow />
    </Suspense>
  );
}
