import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import { ASSETS } from "../about/about-assets";
import { ScrollTrack } from "../about/scroll-track";
import { CursorGarden, IdeaShelf, MiniGame, PetCorner, Print, PromptShuffle, WindChime } from "./experiments";
import "../about/side-quests.css";
import "./play.css";

// Handwriting face for the annotations, the same one the About page uses.
const hand = Caveat({ variable: "--font-hand", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Play",
  description: "Little apps, odd ideas, and unfinished experiments. A space to play, break things and learn along the way.",
};

const CANVAS = { w: 2200, h: 739 };

/** Position on the canvas, in canvas pixels. On small screens these are ignored and items stack in --o order. */
const at = (x: number, y: number, w: number, h?: number, r = 0, o?: number): CSSProperties =>
  ({ "--x": x, "--y": y, "--w": w, ...(h ? { "--h": h } : {}), "--r": `${r}deg`, ...(o !== undefined ? { "--o": o } : {}) }) as CSSProperties;

/** Number, title and one line for an experiment. */
function Cap({ n, title, blurb, style }: { n: string; title: string; blurb: string; style: CSSProperties }) {
  return (
    <div className="sq-i pl-auto pl-cap" style={style}>
      <p className="mono pl-cap__n">{n} /</p>
      <h2 className="pl-cap__t">{title}</h2>
      <p className="pl-cap__b mono">{blurb}</p>
    </div>
  );
}

function Note({ style, children }: { style: CSSProperties; children: ReactNode }) {
  return <p className="sq-i sq-note pl-hand" style={style}>{children}</p>;
}

function Kao({ text, style }: { text: string; style: CSSProperties }) {
  return <span className="sq-kao sq-i pl-kao" style={style} aria-hidden="true">{text}</span>;
}

/** A hand-drawn arrow. flip mirrors it; r turns it. */
function Arrow({ style, flip = false, up = false }: { style: CSSProperties; flip?: boolean; up?: boolean }) {
  return (
    <svg className={`sq-i sq-doodle pl-arrow${flip ? " pl-arrow--flip" : ""}`} style={style} viewBox="0 0 60 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {up ? (
        <>
          <path d="M54 50 C 22 50, 6 34, 10 8" />
          <path d="M2 18 L10 6 L20 15" />
        </>
      ) : (
        <>
          <path d="M6 4 C 4 26, 20 44, 48 48" />
          <path d="M38 38 L49 48 L36 54" />
        </>
      )}
    </svg>
  );
}

function Flower({ style, size = 40 }: { style: CSSProperties; size?: number }) {
  return (
    <svg className="sq-i sq-doodle pl-flower" style={style} width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M32 31c-9-3-14-13-8-19 5-5 12-2 13 4 3-6 11-8 16-3 5 6 0 15-9 18 8 1 12 9 7 15-5 5-13 3-16-3-2 7-10 10-16 5-5-5-2-13 6-15-4-1-6-1-8-2" />
      <circle cx="32" cy="32" r="3.2" />
    </svg>
  );
}

function Star({ style, size = 26 }: { style: CSSProperties; size?: number }) {
  return (
    <svg className="sq-i sq-doodle pl-star" style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" />
    </svg>
  );
}

const Scrap = ({ style }: { style: CSSProperties }) => <div className="sq-i pl-deco pl-scrap" style={style} aria-hidden="true" />;
const Tape = ({ style }: { style: CSSProperties }) => <div className="sq-i pl-deco pl-tape" style={style} aria-hidden="true" />;

const A = ASSETS;

