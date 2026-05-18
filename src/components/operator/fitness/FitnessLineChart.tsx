'use client'

import { useMemo, useState, type ReactNode } from 'react'

interface SeriesPoint {
  date: string
  value: number
}

interface AnnotationPoint {
  date: string
  value: number
  title: string
}

interface PhaseBand {
  id: string
  label: string
  start: string
  end: string
}

interface ChartProps {
  title: ReactNode
  subtitle?: string
  points: SeriesPoint[]
  color: string
  minY?: number
  maxY?: number
  annotations?: AnnotationPoint[]
  overlays?: ReactNode
  phases?: PhaseBand[]
  secondaryPoints?: SeriesPoint[]
  secondaryColor?: string
  secondaryLabel?: string
  showRangeToggle?: boolean
  targetWeight?: number
  /** Hide any reading whose value falls below this floor (default 60). */
  minDisplayValue?: number
}

function fmtHoverDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtTickTime(time: number, spanDays: number): string {
  return new Date(time).toLocaleDateString(
    'en-GB',
    spanDays > 365
      ? { month: 'short', year: '2-digit' }
      : { day: 'numeric', month: 'short' },
  )
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function mean(values: number[]) {
  if (values.length === 0) return null
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function findPointAtOrBefore(points: SeriesPoint[], cutoffTime: number) {
  let candidate: SeriesPoint | null = null
  for (const point of points) {
    const time = new Date(point.date).getTime()
    if (time <= cutoffTime) {
      candidate = point
      continue
    }
    break
  }
  return candidate
}

function formatSignedKg(value: number | null) {
  if (value === null || !Number.isFinite(value)) return null
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}kg`
}

function shortPhaseLabel(label: string) {
  const normalized = label.toLowerCase()
  if (normalized.includes('lean')) return 'Lean'
  if (normalized.includes('bulk')) return 'Bulk'
  if (normalized.includes('fat') || normalized.includes('cut')) return 'Fat loss'
  return 'Recomp'
}

function splitByDateGap(points: SeriesPoint[], maxGapDays: number) {
  if (points.length === 0) return []

  const segments: SeriesPoint[][] = [[points[0]]]
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1]
    const current = points[i]
    const gapDays = (new Date(current.date).getTime() - new Date(prev.date).getTime()) / (24 * 60 * 60 * 1000)
    if (gapDays > maxGapDays) {
      segments.push([current])
    } else {
      segments[segments.length - 1].push(current)
    }
  }
  return segments
}

function monotonePath(points: Array<{ x: number; y: number }>) {
  if (points.length < 2) return ''
  if (points.length === 2) {
    return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} L ${points[1].x.toFixed(2)} ${points[1].y.toFixed(2)}`
  }

  const xs = points.map((point) => point.x)
  const ys = points.map((point) => point.y)
  const n = points.length
  const h = Array.from({ length: n - 1 }, (_, i) => xs[i + 1] - xs[i])
  const slopes = Array.from({ length: n - 1 }, (_, i) => (ys[i + 1] - ys[i]) / Math.max(h[i], 1e-6))
  const tangents = new Array<number>(n).fill(0)

  tangents[0] = slopes[0]
  tangents[n - 1] = slopes[n - 2]
  for (let i = 1; i < n - 1; i += 1) {
    if (slopes[i - 1] === 0 || slopes[i] === 0 || Math.sign(slopes[i - 1]) !== Math.sign(slopes[i])) {
      tangents[i] = 0
      continue
    }
    const w1 = 2 * h[i] + h[i - 1]
    const w2 = h[i] + 2 * h[i - 1]
    tangents[i] = (w1 + w2) / ((w1 / slopes[i - 1]) + (w2 / slopes[i]))
  }

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`
  for (let i = 0; i < n - 1; i += 1) {
    const dx = h[i]
    const cp1x = xs[i] + dx / 3
    const cp1y = ys[i] + (tangents[i] * dx) / 3
    const cp2x = xs[i + 1] - dx / 3
    const cp2y = ys[i + 1] - (tangents[i + 1] * dx) / 3
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${xs[i + 1].toFixed(2)} ${ys[i + 1].toFixed(2)}`
  }
  return d
}

