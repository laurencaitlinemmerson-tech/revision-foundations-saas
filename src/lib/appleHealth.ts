export interface ImportedFitnessReading {
  date: string
  weight: number
  bmi: number
  bodyFat: number
  water: number
  muscleMass: number
  boneMass: number
}

interface Sample {
  at: number
  value: number
}

interface DayBucket {
  weight?: Sample
  bmi?: Sample
  bodyFat?: Sample
  waterPct?: Sample
  waterMassKg?: Sample
  leanMassKg?: Sample
  boneMassKg?: Sample
  heightM?: Sample
}

const DEFAULT_HEIGHT_M = 1.5748

const BODY_METRIC_TYPES = {
  weight: 'HKQuantityTypeIdentifierBodyMass',
  bmi: 'HKQuantityTypeIdentifierBodyMassIndex',
  bodyFat: 'HKQuantityTypeIdentifierBodyFatPercentage',
  waterMass: 'HKQuantityTypeIdentifierBodyWaterMass',
  leanMass: 'HKQuantityTypeIdentifierLeanBodyMass',
  boneMass: 'HKQuantityTypeIdentifierBoneMass',
  height: 'HKQuantityTypeIdentifierHeight',
} as const

function parseAppleHealthDate(input: string): Date | null {
  const trimmed = input.trim()
  const normalized = trimmed
    .replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([+-]\d{2})(\d{2})$/, '$1T$2$3:$4')
    .replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})Z$/, '$1T$2Z')
    .replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/, '$1T$2')
  const parsed = new Date(normalized)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function toIsoDay(input: string): { day: string; at: number } | null {
  const matchedDay = input.trim().match(/^(\d{4}-\d{2}-\d{2}) /)?.[1]
  const parsed = parseAppleHealthDate(input)
  if (!parsed) return null
  return {
    day: matchedDay ?? parsed.toISOString().slice(0, 10),
    at: parsed.getTime(),
  }
}

function parseAttributes(raw: string) {
  const attrs: Record<string, string> = {}
  const attrRegex = /([A-Za-z_:][\w:.-]*)="([^"]*)"/g
  let match: RegExpExecArray | null

  while ((match = attrRegex.exec(raw)) !== null) {
    attrs[match[1]] = match[2]
  }

  return attrs
}

function round(value: number, digits = 1) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, round(value, 1)))
}

function convertMassToKg(value: number, unit: string) {
  switch ((unit ?? '').toLowerCase()) {
    case 'kg':
      return value
    case 'g':
      return value / 1000
    case 'lb':
    case 'lbs':
      return value * 0.45359237
    case 'oz':
      return value * 0.0283495231
    case 'st':
    case 'stone':
    case 'stones':
      return value * 6.35029318
    default:
      return value
  }
}

function convertHeightToMeters(value: number, unit: string) {
  switch (unit) {
    case 'm':
      return value
    case 'cm':
      return value / 100
    case 'in':
      return value * 0.0254
    case 'ft':
      return value * 0.3048
    default:
      return value
  }
}

function toPercent(value: number) {
  return value <= 1.2 ? value * 100 : value
}

function setLatest(bucket: DayBucket, key: keyof DayBucket, at: number, value: number) {
  const current = bucket[key]
  if (!current || at >= current.at) {
    bucket[key] = { at, value }
  }
}

export function parseAppleHealthExport(xml: string): ImportedFitnessReading[] {
  const recordRegex = /<Record\b([^>]*)\/>/g
  const buckets = new Map<string, DayBucket>()
  let match: RegExpExecArray | null

  while ((match = recordRegex.exec(xml)) !== null) {
    const attrs = parseAttributes(match[1] ?? '')
    const type = attrs.type
    const rawValue = Number(attrs.value)
    const unit = attrs.unit ?? ''
    const dateMeta = toIsoDay(attrs.startDate ?? attrs.endDate ?? attrs.creationDate ?? '')

    if (!type || !dateMeta || !Number.isFinite(rawValue)) continue

    const bucket = buckets.get(dateMeta.day) ?? {}
    buckets.set(dateMeta.day, bucket)

    switch (type) {
      case BODY_METRIC_TYPES.weight:
        setLatest(bucket, 'weight', dateMeta.at, round(convertMassToKg(rawValue, unit), 2))
        break
      case BODY_METRIC_TYPES.bmi:
        setLatest(bucket, 'bmi', dateMeta.at, round(rawValue, 1))
        break
      case BODY_METRIC_TYPES.bodyFat:
        setLatest(bucket, 'bodyFat', dateMeta.at, clampPercent(toPercent(rawValue)))
        break
      case BODY_METRIC_TYPES.waterMass:
        setLatest(bucket, 'waterMassKg', dateMeta.at, round(convertMassToKg(rawValue, unit), 2))
        break
      case BODY_METRIC_TYPES.leanMass:
        setLatest(bucket, 'leanMassKg', dateMeta.at, round(convertMassToKg(rawValue, unit), 2))
        break
      case BODY_METRIC_TYPES.boneMass:
        setLatest(bucket, 'boneMassKg', dateMeta.at, round(convertMassToKg(rawValue, unit), 2))
        break
      case BODY_METRIC_TYPES.height:
        setLatest(bucket, 'heightM', dateMeta.at, round(convertHeightToMeters(rawValue, unit), 3))
        break
      default:
        break
    }
  }

  return Array.from(buckets.entries())
    .map(([day, bucket]) => {
      const weight = bucket.weight?.value ?? 0
      if (!weight) return null

      const heightM = bucket.heightM?.value ?? DEFAULT_HEIGHT_M
      const bmi = bucket.bmi?.value ?? round(weight / (heightM * heightM), 1)
      const water = bucket.waterPct?.value
        ?? (bucket.waterMassKg ? clampPercent((bucket.waterMassKg.value / weight) * 100) : 0)
      const muscleMass = bucket.leanMassKg
        ? clampPercent((bucket.leanMassKg.value / weight) * 100)
        : 0

      return {
        date: day,
        weight: round(weight, 2),
        bmi,
        bodyFat: bucket.bodyFat?.value ?? 0,
        water,
        muscleMass,
        boneMass: round(bucket.boneMassKg?.value ?? 0, 2),
      } satisfies ImportedFitnessReading
    })
    .filter((reading): reading is ImportedFitnessReading => Boolean(reading))
    .sort((a, b) => a.date.localeCompare(b.date))
}
