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
  proficiencies: 'rf_proficiencies',
  reflections: 'rf_reflections',
  modules: 'rf_modules',
  assignments: 'rf_assignments',
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

// ── NMC proficiencies ──────────────────────────────────────────────────────────

export type ProficiencyStatus = 'not-started' | 'in-progress' | 'signed-off';

/** The seven platforms of the NMC Future Nurse standards of proficiency */
export const NMC_PLATFORMS = [
  { id: 'p1', label: 'Being an accountable professional' },
  { id: 'p2', label: 'Promoting health and preventing ill health' },
  { id: 'p3', label: 'Assessing needs and planning care' },
  { id: 'p4', label: 'Providing and evaluating care' },
  { id: 'p5', label: 'Leading and managing nursing care, working in teams' },
  { id: 'p6', label: 'Improving safety and quality of care' },
  { id: 'p7', label: 'Coordinating care' },
] as const;

export type ProficiencyMap = Record<string, ProficiencyStatus>;

export function getProficiencies(): ProficiencyMap {
  return load<ProficiencyMap>(TRACKING_KEYS.proficiencies, {});
}

export function setProficiency(id: string, status: ProficiencyStatus): ProficiencyMap {
  const next = { ...getProficiencies(), [id]: status };
  save(TRACKING_KEYS.proficiencies, next);
  return next;
}

// ── Reflections ────────────────────────────────────────────────────────────────

export interface Reflection {
  id: string;
  date: string;   // YYYY-MM-DD
  title: string;
  body: string;
}

export function getReflections(): Reflection[] {
  return load<Reflection[]>(TRACKING_KEYS.reflections, [])
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function addReflection(entry: Omit<Reflection, 'id'>): Reflection[] {
  const all = getReflections();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  all.unshift({ ...entry, id });
  save(TRACKING_KEYS.reflections, all);
  return getReflections();
}

export function removeReflection(id: string): Reflection[] {
  const all = getReflections().filter(r => r.id !== id);
  save(TRACKING_KEYS.reflections, all);
  return all;
}

// ── Degree: modules and grades ─────────────────────────────────────────────────

export interface DegreeModule {
  id: string;
  name: string;
  credits: number;
  /** Percentage mark, or null while the module is still in progress */
  grade: number | null;
  year: number;
}

/** Credits in a standard three-year UK BSc (Hons) */
export const DEFAULT_CREDIT_TARGET = 360;
/** UK pass mark for an undergraduate module */
export const PASS_MARK = 40;

export function getModules(): DegreeModule[] {
  return load<DegreeModule[]>(TRACKING_KEYS.modules, [])
    .slice()
    .sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));
}

export function addModule(mod: Omit<DegreeModule, 'id'>): DegreeModule[] {
  const all = getModules();
  all.push({ ...mod, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` });
  save(TRACKING_KEYS.modules, all);
  return getModules();
}

export function removeModule(id: string): DegreeModule[] {
  const all = getModules().filter(m => m.id !== id);
  save(TRACKING_KEYS.modules, all);
  return all;
}

/** UK honours classification for a weighted average mark */
export function classify(average: number): string {
  if (average >= 70) return 'First';
  if (average >= 60) return 'Upper second (2:1)';
  if (average >= 50) return 'Lower second (2:2)';
  if (average >= 40) return 'Third';
  return 'Below pass';
}

// ── Degree: assignments ────────────────────────────────────────────────────────

export interface Assignment {
  id: string;
  title: string;
  module: string;
  due: string;     // YYYY-MM-DD
  done: boolean;
}

export function getAssignments(): Assignment[] {
  return load<Assignment[]>(TRACKING_KEYS.assignments, [])
    .slice()
    .sort((a, b) => a.due.localeCompare(b.due));
}

export function addAssignment(a: Omit<Assignment, 'id' | 'done'>): Assignment[] {
  const all = getAssignments();
  all.push({ ...a, done: false, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` });
  save(TRACKING_KEYS.assignments, all);
  return getAssignments();
}

export function toggleAssignment(id: string): Assignment[] {
  const all = getAssignments().map(a => (a.id === id ? { ...a, done: !a.done } : a));
  save(TRACKING_KEYS.assignments, all);
  return all;
}

export function removeAssignment(id: string): Assignment[] {
  const all = getAssignments().filter(a => a.id !== id);
  save(TRACKING_KEYS.assignments, all);
  return all;
}
