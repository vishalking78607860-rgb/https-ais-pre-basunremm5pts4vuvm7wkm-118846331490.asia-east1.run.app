export interface Game {
  id: string;
  name: string;
  hindiName?: string;
  openTime: string; // e.g. "05:00 AM", "11:15 PM"
  time24?: string; // "05:00", "23:15"
  category: string; // e.g. "King Bazaar", "Main Delhi", "Super Fast"
  todayResult: string; // e.g. "48", "XX", "WAIT"
  yesterdayResult: string; // e.g. "72"
  status: 'active' | 'inactive';
  sortOrder: number;
  resultUpdatedAt?: string;
  isLiveFlashing?: boolean;
  color?: string; // 'amber' | 'emerald' | 'rose' | 'cyan' | 'purple'
}

export interface ContactSettings {
  whatsappNumber: string; // e.g. "9876543210"
  whatsappName: string; // "VISHAL BHAI KHAIWAL"
  whatsappCustomMessage: string;
  callingNumber: string;
  telegramUsername?: string;
  websiteUrl?: string; // e.g. "https://sattaking777.gamer.gd/"
  marqueeText: string;
  noticeHeading: string;
  noticeContent: string;
  paymentNotice: string;
}

export interface LeakGuessing {
  singleJodi: string[];
  solidJodi: string[];
  supportJodi: string[];
  harupAnder: string;
  harupBahar: string;
  updatedAt: string;
  announcement: string;
}

export interface ChartMonthData {
  month: number; // 1-12
  year: number; // e.g. 2026
  records: Record<number, Record<string, string>>; // day 1..31 -> { [gameId]: "48" }
}

export interface AppState {
  games: Game[];
  contact: ContactSettings;
  leakGuessing: LeakGuessing;
  chartData: ChartMonthData[];
  adminPin: string;
  likesCount?: number;
}
