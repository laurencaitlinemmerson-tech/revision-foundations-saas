'use client';

import React, {
  useState, useEffect, useCallback, useMemo, FormEvent, useRef, CSSProperties,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FitnessReading {
  id: string; date: string; weight: number; bmi: number;
  bodyFat: number; water: number; muscleMass: number; boneMass: number;
}
interface Reg {
  slope: number; intercept: number; r2: number; t0: number;
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  paper:    '#FAFAF8', surface: '#FBF8F3',
  ink:      '#1A1815', body:    '#5A5750', muted: '#9A948C',
  line:     'rgba(26,24,21,0.11)', softLine: 'rgba(26,24,21,0.07)',
  blue:     '#185FA5', blueSoft:  '#EAF1FA',
  green:    '#1C7A67', greenSoft: '#E4F2EC',
  gold:     '#633806', goldSoft:  '#FAEEDA',
  rose:     '#A14A57', roseSoft:  '#F9E8EB',
  display:  "'Playfair Display', Georgia, serif",
  sans:     "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
} as const;

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'operator-log-v3';
const AUTH_KEY    = 'operator-log-auth-v3';
const GOAL_KEY    = 'operator-log-goal-v3';
const AUTH_TTL    = 30 * 24 * 60 * 60 * 1000;
const HEIGHT_M    = 1.57;

const SEED: FitnessReading[] = [
  { id:'s1', date:'2025-11-15', weight:82.0, bmi:33.3, bodyFat:44.5, water:38.8, muscleMass:50.5, boneMass:3.3 },
  { id:'s2', date:'2025-12-10', weight:82.5, bmi:33.5, bodyFat:44.8, water:38.6, muscleMass:50.4, boneMass:3.3 },
  { id:'s3', date:'2026-01-12', weight:83.0, bmi:33.7, bodyFat:45.0, water:38.4, muscleMass:50.2, boneMass:3.2 },
  { id:'s4', date:'2026-02-08', weight:83.5, bmi:33.9, bodyFat:45.5, water:38.2, muscleMass:50.1, boneMass:3.2 },
  { id:'s5', date:'2026-03-14', weight:85.0, bmi:34.5, bodyFat:46.0, water:38.0, muscleMass:50.0, boneMass:3.2 },
  { id:'s6', date:'2026-04-09', weight:86.5, bmi:35.1, bodyFat:46.5, water:37.9, muscleMass:49.9, boneMass:3.2 },
  { id:'s7', date:'2026-05-17', weight:88.2, bmi:35.8, bodyFat:47.0, water:37.9, muscleMass:49.8, boneMass:3.2 },
];

// ─── Math ─────────────────────────────────────────────────────────────────────

function regress(readings: FitnessReading[]): Reg | null {
  if (readings.length < 2) return null;
  const t0 = new Date(readings[0].date).getTime();
  const xs = readings.map(r => (new Date(r.date).getTime() - t0) / 86400000);
  const ys = readings.map(r => r.weight);
  const n = xs.length;
  const mx = xs.reduce((a,b)=>a+b,0)/n, my = ys.reduce((a,b)=>a+b,0)/n;
  let num=0, den=0;
  for (let i=0;i<n;i++) { num+=(xs[i]-mx)*(ys[i]-my); den+=(xs[i]-mx)**2; }
  const slope = den ? num/den : 0;
  const intercept = my - slope*mx;
  const ssTot = ys.reduce((a,y)=>a+(y-my)**2,0);
  const ssRes = ys.reduce((a,y,i)=>a+(y-(slope*xs[i]+intercept))**2,0);
  const r2 = ssTot ? 1-ssRes/ssTot : 1;
  return { slope, intercept, r2, t0 };
}

function project(reg: Reg, daysFromStart: number): number {
  return reg.intercept + reg.slope * daysFromStart;
}

function daysFrom(reg: Reg, date: Date): number {
  return (date.getTime() - reg.t0) / 86400000;
}

function goalDate(reg: Reg, goal: number): Date | null {
  if (reg.slope >= 0) return null;
  const days = (goal - reg.intercept) / reg.slope;
  return new Date(reg.t0 + days * 86400000);
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtDate(iso: string, opts: { long?: boolean } = {}) {
  const d = new Date(iso);
  if (opts.long) return d.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
  return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

function fmtDateObj(d: Date) {
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
}

// ─── Status helpers ───────────────────────────────────────────────────────────

function weightStatus(w: number, goal: number): [string, string] {
  if (w <= goal) return ['AT GOAL', T.green];
  return ['ABOVE GOAL', T.rose];
}
function bmiStatus(b: number): [string, string] {
  if (b < 18.5) return ['UNDERWEIGHT', T.gold];
  if (b < 25)   return ['HEALTHY', T.green];
  if (b < 30)   return ['OVERWEIGHT', T.gold];
  return ['VERY HIGH', T.rose];
}
function fatStatus(f: number): [string, string] {
  if (f < 21) return ['LOW', T.gold];
  if (f < 33) return ['HEALTHY', T.green];
  if (f < 39) return ['HIGH', T.gold];
  return ['VERY HIGH', T.rose];
}
function waterStatus(w: number): [string, string] {
  if (w < 45) return ['LOW', T.rose];
  return ['HEALTHY', T.green];
}
function muscleStatus(m: number): [string, string] {
  if (m >= 45) return ['STRONG', T.green];
  if (m >= 38) return ['AVERAGE', T.gold];
  return ['LOW', T.rose];
}
function boneStatus(b: number): [string, string] {
  if (b >= 3.0) return ['HEALTHY', T.green];
  return ['LOW', T.gold];
}

// ─── Primitives ───────────────────────────────────────────────────────────────

const kStyle: CSSProperties = {
  fontFamily: T.sans, fontSize: 10, fontWeight: 500,
  letterSpacing: '0.24em', textTransform: 'uppercase', color: T.muted,
};
function Kicker({ children, color, style }: { children: React.ReactNode; color?: string; style?: CSSProperties }) {
  return <div style={{ ...kStyle, color: color ?? T.muted, ...style }}>{children}</div>;
}
function Rule({ weight=0.5, style }: { weight?: number; style?: CSSProperties }) {
  return <div style={{ borderTop:`${weight}px solid ${T.line}`, ...style }} />;
}
function ThickRule({ style }: { style?: CSSProperties }) {
  return <div style={{ borderTop:`2px solid ${T.ink}`, ...style }} />;
}
function Wrap({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ maxWidth:1080, margin:'0 auto', padding:'56px 40px 120px', ...style }}>
      {children}
    </div>
  );
}

// ─── Lock screen ──────────────────────────────────────────────────────────────

function Lock({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/operator/verify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ ts: Date.now(), pw }));
        onUnlock();
      } else {
        setErr(true);
        setTimeout(() => setErr(false), 1400);
      }
    } catch {
      setErr(true);
      setTimeout(() => setErr(false), 1400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:T.paper, padding:40 }}>
      <form onSubmit={submit} style={{ width:'100%', maxWidth:360, textAlign:'center' }}>
        <Kicker style={{ marginBottom:20 }}>Vol. 01 · Restricted Access</Kicker>
        <h1 style={{ fontFamily:T.display, fontWeight:400, fontStyle:'italic', fontSize:48, color:T.ink, margin:'0 0 8px', letterSpacing:'-0.02em' }}>
          Operator.
        </h1>
        <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:16, color:T.muted, margin:'0 0 40px' }}>a private weighing log.</p>
        <ThickRule style={{ marginBottom:32 }} />
        <div style={{ borderBottom:`0.5px solid ${err ? T.rose : T.line}`, marginBottom:24, transition:'border-color 0.2s' }}>
          <input
            ref={ref}
            type="password"
            placeholder="enter password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            style={{
              width:'100%', background:'transparent', border:'none', outline:'none',
              fontFamily:T.display, fontStyle:'italic', fontSize:20, color:T.ink,
              padding:'4px 0 10px', textAlign:'center',
            }}
          />
        </div>
        {err && <p style={{ fontFamily:T.sans, fontSize:10, letterSpacing:'0.2em', color:T.rose, marginBottom:12 }}>INCORRECT PASSWORD</p>}
        <button type="submit" disabled={loading} style={{
          background:T.ink, color:T.paper, border:0, cursor:'pointer',
          padding:'14px 36px', fontFamily:T.sans, fontSize:10, fontWeight:500,
          letterSpacing:'0.24em', textTransform:'uppercase', opacity: loading ? 0.6 : 1,
        }}>
          {loading ? 'Verifying…' : 'Enter →'}
        </button>
      </form>
    </div>
  );
}

// ─── Hero reading ─────────────────────────────────────────────────────────────

