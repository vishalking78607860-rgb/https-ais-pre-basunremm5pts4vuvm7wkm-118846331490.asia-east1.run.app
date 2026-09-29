import React, { useState } from 'react';
import { Target, Sparkles, Shuffle, CheckCircle, Dices, HelpCircle } from 'lucide-react';
import { LeakGuessing, Game } from '../types';
import { playClickBeep } from '../utils/storage';

interface GuessingForumProps {
  leak: LeakGuessing;
  games: Game[];
  soundEnabled: boolean;
  lang: 'hi' | 'en';
}

export const GuessingForum: React.FC<GuessingForumProps> = ({
  leak,
  games,
  soundEnabled,
  lang,
}) => {
  const [luckyNumber, setLuckyNumber] = useState<string>('77');
  const [selectedGameForLucky, setSelectedGameForLucky] = useState<string>(
    games[0]?.name || 'DISAWAR'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateLucky = () => {
    if (soundEnabled) playClickBeep();
    setIsGenerating(true);

    let count = 0;
    const interval = setInterval(() => {
      const rand = Math.floor(Math.random() * 100)
        .toString()
        .padStart(2, '0');
      setLuckyNumber(rand);
      count++;
      if (count > 12) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 60);
  };

  return (
    <section className="px-3 sm:px-4 max-w-6xl mx-auto my-8 space-y-5">
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 rounded-2xl border border-amber-500/30 p-4 sm:p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Target className="w-3.5 h-3.5 text-red-400" />
              <span>{lang === 'hi' ? 'दैनिक लीक और गैसिंग फोरम' : 'DAILY GUESSING & LEAK FORUM'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-chakra uppercase tracking-wide">
              {lang === 'hi' ? 'आज का सॉलिड लीक नंबर और अनकट हरूफ' : 'TODAY SOLID LEAK JODI & HARUP'}
            </h2>
            <p className="text-xs text-neutral-400 font-hind">
              {leak.announcement} • {lang === 'hi' ? 'अपडेट तारीख:' : 'Updated:'} {leak.updatedAt}
            </p>
          </div>
        </div>

        {/* Leak Jodi Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
          {/* Single Jodi */}
          <div className="rounded-xl bg-gradient-to-b from-amber-500/10 to-neutral-900 border border-amber-500/40 p-4 text-center shadow-lg">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase bg-amber-500 text-neutral-950 tracking-wider">
              {lang === 'hi' ? 'सिंगल जोड़ी' : 'SINGLE JODI'}
            </span>
            <div className="flex items-center justify-center gap-3 my-3">
              {leak.singleJodi.map((num, i) => (
                <div
                  key={i}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-neutral-950 border-2 border-amber-400 flex items-center justify-center font-chakra text-3xl sm:text-4xl font-black text-amber-400 text-glow-gold shadow-md"
                >
                  {num}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-amber-300/80 font-medium">100% Solid Location</p>
          </div>

          {/* Solid Jodi */}
          <div className="rounded-xl bg-gradient-to-b from-emerald-500/10 to-neutral-900 border border-emerald-500/40 p-4 text-center shadow-lg">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase bg-emerald-500 text-neutral-950 tracking-wider">
              {lang === 'hi' ? 'सॉलिड जोड़ी' : 'SOLID JODI'}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5 my-3">
              {leak.solidJodi.map((num, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-xl bg-neutral-950 border border-emerald-500/60 flex items-center justify-center font-chakra text-2xl font-black text-emerald-400 shadow"
                >
                  {num}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-emerald-400/80 font-medium">All Market Pass</p>
          </div>

          {/* Harup Ander / Bahar */}
          <div className="rounded-xl bg-gradient-to-b from-purple-500/10 to-neutral-900 border border-purple-500/40 p-4 text-center shadow-lg">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase bg-purple-500 text-white tracking-wider">
              {lang === 'hi' ? 'अनकट हरूफ (अंदर / बाहर)' : 'UNCUT HARUP'}
            </span>
            <div className="grid grid-cols-2 gap-2 my-3">
              <div className="p-2 rounded-lg bg-neutral-950 border border-purple-500/40">
                <div className="text-[10px] text-neutral-400 font-bold uppercase">अंदर (Ander)</div>
                <div className="font-chakra text-2xl font-black text-purple-300">
                  {leak.harupAnder}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950 border border-purple-500/40">
                <div className="text-[10px] text-neutral-400 font-bold uppercase">बाहर (Bahar)</div>
                <div className="font-chakra text-2xl font-black text-purple-300">
                  {leak.harupBahar}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-purple-300/80 font-medium">Live Uncut Harup</p>
          </div>
        </div>

        {/* Lucky Jodi Generator Tool */}
        <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-950/70 p-4 rounded-xl border border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Dices className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-chakra uppercase">
                {lang === 'hi' ? 'लकी नंबर कैलकुलेटर (LUCKY JODI GENERATOR)' : 'LUCKY JODI GENERATOR'}
              </h3>
              <p className="text-xs text-neutral-400 font-hind">
                {lang === 'hi'
                  ? 'अपना पसंदीदा गेम चुनें और आज का लकी नंबर निकालें'
                  : 'Select your market and roll your lucky 2-digit Jodi'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <select
              value={selectedGameForLucky}
              onChange={(e) => setSelectedGameForLucky(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none"
            >
              {games.map((g) => (
                <option key={g.id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerateLucky}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md"
            >
              <Shuffle className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{lang === 'hi' ? 'निकालें' : 'Roll'}</span>
            </button>

            <div className="w-12 h-10 rounded-lg bg-neutral-900 border-2 border-amber-500 flex items-center justify-center font-chakra text-2xl font-black text-amber-400 text-glow-gold">
              {luckyNumber}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
