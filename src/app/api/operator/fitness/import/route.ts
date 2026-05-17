import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { parseAppleHealthExport, type ImportedFitnessReading } from '@/lib/appleHealth'

type FitnessRow = {
  id: string
  date: string
  weight: number
  bmi: number
  body_fat: number
  water: number
  muscle_mass: number
  bone_mass: number
}

function authed(req: NextRequest) {
  const pw = req.headers.get('x-operator-pw') ?? ''
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026')
}

function toRowDateKey(value: string) {
  return value.slice(0, 10)
}

function mergeMetric(current: number, incoming: number) {
  return incoming > 0 ? incoming : current
}

function mergeReading(existing: FitnessRow, incoming: ImportedFitnessReading) {
  return {
    date: incoming.date,
    weight: incoming.weight || existing.weight,
    bmi: mergeMetric(existing.bmi, incoming.bmi),
    body_fat: mergeMetric(existing.body_fat, incoming.bodyFat),
    water: mergeMetric(existing.water, incoming.water),
    muscle_mass: mergeMetric(existing.muscle_mass, incoming.muscleMass),
    bone_mass: mergeMetric(existing.bone_mass, incoming.boneMass),
  }
}

function hasChanged(existing: FitnessRow, merged: ReturnType<typeof mergeReading>) {
  return (
    toRowDateKey(existing.date) !== toRowDateKey(merged.date) ||
    Number(existing.weight) !== Number(merged.weight) ||
    Number(existing.bmi) !== Number(merged.bmi) ||
    Number(existing.body_fat) !== Number(merged.body_fat) ||
    Number(existing.water) !== Number(merged.water) ||
    Number(existing.muscle_mass) !== Number(merged.muscle_mass) ||
    Number(existing.bone_mass) !== Number(merged.bone_mass)
  )
}

export async function POST(req: NextRequest) {
  if (!authed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let xml = ''

  try {
    const form = await req.formData()
    const upload = form.get('file')
    if (!(upload instanceof File)) {
      return NextResponse.json({ error: 'Missing export.xml file' }, { status: 400 })
    }

    xml = await upload.text()
  } catch {
    return NextResponse.json({ error: 'Invalid upload payload' }, { status: 400 })
  }

  const imported = parseAppleHealthExport(xml)
  if (imported.length === 0) {
    return NextResponse.json(
      { error: 'No Apple Health body measurements found in export.xml' },
      { status: 400 },
    )
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('operator_fitness_readings')
      .select('id, date, weight, bmi, body_fat, water, muscle_mass, bone_mass')
      .order('date', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message, setup_required: true }, { status: 500 })
    }

    const existing = (data ?? []) as FitnessRow[]
    const byDay = new Map(existing.map((row) => [toRowDateKey(row.date), row]))

    const inserts: Array<Record<string, string | number>> = []
    const updates: Array<{ id: string; values: ReturnType<typeof mergeReading> }> = []
    let skippedCount = 0

    for (const reading of imported) {
      const existingRow = byDay.get(reading.date)
      if (!existingRow) {
        inserts.push({
          date: reading.date,
          weight: reading.weight,
          bmi: reading.bmi,
          body_fat: reading.bodyFat,
          water: reading.water,
          muscle_mass: reading.muscleMass,
          bone_mass: reading.boneMass,
        })
        continue
      }

      const merged = mergeReading(existingRow, reading)
      if (hasChanged(existingRow, merged)) {
        updates.push({ id: existingRow.id, values: merged })
      } else {
        skippedCount += 1
      }
    }

    if (inserts.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from('operator_fitness_readings')
        .insert(inserts)

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }
    }

    if (updates.length > 0) {
      for (const update of updates) {
        const { error: updateError } = await supabaseAdmin
          .from('operator_fitness_readings')
          .update(update.values)
          .eq('id', update.id)

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 500 })
        }
      }
    }

    return NextResponse.json({
      ok: true,
      importedCount: imported.length,
      insertedCount: inserts.length,
      updatedCount: updates.length,
      skippedCount,
      firstImportedDate: imported[0]?.date ?? null,
      lastImportedDate: imported[imported.length - 1]?.date ?? null,
    })
  } catch {
    return NextResponse.json({ error: 'import_failed' }, { status: 500 })
  }
}
