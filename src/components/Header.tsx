import React, { useState, useEffect } from 'react';
import { Crown, Shield, Volume2, VolumeX, RefreshCw, Lock, Sparkles, PhoneCall, Share2 } from 'lucide-react';
import { playClickBeep } from '../utils/storage';
import { ShareButton } from './ShareButton';
import { LikeButton } from './LikeButton';

interface HeaderProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onRefresh: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  lang: 'hi' | 'en';
  setLang: (l: 'hi' | 'en') => void;
  whatsappNumber: string;
  websiteUrl?: string;
  likesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  isAdminLoggedIn,
  onRefresh,
  soundEnabled,
  setSoundEnabled,
  lang,
  setLang,
  whatsappNumber,
  websiteUrl = 'https://ais-pre-basunremm5pts4vuvm7wkm-118846331490.asia-east1.run.app',
  likesCount = 14850,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshClick = () => {
    setIsRotating(true);
    if (soundEnabled) playClickBeep();
    onRefresh();
    setTimeout(() => setIsRotating(false), 600);
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-amber-500/30 shadow-xl shadow-black/80">
      {/* Top Utility Bar */}
      <div className="bg-gradient-to-r from-red-950 via-amber-950/60 to-red-950 border-b border-amber-500/20 px-3 py-1.5 text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-amber-300 font-bold tracking-wider uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'hi' ? 'लाइव अपडेट जारी है' : 'SUPER FAST LIVE RESULTS'}
            </span>
            <span className="hidden sm:inline-block text-neutral-400">|</span>
            <span className="hidden sm:inline-block font-mono text-neutral-300 font-semibold">
              {timeStr}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Calling quick link */}
            <a
              href={`tel:${whatsappNumber}`}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
            >
              <PhoneCall className="w-3 h-3" />
              <span className="hidden xs:inline">हेल्पलाइन:</span>
              <span>{whatsappNumber}</span>
            </a>

            {/* Language Switcher */}
            <button
              onClick={() => {
                setLang(lang === 'hi' ? 'en' : 'hi');
                if (soundEnabled) playClickBeep();
              }}
              className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium border border-neutral-700"
              title="Change Language"
            >
              {lang === 'hi' ? 'English' : 'हिंदी'}
            </button>

            {/* Sound Mute/Unmute */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs border border-neutral-700 transition-colors"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              aria-label="Sound Toggle"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-700 p-0.5 shadow-lg shadow-amber-500/20 flex-shrink-0">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white font-chakra uppercase leading-none">
                SATTA KING <span className="text-amber-400 text-glow-gold">777</span> FAST
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-600 text-white tracking-wider animate-pulse">
                100% LIVE
              </span>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[11px] sm:text-xs font-bold border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
                title="Official Live Link"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>OFFICIAL LIVE SERVER</span>
              </a>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-400 font-medium mt-0.5">
              {lang === 'hi'
                ? 'दिसावर, गली, फरीदाबाद, गाजियाबाद • 24 घंटे सबसे तेज सुपरफास्ट रिजल्ट'
                : 'Fastest Live Result Portal • Disawar, Gali, Faridabad, Ghaziabad'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Like Website Counter & Button */}
          <LikeButton variant="compact" likesCount={likesCount} soundEnabled={soundEnabled} lang={lang} />

          {/* Share Website Button */}
          <ShareButton variant="header" lang={lang} soundEnabled={soundEnabled} websiteUrl={websiteUrl} />

          {/* Refresh Button */}
          <button
            onClick={handleRefreshClick}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs sm:text-sm font-semibold border border-neutral-700 active:scale-95 transition-all shadow-md"
            title="Refresh Results"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 ${isRotating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{lang === 'hi' ? 'रिफ्रेश' : 'Refresh'}</span>
          </button>

          {/* Admin Control Panel Button */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95 ${
              isAdminLoggedIn
                ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-emerald-500/25 border border-emerald-400'
                : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-neutral-950 shadow-amber-500/30 hover:brightness-110 font-extrabold'
            }`}
          >
            {isAdminLoggedIn ? (
              <Shield className="w-4 h-4 text-white" />
            ) : (
              <Lock className="w-4 h-4 text-neutral-950" />
            )}
            <span>
              {isAdminLoggedIn
                ? lang === 'hi'
                  ? 'कंट्रोल पैनल (लॉगिन)'
                  : 'Control Panel'
                : lang === 'hi'
                ? 'कंट्रोल पैनल'
                : 'Admin Panel'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
