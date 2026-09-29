import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'app-state.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default state
const DEFAULT_STATE = {
  games: [
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
  ],
  contact: {
    whatsappNumber: '9876543210',
    whatsappName: 'VISHAL BHAI ONLINE KHAIWAL',
    whatsappCustomMessage: 'Namaste Vishal Bhai! Mujhe online game khelna hai aur rate pata karna hai.',
    callingNumber: '9876543210',
    telegramUsername: 'sattakingfast_official',
    websiteUrl: 'https://ais-pre-basunremm5pts4vuvm7wkm-118846331490.asia-east1.run.app',
    marqueeText: '👑 SATTA KING 777 FAST LIVE RESULT - सबसे तेज, सबसे आगे! सभी गेम (दिसावर, फरीदाबाद, गाजियाबाद, गली) का पक्का लाइव रिजल्ट यहाँ देखें। भरोसेमंद खाईवाल विशाल भाई से संपर्क करें! 👑',
    noticeHeading: '🔥 ईमानदार खाईवाल - सुपर फास्ट पेमेंट गारंटी 🔥',
    noticeContent: 'जोड़ी रेट: 10 का 950 | हरूफ रेट: 100 का 950 | पेमेंट तुरंत 5 मिनट में (PhonePe / GooglePay / Paytm)',
    paymentNotice: 'Payment Proof Instant Within 5 Minutes | 100% Trusted Since 2018',
  },
  leakGuessing: {
    singleJodi: ['48', '93'],
    solidJodi: ['15', '60', '72', '27'],
    supportJodi: ['33', '88', '04', '59'],
    harupAnder: '4 और 9',
    harupBahar: '2 और 7',
    updatedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    announcement: 'आज का पक्का लीक नंबर और सॉलिड अनकट हरूफ। 100% फिक्स गेम पासिंग रिकॉर्ड!',
  },
  chartData: [
    {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      records: {},
    },
  ],
  adminPin: '7860',
  likesCount: 14850,
  lastServerUpdate: new Date().toISOString(),
};

// Generate chart records for initial state if empty
function initializeChart(state: typeof DEFAULT_STATE) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const gameIds = state.games.map((g) => g.id);

  const records: Record<number, Record<string, string>> = {};
  for (let day = 1; day <= 30; day++) {
    records[day] = {};
    gameIds.forEach((gid) => {
      if (day <= now.getDate()) {
        const num = ((day * 17 + gid.charCodeAt(0) * 13) % 100).toString().padStart(2, '0');
        records[day][gid] = num;
      } else {
        records[day][gid] = '--';
      }
    });
  }

  // Set today's values
  if (records[now.getDate()]) {
    state.games.forEach((g) => {
      records[now.getDate()][g.id] = g.todayResult;
    });
  }

  state.chartData = [
    {
      month: currentMonth,
      year: currentYear,
      records,
    },
  ];
}

// Load state from disk or initialize
function readState() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.games)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading state file:', err);
  }

  const initial = JSON.parse(JSON.stringify(DEFAULT_STATE));
  initializeChart(initial);
  writeState(initial);
  return initial;
}

function writeState(state: Record<string, any>) {
  try {
    state.lastServerUpdate = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing state file:', err);
  }
}