function HeroReading({ latest, previous, sorted }: { latest:FitnessReading; previous:FitnessReading; sorted:FitnessReading[] }) {
  const dw = latest.weight - previous.weight;
  const last4 = sorted.slice(-4);
  const sparkW=280, sparkH=60, sp=6;
  const sYs = last4.map(r=>r.weight);
  const sMin = Math.min(...sYs)-0.4, sMax = Math.max(...sYs)+0.4;
  const sXs = last4.map((_,i)=> sp + (i/(last4.length-1))*(sparkW-sp*2));
  const sYp = last4.map(r=> sp + (1-(r.weight-sMin)/(sMax-sMin))*(sparkH-sp*2));
  const sPath = sXs.map((x,i)=>(i===0?'M':'L')+x.toFixed(1)+','+sYp[i].toFixed(1)).join(' ');

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:48, alignItems:'end', paddingBottom:48, borderBottom:`2px solid ${T.ink}`, marginBottom:48 }}>
      <div>
        <Kicker style={{ marginBottom:14 }}>This Week&apos;s Figure · {fmtDate(latest.date, { long:true })}</Kicker>
        <div style={{ display:'flex', alignItems:'baseline', gap:16, marginBottom:12 }}>
          <span style={{ fontFamily:T.display, fontWeight:400, fontSize:120, letterSpacing:'-0.04em', lineHeight:0.85, color:T.ink }}>
            {latest.weight.toFixed(1)}
          </span>
          <span style={{ fontFamily:T.display, fontStyle:'italic', fontSize:28, color:T.muted }}>kg</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <span style={{
            fontFamily:T.sans, fontSize:10, fontWeight:500, letterSpacing:'0.2em',
            color: dw >= 0 ? T.rose : T.green,
            padding:'4px 10px', background: dw >= 0 ? T.roseSoft : T.greenSoft,
          }}>
            {dw >= 0 ? '▲' : '▼'} {Math.abs(dw).toFixed(1)} KG SINCE LAST
          </span>
          <Kicker>
            {dw >= 0 ? 'Moving away from goal' : 'Moving toward goal'}
          </Kicker>
        </div>
      </div>
      <div>
        <Kicker style={{ marginBottom:10 }}>Last 4 Readings · Weight</Kicker>
        <svg viewBox={`0 0 ${sparkW} ${sparkH}`} style={{ width:'100%', height:60, display:'block', marginBottom:8 }}>
          <path d={sPath} fill="none" stroke={T.ink} strokeWidth="1" />
          {sXs.map((x,i) => (
            <circle key={i} cx={x} cy={sYp[i]} r="2.5" fill={i===last4.length-1 ? T.rose : T.muted} />
          ))}
        </svg>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <Kicker>{sYs[0].toFixed(1)}</Kicker>
          <Kicker color={T.rose}>{sYs[sYs.length-1].toFixed(1)}</Kicker>
        </div>
      </div>
    </div>
  );
}

// ─── Stat panel ───────────────────────────────────────────────────────────────

function StatItem({ label, value, unit, status, statusColor, last }: {
  label:string; value:string; unit:string; status:string; statusColor:string; last?:boolean;
}) {
  return (
    <div style={{ flex:1, padding:'22px 22px', borderRight: last ? 'none' : `0.5px solid ${T.line}` }}>
      <Kicker style={{ marginBottom:12 }}>{label}</Kicker>
      <div style={{ display:'flex', alignItems:'baseline', gap:5, marginBottom:10 }}>
        <span style={{ fontFamily:T.display, fontWeight:400, fontSize:40, lineHeight:1, color:T.ink, letterSpacing:'-0.015em' }}>{value}</span>
        {unit && <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>{unit}</span>}
      </div>
      <span style={{
        fontFamily:T.sans, fontSize:9.5, fontWeight:500, letterSpacing:'0.22em',
        textTransform:'uppercase', color:statusColor,
        padding:'3px 8px', background:statusColor+'18', display:'inline-block',
      }}>{status}</span>
    </div>
  );
}

// ─── Trend chart ──────────────────────────────────────────────────────────────

function TrendChart({ sorted, reg, goal }: { sorted:FitnessReading[]; reg:Reg|null; goal:number }) {
  const W=1000, H=340;
  const PAD = { top:36, right:90, bottom:50, left:56 };
  const iW = W-PAD.left-PAD.right, iH = H-PAD.top-PAD.bottom;
  if (sorted.length < 2 || !reg) return null;

  const lastDay = daysFrom(reg, new Date(sorted[sorted.length-1].date));
  const predDays = 90;
  const xMax = lastDay + predDays;

  const predY = project(reg, xMax);
  const allYs = sorted.map(r=>r.weight).concat([goal, predY]);
  const yMin = Math.floor(Math.min(...allYs)-2), yMax = Math.ceil(Math.max(...allYs)+2);

  const xS = (d:number) => PAD.left + (d/xMax)*iW;
  const yS = (v:number) => PAD.top + (1-(v-yMin)/(yMax-yMin))*iH;

  const pts = sorted.map(r => [xS(daysFrom(reg, new Date(r.date))), yS(r.weight)] as [number,number]);
  const lineD = pts.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const areaD = lineD + ` L ${pts[pts.length-1][0].toFixed(1)},${(H-PAD.bottom)} L ${pts[0][0].toFixed(1)},${(H-PAD.bottom)} Z`;

  const predPt = [xS(xMax), yS(predY)] as [number,number];
  const predLineD = `M ${pts[pts.length-1][0].toFixed(1)},${pts[pts.length-1][1].toFixed(1)} L ${predPt[0].toFixed(1)},${predPt[1].toFixed(1)}`;

  const goalY = yS(goal);
  const yTicks = [yMin, Math.round(yMin+(yMax-yMin)*0.33), Math.round(yMin+(yMax-yMin)*0.67), yMax];

  // month label for each reading + prediction end
  const mLabel = (iso:string) => new Date(iso).toLocaleDateString('en-GB',{month:'short'});

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', display:'block', margin:'24px 0 8px' }}>
      {/* area */}
      <path d={areaD} fill={T.ink} opacity="0.03" />
      {/* goal zone */}
      <rect x={PAD.left} y={goalY} width={iW} height={H-PAD.bottom-goalY} fill={T.goldSoft} opacity="0.4" />
      {/* y ticks */}
      {yTicks.map((t,i) => (
        <g key={i}>
          <line x1={PAD.left} y1={yS(t)} x2={PAD.left+iW} y2={yS(t)} stroke={T.softLine} strokeWidth="0.5" />
          <text x={PAD.left-8} y={yS(t)+4} textAnchor="end" fontFamily={T.sans} fontSize="11" fill={T.muted}>{t}</text>
        </g>
      ))}
      {/* goal line */}
      <line x1={PAD.left} y1={goalY} x2={PAD.left+iW} y2={goalY} stroke={T.gold} strokeWidth="1" strokeDasharray="6,4" />
      <text x={PAD.left+iW+6} y={goalY+4} fontFamily={T.sans} fontSize="10" fill={T.gold} fontWeight="500" letterSpacing="0.1em">GOAL</text>
      {/* prediction line */}
      <path d={predLineD} fill="none" stroke={T.blue} strokeWidth="1" strokeDasharray="5,4" opacity="0.7" />
      <circle cx={predPt[0]} cy={predPt[1]} r="3" fill={T.blue} opacity="0.5" />
      <text x={predPt[0]+7} y={predPt[1]+4} fontFamily={T.display} fontStyle="italic" fontSize="12" fill={T.blue} opacity="0.8">
        {predY.toFixed(1)} kg
      </text>
      {/* observed line */}
      <path d={lineD} fill="none" stroke={T.ink} strokeWidth="1.2" />
      {pts.map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={T.ink} />
      ))}
      {/* x labels */}
      {sorted.map((r,i) => (
        <text key={i} x={pts[i][0]} y={H-10} textAnchor="middle" fontFamily={T.sans} fontSize="11" fill={T.muted}>{mLabel(r.date)}</text>
      ))}
      <text x={predPt[0]} y={H-10} textAnchor="middle" fontFamily={T.sans} fontSize="11" fill={T.blue} opacity="0.6">
        {mLabel(new Date(reg.t0 + xMax*86400000).toISOString())}
      </text>
      {/* axes */}
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H-PAD.bottom} stroke={T.line} strokeWidth="0.5" />
      <line x1={PAD.left} y1={H-PAD.bottom} x2={PAD.left+iW} y2={H-PAD.bottom} stroke={T.line} strokeWidth="0.5" />
    </svg>
  );
}

// ─── Composition chart ────────────────────────────────────────────────────────

