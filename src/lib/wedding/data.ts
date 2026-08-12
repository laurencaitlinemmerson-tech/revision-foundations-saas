import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  DEFAULT_WEDDING_SETTINGS,
  type WeddingContact,
  type WeddingCost,
  type WeddingSettings,
  type WeddingSnapshot,
  type WeddingTask,
} from './types';

/* Every read is best-effort, same as the operator dashboard: a missing
   table degrades that one section rather than taking the page down, so
   the hub still renders before the migration has been run. */

type Row = Record<string, unknown>;

let cachedClient: SupabaseClient | null | undefined;

function getClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cachedClient =
    url && serviceRoleKey
      ? createClient(url, serviceRoleKey, { auth: { persistSession: false } })
      : null;
  return cachedClient;
}

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function nullableStr(value: unknown): string | null {
  return typeof value === 'string' && value.length ? value : null;
}

function num(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isoDay(value: unknown): string | null {
  const raw = nullableStr(value);
  return raw ? raw.slice(0, 10) : null;
}

async function readSettings(client: SupabaseClient) {
  try {
    const { data, error } = await client
      .from('wedding_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) return { settings: DEFAULT_WEDDING_SETTINGS, missing: true };
    if (!data) return { settings: DEFAULT_WEDDING_SETTINGS, missing: false };

    const row = data as Row;
    return {
      settings: {
        brideName: str(row.bride_name),
        partnerName: str(row.partner_name),
        weddingDate: isoDay(row.wedding_date),
        venue: str(row.venue),
        henDate: isoDay(row.hen_date),
        henLocation: str(row.hen_location),
        budgetCap: num(row.budget_cap),
        currency: str(row.currency, 'GBP'),
      } satisfies WeddingSettings,
      missing: false,
    };
  } catch {
    return { settings: DEFAULT_WEDDING_SETTINGS, missing: true };
  }
}

async function readTasks(client: SupabaseClient) {
  try {
    const { data, error } = await client
      .from('wedding_tasks')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) return { tasks: [] as WeddingTask[], missing: true };

    return {
      tasks: (data ?? []).map((raw): WeddingTask => {
        const row = raw as Row;
        return {
          id: String(row.id),
          title: str(row.title),
          phase: str(row.phase, 'Anytime'),
          dueDate: isoDay(row.due_date),
          done: row.done === true,
          isHen: row.is_hen === true,
          notes: nullableStr(row.notes),
          sortOrder: num(row.sort_order) ?? 0,
        };
      }),
      missing: false,
    };
  } catch {
    return { tasks: [] as WeddingTask[], missing: true };
  }
}

async function readContacts(client: SupabaseClient) {
  try {
    const { data, error } = await client
      .from('wedding_contacts')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) return { contacts: [] as WeddingContact[], missing: true };

    return {
      contacts: (data ?? []).map((raw): WeddingContact => {
        const row = raw as Row;
        return {
          id: String(row.id),
          name: str(row.name),
          kind: row.kind === 'vendor' ? 'vendor' : 'party',
          role: str(row.role),
          phone: nullableStr(row.phone),
          email: nullableStr(row.email),
          detail: nullableStr(row.detail),
          attendingHen: row.attending_hen === true,
        };
      }),
      missing: false,
    };
  } catch {
    return { contacts: [] as WeddingContact[], missing: true };
  }
}

async function readCosts(client: SupabaseClient) {
  try {
    const { data, error } = await client
      .from('wedding_costs')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) return { costs: [] as WeddingCost[], missing: true };

    return {
      costs: (data ?? []).map((raw): WeddingCost => {
        const row = raw as Row;
        return {
          id: String(row.id),
          label: str(row.label),
          amount: num(row.amount) ?? 0,
          payer: str(row.payer, 'me'),
          paid: row.paid === true,
          isHen: row.is_hen === true,
          dueDate: isoDay(row.due_date),
        };
      }),
      missing: false,
    };
  } catch {
    return { costs: [] as WeddingCost[], missing: true };
  }
}

export async function loadWeddingSnapshot(): Promise<WeddingSnapshot> {
  const client = getClient();
  const generatedAt = new Date().toISOString();

  if (!client) {
    return {
      generatedAt,
      setupRequired: true,
      settings: DEFAULT_WEDDING_SETTINGS,
      tasks: [],
      contacts: [],
      costs: [],
    };
  }

  const [settingsResult, taskResult, contactResult, costResult] = await Promise.all([
    readSettings(client),
    readTasks(client),
    readContacts(client),
    readCosts(client),
  ]);

  return {
    generatedAt,
    // Only call it "not set up" when nothing at all is reachable —
    // one missing table shouldn't hide a hub that otherwise works.
    setupRequired:
      settingsResult.missing && taskResult.missing && contactResult.missing && costResult.missing,
    settings: settingsResult.settings,
    tasks: taskResult.tasks,
    contacts: contactResult.contacts,
    costs: costResult.costs,
  };
}
