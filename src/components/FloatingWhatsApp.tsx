import React, { useState } from 'react';
import { MessageCircle, PhoneCall, RefreshCw, Lock, Sparkles, Share2, Check } from 'lucide-react';
import { ContactSettings } from '../types';
import { buildWhatsAppUrl, playClickBeep } from '../utils/storage';
import { shareWebsiteUrl } from '../utils/api';

interface FloatingWhatsAppProps {
  contact: ContactSettings;
  onRefresh: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  soundEnabled: boolean;
  lang: 'hi' | 'en';
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  contact,
  onRefresh,
  onOpenAdmin,
  isAdminLoggedIn,
  soundEnabled,
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  const whatsappUrl = buildWhatsAppUrl(
    contact.whatsappNumber,
    contact.whatsappCustomMessage
  );

  const handleShareClick = async () => {
    if (soundEnabled) playClickBeep();
    const targetUrl = contact.websiteUrl || 'https://sattaking777.gamer.gd/';
    const result = await shareWebsiteUrl(undefined, targetUrl);
    if (result.copied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      {/* Floating Action Cluster for Desktop/Tablet */}
      <aside aria-label="Floating actions" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5">
        {/* Share Button Bubble on Desktop */}
        <button
          onClick={handleShareClick}
          className="group flex items-center gap-2 bg-neutral-900/90 hover:bg-neutral-800 text-amber-300 px-3.5 py-2 rounded-full shadow-lg border border-amber-500/40 text-xs font-bold transition-all hover:scale-105 active:scale-95"
          title="Share Website"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />}
          <span>{copied ? (lang === 'hi' ? 'लिंक कॉपी हुआ!' : 'Copied!') : (lang === 'hi' ? 'शेयर करें' : 'Share')}</span>
        </button>

        {/* WhatsApp Floating Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (soundEnabled) playClickBeep();
          }}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-emerald-500/40 border-2 border-emerald-300 hover:scale-105 active:scale-95 transition-all glow-green"
          title="Direct WhatsApp Chat"
        >
          {/* Pulsing halo */}
          <span className="animate-ping absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 opacity-75" />

          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
          </div>

          <div className="hidden sm:block text-left">
            <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-100 leading-none">
              {lang === 'hi' ? 'सीधा संपर्क' : 'Online Booking'}
            </div>
            <div className="font-chakra font-black text-sm tracking-wide leading-tight">
              WhatsApp Chat
            </div>
          </div>
        </a>
      </aside>

      {/* Mobile Bottom Fixed Navigation / Quick Action Bar */}
      <nav aria-label="Quick mobile actions" className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-amber-500/30 px-2 py-2 flex items-center justify-around gap-1.5 shadow-2xl">
        {/* WhatsApp Mobile */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-colors"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>व्हाट्सएप</span>
        </a>

        {/* Share Mobile */}
        <button
          onClick={handleShareClick}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[10px] border border-amber-500/40 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
          <span>{copied ? 'कॉपी हुआ' : 'शेयर करें'}</span>
        </button>

        {/* Call Mobile */}
        <a
          href={`tel:${contact.callingNumber || contact.whatsappNumber}`}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-[10px] border border-neutral-700 transition-colors"
        >
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          <span>कॉल</span>
        </a>

        {/* Refresh Mobile */}
        <button
          onClick={() => {
            if (soundEnabled) playClickBeep();
            onRefresh();
          }}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-[10px] border border-neutral-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-amber-400" />
          <span>रिफ्रेश</span>
        </button>

        {/* Admin Mobile */}
        <button
          onClick={() => {
            if (soundEnabled) playClickBeep();
            onOpenAdmin();
          }}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-black text-[10px] transition-colors"
        >
          <Lock className="w-4 h-4" />
          <span>कंट्रोल</span>
        </button>
      </nav>
    </>
  );
};
