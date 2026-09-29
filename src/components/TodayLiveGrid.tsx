import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Flame, CheckCircle, Search, MessageSquare, ChevronRight, Zap } from 'lucide-react';
import { Game, ContactSettings } from '../types';
import { buildWhatsAppUrl, playClickBeep } from '../utils/storage';
import { ShareButton } from './ShareButton';

interface TodayLiveGridProps {
  games: Game[];
  contact: ContactSettings;
  soundEnabled: boolean;
  lang: 'hi' | 'en';
  onQuickResultClick?: (game: Game) => void;
}

export const TodayLiveGrid: React.FC<TodayLiveGridProps> = ({
  games,
  contact,
  soundEnabled,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [nextGame, setNextGame] = useState<Game | null>(null);
  const [countdownStr, setCountdownStr] = useState<string>('00:00:00');

  // Filter active games only
  const activeGames = games
    .filter((g) => g.status === 'active')
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Categories
  const categories = ['all', ...Array.from(new Set(activeGames.map((g) => g.category || 'General')))];

  // Compute Next upcoming game & countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Parse time string e.g. "05:00 AM" or "11:15 PM" to minutes
      const parseTimeToMinutes = (timeStr: string) => {
        const parts = timeStr.trim().split(/[:\s]/);
        if (parts.length >= 3) {
          let hours = parseInt(parts[0], 10);
          const mins = parseInt(parts[1], 10);
          const ampm = parts[2].toUpperCase();
          if (ampm === 'PM' && hours < 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
          return hours * 60 + mins;
        }
        return 0;
      };

      // Find the game whose time is next today, or earliest tomorrow
      let upcoming: Game | null = null;
      let minDiff = Infinity;

      activeGames.forEach((g) => {
        const gameMins = parseTimeToMinutes(g.openTime);
        let diff = gameMins - currentMinutes;
        if (diff < 0) {
          // It's already passed today, scheduled for tomorrow
          diff += 24 * 60;
        }
        if (diff < minDiff && diff > 0) {
          minDiff = diff;
          upcoming = g;
        }
      });

      if (!upcoming && activeGames.length > 0) {
        upcoming = activeGames[0];
      }

      setNextGame(upcoming);

      if (upcoming) {
        const targetMins = parseTimeToMinutes((upcoming as Game).openTime);
        let secondsDiff = (targetMins - currentMinutes) * 60 - now.getSeconds();
        if (secondsDiff < 0) secondsDiff += 24 * 3600;

        const hrs = Math.floor(secondsDiff / 3600);
        const mins = Math.floor((secondsDiff % 3600) / 60);
        const secs = secondsDiff % 60;

        setCountdownStr(
          `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        );
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeGames]);

  // Filtered games
  const filteredGames = activeGames.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.hindiName && g.hindiName.includes(searchQuery));
    const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <section className="px-3 sm:px-4 max-w-6xl mx-auto my-6 space-y-5">
      {/* Live Countdown & Featured Ticker Card */}
      {nextGame && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950 via-neutral-900 to-amber-950 border-2 border-red-500/50 p-4 sm:p-5 shadow-2xl glow-red">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-red-600/30 border border-red-500 flex items-center justify-center animate-bounce">
                <Flame className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-600 text-white tracking-widest animate-pulse">
                    अगला लाइव रिजल्ट
                  </span>
                  <span className="text-neutral-400 text-xs font-semibold">
                    टाइम: {nextGame.openTime}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-300 font-chakra uppercase tracking-wide">
                  {nextGame.name} {nextGame.hindiName ? `(${nextGame.hindiName})` : ''}
                </h3>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-3 bg-neutral-950/80 px-4 py-2.5 rounded-xl border border-amber-500/40 shadow-inner">
              <Clock className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <div>
                <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  रिजल्ट खुलने में समय
                </div>
                <div className="text-2xl sm:text-3xl font-black font-chakra tracking-wider text-amber-400 text-glow-gold">
                  {countdownStr}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-chakra uppercase tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>
              {lang === 'hi' ? 'आज का लाइव रिजल्ट (TODAY LIVE RESULT)' : 'TODAY LIVE RESULTS'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            {lang === 'hi'
              ? 'सभी प्रमुख सट्टा गेम का ताजा लाइव रिजल्ट यहाँ देखें'
              : 'Live real-time result board updated in real-time'}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Search box */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'hi' ? 'गेम खोजें...' : 'Search game...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              if (soundEnabled) playClickBeep();
              setSelectedCategory(e.target.value);
            }}
            className="bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
          >
            <option value="all">{lang === 'hi' ? 'सभी गेम' : 'All Categories'}</option>
            {categories
              .filter((c) => c !== 'all')
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>

          {/* Share Button */}
          <ShareButton
            variant="compact"
            lang={lang}
            soundEnabled={soundEnabled}
            websiteUrl={contact.websiteUrl || 'https://sattaking777.gamer.gd/'}
          />
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {filteredGames.map((game) => {
          const isPending =
            game.todayResult === 'WAIT' ||
            game.todayResult === 'XX' ||
            game.todayResult === '--' ||
            !game.todayResult;

          const gameWhatsAppUrl = buildWhatsAppUrl(
            contact.whatsappNumber,
            `Namaste, mujhe ${game.name} ka game lagana hai. Rate aur booking timing kya hai?`
          );

          return (
            <div
              key={game.id}
              className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-neutral-900 to-neutral-950 border transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] ${
                game.isLiveFlashing
                  ? 'border-amber-400 shadow-lg shadow-amber-500/25 glow-gold'
                  : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {/* Top Banner Tag */}
              <div className="bg-neutral-800/80 px-3 py-1.5 flex items-center justify-between border-b border-neutral-800 text-[11px]">
                <span className="font-semibold text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{game.openTime}</span>
                </span>
                <span className="px-1.5 py-0.2 rounded bg-neutral-700/60 text-amber-300 font-bold uppercase text-[9px] tracking-wider">
                  {game.category || 'King'}
                </span>
              </div>

              {/* Game Title */}
              <div className="p-3 text-center border-b border-neutral-800/60">
                <h3 className="text-xl sm:text-2xl font-black text-white font-chakra uppercase tracking-wide">
                  {game.name}
                </h3>
                {game.hindiName && (
                  <div className="text-xs text-amber-400 font-hind font-semibold -mt-1">
                    {game.hindiName}
                  </div>
                )}
              </div>

              {/* Results Comparison: Yesterday vs Today */}
              <div className="grid grid-cols-2 divide-x divide-neutral-800 p-2.5 bg-neutral-950/60">
                {/* Yesterday */}
                <div className="text-center p-1.5">
                  <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    {lang === 'hi' ? 'कल का रिजल्ट' : 'YESTERDAY'}
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-chakra text-neutral-300 tracking-wider my-0.5">
                    {game.yesterdayResult || '--'}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-medium">Declared</div>
                </div>

                {/* Today */}
                <div className="text-center p-1.5 bg-amber-500/5 rounded-r-lg">
                  <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span>{lang === 'hi' ? 'आज का रिजल्ट' : 'TODAY'}</span>
                  </div>

                  {isPending ? (
                    <div className="my-1.5">
                      <span className="inline-block px-3 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-black font-chakra uppercase tracking-wider animate-pulse">
                        {game.todayResult === 'WAIT' ? 'WAIT...' : 'लोडिंग...'}
                      </span>
                      <div className="text-[10px] text-amber-400/80 font-medium">Live soon</div>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl sm:text-4xl font-black font-chakra text-amber-400 text-glow-gold tracking-wider my-0.5">
                        {game.todayResult}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-0.5">
                        <CheckCircle className="w-2.5 h-2.5" />
                        <span>OPEN</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Card Footer: WhatsApp Booking & Details */}
              <div className="p-2.5 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between gap-1.5 text-xs">
                <a
                  href={gameWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wide transition-colors shadow-sm"
                >
                  <MessageSquare className="w-3 h-3 fill-white" />
                  <span>{lang === 'hi' ? 'व्हाट्सएप लगाएं' : 'Play on WhatsApp'}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGames.length === 0 && (
        <div className="p-8 text-center bg-neutral-900/60 rounded-xl border border-neutral-800 text-neutral-400">
          <p className="font-semibold text-sm">
            {lang === 'hi' ? 'कोई गेम नहीं मिला' : 'No games found matching your search'}
          </p>
        </div>
      )}
    </section>
  );
};
