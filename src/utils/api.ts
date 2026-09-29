import { AppState, Game, ContactSettings, LeakGuessing, ChartMonthData } from '../types';
import { loadAppState, saveAppState } from './storage';

export async function fetchServerState(): Promise<AppState | null> {
  try {
    const res = await fetch('/api/state', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch state: ${res.statusText}`);
    }
    const json = await res.json();
    if (json.success && json.data) {
      const serverData = json.data;
      const local = loadAppState();
      const merged: AppState = {
        games: serverData.games || local.games,
        contact: serverData.contact || local.contact,
        leakGuessing: serverData.leakGuessing || local.leakGuessing,
        chartData: serverData.chartData || local.chartData,
        adminPin: local.adminPin || '7860',
      };
      saveAppState(merged);
      return merged;
    }
  } catch (err) {
    console.warn('Network fetch from /api/state failed, using offline cache', err);
  }
  return null;
}

export async function apiOpenResult(
  pin: string,
  gameId: string,
  resultNumber: string,
  targetPeriod: 'today' | 'yesterday' = 'today'
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const res = await fetch('/api/open-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, gameId, resultNumber, targetPeriod }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function apiSaveGame(
  pin: string,
  game: Partial<Game>
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, game }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function apiDeleteGame(
  pin: string,
  gameId: string
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const res = await fetch(`/api/games/${encodeURIComponent(gameId)}?pin=${encodeURIComponent(pin)}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function apiSaveContact(
  pin: string,
  contact: ContactSettings
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, contact }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function apiSaveLeak(
  pin: string,
  leak: LeakGuessing
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const res = await fetch('/api/leak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, leak }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function apiChangePin(
  currentPin: string,
  newPin: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/change-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPin, newPin }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, message: err.message || 'Server error' };
  }
}

export async function apiResetServerState(pin: string): Promise<{ success: boolean; data?: any }> {
  try {
    const res = await fetch('/api/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false };
  }
}

export async function apiLikeWebsite(): Promise<{ success: boolean; likesCount?: number }> {
  try {
    const res = await fetch('/api/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false };
  }
}

export const DEFAULT_SITE_URL = 'https://ais-pre-basunremm5pts4vuvm7wkm-118846331490.asia-east1.run.app';

export function getActiveWebsiteUrl(preferredUrl?: string): string {
  if (preferredUrl && preferredUrl.trim().length > 0 && !preferredUrl.includes('gamer.gd')) {
    return preferredUrl.trim();
  }
  return DEFAULT_SITE_URL;
}

/**
 * Universal Website Share Utility:
 * - Uses navigator.share on mobile if supported
 * - Copies link to clipboard
 * - Returns whether share succeeded or fallback was used
 */
export async function shareWebsiteUrl(
  customTitle?: string,
  customUrl?: string
): Promise<{ shared: boolean; copied: boolean }> {
  const shareUrl = getActiveWebsiteUrl(customUrl);
  const shareTitle = customTitle || '👑 SATTA KING 777 FAST LIVE RESULT';
  const shareText = `👑 SATTA KING 777 FAST LIVE RESULT 👑\nदिसावर, गली, फरीदाबाद, गाजियाबाद का सबसे तेज पक्का लाइव रिजल्ट यहाँ देखें:\n👉 ${shareUrl}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      });
      return { shared: true, copied: false };
    } catch (e: any) {
      // User cancelled or share dismissed
      if (e.name === 'AbortError') {
        return { shared: false, copied: false };
      }
    }
  }

  // Fallback: Copy to clipboard
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      return { shared: false, copied: true };
    }
  } catch {
    // ignore
  }

  return { shared: false, copied: false };
}

export function getWhatsAppShareUrl(customUrl?: string): string {
  const targetUrl = getActiveWebsiteUrl(customUrl);
  const text = `👑 *SATTA KING 777 FAST LIVE RESULT* 👑\n\nदिसावर, गली, फरीदाबाद, गाजियाबाद का सबसे तेज पक्का रिजल्ट देखने के लिए लिंक पर क्लिक करें:\n👉 ${targetUrl}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}
