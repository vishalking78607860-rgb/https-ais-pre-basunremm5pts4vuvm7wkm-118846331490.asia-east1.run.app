/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  loadAppState,
  saveAppState,
  resetAppState,
  playResultAnnouncementSound,
  playClickBeep,
} from './utils/storage';
import { fetchServerState, apiResetServerState } from './utils/api';
import { AppState, Game, ContactSettings, LeakGuessing, ChartMonthData } from './types';
import { Header } from './components/Header';
import { LiveMarquee } from './components/LiveMarquee';
import { WhatsAppBanner } from './components/WhatsAppBanner';
import { ShareButton } from './components/ShareButton';
import { TodayLiveGrid } from './components/TodayLiveGrid';
import { GuessingForum } from './components/GuessingForum';
import { LikeButton } from './components/LikeButton';
import { MonthlyChart } from './components/MonthlyChart';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';

export default function App() {
  // Initialize state from local cache
  const [appState, setAppState] = useState<AppState>(() => loadAppState());

  const [games, setGames] = useState<Game[]>(appState.games);
  const [contact, setContact] = useState<ContactSettings>(appState.contact);
  const [leak, setLeak] = useState<LeakGuessing>(appState.leakGuessing);
  const [chartData, setChartData] = useState<ChartMonthData[]>(appState.chartData);
  const [adminPin, setAdminPin] = useState<string>(appState.adminPin || '7860');
  const [likesCount, setLikesCount] = useState<number>(appState.likesCount || 14850);

  // UI state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [lastRefreshed, setLastRefreshed] = useState<string>('अभी-अभी (Just now)');
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);

  // Keep track of latest known results to play sound if new result opened
  const lastResultsRef = useRef<Record<string, string>>({});

  // Sync state from server (for all user phones)
  const syncWithServer = useCallback(async () => {
    const serverState = await fetchServerState();
    if (serverState) {
      setIsLiveConnected(true);
      setGames((prevGames) => {
        // Detect if any new result was opened to announce with sound
        let hasNewResult = false;
        if (serverState.games && Array.isArray(serverState.games)) {
          serverState.games.forEach((g) => {
            const prev = lastResultsRef.current[g.id];
            if (prev && prev !== g.todayResult && g.todayResult !== 'WAIT' && g.todayResult !== 'XX') {
              hasNewResult = true;
            }
            lastResultsRef.current[g.id] = g.todayResult;
          });
        }
        if (hasNewResult && soundEnabled) {
          playResultAnnouncementSound();
        }
        return serverState.games || prevGames;
      });

      if (serverState.contact) setContact(serverState.contact);
      if (serverState.leakGuessing) setLeak(serverState.leakGuessing);
      if (serverState.chartData) setChartData(serverState.chartData);
      if (serverState.likesCount) setLikesCount(serverState.likesCount);

      const now = new Date();
      setLastRefreshed(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    }
  }, [soundEnabled]);

  // Initial sync & Live polling every 4 seconds so all phones get instant updates
  useEffect(() => {
    // Initial fetch
    syncWithServer();

    // Regular live poll (4 seconds interval)
    const pollInterval = setInterval(() => {
      syncWithServer();
    }, 4000);

    // Re-fetch immediately when user switches back to browser tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncWithServer();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', syncWithServer);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', syncWithServer);
    };
  }, [syncWithServer]);

  // Cache to localStorage
  useEffect(() => {
    const updatedState: AppState = {
      games,
      contact,
      leakGuessing: leak,
      chartData,
      adminPin,
      likesCount,
    };
    saveAppState(updatedState);
  }, [games, contact, leak, chartData, adminPin, likesCount]);

  // Manual refresh trigger
  const handleRefresh = useCallback(() => {
    syncWithServer();
  }, [syncWithServer]);

  // Factory reset
  const handleResetData = async () => {
    await apiResetServerState(adminPin);
    const fresh = resetAppState();
    setGames(fresh.games);
    setContact(fresh.contact);
    setLeak(fresh.leakGuessing);
    setChartData(fresh.chartData);
    setAdminPin(fresh.adminPin);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-hind flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onRefresh={handleRefresh}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        lang={lang}
        setLang={setLang}
        whatsappNumber={contact.whatsappNumber}
        websiteUrl={contact.websiteUrl || 'https://ais-pre-basunremm5pts4vuvm7wkm-118846331490.asia-east1.run.app'}
        likesCount={likesCount}
      />

      {/* Real-time Notice Marquee Ticker */}
      <LiveMarquee text={contact.marqueeText} />

      {/* Main Content Area */}
      <main className="flex-1 pb-10">
        {/* Main WhatsApp Banner & Khaiwal Verification (Requested Feature) */}
        <WhatsAppBanner
          contact={contact}
          soundEnabled={soundEnabled}
          lang={lang}
        />

        {/* Share Website Link Banner (User requested link share button) */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 my-3">
          <ShareButton
            variant="banner"
            lang={lang}
            soundEnabled={soundEnabled}
            websiteUrl={contact.websiteUrl || 'https://ais-pre-basunremm5pts4vuvm7wkm-118846331490.asia-east1.run.app'}
          />
        </div>

        {/* Today Live Result Grid with Countdown Timer & Cards (24 घंटे स्क्रीन पर रहेगा) */}
        <TodayLiveGrid
          games={games}
          contact={contact}
          soundEnabled={soundEnabled}
          lang={lang}
        />

        {/* Daily Leak Numbers & Lucky Jodi Generator */}
        <GuessingForum
          leak={leak}
          games={games}
          soundEnabled={soundEnabled}
          lang={lang}
        />

        {/* Website Like & Support Banner */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 my-4">
          <LikeButton
            variant="banner"
            likesCount={likesCount}
            onLikeUpdate={setLikesCount}
            lang={lang}
            soundEnabled={soundEnabled}
          />
        </div>

        {/* Monthly Date-wise (1 to 31) Record Chart */}
        <MonthlyChart
          games={games}
          chartData={chartData}
          soundEnabled={soundEnabled}
          lang={lang}
        />
      </main>

      {/* Floating WhatsApp Bubble, Share Button & Mobile Quick Bar */}
      <FloatingWhatsApp
        contact={contact}
        onRefresh={handleRefresh}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        soundEnabled={soundEnabled}
        lang={lang}
      />

      {/* Admin Control Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        games={games}
        setGames={setGames}
        contact={contact}
        setContact={setContact}
        leak={leak}
        setLeak={setLeak}
        chartData={chartData}
        setChartData={setChartData}
        adminPin={adminPin}
        setAdminPin={setAdminPin}
        isLoggedIn={isAdminLoggedIn}
        setIsLoggedIn={setIsAdminLoggedIn}
        soundEnabled={soundEnabled}
        onResetData={handleResetData}
      />

      {/* Footer */}
      <Footer contact={contact} lang={lang} />
    </div>
  );
}