export default function Play() {
  return (
    <div className={`sq pl ${hand.variable}`}>
      <ScrollTrack width={CANVAS.w} height={CANVAS.h} xMin={70} xMax={2165} path="/play">
        <div className="sq-canvas">
          {/* Introduction */}
          <section className="sq-i pl-auto pl-intro" style={at(74, 16, 340, 0, 0, 0)} aria-label="Introduction">
            <p className="mono pl-lab">PLAY / EXPERIMENTS</p>
            <h1 className="pl-h1">A few things<br />I wanted to try.</h1>
            <p className="pl-lede">Little apps, odd ideas, and unfinished experiments. A space to play, break things and learn along the way.</p>
            <ul className="pl-list mono">
              <li><span aria-hidden="true">&rarr;</span>interactive toys</li>
              <li><span aria-hidden="true">&rarr;</span>mini tools</li>
              <li><span aria-hidden="true">&rarr;</span>random ideas</li>
              <li><span aria-hidden="true">&rarr;</span>works in progress</li>
            </ul>
          </section>
          <Flower style={at(372, 304, 40)} />

          {/* 01 Cursor Garden */}
          <Cap n="01" title="Cursor Garden" blurb="A playful cursor toy that grows little shapes as you move around." style={at(521, 30, 270, 0, 0, 10)} />
          <Print src="/play/daisies.jpg" alt="A field of white daisies with yellow centres in the sun" pos="center" caption="daisies" className="sq-i sq-photo sq-small pl-art" style={at(462, 159, 96, 200, -4, 12)} />
          <Scrap style={at(886, 270, 62, 76, 0)} />
          <div className="sq-i pl-sheet pl-art pl-garden-card" style={at(537, 138, 378, 218, -2, 11)}>
            <CursorGarden />
          </div>
          <Tape style={at(822, 124, 62, 24, 8)} />
          <p className="sq-i pl-slip pl-deco" style={at(736, 280, 174, 70, -3)}>a little garden<br />for my cursor<br /><span className="sq-kao" aria-hidden="true">(˶ᵔ ᵕ ᵔ˶)</span></p>
          <Note style={at(713, 8, 110, 0, -8)}>move around<br />and see what<br />grows...</Note>
          <Kao text="(„'▽'„)" style={at(840, 30, 80, 0, 0)} />
          <Arrow style={at(774, 86, 44, 0, 0)} />

          {/* 02 Prompt Shuffle */}
          <Cap n="02" title="Prompt Shuffle" blurb="A daily nudge generator for ideas, reflections, or random thoughts." style={at(1029, 34, 215, 0, 0, 20)} />
          <Print src="/play/plant.jpg" alt="A trailing pothos plant on a wooden bookshelf in window light" pos="center 30%" caption="window plant" className="sq-i sq-photo sq-small pl-art" style={at(1226, 78, 128, 184, 3, 22)} />
          <div className="sq-i pl-art pl-shuffle" style={at(1050, 172, 238, 184, 0, 21)}>
            <PromptShuffle />
          </div>
          <Note style={at(1362, 268, 110, 0, -7)}>shuffle<br />for a new<br />prompt !</Note>
          <Kao text="(๑>ᴗ<๑)ﾉ" style={at(1366, 346, 90, 0, -5)} />
          <Arrow style={at(1304, 294, 40, 0, 0)} flip />

          {/* 03 Mini Games */}
          <Cap n="03" title="Mini Games" blurb="Small games, big curiosity." style={at(1570, 20, 140, 0, 0, 40)} />
          <Tape style={at(1890, 126, 48, 18, -4)} />
          <div className="sq-i pl-art pl-chime" style={at(1886, 134, 58, 146, 0, 42)}>
            <WindChime />
          </div>
          <div className="sq-i pl-art pl-window pl-window--game" style={at(1560, 126, 312, 202, 0, 41)}>
            <MiniGame />
          </div>
          <p className="sq-i pl-slip pl-deco" style={at(1730, 310, 160, 62, 2)}>a collection<br />of tiny games<br /><span className="sq-kao" aria-hidden="true">(｡•ᴗ•｡)</span></p>
          <Star style={at(1970, 208, 24)} />
          <Star style={at(1530, 328, 18)} size={18} />

          {/* 04 Photo Logs */}
          <Cap n="04" title="Photo Logs" blurb="A visual diary of places, people, and little moments." style={at(75, 490, 130, 0, 0, 50)} />
          <Print src="/play/streetlight.jpg" alt="A blurred evening drive past a glowing streetlight and trees against an orange sunset" pos="center" caption="evening drive" className="sq-i sq-photo sq-big pl-art" style={at(207, 429, 150, 215, -3, 51)} />
          <Print src="/play/sunset.jpg" alt="A dark ring of an eclipse in an orange sunset sky above a valley with town lights" pos="center" caption="sunset" className="sq-i sq-photo sq-small pl-art" style={at(352, 453, 150, 200, 5, 52)} />
          <Tape style={at(416, 445, 56, 22, 8)} />
          <Tape style={at(170, 436, 82, 24, -9)} />
          <Note style={at(352, 660, 120, 0, -8)}>just<br />photos i like</Note>
          <Kao text="(ᵔ◡ᵔ) ♡" style={at(372, 720, 100, 0, -6)} />
          <Arrow style={at(296, 638, 46, 0, 0)} up />

          {/* 05 Idea Shelf */}
          <Cap n="05" title="Idea Shelf" blurb="A collection of half-baked ideas, saved for later." style={at(599, 429, 230, 0, 0, 60)} />
          <Scrap style={at(790, 513, 86, 90, 0)} />
          <div className="sq-i pl-art pl-pad" style={at(596, 545, 270, 138, -1, 61)}>
            <span className="pl-pad__s pl-pad__s--b" aria-hidden="true" />
            <span className="pl-pad__s" aria-hidden="true" />
            <svg className="pl-clip" viewBox="0 0 16 40" width="16" height="40" fill="none" stroke="var(--muted-foreground)" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true"><path d="M5 30 V8 a4 4 0 0 1 8 0 V32 a6 6 0 0 1 -12 0 V12" /></svg>
            <IdeaShelf />
          </div>
          <p className="sq-i pl-slip pl-deco" style={at(890, 615, 176, 74, -6)}>not all of these<br />will happen<br />and that&rsquo;s okay<br /><span className="sq-kao" aria-hidden="true">(- ‿ -)</span></p>
          <Note style={at(908, 479, 100, 0, -6)}>ideas<br />that might<br />be something<br />someday</Note>

          {/* 06 Pet Corner */}
          <Cap n="06" title="Pet Corner" blurb="A small, playful space for little creatures. Watch them roam, react, and keep you company." style={at(1210, 484, 200, 0, 0, 70)} />
          <Scrap style={at(1372, 652, 96, 76, 0)} />
          <div className="sq-i pl-sheet pl-art pl-pets-card" style={at(1420, 452, 540, 280, -1, 71)}>
            <PetCorner />
          </div>
          <Tape style={at(1660, 436, 70, 22, 4)} />
          <Flower style={at(1950, 544, 36)} size={36} />
          <Flower style={at(1380, 684, 36)} size={36} />
          <Note style={at(2014, 540, 110, 0, -8)}>a tiny<br />world to<br />play in</Note>
          <Kao text="(˶'ᵕ'˶)" style={at(2030, 624, 80, 0, -4)} />
          <Arrow style={at(1966, 568, 40, 0, 0)} flip />
        </div>
      </ScrollTrack>
    </div>
  );
}
