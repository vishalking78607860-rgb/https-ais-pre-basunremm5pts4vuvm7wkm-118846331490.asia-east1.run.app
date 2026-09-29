import React, { useState } from 'react';
import { Calendar, Search, Download, Printer, Filter } from 'lucide-react';
import { Game, ChartMonthData } from '../types';
import { playClickBeep } from '../utils/storage';

interface MonthlyChartProps {
  games: Game[];
  chartData: ChartMonthData[];
  soundEnabled: boolean;
  lang: 'hi' | 'en';
}

const MONTH_NAMES_HI = [
  'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MonthlyChart: React.FC<MonthlyChartProps> = ({
  games,
  chartData,
  soundEnabled,
  lang,
}) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [highlightNumber, setHighlightNumber] = useState<string>('');

  // Active games for chart columns
  const activeGames = games
    .filter((g) => g.status === 'active')
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Find records for selected month & year
  const monthData = chartData.find(
    (c) => c.month === selectedMonth && c.year === selectedYear
  ) || {
    month: selectedMonth,
    year: selectedYear,
    records: {},
  };

  // Days in selected month
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isCurrentMonthView =
    selectedMonth === currentDate.getMonth() + 1 &&
    selectedYear === currentDate.getFullYear();

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="px-3 sm:px-4 max-w-6xl mx-auto my-8">
      <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-4 sm:p-5 shadow-2xl space-y-4">
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {lang === 'hi'
                  ? `${MONTH_NAMES_HI[selectedMonth - 1]} ${selectedYear} का रिकॉर्ड चार्ट`
                  : `${MONTH_NAMES_EN[selectedMonth - 1]} ${selectedYear} Record Chart`}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-chakra uppercase tracking-wide">
              {lang === 'hi' ? 'मंथली जोड़ी रिकॉर्ड चार्ट (MONTHLY CHART)' : 'MONTHLY RECORD JODI CHART'}
            </h2>
            <p className="text-xs text-neutral-400">
              {lang === 'hi'
                ? 'सभी प्रमुख गेम का तारीख-वाइज (1 से 31) पक्का रिजल्ट चार्ट'
                : 'Date-wise full monthly Jodi record for all markets'}
            </p>
          </div>

          {/* Month, Year & Search Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Month Dropdown */}
            <select
              value={selectedMonth}
              onChange={(e) => {
                if (soundEnabled) playClickBeep();
                setSelectedMonth(parseInt(e.target.value, 10));
              }}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
            >
              {(lang === 'hi' ? MONTH_NAMES_HI : MONTH_NAMES_EN).map((name, idx) => (
                <option key={idx} value={idx + 1}>
                  {name}
                </option>
              ))}
            </select>

            {/* Year Dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => {
                if (soundEnabled) playClickBeep();
                setSelectedYear(parseInt(e.target.value, 10));
              }}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-200 font-bold focus:outline-none focus:border-amber-500"
            >
              {[2026, 2025, 2024].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>

            {/* Number Highlighter Input */}
            <div className="relative">
              <input
                type="text"
                maxLength={2}
                placeholder={lang === 'hi' ? 'नंबर हाइलाइट' : 'Highlight No.'}
                value={highlightNumber}
                onChange={(e) => setHighlightNumber(e.target.value.trim())}
                className="w-24 sm:w-28 bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-chakra font-bold placeholder-neutral-500 focus:outline-none focus:border-amber-500 text-center"
              />
            </div>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold border border-neutral-700"
              title="Print Chart"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'प्रिंट' : 'Print'}</span>
            </button>
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto rounded-xl border border-neutral-800 shadow-inner">
          <table className="w-full text-center border-collapse min-w-[640px]">
            {/* Table Header */}
            <thead>
              <tr className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-neutral-950 font-chakra text-sm sm:text-base font-extrabold tracking-wider uppercase border-b-2 border-amber-700">
                <th className="py-2.5 px-3 border-r border-amber-600/50 w-16">
                  {lang === 'hi' ? 'तारीख' : 'DATE'}
                </th>
                {activeGames.map((game) => (
                  <th key={game.id} className="py-2.5 px-2 border-r border-amber-600/50 last:border-r-0">
                    <div className="leading-tight">{game.name}</div>
                    <div className="text-[10px] font-hind font-semibold text-neutral-900/90 lowercase">
                      {game.openTime}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-neutral-800 font-chakra text-sm">
              {daysArray.map((day) => {
                const isToday = isCurrentMonthView && day === currentDay;
                const isFuture = isCurrentMonthView && day > currentDay;

                const dayRecords = monthData.records?.[day] || {};

                return (
                  <tr
                    key={day}
                    className={`transition-colors ${
                      isToday
                        ? 'bg-amber-500/20 font-bold border-y-2 border-amber-500'
                        : day % 2 === 0
                        ? 'bg-neutral-900/50 hover:bg-neutral-800/60'
                        : 'bg-neutral-950 hover:bg-neutral-800/60'
                    }`}
                  >
                    {/* Date Column */}
                    <td
                      className={`py-2 px-2 border-r border-neutral-800 font-bold ${
                        isToday ? 'text-amber-400 text-glow-gold' : 'text-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{day.toString().padStart(2, '0')}</span>
                        {isToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        )}
                      </div>
                    </td>

                    {/* Games Columns */}
                    {activeGames.map((game) => {
                      let cellVal = dayRecords[game.id];

                      // Fallback for today if current view
                      if (isToday && game.todayResult) {
                        cellVal = game.todayResult;
                      }

                      // If cell is empty and future
                      if (!cellVal) {
                        cellVal = isFuture ? '--' : 'XX';
                      }

                      const isMatchHighlight =
                        highlightNumber &&
                        cellVal &&
                        cellVal.toLowerCase() === highlightNumber.toLowerCase();

                      return (
                        <td
                          key={game.id}
                          className={`py-2 px-2 border-r border-neutral-800/80 last:border-r-0 font-semibold tracking-wider text-base ${
                            isMatchHighlight
                              ? 'bg-red-600 text-white font-extrabold animate-pulse'
                              : isToday
                              ? 'text-amber-300 font-bold'
                              : cellVal === '--'
                              ? 'text-neutral-600'
                              : 'text-neutral-200'
                          }`}
                        >
                          {cellVal}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