function CompositionChart({ sorted }: { sorted:FitnessReading[] }) {
  const W=320, H=100, PAD=14;
  const iW=W-PAD*2, iH=H-PAD*2;
  const metrics = [
    { key:'bodyFat',    label:'Body Fat',    color:T.rose,  unit:'%', soft:T.roseSoft },
    { key:'muscleMass', label:'Muscle Mass', color:T.green, unit:'%', soft:T.greenSoft },
    { key:'water',      label:'Body Water',  color:T.blue,  unit:'%', soft:T.blueSoft },
  ] as const;

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0, borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}`, marginTop:16 }}>
      {metrics.map((m, idx) => {
        const ys = sorted.map(r => r[m.key as keyof FitnessReading] as number);
        const yMin=Math.min(...ys)-0.5, yMax=Math.max(...ys)+0.5;
        const xs = sorted.map((_,i)=>PAD+(i/(sorted.length-1))*iW);
        const yPos = sorted.map(r => PAD+(1-((r[m.key as keyof FitnessReading] as number)-yMin)/(yMax-yMin))*iH);
        const path = xs.map((x,i)=>(i===0?'M':'L')+x.toFixed(1)+','+yPos[i].toFixed(1)).join(' ');
        const last=ys[ys.length-1], delta=last-ys[0];
        return (
          <div key={m.key} style={{ padding:'20px 22px', borderRight: idx<2 ? `0.5px solid ${T.line}` : 'none' }}>
            <Kicker style={{ marginBottom:10 }}>{m.label}</Kicker>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:56, display:'block', marginBottom:10 }}>
              <path d={path+` L ${xs[xs.length-1].toFixed(1)},${H-PAD} L ${xs[0].toFixed(1)},${H-PAD} Z`} fill={m.color} opacity="0.07" />
              <path d={path} fill="none" stroke={m.color} strokeWidth="1.2" />
              {xs.map((x,i)=><circle key={i} cx={x} cy={yPos[i]} r="2.5" fill={m.color} />)}
            </svg>
            <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
              <span style={{ fontFamily:T.display, fontSize:34, color:T.ink, letterSpacing:'-0.01em' }}>{last.toFixed(1)}</span>
              <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>{m.unit}</span>
            </div>
            <span style={{
              fontFamily:T.sans, fontSize:9.5, fontWeight:500, letterSpacing:'0.2em',
              color: delta>0 ? T.rose : T.green,
            }}>
              {delta>0?'▲':'▼'} {Math.abs(delta).toFixed(1)} since Nov
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── BMI chart ────────────────────────────────────────────────────────────────

function BMIChart({ sorted }: { sorted:FitnessReading[] }) {
  const W=1000, H=220;
  const PAD = { top:20, right:72, bottom:38, left:50 };
  const iW=W-PAD.left-PAD.right, iH=H-PAD.top-PAD.bottom;
  const ys=sorted.map(r=>r.bmi);
  const yMin=Math.floor(Math.min(...ys,25)-1), yMax=Math.ceil(Math.max(...ys,30)+1);
  const xs=sorted.map((_,i)=>PAD.left+(i/(sorted.length-1))*iW);
  const yP=sorted.map(r=>PAD.top+(1-(r.bmi-yMin)/(yMax-yMin))*iH);
  const path=xs.map((x,i)=>(i===0?'M':'L')+x.toFixed(1)+','+yP[i].toFixed(1)).join(' ');
  const yH=(v:number)=>PAD.top+(1-(v-yMin)/(yMax-yMin))*iH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', display:'block', margin:'16px 0 8px' }}>
      {/* zones */}
      <rect x={PAD.left} y={yH(30)} width={iW} height={H-PAD.bottom-yH(30)} fill={T.rose} opacity="0.05" />
      <rect x={PAD.left} y={yH(25)} width={iW} height={yH(30)-yH(25)} fill={T.gold} opacity="0.05" />
      <rect x={PAD.left} y={yH(18.5)} width={iW} height={yH(25)-yH(18.5)} fill={T.green} opacity="0.05" />
      {/* zone labels */}
      {[{v:32,l:'OBESE',c:T.rose},{v:27,l:'OVERWEIGHT',c:T.gold},{v:21.5,l:'HEALTHY',c:T.green}].map(z=>(
        <text key={z.l} x={PAD.left+iW+5} y={yH(z.v)+4} fontFamily={T.sans} fontSize="9.5" fill={z.c} letterSpacing="0.12em">{z.l}</text>
      ))}
      {/* hairlines */}
      {[18.5,25,30].map(v=>(
        <line key={v} x1={PAD.left} y1={yH(v)} x2={PAD.left+iW} y2={yH(v)} stroke={T.line} strokeWidth="0.5" strokeDasharray="4,3" />
      ))}
      {/* path */}
      <path d={path} fill="none" stroke={T.ink} strokeWidth="1" />
      {xs.map((x,i)=><circle key={i} cx={x} cy={yP[i]} r="3" fill={T.ink} />)}
      {/* month labels */}
      {sorted.map((r,i)=>(
        <text key={i} x={xs[i]} y={H-8} textAnchor="middle" fontFamily={T.sans} fontSize="11" fill={T.muted}>
          {new Date(r.date).toLocaleDateString('en-GB',{month:'short'})}
        </text>
      ))}
      {/* y axis */}
      {[yMin,25,30,yMax].map(v=>(
        <text key={v} x={PAD.left-6} y={yH(v)+4} textAnchor="end" fontFamily={T.sans} fontSize="10" fill={T.muted}>{v}</text>
      ))}
    </svg>
  );
}

// ─── Milestones ───────────────────────────────────────────────────────────────

function Milestones({ sorted, reg, goal }: { sorted:FitnessReading[]; reg:Reg|null; goal:number }) {
  const latest = sorted[sorted.length-1];
  const steps = [85, 80, 75, 70, 65, goal].filter(m => m < latest.weight);

  return (
    <div style={{ marginTop:64 }}>
      <Kicker style={{ marginBottom:10 }}>Section III · Milestones</Kicker>
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:34, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>
        Waypoints <em>on the route home</em>.
      </h2>
      <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.muted, margin:'0 0 0' }}>
        {reg && reg.slope < 0 ? 'Estimated at your current rate of loss.' : 'Requires a trend reversal — current direction is away from goal.'}
      </p>
      <ThickRule style={{ margin:'18px 0 0' }} />
      <div style={{ borderBottom:`0.5px solid ${T.line}` }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', padding:'10px 0', borderBottom:`0.5px solid ${T.softLine}` }}>
          <Kicker>Milestone</Kicker>
          <Kicker style={{ textAlign:'right' }}>Weight</Kicker>
          <Kicker style={{ textAlign:'right' }}>Estimated date</Kicker>
        </div>
        {steps.map((kg,i) => {
          const isGoal = kg === goal;
          const d = reg && reg.slope < 0 ? goalDate({ ...reg, intercept: reg.intercept, slope: reg.slope } as Reg, kg) : null;
          // project goal for this milestone weight
          let projDate: Date | null = null;
          if (reg && reg.slope < 0) {
            const days = (kg - reg.intercept) / reg.slope;
            projDate = new Date(reg.t0 + days * 86400000);
          }
          return (
            <div key={kg} style={{
              display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
              padding:'18px 0', borderBottom: i < steps.length-1 ? `0.5px solid ${T.softLine}` : 'none',
              alignItems:'baseline',
            }}>
              <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:20, color: isGoal ? T.gold : T.ink }}>
                {isGoal ? 'Goal ★' : `−${(latest.weight-kg).toFixed(1)} kg waypoint`}
              </div>
              <div style={{ fontFamily:T.display, fontSize:26, color: isGoal ? T.gold : T.ink, textAlign:'right', letterSpacing:'-0.01em' }}>
                {kg.toFixed(1)} <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>kg</span>
              </div>
              <div style={{ textAlign:'right' }}>
                {projDate ? (
                  <span style={{ fontFamily:T.sans, fontSize:12, color: isGoal ? T.gold : T.body }}>{fmtDateObj(projDate)}</span>
                ) : (
                  <span style={{ fontFamily:T.sans, fontSize:10, letterSpacing:'0.15em', color:T.muted }}>REVERSE TREND FIRST</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Cut Strategies ───────────────────────────────────────────────────────────

function CutStrategies({ sorted, goal }: { sorted:FitnessReading[]; goal:number }) {
  const latest = sorted[sorted.length-1];
  const toGo   = latest.weight - goal;

  // Mifflin-St Jeor BMR (female, age 30 — reasonable default)
  const bmr  = Math.round(10*latest.weight + 6.25*HEIGHT_M*100 - 5*30 - 161);
  const tdee = { sedentary: Math.round(bmr*1.2), light: Math.round(bmr*1.375), moderate: Math.round(bmr*1.55) };

  const KcalPerKg = 7700;

  const strategies = [
    {
      name:'Slow & Steady', deficit:300,
      note:'Easiest to maintain for months. Minimal hunger. Best for preserving the muscle mass you have.',
      pro:'High adherence, near-zero muscle loss, no food obsession',
      con:'Longest timeline — requires patience',
    },
    {
      name:'Moderate Cut', deficit:500, recommended:true,
      note:'The evidence-backed sweet spot. Clinically recommended as the primary approach for sustainable fat loss.',
      pro:'Sustainable for 6–12 months, protects muscle when paired with resistance training',
      con:'Requires consistent tracking of intake',
    },
    {
      name:'Aggressive Cut', deficit:750,
      note:'Faster results, but harder to sustain beyond 3 months without diet breaks.',
      pro:'Meaningful progress within 2–3 months',
      con:'Elevated hunger, fatigue, some muscle loss risk',
    },
    {
      name:'Maximum Safe', deficit:1000,
      note:'Upper clinical limit. Appropriate only short-term or under medical supervision.',
      pro:'Fastest route to the goal',
      con:'Nutrient deficiency risk, energy crash, significant muscle loss without careful protein intake',
    },
  ];

  const nowMs = new Date(latest.date).getTime();

  const goalDateForDeficit = (deficit:number) => {
    const kgPerWeek = deficit / KcalPerKg * 7;
    const weeksNeeded = toGo / kgPerWeek;
    return new Date(nowMs + weeksNeeded * 7 * 86400000);
  };

  const thisWeekTarget = (deficit:number) => {
    const kgPerDay = deficit / KcalPerKg;
    return Math.max(0, latest.weight - kgPerDay * 7).toFixed(1);
  };

  // Verdict logic
  const verdict = latest.bmi >= 30 && latest.bodyFat > 33;
  const verdictText = verdict
    ? `Yes — cut. BMI ${latest.bmi.toFixed(1)} (obese class ${latest.bmi >= 35 ? 'II' : 'I'}) and body fat ${latest.bodyFat.toFixed(1)}% both indicate a calorie deficit is clinically appropriate. The moderate cut is the recommended starting point.`
    : `Moderate deficit recommended. Your metrics suggest fat loss would improve health markers significantly.`;

  return (
    <div style={{ marginTop:80 }}>
      <Kicker style={{ marginBottom:10 }}>Section VI · The Cut</Kicker>
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:34, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>
        Should you cut? <em>Yes. Here is how.</em>
      </h2>
      <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.muted, margin:'0 0 0' }}>
        Four strategies, their trade-offs, and what each means for your goal date.
      </p>
      <ThickRule style={{ margin:'18px 0 0' }} />

      {/* Verdict */}
      <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:32, padding:'28px 0', borderBottom:`0.5px solid ${T.line}`, alignItems:'start' }}>
        <div>
          <Kicker style={{ marginBottom:10 }}>The Verdict</Kicker>
          <span style={{ fontFamily:T.display, fontWeight:400, fontSize:56, color:T.gold, letterSpacing:'-0.02em', lineHeight:1 }}>Cut.</span>
        </div>
        <p style={{ fontFamily:T.sans, fontSize:14, fontWeight:300, color:T.body, lineHeight:1.7, margin:'28px 0 0', maxWidth:'52ch' }}>
          {verdictText}
        </p>
      </div>

      {/* TDEE estimate */}
      <div style={{ padding:'24px 0', borderBottom:`0.5px solid ${T.line}` }}>
        <Kicker style={{ marginBottom:14 }}>Estimated Daily Energy Expenditure · Mifflin-St Jeor (female, 30)</Kicker>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0 }}>
          {[
            { label:'Sedentary', mult:'×1.2', kcal:tdee.sedentary, note:'Desk job, little exercise' },
            { label:'Lightly Active', mult:'×1.375', kcal:tdee.light, note:'Light exercise 1–3 days/wk' },
            { label:'Moderately Active', mult:'×1.55', kcal:tdee.moderate, note:'Exercise 3–5 days/wk' },
          ].map((row,i) => (
            <div key={i} style={{ padding:'16px 20px', borderRight: i<2?`0.5px solid ${T.line}`:'none' }}>
              <Kicker style={{ marginBottom:8 }}>{row.label} {row.mult}</Kicker>
              <div style={{ display:'flex', alignItems:'baseline', gap:5, marginBottom:5 }}>
                <span style={{ fontFamily:T.display, fontSize:36, color:T.ink, letterSpacing:'-0.02em' }}>{row.kcal.toLocaleString()}</span>
                <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>kcal/day</span>
              </div>
              <Kicker color={T.muted}>{row.note}</Kicker>
            </div>
          ))}
        </div>
        <p style={{ fontFamily:T.sans, fontSize:11, color:T.muted, fontWeight:300, margin:'12px 20px 0', fontStyle:'italic' }}>
          Estimate only. Verify with a full TDEE calculator using your actual age and activity level.
        </p>
      </div>

      {/* Strategy comparison */}
      <div style={{ marginTop:0 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1.2fr 1.2fr', padding:'12px 0', borderBottom:`0.5px solid ${T.softLine}` }}>
          {['Strategy','Deficit','Intake (sedentary)','Loss rate','Goal date'].map((h,i)=>(
            <Kicker key={i} style={{ textAlign:i>0?'right':'left' }}>{h}</Kicker>
          ))}
        </div>
        {strategies.map((s, i) => {
          const kgPerWeek = (s.deficit/KcalPerKg*7);
          const intake = tdee.sedentary - s.deficit;
          const gDate = goalDateForDeficit(s.deficit);
          const isRec = s.recommended;
          return (
            <div key={i} style={{
              display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1.2fr 1.2fr',
              padding:'20px 0', borderBottom:`0.5px solid ${T.softLine}`,
              alignItems:'baseline',
              background: isRec ? T.goldSoft : 'transparent',
              margin: isRec ? '0 -20px' : 0,
            }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontFamily:T.display, fontStyle:'italic', fontSize:18, color: isRec?T.gold:T.ink }}>{s.name}</span>
                  {isRec && <span style={{ fontFamily:T.sans, fontSize:8, fontWeight:600, letterSpacing:'0.2em', color:T.gold, padding:'2px 7px', border:`0.5px solid ${T.gold}` }}>RECOMMENDED</span>}
                </div>
                <p style={{ fontFamily:T.sans, fontSize:12, fontWeight:300, color:T.body, margin:'6px 0 0', lineHeight:1.5, maxWidth:'28ch' }}>{s.note}</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <span style={{ fontFamily:T.display, fontSize:24, color:T.ink }}>−{s.deficit}</span>
                <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}> kcal</span>
              </div>
              <div style={{ textAlign:'right' }}>
                <span style={{ fontFamily:T.display, fontSize:24, color:T.ink }}>{intake.toLocaleString()}</span>
                <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}> kcal</span>
              </div>
              <div style={{ textAlign:'right' }}>
                <span style={{ fontFamily:T.display, fontSize:22, color:T.green }}>−{kgPerWeek.toFixed(2)}</span>
                <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}> kg/wk</span>
              </div>
              <div style={{ textAlign:'right' }}>
                <span style={{ fontFamily:T.display, fontStyle:'italic', fontSize:16, color: isRec?T.gold:T.body }}>
                  {fmtDateObj(gDate)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pro/Con detail */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:0, borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}`, marginTop:48 }}>
        {strategies.map((s,i) => (
          <div key={i} style={{ padding:'22px 24px', borderRight: i%2===0?`0.5px solid ${T.line}`:'none', borderBottom: i<2?`0.5px solid ${T.line}`:'none' }}>
            <Kicker style={{ marginBottom:8 }}>{s.name} · −{s.deficit} kcal/day</Kicker>
            <div style={{ fontFamily:T.sans, fontSize:12, color:T.green, marginBottom:5, fontWeight:300 }}>
              <strong style={{ fontWeight:600 }}>↑ </strong>{s.pro}
            </div>
            <div style={{ fontFamily:T.sans, fontSize:12, color:T.rose, fontWeight:300 }}>
              <strong style={{ fontWeight:600 }}>↓ </strong>{s.con}
            </div>
          </div>
        ))}
      </div>

      {/* This week's targets */}
      <div style={{ marginTop:56 }}>
        <Kicker style={{ marginBottom:10 }}>This Week · Specific Targets</Kicker>
        <h3 style={{ fontFamily:T.display, fontWeight:400, fontSize:28, letterSpacing:'-0.01em', lineHeight:1.05, color:T.ink, margin:'0 0 4px' }}>
          Starting from <em>{latest.weight.toFixed(1)} kg</em>, where should you be in 7 days?
        </h3>
        <ThickRule style={{ margin:'16px 0 0' }} />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderBottom:`0.5px solid ${T.line}` }}>
          {strategies.map((s,i) => {
            const target = parseFloat(thisWeekTarget(s.deficit));
            const change = target - latest.weight;
            const isRec = s.recommended;
            return (
              <div key={i} style={{ padding:'20px 18px', borderRight: i<3?`0.5px solid ${T.line}`:'none', background: isRec?T.goldSoft:'transparent' }}>
                <Kicker style={{ marginBottom:10 }} color={isRec?T.gold:undefined}>{s.name}</Kicker>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:6 }}>
                  <span style={{ fontFamily:T.display, fontSize:38, color:isRec?T.gold:T.ink, letterSpacing:'-0.02em', lineHeight:1 }}>{target.toFixed(1)}</span>
                  <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>kg</span>
                </div>
                <div style={{ fontFamily:T.sans, fontSize:11, color:T.green, fontWeight:500 }}>
                  {change.toFixed(2)} kg this week
                </div>
                <div style={{ fontFamily:T.sans, fontSize:10, color:T.muted, marginTop:4, letterSpacing:'0.05em' }}>
                  {(tdee.sedentary - s.deficit).toLocaleString()} kcal/day
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Muscle preservation note */}
      <div style={{ marginTop:40, padding:'24px', background:T.greenSoft, borderLeft:`2px solid ${T.green}` }}>
        <Kicker color={T.green} style={{ marginBottom:10 }}>Muscle Mass · {latest.muscleMass.toFixed(1)}% · Your strongest metric</Kicker>
        <p style={{ fontFamily:T.sans, fontSize:14, fontWeight:300, color:T.body, lineHeight:1.7, margin:0 }}>
          Muscle at {latest.muscleMass.toFixed(1)}% is your best number. Aggressive cuts risk eroding it.{' '}
          <strong style={{ color:T.ink, fontWeight:500 }}>Recommendation:</strong> start with the moderate cut (−500 kcal/day) and pair it with 2–3 resistance sessions per week.
          Ensure protein intake is at least <strong style={{ color:T.ink, fontWeight:500 }}>{Math.round(latest.weight * 1.6)}–{Math.round(latest.weight * 2.0)} g/day</strong> ({(latest.weight*1.6).toFixed(0)}–{(latest.weight*2.0).toFixed(0)} g at current weight) to protect lean mass during the cut.
        </p>
      </div>
    </div>
  );
}

