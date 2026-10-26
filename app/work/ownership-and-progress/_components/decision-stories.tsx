"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

const SRC = "/work/ownership-and-progress/media";

type Shot = { name: string; w: number; h: number; alt: string; cap: string; tag?: string };

function Fig({ name, w, h, alt, cap, tag }: Shot) {
  return (
    <figure className="cs-fig cs-ds__fig">
      {tag ? <span className="cs-ds__tag mono">{tag}</span> : null}
      <a className="cs-ds__img" href={`${SRC}/${name}.jpg`} target="_blank" rel="noopener" aria-label={`Open larger: ${alt}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${SRC}/${name}.jpg`} width={w} height={h} alt={alt} loading="lazy" decoding="async" />
      </a>
      <figcaption>{cap}</figcaption>
    </figure>
  );
}

/** One decision: text on the left as a short chain (tension, decision, why), evidence on the right. */
function Decision({ label, title, tension, decision, why, small, children }: {
  small?: boolean; label: string; title: string; tension: ReactNode; decision: ReactNode; why: ReactNode; children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add("is-in");
    if (typeof IntersectionObserver === "undefined") { show(); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { show(); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <article ref={ref} className="cs-ds">
      <div className="cs-ds__body">
        <header className="cs-ds__head">
          <span className="mono">{label}</span>
          <h3>{title}</h3>
        </header>
        <ol className="cs-lnk">
          <li><span className="mono">The tension</span><p>{tension}</p></li>
          <li className="is-key"><span className="mono">The decision</span><p>{decision}</p></li>
          <li><span className="mono">Why it matters</span><p>{why}</p></li>
        </ol>
      </div>
      <div className={`cs-ds__vis${small ? " cs-ds__vis--sm" : ""}`}>{children}</div>
    </article>
  );
}

export function DecisionStories() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => { root.current?.setAttribute("data-armed", ""); }, []);
  return (
    <div className="cs-ds-list" ref={root}>
      <Decision
        label="01 / Entry" title="Start from what the client needs, not how it is made"
        tension="The first version opened on a blank prompt with two modes, Creative and AI Generate, before the client had said what they needed."
        decision={<>The first choice is now <em>the kind of work</em>, Creative or Deck, described in plain words. How it gets made is decided later, on the finished brief.</>}
        why="A client can describe a request without knowing how it will be produced, and the same brief can still go either route."
      >
        <Fig tag="First version" name="ph1-entry" w={1400} h={700} alt="The first version's entry screen, What are we making today, with Creative and AI Generate tabs, a free prompt, Aspect ratio, Attach image and Create." cap="Two modes first, then a free prompt." />
        <span className="cs-vis__arrow" aria-hidden="true" />
        <Fig tag="Current version" name="now-entry" w={720} h={440} alt="The current entry screen, Tell us what you need, with Creative and Deck tabs and a plain-language request." cap="Creative or Deck first, then the request in plain words." />
      </Decision>

      <Decision
        label="02 / Intake" title="Flag the gaps, never block the client"
        tension="A thin brief can lead to the wrong creative, but asking for every detail up front makes filing a brief feel like work."
        decision={<>The PM agent, the AI that coordinates each brief, points out important gaps and <em>explains why they matter</em>. The client can fix or dismiss each one. The agent never blocks the client, a rule I agreed with the product lead. A gap left open becomes a known flag. The flag holds production, and the client is asked about it again once the brief is submitted.</>}
        why="Important context is collected without a long form, and the client is never stuck at submission. The flag stops a gap from slipping into production unnoticed."
      >
        <Fig name="do-brief-out" w={694} h={710} alt="The prefilled brief card: request context, deadline, creative type, primary size and a reference image, with the copy, creative direction and other sizes marked Not provided." cap="What the client did not say stays “Not provided”, not guessed." />
      </Decision>

      <Decision
        label="03 / Ownership" title="Give every brief one designer"
        small
        tension="In the first version, anyone on the review desk could pick themselves to take a brief."
        decision={<>Ownpath assigns <em>one designer to each brief</em> from a shared queue. Designers do not pick up work for themselves.</>}
        why="Every brief has one accountable owner, so the client always knows who has it."
      >
        <Fig tag="First version" name="ph1-assign" w={1200} h={640} alt="The first version's review desk: Who should handle this review, with a dropdown and an Assign reviewer button. Choose yourself to take the ticket and open the request immediately." cap="Anyone could take the ticket." />
        <span className="cs-vis__arrow" aria-hidden="true" />
        <Fig tag="Current version" name="queue" w={1600} h={967} alt="The Ownpath queue: In queue, Assigned, In production, Waiting on client and Done, with Assign a designer on unassigned briefs." cap="Ownpath assigns from the queue." />
      </Decision>

      <Decision
        label="04 / Versions" title="Give every direction a version, and approve one"
        small
        tension="In the first version a generated image lived in a chat. Changing it meant another message, and the new image landed in the thread."
        decision={<>Every design option the AI generates (a direction) and every edit is now <em>a numbered version</em> on the canvas. A version is what gets sent to a designer or approved.</>}
        why="Feedback and approval point at an exact version, so nobody approves a creative that has since changed."
      >
        <Fig tag="First version" name="ph1-edit" w={1200} h={592} alt="The first version's chat: a generated badminton poster, then a message asking to change the primary brand colour from purple to bright yellow." cap="To change an image, ask again in the chat." />
        <span className="cs-vis__arrow" aria-hidden="true" />
        <Fig tag="Current version" name="canvas-versions" w={1400} h={818} alt="The current canvas beside the chat: Direction 1 v1 and Direction 2 v2 as numbered versions, with the brief and chat on the right." cap="Directions on the canvas, each a numbered version, beside the chat." />
      </Decision>
    </div>
  );
}
