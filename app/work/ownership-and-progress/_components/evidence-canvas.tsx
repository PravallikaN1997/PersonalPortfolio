"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from "react";

export type CanvasItem = {
  id: string;
  x: number;
  y: number;
  w: number;
  z?: number;
  tag: string;
  label: string;
  className?: string;
  /** Image artefacts link to the original. */
  href?: string;
  children: ReactNode;
};

export type Link = [string, string] | { a: string; b: string; color?: string; from?: [number, number]; to?: [number, number] };

type Pos = { x: number; y: number };
type Size = { w: number; h: number };
type Gesture = { kind: "item" | "pan"; id?: string; sx: number; sy: number; ox: number; oy: number; moved: boolean; el?: HTMLElement; pid?: number };

const STEP = 16;
const ZOOMS = [1, 1.25, 1.5, 1.75];
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), Math.max(lo, hi));

export function EvidenceCanvas({
  items,
  links,
  view: V,
  world: W,
  label,
  title,
  curve,
}: {
  items: CanvasItem[];
  links: Link[];
  view: Size;
  world: Size;
  label: string;
  /** Board variant: framed dotted canvas with a title, "Drag to explore" and "Reset layout". */
  title?: string;
  /** Curved, coloured connectors with arrowheads. */
  curve?: boolean;
}) {
  const home = useMemo(() => Object.fromEntries(items.map((i) => [i.id, { x: i.x, y: i.y }])) as Record<string, Pos>, [items]);
  const [pos, setPos] = useState<Record<string, Pos>>(home);
  const [pan, setPan] = useState<Pos>({ x: 0, y: 0 });
  const [zi, setZi] = useState(0);
  const [scale, setScale] = useState(1);
  const [ready, setReady] = useState(false);
  const [drag, setDrag] = useState<string | null>(null);
  const [panning, setPanning] = useState(false);
  const [top, setTop] = useState<string | null>(null);
  const [sizes, setSizes] = useState<Record<string, Size>>({});
  const viewRef = useRef<HTMLDivElement>(null);
  const els = useRef<Record<string, HTMLDivElement | null>>({});
  const gesture = useRef<Gesture | null>(null);
  const suppress = useRef(false);
  const zoom = ZOOMS[zi];
  const k = scale * zoom; // screen px per logical px

  useLayoutEffect(() => {
    const node = viewRef.current;
    if (!node) return;
    const measure = () => {
      setScale(node.clientWidth / V.w);
      setReady(true);
      setSizes(Object.fromEntries(Object.entries(els.current).filter(([, el]) => el).map(([id, el]) => [id, { w: el!.offsetWidth, h: el!.offsetHeight }])));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    Object.values(els.current).forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [V.w]);

  const bound = useCallback(
    (id: string, p: Pos): Pos => {
      const s = sizes[id] ?? { w: 0, h: 0 };
      return { x: clamp(p.x, 0, W.w - s.w), y: clamp(p.y, 0, W.h - s.h) };
    },
    [sizes, W.w, W.h],
  );
  const bindPan = useCallback((p: Pos, z: number): Pos => ({ x: clamp(p.x, Math.min(0, V.w / z - W.w), 0), y: clamp(p.y, Math.min(0, V.h / z - W.h), 0) }), [V.w, V.h, W.w, W.h]);

  const begin = (e: PointerEvent<HTMLElement>, kind: "item" | "pan", id?: string) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if ((e.target as HTMLElement).closest("button, .cs-ec__open")) return;
    const base = kind === "item" && id ? pos[id] : pan;
    gesture.current = { kind, id, sx: e.clientX, sy: e.clientY, ox: base.x, oy: base.y, moved: false };
    gesture.current.el = e.currentTarget; gesture.current.pid = e.pointerId;
    if (kind === "item" && id) { setTop(id); e.stopPropagation(); }
  };

  const move = (e: PointerEvent<HTMLElement>) => {
    const g = gesture.current;
    if (!g) return;
    const dx = (e.clientX - g.sx) / k;
    const dy = (e.clientY - g.sy) / k;
    if (!g.moved && Math.abs(dx) + Math.abs(dy) > 3) {
      g.moved = true;
      g.el?.setPointerCapture(g.pid!);
      if (g.kind === "item") setDrag(g.id!); else setPanning(true);
      window.getSelection()?.removeAllRanges();
    }
    if (!g.moved) return;
    if (g.kind === "item" && g.id) setPos((p) => ({ ...p, [g.id!]: bound(g.id!, { x: g.ox + dx, y: g.oy + dy }) }));
    else setPan(bindPan({ x: g.ox + dx, y: g.oy + dy }, zoom));
  };

  const end = () => {
    if (gesture.current?.moved) {
      suppress.current = true;
      setTimeout(() => (suppress.current = false), 0);
    }
    gesture.current = null;
    setDrag(null);
    setPanning(false);
  };

  const key = (e: KeyboardEvent<HTMLElement>, id: string) => {
    const d = e.shiftKey ? STEP * 3 : STEP;
    const v: Record<string, Pos> = { ArrowLeft: { x: -d, y: 0 }, ArrowRight: { x: d, y: 0 }, ArrowUp: { x: 0, y: -d }, ArrowDown: { x: 0, y: d } };
    const m = v[e.key];
    if (!m || e.target !== e.currentTarget) return;
    e.preventDefault();
    setTop(id);
    setPos((p) => ({ ...p, [id]: bound(id, { x: p[id].x + m.x, y: p[id].y + m.y }) }));
  };

  const setZoom = (n: number) => {
    const next = clamp(n, 0, ZOOMS.length - 1);
    setZi(next);
    setPan((p) => bindPan(p, ZOOMS[next]));
  };
  const reset = () => { setPos(home); setPan({ x: 0, y: 0 }); setZi(0); setTop(null); };
  const moved = zi !== 0 || pan.x !== 0 || pan.y !== 0 || items.some((i) => pos[i.id].x !== i.x || pos[i.id].y !== i.y);

  const rect = (id: string) => ({ ...pos[id], ...(sizes[id] ?? { w: 0, h: 0 }) });
  // Orthogonal connectors: straight where cards line up, one elbow otherwise.
  const anchor = (R: Pos & Size, f: [number, number]): Pos => ({ x: R.x + R.w * f[0], y: R.y + R.h * f[1] });
  const side = (f: [number, number]): Pos => (f[0] === 1 ? { x: 1, y: 0 } : f[0] === 0 ? { x: -1, y: 0 } : f[1] === 1 ? { x: 0, y: 1 } : { x: 0, y: -1 });
  const curves = curve ? links.flatMap((l) => {
    const { a, b, color, from, to } = Array.isArray(l) ? { a: l[0], b: l[1], color: undefined, from: undefined, to: undefined } : l;
    if (!sizes[a] || !sizes[b]) return [];
    const A = rect(a), B = rect(b);
    const f: [number, number] = from ?? (B.x >= A.x + A.w ? [1, 0.5] : A.x >= B.x + B.w ? [0, 0.5] : B.y >= A.y ? [0.5, 1] : [0.5, 0]);
    const t: [number, number] = to ?? (B.x >= A.x + A.w ? [0, 0.5] : A.x >= B.x + B.w ? [1, 0.5] : B.y >= A.y ? [0.5, 0] : [0.5, 1]);
    const p = anchor(A, f), q = anchor(B, t), d1 = side(f), d2 = side(t);
    const len = Math.max(40, Math.hypot(q.x - p.x, q.y - p.y) * 0.4);
    const c1 = { x: p.x + d1.x * len, y: p.y + d1.y * len }, c2 = { x: q.x + d2.x * len, y: q.y + d2.y * len };
    const nx = -d2.y, ny = d2.x;
    const arrow = [q, { x: q.x + d2.x * 9 + nx * 4.5, y: q.y + d2.y * 9 + ny * 4.5 }, { x: q.x + d2.x * 9 - nx * 4.5, y: q.y + d2.y * 9 - ny * 4.5 }];
    return [{ k: a + b, d: `M ${p.x} ${p.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${q.x} ${q.y}`, p, arrow, color }];
  }) : [];
  const lines = curve ? [] : links.flatMap((l) => {
    const [a, b] = Array.isArray(l) ? l : [l.a, l.b];
    if (!sizes[a] || !sizes[b]) return [];
    const A = rect(a), B = rect(b);
    const mid = (lo1: number, hi1: number, lo2: number, hi2: number) => {
      const lo = Math.max(lo1, lo2), hi = Math.min(hi1, hi2);
      return hi - lo > 24 ? (lo + hi) / 2 : null;
    };
    let pts: Pos[] | null = null;
    if (B.x >= A.x + A.w || A.x >= B.x + B.w) {
      const [L, R] = B.x >= A.x + A.w ? [A, B] : [B, A];
      const y = mid(L.y, L.y + L.h, R.y, R.y + R.h);
      const p = { x: L.x + L.w, y: y ?? L.y + L.h / 2 }, q = { x: R.x, y: y ?? R.y + R.h / 2 };
      const mx = (p.x + q.x) / 2;
      pts = y !== null ? [p, q] : [p, { x: mx, y: p.y }, { x: mx, y: q.y }, q];
      if (L === B) pts = pts.reverse();
    } else if (B.y >= A.y + A.h || A.y >= B.y + B.h) {
      const [U, D] = B.y >= A.y + A.h ? [A, B] : [B, A];
      const x = mid(U.x, U.x + U.w, D.x, D.x + D.w);
      const p = { x: x ?? U.x + U.w / 2, y: U.y + U.h }, q = { x: x ?? D.x + D.w / 2, y: D.y };
      const my = (p.y + q.y) / 2;
      pts = x !== null ? [p, q] : [p, { x: p.x, y: my }, { x: q.x, y: my }, q];
      if (U === B) pts = pts.reverse();
    }
    return pts ? [{ k: a + b, pts }] : [];
  });

  return (
    <div className="cs-ec cs-ec--board" role="region" aria-label={label}>
      <div className="cs-ec__bar">
        <span className="mono cs-ec__hint">{title}</span>
        <span className="cs-ec__ctl">
          <span className="mono cs-ec__drag"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12m0-1.5v-2a1.5 1.5 0 0 1 3 0V12m0-2.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L3.5 14a1.5 1.5 0 0 1 2.4-1.8L8 14"/></svg>Drag to explore</span>
          <span className="cs-ec__zoom">
            <button type="button" className="mono" onClick={() => setZoom(zi - 1)} disabled={zi === 0} aria-label="Zoom out">−</button>
            <button type="button" className="mono" onClick={() => setZoom(zi + 1)} disabled={zi === ZOOMS.length - 1} aria-label="Zoom in">+</button>
          </span>
          <button type="button" className="mono" onClick={reset} disabled={!moved}>Reset layout</button>
        </span>
      </div>
      <div
        ref={viewRef}
        className={`cs-ec__view${panning ? " is-panning" : ""}${ready ? " is-ready" : ""}`}
        style={{ aspectRatio: `${V.w} / ${V.h}` }}
        onPointerDown={(e) => begin(e, "pan")}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onClickCapture={(e) => { if (suppress.current) { e.preventDefault(); e.stopPropagation(); } }}
      >
        <div className="cs-ec__world" style={{ width: W.w, height: W.h, transform: `scale(${k}) translate(${pan.x}px, ${pan.y}px)` }}>
          <svg className="cs-ec__lines" width={W.w} height={W.h} aria-hidden="true">
            {curves.map((l) => (
              <g key={l.k} style={l.color ? ({ "--lc": l.color } as CSSProperties) : undefined} className="is-curve">
                <path d={l.d} />
                <circle cx={l.p.x} cy={l.p.y} r="3" />
                <polygon points={l.arrow.map((q) => `${q.x},${q.y}`).join(" ")} />
              </g>
            ))}
            {lines.map((l) => (
              <g key={l.k}>
                <polyline points={l.pts.map((q) => `${q.x},${q.y}`).join(" ")} />
                <circle cx={l.pts[0].x} cy={l.pts[0].y} r="3" />
                <circle cx={l.pts[l.pts.length - 1].x} cy={l.pts[l.pts.length - 1].y} r="3" />
              </g>
            ))}
          </svg>
          {items.map((it) => {
            const p = pos[it.id];
            return (
              <div
                key={it.id}
                ref={(el) => { els.current[it.id] = el; }}
                className={`cs-ec__item cs-fig${drag === it.id ? " is-dragging" : ""}${it.href ? " is-art" : ""}${it.className ? ` ${it.className}` : ""}`}
                style={{ left: p.x, top: p.y, width: it.w, zIndex: drag === it.id ? 50 : top === it.id ? 20 : (it.z ?? 1) }}
                tabIndex={0}
                role="group"
                aria-label={`${it.label}. Arrow keys move this card.`}
                onKeyDown={(e) => key(e, it.id)}
                onFocus={() => setTop(it.id)}
                onPointerDown={(e) => begin(e, "item", it.id)}
                onPointerMove={move}
                onPointerUp={end}
                onPointerCancel={end}
              >
                <div className="cs-ec__grip cs-cv__tag mono">
                  <span>{it.tag}</span>
                  {it.href ? <a className="cs-ec__open" href={it.href} target="_blank" rel="noopener">Open original ↗</a> : null}
                </div>
                {it.children}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