// ─── Practical Insights ───────────────────────────────────────────────────────

function Insights({ sorted, reg, goal }: { sorted:FitnessReading[]; reg:Reg|null; goal:number }) {
  const latest = sorted[sorted.length-1];
  const slopePerWeek = reg ? reg.slope * 7 : 0;
  const toGo = latest.weight - goal;
  // Calories: 1 kg fat ≈ 7700 kcal
  const defFor05kgWk = Math.round(7700 * 0.5 / 7);
  const defFor1kgWk  = Math.round(7700 * 1.0 / 7);

  const items = [
    {
      kicker: 'What it takes · Calorie deficit needed',
      value: `${defFor05kgWk} – ${defFor1kgWk}`,
      unit: 'kcal / day',
      note: `A deficit of ${defFor05kgWk} kcal/day produces roughly 0.5 kg loss per week. ${defFor1kgWk} kcal/day delivers 1 kg/week — the upper safe limit. At 0.5 kg/week it would take about ${Math.ceil(toGo/(0.5*52)*12)} months to reach goal.`,
      color: T.blue,
    },
    {
      kicker: 'The current picture · Body fat',
      value: latest.bodyFat.toFixed(1),
      unit: '%',
      note: `Healthy body fat for women is 21–33%. Yours at ${latest.bodyFat.toFixed(1)}% is above that range. Each kilogram lost through diet and exercise should shift mostly fat, not muscle — which remains strong at ${latest.muscleMass.toFixed(1)}%.`,
      color: T.rose,
    },
    {
      kicker: 'The positive · Muscle mass',
      value: latest.muscleMass.toFixed(1),
      unit: '%',
      note: `Muscle mass above 45% is considered strong. Yours is ${latest.muscleMass.toFixed(1)}% — a genuine asset. Prioritise resistance training alongside any calorie reduction so that muscle is preserved as weight falls.`,
      color: T.green,
    },
    {
      kicker: 'Hydration · Body water',
      value: latest.water.toFixed(1),
      unit: '%',
      note: `Healthy body water for women is typically 45–60%. At ${latest.water.toFixed(1)}% you are below range. Aim for 2–3 litres of water per day; hydration also directly affects the accuracy of bioelectrical impedance readings from your scale.`,
      color: T.gold,
    },
  ];

  return (
    <div style={{ marginTop:64 }}>
      <Kicker style={{ marginBottom:10 }}>Section VIII · Insights</Kicker>
      <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:34, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>
        What the numbers <em>are saying</em>.
      </h2>
      <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.muted, margin:'0 0 0' }}>
        Practical context behind each figure.
      </p>
      <ThickRule style={{ margin:'18px 0 0' }} />
      <div style={{ borderBottom:`0.5px solid ${T.line}` }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns:'1fr 1.6fr',
            padding:'28px 0', borderBottom: i<items.length-1 ? `0.5px solid ${T.softLine}` : 'none',
            gap:40, alignItems:'start',
          }}>
            <div>
              <Kicker style={{ marginBottom:12 }}>{item.kicker}</Kicker>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span style={{ fontFamily:T.display, fontWeight:400, fontSize:48, color:item.color, letterSpacing:'-0.02em', lineHeight:1 }}>{item.value}</span>
                <span style={{ fontFamily:T.sans, fontSize:12, color:T.muted }}>{item.unit}</span>
              </div>
            </div>
            <p style={{ fontFamily:T.sans, fontSize:14, fontWeight:300, color:T.body, lineHeight:1.7, margin:'28px 0 0' }}>
              {item.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Compose modal ────────────────────────────────────────────────────────────

function Compose({ open, onClose, onSubmit }: {
  open:boolean; onClose:()=>void; onSubmit:(r:FitnessReading)=>void;
}) {
  const [form, setForm] = useState({ date:new Date().toISOString().slice(0,10), weight:'', bmi:'', bodyFat:'', water:'', muscleMass:'', boneMass:'' });
  useEffect(() => { if (!open) setForm(f=>({...f,weight:'',bmi:'',bodyFat:'',water:'',muscleMass:'',boneMass:''})); }, [open]);
  if (!open) return null;
  const set = (k:string) => (e:React.ChangeEvent<HTMLInputElement>) => setForm({...form,[k]:e.target.value});

  const submit = (e:FormEvent) => {
    e.preventDefault();
    const w = parseFloat(form.weight);
    if (!w) return;
    const bmi = parseFloat(form.bmi) || +(w/(HEIGHT_M*HEIGHT_M)).toFixed(1);
    onSubmit({
      id: Date.now().toString(), date: form.date, weight:w, bmi,
      bodyFat: parseFloat(form.bodyFat)||0, water: parseFloat(form.water)||0,
      muscleMass: parseFloat(form.muscleMass)||0, boneMass: parseFloat(form.boneMass)||0,
    });
    onClose();
  };

  const field = (label:string, key:string, unit:string, step='0.1') => (
    <label style={{ display:'block', marginBottom:22 }}>
      <Kicker style={{ marginBottom:8 }}>{label}</Kicker>
      <div style={{ display:'flex', alignItems:'baseline', gap:8, borderBottom:`0.5px solid ${T.line}`, paddingBottom:8 }}>
        <input
          type={key==='date'?'date':'number'} step={step}
          value={form[key as keyof typeof form]}
          onChange={set(key)}
          required={key==='weight'}
          style={{ flex:1, background:'transparent', border:'none', outline:'none', fontFamily:T.display, fontStyle:'italic', fontSize:24, color:T.ink, padding:'4px 0' }}
        />
        {unit && <span style={{ fontFamily:T.sans, fontSize:12, color:T.muted }}>{unit}</span>}
      </div>
    </label>
  );

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(26,24,21,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:24 }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:T.paper, maxWidth:480, width:'100%', padding:'40px 40px 48px', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:28 }}>
          <div>
            <Kicker style={{ marginBottom:8 }}>Compose new reading</Kicker>
            <h2 style={{ fontFamily:T.display, fontWeight:400, fontStyle:'italic', fontSize:28, color:T.ink, margin:0 }}>File a weigh-in.</h2>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:T.sans, fontSize:10, letterSpacing:'0.2em', color:T.muted }}>CLOSE</button>
        </div>
        <ThickRule style={{ marginBottom:28 }} />
        <form onSubmit={submit}>
          {field('Date', 'date', '')}
          {field('Weight', 'weight', 'kg')}
          {field('BMI', 'bmi', '(auto-calc if blank)')}
          {field('Body Fat', 'bodyFat', '%')}
          {field('Body Water', 'water', '%')}
          {field('Muscle Mass', 'muscleMass', '%')}
          {field('Bone Mass', 'boneMass', '%', '0.01')}
          <button type="submit" style={{
            background:T.ink, color:T.paper, border:0, cursor:'pointer', width:'100%',
            padding:'16px', fontFamily:T.sans, fontSize:10, fontWeight:500,
            letterSpacing:'0.24em', textTransform:'uppercase', marginTop:8,
          }}>Save to Ledger →</button>
        </form>
      </div>
    </div>
  );
}

