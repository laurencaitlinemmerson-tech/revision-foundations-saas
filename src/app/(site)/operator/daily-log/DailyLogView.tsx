/**
 * Daily log — view.
 *
 * Generated from the approved redesign template: every element, inline style and
 * text node is carried across verbatim, with the template's own control flow
 * (`sc-for`, `sc-if`, `x-import`) expressed as JSX. Values come from `deriveVals`
 * via the `v` prop, so presentation stays here and arithmetic stays in logic.ts.
 *
 * Regenerate rather than hand-edit when the design changes.
 */
'use client';

import React from 'react';
import { sx } from './sx';
import ImageSlot from './ImageSlot';
import type { DailyLogVals } from './logic';
import { EnergyLedger } from '@/components/operator/fitness/EnergyLedger';
import { ProteinRecovery } from '@/components/operator/fitness/ProteinRecovery';
import {
  ExpandableTdeeComponent,
  RecoveryBanner,
  RunningBalance,
  StatRowHover,
  StreakChip,
  TickerNumber,
} from '@/components/operator/fitness/dynamic-extras';

export default function DailyLogView({ v }: { v: DailyLogVals }) {
  return (
    <>
      <div data-shell style={{ minHeight: '100vh', fontFamily: 'var(--font-body)', fontWeight: '300', color: 'var(--ink-soft)', background: '#FAF8F0' }}>
      <div data-topbar style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', padding: '20px 48px 0', maxWidth: '1220px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '19px', color: 'var(--ink)', letterSpacing: '-0.015em' }}>Daily<em style={{ color: '#B08D57' }}> log</em></span>
      <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>Week 31 · 2026</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
      <StreakChip days={21} label='days logged' tone='brass'></StreakChip>
      <StreakChip days={6} label='protein hit' tone='green'></StreakChip>
      <StreakChip days={4} label='workouts' tone='brass'></StreakChip>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 12px', borderRadius: '999px', background: '#F7F1E4', border: '0.5px solid rgba(176,141,87,0.16)', fontSize: '10.5px', color: '#957962' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9FB3A9', display: 'inline-block' }}></span>
      Apple Health · synced 7 min ago
      </span>
      </div>
      </div>
      <main data-main style={{ padding: '28px 48px 88px', maxWidth: '1220px', minWidth: '0', margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', marginBottom: '18px' }}>
      <div style={{ flex: '1 1 380px', minWidth: '0' }}>
      <div style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8E8A82', marginBottom: '10px' }}>Fitness &amp; recovery</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '400', fontSize: '46px', letterSpacing: '-0.025em', lineHeight: '1.06', color: 'var(--ink)', margin: '0 0 10px' }}>{v.greetingLead} <em style={{ fontStyle: 'italic', color: '#B08D57' }}>{v.greetingTail}</em></h1>
      <p style={{ margin: '0', fontSize: '14.5px', fontWeight: '300', color: '#8E8A82', lineHeight: '1.6', maxWidth: '58ch' }}>{v.subhead}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flex: '0 1 auto' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
      {(v.tabs ?? []).map((t, t_i) => (<React.Fragment key={t_i}>
      <button onClick={t.onClick} style={sx(t.style)}>{t.label}</button>
      </React.Fragment>))}
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {(v.unitToggle ?? []).map((u, u_i) => (<React.Fragment key={u_i}>
      <button onClick={u.onClick} style={sx(u.style)}>{u.label}</button>
      </React.Fragment>))}
      </div>
      </div>
      </header>
      <div style={{ height: '0.5px', background: 'rgba(26,24,21,0.10)', margin: '0 0 26px' }}></div>
      {(v.isFresh) ? (<>
      <div style={{ padding: '40px 42px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none', maxWidth: '760px' }}>
      <span style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#957962' }}>Day one</span>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '34px', color: 'var(--ink)', margin: '12px 0 10px', letterSpacing: '-0.02em', lineHeight: '1.12' }}>Nothing logged yet — <em style={{ color: '#B08D57' }}>let&apos;s fix that</em>.</h2>
      <p style={{ margin: '0 0 26px', fontSize: '14px', color: '#8E8A82', lineHeight: '1.7', maxWidth: '56ch' }}>Three things and the dashboard comes alive: connect Apple Health so weight and activity arrive on their own, set the pace you want to lose at, then log today&apos;s first meal.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {(v.onboardSteps ?? []).map((s, s_i) => (<React.Fragment key={s_i}>
      <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr auto', gap: '16px', alignItems: 'center', padding: '16px 18px', borderRadius: '10px', background: '#FBF6EA', border: '0.5px solid rgba(178,152,106,0.14)' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '19px', color: '#B08D57' }}>{s.num}</span>
      <div>
      <div style={{ fontSize: '13.5px', color: 'var(--ink)' }}>{s.title}</div>
      <div style={{ fontSize: '11.5px', color: '#8E8A82', marginTop: '2px' }}>{s.note}</div>
      </div>
      <button onClick={s.onClick} style={{ padding: '10px 18px', border: '0', borderRadius: '8px', background: 'var(--ink)', color: 'var(--paper)', fontSize: '12px', cursor: 'pointer' }} className="hv1">{s.cta}</button>
      </div>
      </React.Fragment>))}
      </div>
      </div>
      </>) : null}
      {(v.hasData) ? (<>
      <div data-hero style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)', gap: '36px', alignItems: 'end', padding: '30px 34px', marginBottom: '16px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <div>
      <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#957962', marginBottom: '12px' }}>This morning</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '88px', lineHeight: '0.86', letterSpacing: '-0.035em', color: 'var(--ink)' }}>{v.heroWeight}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '26px', color: '#A6ADA7' }}>{v.unitLabel}</span>
      <span style={sx(`font-size:11px;padding:5px 12px;border-radius:999px;background:${v.heroChipBg};color:${v.heroChipColor};margin-bottom:10px;white-space:nowrap;flex:none;`)}>{v.heroChip}</span>
      </div>
      <p style={{ margin: '16px 0 0', fontSize: '14px', color: '#8E8A82', lineHeight: '1.6', maxWidth: '44ch' }}>{v.heroVerdict}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {(v.quickActions ?? []).map((a, a_i) => (<React.Fragment key={a_i}>
      <button onClick={a.onClick} style={sx(a.style)}>{a.label}</button>
      </React.Fragment>))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', paddingTop: '14px', borderTop: '0.5px solid rgba(26,24,21,0.09)' }}>
      {(v.heroStats ?? []).map((s, s_i) => (<React.Fragment key={s_i}>
      <div>
      <div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A29D95' }}>{s.label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--ink)', marginTop: '4px' }}>{s.value}</div>
      <div style={{ fontSize: '10.5px', color: '#8E8A82' }}>{s.note}</div>
      </div>
      </React.Fragment>))}
      </div>
      </div>
      </div>
      {(v.targetsOpen) ? (<>
      <div data-cols-2 style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', padding: '22px 26px', marginBottom: '16px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px' }}>
      {(v.targetFields ?? []).map((t, t_i) => (<React.Fragment key={t_i}>
      <div>
      <div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A29D95', marginBottom: '8px' }}>{t.label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
      <input value={t.value} onChange={t.onChange} type='number' step={t.step} style={{ width: '88px', padding: '9px 12px', border: '0.5px solid rgba(26,24,21,0.08)', borderRadius: '12px', background: '#FDFBF5', fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)', outline: 'none' }} style-focus='border-color:#D6C09A;' />
      <span style={{ fontSize: '11px', color: '#8E8A82' }}>{t.unit}</span>
      </div>
      </div>
      </React.Fragment>))}
      </div>
      </>) : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(178px,1fr))', gap: '14px', marginBottom: '16px' }}>
      {(v.kpis ?? []).map((k, k_i) => (<React.Fragment key={k_i}>
      <div style={{ padding: '22px 24px 18px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.09)', borderRadius: '12px', boxShadow: 'none', transition: 'box-shadow 300ms cubic-bezier(.16,1,.3,1)' }} className="hv3">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
      <span style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)', minWidth: '0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k.label}</span>
      <span style={sx(`font-size:10px;padding:3px 9px;border-radius:999px;background:${k.chipBg};color:${k.chipColor};letter-spacing:0.06em;white-space:nowrap;flex:none;`)}>{k.chip}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginTop: '12px' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '34px', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: '1' }}>{k.display}</span>
      <span style={{ fontSize: '11px', color: 'var(--ink-mute)' }}>{k.unit}</span>
      </div>
      <svg viewBox='0 0 120 28' style={{ width: '100%', height: '24px', display: 'block', marginTop: '10px', overflow: 'visible' }}>
      <path d={k.spark} fill='none' stroke={k.color} strokeWidth='1.4' strokeLinejoin='round' strokeLinecap='round'></path>
      </svg>
      </div>
      </React.Fragment>))}
      </div>
      <div style={{ height: '0.5px', background: 'rgba(26,24,21,0.10)', margin: '4px 0 26px' }}></div>
      {(v.isToday) ? (<>
      <div data-tab-panel data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,1fr)', gap: '16px', alignItems: 'start' }}>
      <div style={{ padding: '24px 26px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', marginBottom: '6px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', color: 'var(--ink)', margin: '0', letterSpacing: '-0.01em' }}>Today&apos;s targets</h2>
      <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>tap a ring</span>
      </div>
      <div data-hero style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '26px', alignItems: 'center' }}>
      <svg viewBox='0 0 200 200' style={{ width: '196px', height: '196px' }}>
      {(v.rings ?? []).map((r, r_i) => (<React.Fragment key={r_i}>
      <g style={{ cursor: 'pointer' }} onClick={r.onClick}>
      <circle cx='100' cy='100' r={r.r} fill='none' stroke={r.track} strokeWidth='9'></circle>
      <circle cx='100' cy='100' r={r.r} fill='none' stroke={r.color} strokeWidth='9' strokeLinecap='round' strokeDasharray={r.dash} strokeDashoffset={r.offset} transform='rotate(-90 100 100)' style={{ transition: 'stroke-dasharray 600ms cubic-bezier(.16,1,.3,1)' }}></circle>
      </g>
      </React.Fragment>))}
      <text x='100' y='96' textAnchor='middle' fontFamily='Playfair Display' fontSize='30' fill='#1A1A18'>{v.ringFocus.value}</text>
      <text x='100' y='116' textAnchor='middle' fontFamily='Inter' fontSize='9' letterSpacing='2' fill='#8E8A82'>{v.ringFocus.label}</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {(v.rings ?? []).map((r, r_i) => (<React.Fragment key={r_i}>
      <div onClick={r.onClick} style={sx(r.rowStyle)} className="hv4">
      <span style={sx(`width:8px;height:8px;border-radius:50%;background:${r.color};display:inline-block;`)}></span>
      <div style={{ flex: '1' }}>
      <div style={{ fontSize: '12.5px', color: 'var(--ink)' }}>{r.name}</div>
      <div style={{ fontSize: '11px', color: 'var(--ink-mute)' }}>{r.detail}</div>
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
      </div>
      </div>
      </React.Fragment>))}
      </div>
      </div>
      <RunningBalance {...v.balanceProps}></RunningBalance>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ padding: '22px 24px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)', margin: '0 0 4px' }}>Water</h2>
      <p style={{ margin: '0 0 14px', fontSize: '12px', color: 'var(--ink-mute)' }}>{v.waterCopy}</p>
      <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
      {(v.glasses ?? []).map((g, g_i) => (<React.Fragment key={g_i}>
      <span style={sx(g.style)} title={g.title}></span>
      </React.Fragment>))}
      </div>
      </div>
      <div style={{ padding: '22px 24px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)', margin: '0 0 12px' }}>Log a weigh-in</h2>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <input value={v.draftWeight} onChange={v.onDraftChange} onKeyDown={v.onDraftKey} placeholder='71.4' inputMode='decimal' style={{ flex: '1', padding: '12px 14px', border: '0.5px solid var(--rule)', borderRadius: '8px', background: 'var(--paper)', fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--ink)', outline: 'none' }} style-focus='border-color:#EADFC6;' />
      <span style={{ fontSize: '12px', color: 'var(--ink-mute)' }}>{v.unitLabel}</span>
      <button onClick={v.onAddWeight} style={{ padding: '12px 20px', border: '0', borderRadius: '8px', background: 'var(--ink)', color: 'var(--paper)', fontSize: '12.5px', cursor: 'pointer', letterSpacing: '0.02em' }} className="hv5">Save →</button>
      </div>
      <p style={{ margin: '12px 0 0', fontSize: '11.5px', color: 'var(--ink-mute)' }}>{v.lastLoggedCopy}</p>
      </div>
      <div style={{ padding: '22px 24px', background: '#FBF6EA', border: '0.5px solid rgba(178,152,106,0.16)', borderRadius: '12px' }}>
      <span style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>Today&apos;s plan</span>
      <RecoveryBanner {...v.recoveryProps}></RecoveryBanner>
      </div>
      </div>
      </div>
      </>) : null}
      {(v.isTrends) ? (<>
      <div data-tab-panel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ padding: '24px 26px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '18px' }}>
      <div style={{ display: 'flex', gap: '6px' }}>
      {(v.metricTabs ?? []).map((m, m_i) => (<React.Fragment key={m_i}>
      <button onClick={m.onClick} style={sx(m.style)}>{m.label}</button>
      </React.Fragment>))}
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
      {(v.rangeTabs ?? []).map((r, r_i) => (<React.Fragment key={r_i}>
      <button onClick={r.onClick} style={sx(r.style)}>{r.label}</button>
      </React.Fragment>))}
      </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '16px' }}>
      <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', margin: '0 0 5px', letterSpacing: '-0.015em' }}>Weight · <em style={{ color: '#B08D57' }}>{v.rangeLabel}</em></h2>
      <p style={{ margin: '0', fontSize: '12.5px', color: '#8E8A82' }}>{v.chartSub}</p>
      </div>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {(v.chartStats ?? []).map((c, c_i) => (<React.Fragment key={c_i}>
      <div>
      <div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A29D95' }}>{c.label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '21px', color: 'var(--ink)', letterSpacing: '-0.015em', lineHeight: '1.25' }}>{c.value}</div>
      <div style={{ fontSize: '10.5px', color: '#A29D95' }}>{c.unit}</div>
      </div>
      </React.Fragment>))}
      </div>
      </div>
      <div style={{ position: 'relative' }} onMouseMove={v.onChartMove} onMouseLeave={v.onLeave}>
      <svg viewBox='0 0 900 340' style={{ width: '100%', height: 'auto', display: 'block' }}>
      {(v.yTicks ?? []).map((t, t_i) => (<React.Fragment key={t_i}>
      <g>
      <line x1='54' x2='846' y1={t.y} y2={t.y} stroke='rgba(26,24,21,0.055)' strokeWidth='0.5'></line>
      <text x='44' y={t.ty} textAnchor='end' fontFamily='Inter' fontSize='10' fill='#A29D95'>{t.label}</text>
      </g>
      </React.Fragment>))}
      <line x1='54' x2='846' y1={v.goalY} y2={v.goalY} stroke='#D2B49C' strokeWidth='1.2' strokeDasharray='5 5'></line>
      <text x='58' y={v.goalTextY} fontFamily='Inter' fontSize='9.5' letterSpacing='1.6' fill='#B8957C'>{v.goalChip}</text>
      <path d={v.bandPath} fill='#EADFC6' opacity='0.42'></path>
      <path d={v.projBandPath} fill='#C5D2CB' opacity='0.34'></path>
      {(v.rawDots ?? []).map((d, d_i) => (<React.Fragment key={d_i}>
      <circle cx={d.x} cy={d.y} r='1.9' fill='#D2B49C' opacity='0.62'></circle>
      </React.Fragment>))}
      <path d={v.maPath} fill='none' stroke='#B08D57' strokeWidth='2.4' strokeLinejoin='round' strokeLinecap='round'></path>
      <path d={v.projPath} fill='none' stroke='#98ABA2' strokeWidth='1.8' strokeDasharray='6 6'></path>
      <circle cx={v.projX} cy={v.projY} r='5' fill='#FFFFFF' stroke='#98ABA2' strokeWidth='1.8'></circle>
      <text x={v.projLabelX} y={v.projLabelY} textAnchor='end' fontFamily='Playfair Display' fontStyle='italic' fontSize='15' fill='#7F9289'>{v.projLabel}</text>
      {(v.weighDots ?? []).map((p, p_i) => (<React.Fragment key={p_i}>
      <circle cx={p.x} cy={p.y} r={p.r} fill='#FFFFFF' stroke='#B08D57' strokeWidth='1.8'></circle>
      </React.Fragment>))}
      <g>
      <circle cx={v.loMarker.x} cy={v.loMarker.y} r='3' fill='#7F9289'></circle>
      <text x={v.loMarker.x} y={v.loMarker.ly} textAnchor='middle' fontFamily='Inter' fontSize='9' letterSpacing='1.2' fill='#7F9289'>{v.loMarker.label}</text>
      <circle cx={v.hiMarker.x} cy={v.hiMarker.y} r='3' fill='#B8957C'></circle>
      <text x={v.hiMarker.x} y={v.hiMarker.ly} textAnchor='middle' fontFamily='Inter' fontSize='9' letterSpacing='1.2' fill='#B8957C'>{v.hiMarker.label}</text>
      </g>
      {(v.crosshair) ? (<>
      <g>
      <line x1={v.crosshair.x} x2={v.crosshair.x} y1='22' y2='286' stroke='#B08D57' strokeWidth='0.75' strokeDasharray='3 4' opacity='0.55'></line>
      <circle cx={v.crosshair.x} cy={v.crosshair.y} r='5.5' fill='#B08D57'></circle>
      <circle cx={v.crosshair.x} cy={v.crosshair.y} r='10' fill='none' stroke='#B08D57' strokeWidth='0.8' opacity='0.4'></circle>
      </g>
      </>) : null}
      {(v.xTicks ?? []).map((t, t_i) => (<React.Fragment key={t_i}>
      <text x={t.x} y='316' textAnchor='middle' fontFamily='Inter' fontSize='9.5' letterSpacing='1.2' fill={t.color}>{t.label}</text>
      </React.Fragment>))}
      </svg>
      {(v.tooltip) ? (<>
      <div style={sx(v.tooltipStyle)}>
      <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{v.tooltip.date}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--ink)', marginTop: '2px' }}>{v.tooltip.value}</div>
      <div style={{ fontSize: '11.5px', color: 'var(--ink-mute)' }}>{v.tooltip.sub}</div>
      </div>
      </>) : null}
      </div>
      <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap', marginTop: '14px', paddingTop: '14px', borderTop: '0.5px solid rgba(26,24,21,0.09)', fontSize: '11px', color: '#8E8A82' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}><i style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#D2B49C', display: 'inline-block' }}></i> Daily scale reading</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}><i style={{ width: '16px', height: '2.5px', borderRadius: '2px', background: '#B08D57', display: 'inline-block' }}></i> 7-day trend</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}><i style={{ width: '14px', height: '9px', borderRadius: '3px', background: '#EADFC6', display: 'inline-block' }}></i> Daily fluctuation band</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}><i style={{ width: '16px', height: '2.5px', borderRadius: '2px', background: '#98ABA2', display: 'inline-block' }}></i> 12-week projection</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}><i style={{ width: '16px', height: '2.5px', borderRadius: '2px', background: '#D2B49C', display: 'inline-block' }}></i> Goal</span>
      </div>
      </div>
      <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '16px' }}>
      <div style={{ padding: '24px 26px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)', margin: '0 0 4px' }}>Where this lands</h2>
      <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: 'var(--ink-mute)' }}>Slide to test a different weekly pace.</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
      <input type='range' min='-1.2' max='0.4' step='0.02' value={v.weeklyRate} onChange={v.onRateChange} onInput={v.onRateChange} style={{ flex: '1' }} />
      <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '16px', color: 'var(--ink)', whiteSpace: 'nowrap' }}>{v.rateLabel}</span>
      </div>
      {(v.projections ?? []).map((p, p_i) => (<React.Fragment key={p_i}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '14px', alignItems: 'baseline', padding: '12px 0', borderTop: '0.5px solid var(--rule-soft)' }}>
      <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>{p.label}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--ink)' }}>{p.kg}</span>
      <span style={sx(`font-size:10.5px;padding:3px 9px;border-radius:999px;background:${p.chipBg};color:${p.chipColor};`)}>{p.delta}</span>
      </div>
      </React.Fragment>))}
      <p style={{ margin: '16px 0 0', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: '1.65' }}>{v.etaCopy}</p>
      </div>
      <div style={{ padding: '24px 26px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)', margin: '0 0 14px' }}>Body metrics</h2>
      {(v.bodyRows ?? []).map((b, b_i) => (<React.Fragment key={b_i}>
      <StatRowHover sparkPoints={b.spark} color='#B08D57'>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'baseline', padding: '14px 0', borderTop: '0.5px solid var(--rule-soft)' }}>
      <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>{b.label}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--ink)' }}>{b.value}</span>
      <span style={sx(`font-size:10.5px;padding:3px 9px;border-radius:999px;background:${b.chipBg};color:${b.chipColor};`)}>{b.delta}</span>
      </div>
      </StatRowHover>
      </React.Fragment>))}
      <p style={{ margin: '14px 0 0', fontSize: '11.5px', color: 'var(--ink-mute)' }}>Hover a row for its twelve-week shape.</p>
      </div>
      </div>
      </div>
      </>) : null}
      {(v.isPlan) ? (<>
      <div data-tab-panel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ padding: '30px 32px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '22px' }}>
      <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--ink)', margin: '0 0 5px', letterSpacing: '-0.015em' }}>Your plan · <em style={{ color: '#B08D57' }}>{v.paceLabel} a week</em></h2>
      <p style={{ margin: '0', fontSize: '12.5px', color: '#8E8A82', maxWidth: '64ch' }}>{v.planSub}</p>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
      {(v.paceOptions ?? []).map((p, p_i) => (<React.Fragment key={p_i}>
      <button onClick={p.onClick} style={sx(p.style)}>{p.label}</button>
      </React.Fragment>))}
      </div>
      </div>
      <div data-cols-2 style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
      {(v.planNumbers ?? []).map((n, n_i) => (<React.Fragment key={n_i}>
      <div style={sx(`padding:20px 22px;border-radius:22px;background:${n.bg};border:0.5px solid rgba(178,152,106,0.14);`)}>
      <div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8E8A82' }}>{n.label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '30px', color: 'var(--ink)', letterSpacing: '-0.02em', marginTop: '8px', lineHeight: '1' }}>{n.value}</div>
      <div style={{ fontSize: '11px', color: '#8E8A82', marginTop: '6px' }}>{n.note}</div>
      </div>
      </React.Fragment>))}
      </div>
      <p style={{ margin: '18px 0 0', fontSize: '12.5px', color: '#8E8A82', lineHeight: '1.7', maxWidth: '82ch' }}>{v.planCaution}</p>
      </div>
      <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '16px', alignItems: 'start' }}>
      <div style={{ padding: '26px 28px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '14px', marginBottom: '6px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', color: 'var(--ink)', margin: '0' }}>Reality check</h2>
      <span style={sx(`font-size:10.5px;padding:5px 12px;border-radius:999px;background:${v.realityChipBg};color:${v.realityChipColor};`)}>{v.realityChip}</span>
      </div>
      <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: '#8E8A82' }}>Maintenance back-calculated from what you actually ate and what the scale actually did — not the formula.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
      {(v.realityNumbers ?? []).map((r, r_i) => (<React.Fragment key={r_i}>
      <div style={{ padding: '16px 18px', borderRadius: '10px', background: '#FBF6EA', border: '0.5px solid rgba(178,152,106,0.14)' }}>
      <div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A29D95' }}>{r.label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--ink)', marginTop: '6px', lineHeight: '1' }}>{r.value}</div>
      <div style={{ fontSize: '10.5px', color: '#8E8A82', marginTop: '5px' }}>{r.note}</div>
      </div>
      </React.Fragment>))}
      </div>
      <p style={{ margin: '16px 0 0', fontSize: '13px', color: '#57544E', lineHeight: '1.7' }}>{v.realityCopy2}</p>
      </div>
      <div style={{ padding: '26px 28px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '14px', marginBottom: '16px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', color: 'var(--ink)', margin: '0' }}>Adherence</h2>
      <span style={{ fontSize: '10.5px', padding: '5px 12px', borderRadius: '999px', background: '#F5EFDF', color: '#8A6D3F' }}>{v.adherenceLabel}</span>
      </div>
      {(v.adherenceRows ?? []).map((a, a_i) => (<React.Fragment key={a_i}>
      <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr auto', gap: '12px', alignItems: 'center', padding: '10px 0', borderTop: '0.5px solid rgba(26,24,21,0.09)' }}>
      <span style={{ fontSize: '12.5px', color: '#57544E' }}>{a.label}</span>
      <div style={{ height: '9px', borderRadius: '999px', background: '#EFF2EE', overflow: 'hidden' }}><div style={sx(a.barStyle)}></div></div>
      <span style={sx(`font-family:var(--font-display);font-size:16px;color:${a.color};min-width:56px;text-align:right;`)}>{a.value}</span>
      </div>
      </React.Fragment>))}
      <p style={{ margin: '16px 0 0', fontSize: '13px', color: '#57544E', lineHeight: '1.7' }}>{v.adherenceCopy}</p>
      </div>
      </div>
      <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,1fr)', gap: '16px', alignItems: 'start' }}>
      <div style={{ padding: '26px 28px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', marginBottom: '14px' }}>
      <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', color: 'var(--ink)', margin: '0 0 4px' }}>Smart <em style={{ color: '#B08D57' }}>scheduling</em></h2>
      <p style={{ margin: '0', fontSize: '12.5px', color: '#8E8A82', maxWidth: '46ch' }}>{v.scheduleCopy}</p>
      </div>
      <span style={sx(v.scheduleBadgeStyle)}>{v.scheduleBadgeLabel}</span>
      </div>
      {(v.scheduleRows ?? []).map((n, n_i) => (<React.Fragment key={n_i}>
      <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 1fr', gap: '14px', alignItems: 'center', padding: '11px 0', borderTop: '0.5px solid rgba(26,24,21,0.09)' }}>
      <span style={{ fontSize: '10.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A29D95' }}>{n.day}</span>
      <span style={sx(`font-size:12.5px;color:${n.calColor};`)}>{n.calendar}</span>
      <span style={{ fontSize: '12.5px', color: 'var(--ink)' }}>{n.suggestion}</span>
      </div>
      </React.Fragment>))}
      </div>
      <div style={{ padding: '26px 28px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', color: 'var(--ink)', margin: '0 0 4px' }}>The training week</h2>
      <p style={{ margin: '0 0 14px', fontSize: '12.5px', color: '#8E8A82' }}>Three lifts, two easy days — enough stimulus to hold muscle while the deficit runs.</p>
      {(v.planWeek ?? []).map((d, d_i) => (<React.Fragment key={d_i}>
      <div style={{ display: 'grid', gridTemplateColumns: '46px 1fr auto', gap: '14px', alignItems: 'center', padding: '13px 0', borderTop: '0.5px solid rgba(26,24,21,0.09)' }}>
      <span style={{ fontSize: '10.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A29D95' }}>{d.day}</span>
      <div>
      <div style={{ fontSize: '13.5px', color: 'var(--ink)' }}>{d.session}</div>
      <div style={{ fontSize: '11.5px', color: '#8E8A82', marginTop: '2px' }}>{d.detail}</div>
      </div>
      <span style={sx(`font-size:10.5px;padding:4px 11px;border-radius:999px;background:${d.tagBg};color:${d.tagColor};`)}>{d.tag}</span>
      </div>
      </React.Fragment>))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ padding: '26px 28px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', color: 'var(--ink)', margin: '0 0 14px' }}>Daily plate</h2>
      {(v.planMacros ?? []).map((m, m_i) => (<React.Fragment key={m_i}>
      <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
      <span style={{ fontSize: '12.5px', color: '#57544E' }}>{m.label}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '17px', color: 'var(--ink)' }}>{m.value}</span>
      </div>
      <div style={{ height: '8px', borderRadius: '999px', background: '#EFF2EE', overflow: 'hidden' }}>
      <div style={sx(m.barStyle)}></div>
      </div>
      <div style={{ fontSize: '11px', color: '#8E8A82', marginTop: '6px' }}>{m.note}</div>
      </div>
      </React.Fragment>))}
      </div>
      <div style={{ padding: '26px 28px', background: '#FBF6EA', border: '0.5px solid rgba(178,152,106,0.16)', borderRadius: '12px' }}>
      <span style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8B918A' }}>Non-negotiables</span>
      {(v.planRules ?? []).map((r, r_i) => (<React.Fragment key={r_i}>
      <div style={{ display: 'flex', gap: '11px', alignItems: 'flex-start', padding: '11px 0', borderBottom: '0.5px solid rgba(178,152,106,0.12)' }}>
      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#D2B49C', marginTop: '7px', flex: 'none' }}></span>
      <span style={{ fontSize: '13px', color: '#57544E', lineHeight: '1.55' }}>{r}</span>
      </div>
      </React.Fragment>))}
      </div>
      </div>
      </div>
      <div style={{ padding: '26px 28px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>
      <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', color: 'var(--ink)', margin: '0 0 4px' }}>Week-by-week targets</h2>
      <p style={{ margin: '0', fontSize: '12.5px', color: '#8E8A82' }}>Tick a week off as you weigh in — the bar fills as you go.</p>
      </div>
      <span style={{ fontSize: '10.5px', padding: '6px 13px', borderRadius: '999px', background: '#F5EFDF', color: '#8A6D3F' }}>{v.planDoneLabel}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(132px,1fr))', gap: '10px' }}>
      {(v.planWeeks ?? []).map((w, w_i) => (<React.Fragment key={w_i}>
      <button onClick={w.onClick} style={sx(w.style)}>
      <span style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: '0.75' }}>{w.week}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '21px', letterSpacing: '-0.015em' }}>{w.target}</span>
      <span style={{ fontSize: '10.5px', opacity: '0.7' }}>{w.date}</span>
      </button>
      </React.Fragment>))}
      </div>
      </div>
      </div>
      </>) : null}
      {(v.isProgress) ? (<>
      <div data-tab-panel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ padding: '30px 32px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <div data-hero style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '44px', alignItems: 'center' }}>
      <div>
      <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A29D95', marginBottom: '10px' }}>Lost since February</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '76px', lineHeight: '0.9', letterSpacing: '-0.03em', color: '#B08D57' }}>
      <TickerNumber value={v.lostValue} decimals={1}></TickerNumber>
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '24px', color: '#A6ADA7' }}>{v.unitLabel}</span>
      </div>
      <p style={{ margin: '10px 0 0', fontSize: '13px', color: '#8E8A82', maxWidth: '26ch' }}>{v.lostCopy}</p>
      </div>
      <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#A29D95', marginBottom: '10px' }}>
      <span>{v.startLabel}</span>
      <span>{v.pctLabel} of the way to {v.goalDisplay}</span>
      </div>
      <div style={{ position: 'relative', height: '14px', borderRadius: '999px', background: '#EFF2EE', overflow: 'hidden' }}>
      <div style={sx(v.progressBarStyle)}></div>
      </div>
      <div style={{ display: 'flex', marginTop: '14px', gap: '8px', flexWrap: 'wrap' }}>
      {(v.milestones ?? []).map((m, m_i) => (<React.Fragment key={m_i}>
      <span style={sx(m.style)}>{m.label}</span>
      </React.Fragment>))}
      </div>
      </div>
      </div>
      </div>
      <div style={{ padding: '30px 32px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
      <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', margin: '0 0 5px', letterSpacing: '-0.015em' }}>Progress <em style={{ color: '#D2B49C' }}>pictures</em></h2>
      <p style={{ margin: '0', fontSize: '12.5px', color: '#8E8A82' }}>Drop a photo into any frame — same light, same time of day, and the comparison actually means something.</p>
      </div>
      <span style={{ fontSize: '10.5px', padding: '6px 13px', borderRadius: '999px', background: '#F7F1E4', border: '0.5px solid rgba(178,152,106,0.16)', color: '#957962' }}>private to you</span>
      </div>
      <div data-cols-2 style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
      {(v.photoFrames ?? []).map((p, p_i) => (<React.Fragment key={p_i}>
      <div>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: '12px', overflow: 'hidden', background: '#FBF6EA', border: '0.5px solid rgba(178,152,106,0.14)' }}>
      <ImageSlot id={p.id} shape='rect' placeholder={p.placeholder} style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' }}></ImageSlot>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', marginTop: '12px' }}>
      <span style={{ fontSize: '11.5px', color: '#8E8A82' }}>{p.date}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)' }}>{p.weight}</span>
      </div>
      <div style={sx(`font-size:10.5px;color:${p.deltaColor};margin-top:2px;`)}>{p.delta}</div>
      </div>
      </React.Fragment>))}
      </div>
      </div>
      <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: '16px' }}>
      <div style={{ padding: '26px 28px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', color: 'var(--ink)', margin: '0 0 16px' }}>Month by month</h2>
      {(v.monthly ?? []).map((m, m_i) => (<React.Fragment key={m_i}>
      <div style={{ display: 'grid', gridTemplateColumns: '78px 1fr auto', gap: '14px', alignItems: 'center', padding: '11px 0', borderTop: '0.5px solid rgba(26,24,21,0.09)' }}>
      <span style={{ fontSize: '12.5px', color: '#8E8A82' }}>{m.month}</span>
      <div style={{ height: '10px', borderRadius: '999px', background: '#EFF2EE', overflow: 'hidden' }}>
      <div style={sx(m.barStyle)}></div>
      </div>
      <span style={sx(`font-family:var(--font-display);font-size:17px;color:${m.color};min-width:64px;text-align:right;`)}>{m.delta}</span>
      </div>
      </React.Fragment>))}
      </div>
      <div style={{ padding: '26px 28px', background: '#FBF6EA', border: '0.5px solid rgba(178,152,106,0.16)', borderRadius: '12px' }}>
      <span style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8B918A' }}>Non-scale wins</span>
      {(v.wins ?? []).map((w, w_i) => (<React.Fragment key={w_i}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '13px 0', borderBottom: '0.5px solid rgba(178,152,106,0.1)' }}>
      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#D2B49C', marginTop: '7px', flex: 'none' }}></span>
      <div>
      <div style={{ fontSize: '13.5px', color: 'var(--ink)' }}>{w.title}</div>
      <div style={{ fontSize: '11.5px', color: '#8E8A82', marginTop: '2px' }}>{w.note}</div>
      </div>
      </div>
      </React.Fragment>))}
      </div>
      </div>
      </div>
      </>) : null}
      {(v.isFood) ? (<>
      <div data-tab-panel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)', gap: '16px' }}>
      <div style={{ padding: '24px 26px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)', margin: '0 0 16px' }}>Macros today</h2>
      {(v.macros ?? []).map((m, m_i) => (<React.Fragment key={m_i}>
      <div style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
      <span style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>{m.label}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--ink)' }}>{m.value}</span>
      </div>
      <div style={{ height: '8px', borderRadius: '999px', background: 'var(--paper-deep)', overflow: 'hidden' }}>
      <div style={sx(m.barStyle)}></div>
      </div>
      </div>
      </React.Fragment>))}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
      {(v.meals ?? []).map((ml, ml_i) => (<React.Fragment key={ml_i}>
      <span style={{ fontSize: '11px', padding: '5px 11px', borderRadius: '999px', background: 'var(--surface)', border: '0.5px solid var(--rule)', color: 'var(--ink-soft)' }}>{ml}</span>
      </React.Fragment>))}
      </div>
      </div>
      <div style={{ padding: '24px 26px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)', margin: '0 0 2px' }}>Energy ledger</h2>
      <p style={{ margin: '0', fontSize: '12.5px', color: 'var(--ink-mute)' }}>Fourteen days of intake against burn.</p>
      <EnergyLedger {...v.ledgerProps}></EnergyLedger>
      </div>
      </div>
      <div style={{ padding: '24px 26px', marginBottom: '16px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', marginBottom: '2px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)', margin: '0' }}>Weekly <em style={{ color: '#B08D57' }}>deficit</em></h2>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--ink)', fontWeight: 300 }}>{v.weeklyDeficitHeadline}<span style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--ink-mute)', marginLeft: '5px' }}>kcal this week</span></span>
      </div>
      <p style={{ margin: '0 0 18px', fontSize: '12.5px', color: 'var(--ink-mute)', lineHeight: 1.55, maxWidth: '62ch' }}>{v.weeklyDeficitCopy}</p>
      {(v.weeklyDeficitRows ?? []).map((w, w_i) => (<React.Fragment key={w_i}>
      <div style={{ display: 'grid', gridTemplateColumns: '58px minmax(0,1fr) 92px 74px', gap: '14px', alignItems: 'center', padding: '11px 0', borderTop: '0.5px solid var(--rule-soft)' }}>
      <span style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{w.label}</span>
      <span style={{ height: '9px', borderRadius: '999px', background: 'var(--paper-deep)', display: 'block', overflow: 'hidden' }}><span style={sx(w.barStyle)}></span></span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: 'var(--ink)', textAlign: 'right' }}>{w.total}<span style={{ fontSize: '10px', color: 'var(--ink-mute)', marginLeft: '3px' }}>kcal</span></span>
      <span style={{ fontSize: '11.5px', color: 'var(--ink-mute)', textAlign: 'right' }}>{w.kg}{w.partial ? ' · ' + w.partial : ''}</span>
      </div>
      </React.Fragment>))}
      </div>
      <div style={{ padding: '24px 26px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '6px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)', margin: '0' }}>What you burn — open a row to tune it</h2>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--ink)' }}>{v.tdeeTotalLabel} <span style={{ fontSize: '11px', fontFamily: 'var(--font-body)', color: 'var(--ink-mute)' }}>kcal/day</span></span>
      </div>
      {(v.tdeeRows ?? []).map((row, row_i) => (<React.Fragment key={row_i}>
      <ExpandableTdeeComponent acronym={row.acronym} fullName={row.fullName} value={row.value} percent={row.percent} color={row.color} onTune={row.onTune}>{row.detail}</ExpandableTdeeComponent>
      </React.Fragment>))}
      </div>
      <div style={{ padding: '8px 26px 4px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <ProteinRecovery {...v.proteinProps}></ProteinRecovery>
      </div>
      </div>
      </>) : null}
      {(v.isTraining) ? (<>
      <div data-tab-panel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ padding: '30px 32px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '22px' }}>
      <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', margin: '0 0 5px', letterSpacing: '-0.015em' }}>Total <em style={{ color: '#B08D57' }}>energy burned</em></h2>
      <p style={{ margin: '0', fontSize: '12.5px', color: '#8E8A82' }}>Active energy from Apple Health — every walk, shift and session.</p>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
      {(v.volRanges ?? []).map((v, v_i) => (<React.Fragment key={v_i}>
      <button onClick={v.onClick} style={sx(v.style)}>{v.label}</button>
      </React.Fragment>))}
      </div>
      </div>
      <div data-hero style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr', gap: '34px', alignItems: 'center' }}>
      <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '64px', lineHeight: '0.9', letterSpacing: '-0.03em', color: 'var(--ink)' }}>{v.volTotal}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '22px', color: '#A6ADA7' }}>kcal</span>
      </div>
      <div style={{ fontSize: '12px', color: '#8E8A82', marginTop: '8px' }}>{v.volSub}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
      <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: '#F7F1E4', border: '0.5px solid rgba(176,141,87,0.22)', flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#B08D57', letterSpacing: '-0.02em' }}>{v.animalUnitKg}</span>
      <span style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#957962' }}>kcal each</span>
      </div>
      <div>
      <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#957962' }}>that is about</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '30px', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: '1.15', marginTop: '4px' }}>{v.animalCount}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '17px', color: '#B08D57' }}>{v.animalName}</div>
      <div style={{ fontSize: '11px', color: '#8E8A82', marginTop: '4px' }}>{v.animalNote}</div>
      </div>
      </div>
      <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '340px', marginBottom: '14px' }}>
      {(v.animalUnits ?? []).map((u, u_i) => (<React.Fragment key={u_i}>
      <span style={sx(u.style)}></span>
      </React.Fragment>))}
      </div>
      {(v.animalScale ?? []).map((a, a_i) => (<React.Fragment key={a_i}>
      <div style={{ display: 'grid', gridTemplateColumns: '104px 1fr auto', gap: '12px', alignItems: 'center', padding: '5px 0' }}>
      <span style={sx(`font-size:11.5px;color:${a.labelColor};`)}>{a.name}</span>
      <div style={{ height: '8px', borderRadius: '999px', background: '#EFF2EE', overflow: 'hidden' }}>
      <div style={sx(a.barStyle)}></div>
      </div>
      <span style={sx(`font-family:var(--font-display);font-size:14px;color:${a.labelColor};min-width:56px;text-align:right;`)}>{a.count}</span>
      </div>
      </React.Fragment>))}
      </div>
      </div>
      </div>
      <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: '16px', alignItems: 'start' }}>
      <div style={{ padding: '24px 26px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)', margin: '0 0 4px' }}>This week&apos;s sessions</h2>
      <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: 'var(--ink-mute)' }}>Tap a session for what Apple Health recorded.</p>
      {(v.sessions ?? []).map((s, s_i) => (<React.Fragment key={s_i}>
      <div style={{ borderTop: '0.5px solid var(--rule-soft)' }}>
      <button onClick={s.onClick} style={{ width: '100%', display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: '14px', alignItems: 'center', padding: '16px 4px', background: 'transparent', border: '0', cursor: 'pointer', textAlign: 'left' }}>
      <span style={sx(`width:34px;height:34px;border-radius:12px;background:${s.tint};display:grid;place-items:center;font-size:11px;letter-spacing:0.08em;color:#957962;`)}>{s.day}</span>
      <span>
      <span style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>{s.name}</span>
      <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-mute)' }}>{s.note}</span>
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '17px', color: 'var(--ink)' }}>{s.kcal}<span style={{ fontSize: '10px', fontFamily: 'var(--font-body)', color: 'var(--ink-mute)' }}> kcal</span></span>
      <span style={{ fontSize: '14px', color: 'var(--ink-mute)' }}>{s.caret}</span>
      </button>
      {(s.open) ? (<>
      <div style={{ padding: '0 4px 18px' }}>
      {(s.sets ?? []).map((st, st_i) => (<React.Fragment key={st_i}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', padding: '8px 0', borderTop: '0.5px dashed var(--rule-soft)', fontSize: '12.5px', color: 'var(--ink-soft)' }}>
      <span>{st.move}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--ink)' }}>{st.load}</span>
      <span style={{ fontSize: '11px', color: 'var(--ink-mute)' }}>{st.reps}</span>
      </div>
      </React.Fragment>))}
      </div>
      </>) : null}
      </div>
      </React.Fragment>))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ padding: '24px 26px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)', margin: '0 0 16px' }}>Weekly load</h2>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '130px' }}>
      {(v.loadBars ?? []).map((b, b_i) => (<React.Fragment key={b_i}>
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }} title={b.title}>
      <div style={sx(b.style)}></div>
      <span style={{ fontSize: '9.5px', letterSpacing: '0.1em', color: 'var(--ink-mute)' }}>{b.label}</span>
      </div>
      </React.Fragment>))}
      </div>
      </div>
      <div style={{ padding: '24px 26px', background: '#FBF6EA', border: '0.5px solid rgba(178,152,106,0.16)', borderRadius: '12px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)', margin: '0 0 14px' }}>Recent bests</h2>
      {(v.prs ?? []).map((p, p_i) => (<React.Fragment key={p_i}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderTop: '0.5px solid var(--rule-soft)' }}>
      <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>{p.move}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)' }}>{p.value}</span>
      </div>
      </React.Fragment>))}
      </div>
      </div>
      </div>
      </div>
      </>) : null}
      {(v.isHabits) ? (<>
      <div data-tab-panel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ padding: '24px 26px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '18px' }}>
      <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)', margin: '0 0 4px' }}>Habits · last 14 days</h2>
      <p style={{ margin: '0', fontSize: '12.5px', color: 'var(--ink-mute)' }}>Filled where Apple Health shows the target met.</p>
      </div>
      <span style={{ fontSize: '11px', padding: '5px 12px', borderRadius: '999px', background: '#EDF1EC', color: 'var(--green)' }}>{v.habitPct}% complete</span>
      </div>
      {(v.habits ?? []).map((h, h_i) => (<React.Fragment key={h_i}>
      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr auto', gap: '14px', alignItems: 'center', padding: '9px 0' }}>
      <span style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>{h.name}</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14,1fr)', gap: '5px' }}>
      {(h.days ?? []).map((d, d_i) => (<React.Fragment key={d_i}>
      <span title={d.title} style={sx(d.style)}></span>
      </React.Fragment>))}
      </div>
      <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: 'var(--ink-mute)' }}>{h.count}/14</span>
      </div>
      </React.Fragment>))}
      </div>
      <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '16px' }}>
      <div style={{ padding: '24px 26px', background: '#FFFFFF', border: '0.5px solid rgba(26,24,21,0.10)', borderRadius: '12px', boxShadow: 'none' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--ink)', margin: '0 0 14px' }}>Sleep · last 10 nights</h2>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '7px', height: '120px' }}>
      {(v.sleepBars ?? []).map((s, s_i) => (<React.Fragment key={s_i}>
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }} title={s.title}>
      <div style={sx(s.style)}></div>
      <span style={{ fontSize: '9.5px', color: 'var(--ink-mute)' }}>{s.label}</span>
      </div>
      </React.Fragment>))}
      </div>
      <p style={{ margin: '14px 0 0', fontSize: '12.5px', color: 'var(--ink-soft)' }}>Averaging {v.sleepAvg} h — the 7-hour line is the dashed one.</p>
      </div>
      <div style={{ padding: '24px 26px', background: '#FBF6EA', border: '0.5px solid rgba(178,152,106,0.16)', borderRadius: '12px' }}>
      <span style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>Week in review</span>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '19px', color: 'var(--ink)', lineHeight: '1.45', margin: '10px 0 14px', letterSpacing: '-0.01em' }}>{v.reviewHeadline}</p>
      <p style={{ margin: '0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: '1.75' }}>{v.reviewBody}</p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
      {(v.reviewChips ?? []).map((c, c_i) => (<React.Fragment key={c_i}>
      <span style={{ fontSize: '11px', padding: '5px 12px', borderRadius: '999px', background: '#FFFFFF', border: '0.5px solid var(--rule)', color: 'var(--ink-soft)' }}>{c}</span>
      </React.Fragment>))}
      </div>
      </div>
      </div>
      </div>
      </>) : null}
      </>) : null}
      <p style={{ margin: '28px 0 0', fontSize: '11.5px', fontStyle: 'italic', color: 'var(--ink-mute)', lineHeight: '1.7', maxWidth: '70ch' }}>Projections are a simple linear extrapolation of your own readings — helpful for direction, not a promise. This log supports your decisions and doesn&apos;t replace clinical or dietetic advice.</p>
      </main>
      </div>
    </>
  );
}
