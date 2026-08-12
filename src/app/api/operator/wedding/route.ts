import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { hasOperatorAccess } from '@/lib/operator/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* ============================================================
   Wedding hub writes
   ============================================================
   Tasks, contacts and costs are all "a list of rows you add, edit and
   delete", so they share one endpoint rather than three near-identical
   ones. The collection is named in the body and mapped to a table +
   column map here; anything not in the map is dropped rather than
   passed through to the database.
   ============================================================ */

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .nullable();

const taskFields = z.object({
  title: z.string().min(1).max(200).optional(),
  phase: z.string().min(1).max(60).optional(),
  dueDate: isoDate.optional(),
  done: z.boolean().optional(),
  isHen: z.boolean().optional(),
  notes: z.string().max(2000).nullable().optional(),
  sortOrder: z.number().int().min(0).max(10_000).optional(),
});

const contactFields = z.object({
  name: z.string().min(1).max(120).optional(),
  kind: z.enum(['party', 'vendor']).optional(),
  role: z.string().max(120).optional(),
  phone: z.string().max(60).nullable().optional(),
  email: z.string().max(200).nullable().optional(),
  detail: z.string().max(2000).nullable().optional(),
  attendingHen: z.boolean().optional(),
});

const costFields = z.object({
  label: z.string().min(1).max(200).optional(),
  amount: z.number().min(0).max(1_000_000).optional(),
  payer: z.string().max(120).optional(),
  paid: z.boolean().optional(),
  isHen: z.boolean().optional(),
  dueDate: isoDate.optional(),
});

const settingsFields = z.object({
  brideName: z.string().max(120).optional(),
  partnerName: z.string().max(120).optional(),
  weddingDate: isoDate.optional(),
  venue: z.string().max(200).optional(),
  henDate: isoDate.optional(),
  henLocation: z.string().max(200).optional(),
  budgetCap: z.number().min(0).max(1_000_000).nullable().optional(),
  currency: z.string().length(3).optional(),
});

const COLLECTIONS = {
  tasks: {
    table: 'wedding_tasks',
    schema: taskFields,
    columns: {
      title: 'title',
      phase: 'phase',
      dueDate: 'due_date',
      done: 'done',
      isHen: 'is_hen',
      notes: 'notes',
      sortOrder: 'sort_order',
    } as Record<string, string>,
    required: ['title'],
  },
  contacts: {
    table: 'wedding_contacts',
    schema: contactFields,
    columns: {
      name: 'name',
      kind: 'kind',
      role: 'role',
      phone: 'phone',
      email: 'email',
      detail: 'detail',
      attendingHen: 'attending_hen',
    } as Record<string, string>,
    required: ['name'],
  },
  costs: {
    table: 'wedding_costs',
    schema: costFields,
    columns: {
      label: 'label',
      amount: 'amount',
      payer: 'payer',
      paid: 'paid',
      isHen: 'is_hen',
      dueDate: 'due_date',
    } as Record<string, string>,
    required: ['label'],
  },
} as const;

type CollectionKey = keyof typeof COLLECTIONS;

const bodySchema = z.object({
  collection: z.enum(['tasks', 'contacts', 'costs', 'settings']),
  /** Absent = create. Present = update that row. */
  id: z.string().uuid().optional(),
  fields: z.record(z.string(), z.unknown()),
});

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Map validated camelCase fields onto their snake_case columns. */
function toRow(fields: Record<string, unknown>, columns: Record<string, string>) {
  const row: Record<string, unknown> = {};
  for (const [field, column] of Object.entries(columns)) {
    if (fields[field] !== undefined) row[column] = fields[field];
  }
  return row;
}

export async function POST(request: NextRequest) {
  if (!(await hasOperatorAccess(request))) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const supabase = client();
  if (!supabase) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body', issues: parsed.error.issues }, { status: 400 });
  }

  const { collection, id, fields } = parsed.data;

  // The single settings row is an upsert against a fixed id, not a list.
  if (collection === 'settings') {
    const validated = settingsFields.safeParse(fields);
    if (!validated.success) {
      return NextResponse.json({ error: 'invalid_fields', issues: validated.error.issues }, { status: 400 });
    }
    const row = toRow(validated.data as Record<string, unknown>, {
      brideName: 'bride_name',
      partnerName: 'partner_name',
      weddingDate: 'wedding_date',
      venue: 'venue',
      henDate: 'hen_date',
      henLocation: 'hen_location',
      budgetCap: 'budget_cap',
      currency: 'currency',
    });
    const { error } = await supabase
      .from('wedding_settings')
      .upsert([{ id: 1, ...row, updated_at: new Date().toISOString() }], { onConflict: 'id' });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const spec = COLLECTIONS[collection as CollectionKey];
  const validated = spec.schema.safeParse(fields);
  if (!validated.success) {
    return NextResponse.json({ error: 'invalid_fields', issues: validated.error.issues }, { status: 400 });
  }

  const row = toRow(validated.data as Record<string, unknown>, spec.columns);
  if (!Object.keys(row).length) {
    return NextResponse.json({ error: 'nothing_to_write' }, { status: 400 });
  }

  if (id) {
    const { error } = await supabase.from(spec.table).update(row).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id });
  }

  // A new row needs whatever the table declares NOT NULL.
  for (const field of spec.required) {
    if (row[spec.columns[field]] === undefined) {
      return NextResponse.json({ error: `${field}_required` }, { status: 400 });
    }
  }

  const { data, error } = await supabase.from(spec.table).insert([row]).select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, id: (data as { id: string }).id }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!(await hasOperatorAccess(request))) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const supabase = client();
  if (!supabase) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  const collection = request.nextUrl.searchParams.get('collection');
  const id = request.nextUrl.searchParams.get('id');

  if (!collection || !(collection in COLLECTIONS)) {
    return NextResponse.json({ error: 'invalid_collection' }, { status: 400 });
  }
  if (!id) return NextResponse.json({ error: 'id_required' }, { status: 400 });

  const { error } = await supabase
    .from(COLLECTIONS[collection as CollectionKey].table)
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: true });
}