// ─── API helpers ──────────────────────────────────────────────────────────────

function apiH(pw:string) { return { 'Content-Type':'application/json', 'x-operator-pw':pw }; }
async function apiLoad(pw:string) {
  try {
    const res = await fetch('/api/operator/fitness', { headers:apiH(pw) });
    if (!res.ok) return null;
    const j = await res.json();
    return j.setup_required ? null : (j.readings as FitnessReading[]);
  } catch { return null; }
}
async function apiSave(pw:string, r:FitnessReading) {
  try {
    const res = await fetch('/api/operator/fitness', { method:'POST', headers:apiH(pw), body:JSON.stringify(r) });
    if (!res.ok) return null;
    return ((await res.json()).reading?.id ?? null) as string|null;
  } catch { return null; }
}
async function apiDel(pw:string, id:string) {
  try { await fetch(`/api/operator/fitness?id=${encodeURIComponent(id)}`, { method:'DELETE', headers:apiH(pw) }); } catch {}
}

// ─── Main app ─────────────────────────────────────────────────────────────────

export default function OperatorDashboardClient() {
  const [authed, setAuthed]   = useState(false);
  const [opPw, setOpPw]       = useState('');
  const [tab, setTab]         = useState('Overview');
  const [readings, setReadings] = useState<FitnessReading[]>([]);
  const [goal, setGoal]       = useState(60.0);
  const [compose, setCompose] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [cloudOk, setCloudOk] = useState<boolean|null>(null);

  const saveLocal = useCallback((rs:FitnessReading[]) => { localStorage.setItem(STORAGE_KEY, JSON.stringify(rs)); }, []);

  const loadData = useCallback(async (pw:string) => {
    const localRaw = localStorage.getItem(STORAGE_KEY);
    const local: FitnessReading[] = localRaw ? JSON.parse(localRaw) : SEED;
    setReadings(local);
    if (!localRaw) saveLocal(local);
    setSyncing(true);
    const cloud = await apiLoad(pw);
    setSyncing(false);
    if (cloud === null) { setCloudOk(false); return; }
    setCloudOk(true);
    if (cloud.length === 0) {
      for (const r of local) { const nid = await apiSave(pw, r); if (nid) r.id = nid; }
      setReadings([...local]); saveLocal(local);
    } else { setReadings(cloud); saveLocal(cloud); }
  }, [saveLocal]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const g = localStorage.getItem(GOAL_KEY);
    if (g) setGoal(parseFloat(g));
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const { ts, pw } = JSON.parse(stored) as { ts:number; pw:string };
        if (Date.now()-ts < AUTH_TTL) { setAuthed(true); setOpPw(pw); loadData(pw); }
        else localStorage.removeItem(AUTH_KEY);
      } catch { localStorage.removeItem(AUTH_KEY); }
    }
  }, [loadData]);

  const handleUnlock = useCallback(async () => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      const { pw } = JSON.parse(stored) as { pw:string };
      setOpPw(pw); setAuthed(true); await loadData(pw);
    }
  }, [loadData]);

  const handleAdd = useCallback(async (r:FitnessReading) => {
    const next = [...readings, r].sort((a,b)=>a.date.localeCompare(b.date));
    setReadings(next); saveLocal(next);
    if (opPw) { const nid = await apiSave(opPw, r); if (nid&&nid!==r.id) { const u=next.map(x=>x.id===r.id?{...x,id:nid}:x); setReadings(u); saveLocal(u); } }
  }, [readings, opPw, saveLocal]);

  const handleDelete = useCallback(async (id:string) => {
    const next = readings.filter(r=>r.id!==id);
    setReadings(next); saveLocal(next);
    if (opPw) await apiDel(opPw, id);
  }, [readings, opPw, saveLocal]);

  const sorted   = useMemo(() => [...readings].sort((a,b)=>a.date.localeCompare(b.date)), [readings]);
  const reg      = useMemo(() => regress(sorted), [sorted]);
  const latest   = sorted[sorted.length-1];
  const previous = sorted.length>=2 ? sorted[sorted.length-2] : latest;

  if (!authed) {
    return <Lock onUnlock={() => {
      // auth state was set in Lock before calling onUnlock
      handleUnlock();
    }} />;
  }

  if (!latest) return <div style={{ background:T.paper, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}><p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:24, color:T.muted }}>No readings yet.</p></div>;

  const slopePerWeek = reg ? reg.slope*7 : 0;
  const startKg = sorted[0].weight;
  const remaining = latest.weight - goal;
  const reqRate6m = remaining/26;
  const reqRate1y = remaining/52;

  const projAt = (d:number) => reg ? project(reg, daysFrom(reg, new Date(latest.date)) + d) : 0;
  const projections = reg ? [
    { label:'1 month',  kg:projAt(30),  delta:projAt(30)-latest.weight },
    { label:'3 months', kg:projAt(90),  delta:projAt(90)-latest.weight },
    { label:'6 months', kg:projAt(180), delta:projAt(180)-latest.weight },
    { label:'1 year',   kg:projAt(365), delta:projAt(365)-latest.weight },
  ] : [];

  const [wsTxt,wsCol] = weightStatus(latest.weight, goal);
  const [bsTxt,bsCol] = bmiStatus(latest.bmi);
  const [fsTxt,fsCol] = fatStatus(latest.bodyFat);
  const [waTxt,waCol] = waterStatus(latest.water);
  const [msTxt,msCol] = muscleStatus(latest.muscleMass);
  const [bonTxt,bonCol] = boneStatus(latest.boneMass);

  const TABS = ['Overview','Projections','Charts','Ledger'];

  return (
    <div style={{ background:T.paper, minHeight:'100vh' }}>
      <Wrap>

        {/* ── MASTHEAD ─────────────────────────────── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
          <div>
            <Kicker>The Operator Log · Vol. 01 · Issue {sorted.length.toString().padStart(2,'0')}</Kicker>
          </div>
          <Kicker color={T.ink}>{fmtDate(latest.date, { long:true })}</Kicker>
        </div>

        <h1 style={{ fontFamily:T.display, fontWeight:400, fontSize:'clamp(48px,7vw,88px)', letterSpacing:'-0.025em', lineHeight:0.96, color:T.ink, margin:'0 0 24px', maxWidth:'16ch' }}>
          Weight, composition &amp; the <em>line headed home</em>.
        </h1>

        <div style={{ display:'grid', gridTemplateColumns:'2.2fr 1fr', gap:60, alignItems:'start', marginBottom:32 }}>
          <p style={{ fontFamily:T.sans, fontSize:18, fontWeight:300, lineHeight:1.6, color:T.body, margin:0, maxWidth:'52ch' }}>
            {sorted.length === 7 ? 'Seventh' : `${sorted.length}th`} recorded weigh-in since November. A private operator log charting the slow march of the body, the slope of the trend, and what the regression projects forward against the{' '}
            <em style={{ fontFamily:T.display, color:T.gold }}>{goal.toFixed(1)} kg</em> goal.
          </p>
          <div style={{ borderLeft:`0.5px solid ${T.line}`, paddingLeft:24 }}>
            <Kicker style={{ marginBottom:6 }}>By the Numbers</Kicker>
            <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:14, color:T.body, lineHeight:1.8 }}>
              {sorted.length} readings · {reg ? Math.round(reg.r2*100) : 0}% R² · slope{' '}
              <span style={{ color: slopePerWeek>=0 ? T.rose : T.green }}>{slopePerWeek>=0?'+':''}{slopePerWeek.toFixed(2)} kg/wk</span>
              {syncing && <span style={{ color:T.muted }}> · syncing…</span>}
            </div>
          </div>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderTop:`0.5px solid ${T.line}`, borderBottom:`0.5px solid ${T.line}`, gap:24, flexWrap:'wrap', marginBottom:6 }}>
          <div style={{ display:'flex', gap:32, flexWrap:'wrap', alignItems:'baseline' }}>
            <Kicker>
              <span style={{ display:'inline-block', width:6, height:6, background: cloudOk?T.green:T.muted, marginRight:7, verticalAlign:'middle' }} />
              {cloudOk===null ? 'Local' : cloudOk ? 'Cloud sync · active' : 'Local only'} · {readings.length} entries
            </Kicker>
            {reg && <Kicker>R² {Math.round(reg.r2*100)}% confidence</Kicker>}
          </div>
          <button onClick={() => { localStorage.removeItem(AUTH_KEY); setAuthed(false); }} style={{ background:'transparent', border:0, cursor:'pointer', fontFamily:T.sans, fontSize:10, fontWeight:500, letterSpacing:'0.24em', textTransform:'uppercase', color:T.muted, borderBottom:`0.5px solid ${T.line}`, paddingBottom:3 }}>
            Lock ⌃
          </button>
        </div>

        {/* ── TABS ─────────────────────────────────── */}
        <nav style={{ display:'flex', gap:48, padding:'16px 0 16px', borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}`, marginBottom:56 }}>
          {TABS.map(label => {
            const active = tab===label;
            return (
              <button key={label} onClick={()=>setTab(label)} style={{
                background:'transparent', border:0, cursor:'pointer', padding:'4px 0',
                fontFamily: active ? T.display : T.sans,
                fontStyle: active ? 'italic' : 'normal',
                fontSize: active ? 16 : 10, fontWeight: active ? 400 : 500,
                letterSpacing: active ? '-0.01em' : '0.24em',
                textTransform: active ? 'none' : 'uppercase',
                color: active ? T.ink : T.muted,
                borderBottom: active ? `1px solid ${T.ink}` : 'none',
                marginBottom:-1, transition:'color 200ms',
              }}>
                {active ? label.toLowerCase() : label}
              </button>
            );
          })}
        </nav>

        {/* ── OVERVIEW ─────────────────────────────── */}
        {tab==='Overview' && (
          <div>
            <HeroReading latest={latest} previous={previous} sorted={sorted} />

            <Kicker style={{ marginBottom:10 }}>Section I · The Full Panel</Kicker>
            <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:34, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>Six readings, <em>one body</em>.</h2>
            <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.muted, margin:'0 0 20px' }}>
              filed {fmtDate(latest.date,{long:true})} — all metrics from the latest weigh-in.
            </p>
            <div style={{ display:'flex', borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}`, marginBottom:64 }}>
              <StatItem label="Weight"    value={latest.weight.toFixed(1)}     unit="kg" status={wsTxt}  statusColor={wsCol} />
              <StatItem label="BMI"       value={latest.bmi.toFixed(1)}        unit=""   status={bsTxt}  statusColor={bsCol} />
              <StatItem label="Body Fat"  value={latest.bodyFat.toFixed(1)}    unit="%"  status={fsTxt}  statusColor={fsCol} />
              <StatItem label="Water"     value={latest.water.toFixed(1)}      unit="%"  status={waTxt}  statusColor={waCol} />
              <StatItem label="Muscle"    value={latest.muscleMass.toFixed(1)} unit="%"  status={msTxt}  statusColor={msCol} />
              <StatItem label="Bone"      value={latest.boneMass.toFixed(1)}   unit="%"  status={bonTxt} statusColor={bonCol} last />
            </div>

            <Kicker style={{ marginBottom:10 }}>Section II · The Goal</Kicker>
            <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:40, alignItems:'baseline', marginBottom:16 }}>
              <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:96, letterSpacing:'-0.025em', lineHeight:0.9, color:T.gold, margin:0 }}>
                {goal.toFixed(0)}<span style={{ fontStyle:'italic', fontSize:42, opacity:0.6 }}>.0</span>
                <span style={{ fontFamily:T.sans, fontSize:14, color:T.muted, letterSpacing:0, marginLeft:10 }}>kg</span>
              </h2>
              <div>
                <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:22, color:T.ink, marginBottom:8 }}>
                  <em>{remaining.toFixed(1)} kilograms</em> still to lose.
                </div>
                <div style={{ fontFamily:T.sans, fontSize:13, color:T.body, lineHeight:1.6, maxWidth:'48ch' }}>
                  Began at <strong style={{ color:T.ink }}>{startKg.toFixed(1)} kg</strong>; sitting at{' '}
                  <strong style={{ color:T.rose }}>{latest.weight.toFixed(1)} kg</strong> today. Direction of travel currently away from goal — see <button onClick={()=>setTab('Projections')} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:T.display, fontStyle:'italic', fontSize:13, color:T.gold, padding:0, textDecoration:'underline' }}>Projections</button> for corrective rate required.
                </div>
              </div>
            </div>

            {/* Progress track */}
            {(() => {
              const range = Math.max(startKg, latest.weight) - goal;
              const currentPct = (1-(latest.weight-goal)/range)*100;
              const startPct   = (1-(startKg-goal)/range)*100;
              return (
                <div style={{ marginTop:16, marginBottom:8 }}>
                  <div style={{ position:'relative', height:28, marginBottom:8 }}>
                    <div style={{ position:'absolute', left:0, right:0, top:'50%', height:1, background:T.line, transform:'translateY(-50%)' }} />
                    <div style={{ position:'absolute', top:'50%', height:3, transform:'translateY(-50%)', left:`${Math.min(currentPct,startPct)}%`, width:`${Math.abs(startPct-currentPct)}%`, background:T.rose, opacity:0.2 }} />
                    <div style={{ position:'absolute', left:0, top:'25%', bottom:'25%', width:2, background:T.gold }} />
                    <div style={{ position:'absolute', left:`${startPct}%`, top:'25%', bottom:'25%', width:1, background:T.muted }} />
                    <div style={{ position:'absolute', left:`${currentPct}%`, top:0, bottom:0, width:2, background:T.rose }} />
                    <div style={{ position:'absolute', left:`${currentPct}%`, top:-20, transform:'translateX(-50%)', fontFamily:T.display, fontStyle:'italic', fontSize:11, color:T.rose, whiteSpace:'nowrap' }}>
                      {latest.weight.toFixed(1)} kg
                    </div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', borderTop:`0.5px solid ${T.line}`, paddingTop:8 }}>
                    <Kicker color={T.gold}>← Goal {goal.toFixed(1)}</Kicker>
                    <Kicker color={T.muted}>Start {startKg.toFixed(1)}</Kicker>
                    <Kicker color={T.rose}>Today {latest.weight.toFixed(1)} →</Kicker>
                  </div>
                </div>
              );
            })()}

            <div style={{ marginTop:64 }}>
              <Kicker style={{ marginBottom:10 }}>Section III · Composition</Kicker>
              <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:34, letterSpacing:'-0.01em', lineHeight:1.06, color:T.ink, margin:'0 0 6px' }}>Where the body has <em>shifted</em>.</h2>
              <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.muted, margin:0 }}>a seven-month span — three slow-moving metrics, side by side.</p>
              <CompositionChart sorted={sorted} />
            </div>

            <Milestones sorted={sorted} reg={reg} goal={goal} />
            <Insights sorted={sorted} reg={reg} goal={goal} />

            <div style={{ marginTop:56 }}>
              <button onClick={()=>setCompose(true)} style={{ background:T.ink, color:T.paper, border:0, cursor:'pointer', padding:'16px 36px', fontFamily:T.sans, fontSize:10, fontWeight:500, letterSpacing:'0.24em', textTransform:'uppercase' }}>
                Compose new reading →
              </button>
            </div>
          </div>
        )}

        {/* ── PROJECTIONS ──────────────────────────── */}
        {tab==='Projections' && reg && (
          <div>
            <Kicker style={{ marginBottom:10 }}>Section IV · Projections</Kicker>
            <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:'clamp(36px,5vw,56px)', letterSpacing:'-0.02em', lineHeight:1, color:T.ink, margin:'0 0 32px', maxWidth:'18ch' }}>
              At the current rate, here is where the line <em>leads</em>.
            </h2>

            <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:36, alignItems:'baseline', padding:'28px 0', borderTop:`2px solid ${T.ink}`, borderBottom:`2px solid ${T.ink}`, marginBottom:48 }}>
              <span style={{ fontFamily:T.display, fontWeight:400, fontSize:96, color: slopePerWeek>=0 ? T.rose : T.green, letterSpacing:'-0.03em', lineHeight:0.9 }}>
                {slopePerWeek>=0?'+':''}{slopePerWeek.toFixed(2)}
                <span style={{ fontFamily:T.display, fontStyle:'italic', fontSize:32, opacity:0.7 }}> kg/wk</span>
              </span>
              <div>
                <Kicker color={slopePerWeek>=0?T.rose:T.green} style={{ marginBottom:8 }}>Current Trend Rate</Kicker>
                <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:20, color:T.ink, lineHeight:1.4, marginBottom:4 }}>
                  {slopePerWeek>=0 ? 'gaining' : 'losing'} weight at a steady pace.
                </div>
                <div style={{ fontFamily:T.sans, fontSize:13, color:T.body, fontWeight:300 }}>
                  Confidence — high. Linear fit explains <strong style={{ color:T.ink }}>{Math.round(reg.r2*100)}%</strong> of variance across {sorted.length} readings.
                </div>
              </div>
            </div>

            <Kicker style={{ marginBottom:14 }}>Horizons · Naïve Linear Extrapolation</Kicker>
            {slopePerWeek > 0 && (
              <div style={{ background:T.roseSoft, border:`0.5px solid ${T.rose}`, padding:'14px 18px', marginBottom:18 }}>
                <p style={{ fontFamily:T.sans, fontSize:13, color:T.rose, fontWeight:500, margin:0, letterSpacing:'0.02em' }}>
                  ⚠ You are currently gaining weight. These projections show where the trend leads if nothing changes.
                </p>
              </div>
            )}
            <div style={{ borderTop:`0.5px solid ${T.line}`, borderBottom:`0.5px solid ${T.line}` }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', padding:'10px 0', borderBottom:`0.5px solid ${T.softLine}` }}>
                <Kicker>Horizon</Kicker><Kicker style={{ textAlign:'right' }}>Projected weight</Kicker><Kicker style={{ textAlign:'right' }}>Δ from today</Kicker>
              </div>
              {projections.map((p,i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', padding:'22px 0', borderBottom: i<projections.length-1 ? `0.5px solid ${T.softLine}` : 'none', alignItems:'baseline' }}>
                  <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:22, color:T.ink }}>{p.label}</div>
                  <div style={{ fontFamily:T.display, fontSize:30, color:T.ink, textAlign:'right', letterSpacing:'-0.01em' }}>
                    {p.kg.toFixed(1)} <span style={{ fontFamily:T.sans, fontSize:11, color:T.muted }}>kg</span>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <span style={{ fontFamily:T.sans, fontSize:11, fontWeight:500, padding:'4px 10px', background: p.delta>=0?T.roseSoft:T.greenSoft, color: p.delta>=0?T.rose:T.green, letterSpacing:'0.2em', textTransform:'uppercase' }}>
                      {p.delta>=0?'↑':'↓'} {Math.abs(p.delta).toFixed(1)} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Kicker style={{ marginTop:56, marginBottom:14 }}>Required Pace · To Close the Gap</Kicker>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:0, borderTop:`2px solid ${T.ink}`, borderBottom:`0.5px solid ${T.line}`, marginBottom:56 }}>
              {[
                { label:'To hit goal in 6 months', value:-reqRate6m, unit:'kg / week', accent:T.gold },
                { label:'To hit goal in 1 year',   value:-reqRate1y, unit:'kg / week', accent:T.gold },
                { label:'Distance from goal',       value:remaining,  unit:'kilograms', accent:T.rose },
              ].map((m,i) => (
                <div key={i} style={{ padding:'26px 26px', borderRight: i<2?`0.5px solid ${T.line}`:'none' }}>
                  <Kicker style={{ marginBottom:12 }}>{m.label}</Kicker>
                  <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                    <span style={{ fontFamily:T.display, fontSize:40, color:m.accent, letterSpacing:'-0.02em', lineHeight:1 }}>
                      {(m.value>=0?'+':'')+m.value.toFixed(2)}
                    </span>
                  </div>
                  <Kicker color={T.muted} style={{ marginTop:6 }}>{m.unit}</Kicker>
                </div>
              ))}
            </div>

            <Kicker style={{ marginBottom:10 }}>Section V · The Line</Kicker>
            <h3 style={{ fontFamily:T.display, fontWeight:400, fontSize:32, letterSpacing:'-0.015em', lineHeight:1.05, color:T.ink, margin:'0 0 6px' }}>Observed &amp; <em>projected</em>.</h3>
            <p style={{ fontFamily:T.display, fontStyle:'italic', fontSize:14, color:T.muted, lineHeight:1.6, maxWidth:'60ch', margin:0 }}>
              solid hairline for observed weigh-ins, dashed gold for the goal line, dashed blue extending the linear regression ninety days forward.
            </p>
            <TrendChart sorted={sorted} reg={reg} goal={goal} />

            <Milestones sorted={sorted} reg={reg} goal={goal} />
            <CutStrategies sorted={sorted} goal={goal} />
          </div>
        )}

        {/* ── CHARTS ───────────────────────────────── */}
        {tab==='Charts' && (
          <div>
            <Kicker style={{ marginBottom:10 }}>Section VI · The Visual Ledger</Kicker>
            <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:'clamp(36px,5vw,56px)', letterSpacing:'-0.02em', lineHeight:1, color:T.ink, margin:'0 0 36px' }}>All charts, <em>in order</em>.</h2>
            <Kicker style={{ marginBottom:8 }}>Weight · {sorted.length} readings · with 90-day projection</Kicker>
            <ThickRule />
            <TrendChart sorted={sorted} reg={reg} goal={goal} />
            <div style={{ marginTop:72 }}>
              <Kicker style={{ marginBottom:8 }}>Body Composition · The Slow Movers</Kicker>
              <CompositionChart sorted={sorted} />
            </div>
            <div style={{ marginTop:72 }}>
              <Kicker style={{ marginBottom:8 }}>BMI · {sorted.length} readings · with zone bands</Kicker>
              <ThickRule />
              <BMIChart sorted={sorted} />
            </div>
          </div>
        )}

        {/* ── LEDGER ───────────────────────────────── */}
        {tab==='Ledger' && (
          <div>
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:18, marginBottom:28 }}>
              <div>
                <Kicker style={{ marginBottom:10 }}>Section VII · The Ledger</Kicker>
                <h2 style={{ fontFamily:T.display, fontWeight:400, fontSize:'clamp(36px,5vw,56px)', letterSpacing:'-0.02em', lineHeight:1, color:T.ink, margin:0 }}>Every <em>weigh-in</em>, in order.</h2>
              </div>
              <button onClick={()=>setCompose(true)} style={{ background:T.ink, color:T.paper, border:0, cursor:'pointer', padding:'14px 30px', fontFamily:T.sans, fontSize:10, fontWeight:500, letterSpacing:'0.24em', textTransform:'uppercase' }}>
                Compose new →
              </button>
            </div>
            <ThickRule />
            <div style={{ display:'grid', gridTemplateColumns:'1.6fr repeat(6,1fr) 0.5fr', padding:'10px 0', borderBottom:`0.5px solid ${T.softLine}` }}>
              {['Date','Weight','BMI','Body Fat','Water','Muscle','Bone',''].map((h,i) => (
                <Kicker key={i} style={{ textAlign: i>0?'right':'left' }}>{h}</Kicker>
              ))}
            </div>
            {[...sorted].reverse().map((r,i) => (
              <div key={r.id} style={{ display:'grid', gridTemplateColumns:'1.6fr repeat(6,1fr) 0.5fr', padding:'18px 0', borderBottom:`0.5px solid ${T.softLine}`, alignItems:'baseline' }}>
                <div style={{ fontFamily:T.display, fontStyle:'italic', fontSize:15, color:T.ink }}>{fmtDate(r.date)}</div>
                {[
                  r.weight.toFixed(1)+'kg', r.bmi.toFixed(1), r.bodyFat.toFixed(1)+'%',
                  r.water.toFixed(1)+'%', r.muscleMass.toFixed(1)+'%', r.boneMass.toFixed(2)+'%',
                ].map((v,j)=>(
                  <div key={j} style={{ fontFamily:T.sans, fontSize:14, color:T.body, textAlign:'right' }}>{v}</div>
                ))}
                <div style={{ textAlign:'right' }}>
                  {!r.id.startsWith('s') && (
                    <button onClick={()=>handleDelete(r.id)} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:T.sans, fontSize:9, letterSpacing:'0.16em', color:T.muted, textTransform:'uppercase' }}>del</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </Wrap>

      <Compose open={compose} onClose={()=>setCompose(false)} onSubmit={handleAdd} />
    </div>
  );
}
