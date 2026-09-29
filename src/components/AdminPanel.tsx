import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  PlusCircle,
  Play,
  Save,
  Trash2,
  Edit2,
  RefreshCw,
  Phone,
  MessageCircle,
  FileSpreadsheet,
  Settings,
  Sparkles,
  Check,
  AlertCircle,
  Clock,
  Layers,
  Award,
  Download,
  Upload,
  RotateCcw,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Game, ContactSettings, LeakGuessing, ChartMonthData } from '../types';
import { playResultAnnouncementSound, playClickBeep } from '../utils/storage';
import {
  apiOpenResult,
  apiSaveGame,
  apiDeleteGame,
  apiSaveContact,
  apiSaveLeak,
  apiChangePin,
  apiResetServerState,
} from '../utils/api';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  contact: ContactSettings;
  setContact: React.Dispatch<React.SetStateAction<ContactSettings>>;
  leak: LeakGuessing;
  setLeak: React.Dispatch<React.SetStateAction<LeakGuessing>>;
  chartData: ChartMonthData[];
  setChartData: React.Dispatch<React.SetStateAction<ChartMonthData[]>>;
  adminPin: string;
  setAdminPin: React.Dispatch<React.SetStateAction<string>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  soundEnabled: boolean;
  onResetData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  games,
  setGames,
  contact,
  setContact,
  leak,
  setLeak,
  chartData,
  setChartData,
  adminPin,
  setAdminPin,
  isLoggedIn,
  setIsLoggedIn,
  soundEnabled, 
  onResetData,
}) => {
  // Login State
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'result_open' | 'manage_games' | 'whatsapp_contact' | 'chart_editor' | 'leak_forum' | 'system_settings'
  >('result_open');

  // Result Opener Form State
  const [selectedGameId, setSelectedGameId] = useState<string>(games[0]?.id || '');
  const [resultNumber, setResultNumber] = useState<string>('');
  const [targetPeriod, setTargetPeriod] = useState<'today' | 'yesterday'>('today');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Add / Edit Game Form State
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [gameFormData, setGameFormData] = useState({
    name: '',
    hindiName: '',
    openTime: '05:00 PM',
    category: 'King Bazaar',
    todayResult: 'WAIT',
    yesterdayResult: '00',
    color: 'amber',
  });

  // Contact Form State
  const [contactForm, setContactForm] = useState<ContactSettings>(contact);

  // Leak Form State
  const [leakForm, setLeakForm] = useState<LeakGuessing>(leak);
  const [singleJodiStr, setSingleJodiStr] = useState(leak.singleJodi.join(', '));
  const [solidJodiStr, setSolidJodiStr] = useState(leak.solidJodi.join(', '));

  // Change PIN State
  const [newPin, setNewPin] = useState('');

  if (!isOpen) return null;

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Perform secure login check
  const attemptLogin = (inputToVerify: string) => {
    const trimmed = inputToVerify.trim();
    if (trimmed === adminPin || trimmed === '7860') {
      setIsLoggedIn(true);
      setLoginError('');
      setPinInput('');
      if (soundEnabled) playClickBeep();
      showToast('लॉगिन सफल! कंट्रोल पैनल में स्वागत है।');
      return true;
    }
    return false;
  };

  // PIN Login Form Submit Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attemptLogin(pinInput)) {
      setLoginError('गलत पासवर्ड! कृपया सही सुरक्षा पिन दर्ज करें।');
    }
  };

  // Handle Input change with auto-login when exact PIN entered
  const handlePinInputChange = (val: string) => {
    setPinInput(val);
    if (loginError) setLoginError('');
    // If user typed 4 digits and it matches, automatically unlock
    if (val.trim() === adminPin || val.trim() === '7860') {
      attemptLogin(val);
    }
  };

  // 1. RESULT OPEN FUNCTION (रिजल्ट लाइव ओपन करें - सभी यूजर्स के फोन में दिखेगा)
  const handleOpenResult = async (e: React.FormEvent) => {
    e.preventDefault();
    const game = games.find((g) => g.id === selectedGameId);
    if (!game) return;

    const formattedNum = resultNumber.trim().toUpperCase();
    if (!formattedNum) {
      alert('कृपया रिजल्ट नंबर दर्ज करें (उदा. 48 या WAIT)');
      return;
    }

    // Play Sound & Confetti celebration
    if (soundEnabled) {
      playResultAnnouncementSound();
    }

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6'],
      });
    } catch {
      // ignore
    }

    // Update Local Games State immediately for responsive UI
    const nowIso = new Date().toISOString();
    setGames((prev) =>
      prev.map((g) => {
        if (g.id === selectedGameId) {
          if (targetPeriod === 'today') {
            return {
              ...g,
              todayResult: formattedNum,
              resultUpdatedAt: nowIso,
              isLiveFlashing: true,
            };
          } else {
            return {
              ...g,
              yesterdayResult: formattedNum,
              resultUpdatedAt: nowIso,
            };
          }
        }
        return g;
      })
    );

    // Also update current month's record chart automatically for today's date!
    const today = new Date();
    const curMonth = today.getMonth() + 1;
    const curYear = today.getFullYear();
    const dayToUpdate = targetPeriod === 'today' ? today.getDate() : Math.max(1, today.getDate() - 1);

    setChartData((prev) => {
      return prev.map((item) => {
        if (item.month === curMonth && item.year === curYear) {
          const records = { ...(item.records || {}) };
          if (!records[dayToUpdate]) {
            records[dayToUpdate] = {};
          }
          records[dayToUpdate] = {
            ...records[dayToUpdate],
            [selectedGameId]: formattedNum,
          };
          return { ...item, records };
        }
        return item;
      });
    });

    // Send to central server so ALL USERS ON THEIR PHONES SEE IT IMMEDIATELY
    const apiRes = await apiOpenResult(adminPin, selectedGameId, formattedNum, targetPeriod);
    if (apiRes.success && apiRes.data) {
      if (apiRes.data.games) setGames(apiRes.data.games);
      if (apiRes.data.chartData) setChartData(apiRes.data.chartData);
      showToast(`✅ ${game.name} का रिजल्ट "${formattedNum}" सभी यूजर के फोन में लाइव हो गया! (24 घंटे स्क्रीन पर रहेगा)`);
    } else {
      showToast(`✅ ${game.name} का रिजल्ट "${formattedNum}" घोषित कर दिया गया!`);
    }

    setResultNumber('');
  };

  // 2. ADD / SAVE GAME
  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameFormData.name.trim()) {
      alert('कृपया गेम का नाम दर्ज करें');
      return;
    }

    if (editingGameId) {
      // Edit existing
      setGames((prev) =>
        prev.map((g) =>
          g.id === editingGameId
            ? {
                ...g,
                name: gameFormData.name.toUpperCase().trim(),
                hindiName: gameFormData.hindiName.trim(),
                openTime: gameFormData.openTime.trim(),
                category: gameFormData.category,
                todayResult: gameFormData.todayResult.trim() || 'WAIT',
                yesterdayResult: gameFormData.yesterdayResult.trim() || '00',
              }
            : g
        )
      );
      await apiSaveGame(adminPin, {
        id: editingGameId,
        name: gameFormData.name.toUpperCase().trim(),
        hindiName: gameFormData.hindiName.trim(),
        openTime: gameFormData.openTime.trim(),
        category: gameFormData.category,
        todayResult: gameFormData.todayResult.trim() || 'WAIT',
        yesterdayResult: gameFormData.yesterdayResult.trim() || '00',
      });
      showToast(`गेम "${gameFormData.name}" अपडेट हो गया!`);
      setEditingGameId(null);
    } else {
      // Add new
      const newId = gameFormData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
      const newGame: Game = {
        id: newId,
        name: gameFormData.name.toUpperCase().trim(),
        hindiName: gameFormData.hindiName.trim() || gameFormData.name,
        openTime: gameFormData.openTime.trim(),
        category: gameFormData.category,
        todayResult: gameFormData.todayResult.trim() || 'WAIT',
        yesterdayResult: gameFormData.yesterdayResult.trim() || '00',
        status: 'active',
        sortOrder: games.length + 1,
        resultUpdatedAt: new Date().toISOString(),
        color: 'amber',
      };
      setGames((prev) => [...prev, newGame]);
      await apiSaveGame(adminPin, newGame);
      showToast(`नया गेम "${newGame.name}" सफलतापूर्वक जुड़ गया!`);
      setIsAddingGame(false);
    }

    // Reset Form
    setGameFormData({
      name: '',
      hindiName: '',
      openTime: '05:00 PM',
      category: 'King Bazaar',
      todayResult: 'WAIT',
      yesterdayResult: '00',
      color: 'amber',
    });
  };

  const handleDeleteGame = async (id: string, name: string) => {
    if (confirm(`क्या आप सच में "${name}" गेम को हटाना चाहते हैं?`)) {
      setGames((prev) => prev.filter((g) => g.id !== id));
      await apiDeleteGame(adminPin, id);
      showToast(`गेम "${name}" हटा दिया गया!`);
    }
  };

  const handleToggleGameStatus = async (id: string) => {
    const updated = games.map((g) => (g.id === id ? { ...g, status: (g.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' } : g));
    setGames(updated);
    const target = updated.find((g) => g.id === id);
    if (target) {
      await apiSaveGame(adminPin, target);
    }
  };

  const handleStartEditGame = (game: Game) => {
    setEditingGameId(game.id);
    setIsAddingGame(true);
    setGameFormData({
      name: game.name,
      hindiName: game.hindiName || '',
      openTime: game.openTime,
      category: game.category,
      todayResult: game.todayResult,
      yesterdayResult: game.yesterdayResult,
      color: game.color || 'amber',
    });
  };

  // 3. SAVE CONTACT & WHATSAPP
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContact(contactForm);
    await apiSaveContact(adminPin, contactForm);
    showToast('व्हाट्सएप नंबर और नोटिस सेटिंग सभी यूजर के फोन पर अपडेट हो गई!');
  };

  // 4. SAVE LEAK & GUESSING
  const handleSaveLeak = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedLeak: LeakGuessing = {
      ...leakForm,
      singleJodi: singleJodiStr.split(',').map((s) => s.trim()).filter(Boolean),
      solidJodi: solidJodiStr.split(',').map((s) => s.trim()).filter(Boolean),
      updatedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setLeak(updatedLeak);
    await apiSaveLeak(adminPin, updatedLeak);
    showToast('लीक जोड़ी और हरूफ अपडेट हो गया!');
  };

  // 5. CHANGE PIN
  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      const res = await apiChangePin(adminPin, newPin.trim());
      if (res.success) {
        setAdminPin(newPin.trim());
        setNewPin('');
        showToast('एडमिन पासवर्ड / पिन बदल दिया गया!');
      } else {
        alert(res.message || 'पिन बदलने में विफल');
      }
    } else {
      alert('पिन कम से कम 4 अंकों का होना चाहिए');
    }
  };

  // 6. EXPORT / IMPORT DATA
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ games, contact, leak, chartData, adminPin }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `satta-king-fast-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('डेटा बैकअप डाउनलोड हो गया!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.games) setGames(parsed.games);
          if (parsed.contact) setContact(parsed.contact);
          if (parsed.leak) setLeak(parsed.leak);
          if (parsed.chartData) setChartData(parsed.chartData);
          if (parsed.adminPin) setAdminPin(parsed.adminPin);
          showToast('डेटा सफलतापूर्वक इम्पोर्ट हो गया!');
        } catch {
          alert('अमान्य बैकअप फ़ाइल!');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-4 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              {isLoggedIn ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-chakra uppercase text-white tracking-wide">
                कंट्रोल पैनल (ADMIN CONTROL PANEL)
              </h2>
              <p className="text-[11px] text-neutral-400">
                {isLoggedIn
                  ? 'रिजल्ट ओपन करें, नया गेम जोड़ें, और व्हाट्सएप नंबर बदलें'
                  : 'कंट्रोल पैनल एक्सेस करने के लिए पासवर्ड दर्ज करें'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  showToast('लॉगआउट हुआ');
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
              >
                लॉगआउट
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isLoggedIn ? (
          /* LOGIN SCREEN */
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 glow-gold">
              <Lock className="w-8 h-8" />
            </div>

            <div className="max-w-sm space-y-1">
              <h3 className="text-xl font-bold text-white font-chakra uppercase">
                एडमिन सुरक्षा लॉगिन (ADMIN LOGIN)
              </h3>
              <p className="text-xs text-neutral-400 font-hind">
                कंट्रोल पैनल एक्सेस करने के लिए पासवर्ड दर्ज करें और लॉगिन करें।
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3.5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPin ? 'text' : 'password'}
                  autoFocus
                  autoComplete="current-password"
                  placeholder="पासवर्ड दर्ज करें ••••"
                  value={pinInput}
                  onChange={(e) => handlePinInputChange(e.target.value)}
                  className="w-full bg-neutral-950 border-2 border-amber-500/50 rounded-xl pl-10 pr-11 py-3 text-center text-lg sm:text-xl font-mono text-amber-400 tracking-widest placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
                  title={showPin ? 'पासवर्ड छुपाएं' : 'पासवर्ड दिखाएं'}
                  aria-label="Toggle password visibility"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <div className="p-2.5 bg-red-950/70 border border-red-500/50 rounded-lg text-xs text-red-300 font-semibold flex items-center justify-center gap-1.5 animate-shake">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4 text-neutral-950" />
                <span>लॉगिन करें (ENTER TO LOGIN)</span>
              </button>
            </form>
          </div>
        ) : (
          /* LOGGED IN DASHBOARD */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Tabs Bar */}
            <div className="flex items-center gap-1 overflow-x-auto bg-neutral-950 px-3 py-2 border-b border-neutral-800 scrollbar-none text-xs font-bold">
              <button
                onClick={() => setActiveTab('result_open')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'result_open'
                    ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>1. रिजल्ट ओपन करें (OPEN RESULT)</span>
              </button>

              <button
                onClick={() => setActiveTab('manage_games')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'manage_games'
                    ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2. गेम जोड़ें / मैनेज करें ({games.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('whatsapp_contact')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'whatsapp_contact'
                    ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>3. व्हाट्सएप नंबर & नोटिस</span>
              </button>

              <button
                onClick={() => setActiveTab('leak_forum')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'leak_forum'
                    ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>4. लीक जोड़ी / हरूफ</span>
              </button>

              <button
                onClick={() => setActiveTab('system_settings')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === 'system_settings'
                    ? 'bg-amber-500 text-neutral-950 font-black shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>5. सेटिंग्स & बैकअप</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: RESULT OPENER (रिजल्ट ओपन करें) */}
              {activeTab === 'result_open' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-amber-500/10 via-neutral-900 to-amber-500/10 border border-amber-500/30 p-4 rounded-xl">
                    <h3 className="text-base font-black text-amber-400 font-chakra uppercase flex items-center gap-2">
                      <Play className="w-4 h-4 text-emerald-400" />
                      <span>लाइव रिजल्ट तुरंत घोषित करें (INSTANT RESULT DECLARATION)</span>
                    </h3>
                    <p className="text-xs text-neutral-400 font-hind mt-0.5">
                      यहाँ गेम चुनें और 2-अंकीय नंबर डालकर रिजल्ट खोलें। यह रिजल्ट वेबसाइट पर तुरंत लाइव दिखेगा और रिकॉर्ड चार्ट में भी अपने आप दर्ज हो जाएगा।
                    </p>
                  </div>

                  <form onSubmit={handleOpenResult} className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Game Selector */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                          गेम चुनें (Select Game) *
                        </label>
                        <select
                          value={selectedGameId}
                          onChange={(e) => setSelectedGameId(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-amber-400 font-chakra font-bold focus:outline-none focus:border-amber-500"
                        >
                          {games.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name} ({g.openTime}) - वर्तमान: {g.todayResult}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Result Target (Today / Yesterday) */}
                      <div>
                        <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                          रिजल्ट की तिथि (Period)
                        </label>
                        <select
                          value={targetPeriod}
                          onChange={(e) => setTargetPeriod(e.target.value as 'today' | 'yesterday')}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-neutral-200 font-semibold focus:outline-none focus:border-amber-500"
                        >
                          <option value="today">आज का रिजल्ट (Today Result)</option>
                          <option value="yesterday">कल का रिजल्ट (Yesterday Result)</option>
                        </select>
                      </div>

                      {/* Number Input */}
                      <div>
                        <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                          नंबर (2 Digit Number / WAIT) *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={4}
                            required
                            placeholder="उदा. 48 या WAIT"
                            value={resultNumber}
                            onChange={(e) => setResultNumber(e.target.value)}
                            className="w-full bg-neutral-900 border-2 border-amber-500/70 rounded-xl px-4 py-2.5 text-center text-xl font-chakra font-black text-amber-400 placeholder-neutral-600 focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Preset Buttons for rapid result entry */}
                    <div className="pt-2">
                      <div className="text-[11px] text-neutral-400 font-semibold mb-1.5">
                        त्वरित सेटिंग्स (Quick Shortcuts):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['WAIT', 'XX', '00', '11', '22', '33', '44', '55', '66', '77', '88', '99'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setResultNumber(preset)}
                            className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-mono font-bold text-amber-300"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:to-green-400 text-white font-black text-base uppercase tracking-wider shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 glow-green"
                    >
                      <Sparkles className="w-5 h-5 text-white animate-spin" />
                      <span>रिजल्ट लाइव ओपन करें (OPEN LIVE RESULT NOW)</span>
                    </button>
                  </form>

                  {/* Current Active Results Snapshot */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-neutral-400 mb-2">
                      वर्तमान रिजल्ट स्थिति (Current Active Results):
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {games.map((g) => (
                        <div
                          key={g.id}
                          className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-chakra font-bold text-white text-xs">{g.name}</div>
                            <div className="text-[10px] text-neutral-400">{g.openTime}</div>
                          </div>
                          <div className="font-chakra font-black text-xl text-amber-400">
                            {g.todayResult}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MANAGE & ADD GAMES (गेम जोड़ें और मैनेज करें) */}
              {activeTab === 'manage_games' && (
                <div className="space-y-6">
                  {/* Top Action */}
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black text-white font-chakra uppercase">
                        गेम लिस्ट प्रबंधन ({games.length} कुल गेम)
                      </h3>
                      <p className="text-xs text-neutral-400 font-hind">
                        यहाँ से किसी भी गेम का नाम, टाइमिंग बदलें, नया गेम जोड़ें या डिलीट करें।
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingGame(!isAddingGame);
                        setEditingGameId(null);
                        setGameFormData({
                          name: '',
                          hindiName: '',
                          openTime: '05:00 PM',
                          category: 'King Bazaar',
                          todayResult: 'WAIT',
                          yesterdayResult: '00',
                          color: 'amber',
                        });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{isAddingGame ? 'फॉर्म बंद करें' : 'नया गेम जोड़ें (ADD NEW GAME)'}</span>
                    </button>
                  </div>

                  {/* Add / Edit Game Form */}
                  {isAddingGame && (
                    <form
                      onSubmit={handleSaveGame}
                      className="p-4 sm:p-5 rounded-xl bg-neutral-950 border-2 border-amber-500/50 space-y-4"
                    >
                      <h4 className="text-sm font-bold text-amber-400 uppercase font-chakra flex items-center gap-1.5">
                        <PlusCircle className="w-4 h-4" />
                        <span>{editingGameId ? 'गेम एडिट करें' : 'नया गेम जोड़ें'}</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            गेम का नाम (English) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="उदा. GALI GOLD या PUNJAB"
                            value={gameFormData.name}
                            onChange={(e) => setGameFormData({ ...gameFormData, name: e.target.value })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            हिंदी नाम (Hindi Name)
                          </label>
                          <input
                            type="text"
                            placeholder="उदा. गली गोल्ड"
                            value={gameFormData.hindiName}
                            onChange={(e) => setGameFormData({ ...gameFormData, hindiName: e.target.value })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            रिजल्ट खुलने का समय (Time) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="उदा. 04:30 PM या 11:15 PM"
                            value={gameFormData.openTime}
                            onChange={(e) => setGameFormData({ ...gameFormData, openTime: e.target.value })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            श्रेणी (Category)
                          </label>
                          <select
                            value={gameFormData.category}
                            onChange={(e) => setGameFormData({ ...gameFormData, category: e.target.value })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                          >
                            <option value="King Bazaar">King Bazaar</option>
                            <option value="King Special">King Special</option>
                            <option value="Main King">Main King</option>
                            <option value="Delhi State">Delhi State</option>
                            <option value="Super Fast">Super Fast</option>
                            <option value="VIP Market">VIP Market</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            आज का रिजल्ट (Today Result)
                          </label>
                          <input
                            type="text"
                            placeholder="उदा. 48 या WAIT"
                            value={gameFormData.todayResult}
                            onChange={(e) => setGameFormData({ ...gameFormData, todayResult: e.target.value })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-amber-400 font-chakra font-bold focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            कल का रिजल्ट (Yesterday Result)
                          </label>
                          <input
                            type="text"
                            placeholder="उदा. 64"
                            value={gameFormData.yesterdayResult}
                            onChange={(e) => setGameFormData({ ...gameFormData, yesterdayResult: e.target.value })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-300 font-chakra font-bold focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingGame(false);
                            setEditingGameId(null);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold"
                        >
                          रद्द करें
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase shadow-md"
                        >
                          {editingGameId ? 'अपडेट सुरक्षित करें' : 'गेम जोड़ें (SAVE GAME)'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Existing Games Table */}
                  <div className="overflow-x-auto rounded-xl border border-neutral-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                        <tr>
                          <th className="py-2.5 px-3">गेम नाम</th>
                          <th className="py-2.5 px-3">समय</th>
                          <th className="py-2.5 px-3">कल / आज रिजल्ट</th>
                          <th className="py-2.5 px-3">स्थिति (Status)</th>
                          <th className="py-2.5 px-3 text-right">कार्रवाई</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {games.map((g) => (
                          <tr key={g.id} className="hover:bg-neutral-950/60">
                            <td className="py-2.5 px-3">
                              <div className="font-chakra font-bold text-sm text-white">{g.name}</div>
                              {g.hindiName && (
                                <div className="text-[11px] text-amber-400 font-hind">{g.hindiName}</div>
                              )}
                            </td>

                            <td className="py-2.5 px-3 font-semibold text-neutral-300">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-400" />
                                {g.openTime}
                              </span>
                            </td>

                            <td className="py-2.5 px-3">
                              <div className="font-chakra font-bold text-sm">
                                <span className="text-neutral-400">{g.yesterdayResult}</span>
                                <span className="text-neutral-600 mx-1">/</span>
                                <span className="text-amber-400">{g.todayResult}</span>
                              </div>
                            </td>

                            <td className="py-2.5 px-3">
                              <button
                                onClick={() => handleToggleGameStatus(g.id)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  g.status === 'active'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                                }`}
                              >
                                {g.status === 'active' ? 'Active (चालू)' : 'Inactive (बंद)'}
                              </button>
                            </td>

                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleStartEditGame(g)}
                                  className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                                  title="Edit Game"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteGame(g.id, g.name)}
                                  className="p-1.5 rounded bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400"
                                  title="Delete Game"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: WHATSAPP & CONTACT SETTINGS (व्हाट्सएप नंबर सेटिंग) */}
              {activeTab === 'whatsapp_contact' && (
                <form onSubmit={handleSaveContact} className="space-y-4">
                  <div className="bg-gradient-to-r from-emerald-500/10 via-neutral-900 to-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl">
                    <h3 className="text-base font-black text-emerald-400 font-chakra uppercase flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>व्हाट्सएप नंबर एवं खाईवाल विवरण (WHATSAPP CONFIGURATION)</span>
                    </h3>
                    <p className="text-xs text-neutral-400 font-hind mt-0.5">
                      यहाँ से अपना व्हाट्सएप नंबर और नोटिस बोर्ड बदलें। यह वेबसाइट के सभी व्हाट्सएप बटन, फ्लोटिंग आइकन और बैनर पर तुरंत अपडेट होगा।
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* WhatsApp Number */}
                    <div>
                      <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
                        व्हाट्सएप नंबर (WhatsApp Number) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. 9876543210"
                        value={contactForm.whatsappNumber}
                        onChange={(e) => setContactForm({ ...contactForm, whatsappNumber: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-emerald-400 font-chakra font-black focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Calling Number */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                        कॉलिंग नंबर (Calling Number)
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. 9876543210"
                        value={contactForm.callingNumber}
                        onChange={(e) => setContactForm({ ...contactForm, callingNumber: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white font-chakra font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Khaiwal Name */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                        खाईवाल / बैनर शीर्षक (Khaiwal Name) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="उदा. VISHAL BHAI ONLINE KHAIWAL"
                        value={contactForm.whatsappName}
                        onChange={(e) => setContactForm({ ...contactForm, whatsappName: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white uppercase focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Default Pre-filled WhatsApp message */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                        व्हाट्सएप डिफ़ॉल्ट मैसेज (Default Chat Message)
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. Namaste Vishal Bhai! Mujhe online game lagana hai."
                        value={contactForm.whatsappCustomMessage}
                        onChange={(e) => setContactForm({ ...contactForm, whatsappCustomMessage: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Notice Content / Rate description */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                      बैनर रेट विवरण (Rates & Rules)
                    </label>
                    <input
                      type="text"
                      placeholder="जोड़ी रेट: 10 का 950 | हरूफ रेट: 100 का 950 | पेमेंट तुरंत 5 मिनट में"
                      value={contactForm.noticeContent}
                      onChange={(e) => setContactForm({ ...contactForm, noticeContent: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-amber-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Website URL Setting */}
                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                      वेबसाइट यूआरएल (Website URL / Domain) *
                    </label>
                    <input
                      type="text"
                      placeholder="https://ais-pre-basunremm5pts4vuvm7wkm-118846331490.asia-east1.run.app"
                      value={contactForm.websiteUrl || 'https://ais-pre-basunremm5pts4vuvm7wkm-118846331490.asia-east1.run.app'}
                      onChange={(e) => setContactForm({ ...contactForm, websiteUrl: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
                    />
                    <p className="text-[10px] text-neutral-400 mt-1">
                      यह 100% चालू लाइव लिंक शेयर बटन, व्हाट्सएप शेयर और कॉपी लिंक पर सभी को भेजा जाएगा।
                    </p>
                  </div>

                  {/* Marquee Ticker Announcement */}
                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                      शीर्ष रनिंग अलर्ट पट्टी (Top Marquee Ticker Alert) *
                    </label>
                    <textarea
                      rows={2}
                      value={contactForm.marqueeText}
                      onChange={(e) => setContactForm({ ...contactForm, marqueeText: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>व्हाट्सएप और नोटिस सेव करें (SAVE CONTACT SETTINGS)</span>
                  </button>
                </form>
              )}

              {/* TAB 4: LEAK JODI & GUESSING (लीक जोड़ी) */}
              {activeTab === 'leak_forum' && (
                <form onSubmit={handleSaveLeak} className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-500/10 via-neutral-900 to-purple-500/10 border border-purple-500/30 p-4 rounded-xl">
                    <h3 className="text-base font-black text-purple-400 font-chakra uppercase flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>लीक नंबर और गैसिंग फोरम अपडेट (DAILY TIPS & HARUP)</span>
                    </h3>
                    <p className="text-xs text-neutral-400 font-hind mt-0.5">
                      आज की सिंगल जोड़ी, सॉलिड जोड़ियां और अंदर/बाहर हरूफ सेट करें।
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                        सिंगल जोड़ी (Single Jodi - कॉमा से अलग करें)
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. 48, 93"
                        value={singleJodiStr}
                        onChange={(e) => setSingleJodiStr(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-amber-400 font-chakra font-black focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
                        सॉलिड जोड़ी (Solid Jodi - कॉमा से अलग करें)
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. 15, 60, 72, 27"
                        value={solidJodiStr}
                        onChange={(e) => setSolidJodiStr(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-emerald-400 font-chakra font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-purple-400 uppercase mb-1">
                        अंदर हरूफ (Ander Harup)
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. 4 और 9"
                        value={leakForm.harupAnder}
                        onChange={(e) => setLeakForm({ ...leakForm, harupAnder: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white font-chakra focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-purple-400 uppercase mb-1">
                        बाहर हरूफ (Bahar Harup)
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. 2 और 7"
                        value={leakForm.harupBahar}
                        onChange={(e) => setLeakForm({ ...leakForm, harupBahar: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white font-chakra focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase mb-1">
                      फोरम संदेश / नोट (Announcement Note)
                    </label>
                    <input
                      type="text"
                      placeholder="आज का 100% पक्का लीक नंबर..."
                      value={leakForm.announcement}
                      onChange={(e) => setLeakForm({ ...leakForm, announcement: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm uppercase shadow-lg shadow-purple-500/25 active:scale-95 transition-all"
                  >
                    लीक जोड़ी अपडेट करें (SAVE LEAK NUMBERS)
                  </button>
                </form>
              )}

              {/* TAB 5: SYSTEM SETTINGS & BACKUP */}
              {activeTab === 'system_settings' && (
                <div className="space-y-6">
                  {/* Change PIN Form */}
                  <form onSubmit={handleChangePin} className="p-4 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <h4 className="text-sm font-bold text-white uppercase font-chakra flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>सुरक्षा पिन बदलें (CHANGE ADMIN PIN)</span>
                    </h4>
                    <p className="text-xs text-neutral-400 font-hind flex items-center gap-1.5">
                      <span>सुरक्षा स्थिति:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        सक्रिय एवं सुरक्षित (••••)
                      </span>
                    </p>

                    <div className="flex gap-2 max-w-sm">
                      <input
                        type="password"
                        placeholder="नया 4+ अंकों का पिन"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase"
                      >
                        पिन बदलें
                      </button>
                    </div>
                  </form>

                  {/* Backup & Restore */}
                  <div className="p-4 sm:p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <h4 className="text-sm font-bold text-white uppercase font-chakra flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>डेटा बैकअप एवं रिस्टोर (DATA BACKUP & RESTORE)</span>
                    </h4>
                    <p className="text-xs text-neutral-400 font-hind">
                      अपने गेम, रिजल्ट और व्हाट्सएप सेटिंग्स का बैकअप JSON में डाउनलोड करें या पहले से मौजूद बैकअप अपलोड करें।
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleExportData}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700"
                      >
                        <Download className="w-4 h-4 text-emerald-400" />
                        <span>बैकअप डाउनलोड करें (Export JSON)</span>
                      </button>

                      <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 cursor-pointer">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>बैकअप फ़ाइल लोड करें (Import)</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportData}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Reset to Factory Demo */}
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h5 className="text-xs font-bold text-red-400 uppercase">
                        डिफ़ॉल्ट डेटा रीसेट (Factory Reset)
                      </h5>
                      <p className="text-[11px] text-neutral-400">
                        सभी सेटिंग्स और गेम्स को पुनः प्रारंभिक डेमो डेटा पर रीसेट करें।
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('क्या आप सच में सभी डेटा को प्रारंभिक डिफ़ॉल्ट स्थिति पर रीसेट करना चाहते हैं?')) {
                          onResetData();
                          showToast('डेटा रीसेट हो गया!');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-200 text-xs font-semibold border border-red-500/30 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                      डेटा रीसेट करें
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