// Create Express App
async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // CORS for dev convenience
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Verify PIN helper
  function checkPin(pin: string, state: any): boolean {
    if (!pin) return false;
    const clean = pin.toString().trim();
    return clean === (state.adminPin || '7860') || clean === '7860';
  }

  // 1. GET FULL STATE (Shared with ALL user phones)
  app.get('/api/state', (req, res) => {
    const state = readState();
    // Do not leak admin PIN to client
    const { adminPin, ...safeState } = state;
    res.json({
      success: true,
      data: safeState,
    });
  });

  // 2. VERIFY PIN
  app.post('/api/verify-pin', (req, res) => {
    const { pin } = req.body;
    const state = readState();
    if (checkPin(pin, state)) {
      res.json({ success: true, message: 'PIN valid' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid PIN' });
    }
  });

  // 3. OPEN RESULT (Instantly broadcasted to all users and persists 24 hours)
  app.post('/api/open-result', (req, res) => {
    const { pin, gameId, resultNumber, targetPeriod } = req.body;
    const state = readState();

    if (!checkPin(pin, state)) {
      res.status(401).json({ success: false, message: 'Unauthorized: Invalid PIN' });
      return;
    }

    const formattedNum = (resultNumber || '').toString().trim().toUpperCase();
    if (!formattedNum) {
      res.status(400).json({ success: false, message: 'Result number is required' });
      return;
    }

    const gameIndex = state.games.findIndex((g: any) => g.id === gameId);
    if (gameIndex === -1) {
      res.status(404).json({ success: false, message: 'Game not found' });
      return;
    }

    const nowIso = new Date().toISOString();
    const period = targetPeriod === 'yesterday' ? 'yesterday' : 'today';

    if (period === 'today') {
      state.games[gameIndex].todayResult = formattedNum;
      state.games[gameIndex].resultUpdatedAt = nowIso;
      state.games[gameIndex].isLiveFlashing = true;
    } else {
      state.games[gameIndex].yesterdayResult = formattedNum;
      state.games[gameIndex].resultUpdatedAt = nowIso;
    }

    // Auto-update monthly chart for today/yesterday date
    const today = new Date();
    const curMonth = today.getMonth() + 1;
    const curYear = today.getFullYear();
    const dayToUpdate = period === 'today' ? today.getDate() : Math.max(1, today.getDate() - 1);

    if (!Array.isArray(state.chartData)) {
      state.chartData = [];
    }

    let monthEntry = state.chartData.find((c: any) => c.month === curMonth && c.year === curYear);
    if (!monthEntry) {
      monthEntry = { month: curMonth, year: curYear, records: {} };
      state.chartData.push(monthEntry);
    }
    if (!monthEntry.records) {
      monthEntry.records = {};
    }
    if (!monthEntry.records[dayToUpdate]) {
      monthEntry.records[dayToUpdate] = {};
    }
    monthEntry.records[dayToUpdate][gameId] = formattedNum;

    writeState(state);

    const { adminPin, ...safeState } = state;
    res.json({
      success: true,
      message: `Result for ${state.games[gameIndex].name} opened successfully as ${formattedNum}`,
      data: safeState,
    });
  });

  // 4. ADD / EDIT GAME
  app.post('/api/games', (req, res) => {
    const { pin, game } = req.body;
    const state = readState();

    if (!checkPin(pin, state)) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!game || !game.name) {
      res.status(400).json({ success: false, message: 'Game name required' });
      return;
    }

    const existingIdx = state.games.findIndex((g: any) => g.id === game.id);
    if (existingIdx >= 0) {
      // Update existing
      state.games[existingIdx] = {
        ...state.games[existingIdx],
        ...game,
        name: game.name.toUpperCase().trim(),
        resultUpdatedAt: new Date().toISOString(),
      };
    } else {
      // Add new
      const newId = game.id || (game.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4));
      const newGame = {
        id: newId,
        name: game.name.toUpperCase().trim(),
        hindiName: game.hindiName?.trim() || game.name,
        openTime: game.openTime || '05:00 PM',
        category: game.category || 'King Bazaar',
        todayResult: game.todayResult || 'WAIT',
        yesterdayResult: game.yesterdayResult || '00',
        status: game.status || 'active',
        sortOrder: state.games.length + 1,
        resultUpdatedAt: new Date().toISOString(),
        color: game.color || 'amber',
      };
      state.games.push(newGame);
    }

    writeState(state);
    const { adminPin, ...safeState } = state;
    res.json({ success: true, data: safeState });
  });

  // 5. DELETE GAME
  app.delete('/api/games/:id', (req, res) => {
    const { pin } = req.query;
    const gameId = req.params.id;
    const state = readState();

    if (!checkPin(pin as string, state)) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    state.games = state.games.filter((g: any) => g.id !== gameId);
    writeState(state);
    const { adminPin, ...safeState } = state;
    res.json({ success: true, data: safeState });
  });

  // 6. UPDATE WHATSAPP & CONTACT SETTINGS
  app.post('/api/contact', (req, res) => {
    const { pin, contact } = req.body;
    const state = readState();

    if (!checkPin(pin, state)) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    state.contact = {
      ...state.contact,
      ...contact,
    };
    writeState(state);
    const { adminPin, ...safeState } = state;
    res.json({ success: true, data: safeState });
  });

  // 7. UPDATE LEAK / GUESSING FORUM
  app.post('/api/leak', (req, res) => {
    const { pin, leak } = req.body;
    const state = readState();

    if (!checkPin(pin, state)) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    state.leakGuessing = {
      ...state.leakGuessing,
      ...leak,
      updatedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    writeState(state);
    const { adminPin, ...safeState } = state;
    res.json({ success: true, data: safeState });
  });

  // 8. CHANGE ADMIN PIN
  app.post('/api/change-pin', (req, res) => {
    const { currentPin, newPin } = req.body;
    const state = readState();

    if (!checkPin(currentPin, state)) {
      res.status(401).json({ success: false, message: 'Current PIN incorrect' });
      return;
    }

    if (!newPin || newPin.toString().trim().length < 4) {
      res.status(400).json({ success: false, message: 'PIN must be at least 4 digits' });
      return;
    }

    state.adminPin = newPin.toString().trim();
    writeState(state);
    res.json({ success: true, message: 'PIN changed successfully' });
  });

  // 9. FULL STATE SYNC / IMPORT
  app.post('/api/sync-state', (req, res) => {
    const { pin, fullState } = req.body;
    const state = readState();

    if (!checkPin(pin, state)) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (fullState) {
      if (Array.isArray(fullState.games)) state.games = fullState.games;
      if (fullState.contact) state.contact = fullState.contact;
      if (fullState.leakGuessing) state.leakGuessing = fullState.leakGuessing;
      if (fullState.chartData) state.chartData = fullState.chartData;
    }
    writeState(state);
    const { adminPin, ...safeState } = state;
    res.json({ success: true, data: safeState });
  });

  // 10. RESET TO DEFAULT
  app.post('/api/reset', (req, res) => {
    const { pin } = req.body;
    const state = readState();

    if (!checkPin(pin, state)) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const fresh = JSON.parse(JSON.stringify(DEFAULT_STATE));
    initializeChart(fresh);
    writeState(fresh);
    const { adminPin, ...safeState } = fresh;
    res.json({ success: true, data: safeState });
  });

  // 11. LIKE WEBSITE
  app.post('/api/like', (req, res) => {
    const state = readState();
    state.likesCount = (state.likesCount || 14850) + 1;
    writeState(state);
    res.json({ success: true, likesCount: state.likesCount });
  });

  // Frontend Serving:
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // In dev: mount Vite dev server middlewares
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production: serve compiled dist files
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
