import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import { ASSETS } from "./about-assets";
import { ScrollTrack } from "./scroll-track";
import "./side-quests.css";

// Handwriting face for the scrapbook annotations. Loaded only on /about.
const hand = Caveat({ variable: "--font-hand", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "About",
  description: "A life in side quests: anime, books, boba, long walks and a new gym era.",
};

const CANVAS = { w: 2640, h: 712 };

/** Position on the canvas, in canvas pixels. On small screens these are ignored and the items stack. */
const at = (x: number, y: number, w: number, h?: number, r = 0): CSSProperties =>
  ({ "--x": x, "--y": y, "--w": w, ...(h ? { "--h": h } : {}), "--r": `${r}deg` }) as CSSProperties;

function Photo({ slot, x, y, w, h, r, className = "", children }: {
  slot: keyof typeof ASSETS; x: number; y: number; w: number; h: number; r?: number; className?: string; children?: ReactNode;
}) {
  const a = ASSETS[slot];
  return (
    <figure className={`sq-i sq-photo ${className}`} style={at(x, y, w, h, r)}>
      {a.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.src} alt={a.alt} loading="lazy" decoding="async" draggable={false} style={a.pos ? { objectPosition: a.pos } : undefined} />
      ) : (
        <div className="sq-ph" aria-hidden="true"><span className="mono">{a.label}</span></div>
      )}
      {children}
    </figure>
  );
}

/** A kaomoji used as marginalia: decorative, so hidden from screen readers. */
function Kao({ text, style, tag = false }: { text: string; style?: CSSProperties; tag?: boolean }) {
  return <span className={`sq-kao${tag ? " sq-kao--tag" : ""}${style ? " sq-i" : ""}`} style={style} aria-hidden="true">{text}</span>;
}

const Slashes = () => <span aria-hidden="true">{"//////// "}</span>;
const Hatch = () => <div className="sq-hatch" aria-hidden="true" />;

function Flower({ size = 58, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg className="sq-i sq-doodle" style={style} width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M32 31c-9-3-14-13-8-19 5-5 12-2 13 4 3-6 11-8 16-3 5 6 0 15-9 18 8 1 12 9 7 15-5 5-13 3-16-3-2 7-10 10-16 5-5-5-2-13 6-15-4-1-6-1-8-2" />
      <circle cx="32" cy="32" r="3.2" />
    </svg>
  );
}

/** Hand-drawn smiley, a little scrapbook sign-off. */
function Smile({ size = 44, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg className="sq-i sq-doodle" style={style} width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M24 4C13 4 4.5 12.6 4.5 24S13 44 24 44c11.4 0 19.6-8.6 19.6-20.2C43.6 12.8 35 4.2 24 4.5" />
      <path d="M16 18v4M31 17.5v4.5" />
      <path d="M14 29c3 6.5 17 7.5 21 .5" />
    </svg>
  );
}

/** Three short strokes, like a pen flick next to something exciting. */
function Spark({ size = 24, style, inline = false }: { size?: number; style?: CSSProperties; inline?: boolean }) {
  return (
    <svg className={inline ? "sq-doodle sq-spark-inline" : "sq-i sq-doodle"} style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M2.4 12.1 1 4.3M7.1 12.5 9.8 5M10.9 15.2 17 10.1M12.9 19.4 20.7 18" />
    </svg>
  );
}

/** A tiny hand-drawn heart. */
function Heart({ size = 16, style, inline = false, className = "" }: { size?: number; style?: CSSProperties; inline?: boolean; className?: string }) {
  return (
    <svg className={inline ? `sq-doodle sq-heart-inline ${className}` : "sq-i sq-doodle"} style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20.5C6 16 3 12.8 3 9.2 3 6.6 5 4.8 7.3 4.8c1.9 0 3.5 1.2 4.7 3 1.2-1.8 2.8-3 4.7-3C19 4.8 21 6.6 21 9.2c0 3.6-3 6.8-9 11.3Z" />
    </svg>
  );
}

function AnimeThumb({ slot }: { slot: "anime1" | "anime2" | "anime3" }) {
  const a = ASSETS[slot];
  return a.src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={a.src} alt={a.alt} loading="lazy" decoding="async" style={a.pos ? { objectPosition: a.pos } : undefined} />
  ) : (
    <div className="sq-ph" aria-hidden="true" />
  );
}

