import { AppState, Game, ContactSettings, LeakGuessing, ChartMonthData } from '../types';

export const DEFAULT_GAMES: Game[] = [
  {
    id: 'disawar',
    name: 'DISAWAR',
    hindiName: 'दिसावर',
    openTime: '05:00 AM',
    time24: '05:00',
    category: 'King Special',
    todayResult: '64',
    yesterdayResult: '91',
    status: 'active',
    sortOrder: 1,
    resultUpdatedAt: new Date().toISOString(),
    color: 'amber',
  },
  {
    id: 'faridabad',
    name: 'FARIDABAD',
    hindiName: 'फरीदाबाद',
    openTime: '06:00 PM',
    time24: '18:00',
    category: 'Main King',
    todayResult: '28',
    yesterdayResult: '53',
    status: 'active',
    sortOrder: 2,
    resultUpdatedAt: new Date().toISOString(),
    color: 'emerald',
  },
  {
    id: 'ghaziabad',
    name: 'GHAZIABAD',
    hindiName: 'गाजियाबाद',
    openTime: '08:15 PM',
    time24: '20:15',
    category: 'Main King',
    todayResult: '83',
    yesterdayResult: '19',
    status: 'active',
    sortOrder: 3,
    resultUpdatedAt: new Date().toISOString(),
    color: 'rose',
  },
  {
    id: 'gali',
    name: 'GALI',
    hindiName: 'गली',
    openTime: '11:15 PM',
    time24: '23:15',
    category: 'King Special',
    todayResult: 'WAIT',
    yesterdayResult: '77',
    status: 'active',
    sortOrder: 4,
    resultUpdatedAt: new Date().toISOString(),
    isLiveFlashing: true,
    color: 'amber',
  },
  {
    id: 'delhi-bazaar',
    name: 'DELHI BAZAAR',
    hindiName: 'दिल्ली बाजार',
    openTime: '03:15 PM',
    time24: '15:15',
    category: 'Delhi State',
    todayResult: '39',
    yesterdayResult: '42',
    status: 'active',
    sortOrder: 5,
    resultUpdatedAt: new Date().toISOString(),
    color: 'cyan',
  },
  {
    id: 'shree-ganesh',
    name: 'SHREE GANESH',
    hindiName: 'श्री गणेश',
    openTime: '04:30 PM',
    time24: '16:30',
    category: 'Delhi State',
    todayResult: '51',
    yesterdayResult: '80',
    status: 'active',
    sortOrder: 6,
    resultUpdatedAt: new Date().toISOString(),
    color: 'purple',
  },
  {
    id: 'taj',
    name: 'TAJ',
    hindiName: 'ताज',
    openTime: '03:00 PM',
    time24: '15:00',
    category: 'Super Fast',
    todayResult: '07',
    yesterdayResult: '66',
    status: 'active',
    sortOrder: 7,
    resultUpdatedAt: new Date().toISOString(),
    color: 'amber',
  },
  {
    id: 'kashipur',
    name: 'KASHIPUR',
    hindiName: 'काशीपुर',
    openTime: '04:15 PM',
    time24: '16:15',
    category: 'Super Fast',
    todayResult: '95',
    yesterdayResult: '12',
    status: 'active',
    sortOrder: 8,
    resultUpdatedAt: new Date().toISOString(),
    color: 'emerald',
  },
];

export const DEFAULT_CONTACT: ContactSettings = {
  whatsappNumber: '9876543210',
  whatsappName: 'VISHAL BHAI ONLINE KHAIWAL',
  whatsappCustomMessage: 'Namaste Vishal Bhai! Mujhe online game khelna hai aur rate pata karna hai.',
  callingNumber: '9876543210',
  telegramUsername: 'sattakingfast_official',
  websiteUrl: 'https://sattaking777.gamer.gd/',
  marqueeText: '👑 SATTA KING 777 FAST LIVE RESULT (sattaking777.gamer.gd) - सबसे तेज, सबसे आगे! सभी गेम का रिजल्ट सबसे पहले देखने के लिए sattaking777.gamer.gd पर बने रहें। खाईवाल विशाल भाई से संपर्क करें! 👑',
  noticeHeading: '🔥 ईमानदार खाईवाल - सुपर फास्ट पेमेंट गारंटी 🔥',
  noticeContent: 'जोड़ी रेट: 10 का 950 | हरूफ रेट: 100 का 950 | पेमेंट तुरंत 5 मिनट में (PhonePe / GooglePay / Paytm)',
  paymentNotice: 'Payment Proof Instant Within 5 Minutes | 100% Trusted Since 2018',
};

