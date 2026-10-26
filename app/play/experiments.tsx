"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

/* ---------- 01 Cursor Garden ---------- */

type Bloom = { id: number; x: number; y: number; s: number; r: number; t: number };

// A few flowers are already planted so the card is never empty. Fixed values keep server and client markup identical.
const SEED: Bloom[] = [
  [58, 14, 15, 10, 0], [34, 24, 12, 40, 1], [26, 40, 15, 0, 0], [50, 30, 10, 20, 2], [66, 36, 12, 60, 1], [80, 28, 11, 15, 0],
  [18, 54, 12, 25, 2], [44, 56, 11, 5, 0], [58, 62, 14, 50, 1], [72, 58, 12, 30, 0], [84, 52, 11, 10, 2], [30, 70, 11, 45, 1],
  [48, 76, 13, 20, 0], [64, 80, 12, 0, 2], [76, 72, 10, 35, 1],
].map(([x, y, s, r, t], i) => ({ id: -i - 1, x, y, s, r, t }));

function FlowerShape({ tone }: { tone: number }) {
  const fill = tone === 1 ? "color-mix(in srgb, var(--mark) 55%, white)" : tone === 2 ? "color-mix(in srgb, var(--mark) 32%, white)" : "var(--mark)";
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="12" cy="6.2" rx="3.4" ry="5" fill={fill} opacity="0.9" transform={`rotate(${a} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="2.2" fill="#fff" opacity="0.85" />
    </svg>
  );
}

/** A small toy: flowers grow under the pointer or a finger. Enter or Space plants one for keyboard users. */
export function CursorGarden() {
  const box = useRef<HTMLDivElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const next = useRef(1);
  const [grown, setGrown] = useState<Bloom[]>([]);

  function plant(x: number, y: number) {
    const id = next.current++;
    const b: Bloom = { id, x, y, s: 10 + Math.random() * 9, r: Math.random() * 70, t: id % 3 };
    setGrown((g) => [...g.slice(-34), b]);
  }
  function pos(e: React.PointerEvent) {
    const r = box.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, px: e.clientX, py: e.clientY };
  }

  return (
    <div
      ref={box}
      className="pl-garden"
      role="group"
      tabIndex={0}
      aria-label="Cursor Garden. Move a pointer over it, or press Enter, to grow small flowers."
      onPointerMove={(e) => {
        const p = pos(e);
        const l = last.current;
        if (l && Math.hypot(p.px - l.x, p.py - l.y) < 26) return;
        last.current = { x: p.px, y: p.py };
        plant(p.x, p.y);
      }}
      onPointerDown={(e) => { const p = pos(e); plant(p.x, p.y); }}
      onPointerLeave={() => { last.current = null; }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); plant(10 + Math.random() * 80, 10 + Math.random() * 80); }
      }}
    >
      {SEED.map((b) => (
        <span key={b.id} className="pl-bloom pl-bloom--seed" style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.s, height: b.s, transform: `translate(-50%, -50%) rotate(${b.r}deg)` }} aria-hidden="true">
          <FlowerShape tone={b.t} />
        </span>
      ))}
      {grown.map((b) => (
        <span key={b.id} className="pl-bloom" style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.s, height: b.s, "--rot": `${b.r}deg` } as CSSProperties} aria-hidden="true">
          <FlowerShape tone={b.t} />
        </span>
      ))}
    </div>
  );
}

/* ---------- 02 Prompt Shuffle ---------- */

const PROMPTS = [
  "what would you do if you had a full day to just explore?",
  "what tiny tool would make your week easier?",
  "what did you almost say today?",
  "what could you remix from something you already made?",
  "which small thing made you smile this week?",
  "if today had a soundtrack, what would be playing?",
  "what feels unfinished, in a good way?",
  "what would you build if it only had to work once?",
  "what would you name a very small cloud?",
];

export function PromptShuffle() {
  const [i, setI] = useState(0);
  return (
    <div className="pl-stack">
      <span className="pl-pc pl-pc--3" aria-hidden="true" />
      <span className="pl-pc pl-pc--2" aria-hidden="true" />
      <button type="button" className="pl-pc pl-pc--1" onClick={() => setI((n) => (n + 1) % PROMPTS.length)} aria-label="Show another prompt">
        <span className="pl-pc__text" aria-live="polite">{PROMPTS[i]}</span>
        <svg className="pl-pc__icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 12a8 8 0 1 1-2.6-5.9" /><path d="M20 4v4h-4" />
        </svg>
      </button>
    </div>
  );
}

/* ---------- 03 Sound Notes ---------- */

const BARS = Array.from({ length: 56 }, (_, i) => {
  const v = Math.abs(Math.sin(i * 0.55) * 0.55 + Math.sin(i * 1.37 + 1) * 0.35 + Math.sin(i * 0.19) * 0.3);
  return Math.max(0.12, Math.min(1, v));
});

/** A soft generated tone while it plays, so the control is honest: it is a prototype, not a note-to-sound engine yet. */
export function SoundPlayer() {
  const [on, setOn] = useState(false);
  const audio = useRef<{ ctx: AudioContext; stop: () => void } | null>(null);

  function start() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    lp.connect(master);
    master.connect(ctx.destination);
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.12;
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    const oscs = [196, 246.94, 293.66, 392].map((f, k) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      o.detune.value = k * 3;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(lp);
      o.start();
      return o;
    });
    lfo.start();
    master.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.2);
    audio.current = {
      ctx,
      stop: () => {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        setTimeout(() => { oscs.forEach((o) => o.stop()); lfo.stop(); ctx.close(); }, 450);
      },
    };
  }

  function toggle() {
    if (on) { audio.current?.stop(); audio.current = null; setOn(false); }
    else { start(); setOn(true); }
  }
  useEffect(() => () => { audio.current?.stop(); }, []);

  return (
    <div className={`pl-player${on ? " is-on" : ""}`}>
      <div className="pl-player__bar" aria-hidden="true"><i /><i /><i /></div>
      <div className="pl-player__body">
        <button type="button" className="pl-play" onClick={toggle} aria-pressed={on} aria-label={on ? "Pause the soft tone" : "Play a soft tone"}>
          {on ? (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <div className="pl-wave" aria-hidden="true">
          {BARS.map((h, i) => <i key={i} style={{ height: `${(h * 100).toFixed(2)}%` }} />)}
          <b className="pl-wave__head" />
        </div>
      </div>
    </div>
  );
}

/* ---------- 04 Mini Games ---------- */

const GW = 190;
const GH = 104;
const GROUND = GH - 16;
// An 8 x 8 pixel ghost, drawn at 2x.
const SPRITE = ["..XXXX..", ".XXXXXX.", "XX.XX.XX", "XX.XX.XX", "XXXXXXXX", "XXXXXXXX", "XXXXXXXX", "X.XX.XX."];

/** A tiny jump game. Click, tap, or press Space or Enter to jump the blocks. */
export function MiniGame() {
  const cv = useRef<HTMLCanvasElement>(null);
  const st = useRef({ y: 0, vy: 0, ox: GW + 20, score: 0, mode: "idle" as "idle" | "run" | "over" | "paused", raf: 0, speed: 2.3 });
  const box = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("click to play");

  function draw() {
    const c = cv.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const s = st.current;
    ctx.clearRect(0, 0, GW, GH);
    ctx.fillStyle = "#17120f";
    ctx.fillRect(0, GROUND, GW, 1);
    for (let i = 0; i < 12; i++) ctx.fillRect(((i * 37 - (s.mode === "run" ? s.score * 1.5 : 0)) % GW + GW) % GW, GROUND + 5 + (i % 3) * 3, 3, 1);
    SPRITE.forEach((row, ry) => [...row].forEach((ch, rx) => { if (ch === "X") ctx.fillRect(20 + rx * 2, GROUND - 16 - s.y + ry * 2, 2, 2); }));
    ctx.fillRect(s.ox, GROUND - 12, 8, 12);
    ctx.fillRect(s.ox + 2, GROUND - 16, 4, 4);
    ctx.font = "10px ui-monospace, monospace";
    ctx.textAlign = "right";
    ctx.fillText(String(Math.floor(s.score / 6)).padStart(3, "0"), GW - 8, 14);
  }

  function frame() {
    const s = st.current;
    s.vy -= 0.42;
    s.y = Math.max(0, s.y + s.vy);
    if (s.y === 0) s.vy = 0;
    s.ox -= s.speed;
    s.score += 1;
    s.speed = 2.3 + s.score / 900;
    if (s.ox < -12) s.ox = GW + 10 + Math.random() * 70;
    const hit = s.ox < 36 && s.ox + 8 > 20 && s.y < 12;
    draw();
    if (hit) {
      s.mode = "over";
      setLabel(`score ${Math.floor(s.score / 6)} · click to retry`);
      return;
    }
    s.raf = requestAnimationFrame(frame);
  }

  function act() {
    const s = st.current;
    if (s.mode === "paused") { s.mode = "run"; setLabel("jump!"); cancelAnimationFrame(s.raf); s.raf = requestAnimationFrame(frame); return; }
    if (s.mode === "run") { if (s.y === 0) { s.vy = 6.4; window.dispatchEvent(new Event("pl-chime")); } return; }
    s.y = 0; s.vy = 0; s.ox = GW + 20; s.score = 0; s.speed = 2.3; s.mode = "run";
    setLabel("jump!");
    cancelAnimationFrame(s.raf);
    s.raf = requestAnimationFrame(frame);
  }

  function pause() {
    const s = st.current;
    if (s.mode !== "run") return;
    cancelAnimationFrame(s.raf);
    s.mode = "paused";
    setLabel("paused · click to resume");
  }

  useEffect(() => {
    const out = (e: PointerEvent) => { if (box.current && !box.current.contains(e.target as Node)) pause(); };
    const hide = () => { if (document.hidden) pause(); };
    document.addEventListener("pointerdown", out);
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("blur", pause);
    return () => { document.removeEventListener("pointerdown", out); document.removeEventListener("visibilitychange", hide); window.removeEventListener("blur", pause); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    draw();
    const s = st.current;
    return () => cancelAnimationFrame(s.raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pl-game" ref={box}>
      <div className="pl-player__bar" aria-hidden="true"><i /><i /><i /></div>
      <canvas
        ref={cv}
        width={GW}
        height={GH}
        className="pl-game__cv"
        tabIndex={0}
        role="application"
        aria-label="Mini game. Press Space or Enter, or tap, to jump the blocks."
        onPointerDown={act}
        onKeyDown={(e) => { if (e.key === " " || e.key === "Enter" || e.key === "ArrowUp") { e.preventDefault(); act(); } }}
      />
      <p className="pl-game__label mono" aria-live="polite">{label}</p>
    </div>
  );
}

/* ---------- 06 Idea Shelf ---------- */

const IDEAS = ["a map of my reading", "a movie mood tracker", "tiny desktop companion", "????"];

export function IdeaShelf() {
  const [done, setDone] = useState<boolean[]>([false, false, false, false]);
  return (
    <ul className="pl-ideas">
      {IDEAS.map((t, i) => (
        <li key={t}>
          <button type="button" role="checkbox" aria-checked={done[i]} onClick={() => setDone((d) => d.map((v, k) => (k === i ? !v : v)))}>
            <span className="pl-box" aria-hidden="true">{done[i] ? <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6.5l2.6 2.6L10 3" /></svg> : null}</span>
            <span className={done[i] ? "is-done" : undefined}>{t}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/* ---------- 07 Pet Corner ---------- */

type Kind = "peek" | "stroll" | "dock" | "nap";
type Say = { i: number; text: string };

// order matches CRITTERS below: peeking from the burrow, strolling, sitting on the dock, napping in the other burrow
const LINES: string[][] = [
  ["peekaboo", "is it snack time?", "hi! i live here"],
  ["just exploring", "this way, probably", "i know a shortcut"],
  ["the pond is nice today", "shh, i'm watching a fish", "come sit?"],
  ["five more minutes...", "zzz... oh. hi.", "was dreaming of snacks"],
];

// Positions are in the 600x250 scene space and match where the creatures live in the painted background.
const CRITTERS: { kind: Kind; x: number; y: number; s: number; bub: number; clipY?: number; label: string }[] = [
  { kind: "peek", x: 75, y: 235, s: 75, bub: 92, clipY: 218, label: "A round little friend peeking out of its burrow. Click to say hello." },
  { kind: "stroll", x: 218, y: 190, s: 63, bub: 85, label: "A tiny cat strolling along the path. Click to say hello." },
  { kind: "dock", x: 418, y: 240, s: 70, bub: 105, clipY: 229, label: "A bunny paddling in the pond. Click to say hello." },
  { kind: "nap", x: 550, y: 204, s: 64, bub: 80, label: "A sleepy bird resting under the tree. Click to wake it." },
];

const INK = "#8D8A86";
const EYE = "#343331";
const PINK = "#E9A7C0";
const PINK_IN = "#EFC0D2";

/** Eyes: the outer group follows the cursor, the inner ellipse blinks. */
function Eye({ cx, cy, shut }: { cx: number; cy: number; shut?: boolean }) {
  if (shut) return <path d={`M${cx - 4} ${cy} q4 3.4 8 0`} fill="none" />;
  return <g className="pl-look"><ellipse className="pl-blink" cx={cx} cy={cy} rx="2.6" ry="3.5" fill={EYE} stroke="none" /></g>;
}

/**
 * The four supplied character SVGs (public/assets/pet-corner/*.svg), inlined with their
 * original paths, strokes and colours so single parts (ears, eyes, whiskers, feet) can move.
 */
function Art({ kind, sleeping }: { kind: Kind; sleeping: boolean }) {
  const g = { stroke: INK, strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  if (kind === "dock") {
    // 01_bunny.svg
    return (
      <g {...g}>
        <g className="pl-ear pl-ear--l">
          <ellipse cx="48" cy="30" rx="10" ry="25" fill="#F7F6F2" transform="rotate(-13 48 30)" />
          <ellipse cx="48" cy="30" rx="4" ry="16" fill={PINK_IN} stroke="none" transform="rotate(-13 48 30)" />
        </g>
        <g className="pl-ear pl-ear--r">
          <ellipse cx="75" cy="27" rx="9" ry="24" fill="#F7F6F2" transform="rotate(11 75 27)" />
          <ellipse cx="75" cy="27" rx="3.5" ry="15" fill={PINK_IN} stroke="none" transform="rotate(11 75 27)" />
        </g>
        <ellipse cx="62" cy="77" rx="34" ry="29" fill="#FBFAF7" />
        <Eye cx={49} cy={76} /><Eye cx={75} cy={76} />
        <path d="M59 84 Q62 87 65 84" fill="none" />
        <ellipse cx="39" cy="84" rx="5" ry="2.8" fill={PINK} stroke="none" opacity=".75" />
        <ellipse cx="85" cy="84" rx="5" ry="2.8" fill={PINK} stroke="none" opacity=".75" />
      </g>
    );
  }
  if (kind === "peek") {
    // 02_round_friend.svg
    return (
      <g {...g}>
        <path d="M27 79 C22 55 39 37 62 37 C86 35 105 54 102 78 C100 98 84 106 63 105 C42 106 29 96 27 79Z" fill="#FBFAF7" />
        <Eye cx={49} cy={72} /><Eye cx={77} cy={72} />
        <path d="M59 81 Q63 85 67 81" fill="none" />
        <ellipse cx="39" cy="82" rx="5" ry="2.8" fill={PINK} stroke="none" opacity=".75" />
        <ellipse cx="87" cy="82" rx="5" ry="2.8" fill={PINK} stroke="none" opacity=".75" />
        <g className="pl-feet"><path d="M44 103 Q39 111 32 109" fill="none" /><path d="M83 103 Q89 111 96 108" fill="none" /></g>
      </g>
    );
  }
  if (kind === "stroll") {
    // 03_tiny_cat.svg
    return (
      <g {...g}>
        <path d="M30 58 L35 30 L54 45 Q64 41 74 45 L93 30 L98 60 Q105 72 99 87 C92 105 77 108 64 108 C47 108 32 100 28 85 Q24 70 30 58Z" fill="#FBFAF7" />
        <path d="M39 43 L42 56 L51 50Z" fill={PINK_IN} stroke="none" />
        <path d="M89 43 L86 56 L77 50Z" fill={PINK_IN} stroke="none" />
        <Eye cx={49} cy={72} /><Eye cx={79} cy={72} />
        <path d="M60 81 L64 84 L68 81" fill="none" />
        <path d="M59 85 Q55 90 51 86 M69 85 Q73 90 77 86" fill="none" />
        <g className="pl-whisk"><path d="M41 81 L24 78 M42 86 L25 89 M87 81 L104 78 M86 86 L103 89" fill="none" strokeWidth="1.7" /></g>
      </g>
    );
  }
  // 04_tiny_bird.svg
  return (
    <g {...g}>
      <path d="M26 76 C26 55 42 41 63 43 C81 44 95 58 94 76 C93 94 78 103 61 102 C42 102 27 91 26 76Z" fill="#FBFAF7" />
      <path d="M91 62 L107 69 L92 75Z" fill={PINK} />
      <Eye cx={48} cy={70} shut={sleeping} /><Eye cx={72} cy={70} shut={sleeping} />
      <path d="M57 79 Q61 82 65 79" fill="none" />
      <ellipse cx="40" cy="80" rx="4.5" ry="2.5" fill={PINK} stroke="none" opacity=".75" />
      <g className="pl-feet"><path d="M52 101 L49 110 M70 101 L73 110" fill="none" /></g>
    </g>
  );
}

function Critter({ kind, awake, cx, cy, s, bub, clipY, hop, near, say, label, onPoke, refCb }: {
  kind: Kind; awake: boolean; cx: number; cy: number; s: number; bub: number; clipY?: number; hop: boolean; near: boolean; say: string | null; label: string; onPoke: () => void; refCb: (el: SVGGElement | null) => void;
}) {
  const sleeping = kind === "nap" && !awake;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g ref={refCb} className={`pl-pet pl-hit pl-pet--${kind}${hop ? " is-hop" : ""}${near ? " is-near" : ""}`} role="button" tabIndex={0} aria-label={label}
        onClick={(e) => { e.stopPropagation(); onPoke(); }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPoke(); } }}>
        <rect x={-s / 2} y={-s} width={s} height={s} fill="transparent" />
        {clipY !== undefined ? <clipPath id={`pl-clip-${kind}`}><rect x={-s} y={-s * 1.6} width={s * 2} height={clipY - cy + s * 1.6} /></clipPath> : null}
        <g clipPath={clipY !== undefined ? `url(#pl-clip-${kind})` : undefined}>
          <g className="pl-pet__act">
            <g className="pl-pet__in">
              <g transform={`translate(${-s / 2} ${-s}) scale(${s / 128})`}><Art kind={kind} sleeping={sleeping} /></g>
            </g>
          </g>
        </g>
        {sleeping ? (
          <g className="pl-zzz" aria-hidden="true"><text x={s * 0.3} y={-s * 0.55}>z</text><text x={s * 0.3 + 9} y={-s * 0.55 - 10}>z</text></g>
        ) : null}
        {kind === "stroll" && !say ? <text className="pl-note" x={s * 0.4} y={-s * 0.78} aria-hidden="true">♪</text> : null}
        {say ? <Bubble text={say} y={bub} cx={cx} /> : null}
      </g>
    </g>
  );
}

function Bubble({ text, y, cx }: { text: string; y: number; cx: number }) {
  const w = Math.max(120, text.length * 10 + 36);
  // keep the bubble inside the scene near the edges; the tail still points at the creature
  const dx = Math.min(594 - w - cx, Math.max(6 - cx, -w / 2));
  const tx = Math.min(w - 34, Math.max(32, -dx));
  const d = `M18 1.5 H${w - 18} Q${w - 1.5} 1 ${w - 1} 21 Q${w - 1.5} 41 ${w - 18} 41.5 H${tx + 14} Q${tx + 4} 42 ${tx - 11} 56 Q${tx - 5} 47 ${tx - 7} 41.5 H18 Q1.5 41 1 21 Q1.5 1 18 1.5 Z`;
  return (
    <g aria-hidden="true" transform={`translate(${dx} ${-y - 24})`}>
      <g className="pl-say">
        <path d={d} />
        <text x={w / 2} y="28" textAnchor="middle">{text}</text>
      </g>
    </g>
  );
}

type SwayKind = "tree" | "flower" | "cloud" | "smoke" | "pad" | "grass";
/** Soft windows into the painted plate. Each one re-draws its patch of the picture, moving a little, so the painting itself sways. */
const SWAYS: { k: SwayKind; x: number; y: number; rx: number; ry: number; dur: number; d: number }[] = [
  { k: "tree", x: 538, y: 80, rx: 92, ry: 78, dur: 7.5, d: 0 },
  { k: "cloud", x: 219, y: 34, rx: 62, ry: 28, dur: 26, d: -6 },
  { k: "cloud", x: 351, y: 48, rx: 40, ry: 22, dur: 21, d: -12 },
  { k: "cloud", x: 96, y: 51, rx: 40, ry: 22, dur: 29, d: -3 },
  { k: "cloud", x: 467, y: 52, rx: 40, ry: 22, dur: 24, d: -15 },
  { k: "smoke", x: 129, y: 72, rx: 30, ry: 14, dur: 6, d: -2 },
  { k: "flower", x: 37, y: 128, rx: 20, ry: 17, dur: 5.2, d: -1 },
  { k: "flower", x: 158, y: 137, rx: 20, ry: 16, dur: 6.4, d: -3 },
  { k: "flower", x: 275, y: 141, rx: 24, ry: 17, dur: 5.6, d: -2 },
  { k: "flower", x: 19, y: 179, rx: 16, ry: 16, dur: 6.1, d: -4 },
  { k: "flower", x: 183, y: 203, rx: 26, ry: 18, dur: 5.8, d: -1.5 },
  { k: "flower", x: 59, y: 228, rx: 18, ry: 16, dur: 6.8, d: -5 },
  { k: "flower", x: 133, y: 226, rx: 16, ry: 16, dur: 5.4, d: -2.5 },
  { k: "flower", x: 372, y: 186, rx: 20, ry: 15, dur: 6.2, d: -3.5 },
  { k: "flower", x: 431, y: 186, rx: 22, ry: 15, dur: 5.5, d: -0.5 },
  { k: "flower", x: 526, y: 215, rx: 18, ry: 17, dur: 6.6, d: -4.5 },
  { k: "flower", x: 573, y: 230, rx: 20, ry: 16, dur: 5.9, d: -2 },
  { k: "pad", x: 297, y: 232, rx: 17, ry: 9, dur: 4.6, d: -1 },
  { k: "pad", x: 329, y: 243, rx: 15, ry: 8, dur: 5.4, d: -3 },
  { k: "pad", x: 358, y: 234, rx: 13, ry: 9, dur: 6.2, d: -2 },
  { k: "grass", x: 232, y: 160, rx: 22, ry: 10, dur: 11, d: -2 },
  { k: "grass", x: 112, y: 152, rx: 22, ry: 10, dur: 13, d: -7 },
  { k: "grass", x: 505, y: 162, rx: 24, ry: 10, dur: 12, d: -4 },
  { k: "grass", x: 400, y: 212, rx: 22, ry: 10, dur: 14, d: -9 },
];
/** Depth bands cut from the one painting. Each is the same plate, masked to its band, and moves at its own pace.
 *  Edges run through flat ground or sky and round whole objects (cottage, bushes, tree base), so nothing is split between bands. */
type Pt = [number, number];
const BAND_PTS: Record<"sky" | "hills" | "fg", Pt[]> = {
  sky: [[-30, -30], [497, -30], [497, 58], [489, 78], [478, 92], [-30, 92]],
  hills: [[-30, 84], [86, 84], [88, 80], [132, 80], [134, 88], [640, 88], [640, 160], [470, 160], [440, 150], [400, 140], [330, 150], [260, 152], [210, 148], [158, 148], [152, 153], [72, 153], [66, 150], [-30, 150]],
  fg: [[-30, 158], [100, 158], [130, 170], [200, 186], [212, 190], [322, 190], [328, 166], [395, 166], [402, 182], [496, 184], [504, 208], [640, 208], [640, 280], [-30, 280]],
};
const BANDS = Object.fromEntries(Object.entries(BAND_PTS).map(([k, v]) => [k, `M${v.map((q) => q.join(" ")).join(" L")} Z`])) as Record<"sky" | "hills" | "fg", string>;
function inPoly(x: number, y: number, v: Pt[]) {
  let c = false;
  for (let i = 0, j = v.length - 1; i < v.length; j = i++) {
    if (v[i][1] > y !== v[j][1] > y && x < ((v[j][0] - v[i][0]) * (y - v[i][1])) / (v[j][1] - v[i][1]) + v[i][0]) c = !c;
  }
  return c;
}
const layerOf = (w: { k: SwayKind; x: number; y: number }): "sky" | "hills" | "mid" | "fg" =>
  w.k === "cloud" || w.k === "smoke" ? "sky" : w.k === "tree" ? "mid" : inPoly(w.x, w.y, BAND_PTS.fg) ? "fg" : inPoly(w.x, w.y, BAND_PTS.hills) && w.x < 440 ? "hills" : "mid";
const KX = { sky: 0.4, hills: 0.8, mid: 1.2, fg: 2 } as const;
const PLATE = "/assets/pet-corner/scene.webp?v=2";
const PETALS = [[520, 112, -26, 15, -4], [545, 118, 30, 13, -9], [566, 108, -34, 17, -2], [510, 124, 40, 14, -12]];
const GLINTS = [[270, 226], [366, 230], [404, 240], [442, 232]];

/** A tiny living landscape: creatures peek, wander, sit and nap, look at the cursor and react to clicks. */
export function PetCorner() {
  const svg = useRef<SVGSVGElement>(null);
  const critters = useRef<(SVGGElement | null)[]>([null, null, null, null]);
  const [hop, setHop] = useState<number | null>(null);
  const [awake, setAwake] = useState(false);
  const [say, setSay] = useState<Say | null>(null);
  const [near, setNear] = useState<number | null>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const uid = useRef(0);
  const raf = useRef(0);
  const depth = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const brushed = useRef(new Map<Element, number>());
  const nearRef = useRef<number | null>(null);
  const forced = useRef<boolean[]>([false, false, false, false]);
  const prev = useRef<({ x: number; y: number } | null)[]>([null, null, null, null]);
  const timers = useRef<number[]>([]);

  function later(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function talk(i: number) {
    const set = LINES[i];
    setSay({ i, text: set[Math.floor(Math.random() * set.length)] });
    later(() => setSay((v) => (v && v.i === i ? null : v)), 3400);
  }

  function poke(i: number) {
    forced.current[i] = true;
    setHop(i);
    if (i === 2) ripple(400 + Math.random() * 36, 228 + Math.random() * 6);
    if (i === 3) { setAwake(true); later(() => setAwake(false), 4200); }
    talk(i);
    later(() => setHop((v) => (v === i ? null : v)), 700);
  }

  function ripple(x: number, y: number) {
    const id = uid.current++;
    setRipples((r) => [...r.slice(-2), { id, x, y }]);
    later(() => setRipples((r) => r.filter((q) => q.id !== id)), 2200);
  }

  /** Creatures glance toward the cursor when it is close. */
  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    if (e.pointerType === "touch") return;
    const cx = e.clientX;
    const cy = e.clientY;
    const box = svg.current?.getBoundingClientRect();
    if (box && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      depth.current.tx = clamp(((cx - box.left) / box.width - 0.5) * 2, -1, 1);
      depth.current.ty = clamp(((cy - box.top) / box.height - 0.5) * 2, -1, 1);
    }
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      let closest: number | null = null;
      let best = 130;
      critters.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = cx - (r.left + r.width / 2);
        const dy = cy - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy);
        if (d < 170) {
          el.style.setProperty("--lx", String((dx / (d || 1)) * 1.3));
          el.style.setProperty("--ly", String((dy / (d || 1)) * 1.1));
        } else {
          el.style.setProperty("--lx", "0");
          el.style.setProperty("--ly", "0");
        }
        if (d < best) { best = d; closest = i; }
      });
      setNear(best < 80 ? closest : null);
    });
  }

  useEffect(() => { nearRef.current = near; }, [near]);

  /** One light loop drives all the ambient motion. It sets plain transform attributes, which every browser repaints reliably,
   *  and it stops while the scene is off screen, the tab is hidden, or the visitor prefers reduced motion. */
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sways = [...el.querySelectorAll<SVGImageElement>(".pl-sway")];
    const depthEls = [...el.querySelectorAll<SVGGElement>("[data-kx]")];
    let raf = 0;
    let visible = true;
    const TAU = Math.PI * 2;
    const burst = (p: number, from: number) => { const u = (p - from) / (1 - from - 0.1); return u > 0 && u < 1 ? Math.sin(u * TAU * 1.5) * (1 - u) * (1 - u) : 0; };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const t = now / 1000;
      for (const n of sways) {
        const k = n.dataset.k;
        const dur = Number(n.dataset.dur);
        const a = Number(n.dataset.a);
        const p = ((((t - Number(n.dataset.d)) / dur) % 1) + 1) % 1;
        const ox = Number(n.dataset.ox);
        const oy = Number(n.dataset.oy);
        let v = "";
        if (k === "tree") v = `rotate(${(Math.sin(p * TAU) * 1.1 * a).toFixed(3)} ${ox} ${oy})`;
        else if (k === "flower" || k === "grass") {
          // plants lean from their base: a horizontal shear, so roots stay put and nothing flips or doubles
          const t0 = brushed.current.get(n.parentElement as Element);
          const dt = t0 === undefined ? 9 : (performance.now() - t0) / 1000;
          const push = dt < 1.8 ? 4 * Math.exp(-2.6 * dt) * Math.sin(dt * 8) : 0;
          const ang = (k === "flower" ? burst(p, 0.4) * 2.6 * a : burst(p, 0.45) * 3) + push;
          v = `translate(0 ${oy}) skewX(${ang.toFixed(3)}) translate(0 ${-oy})`;
        }
        else if (k === "cloud") v = `translate(${(Math.sin(p * TAU) * 15 * a).toFixed(2)} 0)`;
        else if (k === "smoke") v = `translate(${(Math.sin(p * TAU) * 2.6).toFixed(2)} ${(Math.cos(p * TAU) * -2).toFixed(2)})`;
        else if (k === "pad") v = `translate(0 ${(Math.sin(p * TAU) * 0.9).toFixed(2)})`;
        n.setAttribute("transform", v);
      }
      const d = depth.current;
      d.x += (d.tx - d.x) * 0.07;
      d.y += (d.ty - d.y) * 0.07;
      for (const g of depthEls) g.setAttribute("transform", `translate(${(-d.x * Number(g.dataset.kx)).toFixed(3)} ${(-d.y * Number(g.dataset.ky)).toFixed(3)})`);
    };
    const run = () => { if (!raf && visible && !document.hidden && !mq.matches) raf = requestAnimationFrame(tick); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) run(); else stop(); });
    io.observe(el);
    const onVis = () => (document.hidden ? stop() : run());
    document.addEventListener("visibilitychange", onVis);
    const onMq = () => { if (mq.matches) { stop(); sways.forEach((n) => n.removeAttribute("transform")); depthEls.forEach((g) => g.removeAttribute("transform")); } else run(); };
    mq.addEventListener("change", onMq);
    run();
    return () => { stop(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); mq.removeEventListener("change", onMq); };
  }, []);

  /** The world notices the creatures: plants near one that is moving (or poked) lean aside, and the pond answers the bunny. */
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    let lastRipple = 0;
    const id = window.setInterval(() => {
      if (document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const ctm = el.getScreenCTM();
      if (!ctm) return;
      const inv = ctm.inverse();
      const pts = critters.current.map((g) => {
        const r = (g?.querySelector(".pl-pet__act") ?? g?.querySelector("rect"))?.getBoundingClientRect();
        return r ? new DOMPoint(r.left + r.width / 2, r.bottom - r.height * 0.2).matrixTransform(inv) : null;
      });
      const moving = pts.map((p, i) => {
        const q = prev.current[i];
        const m = forced.current[i] || (!!p && !!q && Math.hypot(p.x - q.x, p.y - q.y) > 1.2);
        forced.current[i] = false;
        return m;
      });
      prev.current = pts;
      el.querySelectorAll<SVGGElement>(".pl-swaywrap[data-brush]").forEach((w) => {
        const wx = Number(w.dataset.x);
        const wy = Number(w.dataset.y);
        if (performance.now() - (brushed.current.get(w) ?? -9999) < 1800) return;
        if (pts.some((p, i) => p && moving[i] && Math.hypot(p.x - wx, (p.y - wy) * 1.2) < 46)) {
          brushed.current.set(w, performance.now());
        }
      });
      const bunny = pts[2];
      if (bunny && (nearRef.current === 2 || moving[2]) && Date.now() - lastRipple > 2200) {
        lastRipple = Date.now();
        ripple(bunny.x - 14 + Math.random() * 28, 230 + Math.random() * 6);
      }
    }, 800);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      talk(Math.floor(Math.random() * 4));
    }, 17000);
    const t = timers.current;
    return () => { clearInterval(id); t.forEach(clearTimeout); cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pondPoint(e: React.MouseEvent) {
    const el = svg.current;
    if (!el || !e.clientX) return { x: 330, y: 232 };
    const r = el.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 600, y: ((e.clientY - r.top) / r.height) * 250 };
  }

  const key = (fn: () => void) => (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); } };
  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

  return (
    <svg ref={svg} className="pl-pets" viewBox="0 0 600 250" data-sq-keys role="group" aria-label="A small painted landscape with a cottage, a cherry tree and a pond, with four little creatures. Click or tap the creatures or the pond." onPointerMove={onMove} onPointerLeave={() => { depth.current.tx = 0; depth.current.ty = 0; critters.current.forEach((el) => { el?.style.setProperty("--lx", "0"); el?.style.setProperty("--ly", "0"); }); setNear(null); }}>
      {/* the painted world: one background plate, kept separate from the characters */}
      <defs>
        <radialGradient id="pl-feather"><stop offset="0.7" stopColor="#fff" /><stop offset="1" stopColor="#000" /></radialGradient>
        <linearGradient id="pl-fade" gradientUnits="userSpaceOnUse" x1="418" y1="0" x2="478" y2="0"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" /></linearGradient>
        <filter id="pl-soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1.4" /></filter>
        {SWAYS.map((w, i) => (
          <mask key={i} id={`pl-m${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="250"><ellipse cx={w.x} cy={w.y} rx={w.rx} ry={w.ry} fill="url(#pl-feather)" /></mask>
        ))}
        <mask id="pl-band-sky" maskUnits="userSpaceOnUse" x="-40" y="-40" width="680" height="330"><path d={BANDS.sky} fill="#fff" filter="url(#pl-soft)" /></mask>
        <mask id="pl-band-hills" maskUnits="userSpaceOnUse" x="-40" y="-40" width="680" height="330"><path d={BANDS.hills} fill="#fff" filter="url(#pl-soft)" /><rect x="418" y="-40" width="230" height="330" fill="url(#pl-fade)" /></mask>
        <mask id="pl-band-fg" maskUnits="userSpaceOnUse" x="-40" y="-40" width="680" height="330"><path d={BANDS.fg} fill="#fff" filter="url(#pl-soft)" /></mask>
      </defs>
      {/* a fixed copy sits behind every band, so a shifted band can never leave a gap */}
      <image className="pl-plate" href={PLATE} x="0" y="0" width="600" height="250" preserveAspectRatio="xMidYMid slice" />
      {(["mid", "sky", "hills", "fg"] as const).map((band) => (
        <g key={band} className={`pl-layer pl-L-${band}`} data-kx={KX[band]} data-ky={KX[band] / 2} mask={band === "mid" ? undefined : `url(#pl-band-${band})`}>
          <image className="pl-bandimg" href={PLATE} x="0" y="0" width="600" height="250" preserveAspectRatio="xMidYMid slice" />
          {SWAYS.map((w, i) => layerOf(w) !== band ? null : (
            <g key={i} mask={`url(#pl-m${i})`} className="pl-swaywrap" data-brush={w.k === "flower" || w.k === "grass" ? "" : undefined} data-x={w.x} data-y={w.y}
              style={{ transformOrigin: `${w.x}px ${w.y + w.ry * 0.8}px` }}>
              <image className={`pl-sway pl-sway--${w.k}`} href={PLATE} x="0" y="0" width="600" height="250" preserveAspectRatio="xMidYMid slice"
                data-k={w.k} data-dur={w.dur * (w.k === "flower" ? 1.9 : w.k === "cloud" ? 1.4 : w.k === "tree" ? 1.3 : w.k === "pad" ? 1.6 : 1)} data-d={w.d} data-a={0.7 + ((i * 37) % 7) / 10}
                data-ox={w.k === "tree" ? 578 : w.x} data-oy={w.k === "tree" ? 126 : w.y + w.ry * 0.8} />
            </g>
          ))}
          {band === "mid" ? PETALS.map(([x, y, dx, dur, d], i) => (
            <ellipse key={i} className="pl-fall" cx={x} cy={y} rx="3.2" ry="1.9" style={{ ["--dx" as string]: `${dx}px`, animationDuration: `${dur}s`, animationDelay: `${d}s` }} />
          )) : null}
          {band === "fg" ? GLINTS.map(([x, y], i) => (
            <path key={i} className="pl-glint" d={`M${x} ${y} q5 -1.6 10 0`} style={{ animationDelay: `${-i * 1.1}s`, animationDuration: `${3.4 + (i % 3)}s` }} />
          )) : null}
        </g>
      ))}

      <g className="pl-bfly" transform="translate(392 92)">
        <g className="pl-bfly__in"><path d="M0 0 c-5 -7 -11 -2 -7.5 3.5 c2 3.5 5.5 1.5 7.5 -3.5 c5 -7 11 -2 7.5 3.5 c-2 3.5 -5.5 1.5 -7.5 -3.5 Z" /></g>
      </g>

      {/* the pond answers a click with a ripple */}
      <g className="pl-par pl-par--fg" data-kx="2" data-ky="1">
      <g className="pl-pond pl-hit" role="button" tabIndex={0} aria-label="Pond. Click to make a ripple." onClick={(e) => { const p = pondPoint(e); ripple(clamp(p.x, 250, 470), clamp(p.y, 214, 244)); }} onKeyDown={key(() => ripple(330, 232))}>
        <path className="pl-pond__hit" d="M216 234 C 222 210, 262 202, 330 205 C 400 207, 470 216, 514 236 L 514 250 L 216 250 Z" />
        {ripples.map((r) => <ellipse key={r.id} className="pl-ripple" cx={r.x} cy={r.y} rx="5" ry="1.8" />)}
      </g>

      </g>
      {CRITTERS.map((c, i) => (
        <g key={c.kind} className="pl-par" data-kx={c.kind === "peek" || c.kind === "dock" ? 2 : 1.2} data-ky={c.kind === "peek" || c.kind === "dock" ? 1 : 0.6}>
          <Critter kind={c.kind} cx={c.x} cy={c.y} s={c.s} bub={c.bub} awake={c.kind === "nap" ? awake : true} clipY={c.clipY} hop={hop === i} near={near === i} say={say?.i === i ? say.text : null} label={c.label} onPoke={() => poke(i)} refCb={(el) => { critters.current[i] = el; }} />
        </g>
      ))}

      {/* a few rings where the bunny sits in the water */}
      <g className="pl-par" data-kx="2" data-ky="1"><ellipse className="pl-wake" cx="418" cy="229" rx="30" ry="5" /></g>
    </svg>
  );
}

/* ---------- 05 Photo Logs ---------- */

/** A print that opens larger in a dialog. */
export function Print({ src, alt, pos, className, style, caption }: { src: string; alt: string; pos?: string; className: string; style: CSSProperties; caption?: string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  return (
    <figure className={className} style={style}>
      <button type="button" className="pl-printbtn" onClick={() => dlg.current?.showModal()} aria-label={`Open larger: ${alt}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" decoding="async" draggable={false} style={pos ? { objectPosition: pos } : undefined} />
      </button>
      <dialog ref={dlg} className="pl-dlg" onClick={(e) => { if (e.target === e.currentTarget) dlg.current?.close(); }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
        {caption ? <p className="mono">{caption}</p> : null}
        <button type="button" className="pl-dlg__x mono" onClick={() => dlg.current?.close()}>close</button>
      </dialog>
    </figure>
  );
}


/* ---------- Wind chime (beside Mini Games) ---------- */

/** A slow-swaying glass wind chime. It rings when hovered or focused, and when the game starts or scores. */
export function WindChime() {
  const [ring, setRing] = useState(0);
  const last = useRef(0);
  const ac = useRef<AudioContext | null>(null);

  function play() {
    const now = Date.now();
    if (now - last.current < 900) return;
    last.current = now;
    setRing((n) => n + 1);
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ac.current ??= new AC();
      const a = ac.current;
      if (a.state === "suspended") void a.resume();
      const t = a.currentTime;
      [1318.5, 1568, 1975.5, 2349.3].forEach((f, i) => {
        const o = a.createOscillator();
        const g = a.createGain();
        o.type = "sine";
        o.frequency.value = f * (1 + (Math.random() - 0.5) * 0.004);
        const st = t + i * 0.12 + Math.random() * 0.04;
        g.gain.setValueAtTime(0, st);
        g.gain.linearRampToValueAtTime(0.045, st + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, st + 2);
        o.connect(g).connect(a.destination);
        o.start(st);
        o.stop(st + 2.1);
      });
    } catch {
      /* sound is a bonus; the chime still moves */
    }
  }

  useEffect(() => {
    const on = () => play();
    window.addEventListener("pl-chime", on);
    return () => window.removeEventListener("pl-chime", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button type="button" className="pl-chime__btn" onPointerEnter={play} onFocus={play} onClick={play} aria-label="Glass wind chime. It rings when the game character jumps, or when you hover over it.">
      <svg className="pl-chime__svg" viewBox="0 0 100 250" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <g className={`pl-chime__sway${ring ? " is-ringing" : ""}`} key={ring}>
          <path d="M50 0 V22" stroke="#c4cf6a" strokeWidth="1.6" />
          <rect x="45" y="20" width="10" height="8" rx="1.5" fill="#f1e4bd" stroke="#c9b680" strokeWidth="1" />
          <path d="M16 62 C16 38 32 28 50 28 C68 28 84 38 84 62 C84 73 78 80 73 84 H27 C22 80 16 73 16 62 Z" fill="rgba(255,255,255,0.4)" stroke="#8fa6ba" strokeWidth="1.3" />
          <path d="M25 56 C27 43 37 36 47 35" stroke="#fff" strokeWidth="2" opacity="0.9" />
          <ellipse cx="50" cy="84" rx="23" ry="5" fill="rgba(255,255,255,0.35)" stroke="#8fa6ba" strokeWidth="1.2" />
          <path d="M50 30 V96" stroke="#b6c9d8" strokeWidth="2.6" />
          <circle cx="50" cy="100" r="3.4" fill="rgba(255,255,255,0.7)" stroke="#8fa6ba" strokeWidth="1.1" />
          <path d="M50 104 V130" stroke="#c4cf6a" strokeWidth="1.6" />
          <path d="M50 130 C38 120 31 133 43 135 M50 130 C62 120 69 133 57 135" stroke="#c4cf6a" strokeWidth="1.5" />
          <g className="pl-chime__sail">
            <path d="M50 130 V140" stroke="#c4cf6a" strokeWidth="1.5" />
            <rect x="35" y="140" width="30" height="100" rx="2" fill="color-mix(in srgb, #9fc0ea 55%, #fff)" stroke="#7f9bc4" strokeWidth="1.3" />
            <path d="M39 146 V234" stroke="#fff" strokeWidth="1.6" opacity="0.7" />
            <ellipse cx="50" cy="186" rx="10" ry="15" fill="rgba(255,255,255,0.55)" stroke="#9db4d6" strokeWidth="1" />
            <circle cx="46" cy="184" r="2.2" fill="#f0a64a" />
            <circle cx="53" cy="190" r="2.2" fill="#f0a64a" />
            <circle cx="50" cy="178" r="2" fill="#f0a64a" />
            <path d="M42 158 C46 170 44 196 40 222 M58 158 C54 170 58 200 62 222" stroke="#6fa56a" strokeWidth="1.4" />
          </g>
        </g>
      </svg>
    </button>
  );
}
