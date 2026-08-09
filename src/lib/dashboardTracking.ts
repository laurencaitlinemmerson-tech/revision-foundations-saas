// Storage utilities for new dashboard features

export const TRACKING_KEYS = {
  recentPages: 'rf_recent_pages',
  placementDate: 'rf_placement_date',   // legacy — migrated on first load
  countdownDates: 'rf_countdown_dates',
  osceScores: 'rf_osce_scores',
  pinnedNote: 'rf_pinned_note',
  lastSessionPing: 'rf_last_session_ping',
  practiceShifts: 'rf_practice_shifts',
  practiceTarget: 'rf_practice_target',
} as const;

/** NMC requirement for UK pre-registration nursing programmes */
export const DEFAULT_PRACTICE_TARGET = 2300;

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
  save(TRACKING_KEYS.recentPages, pages.slice(0, 5));
  pingStudySession();
}

let pingInFlight = false;

export function pingStudySession(): void {
  if (typeof window === 'undefined') return;
  const today = new Date().toISOString().split('T')[0];
  try {
    if (localStorage.getItem(TRACKING_KEYS.lastSessionPing) === today) return;
  } catch {}
  if (pingInFlight) return;
  pingInFlight = true;
  fetch('/api/progress/session', { method: 'POST' })
    .then((res) => {
      if (res.ok) {
        try { localStorage.setItem(TRACKING_KEYS.lastSessionPing, today); } catch {}
      }
    })
    .catch(() => {})
    .finally(() => { pingInFlight = false; });
}

export function getPlacementDate(): string | null {
  return load<string | null>(TRACKING_KEYS.placementDate, null);
}

export function setPlacementDate(date: string): void {
  save(TRACKING_KEYS.placementDate, date);
}

// ── Multi-date countdowns ──────────────────────────────────────────────────

export interface CountdownDate {
  id: string;
  label: string; // e.g. "Placement", "Final exam", "Assignment"
  date: string;  // YYYY-MM-DD
}

export function getCountdownDates(): CountdownDate[] {
  const stored = load<CountdownDate[]>(TRACKING_KEYS.countdownDates, []);
  // Migrate legacy single placement date on first load
  if (stored.length === 0) {
    const legacy = getPlacementDate();
    if (legacy) {
      const migrated: CountdownDate[] = [{ id: 'placement', label: 'Placement', date: legacy }];
      save(TRACKING_KEYS.countdownDates, migrated);
      return migrated;
    }
  }
  return stored;
}

export function saveCountdownDates(dates: CountdownDate[]): void {
  save(TRACKING_KEYS.countdownDates, dates);
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

// ── Practice hours ─────────────────────────────────────────────────────────────

export interface PracticeShift {
  id: string;
  date: string;   // YYYY-MM-DD
  hours: number;
  area: string;
}

export function getPracticeShifts(): PracticeShift[] {
  return load<PracticeShift[]>(TRACKING_KEYS.practiceShifts, [])
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function addPracticeShift(shift: Omit<PracticeShift, 'id'>): PracticeShift[] {
  const shifts = getPracticeShifts();
  // Date.now() alone can collide when two shifts are added in the same tick
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  shifts.unshift({ ...shift, id });
  save(TRACKING_KEYS.practiceShifts, shifts);
  return getPracticeShifts();
}

export function removePracticeShift(id: string): PracticeShift[] {
  const shifts = getPracticeShifts().filter(s => s.id !== id);
  save(TRACKING_KEYS.practiceShifts, shifts);
  return shifts;
}

export function getPracticeTarget(): number {
  const stored = load<number>(TRACKING_KEYS.practiceTarget, DEFAULT_PRACTICE_TARGET);
  return Number.isFinite(stored) && stored > 0 ? stored : DEFAULT_PRACTICE_TARGET;
}

export function savePracticeTarget(target: number): void {
  save(TRACKING_KEYS.practiceTarget, target);
}
