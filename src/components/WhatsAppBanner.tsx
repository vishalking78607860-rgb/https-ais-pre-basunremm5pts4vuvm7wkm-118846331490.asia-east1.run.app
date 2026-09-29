import React, { useState } from 'react';
import { MessageCircle, PhoneCall, Copy, Check, ShieldCheck, Zap, Award } from 'lucide-react';
import { ContactSettings } from '../types';
import { buildWhatsAppUrl, playClickBeep } from '../utils/storage';

interface WhatsAppBannerProps {
  contact: ContactSettings;
  soundEnabled: boolean;
  lang: 'hi' | 'en';
}

export const WhatsAppBanner: React.FC<WhatsAppBannerProps> = ({
  contact,
  soundEnabled,
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyNumber = () => {
    if (soundEnabled) playClickBeep();
    navigator.clipboard.writeText(contact.whatsappNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = buildWhatsAppUrl(
    contact.whatsappNumber,
    contact.whatsappCustomMessage
  );

  return (
    <section className="my-4 px-3 sm:px-4 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 border-2 border-amber-500/40 p-4 sm:p-5 shadow-2xl shadow-amber-950/30">
        {/* Glow ambient background effects */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Khaiwal Branding & Trust Badges */}
          <div className="text-center md:text-left space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'hi' ? '100% वेरिफाइड एवं सुरक्षित खाईवाल' : '100% VERIFIED & TRUSTED KHAIWAL'}</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-chakra uppercase tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Award className="w-6 h-6 text-amber-400 hidden sm:inline-block" />
              <span>{contact.whatsappName}</span>
            </h2>

            <p className="text-xs sm:text-sm text-amber-200/90 font-hind font-medium">
              {contact.noticeContent}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-[11px] text-neutral-300">
              <a
                href={contact.websiteUrl || 'https://ais-pre-basunremm5pts4vuvm7wkm-118846331490.asia-east1.run.app'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
              >
                <span>🌐</span>
                <span>24x7 Live Portal</span>
              </a>
              <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-semibold text-emerald-400 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {lang === 'hi' ? '5 मिनट में पेमेंट' : '5 Min Payment'}
              </span>
              <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">
                PhonePe • Google Pay • Paytm • UPI
              </span>
              <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-amber-400">
                24x7 No Limit
              </span>
            </div>
          </div>

          {/* Right: Big WhatsApp & Direct Call Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto flex-shrink-0">
            {/* WhatsApp Big CTA Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-base sm:text-lg tracking-wide uppercase shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-95 transition-all border border-emerald-400 glow-green group"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-100 leading-tight">
                  {lang === 'hi' ? 'ऑनलाइन गेम खेलें' : 'Chat & Booking'}
                </div>
                <div className="font-chakra font-bold text-lg leading-tight">
                  WhatsApp: {contact.whatsappNumber}
                </div>
              </div>
            </a>

            {/* Quick Actions (Call & Copy) */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Call Now */}
              <a
                href={`tel:${contact.callingNumber || contact.whatsappNumber}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm border border-neutral-700 active:scale-95 transition-all shadow-md"
                title="Direct Call"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'hi' ? 'कॉल करें' : 'Call'}</span>
              </a>

              {/* Copy Number */}
              <button
                onClick={handleCopyNumber}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-semibold text-xs border border-neutral-700 active:scale-95 transition-all"
                title="Copy Number"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">{lang === 'hi' ? 'कॉपी हुआ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-neutral-400" />
                    <span>{lang === 'hi' ? 'कॉपी' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
