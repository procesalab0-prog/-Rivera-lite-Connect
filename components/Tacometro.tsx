'use client';

import { useEffect, useId, useState } from 'react';
import { ETAPAS, indiceEtapa, porcentajeEtapa, type Etapa } from '@/lib/etapas';

// Indicador de progreso estilo tacómetro. Dos variantes:
//  - compact: barra horizontal (para tarjetas)
//  - full: gauge con aguja + lista de 7 etapas (pantalla de detalle)
export default function Tacometro({
  etapa,
  compact = false,
  size = '300px',
}: {
  etapa: Etapa;
  compact?: boolean;
  size?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const uid = useId().replace(/:/g, '');

  useEffect(() => {
    const r = requestAnimationFrame(() =>
      requestAnimationFrame(() => setMounted(true))
    );
    return () => cancelAnimationFrame(r);
  }, []);

  let i = indiceEtapa(etapa);
  if (i < 0) i = 0;
  const pct = porcentajeEtapa(etapa);
  const currentLabel = ETAPAS[i].label;

  if (compact) {
    return (
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="font-cond text-[13px] font-bold uppercase tracking-[0.08em] text-[#C7CDD6]">
            {currentLabel}
          </span>
          <span className="font-saira text-sm font-bold tabular-nums text-rivera-redb">
            {pct}%
          </span>
        </div>
        <div
          className="relative h-2 overflow-hidden rounded-full"
          style={{
            background: 'linear-gradient(180deg,#0a0b0d,#1a1d23)',
            boxShadow:
              'inset 0 1px 2px rgba(0,0,0,.8),inset 0 -1px 0 rgba(255,255,255,.04)',
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg,#8f0d13,#E11119 60%,#ff4d57)',
              boxShadow: '0 0 10px rgba(225,17,25,.6)',
              transition: 'width 1.2s cubic-bezier(.22,1,.36,1)',
              width: (mounted ? pct : 0) + '%',
            }}
          />
        </div>
      </div>
    );
  }

  // ---- Geometría del gauge ----
  const cx = 130,
    cy = 130,
    START = 135,
    SWEEP = 270,
    R = 96;
  const pt = (ang: number, r: number): [number, number] => {
    const rad = (ang * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const arcPath = (fromAng: number, toAng: number, r: number) => {
    const [sx, sy] = pt(fromAng, r);
    const [ex, ey] = pt(toAng, r);
    const large = toAng - fromAng > 180 ? 1 : 0;
    return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
  };

  const trackPath = arcPath(START, START + SWEEP, R);
  const needleTargetDeg = START + (i / 6) * SWEEP;
  const arcLen = 2 * Math.PI * R * (SWEEP / 360);
  const shown = (i / 6) * arcLen;
  const arcOffset = mounted ? arcLen - shown : arcLen;

  const ticks: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    w: number;
    color: string;
  }[] = [];
  for (let a = 0; a <= SWEEP + 0.1; a += 15) {
    const ang = START + a;
    const major = Math.abs(a % 45) < 0.1;
    const active = ang <= needleTargetDeg + 0.1;
    const rOut = R + 9;
    const rIn = major ? R - 4 : R + 2;
    const [x1, y1] = pt(ang, rIn);
    const [x2, y2] = pt(ang, rOut);
    ticks.push({
      x1,
      y1,
      x2,
      y2,
      w: major ? 3 : 1.4,
      color: active
        ? major
          ? '#ff5661'
          : '#E11119'
        : major
          ? '#5b626c'
          : '#33383f',
    });
  }

  const numbers = ETAPAS.map((_, j) => {
    const ang = START + (j / 6) * SWEEP;
    const [x, y] = pt(ang, R - 20);
    return { i: j + 1, x, y, color: j <= i ? '#e6eaef' : '#565c65' };
  });

  const stages = ETAPAS.map((s, j) => {
    const done = j < i,
      active = j === i;
    return {
      label: s.label,
      dot: active ? '#E11119' : done ? '#9aa3ad' : '#2a2e36',
      dotShadow: active
        ? '0 0 10px rgba(225,17,25,.9)'
        : 'inset 0 0 0 1px rgba(255,255,255,.06)',
      txt: active ? '#F2F4F7' : done ? '#9aa3ad' : '#565c65',
    };
  });

  return (
    <div className="flex w-full flex-col items-center justify-center font-saira text-rivera-ink">
      <div
        className="relative aspect-square w-full"
        style={{ maxWidth: size, containerType: 'inline-size' } as React.CSSProperties}
      >
        <svg viewBox="0 0 260 260" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id={`chromeRing-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f2f5f8" />
              <stop offset="0.28" stopColor="#aeb6c0" />
              <stop offset="0.5" stopColor="#5b626c" />
              <stop offset="0.72" stopColor="#9aa3ad" />
              <stop offset="1" stopColor="#e6eaef" />
            </linearGradient>
            <linearGradient id={`chromeRing2-${uid}`} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a3f47" />
              <stop offset="0.5" stopColor="#141619" />
              <stop offset="1" stopColor="#42474f" />
            </linearGradient>
            <radialGradient id={`face-${uid}`} cx="0.5" cy="0.42" r="0.65">
              <stop offset="0" stopColor="#22262d" />
              <stop offset="0.6" stopColor="#15181d" />
              <stop offset="1" stopColor="#0b0d10" />
            </radialGradient>
            <linearGradient id={`redArc-${uid}`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#7d0a0f" />
              <stop offset="0.55" stopColor="#E11119" />
              <stop offset="1" stopColor="#ff5661" />
            </linearGradient>
            <linearGradient id={`needleGrad-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ff5661" />
              <stop offset="1" stopColor="#E11119" />
            </linearGradient>
            <radialGradient id={`hub-${uid}`} cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="#f2f5f8" />
              <stop offset="0.5" stopColor="#9aa3ad" />
              <stop offset="1" stopColor="#2a2e36" />
            </radialGradient>
            <filter id={`glow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx="130" cy="130" r="126" fill={`url(#chromeRing-${uid})`} />
          <circle cx="130" cy="130" r="119" fill={`url(#chromeRing2-${uid})`} />
          <circle cx="130" cy="130" r="113" fill={`url(#face-${uid})`} stroke="#000" strokeWidth="1" />

          <path d={trackPath} fill="none" stroke="#2b2f37" strokeWidth="9" strokeLinecap="round" />
          <path
            d={trackPath}
            fill="none"
            stroke={`url(#redArc-${uid})`}
            strokeWidth="9"
            strokeLinecap="round"
            filter={`url(#glow-${uid})`}
            strokeDasharray={arcLen.toFixed(2)}
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(.22,1,.36,1)',
              strokeDashoffset: arcOffset.toFixed(2),
            }}
          />

          {ticks.map((t, k) => (
            <line
              key={k}
              x1={t.x1.toFixed(2)}
              y1={t.y1.toFixed(2)}
              x2={t.x2.toFixed(2)}
              y2={t.y2.toFixed(2)}
              stroke={t.color}
              strokeWidth={t.w}
              strokeLinecap="round"
            />
          ))}
          {numbers.map((n, k) => (
            <text
              key={k}
              x={n.x.toFixed(2)}
              y={n.y.toFixed(2)}
              fill={n.color}
              style={{ fontFamily: 'var(--font-saira-cond), sans-serif' }}
              fontWeight="700"
              fontSize="13"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {n.i}
            </text>
          ))}

          <g
            style={{
              transformBox: 'view-box',
              transformOrigin: '130px 130px',
              transition: 'transform 1.5s cubic-bezier(.22,1,.36,1)',
              transform: `rotate(${(mounted ? needleTargetDeg : START).toFixed(2)}deg)`,
            }}
          >
            <polygon points="130,124 130,136 210,131 210,129" fill={`url(#needleGrad-${uid})`} filter={`url(#glow-${uid})`} />
            <circle cx="130" cy="130" r="4" fill="#ff5661" />
          </g>
          <circle cx="130" cy="130" r="15" fill={`url(#hub-${uid})`} stroke="#0b0d10" strokeWidth="1.5" />
          <circle cx="130" cy="130" r="6" fill="#15181d" />
        </svg>

        <div className="pointer-events-none absolute inset-x-0 bottom-[13%] flex flex-col items-center">
          <span
            className="font-saira font-bold tabular-nums text-rivera-ink"
            style={{ fontSize: 'clamp(30px,11cqw,46px)', lineHeight: 0.9, textShadow: '0 2px 10px rgba(0,0,0,.6)' }}
          >
            {pct}
            <span style={{ fontSize: '.5em', color: '#E11119' }}>%</span>
          </span>
          <span className="mt-1 font-cond text-xs font-bold uppercase tracking-[0.14em] text-rivera-redb">
            {currentLabel}
          </span>
          <span className="mt-px font-saira text-[10px] font-medium uppercase tracking-[0.12em] text-rivera-dim">
            Etapa {i + 1} / 7
          </span>
        </div>
      </div>

      <ol className="mt-[18px] grid w-full list-none grid-cols-7 gap-1.5 p-0">
        {stages.map((s, k) => (
          <li key={k} className="flex flex-col items-center gap-1.5 text-center">
            <span
              className="h-2.5 w-2.5 rounded-full transition-all"
              style={{ background: s.dot, boxShadow: s.dotShadow }}
            />
            <span
              className="font-cond text-[10px] font-semibold uppercase leading-[1.05] tracking-[0.03em]"
              style={{ color: s.txt }}
            >
              {s.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
