export type CoverVariant = "question" | "blueprint" | "dots" | "spark" | "ascent" | "clara";

const ROWS = [
  [1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 1, 1],
];
const AGENT = [1, 0, 1, 0, 1, 1, 1];

/** Code-drawn covers for cards. Brand tokens only. */
export function CoverArt({ variant }: { variant: CoverVariant }) {
  if (variant === "question") {
    return (
      <span className="cover cover--question">
        <span className="mono">PM agent · behaviour design</span>
        <b>When should the AI speak<i>?</i></b>
      </span>
    );
  }
  if (variant === "blueprint") {
    return (
      <span className="cover cover--blueprint">
        {[...ROWS, AGENT].map((row, r) => (
          <span key={r} className={r === 2 ? "cover__row is-agent" : "cover__row"}>
            {row.map((on, i) => <i key={i} className={on ? "on" : ""} />)}
          </span>
        ))}
      </span>
    );
  }
  if (variant === "ascent") {
    return (
      <span className="cover cover--ascent" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cover__plan" src="/media/ascent-plan.jpg" alt="" loading="lazy" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cover__list" src="/media/ascent-list.jpg" alt="" loading="lazy" />
      </span>
    );
  }
  if (variant === "clara") {
    return (
      <span className="cover cover--clara" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/clara-cover-2.jpg" alt="" loading="lazy" />
      </span>
    );
  }
  if (variant === "spark") {
    return (
      <span className="cover cover--spark" aria-hidden="true">
        <svg viewBox="0 0 120 120" className="cover__star">
          <path d="M60 8 C64 40 80 56 112 60 C80 64 64 80 60 112 C56 80 40 64 8 60 C40 56 56 40 60 8 Z" />
        </svg>
        <svg viewBox="0 0 40 40" className="cover__star cover__star--small">
          <path d="M20 4 C21.5 14 26 18.5 36 20 C26 21.5 21.5 26 20 36 C18.5 26 14 21.5 4 20 C14 18.5 18.5 14 20 4 Z" />
        </svg>
      </span>
    );
  }
  return (
    <span className="cover cover--dots" aria-hidden="true">
      <span className="cover__bubble">
        <span className="cover__dots">
          <i /><i />
          <span className="cover__last"><u /><em>?</em></span>
        </span>
      </span>
    </span>
  );
}