export default function About() {
  return (
    <div className={`sq ${hand.variable}`}>
      <ScrollTrack width={CANVAS.w} height={CANVAS.h} xMin={32} xMax={2610}>
        <div className="sq-canvas">
          {/* A. Introduction: the one clearly framed panel */}
          <section className="sq-i sq-frame sq-intro" style={at(32, 24, 290, 664)} aria-label="Introduction">
            <p className="mono sq-lab"><Slashes />hi, i&rsquo;m pravallika</p>
            <h1 className="sq-h1">a life in side quests.</h1>
            <p>just a person trying to figure things out, one side quest at a time.</p>
            <p>
              i watch anime, read (a lot), take random photos, go on little treks, and recently started my gym era.
              most days, you&rsquo;ll find me with a cup of coffee, a story in my head, and too many tabs open.
            </p>
            <Hatch />
            <p>
              this is the part of the internet where i&rsquo;m not thinking about design systems or user flows, just the
              things that make me, me.
            </p>
            <div className="sq-intro__foot">
              <p className="mono sq-meta">[ LOCATION: HYD / BLR ]<br />[ STATUS: EXPLORING ]</p>
              <span className="sq-kao-wrap" style={{ position: "relative", display: "inline-block", flex: "none" }}>
                <Kao text="(￣▽￣)" />
                <Spark size={26} inline style={{ position: "absolute", top: -24, right: -14 }} />
                <Heart size={16} inline style={{ position: "absolute", top: -50, right: -30, transform: "rotate(-12deg)" }} />
                <Heart size={12} inline style={{ position: "absolute", top: -30, right: -44, transform: "rotate(18deg)" }} />
              </span>
            </div>
          </section>

          <Photo slot="portrait" x={340} y={22} w={256} h={376} r={-2} className="sq-big sq-tape" />
          <Photo slot="clouds" x={346} y={28} w={58} h={58} className="sq-round" />
          <Flower style={at(560, 20, 54)} />
          <p className="sq-i sq-note" style={at(626, 20, 150, undefined, -4)}>main character<br />(sometimes)</p>

          <Kao text={"¯\\_(ツ)_/¯"} style={at(640, 92, 130, undefined, -2)} />

          <Photo slot="fictional" x={332} y={440} w={112} h={122} r={3} className="sq-small" />
          <p className="sq-i sq-ticket" style={at(414, 482, 150, 52, -12)}>side quests<br />&gt; main quest</p>
          <p className="sq-i sq-note" style={at(372, 584, 170, undefined, -6)}>fictional people &gt;<br />real people</p>

          <Photo slot="trek" x={656} y={226} w={156} h={184} r={3} className="sq-solo" />

          {/* B. Anime brain: denser, layered */}
          <section className="sq-i sq-sheet" style={at(842, 38, 340, 380)} aria-label="Anime brain">
            <h2 className="mono sq-lab"><Slashes />anime brain</h2>
            <p className="sq-sheet__lead">
              fictional worlds have a special place in my heart. i love stories with strong characters, mysterious worlds,
              and a little chaos.
            </p>
            <Hatch />
            <p className="mono sq-sub">currently watching / rewatching:</p>
            <div className="sq-thumbs">
              <figure className="sq-thumb"><AnimeThumb slot="anime1" /><figcaption className="mono">demon slayer</figcaption></figure>
              <figure className="sq-thumb"><AnimeThumb slot="anime2" /><figcaption className="mono">the apothecary diaries</figcaption></figure>
              <figure className="sq-thumb"><AnimeThumb slot="anime3" /><figcaption className="mono">jujutsu kaisen</figcaption></figure>
            </div>
            <p>and always looking for the next anime to emotionally destroy me.</p>
          </section>
          <Photo slot="manga" x={1114} y={20} w={90} h={104} r={4} className="sq-flat sq-tape sq-small sq-solo" />
          <p className="sq-i sq-note" style={at(722, 392, 120, undefined, 6)}>collecting<br />views !!!</p>
          <Kao text="(╥﹏╥)" style={at(1086, 382, 100, undefined, 3)} />

          {/* C. Novels & boba: a reading journal page */}
          <section className="sq-i sq-paper" style={at(1228, 30, 380, 348)} aria-label="Novels and boba">
            <h2 className="mono sq-lab"><Slashes />novels &amp; boba</h2>
            <p>i read like it&rsquo;s my job. if it&rsquo;s a good story, i&rsquo;m in.</p>
            <Hatch />
            <ul className="sq-list">
              {["dystopian", "end of the world", "fantasy", "mystery", "horror", "transmigration", "regression"].map((g) => (
                <li key={g}><i aria-hidden="true" />{g}</li>
              ))}
            </ul>
          </section>
          <Photo slot="book1" x={1452} y={10} w={92} h={136} r={-2} className="sq-flat sq-small" />
          <Photo slot="book2" x={1548} y={48} w={88} h={126} r={2} className="sq-flat sq-small" />
          <Photo slot="book3" x={1456} y={150} w={88} h={128} r={-1} className="sq-flat sq-small" />
          <Photo slot="boba" x={1396} y={280} w={98} h={122} r={-4} className="sq-small" />
          <p className="sq-i sq-note" style={at(1512, 306, 140, undefined, -9)}>a good book<br />+ boba<br />= peace</p>
          <Kao text="(*￣з￣)" style={at(1536, 394, 120, undefined, -3)} />
          <Smile style={at(1660, 8, 44)} />

          {/* D. Outside the screen: open and airy */}
          <section className="sq-i sq-free sq-out" style={at(1724, 46, 250, 124)} aria-label="Outside the screen">
            <h2 className="mono sq-lab"><Slashes />outside the screen</h2>
            <p>mountains, long walks, new places and, lately, old architecture. a camera is always on me. &ldquo;touching grass&rdquo; is the goal.</p>
          </section>
          <Photo slot="outside1" x={1706} y={214} w={300} h={190} r={-2} className="sq-tape sq-wide" />
          <Photo slot="outside2" x={1900} y={380} w={142} h={166} r={3} />
          <Photo slot="outside3" x={1712} y={440} w={128} h={150} r={-3} className="sq-small" />
          <p className="sq-i sq-note" style={at(2008, 232, 90, undefined, 5)}>a little closer<br />to nature :)</p>

          {/* E. Gym era: a playful log, unframed */}
          <section className="sq-i sq-free sq-gym" style={at(670, 496, 356, 150)} aria-label="Gym era, in progress">
            <h2 className="mono sq-lab"><Slashes />gym era (in progress)</h2>
            <p>new character development. still figuring things out, but showing up counts, right?</p>
            <p>more muscle, more energy, and a stronger version of myself, one workout at a time.</p>
          </section>
          <Photo slot="gym" x={1048} y={500} w={170} h={160} r={2} className="sq-flat sq-solo">
            <p className="sq-ticket sq-ticket--on">level 1<br />beginner arc</p>
          </Photo>
          <Kao text="(ง •̀_•́)ง" style={at(682, 640, 160, undefined, -2)} />
          <p className="sq-i sq-note" style={at(792, 636, 120, undefined, -2)}>leveling up...</p>
          <Spark style={at(1190, 470, 20)} />
          <Heart style={at(1236, 660, 14)} />

          {/* F. Other things i love */}
          <section className="sq-i sq-free sq-other" style={at(1250, 480, 400, 170)} aria-label="Other things I love">
            <h2 className="mono sq-lab"><Slashes />other things i love</h2>
            <div className="sq-minis">
              {(["photography", "food", "skies", "music", "workspace"] as const).map((s) => (
                <figure key={s} className="sq-mini">
                  {ASSETS[s].src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ASSETS[s].src} alt={ASSETS[s].alt} loading="lazy" decoding="async" style={ASSETS[s].pos ? { objectPosition: ASSETS[s].pos } : undefined} />
                  ) : (
                    <div className="sq-ph" aria-hidden="true" />
                  )}
                  <figcaption className="mono">{ASSETS[s].label}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Footer strip: the last page of the scrapbook */}
          <section className="sq-i sq-end" style={at(2150, 24, 460, 664)} aria-label="End of file">
            <p className="mono sq-end__lab"><Slashes />END OF FILE</p>
            <p className="sq-end__big">still loading, still collecting.</p>
            <p>
              currently becoming a person with more stories, more stamps in the mental scrapbook, more muscle, and
              probably another book on the bedside table.
            </p>
            <p>thanks for visiting my little corner of the internet &#9825;</p>
          </section>
          <Kao text="(づ￣ ³￣)づ" style={at(2470, 632, 130, undefined, 4)} />
          <Spark size={20} style={at(2582, 614, 20)} />
          <Heart size={14} style={at(2586, 644, 14)} />
        </div>
      </ScrollTrack>
    </div>
  );
}
