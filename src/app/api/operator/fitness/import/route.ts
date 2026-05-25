import { NextRequest, NextResponse } from 'next/server'
import {
  listFitnessReadings,
  upsertFitnessReading,
  type FitnessReadingRecord,
} from '@/lib/operatorFitnessStorage'
import { parseAppleHealthExport, type ImportedFitnessReading } from '@/lib/appleHealth'
import { isPlausibleWeightKg } from '@/lib/fitnessValidation'

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

function mergeReading(existing: FitnessReadingRecord, incoming: ImportedFitnessReading) {
  return {
    date: incoming.date,
    weight: incoming.weight || existing.weight,
    bmi: mergeMetric(existing.bmi, incoming.bmi),
    bodyFat: mergeMetric(existing.bodyFat, incoming.bodyFat),
    water: mergeMetric(existing.water, incoming.water),
    muscleMass: mergeMetric(existing.muscleMass, incoming.muscleMass),
    boneMass: mergeMetric(existing.boneMass, incoming.boneMass),
  }
}

function hasChanged(existing: FitnessReadingRecord, merged: ReturnType<typeof mergeReading>) {
  return (
    toRowDateKey(existing.date) !== toRowDateKey(merged.date) ||
    Number(existing.weight) !== Number(merged.weight) ||
    Number(existing.bmi) !== Number(merged.bmi) ||
    Number(existing.bodyFat) !== Number(merged.bodyFat) ||
    Number(existing.water) !== Number(merged.water) ||
    Number(existing.muscleMass) !== Number(merged.muscleMass) ||
    Number(existing.boneMass) !== Number(merged.boneMass)
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
  const validImported = imported.filter((reading) => isPlausibleWeightKg(reading.weight))
  const invalidCount = imported.length - validImported.length
  if (validImported.length === 0) {
    return NextResponse.json(
      {
        error: imported.length > 0
          ? 'Apple Health export contained only implausible body-weight readings'
          : 'No Apple Health body measurements found in export.xml',
      },
      { status: 400 },
    )
  }

  try {
    const existing = await listFitnessReadings()
    if (existing.setupRequired) {
      return NextResponse.json({ error: 'fitness_storage_unavailable', setup_required: true }, { status: 500 })
    }

    const byDay = new Map(existing.readings.map((row) => [toRowDateKey(row.date), row]))

    const pending: ImportedFitnessReading[] = []
    let insertedCount = 0
    let updatedCount = 0
    let skippedCount = 0

    for (const reading of validImported) {
      const existingRow = byDay.get(reading.date)
      if (!existingRow) {
        pending.push(reading)
        insertedCount += 1
        continue
      }

      const merged = mergeReading(existingRow, reading)
      if (hasChanged(existingRow, merged)) {
        pending.push(reading)
        updatedCount += 1
      } else {
        skippedCount += 1
      }
    }

    for (const reading of pending) {
      try {
        await upsertFitnessReading({
          date: reading.date,
          weight: reading.weight,
          bmi: reading.bmi,
          bodyFat: reading.bodyFat,
          water: reading.water,
          muscleMass: reading.muscleMass,
          boneMass: reading.boneMass,
        })
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'fitness_import_failed', setup_required: true },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({
      ok: true,
      importedCount: validImported.length,
      invalidCount,
      insertedCount,
      updatedCount,
      skippedCount,
      firstImportedDate: validImported[0]?.date ?? null,
      lastImportedDate: validImported[validImported.length - 1]?.date ?? null,
    })
  } catch {
    return NextResponse.json({ error: 'import_failed' }, { status: 500 })
  }
}
