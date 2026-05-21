'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Coins,
  Upload,
  Globe,
  Eye,
  ArrowRight,
  ArrowLeft,
  Check,
  ImageIcon,
  Twitter,
  Youtube,
  Link2,
} from 'lucide-react';
import type { CreatorCategory } from '@/lib/types';

const steps = [
  { id: 1, label: 'Creator', icon: User },
  { id: 2, label: 'Token', icon: Coins },
  { id: 3, label: 'Media', icon: Upload },
  { id: 4, label: 'Socials', icon: Globe },
  { id: 5, label: 'Preview', icon: Eye },
];

const categories: { value: CreatorCategory; label: string }[] = [
  { value: 'music', label: 'Music' },
  { value: 'art', label: 'Art' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'tech', label: 'Tech' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'education', label: 'Education' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'other', label: 'Other' },
];

export default function LaunchTokenPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    creatorName: '',
    tokenName: '',
    tokenSymbol: '',
    description: '',
    totalSupply: 10000000,
    initialPrice: 0.01,
    category: 'music' as CreatorCategory,
    twitter: '',
    youtube: '',
    website: '',
  });

  const updateForm = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F5F5F5]">
          LAUNCH TOKEN
        </h1>
        <p className="text-sm text-[#52525B] mt-1">
          Create your creator token in 5 simple steps
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Step Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#111113] border-2 border-[#27272A] p-5 sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#A1A1AA] mb-4">
              Steps
            </h3>
            <div className="space-y-1">
              {steps.map((step) => {
                const isActive = step.id === currentStep;
                const isComplete = step.id < currentStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-2 ${
                      isActive
                        ? 'border-[#6D28FF] bg-[#6D28FF]/5 text-[#F5F5F5]'
                        : isComplete
                        ? 'border-transparent text-[#4ADE80]'
                        : 'border-transparent text-[#52525B] hover:text-[#A1A1AA]'
                    }`}
                  >
                    <div
                      className={`h-7 w-7 flex items-center justify-center border-2 shrink-0 ${
                        isActive
                          ? 'border-[#6D28FF] text-[#6D28FF]'
                          : isComplete
                          ? 'border-[#4ADE80] bg-[#4ADE80] text-[#0B0B0C]'
                          : 'border-[#27272A] text-[#52525B]'
                      }`}
                    >
                      {isComplete ? (
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      ) : (
                        <span className="text-[10px] font-black">{step.id}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#111113] border-2 border-[#27272A]"
            >
              {/* Step 1: Creator Setup */}
              {currentStep === 1 && (
                <div>
                  <div className="px-6 py-5 border-b-2 border-[#27272A]">
                    <h2 className="text-lg font-extrabold text-[#F5F5F5]">Creator Setup</h2>
                    <p className="text-xs text-[#52525B] mt-1">
                      Tell us about yourself
                    </p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA] block mb-2">
                        Creator Name
                      </label>
                      <input
                        type="text"
                        value={form.creatorName}
                        onChange={(e) => updateForm('creatorName', e.target.value)}
                        placeholder="Your display name"
                        className="w-full bg-[#0B0B0C] border-2 border-[#27272A] px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#52525B] focus:border-[#6D28FF] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA] block mb-2">
                        Category
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.value}
                            onClick={() => updateForm('category', cat.value)}
                            className={`py-2.5 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                              form.category === cat.value
                                ? 'border-[#6D28FF] text-[#6D28FF] bg-[#6D28FF]/5'
                                : 'border-[#27272A] text-[#52525B] hover:border-[#6D28FF] hover:text-[#A1A1AA]'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA] block mb-2">
                        Bio
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => updateForm('description', e.target.value)}
                        placeholder="Tell your supporters about yourself..."
                        rows={4}
                        className="w-full bg-[#0B0B0C] border-2 border-[#27272A] px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#52525B] focus:border-[#6D28FF] focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Token Details */}
              {currentStep === 2 && (
                <div>
                  <div className="px-6 py-5 border-b-2 border-[#27272A]">
                    <h2 className="text-lg font-extrabold text-[#F5F5F5]">Token Details</h2>
                    <p className="text-xs text-[#52525B] mt-1">
                      Configure your ERC20 token
                    </p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA] block mb-2">
                          Token Name
                        </label>
                        <input
                          type="text"
                          value={form.tokenName}
                          onChange={(e) => updateForm('tokenName', e.target.value)}
                          placeholder="e.g. SarahCoin"
                          className="w-full bg-[#0B0B0C] border-2 border-[#27272A] px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#52525B] focus:border-[#6D28FF] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA] block mb-2">
                          Token Symbol
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#52525B] font-bold">$</span>
                          <input
                            type="text"
                            value={form.tokenSymbol}
                            onChange={(e) => updateForm('tokenSymbol', e.target.value.toUpperCase())}
                            placeholder="SARAH"
                            maxLength={6}
                            className="w-full bg-[#0B0B0C] border-2 border-[#27272A] pl-8 pr-4 py-3 text-sm text-[#F5F5F5] placeholder-[#52525B] focus:border-[#6D28FF] focus:outline-none transition-colors uppercase"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA] block mb-2">
                          Total Supply
                        </label>
                        <input
                          type="number"
                          value={form.totalSupply}
                          onChange={(e) => updateForm('totalSupply', Number(e.target.value))}
                          className="w-full bg-[#0B0B0C] border-2 border-[#27272A] px-4 py-3 text-sm text-[#F5F5F5] focus:border-[#6D28FF] focus:outline-none transition-colors tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA] block mb-2">
                          Initial Price (USD)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#52525B] font-bold">$</span>
                          <input
                            type="number"
                            step="0.001"
                            value={form.initialPrice}
                            onChange={(e) => updateForm('initialPrice', Number(e.target.value))}
                            className="w-full bg-[#0B0B0C] border-2 border-[#27272A] pl-8 pr-4 py-3 text-sm text-[#F5F5F5] focus:border-[#6D28FF] focus:outline-none transition-colors tabular-nums"
                          />
                        </div>
                      </div>
                    </div>
                    {/* TODO: Connect smart contract deployment */}
                    {/* TODO: Integrate UGF SDK for gas abstraction */}
                    <div className="bg-[#0B0B0C] border-2 border-[#27272A] p-4">
                      <p className="text-xs text-[#52525B]">
                        <span className="text-[#F97316] font-bold">Note:</span> Token will be deployed as an ERC20 contract on Base. Gas fees are abstracted via UGF SDK.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Media Upload */}
              {currentStep === 3 && (
                <div>
                  <div className="px-6 py-5 border-b-2 border-[#27272A]">
                    <h2 className="text-lg font-extrabold text-[#F5F5F5]">Media & Assets</h2>
                    <p className="text-xs text-[#52525B] mt-1">
                      Upload your avatar and banner
                    </p>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* TODO: Implement file upload with preview */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA] block mb-2">
                        Avatar
                      </label>
                      <div className="flex items-center gap-5">
                        <div className="h-24 w-24 border-2 border-dashed border-[#27272A] bg-[#0B0B0C] flex items-center justify-center hover:border-[#6D28FF] transition-colors cursor-pointer">
                          <ImageIcon className="h-8 w-8 text-[#27272A]" />
                        </div>
                        <div>
                          <p className="text-sm text-[#A1A1AA]">
                            Click to upload or drag & drop
                          </p>
                          <p className="text-xs text-[#52525B] mt-1">
                            PNG, JPG, or WebP. Max 2MB. Square.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA] block mb-2">
                        Banner
                      </label>
                      <div className="h-40 border-2 border-dashed border-[#27272A] bg-[#0B0B0C] flex flex-col items-center justify-center hover:border-[#6D28FF] transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 text-[#27272A] mb-2" />
                        <p className="text-sm text-[#52525B]">Upload banner image</p>
                        <p className="text-xs text-[#3F3F46] mt-1">
                          Recommended: 1500×500px
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Socials */}
              {currentStep === 4 && (
                <div>
                  <div className="px-6 py-5 border-b-2 border-[#27272A]">
                    <h2 className="text-lg font-extrabold text-[#F5F5F5]">Social Links</h2>
                    <p className="text-xs text-[#52525B] mt-1">
                      Connect your social profiles
                    </p>
                  </div>
                  <div className="p-6 space-y-5">
                    {[
                      { icon: Twitter, field: 'twitter', placeholder: '@yourusername', label: 'Twitter / X' },
                      { icon: Youtube, field: 'youtube', placeholder: 'Channel name', label: 'YouTube' },
                      { icon: Link2, field: 'website', placeholder: 'https://yoursite.com', label: 'Website' },
                    ].map((social) => (
                      <div key={social.field}>
                        <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA] block mb-2">
                          {social.label}
                        </label>
                        <div className="flex items-center gap-0">
                          <div className="h-[46px] w-12 border-2 border-r-0 border-[#27272A] bg-[#18181B] flex items-center justify-center shrink-0">
                            <social.icon className="h-4 w-4 text-[#52525B]" />
                          </div>
                          <input
                            type="text"
                            value={form[social.field as keyof typeof form] as string}
                            onChange={(e) => updateForm(social.field, e.target.value)}
                            placeholder={social.placeholder}
                            className="w-full bg-[#0B0B0C] border-2 border-[#27272A] px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#52525B] focus:border-[#6D28FF] focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Preview */}
              {currentStep === 5 && (
                <div>
                  <div className="px-6 py-5 border-b-2 border-[#27272A]">
                    <h2 className="text-lg font-extrabold text-[#F5F5F5]">Preview & Launch</h2>
                    <p className="text-xs text-[#52525B] mt-1">
                      Review your token before deployment
                    </p>
                  </div>
                  <div className="p-6">
                    {/* Preview Card */}
                    <div className="border-2 border-[#27272A] bg-[#0B0B0C] p-6 mb-6">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="h-16 w-16 border-2 border-[#27272A] bg-[#18181B] flex items-center justify-center text-xl font-black text-[#6D28FF] shrink-0">
                          {form.creatorName.charAt(0) || '?'}
                        </div>
                        <div>
                          <h3 className="text-lg font-extrabold text-[#F5F5F5]">
                            {form.creatorName || 'Creator Name'}
                          </h3>
                          <p className="text-xs text-[#52525B] uppercase tracking-wider">
                            {form.category}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pb-6 border-b-2 border-[#1E1E22]">
                        {[
                          { label: 'Token', value: form.tokenName || '—' },
                          { label: 'Symbol', value: form.tokenSymbol ? `$${form.tokenSymbol}` : '—' },
                          { label: 'Supply', value: form.totalSupply.toLocaleString() },
                          { label: 'Price', value: `$${form.initialPrice}` },
                        ].map((item) => (
                          <div key={item.label}>
                            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525B]">
                              {item.label}
                            </span>
                            <p className="text-sm font-bold text-[#F5F5F5] tabular-nums mt-0.5">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {form.description && (
                        <p className="text-sm text-[#A1A1AA] leading-relaxed mb-4">
                          {form.description}
                        </p>
                      )}

                      <div className="flex gap-3">
                        {form.twitter && (
                          <span className="text-xs text-[#52525B]">{form.twitter}</span>
                        )}
                        {form.youtube && (
                          <span className="text-xs text-[#52525B]">{form.youtube}</span>
                        )}
                        {form.website && (
                          <span className="text-xs text-[#52525B]">{form.website}</span>
                        )}
                      </div>
                    </div>

                    {/* TODO: Connect smart contract deployment */}
                    {/* TODO: Integrate UGF SDK */}
                    {/* TODO: Backend endpoint for creator registration */}
                    <div className="bg-[#0B0B0C] border-2 border-[#F97316]/30 p-4 mb-6">
                      <p className="text-xs text-[#F97316]">
                        <span className="font-bold">⚠ Integration Required:</span> Token deployment requires smart contract connection and UGF SDK integration.
                      </p>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 bg-[#6D28FF] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white border-2 border-[#6D28FF] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#F5F5F5]">
                      Deploy Token
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between px-6 py-4 border-t-2 border-[#27272A]">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                    currentStep === 1
                      ? 'border-[#1E1E22] text-[#3F3F46] cursor-not-allowed'
                      : 'border-[#27272A] text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-[#6D28FF]'
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
                {currentStep < 5 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-[#6D28FF] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white border-2 border-[#6D28FF] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#F5F5F5]"
                  >
                    Continue
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
