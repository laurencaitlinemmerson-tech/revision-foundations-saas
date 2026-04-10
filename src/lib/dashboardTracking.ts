// Storage utilities for new dashboard features

export const TRACKING_KEYS = {
  recentPages: 'rf_recent_pages',
  placementDate: 'rf_placement_date',
  osceScores: 'rf_osce_scores',
  pinnedNote: 'rf_pinned_note',
} as const;

export interface RecentPage {
  title: string;
  href: string;
  timestamp: number;
}

export interface OsceScore {
  date: string; // YYYY-MM-DD
  score: number; // 0–100
  stationName: string;
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function getRecentPages(): RecentPage[] {
  return load<RecentPage[]>(TRACKING_KEYS.recentPages, []);
}

export function trackPageVisit(title: string, href: string): void {
  const pages = getRecentPages().filter(p => p.href !== href);
  pages.unshift({ title, href, timestamp: Date.now() });
  save(TRACKING_KEYS.recentPages, pages.slice(0, 3));
}

export function getPlacementDate(): string | null {
  return load<string | null>(TRACKING_KEYS.placementDate, null);
}

export function setPlacementDate(date: string): void {
  save(TRACKING_KEYS.placementDate, date);
}

export function getOsceScores(): OsceScore[] {
  return load<OsceScore[]>(TRACKING_KEYS.osceScores, []);
}

export function addOsceScore(score: number, stationName: string): void {
  const scores = getOsceScores();
  const today = new Date().toISOString().split('T')[0];
  scores.push({ date: today, score, stationName });
  save(TRACKING_KEYS.osceScores, scores.slice(-10));
}

export function getPinnedNote(): string {
  return load<string>(TRACKING_KEYS.pinnedNote, '');
}

export function savePinnedNote(note: string): void {
  save(TRACKING_KEYS.pinnedNote, note);
}