export const DEFAULT_LEAK: LeakGuessing = {
  singleJodi: ['48', '93'],
  solidJodi: ['15', '60', '72', '27'],
  supportJodi: ['33', '88', '04', '59'],
  harupAnder: '4 और 9',
  harupBahar: '2 और 7',
  updatedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
  announcement: 'आज का पक्का लीक नंबर और सॉलिड अनकट हरूफ। 100% फिक्स गेम पासिंग रिकॉर्ड!',
};

// Generate realistic chart history for current and previous month
export function generateInitialChartData(): ChartMonthData[] {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const gameIds = DEFAULT_GAMES.map((g) => g.id);

  const generateMonthRecords = (daysInMonth: number, isCurrent: boolean) => {
    const records: Record<number, Record<string, string>> = {};
    const maxDay = isCurrent ? Math.min(now.getDate(), daysInMonth) : daysInMonth;

    for (let day = 1; day <= daysInMonth; day++) {
      records[day] = {};
      gameIds.forEach((gid) => {
        if (day <= maxDay) {
          // Semi-deterministic realistic 2-digit number
          const num = ((day * 17 + gid.charCodeAt(0) * 13) % 100).toString().padStart(2, '0');
          records[day][gid] = num;
        } else {
          records[day][gid] = '--';
        }
      });
    }

    // Set today's values specifically
    if (isCurrent && records[now.getDate()]) {
      DEFAULT_GAMES.forEach((g) => {
        records[now.getDate()][g.id] = g.todayResult;
      });
    }

    return records;
  };

  return [
    {
      month: currentMonth,
      year: currentYear,
      records: generateMonthRecords(30, true),
    },
    {
      month: currentMonth === 1 ? 12 : currentMonth - 1,
      year: currentMonth === 1 ? currentYear - 1 : currentYear,
      records: generateMonthRecords(31, false),
    },
  ];
}

const STORAGE_KEY = 'satta_king_fast_data_v1';

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.games) && parsed.games.length > 0) {
        return {
          games: parsed.games,
          contact: { ...DEFAULT_CONTACT, ...(parsed.contact || {}) },
          leakGuessing: { ...DEFAULT_LEAK, ...(parsed.leakGuessing || {}) },
          chartData: parsed.chartData || generateInitialChartData(),
          adminPin: parsed.adminPin || '7860',
        };
      }
    }
  } catch (err) {
    console.error('Failed to load state from localStorage', err);
  }

  const initial: AppState = {
    games: DEFAULT_GAMES,
    contact: DEFAULT_CONTACT,
    leakGuessing: DEFAULT_LEAK,
    chartData: generateInitialChartData(),
    adminPin: '7860',
  };

  saveAppState(initial);
  return initial;
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
}

export function resetAppState(): AppState {
  const initial: AppState = {
    games: DEFAULT_GAMES,
    contact: DEFAULT_CONTACT,
    leakGuessing: DEFAULT_LEAK,
    chartData: generateInitialChartData(),
    adminPin: '7860',
  };
  saveAppState(initial);
  return initial;
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  // Strip non-digits
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedMsg = encodeURIComponent(message || 'Hello');
  return `https://wa.me/${finalPhone}?text=${encodedMsg}`;
}

// Built-in Web Audio Sound FX
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playResultAnnouncementSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Chime chords: C5, E5, G5, C6
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.001, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.5);
    });
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}

export function playClickBeep(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    // Ignore audio error
  }
}