export default function FitnessLineChart({
  title,
  subtitle,
  points,
  color,
  minY,
  maxY,
  annotations = [],
  overlays,
  phases = [],
  secondaryPoints,
  secondaryColor = '#44D9A8',
  secondaryLabel = 'monthly avg',
  showRangeToggle = false,
  targetWeight,
  minDisplayValue = 60,
}: ChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [range, setRange] = useState<'all' | '3y' | '1y' | '6m' | '30d' | '7d'>('3y')
  const w = 1120
  const h = 620
  const pad = { l: 56, r: 72, t: 40, b: 48 }
  const innerW = w - pad.l - pad.r
  const innerH = h - pad.t - pad.b

  // Drop sub-threshold readings (stones-as-kg outliers, accidental zero
  // entries, etc.) before any further filtering.
  const cleanedPoints = useMemo(
    () => points.filter((p) => Number.isFinite(p.value) && p.value >= minDisplayValue),
    [points, minDisplayValue],
  )
  const cleanedSecondary = useMemo(
    () => secondaryPoints?.filter((p) => Number.isFinite(p.value) && p.value >= minDisplayValue),
    [secondaryPoints, minDisplayValue],
  )

  const filteredPoints = useMemo(() => {
    if (range === 'all' || !cleanedPoints.length) return cleanedPoints
    const cutoff = new Date(cleanedPoints[cleanedPoints.length - 1].date)
    if (range === '3y') cutoff.setFullYear(cutoff.getFullYear() - 3)
    else if (range === '1y') cutoff.setMonth(cutoff.getMonth() - 12)
    else if (range === '6m') cutoff.setMonth(cutoff.getMonth() - 6)
    else cutoff.setDate(cutoff.getDate() - (range === '30d' ? 30 : 7))
    return cleanedPoints.filter((point) => new Date(point.date).getTime() >= cutoff.getTime())
  }, [cleanedPoints, range])

  const filteredSecondary = useMemo(() => {
    if (!cleanedSecondary?.length) return cleanedSecondary
    if (range === 'all' || !filteredPoints.length) return cleanedSecondary
    const start = new Date(filteredPoints[0].date).getTime()
    return cleanedSecondary.filter((point) => new Date(point.date).getTime() >= start)
  }, [filteredPoints, range, cleanedSecondary])

  const xMin = new Date(filteredPoints[0]?.date ?? Date.now()).getTime()
  const xMax = new Date(filteredPoints[filteredPoints.length - 1]?.date ?? Date.now()).getTime()
  const values = filteredPoints.map((point) => point.value)
  const dataLow = values.length > 0 ? Math.min(...values) - 1 : minDisplayValue
  const dataHigh = values.length > 0 ? Math.max(...values) + 1 : minDisplayValue + 20
  const low = Math.max(minY ?? dataLow, minDisplayValue)
  const high = maxY ?? dataHigh

  const xForTime = (time: number) => pad.l + ((time - xMin) / Math.max(1, xMax - xMin)) * innerW
  const x = (date: string) => xForTime(new Date(date).getTime())

  const y = (value: number) => pad.t + (1 - (value - low) / Math.max(1, high - low)) * innerH

  // The smoothed/rolling-average series is the trustworthy line. The raw
  // daily readings sit behind as small dots so the eye can see the spread
  // without overshooting into impossible lows or bridging long data gaps.
  // Bridge across long data gaps so the rolling-average line reads as one
  // continuous trajectory. A 400-day window covers natural breaks (a
  // forgotten scale, a moving month) while still splitting if the log
  // genuinely stops for more than a year.
  const secondaryPath = filteredSecondary && filteredSecondary.length >= 2
    ? splitByDateGap(filteredSecondary, 400)
      .filter((segment) => segment.length >= 2)
      .map((segment) => monotonePath(segment.map((point) => ({ x: x(point.date), y: y(point.value) }))))
      .join(' ')
    : null
  const yTicks = 4
  // Evenly-spaced date ticks, scaled to the time window so labels don't
  // bunch up at narrower ranges.
  const dayMs = 24 * 60 * 60 * 1000
  const spanDays = filteredPoints.length === 0 ? 0 : (xMax - xMin) / dayMs
  const xTickCount = spanDays === 0 ? 0
    : spanDays > 365 * 3 ? 6
    : spanDays > 365 ? 5
    : 4
  const xTickTimes = filteredPoints.length === 0 ? []
    : Array.from({ length: xTickCount }, (_, i) => {
        const ratio = i / Math.max(1, xTickCount - 1)
        return xMin + ratio * (xMax - xMin)
      })
  const hover = hoverIndex !== null ? filteredPoints[hoverIndex] : null
  const latestPoint = filteredPoints[filteredPoints.length - 1] ?? null
  const latestTime = latestPoint ? new Date(latestPoint.date).getTime() : null
  const recentWeekPoints = latestTime === null
    ? []
    : filteredPoints.filter((point) => new Date(point.date).getTime() >= latestTime - 6 * dayMs)
  const weekAverage = mean(recentWeekPoints.map((point) => point.value))
  const thirtyDayAnchor = latestTime === null ? null : findPointAtOrBefore(filteredPoints, latestTime - 30 * dayMs)
  const thirtyDayDelta = latestPoint && thirtyDayAnchor ? latestPoint.value - thirtyDayAnchor.value : null
  const rangeSpan = values.length > 0 ? Math.max(...values) - Math.min(...values) : null
  const currentTargetGap = latestPoint && targetWeight !== undefined ? latestPoint.value - targetWeight : null
  const visibleAnnotations = annotations.filter((annotation) => {
    const time = new Date(annotation.date).getTime()
    const isLatestEcho = latestPoint
      && annotation.date === latestPoint.date
      && Math.abs(annotation.value - latestPoint.value) < 0.05
    return time >= xMin && time <= xMax && !isLatestEcho
  })
  const ranges = ['all', '3y', '1y', '6m', '30d', '7d'] as const
  const ariaLabel = typeof title === 'string' ? title : 'Fitness timeline chart'
  const phaseClass = (label: string) => {
    const normalized = label.toLowerCase()
    if (normalized.includes('lean')) return 'lean'
    if (normalized.includes('bulk')) return 'bulk'
    if (normalized.includes('fat') || normalized.includes('cut')) return 'cut'
    return 'recomp'
  }
  const phaseForTime = (time: number | null) => {
    if (time === null) return null
    return phases.find((phase) => {
      const start = new Date(phase.start).getTime()
      const end = new Date(phase.end).getTime()
      return time >= start && time <= end
    }) ?? null
  }
  const hoverTime = hover ? new Date(hover.date).getTime() : null
  const hoverPhase = phaseForTime(hoverTime)
  const latestPhase = phaseForTime(latestTime)
  const hoverTargetGap = hover && targetWeight !== undefined
    ? hover.value - targetWeight
    : null
  const tipLines = [
    hoverPhase?.label ?? null,
    hoverTargetGap === null
      ? null
      : hoverTargetGap <= 0
        ? `${Math.abs(hoverTargetGap).toFixed(1)}kg under target`
        : `${hoverTargetGap.toFixed(1)}kg above target`,
  ].filter(Boolean)
  const tipWidth = 208
  const tipHeight = 50 + tipLines.length * 14
  const currentPointX = latestPoint ? x(latestPoint.date) : null
  const currentPointY = latestPoint ? y(latestPoint.value) : null
  const summaryStats = [
    {
      label: 'Current',
      value: latestPoint ? `${latestPoint.value.toFixed(1)}kg` : '—',
      note: latestPoint ? fmtHoverDate(latestPoint.date) : 'No readings',
      tone: 'primary',
    },
    {
      label: '7d average',
      value: weekAverage === null ? '—' : `${weekAverage.toFixed(1)}kg`,
      note: recentWeekPoints.length > 0 ? `${recentWeekPoints.length} readings` : 'Need more recent data',
      tone: 'neutral',
    },
    {
      label: '30d change',
      value: formatSignedKg(thirtyDayDelta) ?? '—',
      note: thirtyDayDelta === null ? 'Need at least one month of history' : 'vs 30 days earlier',
      tone: thirtyDayDelta === null ? 'neutral' : thirtyDayDelta < 0 ? 'down' : thirtyDayDelta > 0 ? 'up' : 'neutral',
    },
    {
      label: targetWeight !== undefined ? 'To target' : 'Window span',
      value: targetWeight !== undefined
        ? currentTargetGap === null
          ? '—'
          : `${Math.abs(currentTargetGap).toFixed(1)}kg`
        : rangeSpan === null
          ? '—'
          : `${rangeSpan.toFixed(1)}kg`,
      note: targetWeight !== undefined
        ? currentTargetGap === null
          ? 'No active target'
          : currentTargetGap <= 0
            ? 'At or below target'
            : 'Current gap to goal'
        : 'High to low across the selected window',
      tone: targetWeight !== undefined && currentTargetGap !== null && currentTargetGap <= 0 ? 'down' : 'neutral',
    },
  ] as const
  const phaseBands = phases.flatMap((phase) => {
    const start = new Date(phase.start).getTime()
    const end = new Date(phase.end).getTime()
    if (end < xMin || start > xMax) return []
    const xa = pad.l + ((Math.max(start, xMin) - xMin) / Math.max(1, xMax - xMin)) * innerW
    const xb = pad.l + ((Math.min(end, xMax) - xMin) / Math.max(1, xMax - xMin)) * innerW
    return [{ phase, xa, xb, width: Math.max(3, xb - xa), className: phaseClass(phase.label) }]
  })
  const phaseLabels = phaseBands.reduce<Array<{
    id: string
    label: string
    className: string
    x: number
    width: number
  }>>((acc, band) => {
    const label = shortPhaseLabel(band.phase.label)
    const width = Math.max(58, label.length * 7.2 + 20)
    if (band.width < width + 14) return acc
    const centeredX = clamp(((band.xa + band.xb) / 2) - width / 2, pad.l + 10, w - pad.r - width - 10)
    const previous = acc[acc.length - 1]
    if (previous && centeredX < previous.x + previous.width + 10) return acc
    acc.push({
      id: band.phase.id,
      label,
      className: band.className,
      x: centeredX,
      width,
    })
    return acc
  }, [])
  const annotationLayouts = visibleAnnotations.map((annotation) => {
    const cx = x(annotation.date)
    const cy = y(annotation.value)
    const placeLeft = cx > pad.l + innerW * 0.7
    const placeBelow = cy < pad.t + 54
    const textAnchor: 'start' | 'end' = placeLeft ? 'end' : 'start'
    const textX = clamp(cx + (placeLeft ? -14 : 14), pad.l + 16, w - pad.r - 16)
    const titleY = clamp(cy + (placeBelow ? 18 : -14), pad.t + 16, pad.t + innerH - 26)
    const subY = titleY + 12
    const connectorX = placeLeft ? textX + 6 : textX - 6
    const connectorY = placeBelow ? titleY - 4 : titleY + 2
    return {
      annotation,
      cx,
      cy,
      textAnchor,
      textX,
      titleY,
      subY,
      connectorX,
      connectorY,
    }
  })

  return (
    <div className="fit-panel fitness-chart-panel">
      <div className="fit-panel-head">
        <div>
          <h3>{title}</h3>
          {subtitle && <div className="meta">{subtitle}</div>}
        </div>
        {showRangeToggle && (
          <div className="bc-range-toggle" aria-label="Chart range">
            {ranges.map((item) => (
              <button key={item} type="button" className={range === item ? 'active' : ''} onClick={() => setRange(item)}>
                {item === 'all' ? 'All' : item}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="bc-clinical-strip" aria-label="Clinical summary">
        {summaryStats.map((stat) => (
          <div key={stat.label} className={`bc-clinical-cell ${stat.tone}`}>
            <div className="bc-clinical-label">{stat.label}</div>
            <div className="bc-clinical-value">{stat.value}</div>
            <div className="bc-clinical-note">{stat.note}</div>
          </div>
        ))}
      </div>
      <div className="bc-chart-wrap">
        <svg viewBox={`0 0 ${w} ${h}`} className="fitness-chart" role="img" aria-label={ariaLabel} preserveAspectRatio="xMidYMid meet">
          <rect x="0" y="0" width={w} height={h} fill="transparent" />
          <rect x={pad.l} y={pad.t} width={innerW} height={innerH} rx="10" className="bc-plot-bg" />
          {Array.from({ length: yTicks }).map((_, index) => {
            const ratio = index / (yTicks - 1)
            const value = high - (high - low) * ratio
            const py = y(value)
            return (
              <g key={index}>
                <line x1={pad.l} y1={py} x2={w - pad.r} y2={py} className="bc-grid" />
                <text x={pad.l - 8} y={py + 3} textAnchor="end" className="bc-axis-text">{value.toFixed(1)}</text>
              </g>
            )
          })}

          {phaseBands.map((band) => {
            return (
              <g key={band.phase.id}>
                <rect className={`bc-phase-band ${band.className}`} x={band.xa} y={pad.t} width={band.width} height={innerH} />
                <line className="bc-phase-divider" x1={band.xa} y1={pad.t} x2={band.xa} y2={pad.t + innerH} />
              </g>
            )
          })}
          {phaseLabels.map((label) => (
            <g key={`phase-label-${label.id}`}>
              <rect x={label.x} y={pad.t + 8} width={label.width} height={18} rx="9" className={`bc-phase-pill ${label.className}`} />
              <text x={label.x + label.width / 2} y={pad.t + 20} textAnchor="middle" className="bc-phase-label">{label.label}</text>
            </g>
          ))}
          {overlays}
          {targetWeight !== undefined && targetWeight >= low && targetWeight <= high && (
            <g>
              <line
                x1={pad.l}
                y1={y(targetWeight)}
                x2={w - pad.r}
                y2={y(targetWeight)}
                className="bc-target-line"
              />
              <text
                x={w - pad.r - 4}
                y={y(targetWeight) - 5}
                textAnchor="end"
                className="bc-axis-text bc-target-label"
              >
                TARGET {targetWeight}kg
              </text>
            </g>
          )}
          {/* Raw readings now render as scatter dots only (further down) —
              dropping the smoothed Bezier path keeps daily noise from
              creating fake undulations through the 45-day trend. */}
          {secondaryPath && <path d={secondaryPath} className="bc-line-avg" style={{ stroke: secondaryColor }} />}

          {latestPoint && (
            <g>
              <circle cx={x(latestPoint.date)} cy={y(latestPoint.value)} r="8" className="bc-latest-halo" />
              <circle cx={x(latestPoint.date)} cy={y(latestPoint.value)} r="4.5" className="bc-latest-dot" />
            </g>
          )}

          {annotationLayouts.map((layout) => {
            const { annotation, cx, cy, textAnchor, textX, titleY, subY, connectorX, connectorY } = layout
            return (
              <g key={`${annotation.title}-${annotation.date}`}>
                <line x1={cx} y1={cy} x2={connectorX} y2={connectorY} className="bc-pin-connector" />
                <circle cx={cx} cy={cy} r="4.5" className="bc-pin-dot" />
                <text
                  x={textX}
                  y={titleY}
                  textAnchor={textAnchor}
                  className="bc-pin-label"
                >
                  {annotation.title}
                </text>
                <text
                  x={textX}
                  y={subY}
                  textAnchor={textAnchor}
                  className="bc-pin-sub"
                >
                  {annotation.value.toFixed(1)}kg
                </text>
              </g>
            )
          })}

          {xTickTimes.map((time, index) => (
            <text key={`${time}-${index}`} x={xForTime(time)} y={h - 12} className="bc-x-label">{fmtTickTime(time, spanDays)}</text>
          ))}

          {/* Inline "today" label removed — the latest dot + halo already
              signal the current point, and the clinical strip above shows
              the live value. The annotation array still adds a Today /
              Latest annotation when it doesn't echo the peak. */}

          {hover && (
            <g>
              <line x1={x(hover.date)} y1={pad.t} x2={x(hover.date)} y2={h - pad.b} className="bc-current-line" />
              <circle cx={x(hover.date)} cy={y(hover.value)} r="5" className="bc-pin-dot" />
              <rect x={Math.min(w - (tipWidth + 10), x(hover.date) + 10)} y={pad.t + 8} width={tipWidth} height={tipHeight} rx="6" className="fitness-tip-box" />
              <text x={Math.min(w - tipWidth, x(hover.date) + 18)} y={pad.t + 28} className="fitness-tip">{fmtHoverDate(hover.date)}</text>
              <text x={Math.min(w - tipWidth, x(hover.date) + 18)} y={pad.t + 46} className="fitness-tip fitness-tip-strong">{hover.value.toFixed(1)}kg</text>
              {tipLines.map((line, index) => (
                <text
                  key={line}
                  x={Math.min(w - tipWidth, x(hover.date) + 18)}
                  y={pad.t + 62 + index * 14}
                  className="fitness-tip fitness-tip-meta"
                >
                  {line}
                </text>
              ))}
            </g>
          )}

          {/* Faint data dots so the user sees the underlying readings. */}
          {filteredPoints.map((point, index) => (
            <circle
              key={`dot-${point.date}-${index}`}
              cx={x(point.date)}
              cy={y(point.value)}
              r={hoverIndex === index ? 4.2 : 2.35}
              className="bc-data-dot"
              style={{ fill: hoverIndex === index ? color : 'oklch(0.34 0.03 248)', opacity: hoverIndex === index ? 0.92 : 0.18 }}
              pointerEvents="none"
            />
          ))}
          {/* Single overlay captures hover anywhere across the plot, then
              snaps to the nearest point by x. Much smoother than per-dot
              hit targets. */}
          <rect
            x={pad.l}
            y={pad.t}
            width={innerW}
            height={innerH}
            fill="transparent"
            onMouseMove={(event) => {
              if (filteredPoints.length === 0) return
              const svg = event.currentTarget.ownerSVGElement
              if (!svg) return
              const rect = svg.getBoundingClientRect()
              const localX = ((event.clientX - rect.left) / rect.width) * w
              let bestIndex = 0
              let bestDist = Infinity
              for (let i = 0; i < filteredPoints.length; i += 1) {
                const px = x(filteredPoints[i].date)
                const d = Math.abs(px - localX)
                if (d < bestDist) {
                  bestDist = d
                  bestIndex = i
                }
              }
              setHoverIndex(bestIndex)
            }}
            onMouseLeave={() => setHoverIndex(null)}
            onTouchMove={(event) => {
              if (filteredPoints.length === 0) return
              const touch = event.touches[0]
              if (!touch) return
              const svg = event.currentTarget.ownerSVGElement
              if (!svg) return
              const rect = svg.getBoundingClientRect()
              const localX = ((touch.clientX - rect.left) / rect.width) * w
              let bestIndex = 0
              let bestDist = Infinity
              for (let i = 0; i < filteredPoints.length; i += 1) {
                const px = x(filteredPoints[i].date)
                const d = Math.abs(px - localX)
                if (d < bestDist) {
                  bestDist = d
                  bestIndex = i
                }
              }
              setHoverIndex(bestIndex)
            }}
            onTouchEnd={() => setHoverIndex(null)}
            style={{ cursor: 'crosshair' }}
          />
        </svg>
        {cleanedPoints.length < points.length && (
          <p className="bc-filter-note">
            Hiding {points.length - cleanedPoints.length} reading{points.length - cleanedPoints.length === 1 ? '' : 's'} under {minDisplayValue} kg.
          </p>
        )}
      </div>
      <div className="bc-key">
        <span className="item"><i className="sw raw" />Daily readings</span>
        {secondaryPath && <span className="item"><i className="sw avg" style={{ background: secondaryColor }} />{secondaryLabel}</span>}
        {targetWeight !== undefined && <span className="item"><i className="sw target" />Target line</span>}
        <span className="item"><i className="sw phase" />Phase background</span>
      </div>
    </div>
  )
}
