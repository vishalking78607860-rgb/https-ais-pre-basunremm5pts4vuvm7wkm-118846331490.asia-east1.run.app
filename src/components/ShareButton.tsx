import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle } from 'lucide-react';
import { shareWebsiteUrl, getWhatsAppShareUrl } from '../utils/api';
import { playClickBeep } from '../utils/storage';

interface ShareButtonProps {
  variant?: 'compact' | 'header' | 'banner' | 'card';
  lang?: 'hi' | 'en';
  soundEnabled?: boolean;
  websiteUrl?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  variant = 'compact',
  lang = 'hi',
  soundEnabled = true,
  websiteUrl = 'https://sattaking777.gamer.gd/',
}) => {
  const [copied, setCopied] = useState(false);

  const targetShareUrl = websiteUrl || 'https://sattaking777.gamer.gd/';

  const handleShareClick = async () => {
    if (soundEnabled) playClickBeep();
    const result = await shareWebsiteUrl(undefined, targetShareUrl);
    if (result.copied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) playClickBeep();
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(targetShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappShareUrl = getWhatsAppShareUrl(targetShareUrl);

  // Header Variant (Sleek, fits in top bar)
  if (variant === 'header') {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleShareClick}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 active:scale-95 transition-all shadow-sm"
          title="Share Website"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xs:inline">{copied ? (lang === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (lang === 'hi' ? 'वेबसाइट शेयर करें' : 'Share Website')}</span>
        </button>

        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundEnabled && playClickBeep()}
          className="p-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-400 border border-emerald-500/40 transition-colors"
          title="Share on WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-emerald-950" />
        </a>
      </div>
    );
  }

  // Banner Variant (Prominent bar across the screen)
  if (variant === 'banner') {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-neutral-900 via-amber-950/40 to-neutral-900 border border-amber-500/40 p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 animate-pulse">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h4 className="font-chakra font-black text-white text-sm sm:text-base uppercase tracking-wide">
                {lang === 'hi' ? 'ऑफिशियल लाइव वेबसाइट लिंक शेयर करें' : 'OFFICIAL LIVE WEBSITE LINK'}
              </h4>
              <span className="px-2 py-0.5 rounded bg-emerald-500/25 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-black shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>24x7 LIVE</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-400 font-hind">
              {lang === 'hi'
                ? 'सभी सट्टा किंग गेम का सबसे तेज 24 घंटे लाइव रिजल्ट देखने के लिए लिंक शेयर करें'
                : 'Share official fast result website link with your friends and WhatsApp groups'}
            </p>
            {/* Direct URL Display & 1-tap Copy */}
            <div className="mt-1.5 flex items-center gap-1.5 bg-neutral-950/90 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs font-mono text-amber-300 max-w-fit mx-auto sm:mx-0">
              <span className="select-all font-bold truncate max-w-[240px] sm:max-w-md">{targetShareUrl}</span>
              <button
                onClick={handleCopyDirect}
                className="ml-1 text-[10px] uppercase font-sans font-extrabold px-2 py-0.5 rounded bg-amber-500 text-neutral-950 hover:bg-amber-400 transition-colors flex-shrink-0"
                title="Copy URL"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          {/* Direct WhatsApp Share */}
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEnabled && playClickBeep()}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>{lang === 'hi' ? 'व्हाट्सएप शेयर' : 'Share WhatsApp'}</span>
          </a>

          {/* Native Share / Copy */}
          <button
            onClick={handleShareClick}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs uppercase border border-neutral-700 active:scale-95 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">{lang === 'hi' ? 'कॉपी हुआ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>{lang === 'hi' ? 'शेयर करें' : 'Share Link'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Compact Variant (e.g. inside header or cards)
  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        onClick={handleShareClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold border border-neutral-700 active:scale-95 transition-all shadow-sm"
        title="Share link"
      >
        <Share2 className="w-3.5 h-3.5 text-amber-400" />
        <span>{copied ? (lang === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (lang === 'hi' ? 'शेयर' : 'Share')}</span>
      </button>

      <a
        href={whatsappShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => soundEnabled && playClickBeep()}
        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
      </a>
    </div>
  );
};
