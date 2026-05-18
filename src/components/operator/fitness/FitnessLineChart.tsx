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

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
}

function smoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length < 2) return ''
  if (points.length === 2) {
    return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} L ${points[1].x.toFixed(2)} ${points[1].y.toFixed(2)}`
  }

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
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
  const [range, setRange] = useState<'all' | '5y' | '2y' | '1y' | '6m'>('all')
  const w = 1100
  const h = 380
  const pad = { l: 44, r: 16, t: 30, b: 32 }
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
    const months = range === '5y' ? 60 : range === '2y' ? 24 : range === '1y' ? 12 : 6
    const cutoff = new Date(cleanedPoints[cleanedPoints.length - 1].date)
    cutoff.setMonth(cutoff.getMonth() - months)
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

  const x = (date: string) => {
    const time = new Date(date).getTime()
    return pad.l + ((time - xMin) / Math.max(1, xMax - xMin)) * innerW
  }

  const y = (value: number) => pad.t + (1 - (value - low) / Math.max(1, high - low)) * innerH

  const path = smoothPath(filteredPoints.map((point) => ({ x: x(point.date), y: y(point.value) })))
  const secondaryPath = filteredSecondary && filteredSecondary.length >= 2
    ? smoothPath(filteredSecondary.map((point) => ({ x: x(point.date), y: y(point.value) })))
    : null
  const yTicks = 5
  const xTickDates = [
    filteredPoints[0],
    filteredPoints[Math.floor(filteredPoints.length * 0.33)],
    filteredPoints[Math.floor(filteredPoints.length * 0.66)],
    filteredPoints[filteredPoints.length - 1],
  ].filter(Boolean)
  const hover = hoverIndex !== null ? filteredPoints[hoverIndex] : null
  const visibleAnnotations = annotations.filter((annotation) => {
    const time = new Date(annotation.date).getTime()
    return time >= xMin && time <= xMax
  })
  const ranges = ['all', '5y', '2y', '1y', '6m'] as const
  const ariaLabel = typeof title === 'string' ? title : 'Fitness timeline chart'
  const phaseClass = (label: string) => {
    const normalized = label.toLowerCase()
    if (normalized.includes('lean')) return 'lean'
    if (normalized.includes('bulk')) return 'bulk'
    if (normalized.includes('fat') || normalized.includes('cut')) return 'cut'
    return 'recomp'
  }

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
      <div className="bc-chart-wrap">
        <svg viewBox={`0 0 ${w} ${h}`} className="fitness-chart" role="img" aria-label={ariaLabel} preserveAspectRatio="none">
          <rect x="0" y="0" width={w} height={h} fill="transparent" />
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

          {phases.map((phase) => {
            const start = new Date(phase.start).getTime()
            const end = new Date(phase.end).getTime()
            if (end < xMin || start > xMax) return null
            const xa = pad.l + ((Math.max(start, xMin) - xMin) / Math.max(1, xMax - xMin)) * innerW
            const xb = pad.l + ((Math.min(end, xMax) - xMin) / Math.max(1, xMax - xMin)) * innerW
            return (
              <g key={phase.id}>
                <rect className={`bc-phase-band ${phaseClass(phase.label)}`} x={xa} y={pad.t} width={Math.max(3, xb - xa)} height={innerH} />
                <line className="bc-phase-divider" x1={xa} y1={pad.t} x2={xa} y2={pad.t + innerH} />
                {xb - xa > 66 && <text x={xa + 10} y={pad.t + 15} className="bc-phase-label">{phase.label.toUpperCase()}</text>}
              </g>
            )
          })}
          {overlays}
          {targetWeight !== undefined && targetWeight >= low && targetWeight <= high && (
            <g>
              <line
                x1={pad.l}
                y1={y(targetWeight)}
                x2={w - pad.r}
                y2={y(targetWeight)}
                stroke="var(--good)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.7"
              />
              <text
                x={w - pad.r - 4}
                y={y(targetWeight) - 5}
                textAnchor="end"
                className="bc-axis-text"
                style={{ fill: 'var(--good)', fontWeight: 600 }}
              >
                TARGET {targetWeight}kg
              </text>
            </g>
          )}
          <path d={path} className="bc-line-raw" style={{ stroke: color }} />
          {secondaryPath && <path d={secondaryPath} className="bc-line-avg" />}

          {visibleAnnotations.map((annotation, index) => {
            const cx = x(annotation.date)
            const cy = y(annotation.value)
            const above = index % 2 === 0
            return (
              <g key={`${annotation.title}-${annotation.date}`}>
                <line x1={cx} y1={pad.t} x2={cx} y2={cy} className="bc-pin-line" />
                <circle cx={cx} cy={cy} r="4.5" className="bc-pin-dot" />
                <text
                  x={Math.min(w - 24, Math.max(pad.l + 24, cx))}
                  y={above ? pad.t + 12 : cy + 22}
                  textAnchor={cx > w - 100 ? 'end' : cx < pad.l + 80 ? 'start' : 'middle'}
                  className="bc-pin-label"
                >
                  {annotation.title}
                </text>
                <text
                  x={Math.min(w - 24, Math.max(pad.l + 24, cx))}
                  y={above ? pad.t + 25 : cy + 35}
                  textAnchor={cx > w - 100 ? 'end' : cx < pad.l + 80 ? 'start' : 'middle'}
                  className="bc-pin-sub"
                >
                  {annotation.value.toFixed(1)}kg
                </text>
              </g>
            )
          })}

          {xTickDates.map((point, index) => (
            <text key={`${point.date}-${index}`} x={x(point.date)} y={h - 12} className="bc-x-label">{fmtDate(point.date)}</text>
          ))}

          {hover && (
            <g>
              <line x1={x(hover.date)} y1={pad.t} x2={x(hover.date)} y2={h - pad.b} className="bc-current-line" />
              <circle cx={x(hover.date)} cy={y(hover.value)} r="5" className="bc-pin-dot" />
              <rect x={Math.min(w - 192, x(hover.date) + 10)} y={pad.t + 8} width="182" height="52" rx="4" className="fitness-tip-box" />
              <text x={Math.min(w - 182, x(hover.date) + 18)} y={pad.t + 28} className="fitness-tip">{new Date(hover.date).toLocaleString('en-GB')}</text>
              <text x={Math.min(w - 182, x(hover.date) + 18)} y={pad.t + 46} className="fitness-tip fitness-tip-strong">{hover.value.toFixed(1)}kg</text>
            </g>
          )}

          {/* Faint data dots so the user sees the underlying readings. */}
          {filteredPoints.map((point, index) => (
            <circle
              key={`dot-${point.date}-${index}`}
              cx={x(point.date)}
              cy={y(point.value)}
              r={hoverIndex === index ? 4 : 2.4}
              className="bc-data-dot"
              style={{ fill: hoverIndex === index ? color : 'var(--ink)', opacity: hoverIndex === index ? 1 : 0.35 }}
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
        <span className="item"><i className="sw raw" />Daily reading</span>
        {secondaryPath && <span className="item"><i className="sw avg" style={{ background: secondaryColor }} />{secondaryLabel}</span>}
        <span className="item"><i className="sw lean" />Lean phase</span>
        <span className="item"><i className="sw bulk" />Bulk</span>
        <span className="item"><i className="sw cut" />Fat loss push</span>
        <span className="item"><i className="sw recomp" />Recomposition</span>
      </div>
    </div>
  )
}
